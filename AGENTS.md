# AGENTS.md

## Cursor Cloud specific instructions

This is a monorepo ecommerce stack: a **Medusa v2 commerce API** (`apps/medusa`, port 9000) and a
**Next.js 15 storefront** (`apps/storefront`, port 3000), with catalog import scripts in
`packages/catalog`. The full bootstrap sequence is documented in `README.md` ("Quick Start"); the notes
below only capture non-obvious, durable gotchas for running it locally in the cloud VM.

### Node version
- The project requires **Node 20.x**. Node 20 is installed via `nvm` and set as the nvm default, and
  `~/.bashrc` sources `nvm`, so a login shell (and the update script's `npm install`) uses Node 20
  automatically. In a bare non-login shell, run `nvm use 20` first (the system also has a Node 22 on PATH).

### Backing services (not systemd-managed — start manually)
Postgres 16 and Redis are installed via apt; Typesense runs from a downloaded binary. None auto-start.
Start them with:
- Postgres: `sudo pg_ctlcluster 16 main start` (db `tetrava_medusa`, user/pass `postgres`/`postgres`)
- Redis: `sudo redis-server --daemonize yes`
- Typesense (optional, search): `/tmp/typesense-server --data-dir=/tmp/typesense-data --api-key=xyz --enable-cors`
  (re-download from `https://dl.typesense.org/releases/0.25.2/typesense-server-0.25.2-linux-amd64.tar.gz` if the binary is gone; re-index with `npm run typesense:index`).

### Local env files (gitignored, created during setup)
- `apps/medusa/.env` and `apps/storefront/.env` hold local config (DB/Redis URLs, CORS, the publishable
  key, Typesense). `apps/storefront/.env.local` is a copy of `.env` — the smoke test and Typesense index
  script read `.env.local` specifically (not `.env`).
- These persist in the VM snapshot. If recreating from scratch, set `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`
  (storefront) and `MEDUSA_PUBLISHABLE_KEY` (medusa) to the key printed by `npm run medusa:bootstrap`.

### Run order
1. Start Postgres/Redis (and Typesense if testing search).
2. Backend: `npm run medusa:dev` → http://localhost:9000 (admin at `/app`, health at `/health`).
3. Storefront: `npm run dev` → http://localhost:3000.
4. Smoke check: `npm run smoke:local` (expects all services up; reads `apps/storefront/.env.local`).

Admin user (local): `info@tetravalabs.com` / `supersecret123` (from `apps/medusa/.env`).

### Important gotcha: store pricing context (fresh DB only)
On a **fresh database**, after `npm run medusa:bootstrap` you must also set the store's
`default_region_id` to the US region and add `usd` as the default supported currency. Otherwise
`/store/products` (which requests `calculated_price`) returns 400 *"Missing required pricing context to
calculate prices - region_id"* and the storefront shows **"no products"**. The storefront's product
fetches do not pass `region_id`, so they rely on the store default region. Do it via the admin API
(`POST /admin/stores/{id}` with `supported_currencies:[{currency_code:"usd",is_default:true},...]` and
`default_region_id`). The current snapshot DB already has this configured.

### Known local limitation: Medusa /store/search proxy
With Typesense on the default port 8108, `GET /store/search` returns 502 because
`buildTypesenseBaseUrl` omits the port when it equals the protocol default, so it hits
`http://localhost:80`. Typesense indexing and direct Typesense queries work; the browse/cart flow does
not depend on search. This is pre-existing code behavior, not a setup issue.

### Lint
There is no ESLint config; `npm run lint` (`next lint`) is interactive/deprecated and not usable
non-interactively. Use `cd apps/storefront && npx tsc --noEmit` for type-checking instead.
