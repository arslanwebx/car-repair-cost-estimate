import { describe,expect,it } from "vitest";
import type { EstimateInput } from "./estimate-schema";
import { createUserInputAnalysis } from "./manual-analysis";
import { calculateEstimate } from "./pricing";

const input:EstimateInput={vehicle:{year:2021,make:"Honda",model:"Civic",bodyStyle:"sedan",mileage:"50k_100k",fuelType:"gas"},damage:{areas:["rear_bumper"],types:["dent_with_paint_damage"],description:"Rear bumper dent with scraped paint.",safeToDrive:"yes",fluidsLeaking:false,airbagsDeployed:false},preferences:{zipCode:"75201",parts:"all"}};
describe("limited-confidence report fallback",()=>{it("creates an itemized deterministic report without an AI price",()=>{const vision=createUserInputAnalysis(input),estimate=calculateEstimate(input,vision);expect(vision.confidence).toBe(.35);expect(vision.lowConfidenceReasons[0]).toContain("Live photo analysis was unavailable");expect(estimate.items).toHaveLength(1);expect(estimate.total.high).toBeGreaterThan(estimate.total.low)})});

it("uses replacement wording and keeps component-specific damage types separate",()=>{
  const collision:EstimateInput={...input,damage:{...input.damage,areas:["right_front_door","right_rear_door","side_mirror"],types:["deep_dent","collision","broken_mirror"],description:"Both right doors will be replaced and the mirror is broken."}};
  const analysis=createUserInputAnalysis(collision);
  const estimate=calculateEstimate(collision,analysis);
  expect(analysis.observations.filter(item=>item.area.includes("door")).every(item=>item.operation==="replace")).toBe(true);
  expect(analysis.observations.find(item=>item.area==="right_front_door")?.damageTypes).not.toContain("broken_mirror");
  expect(analysis.observations.find(item=>item.area==="side_mirror")?.damageTypes).toContain("broken_mirror");
  expect(estimate.items.filter(item=>item.operationCode==="DOOR_SHELL_REPLACE")).toHaveLength(2);
  expect(estimate.total.low).toBeGreaterThan(5000);
});
