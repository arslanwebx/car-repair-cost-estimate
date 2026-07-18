"use client";

import { FormEvent, useState } from "react";

type Status = "idle" | "sending" | "sent" | "error";

export function NewsletterForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setMessage("");
    try {
      const response = await fetch("/api/newsletter", { method: "POST", body: new FormData(event.currentTarget), signal: AbortSignal.timeout(12_000) });
      const body: unknown = await response.json();
      const text = typeof body === "object" && body !== null && "message" in body ? String(body.message) : "Your subscription could not be completed.";
      if (!response.ok) throw new Error(typeof body === "object" && body !== null && "error" in body ? String(body.error) : text);
      setStatus("sent");
      setMessage(text);
      event.currentTarget.reset();
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error && error.name !== "TimeoutError" ? error.message : "Your subscription could not be completed. Please email support@carspect.pro.");
    }
  }

  return <form className="newsletter-form" onSubmit={submit}>
    <label className="sr-only" htmlFor="newsletter-email">Email address</label>
    <input id="newsletter-email" name="email" type="email" autoComplete="email" placeholder="Email address" required maxLength={160} />
    <label className="honeypot" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
    <button type="submit" disabled={status === "sending"}>{status === "sending" ? "Joining…" : "Subscribe"}</button>
    {message && <p className={`newsletter-message ${status}`} role="status">{message}</p>}
  </form>;
}
