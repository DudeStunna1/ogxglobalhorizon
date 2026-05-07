# ogxglobalhorizon
Central repository for www.ogxglobalhorizon.com and its symbiotic Cloudflare subdomains powered by OGX PRIME.

## Local development
- `npm install`
- `npm run build`

## Deployment
- `npm run deploy` (Cloudflare Worker + static assets in `dist/`)

## Hosting automation
- Netlify build command: `npm install && npm run build`
- Netlify publish directory: `dist/`
