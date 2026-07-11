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
- `src/lib/report-pdf.tsx`: server-only live report PDF generator.

Photos are decoded and re-encoded by Sharp to remove EXIF metadata, sent to the configured AI provider, and not persisted by the current implementation. AI absence and inadequate images produce explicit errors rather than a fabricated result.

## Routes

`/`, `/estimate`, `/sample-estimates`, four `/sample-estimates/[slug]` reports, `/about-us`, `/contact-us`, `/privacy-policy`, `/terms-of-service`, `/disclaimer`, `/cookie-policy`, `/photo-data-policy`, `/editorial-policy`, `/blog`, `/api/estimate`, `/api/report/pdf`, `/api/vehicles`, `/robots.txt`, and `/sitemap.xml`. Legacy policy and company URLs redirect to the canonical route names. The empty blog is noindex/follow and excluded from the sitemap.

## Deployment notes

The estimator processes photos in memory and does not create private report links or persistent estimate records. This keeps the current deletion behavior immediate: clearing the browser workflow removes the local draft and there is no Carspect database copy. The NHTSA proxy fails open to manual vehicle entry. Contact submissions are sent only to `support@carspect.pro` through Resend; when `RESEND_API_KEY` is absent, users receive an explicit support-email fallback instead of a false success state. Replace the in-memory rate limiter with a shared store before multi-instance production deployment.
