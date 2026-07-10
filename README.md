# Carspect

Carspect is a Next.js App Router application for generating an AI-assisted, itemized U.S. car body repair cost range from vehicle details and damage photos.

[GET YOUR CAR DAMAGE ESTIMATE NOW!](https://carspect.pro/)

## Setup

1. Install Node.js 20 or newer.
2. Copy `.env.example` to `.env.local` and configure the server-only AI key and model.
3. Run `npm install`, `npm test`, then `npm run dev`.
4. Before launch, replace the contact address and legal owner placeholders, review pricing configuration with an automotive estimator, and connect durable distributed rate limiting for multi-instance hosting.

## Architecture

- `src/lib/ai/provider.ts`: vision-provider boundary and strict response validation.
- `src/lib/pricing.ts`: deterministic pricing calculation.
- `src/config/pricing.v1.ts`: versioned market configuration.
- `src/app/api/estimate/route.ts`: input/file validation, image sanitization, rate limiting, analysis, and pricing.
- `src/components/estimator.tsx`: accessible six-step client workflow.

Photos are decoded and re-encoded by Sharp to remove EXIF metadata, sent to the configured AI provider, and not persisted by the current implementation. AI absence and inadequate images produce explicit errors rather than a fabricated result.

## Routes

`/`, `/about`, `/contact`, `/privacy`, `/terms`, `/disclaimer`, `/cookies`, `/photo-data-policy`, `/blog`, `/api/estimate`, `/robots.txt`, and `/sitemap.xml`. The empty blog is noindex/follow and excluded from the sitemap.

## Current milestone limitations

Node.js is not installed in the authoring environment, so dependency installation, tests, and production build still need to run. PDF download, NHTSA lookup/VIN decoding, durable database/storage retention, distributed rate limiting, contact-form delivery, and cookie-consent UI remain planned work. The interface does not expose nonworking buttons for those capabilities.
