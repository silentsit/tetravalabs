/**
 * Validate Paymento configuration and print production setup steps.
 *
 * Usage:
 *   npm run paymento:setup
 *   PAYMENTO_API_KEY=... PAYMENTO_SECRET_KEY=... npm run paymento:setup -- --test
 */

import dotenv from "dotenv"
import path from "node:path"

dotenv.config({ path: path.join("apps", "medusa", ".env") })

const medusaUrl = (process.env.MEDUSA_ADMIN_URL || "https://tetrava-medusa-i44n.onrender.com").replace(
  /\/$/,
  ""
)
const storefrontUrl = (process.env.STOREFRONT_URL || "https://tetravalabs.com").replace(/\/$/, "")

const vars = {
  PAYMENTO_API_KEY: process.env.PAYMENTO_API_KEY || "",
  PAYMENTO_SECRET_KEY: process.env.PAYMENTO_SECRET_KEY || "",
  PAYMENTO_SPEED: process.env.PAYMENTO_SPEED || "1",
  PAYMENTO_API_BASE: process.env.PAYMENTO_API_BASE || "https://api.paymento.io",
  PAYMENTO_GATEWAY_BASE: process.env.PAYMENTO_GATEWAY_BASE || "https://app.paymento.io/gateway",
  STOREFRONT_URL: process.env.STOREFRONT_URL || storefrontUrl
}

const required = ["PAYMENTO_API_KEY", "PAYMENTO_SECRET_KEY"]
const missing = required.filter((key) => !vars[key])

console.log("Paymento production setup\n")
console.log("Render env vars (tetrava-medusa service):")
for (const [key, value] of Object.entries(vars)) {
  const display =
    key.includes("KEY") || key.includes("SECRET") ? (value ? "set" : "missing") : value || "missing"
  console.log(`  ${key}=${display}`)
}

console.log("\nDual-provider routing (same as Modempic):")
console.log("  BTC  → BTCPay (when BTCPAY_* configured)")
console.log("  USDT, USDC, ETH, etc. → Paymento (when PAYMENTO_* configured)")
console.log("  Optional override: CRYPTO_PROVIDER=btcpay|paymento (debug only)")

console.log(`\nIPN webhook URL: ${medusaUrl}/webhooks/payments/paymento`)
console.log(`Return URL after payment: ${vars.STOREFRONT_URL}/orders?payment=complete`)

console.log("\nPaymento dashboard (https://paymento.io):")
console.log("  1. Create merchant account and connect wallets for each coin you accept")
console.log("  2. Settings → API → copy API key and Secret key")
console.log("  3. Settings → IPN / Callback → set URL:")
console.log(`     ${medusaUrl}/webhooks/payments/paymento`)
console.log("  4. PAYMENTO_SPEED: 1 = fast confirmation, 0 = wait for more confirmations")
console.log("  5. Redeploy tetrava-medusa after saving env vars on Render")

if (missing.length) {
  console.log(`\nMissing locally: ${missing.join(", ")}`)
  console.log("Add them to apps/medusa/.env for local testing, then mirror on Render.")
  if (!process.argv.includes("--test")) {
    process.exit(0)
  }
}

if (process.argv.includes("--test") && !missing.length) {
  const apiBase = vars.PAYMENTO_API_BASE.replace(/\/$/, "")
  const response = await fetch(`${apiBase}/v1/payment/request`, {
    method: "POST",
    headers: {
      "Api-key": vars.PAYMENTO_API_KEY,
      "Content-Type": "application/json",
      Accept: "text/plain"
    },
    body: JSON.stringify({
      fiatAmount: "1.00",
      fiatCurrency: "USD",
      ReturnUrl: `${vars.STOREFRONT_URL}/orders?payment=complete`,
      orderId: `test_${Date.now()}`,
      Speed: Number(vars.PAYMENTO_SPEED) === 0 ? 0 : 1
    })
  })
  const text = await response.text()
  console.log(`\n[${response.ok ? "ok" : "fail"}] Paymento payment request API -> ${response.status}`)
  if (!response.ok) {
    console.log(text.slice(0, 400))
    process.exit(1)
  }
  console.log("Paymento credentials are valid (test payment request created).")
}
