import path from "node:path";
import { readFile } from "node:fs/promises";
import sharp from "sharp";
import { NextResponse } from "next/server";
import { getSampleEstimate } from "@/data/sample-estimates";
import { createSamplePdf } from "@/lib/sample-pdf";
export const runtime="nodejs";
export async function GET(_:Request,{params}:{params:Promise<{slug:string}>}){const {slug}=await params;const sample=getSampleEstimate(slug);if(!sample)return NextResponse.json({error:"Sample estimate not found."},{status:404});try{const source=await readFile(path.join(process.cwd(),"public",sample.image));const file=await sharp(source).jpeg({quality:84}).toBuffer();const pdf=await createSamplePdf(sample,`data:image/jpeg;base64,${file.toString("base64")}`);return new NextResponse(new Uint8Array(pdf),{headers:{"Content-Type":"application/pdf","Content-Disposition":`attachment; filename="carspect-${slug}.pdf"`,"Cache-Control":"public, max-age=3600"}})}catch{return NextResponse.json({error:"The sample PDF could not be generated. Please try again."},{status:500})}}
