import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { estimateInputSchema } from "@/lib/estimate-schema";
import { calculateEstimate } from "@/lib/pricing";
import { analyzeDamage, AnalysisUnavailableError, InadequatePhotosError } from "@/lib/ai/provider";
import { takeRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
const allowed = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const rate = takeRateLimit(ip);
  if (!rate.allowed) return NextResponse.json({ error: "Too many estimate attempts. Please try again later." }, { status: 429, headers: { "Retry-After": String(rate.retryAfter) } });
  try {
    const data = await request.formData();
    const raw = data.get("input");
    if (typeof raw !== "string") return NextResponse.json({ error: "Estimate details are missing." }, { status: 400 });
    const input = estimateInputSchema.parse(JSON.parse(raw));
    const files = data.getAll("photos").filter((v): v is File => v instanceof File);
    if (files.length < 3 || files.length > 8) return NextResponse.json({ error: "Upload between 3 and 8 photos." }, { status: 400 });
    const images = await Promise.all(files.map(async (file) => {
      if (!allowed.has(file.type) || file.size > 10 * 1024 * 1024) throw new Error("Each photo must be JPG, PNG, or WebP and no larger than 10 MB.");
      const source = Buffer.from(await file.arrayBuffer());
      const metadata = await sharp(source).metadata();
      if (!metadata.width || !metadata.height) throw new Error("One of the uploaded files is not a readable image.");
      const sanitized = await sharp(source).rotate().resize({ width: 1800, height: 1800, fit: "inside", withoutEnlargement: true }).jpeg({ quality: 84 }).toBuffer();
      return { mime: "image/jpeg", base64: sanitized.toString("base64") };
    }));
    const vision = await analyzeDamage(input, images);
    const estimate = calculateEstimate(input, vision);
    return NextResponse.json({ id: `CSP-${Date.now().toString(36).toUpperCase()}`, generatedAt: new Date().toISOString(), input, vision, estimate });
  } catch (error) {
    if (error instanceof InadequatePhotosError) return NextResponse.json({ error: error.message, guidance: error.guidance }, { status: 422 });
    if (error instanceof AnalysisUnavailableError) return NextResponse.json({ error: "AI analysis is temporarily unavailable. Your details remain in this browser so you can retry." }, { status: 503 });
    const message = error instanceof Error && !error.message.includes("JSON") ? error.message : "The submission could not be validated.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
