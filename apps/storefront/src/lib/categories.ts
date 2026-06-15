import type { StoreProduct } from "@/lib/medusa"

/** Legacy pricing-sheet categories → storefront slug (pre-normalization Medusa data). */
const LEGACY_SOURCE_TO_SLUG: Record<string, string> = {
  "glp-1-incretin": "glp-1-research",
  "supplies-reconstitution": "lab-supplies",
  "bpc-157-tb500": "growth-factors",
  blends: "research-blends",
  "cjc-ipamorelin-ghrp": "growth-factors",
  "growth-hormone-axis": "growth-factors",
  "mitochondrial-metabolic-other": "growth-factors",
  "cosmetic-copper-tanning": "growth-factors",
  "longevity-thymic-neuropeptides": "growth-factors",
  "vitamins-injectables": "growth-factors",
  "legacy-catalog": "growth-factors",
}

export function slugifyCategory(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function categorySlugFromLabel(label: string) {
  const slug = slugifyCategory(label)
  if (slug === "glp-1-research" || slug === "growth-factors" || slug === "research-blends" || slug === "lab-supplies") {
    return slug
  }
  return LEGACY_SOURCE_TO_SLUG[slug] || slug
}

export function categoryLabelFromSlug(slug: string, products: StoreProduct[]) {
  for (const product of products) {
    const label = String(product.metadata?.source_category || "")
    if (label && categorySlugFromLabel(label) === slug.toLowerCase()) {
      return label
    }
  }
  return slug.replace(/-/g, " ")
}

export function groupProductsByCategory(products: StoreProduct[]) {
  const groups = new Map<string, StoreProduct[]>()

  for (const product of products) {
    const label = String(product.metadata?.source_category || "Research Product")
    const slug = categorySlugFromLabel(label)
    const existing = groups.get(slug) || []
    existing.push(product)
    groups.set(slug, existing)
  }

  return [...groups.entries()]
    .map(([slug, items]) => ({
      name: items[0] ? String(items[0].metadata?.source_category || slug) : slug,
      slug,
      count: items.length,
      products: items
    }))
    .sort((a, b) => b.count - a.count)
}

export function getRelatedProducts(product: StoreProduct, products: StoreProduct[], limit = 4) {
  const category = String(product.metadata?.source_category || "")
  return products
    .filter(
      (candidate) =>
        candidate.id !== product.id &&
        String(candidate.metadata?.source_category || "") === category
    )
    .slice(0, limit)
}

export function filterProductsByCategorySlug(products: StoreProduct[], slug: string) {
  const normalized = slug.toLowerCase()
  return products.filter((product) => {
    const label = String(product.metadata?.source_category || "")
    return categorySlugFromLabel(label) === normalized
  })
}
