type OrderItem = {
  title: string
  variantTitle?: string
  quantity: number
  unitPrice: number
}

type OrderEmailInput = {
  orderLabel: string
  total: number
  paymentUrl: string
  paymentPageUrl: string
  paymentMethod?: "crypto" | "card"
  items?: OrderItem[]
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

function paymentCopy(paymentMethod: "crypto" | "card") {
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

function renderItems(items: OrderItem[]) {
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

/** Manual / notify endpoint — unpaid payment reminder (aligned with Medusa T2). */
export function buildOrderConfirmationEmail(input: OrderEmailInput) {
  const { orderLabel, total, paymentUrl, paymentPageUrl, items = [] } = input
  const copy = paymentCopy(input.paymentMethod || "crypto")

  const html = `
<!DOCTYPE html>
<html>
  <body style="margin:0;padding:24px;background:#050508;font-family:Inter,Segoe UI,sans-serif;">
    <div style="max-width:560px;margin:0 auto;background:#0A0A10;border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:28px;">
      <p style="margin:0 0 8px;color:#5EEAD4;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;">Tetrava Labs</p>
      <h1 style="margin:0 0 12px;color:#E8E8F0;font-size:24px;font-weight:600;">Your payment is still open</h1>
      <p style="margin:0 0 16px;color:#8A8AA0;font-size:14px;line-height:1.5;">
        <strong style="color:#E8E8F0;">${escapeHtml(orderLabel)}</strong> is ready whenever you are.
        Complete payment to start fulfillment — your checkout session is waiting.
      </p>
      ${renderItems(items)}
      <p style="margin:0 0 20px;color:#E8E8F0;font-size:16px;">
        Amount due: <strong>${formatMoney(total)}</strong>
      </p>
      <p style="margin:0 0 16px;color:#E8E8F0;font-size:15px;line-height:1.5;">
        ${copy.intro}
      </p>
      <a href="${escapeHtml(paymentUrl)}"
         style="display:inline-block;background:#5EEAD4;color:#050508;text-decoration:none;font-weight:600;font-size:14px;padding:12px 20px;border-radius:8px;">
        ${copy.button}
      </a>
      <p style="margin:16px 0 0;color:#8A8AA0;font-size:12px;line-height:1.5;">
        Prefer to return to the site?
        <a href="${escapeHtml(paymentPageUrl)}" style="color:#5EEAD4;">Open your payment page</a>.
      </p>
      <hr style="margin:28px 0;border:none;border-top:1px solid rgba(255,255,255,0.1);" />
      <p style="margin:0;color:#8A8AA0;font-size:11px;line-height:1.5;">
        Research Use Only — not for human consumption. Questions? Reply to this email or visit
        <a href="${escapeHtml(new URL(paymentPageUrl).origin)}/contact" style="color:#5EEAD4;">contact</a>.
      </p>
    </div>
  </body>
</html>`.trim()

  return {
    subject: `Payment still open for ${orderLabel}`,
    html
  }
}
