import type { EstimateInput, VisionAnalysis } from "./estimate-schema";

const severeTypes=new Set(["deep_dent","puncture","torn_bumper","misaligned_panel","collision"]);
const moderateTypes=new Set(["deep_scratch","dent_with_paint_damage","crease","crack","broken_light","broken_mirror","glass","hail"]);
const replacementTypes=new Set(["puncture","torn_bumper","broken_light","broken_mirror","glass"]);
const paintTypes=new Set(["scratch","deep_scratch","paint_transfer","paint_chip","scuff","dent_with_paint_damage","deep_dent","crease","collision"]);
const adasAreas=new Set(["front_bumper","rear_bumper","grille","windshield","side_mirror"]);

export function createUserInputAnalysis(input:EstimateInput):VisionAnalysis{
  const severity=input.damage.types.some(type=>severeTypes.has(type))?"severe":input.damage.types.some(type=>moderateTypes.has(type))?"moderate":"minor";
  const operation=input.damage.types.some(type=>replacementTypes.has(type))?"replace":"repair";
  const paintDamage=input.damage.types.some(type=>paintTypes.has(type));
  const collisionRisk=input.damage.types.some(type=>severeTypes.has(type));
  return {
    vehiclePresent:true,
    damageVisible:true,
    imageQuality:"limited",
    observations:input.damage.areas.map(area=>({area,damageTypes:input.damage.types,severity,operation,paintDamage,alignmentConcern:input.damage.types.includes("misaligned_panel"),confidence:.35})),
    possibleAdasInvolvement:input.damage.areas.some(area=>adasAreas.has(area))||Boolean(input.damage.sensorConcern),
    hiddenDamageRisk:collisionRisk?"high":"moderate",
    inPersonInspectionStronglyRecommended:true,
    confidence:.35,
    lowConfidenceReasons:["Live photo analysis was unavailable. This range uses the vehicle and damage details selected by the user."],
    requiredAdditionalAngles:[]
  };
}
