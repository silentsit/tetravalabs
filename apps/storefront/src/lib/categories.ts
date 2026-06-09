import type { StoreProduct } from "@/lib/medusa"

export function slugifyCategory(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function categoryLabelFromSlug(slug: string, products: StoreProduct[]) {
  for (const product of products) {
    const label = String(product.metadata?.source_category || "")
    if (label && slugifyCategory(label) === slug.toLowerCase()) {
      return label
    }
  }
  return slug.replace(/-/g, " ")
}

export function groupProductsByCategory(products: StoreProduct[]) {
  const groups = new Map<string, StoreProduct[]>()

  for (const product of products) {
    const label = String(product.metadata?.source_category || "Research Product")
    const existing = groups.get(label) || []
    existing.push(product)
    groups.set(label, existing)
  }

  return [...groups.entries()]
    .map(([name, items]) => ({
      name,
      slug: slugifyCategory(name),
      count: items.length,
      products: items
    }))
    .sort((a, b) => b.count - a.count)
}

export function filterProductsByCategorySlug(products: StoreProduct[], slug: string) {
  const normalized = slug.toLowerCase()
  return products.filter((product) => {
    const label = String(product.metadata?.source_category || "")
    return slugifyCategory(label) === normalized
  })
}
