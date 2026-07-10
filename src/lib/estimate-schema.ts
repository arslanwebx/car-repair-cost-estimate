import { z } from "zod";

export const damageAreas = ["front_bumper", "rear_bumper", "hood", "roof", "trunk", "left_front_fender", "right_front_fender", "left_front_door", "right_front_door", "left_rear_door", "right_rear_door", "left_quarter_panel", "right_quarter_panel", "rocker_panel", "grille", "headlight", "taillight", "side_mirror", "windshield", "side_glass", "wheel", "undercarriage", "multiple", "other"] as const;
export const damageTypes = ["scratch", "paint_transfer", "paint_chip", "scuff", "small_dent", "deep_dent", "crease", "crack", "puncture", "torn_bumper", "misaligned_panel", "broken_light", "broken_mirror", "hail", "glass", "collision", "unknown"] as const;

export const estimateInputSchema = z.object({
  vehicle: z.object({
    year: z.number().int().min(1981).max(new Date().getFullYear() + 1),
    make: z.string().trim().min(1).max(60),
    model: z.string().trim().min(1).max(80),
    bodyStyle: z.enum(["sedan", "coupe", "hatchback", "suv", "crossover", "pickup", "van", "minivan", "sports", "luxury", "other"]),
    mileage: z.enum(["under_25k", "25k_50k", "50k_100k", "100k_150k", "over_150k"]),
    trim: z.string().trim().max(80).optional(),
    fuelType: z.enum(["gas", "diesel", "hybrid", "electric", "other"]).optional()
  }),
  damage: z.object({
    areas: z.array(z.enum(damageAreas)).min(1).max(12),
    types: z.array(z.enum(damageTypes)).min(1).max(10),
    description: z.string().trim().min(10).max(1500),
    safeToDrive: z.enum(["yes", "no", "unsure"]),
    fluidsLeaking: z.boolean(),
    airbagsDeployed: z.boolean()
  }),
  preferences: z.object({
    zipCode: z.string().regex(/^\d{5}$/),
    parts: z.enum(["economical", "aftermarket", "recycled_oem", "new_oem", "all"]),
    deductible: z.number().min(0).max(10000).optional()
  })
});

export const visionAnalysisSchema = z.object({
  vehiclePresent: z.boolean(),
  damageVisible: z.boolean(),
  imageQuality: z.enum(["sufficient", "limited", "insufficient"]),
  observations: z.array(z.object({
    area: z.enum(damageAreas),
    damageTypes: z.array(z.enum(damageTypes)),
    severity: z.enum(["minor", "moderate", "severe"]),
    operation: z.enum(["repair", "replace", "inspect"]),
    paintDamage: z.boolean(),
    alignmentConcern: z.boolean(),
    confidence: z.number().min(0).max(1)
  })).max(16),
  possibleAdasInvolvement: z.boolean(),
  hiddenDamageRisk: z.enum(["low", "moderate", "high"]),
  inPersonInspectionStronglyRecommended: z.boolean(),
  confidence: z.number().min(0).max(1),
  lowConfidenceReasons: z.array(z.string().max(240)).max(8),
  requiredAdditionalAngles: z.array(z.string().max(240)).max(8)
});

export type EstimateInput = z.infer<typeof estimateInputSchema>;
export type VisionAnalysis = z.infer<typeof visionAnalysisSchema>;
