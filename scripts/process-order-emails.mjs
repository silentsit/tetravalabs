const rawUrl = (process.env.MEDUSA_PUBLIC_URL || process.env.MEDUSA_URL || "").replace(/\/$/, "")
const medusaUrl = rawUrl.startsWith("http") ? rawUrl : rawUrl ? `https://${rawUrl}` : ""
const secret = process.env.ORDER_EMAIL_CRON_SECRET

if (!medusaUrl || !secret) {
  console.error("MEDUSA_PUBLIC_URL (or MEDUSA_URL) and ORDER_EMAIL_CRON_SECRET are required")
  process.exit(1)
}

const response = await fetch(`${medusaUrl}/hooks/order-emails/process`, {
  method: "POST",
  headers: {
    "x-order-email-cron-secret": secret
  }
})

const body = await response.text()
if (!response.ok) {
  console.error(`Order email processor failed (${response.status}):`, body)
  process.exit(1)
}

console.log(body)
