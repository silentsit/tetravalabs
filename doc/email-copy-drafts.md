# Email Copy Drafts

Plaintext drafts for review. **Live** = currently coded. **Draft** = proposed (not built).

Shared footer on most emails:

> Research Use Only — not for human or veterinary consumption. Questions? Contact us.

Example placeholders: `{firstName}`, `{orderLabel}` (e.g. Order #1042), `{total}`, `{items}`, `{trackingNumber}`, `{carrier}`, `{paymentUrl}`, `{checkoutUrl}`, `{shopUrl}`, `{coaUrl}`, `{blogUrl}`, `{ordersUrl}`, `{reviewUrl}`, `{contactUrl}`, `{resetUrl}`, `{productLinks}`.

---

## A. Live today

### T1 — Paid order confirmation *(live)*
**Subject:** `Order confirmed: {orderLabel}`

Thank you for your purchase

Payment for **{orderLabel}** is confirmed. We are preparing your research materials for discreet shipment.

{items}

Total paid: **{total}**

You will receive a tracking number within the next **72 hours**.

[View order history]

---

### T2 — Unpaid payment reminder *(live)* · +20 min
**Subject:** `Payment still open for {orderLabel}`

Your payment is still open

**{orderLabel}** is ready whenever you are. Complete payment to start fulfillment — your checkout session is waiting.

{items}

Amount due: **{total}**

[Complete card payment / Pay with crypto]

Payment page: {paymentPageUrl}

---

### T3 — Unpaid payment help *(live)* · +30 min after T2
**Subject:** `Need a hand with {orderLabel}?`

Having trouble completing payment?

We still have not received payment for **{orderLabel}** ({total}).

If a wallet delay, network fee, card decline, or anything else is blocking you — reply to this email or reach out through our contact page. We are happy to help.

[Complete card payment / Pay with crypto]

Payment page: {paymentPageUrl}  
Contact: {contactUrl}

---

### F1 — Shipped / tracking *(live)*
**Subject:** `Shipped: {orderLabel}`

Your order has shipped

Good news — **{orderLabel}** is on its way. Packages ship in plain, unmarked outer packaging.

{items}

Carrier: **{carrier}** *(if present)*

[Track package]  
Tracking number: **{trackingNumber}**

---

### F2 — Tracking SLA backup *(live)* · +72h if not shipped
**Subject:** `Shipment update: {orderLabel}`

Shipment update

We are still finalizing shipment for **{orderLabel}**. Tracking is not ready yet — thank you for your patience.

{items}

You will receive another email as soon as your tracking number is available. If you need an update sooner, reply to this message or contact us anytime.

[View order history]

---

### F3 — Contact autoresponder *(live)*
**Subject:** `We received your message: {subject}`

We received your message

Hi {firstName}, thanks for contacting Tetrava Labs. We got your note about **{subject}**.

Our research support team typically replies within **1–2 business days**. If this is about an order, including your order number in a reply helps us look it up faster.

No action is needed right now — we will follow up at this email address.

[Back to contact]

---

### Staff — Contact inbox notify *(live)*
**Subject:** `[Contact] {subject}`

**{name}** ({email})

{message}

*(Reply-To set to customer email.)*

---

### C1a — Checkout abandon #1 *(live)* · +1h
**Subject:** `Your Tetrava Labs checkout is waiting`

Still want to finish checkout?

You left items in your Tetrava Labs cart. Your session is still available whenever you are ready.

{items}

Cart subtotal: **{subtotal}**

[Return to checkout]

Questions about payment or shipping? Contact us anytime.

---

### C1b — Checkout abandon #2 *(live)* · +24h after C1a
**Subject:** `Your cart is still saved at Tetrava Labs`

Your cart is still saved

Just a quick reminder — the research compounds below are still in your cart. No discount needed; pick up where you left off when you are ready.

{items}

Cart subtotal: **{subtotal}**

[Complete checkout]

If something blocked checkout (payment method, shipping, or compliance), tell us — we are happy to help.

---

### P1 — Soft review request *(live)* · +14d after ship
**Subject:** `Quick feedback on {orderLabel}?`

How was packaging & delivery?

We hope **{orderLabel}** arrived in good condition. If you have a moment, a short review about packaging, shipping speed, or overall experience helps other researchers.

{items}

Sign in to leave a review on the product page. Please keep feedback about fulfillment and product presentation — not laboratory results or personal use.

[Leave a review]

Or view your orders: order history.

---

### Auth — Password reset *(live)*
**Subject:** `Reset your Tetrava Labs password`

Reset your password

We received a request to reset the password for **{email}**. Use the button below to choose a new password.

[Reset password]

If the button does not work, copy and paste this link into your browser:  
{resetUrl}

This link expires soon for security. If you did not request a password reset, you can ignore this email.

---

## B. Phase 1 — planned drafts

### W1 — Welcome #1 *(draft)* · on account create
**Subject:** `Welcome to Tetrava Labs`

Welcome to Tetrava Labs

Hi {firstName}, thanks for creating an account.

We supply research-grade peptides with lot-linked Certificates of Analysis where published — for laboratory research use only, not for human consumption.

What you can do next:
- Browse the catalog by research category
- Open any product page to see purity specs and available COA documents
- Checkout with crypto or card when your lab is ready to order

[Shop research compounds]

If you have a sourcing or documentation question, reply anytime or use our contact page.

---

### W2 — Welcome #2 *(draft)* · +2 days if no order
**Subject:** `Finding the right research compounds`

A quick guide to the catalog

Hi {firstName} — if you are still mapping what your lab needs, these shortcuts help:

- **Shop** — full catalog with strength variants  
- **Research hub** — storage, handling, and compliance articles  
- **COA library** — lot-linked analytical documents when available  

No rush. Your account is ready whenever you place an order.

[Browse the shop] · [Read the research hub]

---

### T1r — Returning post-purchase *(draft)* · immediate on 2nd+ paid order
**Subject:** `Order confirmed: {orderLabel}`

Welcome back — order confirmed

Payment for **{orderLabel}** is confirmed. Thanks for ordering with Tetrava Labs again.

{items}

Total paid: **{total}**

Tracking typically follows within **72 hours**. You can review past orders anytime in your account.

[View order history]

---

### C1c — Checkout abandon #3 *(draft)* · +48–72h after abandon start
**Subject:** `Last reminder: your Tetrava Labs cart`

Closing the loop on your cart

Your cart is still saved, but we will not keep emailing about this session.

{items}

Cart subtotal: **{subtotal}**

If you still need these compounds for research, you can finish checkout now. If not, no action is needed — you can return to the shop anytime.

[Return to checkout]

Questions? Contact us — happy to help with payment or shipping.

---

## C. Phase 2 — winback & replenishment drafts

### WB1 — Winback *(draft)* · +60 days, account, 0 orders
**Subject:** `Still researching with Tetrava Labs?`

Still exploring research compounds?

Hi {firstName}, you created a Tetrava Labs account a while ago and have not placed an order yet — totally fine.

Whenever your lab is ready:
- Every listed product is for **research use only**
- Product pages include strength options, purity specs, and COA access when published
- Shipping is discreet, with tracking when your carrier supports it

[Browse the catalog]

If something blocked you earlier (compliance questions, payment, or shipping regions), just reply — we are happy to clarify.

---

### WB2 — Winback optional *(draft)* · +90 days, still 0 orders
**Subject:** `Your Tetrava Labs account is still here`

One more note from Tetrava Labs

Hi {firstName}, this is a final check-in. Your account remains open if you need research-grade peptides later.

We will not keep following up about a first order. You can sign in and shop anytime — or unsubscribe if you prefer fewer emails.

[Go to shop]

---

### R1 — Replenishment #1 *(draft)* · +30 days post-ship
**Subject:** `Reorder from your recent Tetrava Labs shipment?`

Need to restock research materials?

Hi {firstName}, about a month ago we shipped **{orderLabel}**. If your lab needs the same compounds again, you can reorder from the product pages below.

{productLinks}

This is not an automated refill schedule — just a soft reminder in case you are planning another research order.

[View order history] · [Shop all compounds]

---

### R2 — Replenishment #2 *(draft)* · +45 days after R1 (~75d post-ship)
**Subject:** `Still need compounds from {orderLabel}?`

Quick reorder reminder

Hi {firstName}, checking in once more on compounds from **{orderLabel}**.

If stock planning for your lab still includes any of these SKUs, the links below go straight to the product pages:

{productLinks}

If you already reordered elsewhere or do not need more, you can ignore this email.

[Reorder from catalog]

---

### R3 — Replenishment #3 *(draft)* · +60 days after R1 (~90d post-ship)
**Subject:** `Final reorder note for {orderLabel}`

Closing this reorder series

Hi {firstName}, this is the last email about restocking items from **{orderLabel}**.

{productLinks}

Your account and order history stay available whenever you need them. We will not send further reminders for this shipment.

[View past orders] · [Browse shop]

---

## D. Phase 3 — optional drafts (not prioritized)

### VIP — example *(draft / later)*
**Subject:** `Priority research support at Tetrava Labs`

Thanks for being a returning lab customer. You now qualify for priority support on documentation and order questions. Reply to this email anytime with your order number — we will prioritize research-support replies for VIP accounts.

*(Define VIP rules before building.)*

### Browse abandon — skipped for now
*(No drafts until product-view tracking exists.)*

### C1d — deferred
*(No drafts until needed.)*

### P2 — COA / batch trust *(implemented)* · +5 days post-ship
**Subject:** `COA & batch docs for Order #…`

Your batch documentation

Hi {firstName}, we hope {orderLabel} arrived safely for your lab.

{items}

Lot-linked Certificates of Analysis are published on product pages and in our COA library when available — useful for documenting batch identity and analytical testing for research records.

[Browse COA library] · [View order history]

---

## Review checklist

- [x] **W1 / W2** welcome — implemented in templates
- [ ] Approve **T1r** returning confirmation vs keep single T1 for all
- [x] **C1c** at ~48h after session start — implemented (optional promo env)
- [x] **WB1** winback — implemented (WB2 deferred)
- [x] **R1 / R2 / R3** replenishment — implemented
- [x] Occasional promo only via env on C1c / WB1 / R2 (not full ladders)
- [x] RUO footer on marketing-ish lifecycle emails
- [x] **P2** COA trust — implemented

Update this file when copy is approved or when templates are implemented in code.
