/**
 * Smoke test storefront search API (Typesense or catalog fallback).
 *
 * Usage:
 *   SMOKE_STOREFRONT_URL=https://tetravalabs.com npm run smoke:search
 */

const storefrontUrl = (process.env.SMOKE_STOREFRONT_URL || "https://tetravalabs.com").replace(/\/$/, "")
const query = process.env.SMOKE_SEARCH_QUERY || "acid"

const response = await fetch(`${storefrontUrl}/api/search?q=${encodeURIComponent(query)}`)
const data = await response.json()

console.log(`[${response.ok ? "ok" : "fail"}] GET /api/search?q=${query} -> ${response.status}`)
console.log(JSON.stringify(data, null, 2))

if (!response.ok) {
  process.exit(1)
}

if (!Array.isArray(data.results)) {
  console.error("[fail] results array missing")
  process.exit(1)
}

console.log(`\nSearch smoke passed (${data.source}, ${data.count} results).`)
