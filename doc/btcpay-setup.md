# BTCPay Server setup for Tetrava Labs

Tetrava uses BTCPay for crypto checkout. Medusa on Render creates invoices; BTCPay hosts the payment page.

## Architecture

Tetrava uses a **dual-provider** crypto stack (same pattern as Modempic):

| Asset | Provider |
|-------|----------|
| BTC | BTCPay (on-chain / Lightning) |
| USDT, ETH, SOL, etc. | Paymento |

See [doc/paymento-setup.md](./paymento-setup.md) for Paymento configuration.

```
Customer → tetravalabs.com checkout (select crypto asset)
         → Medusa (Render) POST /store/payments/crypto-intent
         → BTCPay Server creates invoice
         → Customer pays on BTCPay checkout page
         → BTCPay webhook → Medusa /webhooks/payments/btcpay
         → Order payment status updated
```

## Step 1 — Get a BTCPay Server (you do this once)

**Recommended:** a managed host (no Docker/VPS maintenance).

| Provider | Notes |
|----------|--------|
| [BTCPay Provider](https://btcpayprovider.com/) | Managed, plugin-friendly, quick start |
| [LunaNode wizard](https://launchbtcpay.lunanode.com/) | Official docs path, ~$16/mo, full node |
| [Elestio](https://elest.io/open-source/btcpay) | Managed BTCPay |

**Not recommended:** running BTCPay on the same Render service as Medusa (needs Docker, persistent disk, heavy).

After signup you will have a URL like `https://pay.yourdomain.com` or `https://xxxxx.btcpayprovider.com`.

## Step 2 — Create store & wallet

1. Log into BTCPay dashboard.
2. **Create store** → name: `Tetrava Labs`, default currency: **USD**.
3. **Wallets** → connect Bitcoin wallet (or enable testnet first for testing).

## Step 3 — Collect credentials

### Store ID
**Store → Settings → General** → copy **Store ID**.

### API key
**Store → Settings → Access Tokens** → **Generate new token**

- Label: `Tetrava Medusa`
- Permissions: **Create invoice**, **View invoices**

Copy the token immediately (shown once).

### Webhook
**Store → Settings → Webhooks** → **Create webhook**

| Field | Value |
|-------|--------|
| Payload URL | `https://tetrava-medusa.onrender.com/webhooks/payments/btcpay` |
| Secret | (auto-generated — copy it) |
| Events | `InvoiceSettled`, `InvoiceExpired`, `InvoiceInvalid` |

Optional: `InvoiceReceivedPayment`, `InvoiceProcessing` for status updates.

## Step 4 — Add to Render

**Render → tetrava-medusa → Environment**

```
BTCPAY_URL=https://YOUR-BTCPAY-HOST.com
BTCPAY_API_KEY=your_access_token
BTCPAY_STORE_ID=your_store_id
BTCPAY_WEBHOOK_SECRET=your_webhook_secret
STOREFRONT_URL=https://tetravalabs.com
```

Save → **Manual Deploy** (or wait for auto-deploy).

Mirror the same values in `apps/medusa/.env` for local testing (never commit).

## Step 5 — Verify

```powershell
cd C:\Users\daryl\Downloads\Tetravalabs
npm run btcpay:setup -- --test
npm run smoke:checkout
```

Success: crypto intent returns `provider: "btcpay"` and a real checkout URL (not `example.com`).

## Testnet (optional)

Use BTCPay testnet mode and a testnet wallet before accepting real BTC. Same API flow; only the wallet/network changes.

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| `provider: placeholder` | BTCPAY_* vars missing on Render; redeploy Medusa |
| `BTCPay invoice failed (401)` | Regenerate API token; check store ID |
| Webhook 401 | `BTCPAY_WEBHOOK_SECRET` must match BTCPay webhook secret |
| Invoice created but no status update | Check webhook URL and events in BTCPay dashboard |
