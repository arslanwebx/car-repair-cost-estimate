"use client";

import { FormEvent, useState } from "react";

function responseMessage(body: unknown, key: "error" | "message", fallback: string) {
  if (typeof body !== "object" || body === null || !(key in body)) return fallback;
  const value = (body as Record<string, unknown>)[key];
  return typeof value === "string" && value.trim() ? value : fallback;
}

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setMessage("");
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        body: form,
        signal: AbortSignal.timeout(12_000),
      });
      const body: unknown = await response.json();
      if (!response.ok) throw new Error(responseMessage(body, "error", "The message service returned an invalid response."));
      setStatus("sent");
      setMessage(responseMessage(body, "message", "Your message was sent."));
      event.currentTarget.reset();
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error && error.name !== "TimeoutError"
        ? error.message
        : "Your message could not be sent. Email support@carspect.pro instead.");
    }
  }

  return <form className="contact-form" onSubmit={submit}>
    <div className="form-grid">
      <label>Name<input name="name" required maxLength={80} /></label>
      <label>Email<input name="email" type="email" required maxLength={160} /></label>
      <label className="span-2">Reason<select name="reason" required defaultValue="">
        <option value="" disabled>Select a reason</option>
        {["Estimate support", "Photo or data deletion", "Incorrect vehicle information", "Report feedback", "Privacy request", "Partnership inquiry", "General question"].map(value => <option key={value}>{value}</option>)}
      </select></label>
      <label className="span-2">Subject<input name="subject" required maxLength={120} /></label>
      <label className="span-2">Message<textarea name="message" required minLength={20} maxLength={3000} rows={7} /></label>
      <label className="span-2 check"><input type="checkbox" name="privacy" value="accepted" required /> I understand that I should not include photos, a full VIN, insurance documents, or other sensitive records.</label>
      <label className="honeypot" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
    </div>
    <button className="button" type="submit" disabled={status === "sending"}>{status === "sending" ? "Sending…" : "Send Message"}</button>
    {message && <div className={status === "sent" ? "success" : "error"} role="status">{message}</div>}
  </form>;
}
