import path from "node:path"
import { fileURLToPath } from "node:url"
import dotenv from "dotenv"
import axios from "axios"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const workspaceRoot = path.resolve(__dirname, "..", "..", "..")

export function loadMedusaEnv() {
  dotenv.config({ path: path.join(workspaceRoot, "apps", "medusa", ".env") })
}

export const MEDUSA_ADMIN_URL = () =>
  (process.env.MEDUSA_ADMIN_URL || "http://localhost:9000").replace(/\/$/, "")

export function requireMedusaCredentials() {
  if (process.env.MEDUSA_ADMIN_TOKEN) return
  if (!process.env.MEDUSA_ADMIN_EMAIL || !process.env.MEDUSA_ADMIN_PASSWORD) {
    console.error(
      "Set MEDUSA_ADMIN_TOKEN or MEDUSA_ADMIN_EMAIL + MEDUSA_ADMIN_PASSWORD in apps/medusa/.env"
    )
    process.exit(1)
  }
}

export function getMedusaClient(token) {
  return axios.create({
    baseURL: MEDUSA_ADMIN_URL(),
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    timeout: 120_000
  })
}

export async function resolveAdminToken() {
  if (process.env.MEDUSA_ADMIN_TOKEN) return process.env.MEDUSA_ADMIN_TOKEN

  const baseUrl = MEDUSA_ADMIN_URL()
  const login = async () => {
    const response = await axios.post(
      `${baseUrl}/auth/user/emailpass`,
      {
        email: process.env.MEDUSA_ADMIN_EMAIL,
        password: process.env.MEDUSA_ADMIN_PASSWORD
      },
      { timeout: 60_000 }
    )
    return response.data?.token
  }

  try {
    return await login()
  } catch {
    await axios.post(`${baseUrl}/auth/user/emailpass/register`, {
      email: process.env.MEDUSA_ADMIN_EMAIL,
      password: process.env.MEDUSA_ADMIN_PASSWORD
    })
    console.warn(
      "Registered auth identity but admin user may still need linking. Run: npm --prefix apps/medusa run bootstrap:admin"
    )
    return login()
  }
}

export async function resolveSalesChannelId(client) {
  if (process.env.MEDUSA_SALES_CHANNEL_ID) return process.env.MEDUSA_SALES_CHANNEL_ID

  const response = await client.get("/admin/sales-channels", { params: { limit: 1 } })
  const channel = response.data?.sales_channels?.[0]
  if (!channel?.id) {
    throw new Error("No sales channel found. Complete Medusa store setup first.")
  }
  return channel.id
}

export async function ensureCategory(client, name) {
  const handle = name.toLowerCase().replace(/[^a-z0-9]+/g, "-")
  const search = await client.get("/admin/product-categories", {
    params: { q: name, limit: 50 }
  })

  const existing = search.data?.product_categories?.find(
    (category) => category.name.toLowerCase() === name.toLowerCase()
  )
  if (existing) return existing.id

  const created = await client.post("/admin/product-categories", { name, handle })
  return created.data.product_category.id
}

export async function fetchProductByHandle(client, handle) {
  const response = await client.get("/admin/products", {
    params: {
      handle,
      limit: 1,
      fields: "id,handle,title,metadata,*variants,*variants.prices,*variants.metadata,*options"
    }
  })
  return response.data?.products?.[0] || null
}

export async function syncTypesenseAfterChanges(updatedCount) {
  const syncSecret = process.env.TYPESENSE_SYNC_SECRET
  if (!syncSecret || updatedCount <= 0) {
    if (updatedCount > 0) {
      console.log("Set TYPESENSE_SYNC_SECRET in apps/medusa/.env to auto-sync Typesense after update.")
    }
    return
  }

  try {
    const response = await fetch(`${MEDUSA_ADMIN_URL()}/hooks/typesense/sync`, {
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
}

export function formatAxiosError(error) {
  return error?.response?.data || error?.message || error
}
