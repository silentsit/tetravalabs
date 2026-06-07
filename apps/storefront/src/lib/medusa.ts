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
