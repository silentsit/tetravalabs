import type { CartItem } from "@/components/cart-provider"

export type ReorderLineInput = {
  variantId?: string | null
  productId?: string | null
  handle?: string | null
  title?: string | null
  variantTitle?: string | null
  quantity?: number | null
  /** USD major units (not cents). */
  unitPrice?: number | null
}

export type ReorderSeedResult = {
  added: number
  skipped: string[]
}

/** Map order/email lines into one-time cart items (never Peptide Refill). */
export function buildReorderCartItems(lines: ReorderLineInput[]): {
  items: Array<Omit<CartItem, "quantity"> & { quantity: number }>
  skipped: string[]
} {
  const items: Array<Omit<CartItem, "quantity"> & { quantity: number }> = []
  const skipped: string[] = []

  for (const line of lines) {
    const variantId = (line.variantId || "").trim()
    const productId = (line.productId || "").trim() || variantId
    const handle = (line.handle || "").trim()
    const title = (line.title || "").trim()
    const quantity = Math.max(1, Math.floor(Number(line.quantity) || 1))
    const unitPrice = Number(line.unitPrice)

    if (!variantId || !handle || !title || !Number.isFinite(unitPrice) || unitPrice < 0) {
      skipped.push(title || handle || variantId || "Unknown item")
      continue
    }

    items.push({
      id: `reorder:${variantId}`,
      productId,
      handle,
      title,
      variantId,
      variantTitle: (line.variantTitle || "").trim(),
      unitPrice,
      quantity,
      fulfillment: "one_time",
      oneTimeUnitPrice: unitPrice
    })
  }

  return { items, skipped }
}
