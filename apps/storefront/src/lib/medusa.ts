const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_URL || "http://localhost:9000"
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

export type StoreProduct = {
  id: string
  title: string
  handle: string
  metadata?: Record<string, unknown>
  variants?: Array<{
    id: string
    title: string
    prices?: Array<{
      amount: number
      currency_code: string
    }>
  }>
}

export type StoreCoaDocument = {
  id: string
  variant_id: string
  batch_number: string
  purity_percent: number | null
  tested_at: string | null
  document_type: "coa" | "hplc"
  document_url: string
  metadata?: Record<string, unknown>
}

const withHeaders = (headers: HeadersInit = {}) => ({
  ...headers,
  ...(PUBLISHABLE_KEY ? { "x-publishable-api-key": PUBLISHABLE_KEY } : {})
})

export async function listProducts() {
  try {
    const response = await fetch(`${MEDUSA_URL}/store/products?limit=100`, {
      headers: withHeaders(),
      next: { revalidate: 300, tags: ["products"] }
    })
    if (!response.ok) throw new Error("Failed products request")
    const data = await response.json()
    return (data.products || []) as StoreProduct[]
  } catch {
    return []
  }
}

export async function getProductByHandle(handle: string) {
  try {
    const response = await fetch(`${MEDUSA_URL}/store/products?handle=${handle}`, {
      headers: withHeaders(),
      next: { revalidate: 300, tags: [`product:${handle}`] }
    })
    if (!response.ok) throw new Error("Failed product request")
    const data = await response.json()
    return (data.products?.[0] || null) as StoreProduct | null
  } catch {
    return null
  }
}

export async function listCoasByVariant(variantId: string) {
  try {
    const response = await fetch(
      `${MEDUSA_URL}/store/coas?variant_id=${encodeURIComponent(variantId)}`,
      {
        headers: withHeaders(),
        next: { revalidate: 300, tags: [`coas:${variantId}`] }
      }
    )
    if (!response.ok) throw new Error("Failed COA request")
    const data = await response.json()
    return (data.items || []) as StoreCoaDocument[]
  } catch {
    return []
  }
}

export async function listRecentCoas(limit = 50) {
  try {
    const response = await fetch(`${MEDUSA_URL}/store/coas?limit=${limit}`, {
      headers: withHeaders(),
      next: { revalidate: 300, tags: ["coas:recent"] }
    })
    if (!response.ok) throw new Error("Failed COA request")
    const data = await response.json()
    return (data.items || []) as StoreCoaDocument[]
  } catch {
    return []
  }
}
