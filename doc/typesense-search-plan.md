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

- Initial full sync: `npm run typesense:index`
- Incremental: Medusa subscribers on `product.created`, `product.updated`, `product.deleted`
- Ops hook: `POST /hooks/typesense/sync` with header `x-typesense-sync-secret` (set `TYPESENSE_SYNC_SECRET`)
- Catalog import triggers full sync when `TYPESENSE_SYNC_SECRET` is set
