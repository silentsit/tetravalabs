import type { StoreProduct } from "@/lib/medusa"
import type { StoreVariant } from "@/lib/product-price"
import { getProductPriceCents, getVariantPriceCents } from "@/lib/product-price"

export type PackTier = {
  tier: string
  qty: number
  price: number
  perUnit: number
  savingsPct: number
  variantId: string
}

const PACK_TITLE_RE = /^\d+\s+vials?$/i

export function isPackTierVariant(variant: StoreVariant): boolean {
  const packQty = variant.metadata?.pack_qty
  if (packQty != null && Number(packQty) > 0) return true
  return PACK_TITLE_RE.test(variant.title.trim())
}

export function isStrengthVariant(variant: StoreVariant): boolean {
  if (isPackTierVariant(variant)) return false
  return /\d+\s*(mg|ml|iu|mcg|ct|count)/i.test(variant.title)
}

function packQtyFromVariant(variant: StoreVariant): number {
  const fromMeta = variant.metadata?.pack_qty
  if (fromMeta != null && Number(fromMeta) > 0) return Number(fromMeta)
  const match = variant.title.match(/^(\d+)\s+vials?$/i)
  return match ? Number(match[1]) : 1
}

function perUnitFromVariant(variant: StoreVariant, priceUsd: number, qty: number): number {
  const fromMeta = variant.metadata?.per_unit_usd
  if (fromMeta != null && Number(fromMeta) > 0) return Number(fromMeta)
  return qty > 0 ? priceUsd / qty : priceUsd
}

function savingsFromVariant(variant: StoreVariant): number {
  const fromMeta = variant.metadata?.savings_pct
  if (fromMeta != null) return Number(fromMeta)
  return 0
}

export function variantToPackTier(variant: StoreVariant): PackTier {
  const price = getVariantPriceCents(variant) / 100
  const qty = packQtyFromVariant(variant)
  return {
    tier: variant.title,
    qty,
    price,
    perUnit: perUnitFromVariant(variant, price, qty),
    savingsPct: savingsFromVariant(variant),
    variantId: variant.id
  }
}

export function packTiersFromVariants(variants: StoreVariant[]): PackTier[] {
  return variants
    .filter(isPackTierVariant)
    .map(variantToPackTier)
    .sort((a, b) => a.qty - b.qty)
}

export function strengthVariantsFromList(variants: StoreVariant[]): StoreVariant[] {
  const strengths = new Set(
    variants.map((v) => String(v.metadata?.strength || "")).filter(Boolean)
  )
  if (strengths.size > 1) {
    const byStrength = new Map<string, StoreVariant>()
    for (const variant of variants) {
      const key = String(variant.metadata?.strength || variant.title)
      if (!byStrength.has(key)) byStrength.set(key, variant)
    }
    return [...byStrength.values()]
  }
  return variants.filter(isStrengthVariant)
}

export function getVariantStrengthKey(variant: StoreVariant): string {
  return String(variant.metadata?.strength || variant.title)
}

export function groupVariantsByStrength(variants: StoreVariant[]) {
  const groups = new Map<string, StoreVariant[]>()
  for (const variant of variants) {
    const key = getVariantStrengthKey(variant)
    const list = groups.get(key) || []
    list.push(variant)
    groups.set(key, list)
  }
  return groups
}

export type ProductPurchaseLayout =
  | { mode: "pack-only"; packTiers: PackTier[] }
  | { mode: "strength-only"; strengthVariants: StoreVariant[] }
  | {
      mode: "strength-and-pack"
      strengthVariants: StoreVariant[]
      packTiersByStrength: Map<string, PackTier[]>
    }
  | { mode: "simple"; variants: StoreVariant[] }

export function resolveProductPurchaseLayout(
  variants: StoreVariant[]
): ProductPurchaseLayout {
  if (!variants.length) return { mode: "simple", variants: [] }

  const packTiers = packTiersFromVariants(variants)
  const hasPack = packTiers.length >= 2
  const strengthGroups = groupVariantsByStrength(variants)
  const strengthKeys = [...strengthGroups.keys()]
  const hasMultipleStrengths =
    strengthKeys.length > 1 &&
    strengthKeys.some((key) => key && !PACK_TITLE_RE.test(key))

  if (hasPack && hasMultipleStrengths) {
    const strengthVariants = strengthKeys.map(
      (key) => strengthGroups.get(key)![0]
    )
    const packTiersByStrength = new Map<string, PackTier[]>()
    for (const [key, group] of strengthGroups) {
      const tiers = packTiersFromVariants(group)
      if (tiers.length) packTiersByStrength.set(key, tiers)
    }
    return { mode: "strength-and-pack", strengthVariants, packTiersByStrength }
  }

  if (hasPack) return { mode: "pack-only", packTiers }

  const strengthVariants = strengthVariantsFromList(variants)
  if (strengthVariants.length >= 2) {
    return { mode: "strength-only", strengthVariants }
  }

  return { mode: "simple", variants }
}

export function hasMultiplePackTiers(product: StoreProduct): boolean {
  const tiers = packTiersFromVariants(product.variants || [])
  if (tiers.length >= 2) {
    const prices = tiers.map((t) => t.price)
    return new Set(prices).size > 1 || tiers.some((t) => t.savingsPct > 0)
  }
  return false
}

export function getLowestPackPrice(product: StoreProduct): number {
  const tiers = packTiersFromVariants(product.variants || [])
  if (tiers.length) return Math.min(...tiers.map((t) => t.price))
  return 0
}

export type ShelfPriceDisplay = {
  /** Primary amount, e.g. "$49.00" or "$38.00 – $49.00" */
  unitAmount: string
  /** Suffix such as "/vial", or empty for non-pack SKUs */
  unitSuffix: string
  /** Secondary line, e.g. "5-vial minimum · packs from $245.00" */
  detail: string | null
  isPackProduct: boolean
}

export function formatShelfPrice(
  tiers: PackTier[],
  unitLabel: "vial" | "unit" = "vial"
): ShelfPriceDisplay {
  const unitSuffix = unitLabel === "vial" ? "/vial" : "/unit"
  const unitWord = unitLabel === "vial" ? "vial" : "unit"

  if (!tiers.length) {
    return { unitAmount: "", unitSuffix, detail: null, isPackProduct: false }
  }

  const moq = tiers[0]
  const perUnits = tiers.map((tier) => tier.perUnit)
  const minPerUnit = Math.min(...perUnits)
  const maxPerUnit = Math.max(...perUnits)
  const unitAmount =
    minPerUnit !== maxPerUnit
      ? `$${minPerUnit.toFixed(2)} – $${maxPerUnit.toFixed(2)}`
      : `$${moq.perUnit.toFixed(2)}`

  const moqLabel = `${moq.qty}-${unitWord} minimum`
  const packLabel = `packs from $${moq.price.toFixed(2)}`
  const detail = `${moqLabel} · ${packLabel}`

  return { unitAmount, unitSuffix, detail, isPackProduct: true }
}

export function formatShelfPriceFromUnitCents(input: {
  unitPriceMinCents: number
  unitPriceMaxCents?: number
  moqQty?: number
  packPriceMinCents?: number
  unitLabel?: "vial" | "unit"
}): ShelfPriceDisplay {
  const unitLabel = input.unitLabel ?? "vial"
  const unitSuffix = unitLabel === "vial" ? "/vial" : "/unit"
  const unitWord = unitLabel === "vial" ? "vial" : "unit"
  const min = input.unitPriceMinCents / 100
  const max = (input.unitPriceMaxCents ?? input.unitPriceMinCents) / 100
  const unitAmount =
    min !== max ? `$${min.toFixed(2)} – $${max.toFixed(2)}` : `$${min.toFixed(2)}`

  const moqLabel = input.moqQty ? `${input.moqQty}-${unitWord} minimum` : null
  const packLabel =
    input.packPriceMinCents != null && input.packPriceMinCents > 0
      ? `packs from $${(input.packPriceMinCents / 100).toFixed(2)}`
      : null
  const detail =
    moqLabel && packLabel ? `${moqLabel} · ${packLabel}` : moqLabel || packLabel

  return {
    unitAmount,
    unitSuffix,
    detail,
    isPackProduct: true
  }
}

export function formatShelfPriceFromProduct(
  product: StoreProduct,
  unitLabel: "vial" | "unit" = "vial"
): ShelfPriceDisplay {
  const tiers = packTiersFromVariants(product.variants || [])
  if (tiers.length) return formatShelfPrice(tiers, unitLabel)

  const price = getProductPriceCents(product) / 100
  return {
    unitAmount: `$${price.toFixed(2)}`,
    unitSuffix: "",
    detail: null,
    isPackProduct: false
  }
}

/** Per-unit cents for pack products; falls back to variant price for simple SKUs. */
export function getProductPerUnitPriceRangeCents(product: StoreProduct) {
  const tiers = packTiersFromVariants(product.variants || [])
  if (!tiers.length) {
    const cents = getProductPriceCents(product)
    return { min: cents, max: cents, moqQty: null as number | null }
  }

  const perUnitCents = tiers.map((tier) => Math.round(tier.perUnit * 100))
  return {
    min: Math.min(...perUnitCents),
    max: Math.max(...perUnitCents),
    moqQty: tiers[0].qty
  }
}

/** Sort/filter key aligned with shelf (per-unit for packs). */
export function getDisplaySortPriceCents(product: StoreProduct): number {
  const { min } = getProductPerUnitPriceRangeCents(product)
  return min
}

/** Hide consolidated legacy SKUs when per-strength tiered products exist (e.g. bpc-157 vs bpc-157-5mg). */
export function filterSupersededLegacyProducts(products: StoreProduct[]): StoreProduct[] {
  const tieredParentHandles = new Set<string>()
  for (const product of products) {
    if (packTiersFromVariants(product.variants || []).length < 2) continue
    const match = product.handle.match(/^(.+)-(\d+(?:\.\d+)?(?:mg|ml|iu|mcg))$/i)
    if (match) tieredParentHandles.add(match[1])
  }

  return products.filter((product) => {
    if (packTiersFromVariants(product.variants || []).length >= 2) return true
    return !tieredParentHandles.has(product.handle)
  })
}
