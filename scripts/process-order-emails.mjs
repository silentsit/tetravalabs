function resolveMedusaUrl(raw) {
  const trimmed = raw.replace(/\/$/, "")
  if (!trimmed) return ""
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed

  // Render private network hostport (e.g. tetrava-medusa:10000)
  if (/:\d+$/.test(trimmed)) return `http://${trimmed}`

  // Legacy host-only internal IP from Render fromService: host
  if (/^\d+\.\d+\.\d+\.\d+$/.test(trimmed)) {
    const port = process.env.MEDUSA_INTERNAL_PORT || "10000"
    return `http://${trimmed}:${port}`
  }

  return `https://${trimmed}`
}

const rawUrl = process.env.MEDUSA_PUBLIC_URL || process.env.MEDUSA_URL || ""
const medusaUrl = resolveMedusaUrl(rawUrl)
const secret = process.env.ORDER_EMAIL_CRON_SECRET

if (!medusaUrl || !secret) {
  console.error("MEDUSA_PUBLIC_URL (or MEDUSA_URL) and ORDER_EMAIL_CRON_SECRET are required")
  process.exit(1)
}

console.log(`[order-emails] calling ${medusaUrl}/hooks/order-emails/process`)

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
