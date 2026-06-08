const storefrontUrl = process.env.SMOKE_STOREFRONT_URL || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
const medusaUrl = process.env.SMOKE_MEDUSA_URL || process.env.NEXT_PUBLIC_MEDUSA_URL || "http://localhost:9000"
const typesenseUrl = process.env.SMOKE_TYPESENSE_URL || "http://localhost:8108"

const endpoints = [
  { name: "Storefront", url: storefrontUrl, required: true },
  { name: "Medusa Health", url: `${medusaUrl.replace(/\/$/, "")}/health`, required: true },
  {
    name: "Medusa Store Products",
    url: `${medusaUrl.replace(/\/$/, "")}/store/products?limit=1`,
    required: true
  },
  { name: "Storefront Search API", url: `${storefrontUrl.replace(/\/$/, "")}/api/search?q=semaglutide`, required: false },
  { name: "Typesense Health", url: `${typesenseUrl.replace(/\/$/, "")}/health`, required: false }
]

async function checkEndpoint({ name, url, required }) {
  try {
    const response = await fetch(url, { method: "GET" })
    const ok = response.ok
    console.log(`[${ok ? "ok" : "fail"}] ${name} -> ${response.status} (${url})`)
    return ok || !required
  } catch (error) {
    console.log(`[down] ${name} -> ${error?.message || error} (${url})`)
    return !required
  }
}

async function run() {
  console.log("Production smoke test")
  console.log(`Storefront: ${storefrontUrl}`)
  console.log(`Medusa: ${medusaUrl}`)

  let failed = 0
  for (const endpoint of endpoints) {
    const ok = await checkEndpoint(endpoint)
    if (!ok) failed += 1
  }

  if (failed > 0) {
    console.log(`Smoke test completed with ${failed} failing required check(s).`)
    process.exit(1)
  }
  console.log("Smoke test completed successfully.")
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
