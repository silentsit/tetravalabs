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

1. Deploy Medusa first.
2. Run DB migration/SQL for lab tables.
3. Normalize + import catalog.
4. Deploy storefront against Medusa endpoint.
5. Enable payment webhook and revalidation webhook.
6. Put Cloudflare in front and verify WAF + bot rules.
