import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { visionAnalysisSchema, type EstimateInput, type VisionAnalysis } from "@/lib/estimate-schema";

export class AnalysisUnavailableError extends Error {}
export class InadequatePhotosError extends Error {
  constructor(public readonly guidance: string[]) { super("The photos are not adequate for an estimate."); }
}

const systemPrompt = `You are the visual classification stage of an automotive body-repair estimator. Classify only visible exterior damage; a separate deterministic engine calculates all prices. Return JSON only and never provide dollar amounts.

Apply these rules consistently:
- Create one observation per visibly affected repair area. Merge duplicate views of the same damage and never create a generic "multiple" observation when named panels can be identified.
- Assign damage types separately to each observation. Never copy a global damage type such as broken mirror, torn bumper, or glass damage onto an unrelated panel.
- Minor: cosmetic scuff, paint transfer, shallow scratch, or small accessible dent with no visible distortion at a panel edge.
- Moderate: deep scratch through color, repairable dent or crease, localized plastic deformation, or a repairable crack.
- Severe: torn/missing material, extensive folding, crushed panel, broken assembly, or damage for which replacement is visibly more probable than repair.
- Choose replace only when the photographed component is broken, torn, punctured, missing, severely folded, or clearly beyond normal repair. Otherwise choose repair. Choose inspect when the image cannot support that decision.
- For doors, choose replacement when broad crush damage, multiple sharp folds, torn seams, displaced hinges/latches, a visibly compromised intrusion-beam zone, or deformation across most of the shell makes ordinary metal repair improbable. A deeply crushed door is not a routine dent repair.
- damageExtent is localized for a small isolated defect, panel_section when a meaningful portion is affected, and most_of_panel when deformation crosses most of the component or several character lines.
- openingOrIntrusionConcern is true when an opening is visibly distorted, gaps are displaced, a door/hood/lid is jammed or displaced, or the impact is in an occupant-intrusion zone. It signals measurement and inspection need, not confirmed hidden structure damage.
- Include each separately damaged visible component, including a mirror, rocker/sill, adjacent quarter/fender, lamp, wheel, or glass. Do not hide them inside a door observation.
- paintDamage is true only when the finish is visibly removed, cracked, deeply scratched, or clearly requires refinishing; paint transfer alone is not proof of substrate damage.
- alignmentConcern means visible inconsistent gaps, displacement, buckling at an opening, or a component no longer seated. It never confirms frame damage.
- Mark ADAS involvement possible only when damage is at a bumper sensor/radar zone, camera mirror, or camera windshield area, or the user reports a sensor concern.
- Overall confidence must not exceed the least-supported material observation. Use limited/insufficient image quality when glare, blur, darkness, crop, distance, or missing context prevents reliable classification.
- Never state hidden, structural, mechanical, suspension, electrical, restraint, or safety conditions as confirmed. Flag uncertainty and request the exact missing angle instead.`;

let sharedClient: { apiKey: string; client: OpenAI } | undefined;

function getClient(apiKey: string) {
  if (!sharedClient || sharedClient.apiKey !== apiKey) {
    sharedClient = { apiKey, client: new OpenAI({ apiKey, timeout: 45_000, maxRetries: 1 }) };
  }
  return sharedClient.client;
}

export async function analyzeDamage(input: EstimateInput, images: Array<{ mime: string; base64: string }>, signal?: AbortSignal): Promise<VisionAnalysis> {
  const key = process.env.AI_API_KEY ?? process.env.OPENAI_API_KEY;
  if (!key) throw new AnalysisUnavailableError("AI analysis is not configured.");
  if ((process.env.AI_PROVIDER ?? "openai") !== "openai") throw new AnalysisUnavailableError("Configured AI provider is not supported by this deployment.");
  const client = getClient(key);
  let response;
  try { response = await client.responses.parse({
    model: process.env.AI_VISION_MODEL ?? "gpt-4o-mini",
    store: false,
    input: [{
      role: "user",
      content: [
        { type: "input_text", text: `${systemPrompt}\nAnalyze every supplied image as one combined photo set. Deduplicate the same damage seen from multiple angles. Compare visible findings with the user selections, but report what is actually visible and express uncertainty. First decide whether each image is usable, whether a vehicle is present, and whether damage is visible.\nUser-reported details:\n${JSON.stringify(input)}\nUse the written description as context, but do not claim a condition that the images do not support. Return fields matching this shape: vehiclePresent, damageVisible, imageQuality, observations[{area,damageTypes,severity,operation,paintDamage,alignmentConcern,damageExtent,openingOrIntrusionConcern,confidence}], possibleAdasInvolvement, hiddenDamageRisk, inPersonInspectionStronglyRecommended, confidence, lowConfidenceReasons, requiredAdditionalAngles.` },
        ...images.map((image) => ({ type: "input_image" as const, image_url: `data:${image.mime};base64,${image.base64}`, detail: "high" as const }))
      ]
    }],
    text: { format: zodTextFormat(visionAnalysisSchema, "visible_vehicle_damage") }
  }, { signal }); } catch (error) {
    if (signal?.aborted) throw signal.reason instanceof Error ? signal.reason : new DOMException("The request was cancelled.", "AbortError");
    throw new AnalysisUnavailableError(error instanceof Error ? error.message : "The AI provider request failed.");
  }
  const result = visionAnalysisSchema.safeParse(response.output_parsed);
  if (!result.success) throw new AnalysisUnavailableError("The analysis response did not pass safety validation.");
  if (!result.data.vehiclePresent || !result.data.damageVisible || result.data.imageQuality === "insufficient") {
    throw new InadequatePhotosError(result.data.requiredAdditionalAngles.length ? result.data.requiredAdditionalAngles : ["Add a wide photo showing the vehicle and the damaged side.", "Add a sharp straight-on photo and close-up of the damage."]);
  }
  return result.data;
}
