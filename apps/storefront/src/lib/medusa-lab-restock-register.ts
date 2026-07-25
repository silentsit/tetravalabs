const MEDUSA_URL = (process.env.NEXT_PUBLIC_MEDUSA_URL || "http://localhost:9000").replace(
  /\/$/,
  ""
)
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

export async function registerLabRestocksFromCheckout(input: {
  orderId: string
  email: string
  customerId?: string | null
  shippingAddress?: Record<string, unknown>
  restockItems: Array<{
    variantId: string
    quantity: number
    handle: string
    title: string
    variantTitle?: string
    unitPrice: number
    oneTimeUnitPrice?: number
    cadenceDays: number
    productId?: string
  }>
}): Promise<{ ok: boolean; message?: string }> {
  if (!PUBLISHABLE_KEY) {
    return { ok: false, message: "Publishable key not configured" }
  }

  try {
    const response = await fetch(`${MEDUSA_URL}/store/lab-restocks/register`, {
      method: "POST",
      headers: {
        "x-publishable-api-key": PUBLISHABLE_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        order_id: input.orderId,
        email: input.email,
        customer_id: input.customerId || undefined,
        shipping_address: input.shippingAddress,
        restock_items: input.restockItems
      }),
      cache: "no-store"
    })

    const data = await response.json().catch(() => ({}))
    if (!response.ok || data?.ok === false) {
      return { ok: false, message: data?.message || "Could not register Peptide Refill" }
    }
    return { ok: true }
  } catch {
    return { ok: false, message: "Could not reach Peptide Refill API" }
  }
}
