import { loadDeployEnv } from "./load-env.mjs"

const storefrontUrl = (process.env.SMOKE_STOREFRONT_URL || "").replace(/\/$/, "")
const medusaUrl = (process.env.SMOKE_MEDUSA_URL || "").replace(/\/$/, "")

async function checkEndpoint({ name, url, headers = {}, optional = false }) {
  try {
    const response = await fetch(url, { method: "GET", headers })
    const ok = response.ok
    console.log(`[${ok ? "ok" : optional ? "warn" : "fail"}] ${name} -> ${response.status}`)
    return ok || optional
  } catch (error) {
    console.log(`[${optional ? "warn" : "down"}] ${name} -> ${error?.message || error}`)
    return optional
  }
}

async function run() {
  if (!storefrontUrl || !medusaUrl) {
    console.error("Set SMOKE_STOREFRONT_URL and SMOKE_MEDUSA_URL before running production smoke.")
    process.exit(1)
  }

  const { storefront } = await loadDeployEnv()
  const publishableKey =
    process.env.SMOKE_MEDUSA_PUBLISHABLE_KEY ||
    storefront.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY ||
    ""
  const medusaHeaders = publishableKey
    ? { "x-publishable-api-key": publishableKey }
    : {}

  if (!publishableKey) {
    console.log("[warn] Publishable API key not set — Medusa store checks may fail")
  }

  const endpoints = [
    { name: "Storefront", url: storefrontUrl },
    { name: "Medusa Health", url: `${medusaUrl}/health` },
    {
      name: "Medusa Store Products",
      url: `${medusaUrl}/store/products?limit=1`,
      headers: medusaHeaders
    },
    {
      name: "Storefront Checkout API",
      url: `${storefrontUrl}/api/checkout`,
      optional: true
    },
    {
      name: "Storefront Payment Status API",
      url: `${storefrontUrl}/api/payment-status?order_id=smoke-test`,
      optional: true
    }
  ]

  let failed = 0
  for (const endpoint of endpoints) {
    const ok = await checkEndpoint(endpoint)
    if (!ok) failed += 1
  }

  if (failed > 0) {
    console.log(`Production smoke completed with ${failed} failing check(s).`)
    process.exit(1)
  }
  console.log("Production smoke completed successfully.")
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
