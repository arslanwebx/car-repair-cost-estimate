import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { takeRateLimit } from "@/lib/rate-limit";

const SUPPORT_EMAIL = "support@carspect.pro";
const schema = z.object({ email: z.string().trim().email().max(160), website: z.string().max(0) });

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "newsletter";
  if (!takeRateLimit(`newsletter:${ip}`).allowed) return NextResponse.json({ error: "Too many subscription attempts. Please wait and try again." }, { status: 429 });
  try {
    const input = schema.parse(Object.fromEntries(await request.formData()));
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) return NextResponse.json({ error: `Newsletter delivery is not configured. Please email ${SUPPORT_EMAIL} to subscribe.` }, { status: 503 });
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json", "Idempotency-Key": randomUUID() },
      body: JSON.stringify({ from: process.env.NEWSLETTER_FROM_EMAIL ?? process.env.CONTACT_FROM_EMAIL ?? "Carspect Website <website@carspect.pro>", to: [SUPPORT_EMAIL], reply_to: input.email, subject: "[Carspect newsletter] New subscriber", text: `New Carspect newsletter subscription\n\nEmail: ${input.email}` }),
      signal: AbortSignal.any([request.signal, AbortSignal.timeout(10_000)])
    });
    if (!response.ok) throw new Error(`Email provider returned ${response.status}`);
    return NextResponse.json({ message: "You’re on the Carspect updates list. Thank you for subscribing." });
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: "Enter a valid email address to subscribe." }, { status: 400 });
    console.error("Carspect newsletter delivery failed", { type: error instanceof Error ? error.name : "UnknownError", message: error instanceof Error ? error.message : "Unknown failure" });
    return NextResponse.json({ error: `The newsletter service is temporarily unavailable. Please email ${SUPPORT_EMAIL}.` }, { status: 503 });
  }
}
