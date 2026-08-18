import type { StoreProduct } from "@/lib/medusa"
import catalogHandles from "@/lib/catalog-handles.generated.json"
import compoundFamilies from "@/lib/compound-families.generated.json"
import compoundFamilyOverrides from "@/lib/compound-family-overrides.json"
import compoundLegacyRedirects from "@/lib/compound-legacy-redirects.generated.json"
import { getCompoundShelfImageHandle } from "@/lib/product-image-map"

type FamilyTitleRow = { title: string; members?: { legacy_slug: string }[] }

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

for (const [parentHandle, family] of Object.entries(
  compoundFamilyOverrides as Record<string, FamilyTitleRow>
)) {
  COMPOUND_PARENTS.add(parentHandle)
  COMPOUND_TITLES.set(parentHandle, family.title)
  for (const member of family.members || []) {
    if (!LEGACY_TO_PARENT.has(member.legacy_slug)) {
      LEGACY_TO_PARENT.set(member.legacy_slug, parentHandle)
    }
  }
}

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

/** One shelf row per compound family; prefer merged parent, else mid-strength proxy. */
export function consolidateListingProducts(products: StoreProduct[]): StoreProduct[] {
  type Entry = { product: StoreProduct; sourceHandle: string }
  const byParent = new Map<string, Entry>()

  for (const product of products) {
    const parent = resolveCatalogParentHandle(product.handle)
    if (!parent) continue

    const existing = byParent.get(parent)

    if (product.handle === parent) {
      byParent.set(parent, { product, sourceHandle: parent })
      continue
    }

    // Already have the real merged parent product.
    if (existing?.sourceHandle === parent) continue

    const preferredHandle = getCompoundShelfImageHandle(parent)
    const proxy: Entry = {
      product: {
        ...product,
        handle: parent,
        title: COMPOUND_TITLES.get(parent) || product.title.replace(/TB500/g, "TB-500").replace(/tb500/g, "tb-500")
      },
      sourceHandle: product.handle
    }

    if (!existing) {
      byParent.set(parent, proxy)
      continue
    }

    // Upgrade first-seen strength to the same member used for shelf imagery.
    if (
      preferredHandle &&
      product.handle === preferredHandle &&
      existing.sourceHandle !== preferredHandle
    ) {
      byParent.set(parent, proxy)
    }
  }

  return [...byParent.values()].map((entry) => entry.product)
}

export function filterAndConsolidateCatalogProducts(products: StoreProduct[]): StoreProduct[] {
  return consolidateListingProducts(filterToCatalogProducts(products))
}
