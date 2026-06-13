/**
 * End-to-end checkout smoke test against production storefront + Medusa.
 *
 * Usage:
 *   SMOKE_STOREFRONT_URL=https://tetravalabs.com npm run smoke:checkout
 *   SMOKE_CRYPTO_ASSET=USDT npm run smoke:checkout
 */

import { loadDeployEnv } from "./load-env.mjs"

const { storefront } = await loadDeployEnv()

const storefrontUrl = (process.env.SMOKE_STOREFRONT_URL || "https://tetravalabs.com").replace(
  /\/$/,
  ""
)
const medusaUrl = (
  process.env.SMOKE_MEDUSA_URL || "https://tetrava-medusa.onrender.com"
).replace(/\/$/, "")
const publishableKey =
  process.env.SMOKE_MEDUSA_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY ||
  storefront.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY ||
  ""
const cryptoAsset = (process.env.SMOKE_CRYPTO_ASSET || "BTC").trim().toUpperCase()

if (!publishableKey) {
  console.error("Set SMOKE_MEDUSA_PUBLISHABLE_KEY or NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY")
  process.exit(1)
}

const medusaHeaders = {
  "x-publishable-api-key": publishableKey,
  "Content-Type": "application/json"
}

const optionsRes = await fetch(`${medusaUrl}/store/payments/crypto-options`, {
  headers: medusaHeaders
})
const optionsData = await optionsRes.json()
const assetOption = optionsData.assets?.find((item) => item.asset === cryptoAsset)
console.log(
  `[${optionsRes.ok ? "ok" : "fail"}] crypto-options (${cryptoAsset} -> ${assetOption?.provider || "n/a"})`
)

const productsRes = await fetch(`${medusaUrl}/store/products?limit=1`, {
  headers: medusaHeaders
})
const productsData = await productsRes.json()
const variantId = productsData.products?.[0]?.variants?.[0]?.id

if (!variantId) {
  console.error("[fail] No product variant found for checkout test")
  process.exit(1)
}

console.log(`[ok] Using variant ${variantId} (${productsData.products[0].title})`)

const checkoutRes = await fetch(`${storefrontUrl}/api/checkout`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: `smoke-test+${Date.now()}@tetravalabs.com`,
    firstName: "Smoke",
    lastName: "Test",
    address1: "123 Lab Street",
    city: "Portland",
    postalCode: "97201",
    country: "US",
    crypto_asset: cryptoAsset,
    items: [{ variantId, quantity: 1, title: productsData.products[0].title, unitPrice: 10.99 }]
  })
})

const checkoutData = await checkoutRes.json()
console.log(`[${checkoutRes.ok ? "ok" : "fail"}] Checkout API -> ${checkoutRes.status}`)
console.log(JSON.stringify(checkoutData, null, 2))

if (!checkoutRes.ok || !checkoutData.order_id) {
  process.exit(1)
}

let provider = checkoutData.payment_provider
let providerUrl = checkoutData.payment_url

if (!providerUrl) {
  const intentRes = await fetch(`${medusaUrl}/store/payments/crypto-intent`, {
    method: "POST",
    headers: medusaHeaders,
    body: JSON.stringify({
      order_id: checkoutData.order_id,
      email: `smoke-test+${Date.now()}@tetravalabs.com`,
      amount_usd: checkoutData.total || 1,
      currency: "USD",
      crypto_asset: cryptoAsset
    })
  })
  const intentData = await intentRes.json()
  console.log(`[${intentRes.ok ? "ok" : "warn"}] Crypto intent -> ${intentRes.status}`)
  console.log(JSON.stringify(intentData, null, 2))
  provider = intentData.provider
  providerUrl = intentData.provider_url
  if (!intentRes.ok) process.exit(1)
} else {
  console.log(`[ok] Checkout returned payment_url (${provider})`)
}

const expectedProvider = cryptoAsset === "BTC" ? "btcpay" : "paymento"
if (provider !== expectedProvider) {
  console.error(`[fail] Expected provider ${expectedProvider}, got ${provider}`)
  process.exit(1)
}

if (expectedProvider === "paymento" && providerUrl && !providerUrl.includes("paymento")) {
  console.error(`[fail] Paymento URL expected, got ${providerUrl}`)
  process.exit(1)
}

console.log("\nCheckout smoke test passed.")
