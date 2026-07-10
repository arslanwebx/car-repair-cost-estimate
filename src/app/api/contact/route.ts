import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { takeRateLimit } from "@/lib/rate-limit";

const SUPPORT_EMAIL="support@carspect.pro";
const schema=z.object({name:z.string().trim().min(2).max(80),email:z.string().email().max(160),reason:z.string().min(2).max(80),subject:z.string().trim().min(3).max(120),message:z.string().trim().min(20).max(3000),privacy:z.literal("accepted"),website:z.string().max(0)});

export async function POST(request:Request){
  const ip=request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()??"contact";
  if(!takeRateLimit(`contact:${ip}`).allowed)return NextResponse.json({error:"Too many messages were submitted. Please wait and try again."},{status:429});
  try{
    const form=await request.formData();
    const input=schema.parse(Object.fromEntries(form));
    const apiKey=process.env.RESEND_API_KEY;
    if(!apiKey)return NextResponse.json({error:`Email delivery is not configured. Please email ${SUPPORT_EMAIL} directly.`},{status:503});
    const response=await fetch("https://api.resend.com/emails",{method:"POST",headers:{Authorization:`Bearer ${apiKey}`,"Content-Type":"application/json","Idempotency-Key":randomUUID()},body:JSON.stringify({from:process.env.CONTACT_FROM_EMAIL??"Carspect Website <website@carspect.pro>",to:[SUPPORT_EMAIL],reply_to:input.email,subject:`[Carspect ${input.reason}] ${input.subject}`,text:[`New Carspect website submission`,``,`Name: ${input.name}`,`Email: ${input.email}`,`Reason: ${input.reason}`,`Subject: ${input.subject}`,``,`Message:`,input.message].join("\n")}),signal:AbortSignal.timeout(10_000)});
    if(!response.ok)throw new Error(`Email provider returned ${response.status}`);
    return NextResponse.json({message:`Your message was sent to ${SUPPORT_EMAIL}. Carspect support will reply by email.`});
  }catch(error){
    if(error instanceof z.ZodError)return NextResponse.json({error:"Review the contact details and try again."},{status:400});
    console.error("Carspect contact delivery failed",{type:error instanceof Error?error.name:"UnknownError",message:error instanceof Error?error.message:"Unknown failure"});
    return NextResponse.json({error:`The message service is temporarily unavailable. Please email ${SUPPORT_EMAIL}.`},{status:503});
  }
}
