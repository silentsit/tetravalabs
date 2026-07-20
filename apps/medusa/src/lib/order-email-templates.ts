export const ORDER_CONFIRMATION_DELAY_MINUTES = 20
export const PAYMENT_FOLLOWUP_DELAY_MINUTES = 30

export type OrderEmailItem = {
  title: string
  variantTitle?: string
  quantity: number
  unitPrice: number
}

export type PaymentMethod = "crypto" | "card"

type OrderEmailInput = {
  orderLabel: string
  total: number
  paymentUrl: string
  paymentPageUrl: string
  paymentMethod?: PaymentMethod
  items?: OrderEmailItem[]
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
      intro: "Complete your card payment to confirm fulfillment.",
      button: "Complete payment"
    }
  }

  return {
    intro: "Complete your crypto payment to confirm fulfillment.",
    button: "Pay with crypto"
  }
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

function renderPaymentBlock(input: OrderEmailInput) {
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
        Or open your <a href="${escapeHtml(input.paymentPageUrl)}" style="color:#5EEAD4;">order payment page</a> on Tetrava Labs.
      </p>`
}

function siteOriginFromUrl(url: string) {
  try {
    return new URL(url).origin
  } catch {
    return "https://tetravalabs.com"
  }
}

export function buildOrderConfirmationEmail(input: OrderEmailInput) {
  const { orderLabel, total, paymentPageUrl, items = [] } = input

  const html = `
<!DOCTYPE html>
<html>
  <body style="margin:0;padding:24px;background:#050508;font-family:Inter,Segoe UI,sans-serif;">
    <div style="max-width:560px;margin:0 auto;background:#0A0A10;border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:28px;">
      <p style="margin:0 0 8px;color:#5EEAD4;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;">Tetrava Labs</p>
      <h1 style="margin:0 0 12px;color:#E8E8F0;font-size:24px;font-weight:600;">Order received</h1>
      <p style="margin:0 0 20px;color:#8A8AA0;font-size:14px;line-height:1.5;">
        Thank you. <strong style="color:#E8E8F0;">${escapeHtml(orderLabel)}</strong> has been placed for research use only.
      </p>
      ${renderItems(items)}
      <p style="margin:0 0 20px;color:#E8E8F0;font-size:16px;">
        Total due: <strong>${formatMoney(total)}</strong>
      </p>
      ${renderPaymentBlock(input)}
      <hr style="margin:28px 0;border:none;border-top:1px solid rgba(255,255,255,0.1);" />
      <p style="margin:0;color:#8A8AA0;font-size:11px;line-height:1.5;">
        Research Use Only — not for human consumption. Questions? Reply to this email or visit
        <a href="${escapeHtml(siteOriginFromUrl(paymentPageUrl))}/contact" style="color:#5EEAD4;">contact</a>.
      </p>
    </div>
  </body>
</html>`.trim()

  return {
    subject: `Complete payment for ${orderLabel}`,
    html
  }
}

export function buildPaymentFollowupEmail(input: OrderEmailInput) {
  const { orderLabel, total, paymentPageUrl } = input
  const copy = paymentCopy(input.paymentMethod || "crypto")
  const contactUrl = `${siteOriginFromUrl(paymentPageUrl)}/contact`

  const html = `
<!DOCTYPE html>
<html>
  <body style="margin:0;padding:24px;background:#050508;font-family:Inter,Segoe UI,sans-serif;">
    <div style="max-width:560px;margin:0 auto;background:#0A0A10;border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:28px;">
      <p style="margin:0 0 8px;color:#5EEAD4;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;">Tetrava Labs</p>
      <h1 style="margin:0 0 12px;color:#E8E8F0;font-size:24px;font-weight:600;">Need help completing payment?</h1>
      <p style="margin:0 0 16px;color:#8A8AA0;font-size:14px;line-height:1.5;">
        We noticed payment for <strong style="color:#E8E8F0;">${escapeHtml(orderLabel)}</strong> (${formatMoney(total)}) has not been completed yet.
      </p>
      <p style="margin:0 0 16px;color:#8A8AA0;font-size:14px;line-height:1.5;">
        If everything looks good on your end, you can finish checkout using the link below. If you ran into an issue — wallet delays, card decline, or anything else — reply to this email or contact us anytime. We are happy to help.
      </p>
      <p style="margin:0 0 16px;color:#E8E8F0;font-size:15px;line-height:1.5;">
        ${copy.intro}
      </p>
      <a href="${escapeHtml(input.paymentUrl)}"
         style="display:inline-block;background:#5EEAD4;color:#050508;text-decoration:none;font-weight:600;font-size:14px;padding:12px 20px;border-radius:8px;">
        ${copy.button}
      </a>
      <p style="margin:16px 0 0;color:#8A8AA0;font-size:12px;line-height:1.5;">
        Payment page: <a href="${escapeHtml(paymentPageUrl)}" style="color:#5EEAD4;">${escapeHtml(paymentPageUrl)}</a><br />
        Contact support: <a href="${escapeHtml(contactUrl)}" style="color:#5EEAD4;">${escapeHtml(contactUrl)}</a>
      </p>
      <hr style="margin:28px 0;border:none;border-top:1px solid rgba(255,255,255,0.1);" />
      <p style="margin:0;color:#8A8AA0;font-size:11px;line-height:1.5;">
        Research Use Only — not for human consumption.
      </p>
    </div>
  </body>
</html>`.trim()

  return {
    subject: `Still need help with ${orderLabel}?`,
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

export function isLivePaymentUrl(url: string | null | undefined) {
  return Boolean(url && !url.includes("example.com"))
}
