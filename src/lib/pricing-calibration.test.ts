import { describe, expect, it } from "vitest";
import { calculateEstimate } from "./pricing";
import type { EstimateInput, VisionAnalysis } from "./estimate-schema";

type Case = {
  name: string;
  input: EstimateInput;
  vision: VisionAnalysis;
  target: { low: number; high: number; average: number };
};

const damageBase: EstimateInput["damage"] = {
  areas: ["rear_bumper"], types: ["dent_with_paint_damage"], description: "Visible collision damage requiring body and refinish operations.", safeToDrive: "yes", fluidsLeaking: false, airbagsDeployed: false
};
const visionBase: Omit<VisionAnalysis, "observations"> = {
  vehiclePresent: true, damageVisible: true, imageQuality: "sufficient", possibleAdasInvolvement: false, hiddenDamageRisk: "moderate", inPersonInspectionStronglyRecommended: false, confidence: .9, lowConfidenceReasons: [], requiredAdditionalAngles: []
};

const cases: Case[] = [
  {
    name: "Dallas Honda Civic rear bumper repair",
    input: { vehicle: { year: 2021, make: "Honda", model: "Civic", bodyStyle: "sedan", mileage: "50k_100k", fuelType: "gas" }, damage: damageBase, preferences: { zipCode: "75201", parts: "all" } },
    vision: { ...visionBase, observations: [{ area: "rear_bumper", damageTypes: ["dent_with_paint_damage"], severity: "moderate", operation: "repair", paintDamage: true, alignmentConcern: false, confidence: .9 }] },
    target: { low: 950, high: 1600, average: 1250 }
  },
  {
    name: "Chicago Ford F-150 fender repair",
    input: { vehicle: { year: 2019, make: "Ford", model: "F-150", bodyStyle: "pickup", mileage: "50k_100k", fuelType: "gas" }, damage: { ...damageBase, areas: ["left_front_fender"], types: ["deep_dent", "dent_with_paint_damage"] }, preferences: { zipCode: "60601", parts: "all" } },
    vision: { ...visionBase, observations: [{ area: "left_front_fender", damageTypes: ["deep_dent", "dent_with_paint_damage"], severity: "moderate", operation: "repair", paintDamage: true, alignmentConcern: false, confidence: .9 }] },
    target: { low: 2000, high: 3400, average: 2650 }
  },
  {
    name: "Los Angeles Toyota Camry bumper and grille replacement",
    input: { vehicle: { year: 2020, make: "Toyota", model: "Camry", bodyStyle: "sedan", mileage: "50k_100k", fuelType: "gas" }, damage: { ...damageBase, areas: ["front_bumper", "grille"], types: ["torn_bumper", "collision"], sensorConcern: true }, preferences: { zipCode: "90012", parts: "new_oem" } },
    vision: { ...visionBase, confidence: .7, possibleAdasInvolvement: true, observations: [{ area: "front_bumper", damageTypes: ["torn_bumper", "collision"], severity: "severe", operation: "replace", paintDamage: true, alignmentConcern: true, confidence: .75 }, { area: "grille", damageTypes: ["collision"], severity: "severe", operation: "replace", paintDamage: false, alignmentConcern: true, confidence: .7 }] },
    target: { low: 3000, high: 5400, average: 4100 }
  },
  {
    name: "Miami Tesla Model 3 door replacement scenario",
    input: { vehicle: { year: 2022, make: "Tesla", model: "Model 3", bodyStyle: "luxury", mileage: "25k_50k", fuelType: "electric" }, damage: { ...damageBase, areas: ["left_front_door"], types: ["deep_dent", "crease", "dent_with_paint_damage"], sensorConcern: true }, preferences: { zipCode: "33130", parts: "new_oem" } },
    vision: { ...visionBase, possibleAdasInvolvement: true, observations: [{ area: "left_front_door", damageTypes: ["deep_dent", "crease", "dent_with_paint_damage"], severity: "severe", operation: "replace", paintDamage: true, alignmentConcern: false, confidence: .9 }] },
    target: { low: 4800, high: 7800, average: 6100 }
  }
];

describe("2026 retail calibration references", () => {
  for (const reference of cases) it(reference.name, () => {
    const result = calculateEstimate(reference.input, reference.vision);
    expect(Math.abs(result.mid-reference.target.average)/reference.target.average).toBeLessThan(.1);
    expect(result.total.low).toBeLessThanOrEqual(reference.target.average);
    expect(result.total.high).toBeGreaterThanOrEqual(reference.target.average);
    expect(result.pricingVersion).toBe("US-2026.07-v3");
  });
});
