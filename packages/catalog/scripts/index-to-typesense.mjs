import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import dotenv from "dotenv"
import Typesense from "typesense"
import { buildTypesenseBaseUrl, getTypesenseNodeConfig, isTypesenseConfigured } from "../lib/typesense-config.mjs"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const workspaceRoot = path.resolve(__dirname, "..", "..", "..")
dotenv.config({ path: path.join(workspaceRoot, "apps", "medusa", ".env") })
dotenv.config({ path: path.join(workspaceRoot, "apps", "storefront", ".env.local") })

const normalizedPath = path.join(workspaceRoot, "packages", "catalog", "output", "catalog.normalized.json")
const collectionName = process.env.TYPESENSE_COLLECTION || "products"
const STORE_PRODUCT_FIELDS = "*variants,*variants.calculated_price,+variants.prices"
const { host, port, protocol } = getTypesenseNodeConfig()
const apiKey = process.env.TYPESENSE_API_KEY || "xyz"

const MEDUSA_URL = (process.env.MEDUSA_ADMIN_URL || process.env.NEXT_PUBLIC_MEDUSA_URL || "").replace(/\/$/, "")
const PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || process.env.MEDUSA_PUBLISHABLE_KEY || ""

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

function variantPriceCents(variant) {
  const fromPrices = variant?.prices?.[0]?.amount
  if (fromPrices != null && Number(fromPrices) > 0) return Number(fromPrices)
  const calculated = variant?.calculated_price?.calculated_amount
  if (calculated != null && Number(calculated) > 0) return Number(calculated)
  return 0
}

function mapMedusaProduct(product) {
  const prices = (product.variants || []).map(variantPriceCents).filter((amount) => amount > 0)
  const priceMin = prices.length ? Math.min(...prices) : 0
  const priceMax = prices.length ? Math.max(...prices) : 0
  const metadata = product.metadata || {}

  return {
    id: product.id,
    title: product.title,
    handle: product.handle,
    category: String(metadata.source_category || "Research Product"),
    strengths: (product.variants || []).map((variant) => variant.title),
    cas_number: String(metadata.cas_number || ""),
    molecular_formula: String(metadata.molecular_formula || ""),
    sequence: String(metadata.sequence || ""),
    visual_type: String(metadata.visual_type || "vial"),
    price_min: priceMin,
    price_max: priceMax,
    coa_available: Boolean(metadata.coa_available)
  }
}

function mapCatalogProduct(product) {
  const prices = product.variants
    .map((variant) => Math.round(variant.amount_usd * 100))
    .filter((amount) => amount > 0)
  const priceMin = prices.length ? Math.min(...prices) : 0
  const priceMax = prices.length ? Math.max(...prices) : 0
  return {
    id: product.handle,
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
}

async function fetchMedusaProducts() {
  if (!MEDUSA_URL || !PUBLISHABLE_KEY) return null

  const all = []
  const limit = 100
  let offset = 0

  while (true) {
    const url = new URL(`${MEDUSA_URL}/store/products`)
    url.searchParams.set("fields", STORE_PRODUCT_FIELDS)
    url.searchParams.set("limit", String(limit))
    url.searchParams.set("offset", String(offset))
    const response = await fetch(url.toString(), {
      headers: { "x-publishable-api-key": PUBLISHABLE_KEY }
    })
    if (!response.ok) {
      console.warn(`Medusa products fetch failed (${response.status}); falling back to catalog JSON.`)
      return null
    }
    const data = await response.json()
    const batch = data.products || []
    all.push(...batch)
    if (batch.length < limit) break
    offset += limit
  }

  return all.map(mapMedusaProduct)
}

async function loadCatalogProducts() {
  const normalized = JSON.parse(await fs.readFile(normalizedPath, "utf8"))
  return normalized.products.map(mapCatalogProduct)
}

async function ensureCollection() {
  try {
    await client.collections(collectionName).retrieve()
  } catch {
    await client.collections().create(schema)
  }
}

async function run() {
  if (!isTypesenseConfigured()) {
    console.warn(
      "Typesense not configured (set TYPESENSE_HOST and TYPESENSE_API_KEY on Render). Skipping index — search uses catalog fallback until configured."
    )
    process.exit(0)
  }

  try {
    new URL(buildTypesenseBaseUrl())
  } catch {
    console.warn(
      `Invalid Typesense config — skipping index. Set TYPESENSE_HOST to hostname only (e.g. cluster.a1.typesense.net), TYPESENSE_PROTOCOL=https, TYPESENSE_PORT=443. Got: ${process.env.TYPESENSE_HOST}`
    )
    process.exit(0)
  }

  const documents = (await fetchMedusaProducts()) ?? (await loadCatalogProducts())
  const source =
    documents.length > 0 && String(documents[0].id).startsWith("prod_") ? "medusa" : "catalog"

  await ensureCollection()
  const payload = documents.map((doc) => JSON.stringify(doc)).join("\n")
  const result = await client
    .collections(collectionName)
    .documents()
    .import(payload, { action: "upsert" })

  console.log(`Indexed ${documents.length} products (${source}) into Typesense collection "${collectionName}".`)
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
    message.includes("Invalid URL") ||
    message === "AggregateError"
  ) {
    if (message.includes("Invalid URL")) {
      console.warn(
        `Typesense URL invalid. Set TYPESENSE_HOST to hostname only (e.g. xxx.a1.typesense.net), TYPESENSE_PROTOCOL=https, TYPESENSE_PORT=443. Current host: ${process.env.TYPESENSE_HOST}`
      )
    } else {
      console.warn("Typesense is not reachable. Start the service and rerun `npm run typesense:index`.")
    }
    process.exit(0)
  }
  console.error("Typesense indexing failed:", message)
  process.exit(1)
})
