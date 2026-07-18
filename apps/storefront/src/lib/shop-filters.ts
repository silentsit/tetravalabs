import { normalizeCategorySlug, resolveProductCategorySlug } from "@/lib/categories"
import type { StoreProduct } from "@/lib/medusa"

export const storefrontPills = [
  { key: "all", label: "All Products" },
  { key: "glp-1-research", label: "GLP-1 Research" },
  { key: "tissue-repair", label: "Tissue Repair" },
  { key: "growth-hormone-axis", label: "Growth Hormone Axis" },
  { key: "longevity-neuropeptides", label: "Longevity & Neuropeptides" },
  { key: "metabolic-mitochondrial", label: "Metabolic & Mitochondrial" },
  { key: "research-blends", label: "Research Blends" },
  { key: "lab-supplies", label: "Lab Supplies" }
] as const

export const shopNavLabel = "Buy Peptides"

export const shopNavLinks = storefrontPills.map((pill) => ({
  key: pill.key,
  label: pill.label,
  href: pill.key === "all" ? "/shop" : `/shop?category=${pill.key}`
}))

const LEGACY_PILL_ALIASES: Record<string, string> = {
  "glp-1": "glp-1-research",
  "glp-1-incretin": "glp-1-research",
  blends: "research-blends",
  supplies: "lab-supplies",
  "growth-factors": "growth-factors"
}

export interface FilterableProduct {
  id: string
  handle: string
  title: string
  metadata?: {
    source_category?: string
    strength?: string
    [key: string]: unknown
  } | null
  collection?: {
    title?: string
    handle?: string
  } | null
}

export function isShopPillKey(value: string): boolean {
  return storefrontPills.some((pill) => pill.key === value)
}

export function normalizeShopCategoryPill(category?: string): string | undefined {
  if (!category) return undefined
  if (isShopPillKey(category)) return category
  return LEGACY_PILL_ALIASES[category] || LEGACY_PILL_ALIASES[normalizeCategorySlug(category) as string]
}

/** Map URL `category` param (pill key or category slug) to active filter pill. */
export function resolveActiveShopPill(category?: string): string {
  if (!category) return "all"
  if (category === "growth-factors") return "growth-factors"
  const pill = normalizeShopCategoryPill(category)
  if (pill && isShopPillKey(pill)) return pill
  const slug = normalizeCategorySlug(category)
  if (isShopPillKey(slug)) return slug
  return "all"
}

export function filterByPill<T extends FilterableProduct>(
  products: T[],
  activePill: string | undefined
): T[] {
  const pillKey = normalizeShopCategoryPill(activePill)
  if (!pillKey || pillKey === "all") return products

  if (pillKey === "growth-factors") {
    return products.filter((product) => {
      const slug = resolveProductCategorySlug(product as StoreProduct)
      return !["glp-1-research", "research-blends", "lab-supplies"].includes(slug)
    })
  }

  return products.filter(
    (product) => resolveProductCategorySlug(product as StoreProduct) === pillKey
  )
}

export function groupBySourceCategory(
  products: FilterableProduct[]
): Record<string, FilterableProduct[]> {
  const groups: Record<string, FilterableProduct[]> = {}

  for (const product of products) {
    const cat =
      product.metadata?.source_category ||
      product.collection?.title ||
      "Uncategorized"

    if (!groups[cat]) groups[cat] = []
    groups[cat].push(product)
  }

  return groups
}
