export const PAYMENT_REMINDER_DELAY_MINUTES = 20
export const PAYMENT_FOLLOWUP_DELAY_MINUTES = 30
export const TRACKING_SLA_HOURS = 72
export const CHECKOUT_ABANDON_REMINDER_MINUTES = 60
export const CHECKOUT_ABANDON_FOLLOWUP_HOURS = 24
/** Hours after abandon session start for C1c (third email). */
export const CHECKOUT_ABANDON_FINAL_HOURS = 48
export const REVIEW_REQUEST_DELAY_DAYS = 14
export const WINBACK_DELAY_DAYS = 60
export const WELCOME_FOLLOWUP_DAYS = 2
export const REPLENISHMENT_R1_DAYS = 30
export const REPLENISHMENT_R2_DAYS_AFTER_R1 = 45
export const REPLENISHMENT_R3_DAYS_AFTER_R2 = 15
export const COA_TRUST_DELAY_DAYS = 5

export type LifecycleEmailKind = "welcome_1" | "welcome_2" | "winback_1" | "winback_2"

/** @deprecated Use PAYMENT_REMINDER_DELAY_MINUTES */
export const ORDER_CONFIRMATION_DELAY_MINUTES = PAYMENT_REMINDER_DELAY_MINUTES

export type OrderEmailItem = {
  title: string
  variantTitle?: string
  quantity: number
  unitPrice: number
  handle?: string
}

export type PaymentMethod = "crypto" | "card"

type ReminderEmailInput = {
  orderLabel: string
  total: number
  paymentUrl: string
  paymentPageUrl: string
  paymentMethod?: PaymentMethod
  items?: OrderEmailItem[]
}

type PaidConfirmationInput = {
  orderLabel: string
  total: number
  items?: OrderEmailItem[]
  ordersUrl: string
  contactUrl: string
}

type ShippedEmailInput = {
  orderLabel: string
  trackingNumber: string
  trackingUrl?: string | null
  carrier?: string | null
  items?: OrderEmailItem[]
  ordersUrl: string
  contactUrl: string
}

type TrackingSlaEmailInput = {
  orderLabel: string
  items?: OrderEmailItem[]
  ordersUrl: string
  contactUrl: string
}

function formatMoney(amount: number) {
  return `$${amount.toFixed(2)}`
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
}

function paymentCopy(paymentMethod: PaymentMethod) {
  if (paymentMethod === "card") {
    return {
      intro: "Use the secure link below to finish card payment and confirm your order.",
      button: "Complete card payment"
    }
  }

  return {
    intro: "Use the secure link below to finish crypto payment and confirm your order.",
    button: "Pay with crypto"
  }
}

function emailShell(body: string) {
  return `
<!DOCTYPE html>
<html>
  <body style="margin:0;padding:24px;background:#050508;font-family:Inter,Segoe UI,sans-serif;">
    <div style="max-width:560px;margin:0 auto;background:#0A0A10;border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:28px;">
      <p style="margin:0 0 8px;color:#5EEAD4;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;">Tetrava Labs</p>
      ${body}
    </div>
  </body>
</html>`.trim()
}

function ruoFooter(contactUrl: string) {
  return `
      <hr style="margin:28px 0;border:none;border-top:1px solid rgba(255,255,255,0.1);" />
      <p style="margin:0;color:#8A8AA0;font-size:11px;line-height:1.5;">
        Research Use Only — not for human consumption. Questions? Reply to this email or visit
        <a href="${escapeHtml(contactUrl)}" style="color:#5EEAD4;">contact</a>.
      </p>`
}

/** Optional promo block when env code is set (Medusa Admin promo must match). */
export function renderPromoBlock(envKey: string) {
  const code = (process.env[envKey] || "").trim()
  if (!code) return ""
  return `
      <p style="margin:0 0 16px;color:#E8E8F0;font-size:14px;line-height:1.5;">
        Small thank-you for researchers: use code
        <strong style="color:#5EEAD4;">${escapeHtml(code)}</strong>
        at checkout for a limited discount.
      </p>`
}

function storefrontUrl(path = "") {
  const base = (process.env.STOREFRONT_URL || "https://tetravalabs.com").replace(/\/$/, "")
  return `${base}${path}`
}

function renderProductReorderLinks(items: OrderEmailItem[]) {
  const withHandles = items.filter((item) => item.handle)
  if (!withHandles.length) return ""
  const rows = withHandles
    .map((item) => {
      const url = storefrontUrl(`/product/${encodeURIComponent(item.handle!)}`)
      return `
        <li style="margin:0 0 8px;color:#8A8AA0;font-size:14px;line-height:1.5;">
          <a href="${escapeHtml(url)}" style="color:#5EEAD4;">${escapeHtml(item.title)}</a>
          ${item.variantTitle ? ` · ${escapeHtml(item.variantTitle)}` : ""}
        </li>`
    })
    .join("")
  return `<ul style="margin:16px 0 20px;padding-left:18px;">${rows}</ul>`
}

function renderItems(items: OrderEmailItem[]) {
  if (!items.length) return ""

  const rows = items
    .map(
      (item) => `
        <tr>
          <td style="padding:8px 0;color:#E8E8F0;font-size:14px;">
            ${escapeHtml(item.title)}${item.variantTitle ? ` · ${escapeHtml(item.variantTitle)}` : ""}
          </td>
          <td style="padding:8px 0;color:#8A8AA0;font-size:14px;text-align:center;">${item.quantity}</td>
          <td style="padding:8px 0;color:#E8E8F0;font-size:14px;text-align:right;">${formatMoney(item.unitPrice * item.quantity)}</td>
        </tr>`
    )
    .join("")

  return `
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;border-collapse:collapse;">
      <thead>
        <tr>
          <th align="left" style="padding:0 0 8px;color:#8A8AA0;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Item</th>
          <th align="center" style="padding:0 0 8px;color:#8A8AA0;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Qty</th>
          <th align="right" style="padding:0 0 8px;color:#8A8AA0;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Line</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>`
}

function renderPaymentBlock(input: ReminderEmailInput) {
  const copy = paymentCopy(input.paymentMethod || "crypto")

  return `
      <p style="margin:0 0 16px;color:#E8E8F0;font-size:15px;line-height:1.5;">
        ${copy.intro}
      </p>
      <a href="${escapeHtml(input.paymentUrl)}"
         style="display:inline-block;background:#5EEAD4;color:#050508;text-decoration:none;font-weight:600;font-size:14px;padding:12px 20px;border-radius:8px;">
        ${copy.button}
      </a>
      <p style="margin:16px 0 0;color:#8A8AA0;font-size:12px;line-height:1.5;">
        Prefer to return to the site?
        <a href="${escapeHtml(input.paymentPageUrl)}" style="color:#5EEAD4;">Open your payment page</a>.
      </p>`
}

function siteOriginFromUrl(url: string) {
  try {
    return new URL(url).origin
  } catch {
    return "https://tetravalabs.com"
  }
}

/** T2 — unpaid payment reminder (+20 min). */
export function buildPaymentReminderEmail(input: ReminderEmailInput) {
  const { orderLabel, total, paymentPageUrl, items = [] } = input
  const contactUrl = `${siteOriginFromUrl(paymentPageUrl)}/contact`

  const html = emailShell(`
      <h1 style="margin:0 0 12px;color:#E8E8F0;font-size:24px;font-weight:600;">Your payment is still open</h1>
      <p style="margin:0 0 16px;color:#8A8AA0;font-size:14px;line-height:1.5;">
        <strong style="color:#E8E8F0;">${escapeHtml(orderLabel)}</strong> is ready whenever you are.
        Complete payment to start fulfillment — your checkout session is waiting.
      </p>
      ${renderItems(items)}
      <p style="margin:0 0 20px;color:#E8E8F0;font-size:16px;">
        Amount due: <strong>${formatMoney(total)}</strong>
      </p>
      ${renderPaymentBlock(input)}
      ${ruoFooter(contactUrl)}
  `)

  return {
    subject: `Payment still open for ${orderLabel}`,
    html
  }
}

/** @deprecated Use buildPaymentReminderEmail */
export const buildOrderConfirmationEmail = buildPaymentReminderEmail

/** T3 — unpaid payment help follow-up (+30 min after T2). */
export function buildPaymentFollowupEmail(input: ReminderEmailInput) {
  const { orderLabel, total, paymentPageUrl } = input
  const copy = paymentCopy(input.paymentMethod || "crypto")
  const contactUrl = `${siteOriginFromUrl(paymentPageUrl)}/contact`

  const html = emailShell(`
      <h1 style="margin:0 0 12px;color:#E8E8F0;font-size:24px;font-weight:600;">Having trouble completing payment?</h1>
      <p style="margin:0 0 16px;color:#8A8AA0;font-size:14px;line-height:1.5;">
        We still have not received payment for <strong style="color:#E8E8F0;">${escapeHtml(orderLabel)}</strong>
        (${formatMoney(total)}).
      </p>
      <p style="margin:0 0 16px;color:#8A8AA0;font-size:14px;line-height:1.5;">
        If a wallet delay, network fee, card decline, or anything else is blocking you — reply to this email
        or reach out through our contact page. We are happy to help.
      </p>
      <p style="margin:0 0 16px;color:#E8E8F0;font-size:15px;line-height:1.5;">
        ${copy.intro}
      </p>
      <a href="${escapeHtml(input.paymentUrl)}"
         style="display:inline-block;background:#5EEAD4;color:#050508;text-decoration:none;font-weight:600;font-size:14px;padding:12px 20px;border-radius:8px;">
        ${copy.button}
      </a>
      <p style="margin:16px 0 0;color:#8A8AA0;font-size:12px;line-height:1.5;">
        Payment page:
        <a href="${escapeHtml(paymentPageUrl)}" style="color:#5EEAD4;">${escapeHtml(paymentPageUrl)}</a><br />
        Contact:
        <a href="${escapeHtml(contactUrl)}" style="color:#5EEAD4;">${escapeHtml(contactUrl)}</a>
      </p>
      ${ruoFooter(contactUrl)}
  `)

  return {
    subject: `Need a hand with ${orderLabel}?`,
    html
  }
}

/** T1 — paid order confirmation (immediate on payment). */
export function buildPaidOrderConfirmationEmail(input: PaidConfirmationInput) {
  const { orderLabel, total, items = [], ordersUrl, contactUrl } = input

  const html = emailShell(`
      <h1 style="margin:0 0 12px;color:#E8E8F0;font-size:24px;font-weight:600;">Thank you for your purchase</h1>
      <p style="margin:0 0 16px;color:#8A8AA0;font-size:14px;line-height:1.5;">
        Payment for <strong style="color:#E8E8F0;">${escapeHtml(orderLabel)}</strong> is confirmed.
        We are preparing your research materials for discreet shipment.
      </p>
      ${renderItems(items)}
      <p style="margin:0 0 16px;color:#E8E8F0;font-size:16px;">
        Total paid: <strong>${formatMoney(total)}</strong>
      </p>
      <p style="margin:0 0 20px;color:#8A8AA0;font-size:14px;line-height:1.5;">
        You will receive a tracking number within the next
        <strong style="color:#E8E8F0;">${TRACKING_SLA_HOURS} hours</strong>.
      </p>
      <a href="${escapeHtml(ordersUrl)}"
         style="display:inline-block;background:#5EEAD4;color:#050508;text-decoration:none;font-weight:600;font-size:14px;padding:12px 20px;border-radius:8px;">
        View order history
      </a>
      ${ruoFooter(contactUrl)}
  `)

  return {
    subject: `Order confirmed: ${orderLabel}`,
    html
  }
}

/** F1 — shipped / tracking (immediate when tracking is recorded). */
export function buildOrderShippedEmail(input: ShippedEmailInput) {
  const { orderLabel, trackingNumber, trackingUrl, carrier, items = [], ordersUrl, contactUrl } = input
  const carrierLine = carrier
    ? `<p style="margin:0 0 8px;color:#8A8AA0;font-size:14px;line-height:1.5;">Carrier: <strong style="color:#E8E8F0;">${escapeHtml(carrier)}</strong></p>`
    : ""

  const trackingBlock = trackingUrl
    ? `
      <a href="${escapeHtml(trackingUrl)}"
         style="display:inline-block;background:#5EEAD4;color:#050508;text-decoration:none;font-weight:600;font-size:14px;padding:12px 20px;border-radius:8px;">
        Track package
      </a>
      <p style="margin:16px 0 0;color:#8A8AA0;font-size:12px;line-height:1.5;">
        Tracking number: <strong style="color:#E8E8F0;">${escapeHtml(trackingNumber)}</strong>
      </p>`
    : `
      <p style="margin:0 0 20px;color:#E8E8F0;font-size:16px;">
        Tracking number: <strong>${escapeHtml(trackingNumber)}</strong>
      </p>
      <a href="${escapeHtml(ordersUrl)}"
         style="display:inline-block;background:#5EEAD4;color:#050508;text-decoration:none;font-weight:600;font-size:14px;padding:12px 20px;border-radius:8px;">
        View order history
      </a>`

  const html = emailShell(`
      <h1 style="margin:0 0 12px;color:#E8E8F0;font-size:24px;font-weight:600;">Your order has shipped</h1>
      <p style="margin:0 0 16px;color:#8A8AA0;font-size:14px;line-height:1.5;">
        Good news — <strong style="color:#E8E8F0;">${escapeHtml(orderLabel)}</strong> is on its way.
        Packages ship in plain, unmarked outer packaging.
      </p>
      ${renderItems(items)}
      ${carrierLine}
      ${trackingBlock}
      ${ruoFooter(contactUrl)}
  `)

  return {
    subject: `Shipped: ${orderLabel}`,
    html
  }
}

/** F2 — tracking SLA backup (+72h after payment if not shipped). */
export function buildTrackingSlaEmail(input: TrackingSlaEmailInput) {
  const { orderLabel, items = [], ordersUrl, contactUrl } = input

  const html = emailShell(`
      <h1 style="margin:0 0 12px;color:#E8E8F0;font-size:24px;font-weight:600;">Shipment update</h1>
      <p style="margin:0 0 16px;color:#8A8AA0;font-size:14px;line-height:1.5;">
        We are still finalizing shipment for <strong style="color:#E8E8F0;">${escapeHtml(orderLabel)}</strong>.
        Tracking is not ready yet — thank you for your patience.
      </p>
      ${renderItems(items)}
      <p style="margin:0 0 20px;color:#8A8AA0;font-size:14px;line-height:1.5;">
        You will receive another email as soon as your tracking number is available.
        If you need an update sooner, reply to this message or contact us anytime.
      </p>
      <a href="${escapeHtml(ordersUrl)}"
         style="display:inline-block;background:#5EEAD4;color:#050508;text-decoration:none;font-weight:600;font-size:14px;padding:12px 20px;border-radius:8px;">
        View order history
      </a>
      ${ruoFooter(contactUrl)}
  `)

  return {
    subject: `Shipment update: ${orderLabel}`,
    html
  }
}

type CheckoutAbandonInput = {
  items?: OrderEmailItem[]
  subtotal: number
  checkoutUrl: string
  contactUrl: string
}

/** C1 email 1 — checkout started, no order yet (+1h). */
export function buildCheckoutAbandonReminderEmail(input: CheckoutAbandonInput) {
  const { items = [], subtotal, checkoutUrl, contactUrl } = input

  const html = emailShell(`
      <h1 style="margin:0 0 12px;color:#E8E8F0;font-size:24px;font-weight:600;">Still want to finish checkout?</h1>
      <p style="margin:0 0 16px;color:#8A8AA0;font-size:14px;line-height:1.5;">
        You left items in your Tetrava Labs cart. Your session is still available whenever you are ready.
      </p>
      ${renderItems(items)}
      <p style="margin:0 0 20px;color:#E8E8F0;font-size:16px;">
        Cart subtotal: <strong>${formatMoney(subtotal)}</strong>
      </p>
      <a href="${escapeHtml(checkoutUrl)}"
         style="display:inline-block;background:#5EEAD4;color:#050508;text-decoration:none;font-weight:600;font-size:14px;padding:12px 20px;border-radius:8px;">
        Return to checkout
      </a>
      <p style="margin:16px 0 0;color:#8A8AA0;font-size:12px;line-height:1.5;">
        Questions about payment or shipping?
        <a href="${escapeHtml(contactUrl)}" style="color:#5EEAD4;">Contact us anytime</a>.
      </p>
      ${ruoFooter(contactUrl)}
  `)

  return {
    subject: "Your Tetrava Labs checkout is waiting",
    html
  }
}

/** C1 email 2 — still no order (+24h after first reminder). */
export function buildCheckoutAbandonFollowupEmail(input: CheckoutAbandonInput) {
  const { items = [], subtotal, checkoutUrl, contactUrl } = input

  const html = emailShell(`
      <h1 style="margin:0 0 12px;color:#E8E8F0;font-size:24px;font-weight:600;">Your cart is still saved</h1>
      <p style="margin:0 0 16px;color:#8A8AA0;font-size:14px;line-height:1.5;">
        Just a quick reminder — the research compounds below are still in your cart.
        No discount needed; pick up where you left off when you are ready.
      </p>
      ${renderItems(items)}
      <p style="margin:0 0 20px;color:#E8E8F0;font-size:16px;">
        Cart subtotal: <strong>${formatMoney(subtotal)}</strong>
      </p>
      <a href="${escapeHtml(checkoutUrl)}"
         style="display:inline-block;background:#5EEAD4;color:#050508;text-decoration:none;font-weight:600;font-size:14px;padding:12px 20px;border-radius:8px;">
        Complete checkout
      </a>
      <p style="margin:16px 0 0;color:#8A8AA0;font-size:12px;line-height:1.5;">
        If something blocked checkout (payment method, shipping, or compliance),
        <a href="${escapeHtml(contactUrl)}" style="color:#5EEAD4;">tell us</a> — we are happy to help.
      </p>
      ${ruoFooter(contactUrl)}
  `)

  return {
    subject: "Your cart is still saved at Tetrava Labs",
    html
  }
}

export function buildCheckoutUrl() {
  const storefront = (process.env.STOREFRONT_URL || "https://tetravalabs.com").replace(/\/$/, "")
  return `${storefront}/checkout`
}

export function buildPaymentPageUrl(orderId: string, displayId?: number | null, total?: number) {
  const storefront = (process.env.STOREFRONT_URL || "https://tetravalabs.com").replace(/\/$/, "")
  const params = new URLSearchParams({ order_id: orderId })
  if (displayId) params.set("display_id", String(displayId))
  if (typeof total === "number" && total > 0) params.set("total", total.toFixed(2))
  return `${storefront}/checkout/payment?${params.toString()}`
}

export function buildStorefrontOrdersUrl() {
  const storefront = (process.env.STOREFRONT_URL || "https://tetravalabs.com").replace(/\/$/, "")
  return `${storefront}/orders?payment=complete`
}

export function buildStorefrontContactUrl() {
  const storefront = (process.env.STOREFRONT_URL || "https://tetravalabs.com").replace(/\/$/, "")
  return `${storefront}/contact`
}

export function isLivePaymentUrl(url: string | null | undefined) {
  return Boolean(url && !url.includes("example.com"))
}

export function normalizeOrderEmailItems(value: unknown): OrderEmailItem[] {
  if (!Array.isArray(value)) return []
  return value
    .filter(
      (item): item is OrderEmailItem =>
        Boolean(item) &&
        typeof item === "object" &&
        typeof (item as OrderEmailItem).title === "string" &&
        typeof (item as OrderEmailItem).quantity === "number" &&
        typeof (item as OrderEmailItem).unitPrice === "number"
    )
    .map((item) => ({
      title: item.title,
      variantTitle: item.variantTitle,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      handle: typeof item.handle === "string" && item.handle.trim() ? item.handle.trim() : undefined
    }))
}

export function orderLabelFrom(displayId: number | null | undefined, orderId: string) {
  return displayId ? `Order #${displayId}` : orderId
}

export function firstProductHandle(items: OrderEmailItem[]) {
  return items.find((item) => item.handle)?.handle || null
}

export function buildProductReviewUrl(handle: string) {
  const storefront = (process.env.STOREFRONT_URL || "https://tetravalabs.com").replace(/\/$/, "")
  return `${storefront}/product/${encodeURIComponent(handle)}#reviews`
}

type ReviewRequestInput = {
  orderLabel: string
  items?: OrderEmailItem[]
  reviewUrl: string
  ordersUrl: string
  contactUrl: string
}

/** P1 — soft review request (+14 days after ship). Packaging/delivery only — no use claims. */
export function buildReviewRequestEmail(input: ReviewRequestInput) {
  const { orderLabel, items = [], reviewUrl, ordersUrl, contactUrl } = input

  const html = emailShell(`
      <h1 style="margin:0 0 12px;color:#E8E8F0;font-size:24px;font-weight:600;">How was packaging &amp; delivery?</h1>
      <p style="margin:0 0 16px;color:#8A8AA0;font-size:14px;line-height:1.5;">
        We hope <strong style="color:#E8E8F0;">${escapeHtml(orderLabel)}</strong> arrived in good condition.
        If you have a moment, a short review about packaging, shipping speed, or overall experience helps other researchers.
      </p>
      ${renderItems(items)}
      <p style="margin:0 0 20px;color:#8A8AA0;font-size:14px;line-height:1.5;">
        Sign in to leave a review on the product page. Please keep feedback about fulfillment and product presentation —
        not laboratory results or personal use.
      </p>
      <a href="${escapeHtml(reviewUrl)}"
         style="display:inline-block;background:#5EEAD4;color:#050508;text-decoration:none;font-weight:600;font-size:14px;padding:12px 20px;border-radius:8px;">
        Leave a review
      </a>
      <p style="margin:16px 0 0;color:#8A8AA0;font-size:12px;line-height:1.5;">
        Or view your orders:
        <a href="${escapeHtml(ordersUrl)}" style="color:#5EEAD4;">order history</a>.
      </p>
      ${ruoFooter(contactUrl)}
  `)

  return {
    subject: `Quick feedback on ${orderLabel}?`,
    html
  }
}

/** C1c — third checkout abandon (~48h after session start). */
export function buildCheckoutAbandonFinalEmail(input: CheckoutAbandonInput) {
  const { items = [], subtotal, checkoutUrl, contactUrl } = input
  const promo = renderPromoBlock("EMAIL_PROMO_CHECKOUT_ABANDON")

  const html = emailShell(`
      <h1 style="margin:0 0 12px;color:#E8E8F0;font-size:24px;font-weight:600;">Closing the loop on your cart</h1>
      <p style="margin:0 0 16px;color:#8A8AA0;font-size:14px;line-height:1.5;">
        Your cart is still saved, but we will not keep emailing about this session.
      </p>
      ${renderItems(items)}
      <p style="margin:0 0 16px;color:#E8E8F0;font-size:16px;">
        Cart subtotal: <strong>${formatMoney(subtotal)}</strong>
      </p>
      ${promo}
      <p style="margin:0 0 20px;color:#8A8AA0;font-size:14px;line-height:1.5;">
        If you still need these compounds for research, you can finish checkout now.
        If not, no action is needed — you can return to the shop anytime.
      </p>
      <a href="${escapeHtml(checkoutUrl)}"
         style="display:inline-block;background:#5EEAD4;color:#050508;text-decoration:none;font-weight:600;font-size:14px;padding:12px 20px;border-radius:8px;">
        Return to checkout
      </a>
      <p style="margin:16px 0 0;color:#8A8AA0;font-size:12px;line-height:1.5;">
        Questions?
        <a href="${escapeHtml(contactUrl)}" style="color:#5EEAD4;">Contact us</a> — happy to help with payment or shipping.
      </p>
      ${ruoFooter(contactUrl)}
  `)

  return {
    subject: "Last reminder: your Tetrava Labs cart",
    html
  }
}

type WelcomeEmailInput = {
  firstName?: string | null
  shopUrl: string
  blogUrl: string
  contactUrl: string
}

/** W1 — welcome on account create. */
export function buildWelcomeEmail(input: WelcomeEmailInput) {
  const firstName = (input.firstName || "").trim() || "there"

  const html = emailShell(`
      <h1 style="margin:0 0 12px;color:#E8E8F0;font-size:24px;font-weight:600;">Welcome to Tetrava Labs</h1>
      <p style="margin:0 0 16px;color:#8A8AA0;font-size:14px;line-height:1.5;">
        Hi ${escapeHtml(firstName)}, thanks for creating an account.
      </p>
      <p style="margin:0 0 16px;color:#8A8AA0;font-size:14px;line-height:1.5;">
        We supply research-grade peptides with lot-linked Certificates of Analysis where published —
        for laboratory research use only, not for human consumption.
      </p>
      <p style="margin:0 0 12px;color:#8A8AA0;font-size:14px;line-height:1.5;">
        What you can do next:
      </p>
      <ul style="margin:0 0 20px;padding-left:18px;color:#8A8AA0;font-size:14px;line-height:1.6;">
        <li>Browse the catalog by research category</li>
        <li>Open any product page for purity specs and available COA documents</li>
        <li>Checkout with crypto or card when your lab is ready to order</li>
      </ul>
      <a href="${escapeHtml(input.shopUrl)}"
         style="display:inline-block;background:#5EEAD4;color:#050508;text-decoration:none;font-weight:600;font-size:14px;padding:12px 20px;border-radius:8px;">
        Shop research compounds
      </a>
      ${ruoFooter(input.contactUrl)}
  `)

  return {
    subject: "Welcome to Tetrava Labs",
    html
  }
}

/** W2 — welcome follow-up (+2 days, no order yet). */
export function buildWelcomeFollowupEmail(input: WelcomeEmailInput) {
  const firstName = (input.firstName || "").trim() || "there"

  const html = emailShell(`
      <h1 style="margin:0 0 12px;color:#E8E8F0;font-size:24px;font-weight:600;">Finding the right research compounds</h1>
      <p style="margin:0 0 16px;color:#8A8AA0;font-size:14px;line-height:1.5;">
        Hi ${escapeHtml(firstName)} — if you are still mapping what your lab needs, these shortcuts help:
      </p>
      <ul style="margin:0 0 20px;padding-left:18px;color:#8A8AA0;font-size:14px;line-height:1.6;">
        <li><strong style="color:#E8E8F0;">Shop</strong> — full catalog with strength variants</li>
        <li><strong style="color:#E8E8F0;">Research hub</strong> — storage, handling, and compliance articles</li>
        <li><strong style="color:#E8E8F0;">COA library</strong> — lot-linked analytical documents when available</li>
      </ul>
      <p style="margin:0 0 20px;color:#8A8AA0;font-size:14px;line-height:1.5;">
        No rush. Your account is ready whenever you place an order.
      </p>
      <a href="${escapeHtml(input.shopUrl)}"
         style="display:inline-block;background:#5EEAD4;color:#050508;text-decoration:none;font-weight:600;font-size:14px;padding:12px 20px;border-radius:8px;margin-right:10px;">
        Browse the shop
      </a>
      <a href="${escapeHtml(input.blogUrl)}"
         style="display:inline-block;color:#5EEAD4;text-decoration:underline;font-size:14px;padding:12px 0;">
        Read the research hub
      </a>
      ${ruoFooter(input.contactUrl)}
  `)

  return {
    subject: "Finding the right research compounds",
    html
  }
}

type WinbackEmailInput = {
  firstName?: string | null
  shopUrl: string
  contactUrl: string
}

/** WB1 — winback (+60 days, account, 0 orders). */
export function buildWinbackEmail(input: WinbackEmailInput) {
  const firstName = (input.firstName || "").trim() || "there"
  const promo = renderPromoBlock("EMAIL_PROMO_WINBACK")

  const html = emailShell(`
      <h1 style="margin:0 0 12px;color:#E8E8F0;font-size:24px;font-weight:600;">Still researching with Tetrava Labs?</h1>
      <p style="margin:0 0 16px;color:#8A8AA0;font-size:14px;line-height:1.5;">
        Hi ${escapeHtml(firstName)}, you created a Tetrava Labs account a while ago and have not placed an order yet —
        totally fine.
      </p>
      <p style="margin:0 0 12px;color:#8A8AA0;font-size:14px;line-height:1.5;">
        Whenever your lab is ready:
      </p>
      <ul style="margin:0 0 16px;padding-left:18px;color:#8A8AA0;font-size:14px;line-height:1.6;">
        <li>Every listed product is for <strong style="color:#E8E8F0;">research use only</strong></li>
        <li>Product pages include strength options, purity specs, and COA access when published</li>
        <li>Shipping is discreet, with tracking when your carrier supports it</li>
      </ul>
      ${promo}
      <a href="${escapeHtml(input.shopUrl)}"
         style="display:inline-block;background:#5EEAD4;color:#050508;text-decoration:none;font-weight:600;font-size:14px;padding:12px 20px;border-radius:8px;">
        Browse the catalog
      </a>
      <p style="margin:16px 0 0;color:#8A8AA0;font-size:12px;line-height:1.5;">
        If something blocked you earlier (compliance questions, payment, or shipping regions),
        <a href="${escapeHtml(input.contactUrl)}" style="color:#5EEAD4;">just reply</a> — we are happy to clarify.
      </p>
      ${ruoFooter(input.contactUrl)}
  `)

  return {
    subject: "Still researching with Tetrava Labs?",
    html
  }
}

type ReplenishmentEmailInput = {
  firstName?: string | null
  orderLabel: string
  items?: OrderEmailItem[]
  ordersUrl: string
  shopUrl: string
  contactUrl: string
  step: 1 | 2 | 3
}

/** R1–R3 soft replenishment (reorder prior SKUs). */
export function buildReplenishmentEmail(input: ReplenishmentEmailInput) {
  const firstName = (input.firstName || "").trim() || "there"
  const items = input.items || []
  const productLinks = renderProductReorderLinks(items)
  const promo = input.step === 2 ? renderPromoBlock("EMAIL_PROMO_REPLENISHMENT") : ""

  if (input.step === 1) {
    const html = emailShell(`
      <h1 style="margin:0 0 12px;color:#E8E8F0;font-size:24px;font-weight:600;">Need to restock research materials?</h1>
      <p style="margin:0 0 16px;color:#8A8AA0;font-size:14px;line-height:1.5;">
        Hi ${escapeHtml(firstName)}, about a month ago we shipped
        <strong style="color:#E8E8F0;">${escapeHtml(input.orderLabel)}</strong>.
        If your lab needs the same compounds again, you can reorder from the product pages below.
      </p>
      ${productLinks || renderItems(items)}
      <p style="margin:0 0 20px;color:#8A8AA0;font-size:14px;line-height:1.5;">
        This is not an automated refill schedule — just a soft reminder in case you are planning another research order.
      </p>
      <a href="${escapeHtml(input.ordersUrl)}"
         style="display:inline-block;background:#5EEAD4;color:#050508;text-decoration:none;font-weight:600;font-size:14px;padding:12px 20px;border-radius:8px;margin-right:10px;">
        View order history
      </a>
      <a href="${escapeHtml(input.shopUrl)}"
         style="display:inline-block;color:#5EEAD4;text-decoration:underline;font-size:14px;padding:12px 0;">
        Shop all compounds
      </a>
      ${ruoFooter(input.contactUrl)}
  `)
    return {
      subject: "Reorder from your recent Tetrava Labs shipment?",
      html
    }
  }

  if (input.step === 2) {
    const html = emailShell(`
      <h1 style="margin:0 0 12px;color:#E8E8F0;font-size:24px;font-weight:600;">Quick reorder reminder</h1>
      <p style="margin:0 0 16px;color:#8A8AA0;font-size:14px;line-height:1.5;">
        Hi ${escapeHtml(firstName)}, checking in once more on compounds from
        <strong style="color:#E8E8F0;">${escapeHtml(input.orderLabel)}</strong>.
      </p>
      <p style="margin:0 0 8px;color:#8A8AA0;font-size:14px;line-height:1.5;">
        If stock planning for your lab still includes any of these SKUs, the links below go straight to the product pages:
      </p>
      ${productLinks || renderItems(items)}
      ${promo}
      <p style="margin:0 0 20px;color:#8A8AA0;font-size:14px;line-height:1.5;">
        If you already reordered elsewhere or do not need more, you can ignore this email.
      </p>
      <a href="${escapeHtml(input.shopUrl)}"
         style="display:inline-block;background:#5EEAD4;color:#050508;text-decoration:none;font-weight:600;font-size:14px;padding:12px 20px;border-radius:8px;">
        Reorder from catalog
      </a>
      ${ruoFooter(input.contactUrl)}
  `)
    return {
      subject: `Still need compounds from ${input.orderLabel}?`,
      html
    }
  }

  const html = emailShell(`
      <h1 style="margin:0 0 12px;color:#E8E8F0;font-size:24px;font-weight:600;">Closing this reorder series</h1>
      <p style="margin:0 0 16px;color:#8A8AA0;font-size:14px;line-height:1.5;">
        Hi ${escapeHtml(firstName)}, this is the last email about restocking items from
        <strong style="color:#E8E8F0;">${escapeHtml(input.orderLabel)}</strong>.
      </p>
      ${productLinks || renderItems(items)}
      <p style="margin:0 0 20px;color:#8A8AA0;font-size:14px;line-height:1.5;">
        Your account and order history stay available whenever you need them.
        We will not send further reminders for this shipment.
      </p>
      <a href="${escapeHtml(input.ordersUrl)}"
         style="display:inline-block;background:#5EEAD4;color:#050508;text-decoration:none;font-weight:600;font-size:14px;padding:12px 20px;border-radius:8px;margin-right:10px;">
        View past orders
      </a>
      <a href="${escapeHtml(input.shopUrl)}"
         style="display:inline-block;color:#5EEAD4;text-decoration:underline;font-size:14px;padding:12px 0;">
        Browse shop
      </a>
      ${ruoFooter(input.contactUrl)}
  `)

  return {
    subject: `Final reorder note for ${input.orderLabel}`,
    html
  }
}

type CoaTrustEmailInput = {
  firstName?: string | null
  orderLabel: string
  items?: OrderEmailItem[]
  coaLibraryUrl: string
  ordersUrl: string
  contactUrl: string
}

/** P2 — COA / batch trust (~5 days after ship). */
export function buildCoaTrustEmail(input: CoaTrustEmailInput) {
  const firstName = (input.firstName || "").trim() || "there"

  const html = emailShell(`
      <h1 style="margin:0 0 12px;color:#E8E8F0;font-size:24px;font-weight:600;">Your batch documentation</h1>
      <p style="margin:0 0 16px;color:#8A8AA0;font-size:14px;line-height:1.5;">
        Hi ${escapeHtml(firstName)}, we hope
        <strong style="color:#E8E8F0;">${escapeHtml(input.orderLabel)}</strong>
        arrived safely for your lab.
      </p>
      ${renderItems(input.items || [])}
      <p style="margin:0 0 16px;color:#8A8AA0;font-size:14px;line-height:1.5;">
        Lot-linked Certificates of Analysis are published on product pages and in our COA library when available —
        useful for documenting batch identity and analytical testing for research records.
      </p>
      <a href="${escapeHtml(input.coaLibraryUrl)}"
         style="display:inline-block;background:#5EEAD4;color:#050508;text-decoration:none;font-weight:600;font-size:14px;padding:12px 20px;border-radius:8px;margin-right:10px;">
        Browse COA library
      </a>
      <a href="${escapeHtml(input.ordersUrl)}"
         style="display:inline-block;color:#5EEAD4;text-decoration:underline;font-size:14px;padding:12px 0;">
        View order history
      </a>
      ${ruoFooter(input.contactUrl)}
  `)

  return {
    subject: `COA & batch docs for ${input.orderLabel}`,
    html
  }
}

export function buildStorefrontShopUrl() {
  return storefrontUrl("/shop")
}

export function buildStorefrontBlogUrl() {
  return storefrontUrl("/blog")
}

export function buildStorefrontCoaLibraryUrl() {
  return storefrontUrl("/coa-library")
}
