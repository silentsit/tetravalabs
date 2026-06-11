/**
 * Verify Typesense configuration and optionally test search.
 *
 * Usage:
 *   npm run typesense:setup
 *   npm run typesense:setup -- --test
 */

import dotenv from "dotenv"
import path from "node:path"
import Typesense from "typesense"
import { buildTypesenseBaseUrl, getTypesenseNodeConfig, isTypesenseConfigured } from "../packages/catalog/lib/typesense-config.mjs"

dotenv.config({ path: path.join("apps", "medusa", ".env") })
dotenv.config({ path: path.join("apps", "storefront", ".env.local") })

const { host, port, protocol } = getTypesenseNodeConfig()
const collection = process.env.TYPESENSE_COLLECTION || "products"
const apiKey = process.env.TYPESENSE_API_KEY || ""

console.log("Typesense setup\n")
console.log(`  Host: ${buildTypesenseBaseUrl()}`)
console.log(`  Collection: ${collection}`)
console.log(`  API key: ${apiKey ? "set" : "missing"}`)

if (!isTypesenseConfigured()) {
  console.log("\nSet on Medusa (indexing) and Vercel (search):")
  console.log("  TYPESENSE_PROTOCOL=https")
  console.log("  TYPESENSE_HOST=<cluster>.a1.typesense.net")
  console.log("  TYPESENSE_PORT=443")
  console.log("  TYPESENSE_API_KEY=<search-only or admin key>")
  console.log("  TYPESENSE_COLLECTION=products")
  process.exit(0)
}

if (!process.argv.includes("--test")) {
  console.log("\nRun with --test to ping the cluster and search for 'bpc'.")
  process.exit(0)
}

const client = new Typesense.Client({
  nodes: [{ host, port, protocol }],
  apiKey,
  connectionTimeoutSeconds: 10
})

try {
  const health = await client.health.retrieve()
  console.log(`\n[ok] Health: ${health.ok === true ? "healthy" : JSON.stringify(health)}`)

  const info = await client.collections(collection).retrieve()
  console.log(`[ok] Collection "${collection}" has ${info.num_documents} documents`)

  const search = await client.collections(collection).documents().search({
    q: "bpc",
    query_by: "title,handle,cas_number,molecular_formula,sequence",
    per_page: 3
  })
  console.log(`[ok] Sample search returned ${search.found} matches`)
  process.exit(0)
} catch (error) {
  console.error(`\n[fail] ${error instanceof Error ? error.message : error}`)
  process.exit(1)
}
