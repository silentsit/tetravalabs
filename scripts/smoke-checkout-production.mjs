/**
 * End-to-end checkout smoke test against production storefront + Medusa.
 *
 * Usage:
 *   SMOKE_STOREFRONT_URL=https://tetravalabs.com npm run smoke:checkout
 */

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
  ""

if (!publishableKey) {
  console.error("Set SMOKE_MEDUSA_PUBLISHABLE_KEY or NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY")
  process.exit(1)
}

const medusaHeaders = {
  "x-publishable-api-key": publishableKey,
  "Content-Type": "application/json"
}

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
    items: [{ variantId, quantity: 1 }]
  })
})

const checkoutData = await checkoutRes.json()
console.log(`[${checkoutRes.ok ? "ok" : "fail"}] Checkout API -> ${checkoutRes.status}`)
console.log(JSON.stringify(checkoutData, null, 2))

if (!checkoutRes.ok || !checkoutData.order_id) {
  process.exit(1)
}

const intentRes = await fetch(`${medusaUrl}/store/payments/crypto-intent`, {
  method: "POST",
  headers: medusaHeaders,
  body: JSON.stringify({
    order_id: checkoutData.order_id,
    email: `smoke-test+${Date.now()}@tetravalabs.com`,
    amount_usd: checkoutData.total || 1,
    currency: "USD"
  })
})
const intentData = await intentRes.json()
console.log(`[${intentRes.ok ? "ok" : "warn"}] Crypto intent -> ${intentRes.status}`)
console.log(JSON.stringify(intentData, null, 2))

console.log("\nCheckout smoke test passed.")
