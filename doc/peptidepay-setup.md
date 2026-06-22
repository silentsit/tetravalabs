# Peptide Pay setup for Tetrava Labs

Tetrava uses **Peptide Pay** for card checkout (Visa, Mastercard, Amex, Apple Pay, Google Pay) alongside **BTCPay** (BTC) and **Paymento** (other crypto assets).

## Architecture

```
Checkout: payment_method = card | crypto
         │
         ├─ card ──→ Peptide Pay hosted checkout
         │              └─ webhook → /webhooks/payments/peptidepay
         │
         └─ crypto ──→ BTC → BTCPay
                       other → Paymento
```

All providers write to `crypto_payment_intents` with `provider = peptidepay | btcpay | paymento`.

## Step 1 — Merchant account

1. Sign up at [peptide-pay.com/signup](https://peptide-pay.com/signup).
2. Add your **Polygon USDC wallet** (self-custodial — MetaMask, Rabby, Ledger).
3. Copy **`sk_live_…`** and **`whsec_…`**.

## Step 2 — Render (Medusa)

**Render → tetrava-medusa → Environment**

```
PEPTIDEPAY_API_KEY=sk_live_…
PEPTIDEPAY_WEBHOOK_SECRET=whsec_…
MEDUSA_PUBLIC_URL=https://tetrava-medusa.onrender.com
STOREFRONT_URL=https://tetravalabs.com
```

Keep existing BTCPay and Paymento vars for crypto checkout.

Save → redeploy Medusa.

## Step 3 — Verify webhook

```powershell
Invoke-WebRequest -Uri "https://tetrava-medusa.onrender.com/webhooks/payments/peptidepay" -UseBasicParsing
```

Expect **200** with `"provider":"peptidepay"`.

## Step 4 — Test without a real card

Use Peptide Pay's webhook simulator with a `sk_test_` key:

1. Create a test session via `POST /api/v1/checkout/init` with `Authorization: Bearer sk_test_…`
2. Fire signed webhook: `POST /api/v1/test/fire-webhook` with `{ "session_id": "cs_…" }`

See [Peptide Pay docs](https://peptide-pay.com/docs#testing).

## Storefront behavior

- Default payment method: **Credit or debit card**
- Crypto option reveals asset picker (BTC → BTCPay, others → Paymento)
- Card flow redirects immediately to Peptide Pay; return URL is `/checkout/success`

See also: [doc/paymento-setup.md](./paymento-setup.md), [doc/btcpay-setup.md](./btcpay-setup.md).
