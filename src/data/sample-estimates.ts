export type CostRange = { low: number; high: number };
export type SampleEstimate = {
  slug: string;
  title: string;
  vehicle: { year: number; make: string; model: string; bodyStyle: string; fuelType: string };
  location: string;
  zipCode: string;
  image: string;
  imageAlt: string;
  damage: string;
  severity: "Minor" | "Moderate" | "Moderate to severe";
  confidence: "High" | "Moderate";
  confidenceExplanation: string;
  operation: string;
  laborHours: CostRange;
  breakdown: {
    parts: CostRange;
    bodyLabor: CostRange;
    paintLabor: CostRange;
    paintMaterials: CostRange;
    scans: CostRange;
    calibration: CostRange;
    shopSupplies: CostRange;
    tax: CostRange;
    hiddenDamage: CostRange;
  };
  total: CostRange;
  findings: string[];
  increaseFactors: string[];
  reductionFactors: string[];
  nextSteps: string[];
};

export function sumSampleBreakdown(sample: Pick<SampleEstimate, "breakdown">): CostRange {
  return Object.values(sample.breakdown).reduce((total, range) => ({ low: total.low + range.low, high: total.high + range.high }), { low: 0, high: 0 });
}

export const sampleEstimates: SampleEstimate[] = [
  {
    slug: "honda-civic-rear-bumper-dent", title: "Moderate Rear Bumper Dent",
    vehicle: { year: 2021, make: "Honda", model: "Civic", bodyStyle: "Sedan", fuelType: "Gasoline" },
    location: "Dallas, Texas", zipCode: "75201", image: "/images/honda-civic-rear-bumper.webp", imageAlt: "White compact sedan with a moderate rear bumper dent and paint scuffing",
    damage: "Rear bumper dent, paint scuffing, and minor deformation", severity: "Moderate", confidence: "High", confidenceExplanation: "The damaged bumper area and adjacent panels are clearly visible in even lighting.", operation: "Repair and refinish the bumper cover; inspect retainers during removal.", laborHours: { low: 2.4, high: 4.1 },
    breakdown: { parts: { low: 10, high: 35 }, bodyLabor: { low: 120, high: 205 }, paintLabor: { low: 95, high: 145 }, paintMaterials: { low: 60, high: 85 }, scans: { low: 45, high: 65 }, calibration: { low: 0, high: 0 }, shopSupplies: { low: 15, high: 25 }, tax: { low: 15, high: 25 }, hiddenDamage: { low: 20, high: 35 } }, total: { low: 380, high: 620 },
    findings: ["Localized deformation in the rear bumper cover", "Surface scuffing appears to extend through the finish", "No visible taillight or quarter-panel damage", "Retainers cannot be evaluated until the cover is removed"],
    increaseFactors: ["Broken bumper retainers or mounting tabs", "Three-stage or specialty paint finish", "Damage discovered behind the cover"], reductionFactors: ["Paint transfer removes without refinishing", "The cover returns to shape with limited heat repair", "No scan-related fault codes"], nextSteps: ["Ask a repair facility to inspect the bumper retainers", "Confirm paint type and blending needs", "Compare the written shop estimate with this itemized range"]
  },
  {
    slug: "ford-f150-fender-damage", title: "Deep Fender Dent With Paint Damage",
    vehicle: { year: 2019, make: "Ford", model: "F-150", bodyStyle: "Pickup", fuelType: "Gasoline" },
    location: "Chicago, Illinois", zipCode: "60601", image: "/images/ford-f150-fender.webp", imageAlt: "Dark gray pickup with a deep dent and paint damage on the left front fender",
    damage: "Deep left front fender dent with paint damage and possible paint blending", severity: "Moderate", confidence: "High", confidenceExplanation: "The fender profile, paint break, and adjacent panel gaps are visible from a useful angle.", operation: "Repair or replace the fender after measuring; refinish and blend if color match requires it.", laborHours: { low: 3.6, high: 6.2 },
    breakdown: { parts: { low: 35, high: 150 }, bodyLabor: { low: 210, high: 360 }, paintLabor: { low: 145, high: 220 }, paintMaterials: { low: 85, high: 120 }, scans: { low: 45, high: 65 }, calibration: { low: 0, high: 0 }, shopSupplies: { low: 25, high: 40 }, tax: { low: 25, high: 45 }, hiddenDamage: { low: 80, high: 100 } }, total: { low: 650, high: 1100 },
    findings: ["Deep deformation across the left front fender crown", "Paint coating is visibly broken", "Headlight and bumper appear intact in the sample image", "Color blending into the adjacent door or hood may be recommended"], increaseFactors: ["Fender replacement instead of metal repair", "Corrosion found where paint is broken", "Additional blend panels"], reductionFactors: ["Successful conventional metal repair", "No adjacent-panel blending required", "Economical replacement part availability"], nextSteps: ["Protect exposed metal from moisture", "Request both repair and replacement scenarios", "Confirm whether blending is included in a shop quote"]
  },
  {
    slug: "toyota-camry-front-bumper-grille", title: "Front Bumper and Grille Damage",
    vehicle: { year: 2020, make: "Toyota", model: "Camry", bodyStyle: "Sedan", fuelType: "Gasoline" },
    location: "Los Angeles, California", zipCode: "90012", image: "/images/toyota-camry-front.webp", imageAlt: "Silver midsize sedan with front bumper cover, grille, and mounting damage",
    damage: "Front bumper cover damage, grille damage, mounting damage, and possible sensor-area involvement", severity: "Moderate to severe", confidence: "Moderate", confidenceExplanation: "Exterior damage is clear, but mounting structure and sensor condition require disassembly and scanning.", operation: "Replace damaged bumper and grille components; inspect mounts and perform pre- and post-repair scans.", laborHours: { low: 6.2, high: 11.4 },
    breakdown: { parts: { low: 530, high: 980 }, bodyLabor: { low: 260, high: 460 }, paintLabor: { low: 190, high: 320 }, paintMaterials: { low: 115, high: 170 }, scans: { low: 90, high: 140 }, calibration: { low: 80, high: 250 }, shopSupplies: { low: 45, high: 85 }, tax: { low: 65, high: 130 }, hiddenDamage: { low: 75, high: 165 } }, total: { low: 1450, high: 2700 },
    findings: ["Front bumper cover is torn and displaced", "Grille sections and mounting points are visibly damaged", "Hood alignment requires in-person measurement", "Possible sensor-area involvement cannot be confirmed from the image"], increaseFactors: ["Damaged impact absorber or reinforcement", "OEM-only grille or sensor components", "Required radar calibration"], reductionFactors: ["Reusable reinforcement and absorber", "No sensor faults after scanning", "Aftermarket components fit the repair plan"], nextSteps: ["Avoid relying on the visible cover damage alone", "Request a scan and sensor inspection", "Have the hood latch and front structure measured"]
  },
  {
    slug: "tesla-model-3-door-dent", title: "Door Dent and Paint Repair",
    vehicle: { year: 2022, make: "Tesla", model: "Model 3", bodyStyle: "Sedan", fuelType: "Electric" },
    location: "Miami, Florida", zipCode: "33130", image: "/images/tesla-model-3-door.webp", imageAlt: "White electric sedan with a dent and scraped paint on the left front door",
    damage: "Left front door dent, paint damage, trim removal, and possible calibration considerations", severity: "Moderate", confidence: "High", confidenceExplanation: "The door deformation, finish damage, and neighboring panels are clearly shown.", operation: "Repair or replace the door shell after access inspection; refinish and evaluate camera calibration requirements.", laborHours: { low: 5.8, high: 10.2 },
    breakdown: { parts: { low: 100, high: 430 }, bodyLabor: { low: 330, high: 560 }, paintLabor: { low: 210, high: 340 }, paintMaterials: { low: 120, high: 180 }, scans: { low: 80, high: 120 }, calibration: { low: 120, high: 250 }, shopSupplies: { low: 45, high: 75 }, tax: { low: 70, high: 140 }, hiddenDamage: { low: 125, high: 305 } }, total: { low: 1200, high: 2400 },
    findings: ["Deep dent and crease across the left front door skin", "Paint is visibly scraped through the surface coating", "Glass and mirror appear intact", "Camera or driver-assistance checks may be required after trim removal"], increaseFactors: ["Door-shell replacement", "Damage to window regulator or intrusion beam", "Calibration required by repair procedure"], reductionFactors: ["Door skin remains repairable", "Interior components are reusable", "No adjacent-panel blending required"], nextSteps: ["Confirm access behind the door skin", "Ask whether scan and calibration are included", "Inspect window and latch operation before authorizing work"]
  }
];

export function getSampleEstimate(slug: string) { return sampleEstimates.find((sample) => sample.slug === slug); }

for (const sample of sampleEstimates) {
  const calculated = sumSampleBreakdown(sample);
  if (calculated.low !== sample.total.low || calculated.high !== sample.total.high) throw new Error(`Sample pricing mismatch: ${sample.slug}`);
}
