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
    damage: "Rear bumper dent, paint scuffing, and minor deformation", severity: "Moderate", confidence: "High", confidenceExplanation: "The damaged bumper area and adjacent panels are clearly visible in even lighting.", operation: "Remove, repair, refinish, and reinstall the bumper cover; inspect retainers and absorber during removal.", laborHours: { low: 4.8, high: 7.2 },
    breakdown: { parts: { low: 50, high: 140 }, bodyLabor: { low: 300, high: 450 }, paintLabor: { low: 190, high: 300 }, paintMaterials: { low: 130, high: 210 }, scans: { low: 90, high: 140 }, calibration: { low: 0, high: 0 }, shopSupplies: { low: 70, high: 110 }, tax: { low: 0, high: 0 }, hiddenDamage: { low: 120, high: 250 } }, total: { low: 950, high: 1600 },
    findings: ["Localized deformation in the rear bumper cover", "Surface scuffing appears to extend through the finish", "No visible taillight or quarter-panel damage", "Retainers cannot be evaluated until the cover is removed"],
    increaseFactors: ["Broken bumper retainers or mounting tabs", "Three-stage or specialty paint finish", "Damage discovered behind the cover"], reductionFactors: ["Paint transfer removes without refinishing", "The cover returns to shape with limited heat repair", "No scan-related fault codes"], nextSteps: ["Ask a repair facility to inspect the bumper retainers", "Confirm paint type and blending needs", "Compare the written shop estimate with this itemized range"]
  },
  {
    slug: "ford-f150-fender-damage", title: "Deep Fender Dent With Paint Damage",
    vehicle: { year: 2019, make: "Ford", model: "F-150", bodyStyle: "Pickup", fuelType: "Gasoline" },
    location: "Chicago, Illinois", zipCode: "60601", image: "/images/ford-f150-fender.webp", imageAlt: "Dark gray pickup with a deep dent and paint damage on the left front fender",
    damage: "Deep left front fender dent with paint damage and possible paint blending", severity: "Moderate", confidence: "High", confidenceExplanation: "The fender profile, paint break, and adjacent panel gaps are visible from a useful angle.", operation: "Remove adjacent trim, repair or replace the fender after measuring, refinish, and blend as required for color match.", laborHours: { low: 8.5, high: 13.5 },
    breakdown: { parts: { low: 250, high: 650 }, bodyLabor: { low: 600, high: 850 }, paintLabor: { low: 320, high: 500 }, paintMaterials: { low: 220, high: 340 }, scans: { low: 90, high: 140 }, calibration: { low: 0, high: 0 }, shopSupplies: { low: 120, high: 180 }, tax: { low: 0, high: 0 }, hiddenDamage: { low: 400, high: 740 } }, total: { low: 2000, high: 3400 },
    findings: ["Deep deformation across the left front fender crown", "Paint coating is visibly broken", "Headlight and bumper appear intact in the sample image", "Color blending into the adjacent door or hood may be recommended"], increaseFactors: ["Fender replacement instead of metal repair", "Corrosion found where paint is broken", "Additional blend panels"], reductionFactors: ["Successful conventional metal repair", "No adjacent-panel blending required", "Economical replacement part availability"], nextSteps: ["Protect exposed metal from moisture", "Request both repair and replacement scenarios", "Confirm whether blending is included in a shop quote"]
  },
  {
    slug: "toyota-camry-front-bumper-grille", title: "Front Bumper and Grille Damage",
    vehicle: { year: 2020, make: "Toyota", model: "Camry", bodyStyle: "Sedan", fuelType: "Gasoline" },
    location: "Los Angeles, California", zipCode: "90012", image: "/images/toyota-camry-front.webp", imageAlt: "Silver midsize sedan with front bumper cover, grille, and mounting damage",
    damage: "Front bumper cover damage, grille damage, mounting damage, and possible sensor-area involvement", severity: "Moderate to severe", confidence: "Moderate", confidenceExplanation: "Exterior damage is clear, but mounting structure and sensor condition require disassembly and scanning.", operation: "Replace bumper and grille components, perform required removal and installation, refinish, inspect mounts, scan, and calibrate if required.", laborHours: { low: 10, high: 16 },
    breakdown: { parts: { low: 1000, high: 1900 }, bodyLabor: { low: 500, high: 800 }, paintLabor: { low: 350, high: 600 }, paintMaterials: { low: 250, high: 420 }, scans: { low: 120, high: 180 }, calibration: { low: 350, high: 700 }, shopSupplies: { low: 180, high: 280 }, tax: { low: 0, high: 0 }, hiddenDamage: { low: 250, high: 520 } }, total: { low: 3000, high: 5400 },
    findings: ["Front bumper cover is torn and displaced", "Grille sections and mounting points are visibly damaged", "Hood alignment requires in-person measurement", "Possible sensor-area involvement cannot be confirmed from the image"], increaseFactors: ["Damaged impact absorber or reinforcement", "OEM-only grille or sensor components", "Required radar calibration"], reductionFactors: ["Reusable reinforcement and absorber", "No sensor faults after scanning", "Aftermarket components fit the repair plan"], nextSteps: ["Avoid relying on the visible cover damage alone", "Request a scan and sensor inspection", "Have the hood latch and front structure measured"]
  },
  {
    slug: "tesla-model-3-door-dent", title: "Door Dent and Paint Repair",
    vehicle: { year: 2022, make: "Tesla", model: "Model 3", bodyStyle: "Sedan", fuelType: "Electric" },
    location: "Miami, Florida", zipCode: "33130", image: "/images/tesla-model-3-door.webp", imageAlt: "White electric sedan with a dent and scraped paint on the left front door",
    damage: "Left front door dent, paint damage, trim removal, and possible calibration considerations", severity: "Moderate", confidence: "High", confidenceExplanation: "The door deformation, finish damage, and neighboring panels are clearly shown.", operation: "Repair or replace and transfer the door assembly after access inspection; refinish, blend, scan, and evaluate camera calibration requirements.", laborHours: { low: 18, high: 28 },
    breakdown: { parts: { low: 1400, high: 2500 }, bodyLabor: { low: 900, high: 1400 }, paintLabor: { low: 600, high: 900 }, paintMaterials: { low: 350, high: 500 }, scans: { low: 180, high: 250 }, calibration: { low: 500, high: 900 }, shopSupplies: { low: 220, high: 300 }, tax: { low: 0, high: 0 }, hiddenDamage: { low: 650, high: 1050 } }, total: { low: 4800, high: 7800 },
    findings: ["Deep dent and crease across the left front door skin", "Paint is visibly scraped through the surface coating", "Glass and mirror appear intact", "Camera or driver-assistance checks may be required after trim removal"], increaseFactors: ["Door-shell replacement", "Damage to window regulator or intrusion beam", "Calibration required by repair procedure"], reductionFactors: ["Door skin remains repairable", "Interior components are reusable", "No adjacent-panel blending required"], nextSteps: ["Confirm access behind the door skin", "Ask whether scan and calibration are included", "Inspect window and latch operation before authorizing work"]
  }
];

export function getSampleEstimate(slug: string) { return sampleEstimates.find((sample) => sample.slug === slug); }

for (const sample of sampleEstimates) {
  const calculated = sumSampleBreakdown(sample);
  if (calculated.low !== sample.total.low || calculated.high !== sample.total.high) throw new Error(`Sample pricing mismatch: ${sample.slug}`);
}
