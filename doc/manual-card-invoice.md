# Offline card payment (manual PayPal invoice)

Fallback only. Live card checkout is CardToUSDT (`doc/cardtousdt-setup.md`). This path runs when `CARDTOUSDT_PAYOUT_ADDRESS` or a public HTTPS webhook base is missing, or when create checkout fails.

Card checkout is **order-first, pay-later**. Place order does not open PayPal, Stripe, or a card form. It creates an on-hold order. Staff send a PayPal invoice by hand. The customer pays that invoice with a PayPal balance or a card as a PayPal guest.

**Method id:** `manual_card_invoice`  
**Legacy Woo mapping:** `cheque`  
**Customer title:** `Credit/Debit Cards (Visa/MasterCard)`

## Customer path

1. Select the card radio (three numbered steps under it).
2. Click Place order. Stay on site. Thank-you at `/checkout/thank-you`.
3. Receipt email: order is on hold; we will send an invoice.
4. Pay the PayPal invoice when it arrives.
5. Staff mark payment received → processing email. Tracking follows on ship.

## Staff path

1. Open **Account → Invoice orders** (store admin emails only), or the on-hold row in the ops inbox.
2. In PayPal, invoice the checkout email for the order total (same currency).
3. When PayPal shows paid, click **Mark payment received**. Guard: only from `on_hold`.
4. Pack, then complete the order in Medusa as usual for tracking.

Do not add PayPal Checkout SDK or card fields on the site. PayPal Invoicing API is an optional later upgrade.

## Emails

| When | Who | What |
|---|---|---|
| Place order | Customer | `[Tetrava] Order Receipt` — invoice coming |
| Place order | Ops (`CONTACT_TO_EMAIL` or `info@tetravalabs.com`) | New order — send PayPal invoice |
| Mark paid | Customer | Payment received / processing |
| Ship | Customer | Tracking (existing fulfillment email) |

Schema is applied by `npm run db:lab-schema` (`015_manual_card_invoices.sql`).
