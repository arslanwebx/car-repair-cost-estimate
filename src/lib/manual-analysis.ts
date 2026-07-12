import type { EstimateInput, VisionAnalysis } from "./estimate-schema";

const severeTypes=new Set(["deep_dent","puncture","torn_bumper","misaligned_panel","collision"]);
const moderateTypes=new Set(["deep_scratch","dent_with_paint_damage","crease","crack","broken_light","broken_mirror","glass","hail"]);
const replacementTypes=new Set(["puncture","torn_bumper","broken_light","broken_mirror","glass"]);
const paintTypes=new Set(["scratch","deep_scratch","paint_transfer","paint_chip","scuff","dent_with_paint_damage","deep_dent","crease","collision"]);
const adasAreas=new Set(["front_bumper","rear_bumper","grille","windshield","side_mirror"]);
const assemblyAreas=new Set(["front_bumper","rear_bumper","left_front_fender","right_front_fender","left_front_door","right_front_door","left_rear_door","right_rear_door","hood","trunk","liftgate","tailgate","grille","headlight","taillight","side_mirror","windshield","side_glass","wheel"]);
const openingAreas=new Set(["left_front_door","right_front_door","left_rear_door","right_rear_door","hood","trunk","liftgate","tailgate"]);

function relevantTypes(area:string,types:EstimateInput["damage"]["types"]){
  return types.filter(type=>{
    if(type==="broken_mirror")return area==="side_mirror";
    if(type==="broken_light")return area==="headlight"||area==="taillight";
    if(type==="glass")return area==="windshield"||area==="side_glass";
    if(type==="torn_bumper")return area==="front_bumper"||area==="rear_bumper";
    return true;
  });
}

export function createUserInputAnalysis(input:EstimateInput):VisionAnalysis{
  const description=input.damage.description.toLowerCase();
  const replacementReported=/\b(replace|replacement|replaced|new (?:door|panel|bumper|fender|hood|mirror|light)|needs? (?:a |to be )?replaced)\b/.test(description);
  const extensiveReported=/\b(crushed|caved|folded|buckled|smashed|intrusion|won't open|will not open|stuck (?:open|closed)|jammed)\b/.test(description);
  const collisionRisk=input.damage.types.some(type=>severeTypes.has(type));
  return {
    vehiclePresent:true,
    damageVisible:true,
    imageQuality:"limited",
    observations:input.damage.areas.map(area=>{
      const damageTypes=relevantTypes(area,input.damage.types);
      const severe=damageTypes.some(type=>severeTypes.has(type));
      const severity=severe||extensiveReported?"severe":damageTypes.some(type=>moderateTypes.has(type))?"moderate":"minor";
      const openingOrIntrusionConcern=openingAreas.has(area)&&(extensiveReported||input.damage.panelsOpenNormally===false);
      const replace=assemblyAreas.has(area)&&(replacementReported||damageTypes.some(type=>replacementTypes.has(type))||(severity==="severe"&&damageTypes.includes("collision")&&damageTypes.some(type=>["deep_dent","crease","puncture"].includes(type))));
      return {area,damageTypes,severity,operation:replace?"replace":"repair",paintDamage:damageTypes.some(type=>paintTypes.has(type)),alignmentConcern:damageTypes.includes("misaligned_panel")||openingOrIntrusionConcern,damageExtent:severity==="severe"?"most_of_panel":severity==="moderate"?"panel_section":"localized",openingOrIntrusionConcern,confidence:.35} as const;
    }),
    possibleAdasInvolvement:input.damage.areas.some(area=>adasAreas.has(area))||Boolean(input.damage.sensorConcern),
    hiddenDamageRisk:collisionRisk?"high":"moderate",
    inPersonInspectionStronglyRecommended:true,
    confidence:.35,
    lowConfidenceReasons:["Live photo analysis was unavailable. This range uses the vehicle and damage details selected by the user."],
    requiredAdditionalAngles:[]
  };
}
