import { canonicalizeCategorySlug } from "@/lib/category-url"
import type { StoreProduct } from "@/lib/medusa"
import { getDisplaySortPriceCents } from "@/lib/pack-pricing"
import { resolveCatalogParentHandle } from "@/lib/catalog-filter"
import type { SearchResult } from "@/lib/search"

export type ProductSort = "featured" | "price-asc" | "price-desc" | "name-asc" | "name-desc"

export const PRODUCT_SORT_OPTIONS: Array<{ value: ProductSort; label: string }> = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "name-asc", label: "Name: A–Z" },
  { value: "name-desc", label: "Name: Z–A" }
]

/** Strip strength suffix so related SKUs group together (e.g. bacteriostatic-water). */
function baseHandleKey(handle: string): string {
  return handle
    .replace(/-(\d+(?:\.\d+)?)-iu$/i, "")
    .replace(/-(\d+(?:\.\d+)?)(mg|ml)$/i, "")
}

/** Numeric strength for ascending ordering within a product family. */
function strengthSortValue(handle: string): number {
  const iu = handle.match(/(\d+(?:\.\d+)?)-iu$/i)
  if (iu) return parseFloat(iu[1])
  const mg = handle.match(/(\d+(?:\.\d+)?)mg$/i)
  if (mg) return parseFloat(mg[1])
  const ml = handle.match(/(\d+(?:\.\d+)?)ml$/i)
  if (ml) return parseFloat(ml[1])
  return 0
}

function compareByBaseAndStrength(a: StoreProduct, b: StoreProduct): number {
  const baseCmp = baseHandleKey(a.handle).localeCompare(baseHandleKey(b.handle), undefined, {
    sensitivity: "base"
  })
  if (baseCmp !== 0) return baseCmp

  const strengthCmp = strengthSortValue(a.handle) - strengthSortValue(b.handle)
  if (strengthCmp !== 0) return strengthCmp

  return a.handle.localeCompare(b.handle, undefined, { sensitivity: "base" })
}

export function parseProductSort(value?: string): ProductSort {
  if (
    value === "price-asc" ||
    value === "price-desc" ||
    value === "name-asc" ||
    value === "name-desc"
  ) {
    return value
  }
  return "featured"
}

export function sortProducts(products: StoreProduct[], sort: ProductSort): StoreProduct[] {
  if (sort === "featured") {
    return [...products].sort(compareByBaseAndStrength)
  }

  const copy = [...products]
  copy.sort((a, b) => {
    if (sort === "name-asc" || sort === "name-desc") {
      const cmp = compareByBaseAndStrength(a, b)
      return sort === "name-asc" ? cmp : -cmp
    }

    const priceA = getDisplaySortPriceCents(a)
    const priceB = getDisplaySortPriceCents(b)
    if (priceA !== priceB) {
      return sort === "price-asc" ? priceA - priceB : priceB - priceA
    }
    return compareByBaseAndStrength(a, b)
  })

  return copy
}

export function orderProductsBySearchResults(
  products: StoreProduct[],
  results: SearchResult[]
): StoreProduct[] {
  const rank = new Map(
    results
      .map((result, index) => {
        const handle = resolveCatalogParentHandle(result.handle)
        return handle ? ([handle, index] as const) : null
      })
      .filter((entry): entry is readonly [string, number] => Boolean(entry))
  )
  return [...products].sort(
    (a, b) => (rank.get(a.handle) ?? Number.MAX_SAFE_INTEGER) - (rank.get(b.handle) ?? Number.MAX_SAFE_INTEGER)
  )
}

export function sortSearchResults(results: SearchResult[], sort: ProductSort): SearchResult[] {
  if (sort === "featured") return results

  const copy = [...results]
  copy.sort((a, b) => {
    if (sort === "name-asc" || sort === "name-desc") {
      const cmp = a.title.localeCompare(b.title, undefined, { sensitivity: "base" })
      return sort === "name-asc" ? cmp : -cmp
    }

    const priceA = a.unit_price_min ?? a.price_min ?? a.price_max
    const priceB = b.unit_price_min ?? b.price_min ?? b.price_max
    if (priceA !== priceB) {
      return sort === "price-asc" ? priceA - priceB : priceB - priceA
    }
    return a.title.localeCompare(b.title, undefined, { sensitivity: "base" })
  })

  return copy
}

function compactQuery(params: {
  q?: string
  price_min?: string
  price_max?: string
  sort?: string
}) {
  const search = new URLSearchParams()
  const q = params.q?.trim()
  const priceMin = params.price_min?.trim()
  const priceMax = params.price_max?.trim()
  const sort = params.sort?.trim()
  if (q) search.set("q", q)
  if (priceMin) search.set("price_min", priceMin)
  if (priceMax) search.set("price_max", priceMax)
  if (sort && sort !== "featured") search.set("sort", sort)
  return search
}

function categorySlugFromPath(pathname?: string) {
  const match = pathname?.match(/^\/category\/([^/]+)/)
  return match?.[1] || ""
}

/** Public catalog href. Category lives in the path, never as empty `?category=`. */
export function buildShopHref(params: {
  q?: string
  category?: string
  price_min?: string
  price_max?: string
  sort?: string
  pathname?: string
}) {
  const fromPath = categorySlugFromPath(params.pathname)
  const fromQuery = params.category?.trim()
  const categorySlug =
    fromPath ||
    (fromQuery && fromQuery !== "all" ? canonicalizeCategorySlug(fromQuery) || "" : "")

  const search = compactQuery(params)
  const qs = search.toString()

  if (categorySlug) {
    return qs ? `/category/${categorySlug}?${qs}` : `/category/${categorySlug}`
  }

  const base =
    params.pathname?.startsWith("/category/") || params.pathname === "/shop"
      ? params.pathname.replace(/\/+$/, "") || "/shop"
      : "/shop"
  return qs ? `${base}?${qs}` : base
}
