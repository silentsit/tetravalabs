# Sanity Content Plan

Sanity powers blog posts, category SEO blocks, and optional legal page copy. Commerce data stays in Medusa.

## Schemas (packages/sanity-studio)

- `researchArticle` — title, slug, excerpt, body, publishedAt, category (Protocols | Analytical | Compliance), readTimeMinutes
- `categorySeoBlock` — categorySlug, introCopy, supportingCopy, seoTitle, seoDescription
- `legalPage` — type (terms/privacy/refund/ruo), content, version, publishedAt

## Storefront integration

- `apps/storefront/src/lib/sanity.ts` — GROQ fetch with static fallbacks
- Category pages read `getCategorySeoBlock(slug)`
- Legal pages can read `getLegalPage(type)` (fallback to static JSX where not wired)

## Bootstrap

Source of truth for live Research Hub posts: **Sanity** (`researchArticle`, published). JSON at `apps/storefront/src/data/research-articles.json` is the outage fallback and seed source.

```bash
# apps/storefront/.env.local
SANITY_PROJECT_ID=...
SANITY_DATASET=production
SANITY_API_WRITE_TOKEN=...

# Push JSON → Sanity (all 16 KEPT_BLOG_SLUGS) + homepage-link patches
npm run sanity:sync-blog

# Legacy one-way seed (creates missing docs only; does not full-sync)
npm run sanity:seed
```

## Article inventory (16 live slugs)

All slugs in `apps/storefront/src/lib/retired-blog-slugs.ts` (`KEPT_BLOG_SLUGS`). Categories include Protocols, Analytical, and Compliance sourcing guides.

## Publishing flow

1. Editor publishes in Sanity Studio (`packages/sanity-studio`).
2. Sanity webhook POSTs to storefront `/api/revalidate`.
3. Storefront invalidates paths and Sanity cache tags.

### Webhook configuration (sanity.io/manage → API → Webhooks)

- **URL:** `https://tetravalabs.com/api/revalidate`
- **Dataset:** production
- **Trigger:** Create, update, delete
- **Filter:** `_type in ["researchArticle", "categorySeoBlock", "legalPage"]`
- **HTTP method:** POST
- **Headers:** `x-revalidate-secret: <REVALIDATE_SECRET>` (same as Vercel env)
- **Body (JSON):**

```json
{
  "type": "{{_type}}",
  "slug": "{{slug.current}}",
  "categorySlug": "{{categorySlug}}",
  "legalType": "{{type}}"
}
```

Only fields present on the document type are sent; unused keys are ignored.

## SEO

- Category metadata from `seoTitle` / `seoDescription` when set
- Blog pages output `Article` JSON-LD via existing SEO helpers
- See `doc/cloudflare-setup.md` for edge cache + webhook notes
