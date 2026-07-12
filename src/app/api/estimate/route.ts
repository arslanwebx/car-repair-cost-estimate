import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { estimateInputSchema } from "@/lib/estimate-schema";
import { calculateEstimate } from "@/lib/pricing";
import { analyzeDamage, AnalysisUnavailableError, InadequatePhotosError } from "@/lib/ai/provider";
import { takeRateLimit } from "@/lib/rate-limit";
import { randomUUID } from "node:crypto";
import { createUserInputAnalysis } from "@/lib/manual-analysis";
import { withConcurrencyLimit, WorkloadBusyError } from "@/lib/concurrency";

export const runtime = "nodejs";
const allowed = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const rate = takeRateLimit(ip);
  if (!rate.allowed) return NextResponse.json({ error: "Too many estimate attempts. Please try again later." }, { status: 429, headers: { "Retry-After": String(rate.retryAfter) } });
  try {
    return await withConcurrencyLimit("estimate-requests", 2, async () => {
    const data = await request.formData();
    const raw = data.get("input");
    if (typeof raw !== "string") return NextResponse.json({ error: "Estimate details are missing." }, { status: 400 });
    const input = estimateInputSchema.parse(JSON.parse(raw));
    const confirmedContradiction = data.get("confirmedContradiction") === "true";
    const files = data.getAll("photos").filter((v): v is File => v instanceof File);
    if (files.length < 1 || files.length > 10) return NextResponse.json({ error: "Upload between 1 and 10 photos." }, { status: 400 });
    if (files.some(file => !allowed.has(file.type) || file.size > 10 * 1024 * 1024)) throw new Error("Each photo must be JPG, PNG, or WebP and no larger than 10 MB.");
    if (files.reduce((total, file) => total + file.size, 0) > 50 * 1024 * 1024) throw new Error("The combined photo upload must be no larger than 50 MB.");
    const images = await withConcurrencyLimit("estimate-image-processing", 2, async () => {
      const sanitizedImages: Array<{ mime: string; base64: string }> = [];
      for (const file of files) {
        if (request.signal.aborted) throw new DOMException("The request was cancelled.", "AbortError");
        const source = Buffer.from(await file.arrayBuffer());
        const image = sharp(source, { limitInputPixels: 40_000_000, sequentialRead: true }).timeout({ seconds: 15 }).rotate();
        const metadata = await image.metadata();
        if (!metadata.width || !metadata.height) throw new Error("One of the uploaded files is not a readable image.");
        const sanitized = await image.resize({ width: 1800, height: 1800, fit: "inside", withoutEnlargement: true }).jpeg({ quality: 84 }).toBuffer();
        sanitizedImages.push({ mime: "image/jpeg", base64: sanitized.toString("base64") });
      }
      return sanitizedImages;
    });
    let analysisMode: "ai" | "user_input_fallback" = "ai";
    let vision;
    try { vision = await analyzeDamage(input, images, request.signal); }
    catch (error) {
      if (!(error instanceof AnalysisUnavailableError)) throw error;
      vision = createUserInputAnalysis(input);
      analysisMode = "user_input_fallback";
    }
    const selectedAreas = input.damage.areas.filter(area => area !== "multiple" && area !== "other");
    const observedAreas = [...new Set(vision.observations.map(item => item.area).filter(area => area !== "multiple" && area !== "other"))];
    const selectedTypes = new Set(input.damage.types);
    const observedTypes = new Set(vision.observations.flatMap(item => item.damageTypes));
    const areaOverlap = observedAreas.some(area => selectedAreas.includes(area));
    const typeOverlap = [...observedTypes].some(type => selectedTypes.has(type));
    if (!confirmedContradiction && ((!areaOverlap && selectedAreas.length && observedAreas.length) || (!typeOverlap && observedTypes.size))) {
      return NextResponse.json({ error: "The visible findings do not fully match your damage selections. Please confirm before pricing continues.", contradiction: { selectedAreas: input.damage.areas, observedAreas, message: !areaOverlap ? "The photos appear to show a different damaged area than the one selected." : "The visible damage type differs from the selected damage type." } }, { status: 409 });
    }
    const estimate = calculateEstimate(input, vision);
    if (!estimate.items.length || estimate.total.low < 0 || estimate.total.high <= estimate.total.low || !estimate.pricingVersion) throw new Error("Report validation failed.");
    return NextResponse.json({ id: `${analysisMode === "ai" ? "CSP" : "CSP-M"}-${Date.now().toString(36).toUpperCase()}`, generatedAt: new Date().toISOString(), analysisMode, input, vision, estimate });
    });
  } catch (error) {
    const errorId = `CSP-E-${randomUUID().slice(0, 8).toUpperCase()}`;
    console.error("Carspect estimate failure", { errorId, type: error instanceof Error ? error.name : "UnknownError", message: error instanceof Error ? error.message : "Unknown failure" });
    if (error instanceof InadequatePhotosError) return NextResponse.json({ error: `The photos are not clear enough for a reliable estimate. ${error.guidance.join(" ")}`, guidance: error.guidance, errorId }, { status: 422 });
    if (error instanceof WorkloadBusyError) return NextResponse.json({ error: "The image processor is busy. Please wait a moment and try again.", errorId }, { status: 503, headers: { "Retry-After": "5" } });
    if (error instanceof AnalysisUnavailableError || error instanceof OpenAIError) return NextResponse.json({ error: "We could not complete the photo analysis right now. Your vehicle details and photos are still available. Try the analysis again, or update your photos before resubmitting.", errorId }, { status: 503 });
    const message = error instanceof Error && !error.message.includes("JSON") ? error.message : "The submission could not be validated. Review the form and try again.";
    return NextResponse.json({ error: message, errorId }, { status: message === "Report validation failed." ? 500 : 400 });
  }
}

class OpenAIError extends Error {
  static [Symbol.hasInstance](value: unknown) { return value instanceof Error && ["APIError", "APIConnectionError", "APIConnectionTimeoutError", "RateLimitError", "InternalServerError"].includes(value.name); }
}
