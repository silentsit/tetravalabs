# Email Lifecycle Plan

Lifecycle and transactional emails for Tetrava Labs (RUO research peptides). Commerce events stay on Medusa; contact autoresponder lives on the storefront. Provider: Resend.

**Tone rules (all flows):**
- Research / lab supplier voice — no clinical dosing, “protocol restart,” or supplement-style claims
- Prefer COA, batch integrity, shipping reliability, reorder of prior SKUs
- No discount ladders in abandon or lifecycle flows unless explicitly approved later

---

## 1. Live today

Cron: `scripts/process-order-emails.mjs` → `POST /hooks/order-emails/process` every 5 minutes (Render).

| ID | Name | Trigger | Timing | Template source |
|----|------|---------|--------|-----------------|
| **T1** | Paid order confirmation | Payment webhook | Immediate | `order-email-templates.ts` |
| **T2** | Unpaid payment reminder | Checkout placed, unpaid | +20 min | same |
| **T3** | Unpaid payment help | After T2, still unpaid | +30 min after T2 | same |
| **F1** | Shipped / tracking | `shipment.created` or `POST /hooks/orders/ship` | Immediate | same |
| **F2** | Tracking SLA backup | Paid, not shipped | +72h after payment | same |
| **F3** | Contact autoresponder | Contact form submit | Immediate | `apps/storefront/src/lib/contact-autoresponder-email.ts` |
| **C1a** | Checkout abandon reminder | Email captured on checkout | +1h | `order-email-templates.ts` |
| **C1b** | Checkout abandon follow-up | After C1a | +24h after C1a | same |
| **C1c** | Checkout abandon final | After C1b | ~48h after abandon start | same |
| **W1** | Welcome #1 | `customer.created` | Immediate (cron due) | same |
| **W2** | Welcome #2 | Same, no order | +2 days | same |
| **WB1** | Winback | Account, 0 orders | +60 days after create | same |
| **R1** | Replenishment #1 | After ship | +30 days post-ship | same |
| **R2** | Replenishment #2 | After R1 | +45 days after R1 | same |
| **R3** | Replenishment #3 | After R2 | +15 days after R2 | same |
| **P1** | Soft review request | After ship, no review yet | +14 days after ship | same |
| **P2** | COA / batch trust | After ship | +5 days after ship | same |
| **Auth** | Password reset | Auth password-reset event | Immediate | `password-reset-email.ts` |
| **Staff** | Contact inbox notify | Contact form | Immediate | inline in `contact/route.ts` |

**Key files:**
- Templates / delays: `apps/medusa/src/lib/order-email-templates.ts`
- Orchestration: `apps/medusa/src/lib/order-email-schedule.ts`, `order-fulfillment-emails.ts`, `checkout-abandon.ts`, `customer-lifecycle-emails.ts`
- Subscriber: `apps/medusa/src/subscribers/customer-created.ts`
- Cron: `scripts/process-order-emails.mjs`, `render.yaml` (`tetrava-order-emails`)
- Optional promo env: `EMAIL_PROMO_CHECKOUT_ABANDON`, `EMAIL_PROMO_WINBACK`, `EMAIL_PROMO_REPLENISHMENT`

---

## 2. Build roadmap

### Phase 1 — Quick wins

| ID | Flow | Audience | Timing | Notes |
|----|------|----------|--------|-------|
| **W1** | Welcome #1 | New customer account created | Immediate | **Shipped** |
| **W2** | Welcome #2 | Same, no order yet | +2 days after W1 | **Shipped**; cancel if they order |
| **T1r** | Returning post-purchase | Customer with ≥1 prior paid order | Immediate on payment (variant of T1) | Shorter thank-you + reorder links for prior SKUs |
| **C1c** | Checkout abandon #3 | Abandoned checkout | ~48h after session start | **Shipped**; optional promo via `EMAIL_PROMO_CHECKOUT_ABANDON` |

### Phase 2 — Lifecycle (priority)

| ID | Flow | Audience | Timing | Notes |
|----|------|----------|--------|-------|
| **WB1** | Winback | Account exists, **never placed an order** | **+60 days** after account creation | **Shipped**; optional promo via `EMAIL_PROMO_WINBACK` |
| **R1** | Replenishment #1 | Has **≥1 shipped** order | **+30 days post-ship** | **Shipped** |
| **R2** | Replenishment #2 | Same order, still no reorder | **+45 days after R1** | **Shipped**; optional promo via `EMAIL_PROMO_REPLENISHMENT` |
| **R3** | Replenishment #3 | Same, still no reorder | **+15 days after R2** | **Shipped** |

> Replenishment cadence (from ship date): **R1 @ 30d → R2 @ 75d → R3 @ 90d**.  
> Equivalently from R1: **R2 = R1 + 45d**, **R3 = R1 + 60d**.

### Phase 3 — Later / optional

| ID | Flow | Notes |
|----|------|-------|
| **VIP** | Repeat / high-LTV labs | Only after clear segment rules (e.g. 3+ orders or $X) |
| **Browse abandon** | Product-view → email | **Skipped** — no view-tracking |
| **C1d** | Checkout abandon #4 | Optional |
| **P2** | COA / batch trust post-purchase | **Shipped** at ship +5d |
| **P3** | Simple reorder nudge (legacy name) | Superseded by **R1–R3** |

---

## 3. Winback (WB) — detailed plan

### Goal
Convert signed-up customers who never completed a first purchase.

### Audience (must match all)
- Has a Medusa **customer** account (email/password or OAuth)
- **Zero** non-canceled paid orders (`order` count with `customer_id`, excluding drafts/canceled)
- Not unsubscribed / suppressed

### Timing
| Email | When |
|-------|------|
| **WB1** | 60 days after `customer.created_at` (preferred) |
| **WB2** (optional, Phase 2.1) | 90 days after signup if still 0 orders |

### Cancel / skip
- Customer places any paid order → cancel pending WB
- Soft bounce / unsubscribe
- Account deleted

### Copy angle
- “Still researching?”
- Trust: purity, COA access, shipping
- CTA: Shop / Research hub
- **Avoid:** protocol restart, clinical benefit, urgency discounts

### Data needs
- Customer `id`, `email`, `created_at`
- Order existence check (reuse pattern from `customerPurchasedProduct` / order graph)
- Schedule table (new): e.g. `customer_lifecycle_emails` with `kind = winback`, `due_at`, `sent_at`, `cancelled_at`

### Implementation sketch (not built yet)
1. On customer create (subscriber or post-register hook): insert WB1 row `due_at = created_at + 60 days`
2. Cron branch in `processDueOrderEmails` (or sibling processor): send due WB rows
3. On first paid order webhook / T1 path: cancel open WB rows for that `customer_id`

**Status:** **Shipped** — `008_customer_lifecycle_emails.sql`, `customer-created.ts`, `customer-lifecycle-emails.ts`.

---

## 4. Replenishment (R) — detailed plan

### Goal
Nudge prior buyers to reorder compounds they already purchased — lab reorder tone, not refill/subscription.

### Audience (must match all)
- Customer has at least one **shipped** order (anchor = ship event already tracked in `order_fulfillment_emails`)
- Prefer customers with account `customer_id` (guest orders: only if email is stable and we choose to include — **default: account-linked only** for v1)
- Not unsubscribed

### Cadence (per shipped order cycle)

| Step | ID | Due relative to ship | Due relative to R1 |
|------|-----|----------------------|--------------------|
| 1 | **R1** | Ship + **30 days** | — |
| 2 | **R2** | Ship + **75 days** | R1 + **45 days** |
| 3 | **R3** | Ship + **90 days** | R1 + **60 days** |

### Cancel / skip (entire remaining chain for that order)
- Customer places a **new paid order** after the anchor ship (any product, or same SKUs — **v1: any new paid order** is enough to cancel)
- Already sent max step for that order
- F1 never sent / no `shipped` anchor → do not schedule R\*

### Content rules
- List prior order items (handles/titles from fulfillment or order items snapshot)
- CTA: deep links to those product pages or a “reorder” account/orders URL
- Soft review (P1) stays separate at ship +14d; do not merge into R1
- **Avoid:** “time to refill,” dosing schedules, implied human use

### Interaction with other flows
| Flow | Relationship |
|------|----------------|
| **P1** (review @ +14d) | Runs first; R1 starts later at +30d |
| **F2** (tracking SLA) | Unrelated; only when not shipped |
| **T1r** (returning confirmation) | On next purchase; cancels open R\* for prior cycle |
| **WB** | Mutually exclusive audience (0 vs ≥1 orders) |

### Data needs
- Anchor: `order_fulfillment_emails` already has ship + `review_due_at`; extend with replenishment columns **or** new table `order_replenishment_emails`
- Suggested columns: `r1_due_at`, `r1_sent_at`, `r2_due_at`, `r2_sent_at`, `r3_due_at`, `r3_sent_at`, `cancelled_at`, snapshot `items` jsonb
- Schedule R1 when F1 succeeds (same place review is scheduled today)

### Implementation sketch (not built yet)
1. In `recordOrderShipmentAndNotify` / ship path: set `r1_due_at = NOW() + 30 days`
2. On R1 send: set `r2_due_at = NOW() + 45 days` (or absolute ship+75)
3. On R2 send: set `r3_due_at = NOW() + 15 days` (or absolute ship+90 / R1+60)
4. On any new paid order for that customer: cancel open R\* rows (and optional: cancel WB if somehow open)
5. Cron: process due R1/R2/R3 alongside existing email processor

**Status:** **Shipped** — `009_order_replenishment.sql` + processors in `order-fulfillment-emails.ts`.

---

## 5. Welcome (W) — summary

| ID | Timing | Cancel if |
|----|--------|-----------|
| W1 | Account create | — |
| W2 | Create + 2 days | First paid order before W2 |

Audience overlaps with future WB only if they never buy; WB is the long-tail for that cohort.

---

## 6. Checkout abandon extension (C1c)

| ID | Timing | Notes |
|----|--------|-------|
| C1c | ~48h after abandon session start | **Shipped**; optional promo via `EMAIL_PROMO_CHECKOUT_ABANDON` |

Keep current C1a (+1h) and C1b (+24h).

---

## 7. Compliance & ops checklist

- [ ] All lifecycle copy reviewed for RUO / no therapeutic claims
- [ ] Unsubscribe / suppression story (Resend or list-unsub header) for marketing-ish flows (W, WB, R, C1)
- [ ] Transactional (T1, T2, T3, F1, F2, Auth) remain separate from marketing suppression where possible
- [ ] `STORE_ADMIN_EMAILS` / ops not used as test spam — use staging Resend
- [ ] Cron secret unchanged: `ORDER_EMAIL_CRON_SECRET`
- [x] Document env vars in `apps/medusa/.env.example` when implementing

---

## 8. Suggested build order

1. ~~Schema for replenishment columns/table + winback schedule table~~ **done** (`008`–`011`)
2. ~~**R1–R3**~~ **done**
3. ~~**WB1** @ 60 days~~ **done**
4. ~~**W1/W2** welcome~~ **done**
5. **T1r** returning confirmation variant — still open
6. ~~**C1c** third abandon email~~ **done**
7. ~~**P2** COA trust~~ **done**; other Phase 3 as needed

---

## 9. Out of scope (for now)

- Browse abandonment series  
- VIP program emails  
- Subscription / auto-replenish billing  
- Full discount ladders (occasional env promo codes on C1c / WB1 / R2 only)  
- Separate P3 product (use R1–R3)

---

## 10. Status

| Item | Status |
|------|--------|
| Live transactional + C1 + P1 + F3 | **Live** |
| W1 / W2 / WB1 | **Shipped** |
| R1–R3 | **Shipped** |
| P2 COA trust | **Shipped** |
| C1c + optional promo env | **Shipped** |
| T1r returning confirmation | **Not started** |
| Browse abandon | **Skipped** |

**Copy drafts (live + proposed):** see [`doc/email-copy-drafts.md`](email-copy-drafts.md).
