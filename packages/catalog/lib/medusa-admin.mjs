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
  } catch (loginError) {
    try {
      await axios.post(`${baseUrl}/auth/user/emailpass/register`, {
        email: process.env.MEDUSA_ADMIN_EMAIL,
        password: process.env.MEDUSA_ADMIN_PASSWORD
      })
      console.warn(
        "Registered auth identity but admin user may still need linking. Run: npm --prefix apps/medusa run bootstrap:admin"
      )
      return login()
    } catch (registerError) {
      const status = registerError.response?.status
      if (status === 401 || status === 409 || status === 422) {
        return login()
      }
      throw registerError.response ? registerError : loginError
    }
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

/** Catalog slugs renamed in Price List USD — Medusa may still use legacy handles. */
export const LEGACY_HANDLE_BY_CATALOG_HANDLE = {
  "nad-100mg": "nad-plus-100mg",
  "nad-500mg": "nad-plus-500mg",
  "nad-1000mg": "nad-plus-1000mg",
  "bpc-157-capsules-100-count-500mcg": "bpc-157-capsules-100ct",
  "glow-bpc-157-tb500-ghk-cu-30mg": "glow-blend-30mg",
  "glow-bpc-157-tb500-ghk-cu-85mg": "glow-blend-85mg",
  "cjc-1295-without-dac-ipamorelin-blend-10mg": "cjc-1295-ipamorelin-blend-10mg",
  "cjc-1295-without-dac-sermorelin-ipamorelin-blend-5mg": "cjc-1295-sermorelin-ipamorelin-blend-5mg"
}

export async function fetchCatalogProduct(client, catalogHandle) {
  const existing = await fetchProductByHandle(client, catalogHandle)
  if (existing) {
    return { existing, legacyHandle: null }
  }

  const legacyHandle = LEGACY_HANDLE_BY_CATALOG_HANDLE[catalogHandle]
  if (!legacyHandle) {
    return { existing: null, legacyHandle: null }
  }

  const legacyProduct = await fetchProductByHandle(client, legacyHandle)
  return { existing: legacyProduct, legacyHandle: legacyProduct ? legacyHandle : null }
}

export async function verifyMedusaReachable(client) {
  try {
    await client.get("/admin/sales-channels", { params: { limit: 1 } })
    return true
  } catch (error) {
    throw new Error(formatAxiosError(error))
  }
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
  const status = error?.response?.status
  const method = error?.config?.method?.toUpperCase() || "REQUEST"
  const baseURL = error?.config?.baseURL || ""
  const url = error?.config?.url || ""
  const fullUrl = `${baseURL}${url}`
  const data = error?.response?.data
  const detail =
    typeof data === "string"
      ? data
      : data?.message || data?.type || (data ? JSON.stringify(data) : error?.message || String(error))

  if (status === 404 && fullUrl.includes("/auth/")) {
    return (
      `${method} ${fullUrl} failed (404): Medusa auth endpoint not found. ` +
      `Check MEDUSA_ADMIN_URL (${MEDUSA_ADMIN_URL()}) — the service may be down, suspended, or misconfigured on Render.`
    )
  }

  return `${method} ${fullUrl} failed (${status || "network"}): ${detail}`
}
