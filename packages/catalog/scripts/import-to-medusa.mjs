import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import axios from "axios"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const workspaceRoot = path.resolve(__dirname, "..", "..", "..")
const normalizedPath = path.join(
  workspaceRoot,
  "packages",
  "catalog",
  "output",
  "catalog.normalized.json"
)

const MEDUSA_ADMIN_URL = process.env.MEDUSA_ADMIN_URL || "http://localhost:9000"
const MEDUSA_ADMIN_TOKEN = process.env.MEDUSA_ADMIN_TOKEN
const SALES_CHANNEL_ID = process.env.MEDUSA_SALES_CHANNEL_ID

if (!MEDUSA_ADMIN_TOKEN) {
  console.error("Missing MEDUSA_ADMIN_TOKEN in environment.")
  process.exit(1)
}

const client = axios.create({
  baseURL: MEDUSA_ADMIN_URL,
  headers: {
    Authorization: `Bearer ${MEDUSA_ADMIN_TOKEN}`,
    "Content-Type": "application/json"
  },
  timeout: 60_000
})

const ensureCategory = async (name, handle) => {
  const search = await client.get("/admin/product-categories", {
    params: { q: name, limit: 1 }
  })

  const existing = search.data?.product_categories?.find(
    (category) => category.name.toLowerCase() === name.toLowerCase()
  )
  if (existing) return existing.id

  const created = await client.post("/admin/product-categories", {
    name,
    handle
  })
  return created.data.product_category.id
}

const run = async () => {
  const raw = JSON.parse(await fs.readFile(normalizedPath, "utf8"))
  let createdProducts = 0

  for (const product of raw.products) {
    const categoryId = await ensureCategory(
      product.category,
      product.category.toLowerCase().replace(/[^a-z0-9]+/g, "-")
    )

    const payload = {
      title: product.title,
      subtitle: "Research Use Only",
      handle: product.handle,
      status: "published",
      categories: [{ id: categoryId }],
      metadata: {
        ...product.metadata,
        visual_type: product.visual_type,
        source_category: product.category
      },
      options: [
        {
          title: "Strength",
          values: product.variants.map((variant) => variant.title)
        }
      ],
      variants: product.variants.map((variant) => ({
        title: variant.title,
        sku: variant.sku,
        manage_inventory: false,
        options: { Strength: variant.title },
        prices: [
          {
            amount: Math.round(variant.amount_usd * 100),
            currency_code: "usd"
          }
        ],
        metadata: variant.metadata
      })),
      sales_channels: SALES_CHANNEL_ID ? [{ id: SALES_CHANNEL_ID }] : undefined
    }

    await client.post("/admin/products", payload)
    createdProducts += 1
  }

  console.log(`Imported ${createdProducts} products into Medusa.`)
}

run().catch((error) => {
  const details = error?.response?.data || error?.message || error
  console.error("Import failed:", details)
  process.exit(1)
})
