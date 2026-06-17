import type { StoreProduct } from "@/lib/medusa"
import type { StoreVariant } from "@/lib/product-price"
import { getVariantPriceCents } from "@/lib/product-price"

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
