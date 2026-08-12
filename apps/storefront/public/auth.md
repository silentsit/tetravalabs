# auth.md — Tetrava Labs

How AI agents should authenticate and act on behalf of a human user on [tetravalabs.com](https://tetravalabs.com).

> Research-use-only (RUO) storefront. Products are not for human consumption.
> Support: info@tetravalabs.com

## Status

Tetrava Labs does **not** currently offer agent self-registration, agent API keys, or WorkOS-style `/agent-auth` endpoints.

Agents may:

1. Read public discovery documents and public APIs listed below
2. Guide a human through browser-based account sign-in or guest checkout
3. Help a signed-in customer navigate account pages after the human completes OAuth/password login

Agents must **not**:

- Attempt to create accounts, place orders, or initiate payments without an explicit human in the loop
- Scrape `/account`, `/checkout`, `/cart`, or `/orders` (disallowed in `robots.txt`)
- Call private webhook, revalidation, or payment-completion endpoints

## Step 1 — Discover

| Resource | URL |
|----------|-----|
| API catalog (RFC 9727) | https://tetravalabs.com/.well-known/api-catalog |
| OpenAPI (public routes) | https://tetravalabs.com/openapi.json |
| Site context | https://tetravalabs.com/llms.txt |
| Sitemap index | https://tetravalabs.com/sitemap_index.xml |
| RUO policy | https://tetravalabs.com/ruo |
| Privacy | https://tetravalabs.com/privacy |
| Terms | https://tetravalabs.com/terms |

Homepage and HTML responses advertise these via HTTP `Link` headers (`rel="api-catalog"`, `describedby`, `sitemap`, `alternate`).

## Step 2 — Pick a method

| Goal | Method | Notes |
|------|--------|-------|
| Product research / search | Public API, no auth | `GET /api/search?q=` |
| Geo / shipping eligibility | Public API, no auth | `GET /api/geo`, `GET /api/compliance/restricted-countries` |
| Contact support | Public API, no auth | `POST /api/contact` |
| Restock alert | Public API, no auth | `POST /api/stock-notify` |
| Customer account | Human browser session | Email/password or Google/Apple OAuth at `/account` |
| Place an order | Human browser checkout | Guest checkout supported; payment instructions after order create |
| Order lookup | Human browser | `/orders` with email + order number |

There is no anonymous agent credential and no ID-JAG / OTP claim flow today.

## Step 3 — Register (human account only)

1. Open https://tetravalabs.com/account
2. Create an account with email/password, or continue with an enabled social provider (Google and/or Apple when configured)
3. Complete OAuth callback at `/account/oauth/{provider}/callback`
4. Session cookies are bound to the browser; do not export or replay them into unattended agent runtimes

Password reset: `/account/forgot-password` → `/account/reset-password`.

## Step 4 — Claim ceremony

Not applicable. Tetrava does not issue pre-claim agent credentials or OTP claim tokens.

If a future agent-auth protocol is enabled, this section will document the claim endpoints and required consent.

## Step 5 — Use credentials

- **Public APIs:** call without Authorization headers. Rate limits and abuse controls may apply.
- **Account/checkout:** require an interactive human session in the user’s browser. Present checkout/account URLs to the user; do not automate payment confirmation.
- **401 / private routes:** treat as out of scope for autonomous agents. Point the user to `/account` or `/contact`.

## Public API summary

See OpenAPI for request/response shapes:

- `GET /api/geo`
- `GET /api/search?q=`
- `GET /api/compliance/restricted-countries`
- `POST /api/contact`
- `POST /api/stock-notify`

## Errors

| Situation | Agent action |
|-----------|--------------|
| 400 on public write APIs | Fix payload using OpenAPI schemas; retry once |
| 401 / 403 on account or checkout | Stop; ask the human to sign in or complete checkout |
| 429 | Back off and retry later |
| Restricted shipping country | Surface `/shipping-restricted` / compliance list; do not bypass |

## Revocation

Customer accounts may be closed by contacting info@tetravalabs.com. There is no agent-credential revocation channel because no agent credentials are issued.

## Compliance reminder

All catalog products are sold for in-vitro / laboratory research only. Agents must preserve RUO framing and must not imply human or veterinary use.
