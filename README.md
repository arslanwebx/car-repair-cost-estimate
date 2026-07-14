# Carspect

Carspect is a Next.js App Router application for generating an AI-assisted, itemized car body repair cost range from vehicle details and damage photos.

[GET YOUR CAR DAMAGE ESTIMATE NOW!](https://carspect.pro/)

## Setup

1. Install Node.js 20 or newer.
2. Copy `.env.example` to `.env.local` and configure the server-only AI key and model.
3. Run `npm install`, `npm test`, then `npm run dev`.
4. Before launch, replace the legal owner fields, review pricing configuration with a qualified automotive estimator, configure `RESEND_API_KEY` with a verified `carspect.pro` sender, and connect durable distributed rate limiting for multi-instance hosting.

## Architecture

- `src/lib/ai/provider.ts`: vision-provider boundary and strict response validation.
- `src/lib/pricing.ts`: deterministic pricing calculation.
- `src/config/workbook-pricing.v1.json`: workbook-derived U.S. and global market configuration.
- `scripts/generate_workbook_pricing.py`: reproducible workbook-to-JSON importer.
- `src/app/api/estimate/route.ts`: input/file validation, image sanitization, rate limiting, analysis, and pricing.
- `src/components/estimator.tsx`: accessible seven-stage client workflow with append-only photo selection, duplicate detection, recovery, and report actions.
- `src/data/sample-estimates.ts`: four validated demonstration estimates shared by cards, reports, and PDFs.
- `src/lib/report-pdf.ts`: server-only live report PDF generator.

Photos are decoded and re-encoded to remove EXIF metadata, sent to the configured AI provider, and not persisted by the current implementation. Cloudflare uses its Images binding for this step, while the Node deployment uses Sharp. Inadequate photos produce an explicit request for better images. If the AI provider is unavailable, the site can still produce a clearly labeled, limited-confidence range from the user-selected damage; all dollar amounts continue to come from the deterministic workbook pricing engine.

## Routes

`/`, `/estimate`, `/sample-estimates`, four `/sample-estimates/[slug]` reports, `/about-us`, `/contact-us`, `/privacy-policy`, `/terms-of-service`, `/disclaimer`, `/cookie-policy`, `/photo-data-policy`, `/editorial-policy`, `/blog`, `/api/estimate`, `/api/report/pdf`, `/api/vehicles`, `/robots.txt`, and `/sitemap.xml`. Legacy policy and company URLs redirect to the canonical route names. The empty blog is noindex/follow and excluded from the sitemap.

## Deployment notes

The estimator processes photos in memory and does not create private report links or persistent estimate records. This keeps the current deletion behavior immediate: clearing the browser workflow removes the local draft and there is no Carspect database copy. The NHTSA proxy fails open to manual vehicle entry. Contact submissions are sent only to `support@carspect.pro` through Resend; when `RESEND_API_KEY` is absent, users receive an explicit support-email fallback instead of a false success state. Replace the in-memory rate limiter with a shared store before multi-instance production deployment.

### Cloudflare Workers

This full-stack Next.js application deploys through Cloudflare Workers with the OpenNext adapter; it is not a static Pages export. The default build now generates both the Next.js output and the `.open-next` Worker bundle, so both the recommended commands and Cloudflare's auto-detected Wrangler deploy path work. In Workers Builds, use:

- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`
- Root directory: `/`
- Node.js version: `22`

Add `AI_PROVIDER`, `AI_API_KEY` (or `OPENAI_API_KEY`), `AI_VISION_MODEL`, `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, the rate-limit values, and any public `NEXT_PUBLIC_*` values under **Build Variables and secrets**. Add `AI_API_KEY`/`OPENAI_API_KEY` and `RESEND_API_KEY` as encrypted runtime secrets as well. The committed `wrangler.jsonc` deliberately gives the Worker and its self-service binding the same `carspect-pro` name.

The estimate and PDF routes use the Cloudflare Images binding to validate, re-encode, resize, and strip metadata from uploaded photos. Cloudflare Images transformations may be billed by Cloudflare. The existing Node/Hostinger runtime continues to use Sharp as a local fallback.

`npm run cf:build` remains an alias for the default Cloudflare build. For a local production-runtime check, run `npm run preview`. To build and deploy from a signed-in local shell, run `npm run deploy`.
