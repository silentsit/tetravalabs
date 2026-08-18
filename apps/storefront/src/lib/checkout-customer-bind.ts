const MEDUSA_URL = (process.env.NEXT_PUBLIC_MEDUSA_URL || "http://localhost:9000").replace(/\/$/, "")
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

type BindCustomerResult = {
  ok: boolean
  linked?: boolean
  customer_id?: string | null
  reason?: string
}

function medusaHeaders(authToken?: string | null) {
  return {
    "Content-Type": "application/json",
    ...(PUBLISHABLE_KEY ? { "x-publishable-api-key": PUBLISHABLE_KEY } : {}),
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {})
  }
}

export async function bindCheckoutCustomerOnMedusa(input: {
  email: string
  cartId?: string
  orderId?: string
  authToken?: string | null
}): Promise<BindCustomerResult> {
  if (!PUBLISHABLE_KEY) {
    return { ok: false, reason: "Publishable key not configured" }
  }

  try {
    const response = await fetch(`${MEDUSA_URL}/store/checkout/bind-customer`, {
      method: "POST",
      headers: medusaHeaders(input.authToken),
      body: JSON.stringify({
        email: input.email,
        cart_id: input.cartId,
        order_id: input.orderId
      }),
      cache: "no-store"
    })

    const data = (await response.json().catch(() => ({}))) as BindCustomerResult
    if (!response.ok) {
      return { ok: false, reason: data.reason || "Could not bind checkout customer" }
    }
    return data
  } catch {
    return { ok: false, reason: "Could not reach checkout customer bind API" }
  }
}

export async function transferCartToAuthenticatedCustomer(cartId: string, authToken: string) {
  if (!PUBLISHABLE_KEY || !authToken) return

  try {
    await fetch(`${MEDUSA_URL}/store/carts/${encodeURIComponent(cartId)}/customer`, {
      method: "POST",
      headers: medusaHeaders(authToken),
      body: JSON.stringify({}),
      cache: "no-store"
    })
  } catch {
    // Non-blocking; bind-customer is the fallback.
  }
}

export async function syncGuestOrdersToAccount(authToken: string) {
  if (!PUBLISHABLE_KEY || !authToken) return

  try {
    await fetch(`${MEDUSA_URL}/store/checkout/sync-orders`, {
      method: "POST",
      headers: medusaHeaders(authToken),
      body: JSON.stringify({}),
      cache: "no-store"
    })
  } catch {
    // Non-blocking account convenience.
  }
}
