import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { withDb } from "../../../../lib/db"
import { isValidRestockCadence, applyLabRestockPrice, type RestockCheckoutItem } from "../../../../lib/lab-restock"
import { insertPendingRestocks } from "../../../../lib/lab-restock-db"

type Body = {
  order_id?: string
  email?: string
  customer_id?: string
  shipping_address?: Record<string, unknown>
  restock_items?: Array<{
    variantId?: string
    quantity?: number
    handle?: string
    title?: string
    variantTitle?: string
    unitPrice?: number
    oneTimeUnitPrice?: number
    cadenceDays?: number
    productId?: string
  }>
}

export const POST = async (req: MedusaRequest<Body>, res: MedusaResponse) => {
  const orderId = req.body?.order_id?.trim()
  const email = req.body?.email?.trim()
  if (!orderId || !email) {
    return res.status(400).json({ ok: false, message: "order_id and email are required" })
  }

  const items: RestockCheckoutItem[] = []
  for (const raw of req.body?.restock_items || []) {
    const cadenceDays = raw.cadenceDays
    if (
      !raw.variantId ||
      !raw.handle ||
      !raw.title ||
      !raw.quantity ||
      raw.unitPrice == null ||
      !isValidRestockCadence(cadenceDays)
    ) {
      continue
    }

    const oneTimeUnitPrice =
      raw.oneTimeUnitPrice != null ? Number(raw.oneTimeUnitPrice) : Number(raw.unitPrice)

    items.push({
      variantId: raw.variantId,
      quantity: Number(raw.quantity),
      handle: raw.handle,
      title: raw.title,
      variantTitle: raw.variantTitle,
      unitPrice: applyLabRestockPrice(oneTimeUnitPrice),
      oneTimeUnitPrice,
      cadenceDays,
      productId: raw.productId
    })
  }

  if (!items.length) {
    return res.status(400).json({ ok: false, message: "restock_items are required" })
  }

  const ids = await withDb(
    async (db) =>
      insertPendingRestocks(db, {
        orderId,
        email,
        customerId: req.body?.customer_id,
        shippingAddress: req.body?.shipping_address,
        items
      }),
    async () => [] as string[]
  )

  return res.json({ ok: true, order_id: orderId, restock_ids: ids })
}
