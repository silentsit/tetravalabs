# Paymento setup for Tetrava Labs

Tetrava uses **Paymento** for multi-coin crypto checkout (USDT, ETH, SOL, etc.) alongside **BTCPay** for Bitcoin. The same dual-provider pattern as [Modempic](https://github.com/silentsit/modempic).

## Architecture

```
Customer selects crypto asset at checkout
         │
         ├─ BTC ──→ BTCPay invoice (on-chain / Lightning)
         │
         └─ USDT, ETH, SOL, … ──→ Paymento hosted gateway
                    │
                    ├─ POST /store/payments/crypto-intent (Medusa on Render)
                    └─ IPN webhook → /webhooks/payments/paymento
```

Both providers write to the same `crypto_payment_intents` table and send confirmation email on `completed`.

## How BTCPay and Paymento interact (Modempic pattern)

| Rule | Behavior |
|------|----------|
| Asset routing | **BTC** → BTCPay; all other accepted assets → Paymento |
| Override | `CRYPTO_PROVIDER=btcpay` or `paymento` forces one gateway for all assets (debug) |
| Availability | Storefront only shows assets whose gateway is configured |
| Webhooks | Separate endpoints; each updates order payment state independently |
| No cross-talk | BTCPay never handles USDT; Paymento never handles BTC (unless override) |

Modempic reference files:

- `web/src/lib/payments/crypto-provider.ts` — routing logic
- `web/src/lib/checkout/checkout-payment-sessions.ts` — creates BTCPay invoice or Paymento request
- `web/src/lib/actions/checkout.ts` — dispatches by resolved provider
- `web/src/app/api/webhooks/paymento/route.ts` — IPN with HMAC verify + `paymentoVerifyToken`

Tetrava ports this into Medusa:

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
CRYPTO_PROVIDER=paymento
```

Keep existing BTCPay vars for Bitcoin:

```
BTCPAY_URL=https://btcpay.modempic.com
BTCPAY_API_KEY=...
BTCPAY_STORE_ID=...
BTCPAY_WEBHOOK_SECRET=...
```

Save → redeploy Medusa.

## Step 4 — Verify

```powershell
cd C:\Users\daryl\Downloads\Tetravalabs
npm run paymento:setup -- --test
```

Checkout smoke test with a non-BTC asset (once storefront asset picker is live):

```powershell
# BTC still uses BTCPay
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
- **BTC**: redirect to BTCPay checkout URL.
- **Other**: redirect to Paymento gateway URL (`app.paymento.io/gateway?token=…`).

See also: [doc/btcpay-setup.md](./btcpay-setup.md) for Bitcoin-specific setup.

## Troubleshooting "Test link" in Paymento dashboard

| Response | Meaning | Fix |
|----------|---------|-----|
| **404 Not Found** | Medusa does not have the webhook route yet | Commit + push Paymento code, redeploy `tetrava-medusa` on Render |
| **501 Not configured** | Route exists but `PAYMENTO_*` env vars missing on Render | Add `PAYMENTO_API_KEY` + `PAYMENTO_SECRET_KEY`, redeploy |
| **401 Unauthorized** on POST | Expected for unsigned test pings — real IPNs include `X-Hmac-Sha256-Signature` | Normal; verify with a real checkout payment |
| **200** on GET | Endpoint is live | Good — save IPN URL in Paymento |

Quick check after deploy:

```powershell
Invoke-WebRequest -Uri "https://tetrava-medusa.onrender.com/webhooks/payments/paymento" -UseBasicParsing
```

Should return **200** with `"provider":"paymento"`. Compare: BTCPay webhook returns **401** on unsigned POST (also correct).
