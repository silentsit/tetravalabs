import type { MedusaContainer } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { markPaymentCollectionAsPaid } from "@medusajs/medusa/core-flows"

type CaptureResult = {
  ok: boolean
  alreadyPaid?: boolean
  reason?: string
}

type OrderWithPaymentCollections = {
  id: string
  payment_collections?: Array<{
    id?: string
    status?: string
  }>
}

const PAID_STATUSES = new Set(["completed", "paid", "captured"])

export async function captureOrderPayment(
  orderId: string,
  scope: MedusaContainer
): Promise<CaptureResult> {
  if (!orderId.startsWith("order_")) {
    return { ok: false, reason: "Invalid Medusa order id" }
  }

  try {
    const query = scope.resolve(ContainerRegistrationKeys.QUERY)
    const { data: orders } = (await query.graph({
      entity: "order",
      fields: ["id", "payment_collections.id", "payment_collections.status"],
      filters: { id: orderId }
    })) as { data: OrderWithPaymentCollections[] }

    const order = orders?.[0]
    if (!order) {
      return { ok: false, reason: "Order not found" }
    }

    const paymentCollection = order.payment_collections?.find((item) => item?.id)
    if (!paymentCollection?.id) {
      return { ok: false, reason: "No payment collection linked to order" }
    }

    if (paymentCollection.status && PAID_STATUSES.has(paymentCollection.status)) {
      return { ok: true, alreadyPaid: true }
    }

    await markPaymentCollectionAsPaid(scope).run({
      input: {
        order_id: orderId,
        payment_collection_id: paymentCollection.id
      }
    })

    return { ok: true }
  } catch (error) {
    const reason = error instanceof Error ? error.message : "Failed to mark order as paid"
    console.error("[capture-order-payment]", orderId, error)
    return { ok: false, reason }
  }
}
