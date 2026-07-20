const MEDUSA_URL = (process.env.NEXT_PUBLIC_MEDUSA_URL || "http://localhost:9000").replace(/\/$/, "")
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

export type OrderEmailItem = {
  title: string
  variantTitle?: string
  quantity: number
  unitPrice: number
}

export async function scheduleOrderEmails(input: {
  orderId: string
  email: string
  displayId?: number
  totalUsd: number
  paymentMethod: "card" | "crypto"
  items: OrderEmailItem[]
}) {
  if (!PUBLISHABLE_KEY) {
    return { ok: false as const, reason: "NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY not configured" }
  }

  try {
    const response = await fetch(`${MEDUSA_URL}/store/orders/email-schedule`, {
      method: "POST",
      headers: {
        "x-publishable-api-key": PUBLISHABLE_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        order_id: input.orderId,
        email: input.email,
        display_id: input.displayId,
        total_usd: input.totalUsd,
        payment_method: input.paymentMethod,
        items: input.items
      }),
      cache: "no-store"
    })

    if (!response.ok) {
      const message = await response.text()
      return { ok: false as const, reason: message || "Unable to schedule order emails" }
    }

    return { ok: true as const }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to schedule order emails"
    return { ok: false as const, reason: message }
  }
}
