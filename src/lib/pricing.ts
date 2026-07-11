import rawConfig from "@/config/workbook-pricing.v1.json";
import type { EstimateInput, VisionAnalysis } from "./estimate-schema";

export type MoneyRange={low:number;high:number};
export type LineItem={area:string;operation:string;operationCode:string;laborHours:MoneyRange;parts:MoneyRange;bodyLabor:MoneyRange;paint:MoneyRange;frameLabor:MoneyRange;mechanicalLabor:MoneyRange;consumables:MoneyRange};
export type PricedEstimate={pricingVersion:string;market:string;mid:number;items:LineItem[];scanCalibration:MoneyRange;shopSupplies:MoneyRange;hiddenDamage:MoneyRange;subtotal:MoneyRange;tax:MoneyRange;total:MoneyRange};
type StateRate={state:string;abbreviation:string;region:string;laborMultiplier:number;partsMultiplier:number;zone:string;bodyRate:number;paintRate:number;frameRate:number;mechanicalRate:number;paintMaterialRate:number;scanFee:number;staticCalibration:number;dynamicCalibration:number;shopSuppliesRate:number;hazmatFee:number;hiddenReserve:number};
type Operation={code:string;category:string;area:string;visibleDamage:string;severity:string;strategy:string;bodyHours:number;refinishHours:number;frameHours:number;mechanicalHours:number;basePart:number;scanNeed:string;calibrationNeed:string;blendPanels:number;consumables:number;lowFactor:number;highFactor:number;notes:string};
type Adjustment={name:string;[key:string]:string|number|null};
type WorkbookConfig={version:string;usaRates:StateRate[];damageOperations:Operation[];vehicleAdjustments:{classes:Adjustment[];powertrains:Adjustment[];materials:Adjustment[];paintTypes:Adjustment[];partsSources:Adjustment[];vehicleAges:Adjustment[]}};
const config=rawConfig as unknown as WorkbookConfig;
const operationByCode=new Map(config.damageOperations.map(operation=>[operation.code,operation]));
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
function partsSource(value:EstimateInput["preferences"]["parts"]){const rows=config.vehicleAdjustments.partsSources;if(value==="new_oem")return adjustment(rows,"OEM new");if(value==="recycled_oem")return adjustment(rows,"Recycled / salvage");if(value==="aftermarket"||value==="economical")return adjustment(rows,"Aftermarket certified");return {name:"Blended available scenarios",price:.86}}
const includesAny=(values:readonly string[],choices:string[])=>choices.some(choice=>values.includes(choice));

function selectOperation(area:string,types:readonly string[],severity:string,strategy:string,adas:boolean,fuel:string){
  if(types.includes("hail"))return severity==="severe"?"HAIL_SEVERE":severity==="moderate"?"HAIL_MEDIUM":"HAIL_LIGHT";
  const surfaceOnly=includesAny(types,["scratch","deep_scratch","paint_transfer","paint_chip","scuff"])&&!includesAny(types,["small_dent","dent_without_paint_damage","dent_with_paint_damage","deep_dent","crease","crack","puncture","torn_bumper","misaligned_panel","collision"]);
  const pdr=includesAny(types,["small_dent","dent_without_paint_damage"])&&!includesAny(types,["dent_with_paint_damage","deep_dent","crease","crack"]);
  if(surfaceOnly&&area!=="front_bumper"&&area!=="rear_bumper")return types.includes("deep_scratch")?"SCRATCH_DEEP_PANEL":"SCRATCH_CLEAR_MINOR";
  if(area==="front_bumper"){if(strategy==="replace")return adas?"BUMPER_FRONT_REPLACE_ADAS":"BUMPER_FRONT_REPLACE_BASIC";if(surfaceOnly)return "BUMPER_FRONT_SCUFF";if(includesAny(types,["crack","puncture","torn_bumper"]))return "BUMPER_FRONT_CRACK_REPAIR";return "BUMPER_FRONT_DENT_REPAIR"}
  if(area==="rear_bumper"){if(strategy==="replace")return adas?"BUMPER_REAR_REPLACE_BSM":"BUMPER_REAR_REPLACE_BASIC";if(surfaceOnly)return "BUMPER_REAR_SCUFF";return "BUMPER_REAR_REPAIR"}
  if(area.includes("fender"))return strategy==="replace"?"FENDER_REPLACE":pdr?"FENDER_PDR_SMALL":"FENDER_REPAIR";
  if(area.includes("door"))return strategy==="replace"?(severity==="severe"?"DOOR_SHELL_REPLACE":"DOOR_SKIN_REPLACE"):pdr?"DOOR_PDR_SMALL":"DOOR_REPAIR";
  if(area==="hood")return strategy==="replace"?"HOOD_REPLACE":"HOOD_REPAIR";
  if(area==="trunk"||area==="liftgate")return strategy==="replace"?"TRUNK_LID_REPLACE":"TRUNK_LID_REPAIR";
  if(area==="tailgate")return "TAILGATE_REPLACE";
  if(area.includes("quarter_panel"))return strategy==="replace"?"QUARTER_PANEL_REPLACE":"QUARTER_PANEL_REPAIR";
  if(area==="rocker_panel")return strategy==="replace"?"ROCKER_REPLACE":"ROCKER_REPAIR";
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
  const rates=marketRate(input.preferences.zipCode),vehicle=adjustment(config.vehicleAdjustments.classes,className(input.vehicle.bodyStyle)),powertrain=adjustment(config.vehicleAdjustments.powertrains,powertrainName(input.vehicle.fuelType)),material=adjustment(config.vehicleAdjustments.materials,input.vehicle.aluminumBody?"Aluminum":"Steel"),paint=adjustment(config.vehicleAdjustments.paintTypes,"Metallic"),source=partsSource(input.preferences.parts),age=ageAdjustment(input.vehicle.year);
  const seen=new Set<string>();
  const selected=vision.observations.map(observation=>({observation,code:selectOperation(observation.area,observation.damageTypes,observation.severity,observation.operation,vision.possibleAdasInvolvement,input.vehicle.fuelType??"gas")})).filter(item=>{const key=`${item.observation.area}:${item.code}`;if(seen.has(key))return false;seen.add(key);return true}).map(item=>({observation:item.observation,operation:operationByCode.get(item.code)??operationByCode.get("DOOR_REPAIR")!}));
  const observationConfidence=selected.length?selected.reduce((sum,item)=>sum+item.observation.confidence,0)/selected.length:vision.confidence;
  const feeBand=confidenceBand(Math.min(vision.confidence,observationConfidence));
  let midItems=0,itemLow=0,itemHigh=0,totalLabor=0;
  const items=selected.map(({observation,operation})=>{
    const band=confidenceBand(Math.min(vision.confidence,observation.confidence));
    const lowFactor=Math.max(operation.lowFactor,band.low),highFactor=Math.min(operation.highFactor,band.high);
    const body=operation.bodyHours*rates.bodyRate*numeric(vehicle.labor)*numeric(material.bodyLabor)*numeric(age.labor),paintLabor=operation.refinishHours*rates.paintRate*numeric(vehicle.labor)*numeric(paint.paintLabor)*numeric(age.labor),frame=operation.frameHours*rates.frameRate*numeric(vehicle.labor)*numeric(material.bodyLabor)*numeric(age.labor),mechanical=operation.mechanicalHours*rates.mechanicalRate*numeric(powertrain.mechanicalLabor)*numeric(age.labor),materials=operation.refinishHours*rates.paintMaterialRate*numeric(paint.materials),parts=operation.basePart*rates.partsMultiplier*numeric(vehicle.parts)*numeric(powertrain.parts)*numeric(material.parts)*numeric(source.price)*numeric(age.parts),consumables=operation.consumables*rates.partsMultiplier;
    const mid=body+paintLabor+frame+mechanical+materials+parts+consumables;midItems+=mid;itemLow+=mid*lowFactor;itemHigh+=mid*highFactor;totalLabor+=body+paintLabor+frame+mechanical;
    return {area:observation.area,operation:operation.strategy,operationCode:operation.code,laborHours:valueRange(operation.bodyHours+operation.refinishHours+operation.frameHours+operation.mechanicalHours,lowFactor,highFactor),parts:valueRange(parts,lowFactor,highFactor),bodyLabor:valueRange(body,lowFactor,highFactor),paint:valueRange(paintLabor+materials,lowFactor,highFactor),frameLabor:valueRange(frame,lowFactor,highFactor),mechanicalLabor:valueRange(mechanical,lowFactor,highFactor),consumables:valueRange(consumables,lowFactor,highFactor)};
  });
  const scanMid=selected.some(item=>item.operation.scanNeed==="PrePost")?rates.scanFee*numeric(powertrain.calibration):0;
  const calibrationMid=Math.max(0,...selected.map(({operation})=>operation.calibrationNeed==="Static"?rates.staticCalibration:operation.calibrationNeed==="Dynamic"?rates.dynamicCalibration:operation.calibrationNeed==="Both"?rates.staticCalibration+rates.dynamicCalibration:operation.calibrationNeed==="Conditional"&&vision.possibleAdasInvolvement?.55*((rates.staticCalibration+rates.dynamicCalibration)/2):0))*numeric(powertrain.calibration)*numeric(vehicle.calibration);
  const suppliesMid=Math.min(totalLabor*rates.shopSuppliesRate,450)+rates.hazmatFee;
  const mid=midItems+scanMid+calibrationMid+suppliesMid;
  const scanCalibration=valueRange(scanMid+calibrationMid,feeBand.low,feeBand.high),shopSupplies=valueRange(suppliesMid,feeBand.low,feeBand.high),subtotal={low:roundMoney(itemLow+scanCalibration.low+shopSupplies.low),high:roundMoney(itemHigh+scanCalibration.high+shopSupplies.high)},tax={low:0,high:0},total={...subtotal},hiddenDamage={low:0,high:roundMoney(mid*rates.hiddenReserve)};
  return {pricingVersion:config.version,market:`${rates.state} · ${rates.zone}`,mid:roundMoney(mid),items,scanCalibration,shopSupplies,hiddenDamage,subtotal,tax,total};
}
