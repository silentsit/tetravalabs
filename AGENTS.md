# AGENTS.md

## Cursor Cloud specific instructions

This is an npm-workspaces monorepo for **Tetrava Labs**, a research-peptide e-commerce
platform. The runtime product is a **Next.js 15 storefront** (`apps/storefront`, port 3000)
backed by a **Medusa v2 commerce backend** (`apps/medusa`, port 9000). See `README.md` for the
canonical Quick Start; the notes below only add non-obvious, durable context for running it
locally in the cloud VM.

### Services

| Service | Dir | Port | Run command (from repo root) | Required? |
|---|---|---|---|---|
| PostgreSQL 16 | (system) | 5432 | `sudo pg_ctlcluster 16 main start` | Required (Medusa datastore) |
| Medusa backend | `apps/medusa` | 9000 | `npm run medusa:dev` | Required |
| Next.js storefront | `apps/storefront` | 3000 | `npm run dev` | Required |
| Redis | — | 6379 | (not installed) | Optional — off by default (`USE_REDIS=false`); Medusa uses an in-memory fake Redis |
| Typesense | — | 8108 | (not installed) | Optional — storefront falls back to the Medusa catalog for search |

The update script only runs `npm install`. Everything below (Postgres, DB migrations, bootstrap,
catalog import, dev servers) is NOT automated and must be started/run manually per session.

### Env files (gitignored — recreate if missing)

- `apps/medusa/.env` — copy from `apps/medusa/.env.example`; for a fully local stack set
  `DATABASE_URL=postgres://postgres:postgres@localhost:5432/tetrava_medusa`, `USE_REDIS=false`,
  and `MEDUSA_ADMIN_EMAIL` / `MEDUSA_ADMIN_PASSWORD` (used by the bootstrap scripts).
- `apps/storefront/.env.local` — copy from `apps/storefront/.env.example`; for a fully local
  stack set `NEXT_PUBLIC_MEDUSA_URL=http://localhost:9000` and paste the
  `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` printed by `npm run medusa:bootstrap`.
  (By default `.env.example` points the storefront at the hosted Render Medusa instead.)

### First-time local bring-up (fresh database)

Postgres here is a native apt install (data in `/var/lib/postgresql`), not Docker. Start it with
`sudo pg_ctlcluster 16 main start`. The default `postgres` role password is `postgres` and the
`tetrava_medusa` database must exist (`createdb`). Then, from the repo root:

1. `npm --prefix apps/medusa run db:migrate` — core Medusa tables (run this BEFORE `db:lab-schema`; the README omits it but the lab SQL and bootstrap assume core tables exist).
2. `npm --prefix apps/medusa run db:lab-schema` — custom `lab` module tables.
3. `npm run catalog:normalize` — regenerates the storefront catalog + `*.generated.json` handle maps from `product_catalog_usd.json`.
4. `npm run medusa:dev` — start the backend (leave running).
5. `npm --prefix apps/medusa run bootstrap:admin` — creates the admin user.
6. `npm run medusa:bootstrap` — creates region/sales-channel/shipping, sets the store default region + USD currency (see gotcha below), and prints the publishable key.
7. `npm run catalog:import` — imports the 75 products into Medusa.
8. `npm run dev` — start the storefront (leave running).
9. `npm run smoke:local` — Storefront/Medusa/Store-products should pass; the Typesense check fails and is expected (Typesense is optional).

### Non-obvious gotchas

- **Store default region is required or every product page 404s.** A fresh Medusa store ships
  with `default_region_id = null` and `eur` as the only supported currency, but the catalog and
  region are USD. The storefront fetches `/store/products` with `calculated_price` and **no**
  `region_id`, which fails with `Missing required pricing context - region_id` unless a default
  region is set. `npm run medusa:bootstrap` (`bootstrap:store`) now sets `default_region_id` and
  makes the region currency (USD) the store default via `ensureStoreDefaults` — so this is handled
  automatically and the step is idempotent. Symptom if it is ever missing: shop grid shows prices
  (local catalog fallback) but all `/{handle}` product pages return 404. This setting persists in
  Postgres.
- **Checkout order completion works; hosted payment does not.** `POST /api/checkout` completes a
  real Medusa order using the `pp_system_default` provider even with no payment keys. The external
  hosted-payment step (BTCPay / Paymento / PeptidePay for crypto/card) requires third-party API
  keys, so the storefront's "Place order" button is gated (`cardAvailable`/`cryptoLive` are false)
  and shows a payment-provider message. This is expected in local dev — the order is still created
  in Medusa. Customer account registration works fully end-to-end.
- **Lint is not configured.** `npm run lint --workspace=@tetrava/storefront` runs `next lint`,
  which is interactive (prompts to set up ESLint) because there is no committed ESLint config, and
  CI does not run it. The effective static gate is the **build** (see below).

### Lint / test / build

- Tests: there is no automated unit/integration test suite in this repo.
- Lint: not configured (see gotcha above).
- Build (this is what CI runs — see `.github/workflows/ci.yml`):
  - `npm run build --workspace=@tetrava/medusa` (set `DATABASE_URL`; CI also sets `NODE_ENV=production DISABLE_MEDUSA_ADMIN=true`).
  - `npm run build --workspace=@tetrava/storefront` (writes to `.next`; stop the `next dev` server first to avoid clobbering the running dev server's `.next`, then restart `npm run dev` afterward).
  - `npm run build:vercel-root` verifies the Vercel root build path.
