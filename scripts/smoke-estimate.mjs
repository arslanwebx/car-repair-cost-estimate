import { readFile } from "node:fs/promises";

const input={vehicle:{year:2021,make:"Honda",model:"Civic",bodyStyle:"sedan",mileage:"50k_100k",fuelType:"gas"},damage:{areas:["rear_bumper"],types:["dent_with_paint_damage"],description:"Rear bumper dent with scraped paint.",safeToDrive:"yes",fluidsLeaking:false,airbagsDeployed:false},preferences:{zipCode:"75201",parts:"all"}};
const form=new FormData();
form.set("input",JSON.stringify(input));
form.set("confirmedContradiction","false");
form.set("photos",new File([await readFile("public/images/honda-civic-rear-bumper.webp")],"damage.webp",{type:"image/webp"}));
try {
  const response=await fetch("http://localhost:3000/api/estimate",{method:"POST",body:form,signal:AbortSignal.timeout(60_000)});
  const report=await response.json();
  if(!response.ok||!report.id||!report.estimate?.items?.length)throw new Error(JSON.stringify(report));
  console.log(JSON.stringify({status:response.status,id:report.id,analysisMode:report.analysisMode,confidence:report.vision.confidence,items:report.estimate.items.length,total:report.estimate.total,pricingVersion:report.estimate.pricingVersion},null,2));
} catch (error) {
  console.error("Estimate smoke test failed", error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
