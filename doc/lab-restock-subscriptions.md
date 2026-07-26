# Peptide Refill subscriptions (hybrid)

RUO-safe Subscribe & Save for tetravalabs.com. Not a medical care plan.

## Model: hybrid scheduled refill

No auto-billing / no card vault. Customers commit to a **cadence and SKU**; each cycle is paid via **Peptide Pay** hosted checkout.

| Step | What happens |
|------|----------------|
| First order | Checkout → pending `lab_restocks` row → Peptide Pay → on paid, refill schedule **activates** with `next_billing_at` |
| Each cycle | Cron/job claims due row → renewal Medusa order + Peptide Pay link → Day-0 invoice email |
| Unpaid | Day 3 reminder → Day 7 final → Day 8 **pause** (clear pending cycle) |
| Customer pays | Peptide Pay webhook → clear dunning → `next_billing_at = now + cadence` |
| Account | Pause / skip / cancel / change cadence; **Pay refill now**; **Resume** sets `next_billing_at = now` (invoice on next cron) |

## Locked offer (v1)

| Rule | Value |
|------|--------|
| Name | **Peptide Refill** |
| Discount | **12%** off renewal refills (cycle 2+); first shipment full price |
| Cadences | **30 / 60 / 90** days |
| Pack tiers | 1 / 5 / 10 / 20 vials (PDP no longer shows Peptide Refill selector) |
| Card | Peptide Pay (required for refills) |
| Crypto | One-time carts only |
| Shipping | Free cold-chain on refill checkouts |

## Source of truth

- Offer UI: `apps/storefront/src/lib/lab-restock.ts` (`LAB_RESTOCK_COPY`)
- Schema: `012_lab_restocks.sql` + `013_peptide_refill_dunning.sql`
- Processor: `apps/medusa/src/lib/lab-restock-processor.ts`
- Medusa job: `apps/medusa/src/jobs/process-peptide-refills.ts` (`0 2 * * *`)
- Cron hook (primary in prod): `POST /hooks/order-emails/process` with `x-order-email-cron-secret`

## Idempotency

- Claim: `UPDATE … status=active AND due AND pending_renewal_order_id IS NULL`
- Reuse unpaid Peptide Pay session before creating a new order
- Stage-0 email resend throttled to ≥20h
- Unique `(lab_restock_id, order_id)` on shipments
- Webhook: skip capture/email if intent already `completed`; refill advance is idempotent via paid shipment check

## Dunning (RUO tone)

| Stage | When | Action |
|-------|------|--------|
| 0 | Due | Invoice email + pay link |
| 1 | +3d unpaid | Reminder |
| 2 | +7d unpaid | Final notice (no discount) |
| 3 | +8d unpaid | Pause + reactivate email |

## Env (Medusa / Render)

| Variable | Purpose |
|----------|---------|
| `MEDUSA_PUBLISHABLE_KEY` | Same as storefront publishable key — **required** for renewal carts |
| `PEPTIDEPAY_API_KEY` / `PEPTIDEPAY_WEBHOOK_SECRET` | Hosted checkout + webhook |
| `STOREFRONT_URL` / `MEDUSA_PUBLIC_URL` | Links in emails / return URLs |
| `RESEND_*` | Invoice + dunning emails |
| `ORDER_EMAIL_CRON_SECRET` | Protects `POST /hooks/order-emails/process` |

Apply schema: `npm run db:lab-schema` in `apps/medusa`.

### Render cron (recommended)

Daily (e.g. `0 2 * * *`):

```http
POST https://<medusa-host>/hooks/order-emails/process
x-order-email-cron-secret: <ORDER_EMAIL_CRON_SECRET>
```

This runs lifecycle emails **and** Peptide Refill renewals + dunning. The Medusa `src/jobs` wrapper is a backup when the Medusa process stays resident.

### Staging check

1. Force `next_billing_at = NOW()` on an active restock
2. Hit cron hook
3. Confirm one renewal order + one Peptide Pay URL
4. Re-hit cron → reused session, no second order
5. Duplicate `order.paid` webhook → no double advance

## Soft reorder emails

R1–R3 remain for **one-time** buyers. Active Peptide Refill subscribers are skipped.

One-click reorder magic links use `order_reorder_tokens` + `/reorder/{token}` (not `lab_restocks`). Account **Reorder** always seeds the cart as `fulfillment: one_time`.
