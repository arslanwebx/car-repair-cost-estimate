import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { visionAnalysisSchema, type EstimateInput, type VisionAnalysis } from "@/lib/estimate-schema";

export class AnalysisUnavailableError extends Error {}
export class InadequatePhotosError extends Error {
  constructor(public readonly guidance: string[]) { super("The photos are not adequate for an estimate."); }
}

const systemPrompt = `You classify only visible exterior vehicle damage for an informational repair estimate. Return JSON only. Never state hidden, structural, mechanical, suspension, electrical, restraint, or safety conditions as confirmed. Use conservative observations, flag uncertainty, and request better angles when needed. Dollar amounts are forbidden.`;

export async function analyzeDamage(input: EstimateInput, images: Array<{ mime: string; base64: string }>): Promise<VisionAnalysis> {
  const key = process.env.AI_API_KEY;
  if (!key) throw new AnalysisUnavailableError("AI analysis is not configured.");
  if ((process.env.AI_PROVIDER ?? "openai") !== "openai") throw new AnalysisUnavailableError("Configured AI provider is not supported by this deployment.");
  const client = new OpenAI({ apiKey: key, timeout: 45_000, maxRetries: 1 });
  const response = await client.responses.parse({
    model: process.env.AI_VISION_MODEL ?? "gpt-5.4-mini",
    store: false,
    input: [{
      role: "user",
      content: [
        { type: "input_text", text: `${systemPrompt}\nAnalyze every supplied image as one combined photo set. Deduplicate the same damage seen from multiple angles. Compare visible findings with the user selections, but report what is actually visible and express uncertainty. First decide whether each image is usable, whether a vehicle is present, and whether damage is visible.\nUser-reported details:\n${JSON.stringify(input)}\nReturn fields matching this shape: vehiclePresent, damageVisible, imageQuality, observations[{area,damageTypes,severity,operation,paintDamage,alignmentConcern,confidence}], possibleAdasInvolvement, hiddenDamageRisk, inPersonInspectionStronglyRecommended, confidence, lowConfidenceReasons, requiredAdditionalAngles.` },
        ...images.map((image) => ({ type: "input_image" as const, image_url: `data:${image.mime};base64,${image.base64}`, detail: "high" as const }))
      ]
    }],
    text: { format: zodTextFormat(visionAnalysisSchema, "visible_vehicle_damage") }
  });
  const result = visionAnalysisSchema.safeParse(response.output_parsed);
  if (!result.success) throw new AnalysisUnavailableError("The analysis response did not pass safety validation.");
  if (!result.data.vehiclePresent || !result.data.damageVisible || result.data.imageQuality === "insufficient") {
    throw new InadequatePhotosError(result.data.requiredAdditionalAngles.length ? result.data.requiredAdditionalAngles : ["Add a wide photo showing the vehicle and the damaged side.", "Add a sharp straight-on photo and close-up of the damage."]);
  }
  return result.data;
}
