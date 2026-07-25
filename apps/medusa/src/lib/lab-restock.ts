/** Server-side Peptide Refill offer constants (keep in sync with storefront lib/lab-restock.ts). */

export const LAB_RESTOCK_DISCOUNT_PCT = 12
export const LAB_RESTOCK_CADENCES = [30, 60, 90] as const
export type LabRestockCadenceDays = (typeof LAB_RESTOCK_CADENCES)[number]

export type RestockCheckoutItem = {
  variantId: string
  quantity: number
  handle: string
  title: string
  variantTitle?: string
  unitPrice: number
  oneTimeUnitPrice?: number
  cadenceDays: LabRestockCadenceDays
  productId?: string
}

export function isValidRestockCadence(value: unknown): value is LabRestockCadenceDays {
  return typeof value === "number" && (LAB_RESTOCK_CADENCES as readonly number[]).includes(value)
}

export function applyLabRestockPrice(oneTimeUnitPrice: number): number {
  if (!Number.isFinite(oneTimeUnitPrice) || oneTimeUnitPrice <= 0) return 0
  return Math.round(oneTimeUnitPrice * (1 - LAB_RESTOCK_DISCOUNT_PCT / 100) * 100) / 100
}

export function newLabRestockId(): string {
  return `lr_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`
}

export function newLabRestockShipmentId(): string {
  return `lrs_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`
}
