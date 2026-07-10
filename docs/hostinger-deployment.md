# Hostinger deployment settings

Use Hostinger’s **Node.js Web App** deployment, not a static website deployment.

- Framework preset: `Next.js`
- Node.js version: `22.x` or `24.x`
- Install command: `npm ci`
- Build command: `npm run build`
- Start command: `npm run start`
- Entry file when Hostinger asks for one: `server.js`
- Output directory when Hostinger asks for one: `.next`
- Health URL: `/api/health`

Required production environment variables:

- `NODE_ENV=production`
- `NEXT_PUBLIC_SITE_URL=https://carspect.pro`
- `AI_API_KEY` or `OPENAI_API_KEY` for live photo analysis
- `AI_VISION_MODEL=gpt-4o-mini`
- `RESEND_API_KEY` for contact-form delivery
- `CONTACT_FROM_EMAIL=Carspect Website <website@carspect.pro>` using a verified Resend domain

After changing settings, use **Settings and redeploy**, inspect the deployment log, and then use **Restart** from the Node.js application dashboard if the process is not marked Running.
