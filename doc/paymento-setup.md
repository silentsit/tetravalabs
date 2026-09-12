# Paymento setup for Tetrava Labs

Tetrava uses **Paymento** for crypto checkout (BTC, USDT, ETH, SOL, etc.).

## Architecture

```
Customer selects crypto asset at checkout
         │
         └─ BTC, USDT, ETH, SOL, … ──→ Paymento hosted gateway
                    │
                    ├─ POST /store/payments/crypto-intent (Medusa on Render)
                    └─ IPN webhook → /webhooks/payments/paymento
```

Paymento writes to `crypto_payment_intents` and sends confirmation email on `completed`.

## Medusa routes

- `apps/medusa/src/lib/crypto-provider.ts`
- `apps/medusa/src/lib/paymento.ts`
- `apps/medusa/src/api/store/payments/crypto-intent/route.ts`
- `apps/medusa/src/api/webhooks/payments/paymento/route.ts`

## Step 1 — Paymento merchant account

1. Sign up at [paymento.io](https://paymento.io).
2. Connect wallets for each coin you want to accept (USDT, USDC, ETH, etc.).
3. Note your **API key** and **Secret key** (used for IPN HMAC).

## Step 2 — Configure IPN callback

In Paymento dashboard → **IPN / Payment callback**:

| Field | Value |
|-------|--------|
| Callback URL | `https://tetrava-medusa.onrender.com/webhooks/payments/paymento` |

Paymento signs the raw JSON body with HMAC-SHA256 using your secret key. On status **7** (paid), Medusa calls Paymento's verify API before marking the intent `completed`.

## Step 3 — Add to Render

**Render → tetrava-medusa → Environment**

```
PAYMENTO_API_KEY=your_api_key
PAYMENTO_SECRET_KEY=your_secret_key
PAYMENTO_SPEED=1
STOREFRONT_URL=https://tetravalabs.com
```

Optional overrides:

```
PAYMENTO_API_BASE=https://api.paymento.io
PAYMENTO_GATEWAY_BASE=https://app.paymento.io/gateway
```

Save → redeploy Medusa.

## Step 4 — Verify

```powershell
cd C:\Users\user\Downloads\Tetravalabs
npm run paymento:setup -- --test
```

Checkout smoke test:

```powershell
npm run smoke:checkout
```

## Paymento IPN status codes

| Status | Meaning | Tetrava maps to |
|--------|---------|-----------------|
| 7 | Paid | `completed` (after verify API) |
| 4 | Timeout | `expired` |
| 5, 9 | Failed / cancelled | `failed` |
| Other | In progress | `pending` |

## Storefront behavior

- Checkout loads available assets from `GET /store/payments/crypto-options`.
- Customer picks asset → `POST /store/payments/crypto-intent` with `crypto_asset`.
- Redirect to Paymento gateway URL (`app.paymento.io/gateway?token=…`).

## Troubleshooting "Test link" in Paymento dashboard

| Response | Meaning | Fix |
|----------|---------|-----|
| **404 Not Found** | Webhook route not deployed yet | Push latest code and redeploy Medusa |
| **501 Not configured** | `PAYMENTO_*` env vars missing on Render | Add keys and redeploy |
| **401 Unauthorized** | HMAC signature missing or wrong secret | Ensure `PAYMENTO_SECRET_KEY` on Render matches Paymento dashboard exactly |
| **500 Internal Server Error** | Usually raw-body HMAC mismatch (fixed in `src/api/middlewares.ts` with `preserveRawBody: true`) | Redeploy after latest fix |
| **200** on GET or signed POST | Endpoint is live | Good — save IPN URL in Paymento |

Quick check after deploy:

```powershell
Invoke-WebRequest -Uri "https://tetrava-medusa.onrender.com/webhooks/payments/paymento" -UseBasicParsing
```

Should return **200** with `"provider":"paymento"`.
