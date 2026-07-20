import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { recordOrderShipmentAndNotify } from "../lib/order-fulfillment-emails"

type ShipmentCreatedEvent = {
  id: string
  no_notification?: boolean
}

/**
 * F1 — when Medusa Admin creates a shipment with tracking labels,
 * send the customer shipped email and cancel the 72h tracking SLA backup.
 */
export default async function shipmentCreatedHandler({
  event: { data },
  container
}: SubscriberArgs<ShipmentCreatedEvent>) {
  if (!data?.id || data.no_notification) return

  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  const { data: fulfillments } = await query.graph({
    entity: "fulfillment",
    filters: { id: data.id },
    fields: [
      "id",
      "labels.tracking_number",
      "labels.tracking_url",
      "order.id",
      "order.display_id",
      "order.email"
    ]
  })

  const fulfillment = fulfillments?.[0] as
    | {
        id?: string
        labels?: Array<{ tracking_number?: string | null; tracking_url?: string | null }>
        order?: { id?: string; display_id?: number | null; email?: string | null }
      }
    | undefined

  if (!fulfillment?.order?.id) {
    console.warn("[shipment.created] No order linked to fulfillment", data.id)
    return
  }

  const labels = fulfillment.labels || []
  const primary =
    labels.find((label) => label.tracking_number?.trim()) || labels[0] || null
  const trackingNumber = primary?.tracking_number?.trim()

  if (!trackingNumber) {
    console.warn("[shipment.created] No tracking number on fulfillment", data.id)
    return
  }

  const result = await recordOrderShipmentAndNotify({
    orderId: fulfillment.order.id,
    trackingNumber,
    trackingUrl: primary?.tracking_url,
    email: fulfillment.order.email,
    displayId: fulfillment.order.display_id
  })

  if (!result.ok) {
    console.warn("[shipment.created] Shipped email failed:", result.reason)
  }
}

export const config: SubscriberConfig = {
  event: ["shipment.created"]
}
