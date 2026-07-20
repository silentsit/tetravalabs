export const PAYMENT_REMINDER_DELAY_MINUTES = 20
export const PAYMENT_FOLLOWUP_DELAY_MINUTES = 30
export const TRACKING_SLA_HOURS = 72

/** @deprecated Use PAYMENT_REMINDER_DELAY_MINUTES */
export const ORDER_CONFIRMATION_DELAY_MINUTES = PAYMENT_REMINDER_DELAY_MINUTES

export type OrderEmailItem = {
  title: string
  variantTitle?: string
  quantity: number
  unitPrice: number
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
      unitPrice: item.unitPrice
    }))
}

export function orderLabelFrom(displayId: number | null | undefined, orderId: string) {
  return displayId ? `Order #${displayId}` : orderId
}
