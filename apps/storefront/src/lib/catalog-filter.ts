import type { StoreProduct } from "@/lib/medusa"
import catalogHandles from "@/lib/catalog-handles.generated.json"
import compoundFamilies from "@/lib/compound-families.generated.json"
import compoundLegacyRedirects from "@/lib/compound-legacy-redirects.generated.json"

const CATALOG_HANDLES = new Set(catalogHandles as string[])
const COMPOUND_PARENTS = new Set(Object.keys(compoundFamilies as Record<string, unknown>))
const LEGACY_TO_PARENT = new Map(
  Object.entries(compoundLegacyRedirects as Record<string, { parent: string }>).map(
    ([legacy, redirect]) => [legacy, redirect.parent]
  )
)
const COMPOUND_TITLES = new Map(
  Object.entries(compoundFamilies as Record<string, { title: string }>).map(([handle, family]) => [
    handle,
    family.title
  ])
)

export const CATALOG_PRODUCT_COUNT = CATALOG_HANDLES.size

export function isCatalogProductHandle(handle: string): boolean {
  return CATALOG_HANDLES.has(handle)
}

function getCompoundParentHandle(handle: string): string | null {
  if (COMPOUND_PARENTS.has(handle)) return handle
  return LEGACY_TO_PARENT.get(handle) || null
}

/** Parent handle for any catalog row (merged parent or legacy strength slug). */
export function resolveCatalogParentHandle(handle: string): string | null {
  // Prefer compound family parent so unmerged strength SKUs collapse on the shop.
  const compoundParent = getCompoundParentHandle(handle)
  if (
    compoundParent &&
    (COMPOUND_PARENTS.has(compoundParent) || isCatalogProductHandle(compoundParent))
  ) {
    return compoundParent
  }
  if (isCatalogProductHandle(handle)) return handle
  return null
}

/** Keep canonical catalog parents; legacy strength slugs stay until Medusa merge finishes. */
export function filterToCatalogProducts(products: StoreProduct[]): StoreProduct[] {
  return products.filter((product) => resolveCatalogParentHandle(product.handle))
}

/** One shelf row per compound family; prefer merged parent product when present. */
export function consolidateListingProducts(products: StoreProduct[]): StoreProduct[] {
  const byParent = new Map<string, StoreProduct>()

  for (const product of products) {
    const parent = resolveCatalogParentHandle(product.handle)
    if (!parent) continue

    const existing = byParent.get(parent)
    if (existing && existing.handle !== parent && product.handle !== parent) continue

    if (product.handle === parent) {
      byParent.set(parent, product)
      continue
    }

    if (!existing) {
      byParent.set(parent, {
        ...product,
        handle: parent,
        title: COMPOUND_TITLES.get(parent) || product.title
      })
    }
  }

  return [...byParent.values()]
}

export function filterAndConsolidateCatalogProducts(products: StoreProduct[]): StoreProduct[] {
  return consolidateListingProducts(filterToCatalogProducts(products))
}
