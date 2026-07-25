import type { LabRestockRow } from "./lab-restock-db"

const MEDUSA_URL = (process.env.MEDUSA_PUBLIC_URL || "http://localhost:9000").replace(/\/$/, "")
const PUBLISHABLE_KEY = process.env.MEDUSA_PUBLISHABLE_KEY?.trim() || ""

function storeHeaders(): HeadersInit {
  return {
    "content-type": "application/json",
    ...(PUBLISHABLE_KEY ? { "x-publishable-api-key": PUBLISHABLE_KEY } : {})
  }
}

async function storeFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${MEDUSA_URL}${path}`, {
    ...init,
    headers: { ...storeHeaders(), ...(init?.headers || {}) }
  })
  const text = await response.text()
  let data: T
  try {
    data = JSON.parse(text) as T
  } catch {
    throw new Error(`Medusa store ${path} failed: ${text.slice(0, 200)}`)
  }
  if (!response.ok) {
    const message =
      typeof data === "object" && data && "message" in data
        ? String((data as { message?: string }).message)
        : text.slice(0, 200)
    throw new Error(message || `Medusa store ${path} failed (${response.status})`)
  }
  return data
}

type ShippingAddressJson = {
  first_name?: string
  last_name?: string
  company?: string
  address_1?: string
  address_2?: string
  city?: string
  province?: string
  postal_code?: string
  phone?: string
  country_code?: string
}

export async function createLabRestockRenewalOrder(
  restock: LabRestockRow
): Promise<{ ok: true; orderId: string } | { ok: false; reason: string }> {
  if (!PUBLISHABLE_KEY) {
    return { ok: false, reason: "MEDUSA_PUBLISHABLE_KEY is not configured" }
  }

  const ship = (restock.shipping_address || {}) as ShippingAddressJson
  const country = (ship.country_code || "us").toLowerCase()

  try {
    const { regions } = await storeFetch<{ regions: Array<{ id: string }> }>("/store/regions")
    const regionId = regions?.[0]?.id
    if (!regionId) return { ok: false, reason: "No Medusa region configured" }

    const { cart: createdCart } = await storeFetch<{ cart: { id: string } }>("/store/carts", {
      method: "POST",
      body: JSON.stringify({
        region_id: regionId,
        email: restock.email,
        shipping_address: {
          first_name: ship.first_name || "Research",
          last_name: ship.last_name || "Customer",
          company: ship.company,
          address_1: ship.address_1 || "Laboratory Address",
          address_2: ship.address_2,
          city: ship.city || "Research City",
          province: ship.province,
          postal_code: ship.postal_code || "00000",
          phone: ship.phone,
          country_code: country
        }
      })
    })

    let cartId = createdCart.id

    await storeFetch(`/store/carts/${cartId}/line-items`, {
      method: "POST",
      body: JSON.stringify({
        variant_id: restock.variant_id,
        quantity: restock.quantity
      })
    })

    const { shipping_options } = await storeFetch<{
      shipping_options: Array<{ id: string }>
    }>(`/store/shipping-options?cart_id=${encodeURIComponent(cartId)}`)

    const shippingOptionId = shipping_options?.[0]?.id
    if (!shippingOptionId) {
      return { ok: false, reason: "No shipping options for renewal cart" }
    }

    await storeFetch(`/store/carts/${cartId}/shipping-methods`, {
      method: "POST",
      body: JSON.stringify({ option_id: shippingOptionId })
    })

    await storeFetch(`/store/carts/${cartId}/payment-sessions`, {
      method: "POST",
      body: JSON.stringify({ provider_id: "pp_system_default" })
    })

    const completion = await storeFetch<{ type: string; order?: { id: string }; error?: { message?: string } }>(
      `/store/carts/${cartId}/complete`,
      { method: "POST", body: JSON.stringify({}) }
    )

    if (completion.type === "cart" || !completion.order?.id) {
      return {
        ok: false,
        reason: completion.error?.message || "Unable to complete renewal order"
      }
    }

    return { ok: true, orderId: completion.order.id }
  } catch (error) {
    const reason = error instanceof Error ? error.message : "Renewal order creation failed"
    return { ok: false, reason }
  }
}
