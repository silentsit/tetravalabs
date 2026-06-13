import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import dotenv from "dotenv"
import Typesense from "typesense"
import { buildTypesenseBaseUrl, getTypesenseNodeConfig } from "../lib/typesense-config.mjs"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const workspaceRoot = path.resolve(__dirname, "..", "..", "..")
dotenv.config({ path: path.join(workspaceRoot, "apps", "medusa", ".env") })

const normalizedPath = path.join(workspaceRoot, "packages", "catalog", "output", "catalog.normalized.json")
const collectionName = process.env.TYPESENSE_COLLECTION || "products"
const { host, port, protocol } = getTypesenseNodeConfig()
const apiKey = process.env.TYPESENSE_API_KEY || "xyz"

const client = new Typesense.Client({
  nodes: [{ host, port, protocol }],
  apiKey,
  connectionTimeoutSeconds: 10
})

const schema = {
  name: collectionName,
  fields: [
    { name: "id", type: "string" },
    { name: "title", type: "string" },
    { name: "handle", type: "string" },
    { name: "category", type: "string", facet: true },
    { name: "strengths", type: "string[]" },
    { name: "cas_number", type: "string", optional: true },
    { name: "molecular_formula", type: "string", optional: true },
    { name: "sequence", type: "string", optional: true },
    { name: "visual_type", type: "string", facet: true },
    { name: "price_min", type: "int32", facet: true },
    { name: "price_max", type: "int32", facet: true },
    { name: "coa_available", type: "bool", facet: true }
  ],
  default_sorting_field: "price_min"
}

async function ensureCollection() {
  try {
    await client.collections(collectionName).retrieve()
  } catch {
    await client.collections().create(schema)
  }
}

async function run() {
  const normalized = JSON.parse(await fs.readFile(normalizedPath, "utf8"))
  const documents = normalized.products.map((product) => {
    const prices = product.variants
      .map((variant) => Math.round(variant.amount_usd * 100))
      .filter((amount) => amount > 0)
    const priceMin = prices.length ? Math.min(...prices) : 0
    const priceMax = prices.length ? Math.max(...prices) : 0
    return {
      id: product.id,
      title: product.title,
      handle: product.handle,
      category: product.category,
      strengths: product.variants.map((variant) => variant.title),
      cas_number: product.metadata?.cas_number || "",
      molecular_formula: product.metadata?.molecular_formula || "",
      sequence: product.metadata?.sequence || "",
      visual_type: product.visual_type || "vial",
      price_min: priceMin,
      price_max: priceMax,
      coa_available: Boolean(product.metadata?.coa_available)
    }
  })

  await ensureCollection()
  const payload = documents.map((doc) => JSON.stringify(doc)).join("\n")
  const result = await client
    .collections(collectionName)
    .documents()
    .import(payload, { action: "upsert" })

  console.log(`Indexed ${documents.length} products into Typesense collection "${collectionName}".`)
  console.log(`Typesense host: ${buildTypesenseBaseUrl()}`)
  console.log(result.split("\n").slice(0, 3).join("\n"))
}

run().catch((error) => {
  const message = error?.message || String(error)
  const code = error?.code || error?.cause?.code || ""
  const networkCodes = new Set(["ECONNREFUSED", "ENOTFOUND", "ETIMEDOUT", "EAI_AGAIN"])
  if (
    networkCodes.has(code) ||
    message.includes("ECONNREFUSED") ||
    message.includes("ENOTFOUND") ||
    message.includes("getaddrinfo") ||
    message === "AggregateError"
  ) {
    console.warn("Typesense is not reachable. Start the service and rerun `npm run typesense:index`.")
    process.exit(0)
  }
  console.error("Typesense indexing failed:", message)
  process.exit(1)
})
