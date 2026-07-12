import path from "node:path";
import { readFile } from "node:fs/promises";
import sharp from "sharp";
import { NextResponse } from "next/server";
import { getSampleEstimate } from "@/data/sample-estimates";
import { createSamplePdf } from "@/lib/sample-pdf";
import { withConcurrencyLimit, WorkloadBusyError } from "@/lib/concurrency";
export const runtime="nodejs";
export async function GET(request:Request,{params}:{params:Promise<{slug:string}>}){const {slug}=await params;const sample=getSampleEstimate(slug);if(!sample)return NextResponse.json({error:"Sample estimate not found."},{status:404});try{return await withConcurrencyLimit("pdf-generation",1,async()=>{const source=await readFile(path.join(process.cwd(),"public",sample.image));const file=await sharp(source,{limitInputPixels:40_000_000,sequentialRead:true}).timeout({seconds:20}).jpeg({quality:84}).toBuffer();if(request.signal.aborted)throw request.signal.reason;const pdf=await createSamplePdf(sample,`data:image/jpeg;base64,${file.toString("base64")}`);return new NextResponse(new Uint8Array(pdf),{headers:{"Content-Type":"application/pdf","Content-Disposition":`attachment; filename="carspect-${slug}.pdf"`,"Cache-Control":"public, max-age=3600, stale-while-revalidate=86400"}})})}catch(error){if(error instanceof WorkloadBusyError)return NextResponse.json({error:"PDF generation is busy. Please wait a moment and try again."},{status:503,headers:{"Retry-After":"5"}});return NextResponse.json({error:"The sample PDF could not be generated. Please try again."},{status:500})}}
