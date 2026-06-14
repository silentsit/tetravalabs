import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import dotenv from "dotenv"
import axios from "axios"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const workspaceRoot = path.resolve(__dirname, "..", "..", "..")
const medusaEnvPath = path.join(workspaceRoot, "apps", "medusa", ".env")
dotenv.config({ path: medusaEnvPath })

const normalizedPath = path.join(
  workspaceRoot,
  "packages",
  "catalog",
  "output",
  "catalog.normalized.json"
)

const MEDUSA_ADMIN_URL = process.env.MEDUSA_ADMIN_URL || "http://localhost:9000"
const MEDUSA_ADMIN_EMAIL = process.env.MEDUSA_ADMIN_EMAIL
const MEDUSA_ADMIN_PASSWORD = process.env.MEDUSA_ADMIN_PASSWORD
let MEDUSA_ADMIN_TOKEN = process.env.MEDUSA_ADMIN_TOKEN
let SALES_CHANNEL_ID = process.env.MEDUSA_SALES_CHANNEL_ID

const requireCredentials = () => {
  if (MEDUSA_ADMIN_TOKEN) return
  if (!MEDUSA_ADMIN_EMAIL || !MEDUSA_ADMIN_PASSWORD) {
    console.error(
      "Set MEDUSA_ADMIN_TOKEN or MEDUSA_ADMIN_EMAIL + MEDUSA_ADMIN_PASSWORD in apps/medusa/.env"
    )
    process.exit(1)
  }
}

const getClient = (token) =>
  axios.create({
    baseURL: MEDUSA_ADMIN_URL,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    timeout: 120_000
  })

const login = async () => {
  const response = await axios.post(
    `${MEDUSA_ADMIN_URL}/auth/user/emailpass`,
    {
      email: MEDUSA_ADMIN_EMAIL,
      password: MEDUSA_ADMIN_PASSWORD
    },
    { timeout: 60_000 }
  )
  return response.data?.token
}

const resolveAdminToken = async () => {
  if (MEDUSA_ADMIN_TOKEN) return MEDUSA_ADMIN_TOKEN

  try {
    return await login()
  } catch {
    await axios.post(`${MEDUSA_ADMIN_URL}/auth/user/emailpass/register`, {
      email: MEDUSA_ADMIN_EMAIL,
      password: MEDUSA_ADMIN_PASSWORD
    })
    console.warn(
      "Registered auth identity but admin user may still need linking. Run: npm --prefix apps/medusa run bootstrap:admin"
    )
    return login()
  }
}

const resolveSalesChannelId = async (client) => {
  if (SALES_CHANNEL_ID) return SALES_CHANNEL_ID

  const response = await client.get("/admin/sales-channels", { params: { limit: 1 } })
  const channel = response.data?.sales_channels?.[0]
  if (!channel?.id) {
    throw new Error("No sales channel found. Complete Medusa store setup first.")
  }
  SALES_CHANNEL_ID = channel.id
  return SALES_CHANNEL_ID
}

const ensureCategory = async (client, name, handle) => {
  const search = await client.get("/admin/product-categories", {
    params: { q: name, limit: 50 }
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

const productExists = async (client, handle) => {
  const search = await client.get("/admin/products", {
    params: { handle, limit: 1 }
  })
  return (search.data?.products?.length || 0) > 0
}

const run = async () => {
  requireCredentials()
  MEDUSA_ADMIN_TOKEN = await resolveAdminToken()
  const client = getClient(MEDUSA_ADMIN_TOKEN)
  const salesChannelId = await resolveSalesChannelId(client)

  const raw = JSON.parse(await fs.readFile(normalizedPath, "utf8"))
  let createdProducts = 0
  let skippedProducts = 0

  for (const product of raw.products) {
    if (await productExists(client, product.handle)) {
      skippedProducts += 1
      continue
    }

    const categoryId = await ensureCategory(
      client,
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
      sales_channels: [{ id: salesChannelId }]
    }

    await client.post("/admin/products", payload)
    createdProducts += 1
    console.log(`Imported ${product.handle}`)
  }

  console.log(
    `Catalog import complete. Created ${createdProducts}, skipped ${skippedProducts} (already existed).`
  )

  const syncSecret = process.env.TYPESENSE_SYNC_SECRET
  if (syncSecret && createdProducts > 0) {
    try {
      const response = await fetch(`${MEDUSA_ADMIN_URL}/hooks/typesense/sync`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-typesense-sync-secret": syncSecret
        },
        body: JSON.stringify({ action: "full" })
      })
      if (response.ok) {
        const data = await response.json()
        console.log(`Typesense full sync: ${data.indexed} indexed, ${data.failed} failed.`)
      } else {
        console.warn(`Typesense sync hook failed (${response.status}). Run npm run typesense:index`)
      }
    } catch (error) {
      console.warn("Typesense sync hook error:", error?.message || error)
    }
  } else if (createdProducts > 0) {
    console.log("Set TYPESENSE_SYNC_SECRET in apps/medusa/.env to auto-sync Typesense after import.")
  }
}

run().catch((error) => {
  const details = error?.response?.data || error?.message || error
  console.error("Import failed:", details)
  process.exit(1)
})
