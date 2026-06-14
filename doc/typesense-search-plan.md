# Typesense Search Plan

Search is staged after core catalog + checkout stability.

## Collection Design

`products`

- `id` (string)
- `title` (string)
- `handle` (string)
- `category` (string)
- `strengths` (string[])
- `cas_number` (string, optional)
- `molecular_formula` (string, optional)
- `sequence` (string, optional)
- `visual_type` (string)
- `price_min` (int32)
- `price_max` (int32)

## Indexing Source

- Medusa product + variant records.
- Product metadata enrichment fields.
- Batch-level flags for COA availability.

## Query UX

- Exact identifier matching (CAS / peptide code).
- Fuzzy name matching.
- Filters by category, visual type, price range.

## Sync Strategy

- Initial full sync: `npm run typesense:index` (local or Render preDeploy)
- Incremental: Medusa subscribers on `product.created`, `product.updated`, `product.deleted`
- Ops hook: `POST /hooks/typesense/sync` with header `x-typesense-sync-secret` (set `TYPESENSE_SYNC_SECRET` on Medusa)
- Catalog import triggers full sync when `TYPESENSE_SYNC_SECRET` is set

### Typesense Cloud (recommended)

Set on **Render Medusa** (and locally in `apps/storefront/.env.local` for indexing):

- `TYPESENSE_PROTOCOL=https`
- `TYPESENSE_HOST=<cluster>.a1.typesense.net`
- `TYPESENSE_PORT=443`
- `TYPESENSE_API_KEY=<admin key>`
- `MEDUSA_PUBLISHABLE_KEY=<pk_...>` (for preDeploy index)

Storefront search uses Medusa `GET /store/search` — Vercel does not need Typesense env vars.
