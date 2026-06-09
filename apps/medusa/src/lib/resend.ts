type PaymentReceivedInput = {
  email: string
  orderId: string
  amountUsd: number
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
}

export async function sendPaymentReceivedEmail(input: PaymentReceivedInput) {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM || "Tetrava Labs <orders@tetravalabs.com>"
  if (!apiKey) return { sent: false, reason: "RESEND_API_KEY not configured" }

  const storefront = (process.env.STOREFRONT_URL || "https://tetravalabs.com").replace(/\/$/, "")
  const ordersUrl = `${storefront}/orders?payment=complete`

  const html = `
<!DOCTYPE html>
<html>
  <body style="margin:0;padding:24px;background:#050508;font-family:Inter,Segoe UI,sans-serif;">
    <div style="max-width:560px;margin:0 auto;background:#0A0A10;border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:28px;">
      <p style="margin:0 0 8px;color:#5EEAD4;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;">Tetrava Labs</p>
      <h1 style="margin:0 0 12px;color:#E8E8F0;font-size:24px;font-weight:600;">Payment confirmed</h1>
      <p style="margin:0 0 16px;color:#8A8AA0;font-size:14px;line-height:1.5;">
        Your crypto payment for order <strong style="color:#E8E8F0;">${escapeHtml(input.orderId)}</strong> has been confirmed.
      </p>
      <p style="margin:0 0 20px;color:#E8E8F0;font-size:16px;">
        Amount: <strong>$${input.amountUsd.toFixed(2)}</strong>
      </p>
      <p style="margin:0 0 16px;color:#8A8AA0;font-size:14px;line-height:1.5;">
        Fulfillment will begin shortly. Research Use Only — not for human consumption.
      </p>
      <a href="${escapeHtml(ordersUrl)}"
         style="display:inline-block;background:#5EEAD4;color:#050508;text-decoration:none;font-weight:600;font-size:14px;padding:12px 20px;border-radius:8px;">
        View order history
      </a>
    </div>
  </body>
</html>`.trim()

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from,
      to: [input.email],
      subject: `Payment confirmed: ${input.orderId}`,
      html
    })
  })

  if (!response.ok) {
    const error = await response.text()
    return { sent: false, reason: error }
  }

  return { sent: true }
}
