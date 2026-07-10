import { NextResponse } from "next/server";
import sharp from "sharp";
import { reportSchema } from "@/lib/report-schema";
import { createReportPdf } from "@/lib/report-pdf";
export const runtime="nodejs";
export async function POST(request:Request){try{const data=await request.formData();const raw=data.get("report");if(typeof raw!=="string")return NextResponse.json({error:"Report data is missing."},{status:400});const report=reportSchema.parse(JSON.parse(raw));const photo=data.get("photo");let image:string|undefined;if(photo instanceof File&&photo.size<=10*1024*1024){const sanitized=await sharp(Buffer.from(await photo.arrayBuffer())).rotate().resize({width:1400,height:900,fit:"inside",withoutEnlargement:true}).jpeg({quality:82}).toBuffer();image=`data:image/jpeg;base64,${sanitized.toString("base64")}`}const pdf=await createReportPdf(report,image);return new NextResponse(new Uint8Array(pdf),{headers:{"Content-Type":"application/pdf","Content-Disposition":`attachment; filename="carspect-${report.id}.pdf"`}})}catch{return NextResponse.json({error:"The PDF could not be generated from this report. Please print the estimate or try again."},{status:400})}}
