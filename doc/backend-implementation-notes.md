# Tetrava Backend Implementation Notes

Current state after baseline implementation:

- `apps/storefront` is now a functional Next.js App Router storefront (shop/search/PDP/cart/checkout/account/orders/COA library).
- `apps/medusa` exposes custom COA, compliance, and crypto webhook routes backed by Postgres.
- `packages/catalog` now supports normalization, Medusa import, and Typesense indexing.

## Implemented Data Flow

1. Run `npm run catalog:normalize` from workspace root.
2. Start Medusa (`npm run medusa:dev`) and bootstrap admin (`npm --prefix apps/medusa run bootstrap:admin`) once.
3. Import products (`npm run catalog:import`).
4. Optional: index products into Typesense (`npm run typesense:index`).
5. Storefront consumes `/store/products`, `/store/coas`, and local checkout/account flows.

## Catalog Mapping

- Product = compound name grouped by category.
- Variant = strength/size row from source pricing file.
- Price = USD cents.
- Metadata includes:
  - source category and visual type
  - RUO flag
  - enrichment fields (`cas_number`, `molecular_formula`, `molecular_weight`, `storage`, `appearance`)
  - variant dosage parsing (`dosage_mg`)

## COA / Compliance / Payments

- SQL schema: `apps/medusa/src/modules/lab/sql/001_create_lab_tables.sql`.
- Apply schema: `npm --prefix apps/medusa run db:lab-schema`.
- Import sample COA docs: `npm --prefix apps/medusa run coa:import-sample`.
- COA API:
  - `GET /store/coas?variant_id=...`
  - `GET /store/coas?limit=...` (recent library view)
- Compliance API:
  - `POST /store/compliance/acknowledge` (records RUO compliance payloads)
- Payment webhook API:
  - `POST /webhooks/payments/crypto` (verifies signatures, stores event audit rows)
