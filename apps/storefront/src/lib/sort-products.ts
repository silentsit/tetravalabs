import type { StoreProduct } from "@/lib/medusa"
import { getProductPriceCents } from "@/lib/product-price"
import type { SearchResult } from "@/lib/search"

export type ProductSort = "featured" | "price-asc" | "price-desc" | "name-asc" | "name-desc"

export const PRODUCT_SORT_OPTIONS: Array<{ value: ProductSort; label: string }> = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "name-asc", label: "Name: A–Z" },
  { value: "name-desc", label: "Name: Z–A" }
]

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
  if (sort === "featured") return products

  const copy = [...products]
  copy.sort((a, b) => {
    if (sort === "name-asc" || sort === "name-desc") {
      const cmp = a.title.localeCompare(b.title, undefined, { sensitivity: "base" })
      return sort === "name-asc" ? cmp : -cmp
    }

    const priceA = getProductPriceCents(a)
    const priceB = getProductPriceCents(b)
    if (priceA !== priceB) {
      return sort === "price-asc" ? priceA - priceB : priceB - priceA
    }
    return a.title.localeCompare(b.title, undefined, { sensitivity: "base" })
  })

  return copy
}

export function orderProductsBySearchResults(
  products: StoreProduct[],
  results: SearchResult[]
): StoreProduct[] {
  const rank = new Map(results.map((result, index) => [result.handle, index]))
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

    const priceA = a.price_min || a.price_max
    const priceB = b.price_min || b.price_max
    if (priceA !== priceB) {
      return sort === "price-asc" ? priceA - priceB : priceB - priceA
    }
    return a.title.localeCompare(b.title, undefined, { sensitivity: "base" })
  })

  return copy
}

export function buildShopHref(params: {
  q?: string
  category?: string
  price_min?: string
  price_max?: string
  sort?: string
}) {
  const search = new URLSearchParams()
  if (params.q?.trim()) search.set("q", params.q.trim())
  if (params.category?.trim()) search.set("category", params.category.trim())
  if (params.price_min?.trim()) search.set("price_min", params.price_min.trim())
  if (params.price_max?.trim()) search.set("price_max", params.price_max.trim())
  if (params.sort?.trim() && params.sort !== "featured") search.set("sort", params.sort.trim())
  const qs = search.toString()
  return qs ? `/shop?${qs}` : "/shop"
}
