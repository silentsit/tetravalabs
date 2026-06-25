# Deployment Plan

## Runtime Split

- Storefront: Vercel (`apps/storefront`).
- Commerce API: Medusa v2 (`apps/medusa`) on Render/Railway/Fly/VPS.
- Database: Neon PostgreSQL.
- Redis: Upstash Redis (`rediss://` connection string on Medusa — not the redis-cli command).
- Search: Typesense Cloud (env on Medusa only; no Render search service).
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
- `REDIS_URL` (Upstash TLS URL, e.g. `rediss://default:TOKEN@....upstash.io:6379`)
- `STORE_CORS`
- `ADMIN_CORS`
- `AUTH_CORS`
- `JWT_SECRET`
- `COOKIE_SECRET`
- `CRYPTO_PROVIDER`
- `CRYPTO_WEBHOOK_SECRET`
- `R2_*` or S3 credentials
- `RESEND_API_KEY`
- `TYPESENSE_PROTOCOL=https`
- `TYPESENSE_HOST` (Typesense Cloud cluster hostname)
- `TYPESENSE_PORT=443`
- `TYPESENSE_API_KEY`
- `TYPESENSE_COLLECTION=products`
- `TYPESENSE_SYNC_SECRET`

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

**Required:** In Vercel Project Settings → General → **Root Directory**, set `apps/storefront`.

Without this, Vercel builds from the monorepo root and fails with errors like:
- `No Next.js version detected`
- `The Next.js output directory ".next" was not found at "/vercel/path0/.next"`

That second error happens when the build writes to `apps/storefront/.next` but Vercel looks for `.next` at the repo root.

### Vercel dashboard settings

| Setting | Value |
|---------|-------|
| Root Directory | `apps/storefront` |
| Framework Preset | Next.js |
| Build Command | leave empty (uses `npm run build` from `vercel.json`) |
| Output Directory | **leave empty** — do not set `.next` manually |
| Install Command | leave empty (uses `cd ../.. && npm ci` from `vercel.json`) |
| Include source files outside Root Directory | **Enabled** (needed for monorepo lockfile + workspace install) |
| Node version | `20.x` (`.nvmrc` + `engines` in package.json) |

Required env: see `apps/storefront/.env.example`

## Render (Medusa)

- Blueprint: `render.yaml` at repo root (single web service: `tetrava-medusa`)
- Search: **Typesense Cloud** — configure `TYPESENSE_*` on Medusa; do not run Typesense on Render
- `preDeployCommand` runs `db:migrate`, `db:lab-schema`, and `typesense:index`
- Required env: see `apps/medusa/.env.example`
- Print full mapping: `npm run deploy:env`

## Smoke Tests

- Local: `npm run smoke:local`
- Production: `SMOKE_STOREFRONT_URL=... SMOKE_MEDUSA_URL=... npm run smoke:production`
