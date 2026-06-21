import type { StoreProduct } from "@/lib/medusa"
import catalogHandles from "@/lib/catalog-handles.generated.json"

const CATALOG_HANDLES = new Set(catalogHandles as string[])

export const CATALOG_PRODUCT_COUNT = CATALOG_HANDLES.size

export function isCatalogProductHandle(handle: string): boolean {
  return CATALOG_HANDLES.has(handle)
}

/** Keep only the 125 canonical tiered SKUs from the price list / normalized catalog. */
export function filterToCatalogProducts(products: StoreProduct[]): StoreProduct[] {
  return products.filter((product) => isCatalogProductHandle(product.handle))
}
