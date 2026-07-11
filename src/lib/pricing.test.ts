import { describe, expect, it } from "vitest";
import { calculateEstimate } from "./pricing";
import type { EstimateInput, VisionAnalysis } from "./estimate-schema";

const input: EstimateInput = { vehicle: { year: 2020, make: "Toyota", model: "Camry", bodyStyle: "sedan", mileage: "50k_100k", fuelType: "gas" }, damage: { areas: ["rear_bumper"], types: ["scuff", "small_dent"], description: "Rear bumper was scraped while parked.", safeToDrive: "yes", fluidsLeaking: false, airbagsDeployed: false }, preferences: { zipCode: "75201", parts: "all" } };
const vision: VisionAnalysis = { vehiclePresent: true, damageVisible: true, imageQuality: "sufficient", observations: [{ area: "rear_bumper", damageTypes: ["scuff", "small_dent"], severity: "minor", operation: "repair", paintDamage: true, alignmentConcern: false, confidence: 0.9 }], possibleAdasInvolvement: false, hiddenDamageRisk: "low", inPersonInspectionStronglyRecommended: false, confidence: 0.9, lowConfidenceReasons: [], requiredAdditionalAngles: [] };

describe("calculateEstimate", () => {
  it("builds low and high totals from line items", () => {
    const result = calculateEstimate(input, vision);
    expect(result.total.high).toBeGreaterThan(result.total.low);
    expect(result.items[0].area).toBe("rear_bumper");
    expect(result.pricingVersion).toMatch(/^US-/);
    expect(result.market).toContain("Texas");
    expect((result.total.high-result.total.low)/result.mid).toBeLessThanOrEqual(.25);
  });
  it("adds calibration when ADAS may be involved", () => {
    const normal = calculateEstimate(input, vision);
    const adas = calculateEstimate(input, { ...vision, possibleAdasInvolvement: true });
    expect(adas.scanCalibration.low).toBeGreaterThan(normal.scanCalibration.low);
  });
  it("uses each observation confidence instead of one broad catalog band", () => {
    const confident = calculateEstimate(input, vision);
    const limited = calculateEstimate(input, { ...vision, observations: [{ ...vision.observations[0], confidence: .4 }] });
    expect(limited.total.high-limited.total.low).toBeGreaterThan(confident.total.high-confident.total.low);
  });
});
