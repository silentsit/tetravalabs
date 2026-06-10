/**
 * Validate BTCPay configuration and print production setup steps.
 *
 * Usage:
 *   npm run btcpay:setup
 *   BTCPAY_URL=https://pay.example.com BTCPAY_API_KEY=... BTCPAY_STORE_ID=... npm run btcpay:setup -- --test
 */

import dotenv from "dotenv"
import path from "node:path"
import { loadDeployEnv } from "./load-env.mjs"

dotenv.config({ path: path.join("apps", "medusa", ".env") })

const medusaUrl = (process.env.MEDUSA_ADMIN_URL || "https://tetrava-medusa.onrender.com").replace(
  /\/$/,
  ""
)
const storefrontUrl = (process.env.STOREFRONT_URL || "https://tetravalabs.com").replace(/\/$/, "")

const vars = {
  BTCPAY_URL: process.env.BTCPAY_URL || process.env.CRYPTO_API_URL || "",
  BTCPAY_API_KEY: process.env.BTCPAY_API_KEY || "",
  BTCPAY_STORE_ID: process.env.BTCPAY_STORE_ID || "",
  BTCPAY_WEBHOOK_SECRET: process.env.BTCPAY_WEBHOOK_SECRET || process.env.CRYPTO_WEBHOOK_SECRET || "",
  STOREFRONT_URL: process.env.STOREFRONT_URL || storefrontUrl
}

const missing = Object.entries(vars)
  .filter(([key, value]) => key !== "STOREFRONT_URL" && !value)
  .map(([key]) => key)

console.log("BTCPay production setup\n")
console.log("Render env vars (tetrava-medusa service):")
for (const [key, value] of Object.entries(vars)) {
  const display = key.includes("KEY") || key.includes("SECRET") ? (value ? "set" : "missing") : value || "missing"
  console.log(`  ${key}=${display}`)
}

console.log(`\nWebhook URL: ${medusaUrl}/webhooks/payments/btcpay`)
console.log(`Redirect after payment: ${vars.STOREFRONT_URL}/orders?payment=complete`)
console.log("\nBTCPay Server dashboard:")
console.log("  1. Store → Settings → Access Tokens → create token with invoice permissions")
console.log("  2. Copy Store ID from Store → Settings → General")
console.log("  3. Store → Webhooks → Add webhook")
console.log(`     URL: ${medusaUrl}/webhooks/payments/btcpay`)
console.log("     Events: InvoiceSettled, InvoiceExpired, InvoiceInvalid")
console.log("  4. Copy webhook secret → BTCPAY_WEBHOOK_SECRET on Render")
console.log("  5. Redeploy tetrava-medusa after saving env vars")

if (missing.length) {
  console.log(`\nMissing locally: ${missing.join(", ")}`)
  console.log("Add them to apps/medusa/.env for local testing, then mirror on Render.")
  if (!process.argv.includes("--test")) {
    process.exit(0)
  }
}

if (process.argv.includes("--test") && !missing.length) {
  const baseUrl = vars.BTCPAY_URL.replace(/\/$/, "")
  const response = await fetch(`${baseUrl}/api/v1/stores/${vars.BTCPAY_STORE_ID}`, {
    headers: { Authorization: `token ${vars.BTCPAY_API_KEY}` }
  })
  const text = await response.text()
  console.log(`\n[${response.ok ? "ok" : "fail"}] BTCPay store API -> ${response.status}`)
  if (!response.ok) {
    console.log(text.slice(0, 300))
    process.exit(1)
  }
  console.log("BTCPay credentials are valid.")
}
