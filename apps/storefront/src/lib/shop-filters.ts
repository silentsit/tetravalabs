export const storefrontPills = [
  { key: "all", label: "All Products", matches: [] as string[] },
  {
    key: "glp-1",
    label: "GLP-1 Research",
    matches: ["GLP-1 Research", "GLP-1 / Incretin"]
  },
  {
    key: "growth-factors",
    label: "Growth Factors",
    matches: [
      "Growth Factors",
      "BPC-157 / TB500",
      "CJC / Ipamorelin / GHRP",
      "Growth Hormone Axis",
      "Longevity / Thymic / Neuropeptides",
      "Mitochondrial / Metabolic Other",
      "Cosmetic / Copper / Tanning",
      "Vitamins & Injectables",
      "Legacy Catalog"
    ]
  },
  {
    key: "blends",
    label: "Research Blends",
    matches: ["Research Blends", "Blends"]
  },
  {
    key: "supplies",
    label: "Lab Supplies",
    matches: ["Lab Supplies", "Supplies & Reconstitution"]
  }
] as const

export const shopNavLabel = "Buy Peptides"

export const shopNavLinks = storefrontPills.map((pill) => ({
  key: pill.key,
  label: pill.label,
  href: pill.key === "all" ? "/shop" : `/shop?category=${pill.key}`
}))

const LEGACY_PILL_ALIASES: Record<string, string> = {
  "glp-1-research": "glp-1",
  "glp-1-incretin": "glp-1",
  "research-blends": "blends",
  "lab-supplies": "supplies",
  "supplies-reconstitution": "supplies"
}

export interface FilterableProduct {
  id: string
  handle: string
  title: string
  metadata?: {
    source_category?: string
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
  return LEGACY_PILL_ALIASES[category]
}

/** Map URL `category` param (pill key or category slug) to active filter pill. */
export function resolveActiveShopPill(category?: string): string {
  if (!category) return "all"
  const pill = normalizeShopCategoryPill(category)
  if (pill) return pill
  if (isShopPillKey(category)) return category
  const slugToPill: Record<string, string> = {
    "glp-1-research": "glp-1",
    "growth-factors": "growth-factors",
    "research-blends": "blends",
    "lab-supplies": "supplies"
  }
  return slugToPill[category] || "all"
}

function matchesPill(product: FilterableProduct, pillCategories: string[]): boolean {
  const sourceCategory =
    product.metadata?.source_category || product.collection?.title || ""

  return pillCategories.some(
    (cat) => sourceCategory.toLowerCase() === cat.toLowerCase()
  )
}

export function filterByPill<T extends FilterableProduct>(
  products: T[],
  activePill: string | undefined
): T[] {
  const pillKey = normalizeShopCategoryPill(activePill)
  if (!pillKey || pillKey === "all") return products

  const pill = storefrontPills.find((p) => p.key === pillKey)
  if (!pill || pill.key === "all") return products

  return products.filter((p) => matchesPill(p, [...pill.matches]))
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

