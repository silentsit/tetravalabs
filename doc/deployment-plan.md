# Deployment Plan

## Runtime Split

- Storefront: Vercel (`apps/storefront`).
- Commerce API: Medusa v2 (`apps/medusa`) on Render/Railway/Fly/VPS.
- Database: Neon PostgreSQL.
- Redis: Upstash Redis.
- COA files: Cloudflare R2 or S3.
- Security edge: Cloudflare DNS + WAF.

## Environment Sets

Create separate env sets for:

- local
- preview / staging
- production

### Storefront env

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_MEDUSA_URL`
- `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`
- `REVALIDATE_SECRET`

### Medusa env

- `DATABASE_URL`
- `REDIS_URL`
- `STORE_CORS`
- `ADMIN_CORS`
- `AUTH_CORS`
- `JWT_SECRET`
- `COOKIE_SECRET`
- `CRYPTO_PROVIDER`
- `CRYPTO_WEBHOOK_SECRET`
- `R2_*` or S3 credentials
- `RESEND_API_KEY`

## Rollout Order

1. Deploy Medusa on Render using `render.yaml` (Blueprint sync).
2. Set Neon `DATABASE_URL`, Upstash `REDIS_URL`, and CORS env vars on Render.
3. Run DB migration + lab schema (handled by Render `preDeployCommand`).
4. Bootstrap admin and import catalog (`catalog:import`, optional `typesense:index`).
5. Deploy storefront on Vercel with root directory `apps/storefront`.
6. Set storefront env vars pointing at the Render Medusa URL + publishable key.
7. Enable payment webhook and revalidation webhook.
8. Put Cloudflare in front and verify WAF + bot rules.

## Vercel (Storefront)

- Root directory: `apps/storefront`
- Install command: `cd ../.. && npm ci` (configured in `apps/storefront/vercel.json`)
- Required env: see `apps/storefront/.env.example`

## Render (Medusa)

- Blueprint: `render.yaml` at repo root
- `preDeployCommand` runs `db:migrate` + `db:lab-schema`
- Required env: see `apps/medusa/.env.example`
- Print full mapping: `npm run deploy:env`

## Smoke Tests

- Local: `npm run smoke:local`
- Production: `SMOKE_STOREFRONT_URL=... SMOKE_MEDUSA_URL=... npm run smoke:production`
