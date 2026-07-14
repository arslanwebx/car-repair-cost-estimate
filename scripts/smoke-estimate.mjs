import { readFile } from "node:fs/promises";

const input={vehicle:{year:2021,make:"Honda",model:"Civic",bodyStyle:"sedan",mileage:"50k_100k",fuelType:"gas"},damage:{areas:["rear_bumper"],types:["dent_with_paint_damage"],description:"Rear bumper dent with scraped paint.",safeToDrive:"yes",fluidsLeaking:false,airbagsDeployed:false},preferences:{zipCode:"75201",parts:"all"}};
const form=new FormData();
const photo=new File([await readFile("public/images/honda-civic-rear-bumper.webp")],"damage.webp",{type:"image/webp"});
form.set("input",JSON.stringify(input));
form.set("confirmedContradiction","false");
form.set("photos",photo);
const baseUrl=(process.env.SMOKE_BASE_URL??"http://localhost:3000").replace(/\/$/,"");
try {
  const response=await fetch(`${baseUrl}/api/estimate`,{method:"POST",body:form,signal:AbortSignal.timeout(60_000)});
  const report=await response.json();
  if(!response.ok||!report.id||!report.estimate?.items?.length)throw new Error(JSON.stringify(report));
  const pdfForm=new FormData();
  pdfForm.set("report",JSON.stringify(report));
  pdfForm.set("photo",photo);
  const pdfResponse=await fetch(`${baseUrl}/api/report/pdf`,{method:"POST",body:pdfForm,signal:AbortSignal.timeout(30_000)});
  const pdfBytes=new Uint8Array(await pdfResponse.arrayBuffer());
  if(!pdfResponse.ok||new TextDecoder().decode(pdfBytes.subarray(0,5))!=="%PDF-")throw new Error("Live report PDF validation failed.");
  console.log(JSON.stringify({status:response.status,id:report.id,analysisMode:report.analysisMode,confidence:report.vision.confidence,items:report.estimate.items.length,total:report.estimate.total,pricingVersion:report.estimate.pricingVersion,pdfBytes:pdfBytes.length},null,2));
} catch (error) {
  console.error("Estimate smoke test failed", error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
