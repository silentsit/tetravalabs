/**
 * Peptide Refill (Subscribe & Save) — offer rules locked for tetravalabs.com.
 * RUO framing only. Not a care program / membership.
 */

export const LAB_RESTOCK_DISCOUNT_PCT = 12

export const LAB_RESTOCK_CADENCES = [30, 60, 90] as const
export type LabRestockCadenceDays = (typeof LAB_RESTOCK_CADENCES)[number]

export type FulfillmentMode = "one_time" | "lab_restock"

/** Parent compound handles + lab supplies that default to Lab Restock selected. */
export const LAB_RESTOCK_DEFAULT_SELECTED_HANDLES = new Set([
  "bpc-157",
  "semaglutide",
  "tirzepatide",
  "retatrutide",
  "ghk-cu",
  "ipamorelin",
  "tb500",
  "hgh-191aa",
  "bacteriostatic-water"
])

/** Handles that always use 30-day default cadence (high-velocity lab supplies). */
export const LAB_RESTOCK_FAST_CADENCE_HANDLES = new Set([
  "bacteriostatic-water",
  "acetic-acid-water",
  "benzyl-alcohol"
])

/**
 * Handles excluded from Lab Restock (one-off / hard-to-promise SKUs).
 * Expand carefully — empty means full eligible catalog.
 */
export const LAB_RESTOCK_EXCLUDED_HANDLES = new Set<string>([
  // Reserved for ultra-low-stock or one-off blends if needed later.
])

export const LAB_RESTOCK_COPY = {
  modeLabel: "Fulfillment",
  oneTimeLabel: "One-time",
  restockLabel: "Peptide Refill",
  restockBadge: `−${LAB_RESTOCK_DISCOUNT_PCT}% renewals`,
  cadenceLabel: "Refill every",
  cadenceSuffix: "days",
  ctaRestock: "Start Peptide Refill",
  ctaOneTime: "Add to cart",
  micro:
    "First shipment is full price. 12% off applies from your second refill onward. Skip, pause, or cancel anytime — pay each cycle via secure card checkout.",
  renewalSavingsLine: (amountUsd: number) =>
    amountUsd > 0 ? `Save $${amountUsd.toFixed(2)} on each renewal refill` : null,
  cartBadge: "Peptide Refill",
  cartRenewalNote: (renewalUsd: number) =>
    `Renewals from $${renewalUsd.toFixed(2)} (−${LAB_RESTOCK_DISCOUNT_PCT}%)`,
  ruoNote: "For research use only. Not for human consumption.",
  cryptoBlocked: "Peptide Refill requires card payment. Remove refill items to pay with crypto.",
  accountNav: "Peptide Refills",
  freeShippingPerk: "Free cold-chain shipping on every refill shipment",
  perks: [
    `${LAB_RESTOCK_DISCOUNT_PCT}% off renewal refills (from cycle 2)`,
    "Free cold-chain shipping on refill shipments",
    "Skip, pause, or cancel anytime",
    "Current lot COA with each shipment"
  ]
} as const

/** Normalize product handle to parent compound / base handle for eligibility. */
export function restockBaseHandle(handle: string | null | undefined): string {
  if (!handle) return ""
  const h = handle.trim().toLowerCase()
  // Strength members: bpc-157-10mg → bpc-157 (keep known multi-part bases)
  const strengthSuffix = h.match(
    /^(.*?)-(\d+(?:-\d+)?(?:mg|mcg|iu|ml|ct|count))$/i
  )
  if (strengthSuffix) return strengthSuffix[1]
  return h
}

export function isLabRestockEligible(handle: string | null | undefined): boolean {
  const base = restockBaseHandle(handle)
  if (!base) return false
  if (LAB_RESTOCK_EXCLUDED_HANDLES.has(base) || LAB_RESTOCK_EXCLUDED_HANDLES.has(handle || "")) {
    return false
  }
  return true
}

export function defaultFulfillmentMode(handle: string | null | undefined): FulfillmentMode {
  const base = restockBaseHandle(handle)
  if (LAB_RESTOCK_DEFAULT_SELECTED_HANDLES.has(base)) return "lab_restock"
  return "one_time"
}

export function defaultRestockCadence(handle: string | null | undefined): LabRestockCadenceDays {
  const base = restockBaseHandle(handle)
  if (LAB_RESTOCK_FAST_CADENCE_HANDLES.has(base)) return 30
  return 60
}

export function applyLabRestockPrice(oneTimeUnitPrice: number): number {
  if (!Number.isFinite(oneTimeUnitPrice) || oneTimeUnitPrice <= 0) return 0
  const discounted = oneTimeUnitPrice * (1 - LAB_RESTOCK_DISCOUNT_PCT / 100)
  return Math.round(discounted * 100) / 100
}

/** First Peptide Refill checkout is always full pack price — discount starts on renewals. */
export function peptideRefillFirstOrderPrice(oneTimeUnitPrice: number): number {
  if (!Number.isFinite(oneTimeUnitPrice) || oneTimeUnitPrice <= 0) return 0
  return Math.round(oneTimeUnitPrice * 100) / 100
}

export function restockSavingsUsd(oneTimeUnitPrice: number, quantity = 1): number {
  const oneTime = oneTimeUnitPrice * quantity
  const restock = applyLabRestockPrice(oneTimeUnitPrice) * quantity
  return Math.round((oneTime - restock) * 100) / 100
}

export function isValidRestockCadence(value: unknown): value is LabRestockCadenceDays {
  return (
    typeof value === "number" &&
    (LAB_RESTOCK_CADENCES as readonly number[]).includes(value)
  )
}

export function cartLineId(
  productId: string,
  variantId: string,
  fulfillment: FulfillmentMode,
  cadenceDays?: LabRestockCadenceDays | null
): string {
  if (fulfillment === "lab_restock") {
    return `${productId}:${variantId}:lab_restock:${cadenceDays ?? 60}`
  }
  return `${productId}:${variantId}:one_time`
}
