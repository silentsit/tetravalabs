# CardToUSDT card checkout

Hosted card checkout. The buyer pays USD with a card on CardToUSDT. Settlement lands in your self-custodial `0x` wallet. There is no API key.

Unwhitelisted wallets get a test-rate checkout where the hosted page total can exceed the cart (often ~25% on top). **Modempic whitelists the payout wallet with `@Card_to_usdt` so `amount`, `amount_usd`, and the hosted page all match the order total.** Tetrava uses the same rule: we reject create responses where those fields do not match the cart and fall back to the manual PayPal invoice path until the wallet is whitelisted.

## Customer path

1. Select Credit/Debit Cards.
2. Place order. Medusa `POST`s `https://api.cardtousdt.to/v2/checkout`.
3. Storefront opens `checkout_url` in a **new tab** (do not embed or same-tab redirect).
4. Buyer pays on CardToUSDT. Tetrava stays on `/checkout/payment`.
5. Webhook settles the order when paid USD is at least 95% of stored `amount_usd`.

If create fails or CardToUSDT is not configured, checkout falls back to the manual PayPal invoice path.

## Medusa env

| Variable | Required | Notes |
|---|---|---|
| `CARDTOUSDT_PAYOUT_ADDRESS` | Yes | Tetrava Labs Polygon wallet: `0x7c19774b353707c39A16F650B6c93E2172d6Dd45`. Same `0x` key exists on every EVM chain. Tokens do not auto-bridge: Polygon USDC is not Ethereum USDT. Non-EVM (Solana, TRON) cannot land here. Settlement chain is the webhook `coin` field, not chosen at create. |
| `MEDUSA_PUBLIC_URL` | Yes in production | Public `https://` origin. Webhook is `{MEDUSA_PUBLIC_URL}/webhooks/payments/cardtousdt`. Localhost is rejected. |
| `CARDTOUSDT_WEBHOOK_BASE_URL` | No | Full webhook URL override (ngrok / tunnel). Must be public HTTPS. |
| `CARDTOUSDT_FULFILL_BAND` | No | Default `0.95`. |

Apply schema: `npm run db:lab-schema` (`016_cardtousdt_checkouts.sql`).

## Four rules (from their docs)

1. Store `amount_usd` from create. Compare the webhook to that figure, not `amount`.
2. Fulfil at or above 95% of stored `amount_usd`. USD stables (`polygon_usdc`, `erc20_usdc`, `erc20_usdt`, `erc20_pyusd`) already report `value_coin` in USD.
3. Native / unknown `coin`: replace `_` with `/`, then `GET https://api.cardtousdt.to/crypto/{coin}/info.php`. Multiply `value_coin` by `prices.USD`. If that fails, hold.
4. Do not redirect the webhook. Fields live on the query string (`txid_out`, `value_coin`, `coin`, `c2t_ts`, `c2t_sig`). CardToUSDT tries GET first; POST is only a retry when GET returns `405`, with an empty body and `Content-Type: application/x-www-form-urlencoded`. We return `200` on GET (probe and settlement), so POST is unlikely in practice. Medusa sets `bodyParser: false` on this route because we never read the body — default `express.json()` would reject a malformed JSON body before our handler runs.

`order_id` is on `webhook_url` (we also put a per-checkout `secret=`). If create returns `webhook_secret`, we store it and verify HMAC. Never send `webhook_secret` to the browser.

## Routes

- `POST /store/payments/cardtousdt-intent` — create or reuse the pending checkout.
- `GET|POST /webhooks/payments/cardtousdt` — settlement. No publishable key. Do not add a redirect in front of this path.

Every create response includes `X-Request-Id`. Quote that header if you write to CardToUSDT about a call. Do not retry a create that already returned 200; `conversion_failed` is the only safe identical retry.
