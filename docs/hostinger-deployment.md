# Hostinger deployment settings

Use Hostinger’s **Node.js Web App** deployment, not a static website deployment.

- Framework preset: `Next.js`
- Node.js version: `24.x` (recommended LTS line for this deployment; `22.x` remains supported)
- Install command: `npm ci`
- Build command: `npm run build:next`
- Start command: `node server.js` (starts one Node.js process directly)
- Entry file when Hostinger asks for one: `server.js`
- Output directory when Hostinger asks for one: `.next`
- Health URL: `/api/health`

Use Hostinger's built-in Node.js process manager with one application instance. Do not add PM2, cluster mode, a second startup command, or a cron entry that launches the web server. The application already handles `SIGTERM`/`SIGINT` and performs a bounded graceful shutdown.

Required production environment variables:

- `NODE_ENV=production`
- `NEXT_PUBLIC_SITE_URL=https://carspect.pro`
- `AI_API_KEY` or `OPENAI_API_KEY` for live photo analysis
- `AI_VISION_MODEL=gpt-4o-mini`
- `RESEND_API_KEY` for contact-form delivery
- `CONTACT_FROM_EMAIL=Carspect Website <website@carspect.pro>` using a verified Resend domain

After changing settings, use **Settings and redeploy**, inspect the deployment log, and then use **Restart** from the Node.js application dashboard if the process is not marked Running.
