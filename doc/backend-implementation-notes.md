# Tetrava Backend Implementation Notes

This workspace now contains a production-aligned scaffold:

- `app/` keeps the Kimi prototype unchanged as visual reference.
- `apps/storefront` is the Next.js App Router production storefront shell.
- `apps/medusa` is the Medusa v2 backend scaffold with RUO/payment/COA route placeholders.
- `packages/catalog` handles normalization and Medusa import from `product_catalog_usd.json`.

## Implemented Data Flow

1. Run `npm run catalog:normalize` from workspace root.
2. Start Medusa and generate admin token + sales channel.
3. Run `npm run catalog:import` with Medusa env variables.
4. Storefront reads products from `/store/products`.

## Catalog Mapping

- Product = compound name + category grouping.
- Variant = strength or size entry.
- Price = USD cents.
- Metadata includes source category, visual type, RUO source flag.

## COA And Compliance

- SQL bootstrap created in `apps/medusa/src/modules/lab/sql/001_create_lab_tables.sql`.
- Store endpoint placeholder: `GET /store/coas?variant_id=...`.
- Compliance ack endpoint placeholder: `POST /store/compliance/acknowledge`.
- Crypto webhook endpoint placeholder: `POST /webhooks/payments/crypto`.

These route handlers are in place and ready for service wiring to Medusa workflows.
