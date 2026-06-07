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

- Initial full sync script.
- Incremental updates via Medusa product events/webhooks.
