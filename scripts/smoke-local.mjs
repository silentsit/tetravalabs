const endpoints = [
  { name: "Storefront", url: "http://localhost:3000" },
  { name: "Medusa Health", url: "http://localhost:9000/health" },
  { name: "Medusa Store Products", url: "http://localhost:9000/store/products?limit=1" },
  { name: "Typesense Health", url: "http://localhost:8108/health" }
]

async function checkEndpoint({ name, url }) {
  try {
    const response = await fetch(url, { method: "GET" })
    console.log(`[ok] ${name} -> ${response.status}`)
    return response.ok
  } catch (error) {
    console.log(`[down] ${name} -> ${error?.message || error}`)
    return false
  }
}

async function run() {
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
