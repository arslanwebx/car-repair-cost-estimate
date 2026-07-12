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
  it("prices every requested parts category as a distinct feasible scenario", () => {
    const replacementInput:EstimateInput={...input,damage:{...input.damage,areas:["left_front_door"],types:["deep_dent","collision"]}};
    const replacementVision:VisionAnalysis={...vision,hiddenDamageRisk:"high",observations:[{area:"left_front_door",damageTypes:["deep_dent","collision"],severity:"severe",operation:"replace",paintDamage:true,alignmentConcern:true,damageExtent:"most_of_panel",openingOrIntrusionConcern:true,confidence:.9}]};
    const oem=calculateEstimate({...replacementInput,preferences:{...replacementInput.preferences,parts:"new_oem"}},replacementVision);
    const used=calculateEstimate({...replacementInput,preferences:{...replacementInput.preferences,parts:"recycled_oem"}},replacementVision);
    const aftermarket=calculateEstimate({...replacementInput,preferences:{...replacementInput.preferences,parts:"aftermarket"}},replacementVision);
    const all=calculateEstimate({...replacementInput,preferences:{...replacementInput.preferences,parts:"all"}},replacementVision);
    expect(used.items[0].parts.low).toBeLessThan(oem.items[0].parts.low);
    expect(used.total.low).toBeLessThan(oem.total.low);
    expect(aftermarket.partsScenarios[0].oemFallbackItems).toBe(1);
    expect(aftermarket.items[0].parts).toEqual(oem.items[0].parts);
    expect(all.partsScenarios.map(item=>item.category)).toEqual(["economical","aftermarket","recycled_oem","new_oem"]);
    expect(all.total.low).toBe(used.total.low);
    expect(all.total.high).toBe(oem.total.high);
  });
  it("does not underprice the supplied severe two-door side-impact pattern", () => {
    const fitInput:EstimateInput={vehicle:{year:2019,make:"Honda",model:"Fit",bodyStyle:"hatchback",mileage:"50k_100k",fuelType:"gas"},damage:{areas:["right_front_door","right_rear_door","side_mirror","rocker_panel"],types:["deep_dent","dent_with_paint_damage","collision","broken_mirror"],description:"Both passenger doors are crushed and will be replaced; mirror and rocker are damaged.",safeToDrive:"no",fluidsLeaking:false,airbagsDeployed:false,panelsOpenNormally:false},preferences:{zipCode:"33130",parts:"all"}};
    const fitVision:VisionAnalysis={vehiclePresent:true,damageVisible:true,imageQuality:"sufficient",observations:[
      {area:"right_front_door",damageTypes:["deep_dent","collision"],severity:"severe",operation:"replace",paintDamage:true,alignmentConcern:true,damageExtent:"most_of_panel",openingOrIntrusionConcern:true,confidence:.9},
      {area:"right_rear_door",damageTypes:["deep_dent","collision"],severity:"severe",operation:"replace",paintDamage:true,alignmentConcern:true,damageExtent:"most_of_panel",openingOrIntrusionConcern:true,confidence:.9},
      {area:"side_mirror",damageTypes:["broken_mirror"],severity:"severe",operation:"replace",paintDamage:false,alignmentConcern:false,damageExtent:"panel_section",openingOrIntrusionConcern:false,confidence:.9},
      {area:"rocker_panel",damageTypes:["deep_dent","collision"],severity:"moderate",operation:"repair",paintDamage:true,alignmentConcern:true,damageExtent:"panel_section",openingOrIntrusionConcern:false,confidence:.75}
    ],possibleAdasInvolvement:false,hiddenDamageRisk:"high",inPersonInspectionStronglyRecommended:true,confidence:.75,lowConfidenceReasons:[],requiredAdditionalAngles:[]};
    const result=calculateEstimate(fitInput,fitVision);
    expect(result.items.filter(item=>item.operationCode==="DOOR_SHELL_REPLACE")).toHaveLength(2);
    expect(result.total.low).toBeGreaterThanOrEqual(7000);
    expect(result.total.high).toBeGreaterThan(10000);
  });
});
