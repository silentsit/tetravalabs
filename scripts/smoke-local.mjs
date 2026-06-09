import { loadDeployEnv } from "./load-env.mjs"

async function checkEndpoint({ name, url, headers = {} }) {
  try {
    const response = await fetch(url, { method: "GET", headers })
    console.log(`[ok] ${name} -> ${response.status}`)
    return response.ok
  } catch (error) {
    console.log(`[down] ${name} -> ${error?.message || error}`)
    return false
  }
}

async function run() {
  const { storefront } = await loadDeployEnv()
  const publishableKey = storefront.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""
  const medusaHeaders = publishableKey
    ? { "x-publishable-api-key": publishableKey }
    : {}

  const endpoints = [
    { name: "Storefront", url: "http://localhost:3000" },
    { name: "Medusa Health", url: "http://localhost:9000/health" },
    {
      name: "Medusa Store Products",
      url: "http://localhost:9000/store/products?limit=1",
      headers: medusaHeaders
    },
    { name: "Typesense Health", url: "http://localhost:8108/health" }
  ]

  if (!publishableKey) {
    console.log("[warn] NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY not set — store API may return 401")
  }

  let failed = 0
  for (const endpoint of endpoints) {
    const ok = await checkEndpoint(endpoint)
    if (!ok) failed += 1
  }

  if (failed > 0) {
    console.log(`Smoke test completed with ${failed} failing check(s).`)
    process.exit(1)
  }
  console.log("Smoke test completed successfully.")
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
