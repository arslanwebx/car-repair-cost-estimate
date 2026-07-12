import rawConfig from "@/config/workbook-pricing.v1.json";
import type { EstimateInput, VisionAnalysis } from "./estimate-schema";

export type MoneyRange={low:number;high:number};
export type LineItem={area:string;operation:string;operationCode:string;laborHours:MoneyRange;parts:MoneyRange;bodyLabor:MoneyRange;paint:MoneyRange;frameLabor:MoneyRange;mechanicalLabor:MoneyRange;consumables:MoneyRange};
export type PartsCategory=Exclude<EstimateInput["preferences"]["parts"],"all">;
export type PartsScenario={category:PartsCategory;label:string;parts:MoneyRange;total:MoneyRange;oemFallbackItems:number};
export type PricedEstimate={pricingVersion:string;market:string;mid:number;selectedPartsCategory:EstimateInput["preferences"]["parts"];items:LineItem[];partsScenarios:PartsScenario[];scanCalibration:MoneyRange;shopSupplies:MoneyRange;hiddenDamage:MoneyRange;subtotal:MoneyRange;tax:MoneyRange;total:MoneyRange};
type StateRate={state:string;abbreviation:string;region:string;laborMultiplier:number;partsMultiplier:number;zone:string;bodyRate:number;paintRate:number;frameRate:number;mechanicalRate:number;paintMaterialRate:number;scanFee:number;staticCalibration:number;dynamicCalibration:number;shopSuppliesRate:number;hazmatFee:number;hiddenReserve:number};
type Operation={code:string;category:string;area:string;visibleDamage:string;severity:string;strategy:string;bodyHours:number;refinishHours:number;frameHours:number;mechanicalHours:number;basePart:number;scanNeed:string;calibrationNeed:string;blendPanels:number;consumables:number;lowFactor:number;highFactor:number;notes:string};
type Adjustment={name:string;[key:string]:string|number|null};
type WorkbookConfig={version:string;usaRates:StateRate[];damageOperations:Operation[];vehicleAdjustments:{classes:Adjustment[];powertrains:Adjustment[];materials:Adjustment[];paintTypes:Adjustment[];partsSources:Adjustment[];vehicleAges:Adjustment[]}};
const config=rawConfig as unknown as WorkbookConfig;
const operationByCode=new Map(config.damageOperations.map(operation=>[operation.code,operation]));
const pricingVersion="US-2026.07-v3";
// Accounts for common retail R&I, preparation, corrosion protection, color matching,
// blending, and procedure overhead omitted by the base workbook operation.
const retailProcedureFactor:Record<string,number>={
  SCRATCH_CLEAR_MINOR:1.2,SCRATCH_DEEP_PANEL:1.35,PDR_DENT_SMALL:1.2,PDR_DENT_MEDIUM:1.3,
  BUMPER_FRONT_SCUFF:1.3,BUMPER_FRONT_DENT_REPAIR:1.65,BUMPER_FRONT_CRACK_REPAIR:1.55,BUMPER_FRONT_REPLACE_BASIC:1.12,BUMPER_FRONT_REPLACE_ADAS:1.16,
  BUMPER_REAR_SCUFF:1.35,BUMPER_REAR_REPAIR:2,BUMPER_REAR_REPLACE_BASIC:1.15,BUMPER_REAR_REPLACE_BSM:1.18,
  FENDER_PDR_SMALL:1.25,FENDER_REPAIR:4.1,FENDER_REPLACE:1.45,
  DOOR_PDR_SMALL:1.25,DOOR_REPAIR:1.8,DOOR_SKIN_REPLACE:1.5,DOOR_SHELL_REPLACE:1.7,
  HOOD_REPAIR:1.65,HOOD_REPLACE:1.35,TRUNK_LID_REPAIR:1.6,TRUNK_LID_REPLACE:1.3,TAILGATE_REPLACE:1.35,
  QUARTER_PANEL_REPAIR:1.45,QUARTER_PANEL_REPLACE:1.25,ROCKER_REPAIR:1.35,ROCKER_REPLACE:1.25,ROOF_REPAIR:1.4,ROOF_REPLACE:1.2,
  GRILLE_REPLACE:1.16,MIRROR_REPLACE_BASIC:1.15,MIRROR_REPLACE_CAMERA:1.2,HEADLAMP_LED:1.12,HEADLAMP_MATRIX:1.12,
  WINDSHIELD_STANDARD:1.1,WINDSHIELD_ADAS:1.15,SIDE_GLASS_REPLACE:1.1,WHEEL_REFINISH:1.15,WHEEL_REPLACE:1.1,
  FRAME_PULL_MINOR:1.25,FRAME_PULL_MODERATE:1.25,FRAME_RAIL_SECTION:1.2,CORE_SUPPORT_REPLACE:1.2,CRASH_BAR_REPLACE:1.15,
  EV_BATTERY_INSPECTION:1.2,EV_BATTERY_SHIELD:1.25,EV_BATTERY_PACK:1.1,EV_CHARGE_PORT:1.2
};
const roundMoney=(value:number)=>Math.max(0,Math.round(value/10)*10);
const numeric=(value:string|number|null|undefined,fallback=1)=>typeof value==="number"?value:fallback;

const zipRanges:[number,number,string][]=[
  [10,27,"MA"],[28,29,"RI"],[30,38,"NH"],[39,49,"ME"],[50,59,"VT"],[60,69,"CT"],[70,89,"NJ"],[100,149,"NY"],[150,196,"PA"],[197,199,"DE"],[200,205,"DC"],[206,219,"MD"],[220,246,"VA"],[247,269,"WV"],[270,289,"NC"],[290,299,"SC"],[300,319,"GA"],[320,349,"FL"],[350,369,"AL"],[370,385,"TN"],[386,397,"MS"],[398,399,"GA"],[400,427,"KY"],[430,459,"OH"],[460,479,"IN"],[480,499,"MI"],[500,528,"IA"],[530,549,"WI"],[550,567,"MN"],[570,577,"SD"],[580,588,"ND"],[590,599,"MT"],[600,629,"IL"],[630,658,"MO"],[660,679,"KS"],[680,693,"NE"],[700,715,"LA"],[716,729,"AR"],[730,749,"OK"],[750,799,"TX"],[800,816,"CO"],[820,831,"WY"],[832,838,"ID"],[840,847,"UT"],[850,865,"AZ"],[870,884,"NM"],[889,898,"NV"],[900,961,"CA"],[967,968,"HI"],[970,979,"OR"],[980,994,"WA"],[995,999,"AK"]
];
function stateForZip(zip:string){const prefix=Number(zip.slice(0,3));return zipRanges.find(([from,to])=>prefix>=from&&prefix<=to)?.[2]}
function averageRate():StateRate{const numberKeys:(keyof StateRate)[]=["laborMultiplier","partsMultiplier","bodyRate","paintRate","frameRate","mechanicalRate","paintMaterialRate","scanFee","staticCalibration","dynamicCalibration","shopSuppliesRate","hazmatFee","hiddenReserve"];const result={state:"United States",abbreviation:"US",region:"National",zone:"National average"} as StateRate;for(const key of numberKeys)(result[key] as number)=config.usaRates.reduce((sum,row)=>sum+Number(row[key]),0)/config.usaRates.length;return result}
function marketRate(zip:string){const abbreviation=stateForZip(zip);return config.usaRates.find(rate=>rate.abbreviation===abbreviation)??averageRate()}
function adjustment(rows:Adjustment[],name:string){return rows.find(row=>row.name===name)??rows[0]}
function className(bodyStyle:EstimateInput["vehicle"]["bodyStyle"]){if(bodyStyle==="suv"||bodyStyle==="crossover")return "SUV / crossover";if(bodyStyle==="pickup")return "Pickup truck";if(bodyStyle==="luxury"||bodyStyle==="sports")return "Luxury";if(bodyStyle==="hatchback"||bodyStyle==="coupe")return "Compact";if(bodyStyle==="van"||bodyStyle==="minivan")return "Large sedan / wagon";return "Midsize / standard"}
function powertrainName(fuel:EstimateInput["vehicle"]["fuelType"]){if(fuel==="electric")return "Battery electric (BEV)";if(fuel==="hybrid")return "Full hybrid";return "ICE gasoline/diesel"}
function ageAdjustment(year:number){const age=new Date().getFullYear()-year;const index=age<=3?0:age<=7?1:age<=12?2:3;return config.vehicleAdjustments.vehicleAges[index]}
const partCategoryLabels:Record<PartsCategory,string>={economical:"Most economical reasonable",aftermarket:"Aftermarket where appropriate",recycled_oem:"Recycled or used OEM where available",new_oem:"New OEM"};
const aftermarketEligible=/^(BUMPER_|FENDER_REPLACE|HOOD_REPLACE|GRILLE_REPLACE|HEADLAMP_|TAILLAMP_|MIRROR_REPLACE_BASIC|WINDSHIELD_STANDARD|SIDE_GLASS_REPLACE|WHEEL_REPLACE|UNDERBODY_PANEL|CRASH_BAR_REPLACE)/;
const recycledEligible=/^(FENDER_REPLACE|DOOR_SHELL_REPLACE|HOOD_REPLACE|TRUNK_LID_REPLACE|TAILGATE_REPLACE|GRILLE_REPLACE|HEADLAMP_LED|TAILLAMP_REPLACE|MIRROR_REPLACE_BASIC|WHEEL_REPLACE)$/;
function partChoice(category:PartsCategory,operation:Operation){
  const rows=config.vehicleAdjustments.partsSources,oem=numeric(adjustment(rows,"OEM new").price),aftermarket=numeric(adjustment(rows,"Aftermarket certified").price),recycled=numeric(adjustment(rows,"Recycled / salvage").price);
  if(!operation.basePart)return {factor:1,fallback:false};
  if(category==="new_oem")return {factor:oem,fallback:false};
  if(category==="aftermarket")return aftermarketEligible.test(operation.code)?{factor:aftermarket,fallback:false}:{factor:oem,fallback:true};
  if(category==="recycled_oem")return recycledEligible.test(operation.code)?{factor:recycled,fallback:false}:{factor:oem,fallback:true};
  const choices=[aftermarketEligible.test(operation.code)?aftermarket:Infinity,recycledEligible.test(operation.code)?recycled:Infinity];
  const factor=Math.min(...choices);
  return Number.isFinite(factor)?{factor,fallback:false}:{factor:oem,fallback:true};
}
const includesAny=(values:readonly string[],choices:string[])=>choices.some(choice=>values.includes(choice));

function selectOperation(area:string,types:readonly string[],severity:string,strategy:string,adas:boolean,fuel:string,extent?:string,openingConcern=false){
  if(types.includes("hail"))return severity==="severe"?"HAIL_SEVERE":severity==="moderate"?"HAIL_MEDIUM":"HAIL_LIGHT";
  const surfaceOnly=includesAny(types,["scratch","deep_scratch","paint_transfer","paint_chip","scuff"])&&!includesAny(types,["small_dent","dent_without_paint_damage","dent_with_paint_damage","deep_dent","crease","crack","puncture","torn_bumper","misaligned_panel","collision"]);
  const pdr=includesAny(types,["small_dent","dent_without_paint_damage"])&&!includesAny(types,["dent_with_paint_damage","deep_dent","crease","crack"]);
  if(surfaceOnly&&area!=="front_bumper"&&area!=="rear_bumper")return types.includes("deep_scratch")?"SCRATCH_DEEP_PANEL":"SCRATCH_CLEAR_MINOR";
  if(area==="front_bumper"){if(strategy==="replace")return adas?"BUMPER_FRONT_REPLACE_ADAS":"BUMPER_FRONT_REPLACE_BASIC";if(surfaceOnly)return "BUMPER_FRONT_SCUFF";if(includesAny(types,["crack","puncture","torn_bumper"]))return "BUMPER_FRONT_CRACK_REPAIR";return "BUMPER_FRONT_DENT_REPAIR"}
  if(area==="rear_bumper"){if(strategy==="replace")return adas?"BUMPER_REAR_REPLACE_BSM":"BUMPER_REAR_REPLACE_BASIC";if(surfaceOnly)return "BUMPER_REAR_SCUFF";return "BUMPER_REAR_REPAIR"}
  if(area.includes("fender"))return strategy==="replace"||(severity==="severe"&&extent==="most_of_panel")?"FENDER_REPLACE":pdr?"FENDER_PDR_SMALL":"FENDER_REPAIR";
  if(area.includes("door")){const replace=strategy==="replace"||(severity==="severe"&&(extent==="most_of_panel"||openingConcern));return replace?(severity==="severe"?"DOOR_SHELL_REPLACE":"DOOR_SKIN_REPLACE"):pdr?"DOOR_PDR_SMALL":"DOOR_REPAIR"}
  if(area==="hood")return strategy==="replace"?"HOOD_REPLACE":"HOOD_REPAIR";
  if(area==="trunk"||area==="liftgate")return strategy==="replace"?"TRUNK_LID_REPLACE":"TRUNK_LID_REPAIR";
  if(area==="tailgate")return "TAILGATE_REPLACE";
  if(area.includes("quarter_panel"))return strategy==="replace"||(severity==="severe"&&extent==="most_of_panel")?"QUARTER_PANEL_REPLACE":"QUARTER_PANEL_REPAIR";
  if(area==="rocker_panel")return strategy==="replace"||(severity==="severe"&&extent==="most_of_panel")?"ROCKER_REPLACE":"ROCKER_REPAIR";
  if(area==="roof")return strategy==="replace"?"ROOF_REPLACE":"ROOF_REPAIR";
  if(area==="grille")return "GRILLE_REPLACE";
  if(area==="headlight")return severity==="severe"?"HEADLAMP_MATRIX":"HEADLAMP_LED";
  if(area==="taillight")return "TAILLAMP_REPLACE";
  if(area==="side_mirror")return adas?"MIRROR_REPLACE_CAMERA":"MIRROR_REPLACE_BASIC";
  if(area==="windshield")return adas?"WINDSHIELD_ADAS":"WINDSHIELD_STANDARD";
  if(area==="side_glass")return "SIDE_GLASS_REPLACE";
  if(area==="wheel")return strategy==="replace"||severity!=="minor"?"WHEEL_REPLACE":"WHEEL_REFINISH";
  if(area==="undercarriage")return fuel==="electric"&&severity==="severe"?"EV_BATTERY_SHIELD":"UNDERBODY_PANEL";
  if(types.includes("misaligned_panel"))return severity==="severe"?"FRAME_PULL_MODERATE":"FRAME_PULL_MINOR";
  if(pdr)return severity==="minor"?"PDR_DENT_SMALL":"PDR_DENT_MEDIUM";
  return surfaceOnly?(types.includes("deep_scratch")?"SCRATCH_DEEP_PANEL":"SCRATCH_CLEAR_MINOR"):"DOOR_REPAIR";
}
function valueRange(value:number,lowFactor:number,highFactor:number):MoneyRange{return {low:roundMoney(value*lowFactor),high:roundMoney(value*highFactor)}}
function confidenceBand(confidence:number){return confidence>=.8?{low:.88,high:1.12}:confidence>=.55?{low:.84,high:1.18}:{low:.8,high:1.25}}

export function calculateEstimate(input:EstimateInput,vision:VisionAnalysis):PricedEstimate{
  const rates=marketRate(input.preferences.zipCode),vehicle=adjustment(config.vehicleAdjustments.classes,className(input.vehicle.bodyStyle)),powertrain=adjustment(config.vehicleAdjustments.powertrains,powertrainName(input.vehicle.fuelType)),material=adjustment(config.vehicleAdjustments.materials,input.vehicle.aluminumBody?"Aluminum":"Steel"),paint=adjustment(config.vehicleAdjustments.paintTypes,"Metallic"),age=ageAdjustment(input.vehicle.year);
  const seen=new Set<string>();
  const selected=vision.observations.map(observation=>({observation,code:selectOperation(observation.area,observation.damageTypes,observation.severity,observation.operation,vision.possibleAdasInvolvement,input.vehicle.fuelType??"gas",observation.damageExtent,observation.openingOrIntrusionConcern)})).filter(item=>{const key=`${item.observation.area}:${item.code}`;if(seen.has(key))return false;seen.add(key);return true}).map(item=>({observation:item.observation,operation:operationByCode.get(item.code)??operationByCode.get("DOOR_REPAIR")!}));
  const observationConfidence=selected.length?selected.reduce((sum,item)=>sum+item.observation.confidence,0)/selected.length:vision.confidence,feeBand=confidenceBand(Math.min(vision.confidence,observationConfidence));
  const scanMid=selected.some(item=>item.operation.scanNeed==="PrePost")?rates.scanFee*numeric(powertrain.calibration):0;
  const calibrationMid=Math.max(0,...selected.map(({operation})=>operation.calibrationNeed==="Static"?rates.staticCalibration:operation.calibrationNeed==="Dynamic"?rates.dynamicCalibration:operation.calibrationNeed==="Both"?rates.staticCalibration+rates.dynamicCalibration:operation.calibrationNeed==="Conditional"&&vision.possibleAdasInvolvement?.55*((rates.staticCalibration+rates.dynamicCalibration)/2):0))*numeric(powertrain.calibration)*numeric(vehicle.calibration);
  const categories:PartsCategory[]=["economical","aftermarket","recycled_oem","new_oem"];

  function priceCategory(category:PartsCategory){
    let midItems=0,itemLow=0,itemHigh=0,totalLabor=0,partsLow=0,partsHigh=0,oemFallbackItems=0;
    const items=selected.map(({observation,operation})=>{
      const band=confidenceBand(Math.min(vision.confidence,observation.confidence)),lowFactor=Math.max(operation.lowFactor,band.low),highFactor=Math.min(operation.highFactor,band.high);
      const complexity=(observation.damageExtent==="most_of_panel"?1.05:1)*(observation.openingOrIntrusionConcern?1.08:1),procedure=(retailProcedureFactor[operation.code]??1.15)*complexity,choice=partChoice(category,operation);if(choice.fallback)oemFallbackItems++;
      const body=operation.bodyHours*rates.bodyRate*numeric(vehicle.labor)*numeric(material.bodyLabor)*numeric(age.labor)*procedure,paintLabor=operation.refinishHours*rates.paintRate*numeric(vehicle.labor)*numeric(paint.paintLabor)*numeric(age.labor)*procedure,frame=operation.frameHours*rates.frameRate*numeric(vehicle.labor)*numeric(material.bodyLabor)*numeric(age.labor)*procedure,mechanical=operation.mechanicalHours*rates.mechanicalRate*numeric(powertrain.mechanicalLabor)*numeric(age.labor)*procedure,materials=operation.refinishHours*rates.paintMaterialRate*numeric(paint.materials)*procedure,parts=operation.basePart*rates.partsMultiplier*numeric(vehicle.parts)*numeric(powertrain.parts)*numeric(material.parts)*choice.factor*numeric(age.parts)*procedure,consumables=operation.consumables*rates.partsMultiplier*procedure;
      const mid=body+paintLabor+frame+mechanical+materials+parts+consumables;midItems+=mid;itemLow+=mid*lowFactor;itemHigh+=mid*highFactor;totalLabor+=body+paintLabor+frame+mechanical;
      const partsRange=valueRange(parts,lowFactor,highFactor);partsLow+=partsRange.low;partsHigh+=partsRange.high;
      return {area:observation.area,operation:operation.strategy,operationCode:operation.code,laborHours:valueRange(operation.bodyHours+operation.refinishHours+operation.frameHours+operation.mechanicalHours,lowFactor,highFactor),parts:partsRange,bodyLabor:valueRange(body,lowFactor,highFactor),paint:valueRange(paintLabor+materials,lowFactor,highFactor),frameLabor:valueRange(frame,lowFactor,highFactor),mechanicalLabor:valueRange(mechanical,lowFactor,highFactor),consumables:valueRange(consumables,lowFactor,highFactor)};
    });
    const suppliesMid=Math.min(totalLabor*rates.shopSuppliesRate,450)+rates.hazmatFee,mid=midItems+scanMid+calibrationMid+suppliesMid;
    const scanCalibration=valueRange(scanMid+calibrationMid,feeBand.low,feeBand.high),shopSupplies=valueRange(suppliesMid,feeBand.low,feeBand.high),subtotal={low:roundMoney(itemLow+scanCalibration.low+shopSupplies.low),high:roundMoney(itemHigh+scanCalibration.high+shopSupplies.high)},tax={low:0,high:0},hiddenDamage={low:0,high:roundMoney(mid*rates.hiddenReserve)},hiddenWeight=vision.hiddenDamageRisk==="high"?1:vision.hiddenDamageRisk==="moderate"?.7:0,total={low:subtotal.low,high:roundMoney(subtotal.high+hiddenDamage.high*hiddenWeight)};
    return {category,mid:roundMoney(mid),items,scanCalibration,shopSupplies,subtotal,tax,hiddenDamage,total,parts:{low:roundMoney(partsLow),high:roundMoney(partsHigh)},oemFallbackItems};
  }

  const runs=categories.map(priceCategory),requested=input.preferences.parts,chosen=requested==="all"?runs[0]:runs.find(run=>run.category===requested)!;
  const range=(values:MoneyRange[])=>({low:Math.min(...values.map(value=>value.low)),high:Math.max(...values.map(value=>value.high))});
  const items=requested==="all"?chosen.items.map((item,index)=>({...item,laborHours:range(runs.map(run=>run.items[index].laborHours)),parts:range(runs.map(run=>run.items[index].parts)),bodyLabor:range(runs.map(run=>run.items[index].bodyLabor)),paint:range(runs.map(run=>run.items[index].paint)),frameLabor:range(runs.map(run=>run.items[index].frameLabor)),mechanicalLabor:range(runs.map(run=>run.items[index].mechanicalLabor)),consumables:range(runs.map(run=>run.items[index].consumables))})):chosen.items;
  const displayedRuns=requested==="all"?runs:[chosen],partsScenarios=displayedRuns.map(run=>({category:run.category,label:partCategoryLabels[run.category],parts:run.parts,total:run.total,oemFallbackItems:run.oemFallbackItems}));
  return {pricingVersion,market:`${rates.state} · ${rates.zone}`,mid:requested==="all"?roundMoney(runs.reduce((sum,run)=>sum+run.mid,0)/runs.length):chosen.mid,selectedPartsCategory:requested,items,partsScenarios,scanCalibration:requested==="all"?range(runs.map(run=>run.scanCalibration)):chosen.scanCalibration,shopSupplies:requested==="all"?range(runs.map(run=>run.shopSupplies)):chosen.shopSupplies,hiddenDamage:requested==="all"?range(runs.map(run=>run.hiddenDamage)):chosen.hiddenDamage,subtotal:requested==="all"?range(runs.map(run=>run.subtotal)):chosen.subtotal,tax:chosen.tax,total:requested==="all"?range(runs.map(run=>run.total)):chosen.total};
}
