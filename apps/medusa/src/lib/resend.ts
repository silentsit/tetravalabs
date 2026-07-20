import { buildPasswordResetEmail } from "./password-reset-email"
import { sendPaidOrderConfirmationEmail } from "./order-email-schedule"

type PaymentReceivedInput = {
  email: string
  orderId: string
  amountUsd: number
}

type PasswordResetInput = {
  email: string
  resetUrl: string
}

/** Immediate post-payment thank-you / order confirmation (replaces standalone payment email). */
export async function sendPaymentReceivedEmail(input: PaymentReceivedInput) {
  return sendPaidOrderConfirmationEmail({
    orderId: input.orderId,
    email: input.email,
    amountUsd: input.amountUsd
  })
}

export async function sendPasswordResetEmail(input: PasswordResetInput) {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM || "Tetrava Labs <orders@tetravalabs.com>"
  if (!apiKey) return { sent: false, reason: "RESEND_API_KEY not configured" }

  const { subject, html } = buildPasswordResetEmail({
    resetUrl: input.resetUrl,
    email: input.email
  })

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from,
      to: [input.email],
      subject,
      html
    })
  })

  if (!response.ok) {
    const error = await response.text()
    return { sent: false, reason: error }
  }

  return { sent: true }
}
