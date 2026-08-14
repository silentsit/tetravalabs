"use client"

import { useEffect, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ProductCard } from "@/components/product-card"
import { ProductFilters } from "@/components/product-filters"
import { ProductSort } from "@/components/product-sort"
import { filterProductsByCategorySlug } from "@/lib/categories"
import type { StoreProduct } from "@/lib/medusa"
import { getDisplaySortPriceCents } from "@/lib/pack-pricing"
import { getShelfProductLabel } from "@/lib/compound-product"
import {
  filterByPill,
  normalizeShopCategoryPill
} from "@/lib/shop-filters"
import { parseProductSort, sortProducts } from "@/lib/sort-products"

function parseCents(value?: string | null) {
  if (!value?.trim()) return undefined
  const dollars = Number(value)
  if (!Number.isFinite(dollars) || dollars < 0) return undefined
  return Math.round(dollars * 100)
}

function productMatchesQuery(product: StoreProduct, query: string) {
  const haystack = `${product.title} ${product.handle} ${getShelfProductLabel(product)}`.toLowerCase()
  return haystack.includes(query.toLowerCase())
}

function ShopCatalogView({
  products,
  displayProducts,
  sortKey,
  categoryPill
}: {
  products: StoreProduct[]
  displayProducts: StoreProduct[]
  sortKey: ReturnType<typeof parseProductSort>
  categoryPill: string
}) {
  return (
    <>
      <div className="border-b border-[#E2E8F0] pb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="section-label">Catalog</span>
            <h1 className="mt-2 font-serif text-4xl text-[#0F172A]">Research Peptides for Sale</h1>
            <p className="mt-2 text-sm text-[#64748B]">
              {displayProducts.length} product{displayProducts.length === 1 ? "" : "s"}
              {sortKey !== "featured" ? ` · sorted by ${sortKey.replace("-", " ")}` : ""}
            </p>
          </div>
          <ProductSort currentSort={sortKey} />
        </div>
        <div className="mt-5">
          <ProductFilters products={products} activePill={categoryPill} />
        </div>
      </div>

      {displayProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-6 [&>*]:min-w-0">
          {displayProducts.map((product) => (
            <ProductCard key={product.id} product={product} variant="shop" />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-10 text-center">
          <h3 className="font-serif text-xl text-[#0F172A]">No products found</h3>
          <p className="mt-2 text-sm text-[#64748B]">
            {products.length === 0
              ? "Catalog is empty — check Medusa connectivity."
              : "Try a different category or sort option."}
          </p>
        </div>
      )}
    </>
  )
}

/** Prerendered HTML for Googlebot: full catalog, no query-string filters. */
export function ShopCatalogFallback({ products }: { products: StoreProduct[] }) {
  const displayProducts = sortProducts(products, "featured")
  return (
    <>
      <div className="border-b border-[#E2E8F0] pb-6">
        <span className="section-label">Catalog</span>
        <h1 className="mt-2 font-serif text-4xl text-[#0F172A]">Research Peptides for Sale</h1>
        <p className="mt-2 text-sm text-[#64748B]">
          {displayProducts.length} product{displayProducts.length === 1 ? "" : "s"}
        </p>
      </div>
      {displayProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-6 [&>*]:min-w-0">
          {displayProducts.map((product) => (
            <ProductCard key={product.id} product={product} variant="shop" />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-10 text-center">
          <h3 className="font-serif text-xl text-[#0F172A]">No products found</h3>
          <p className="mt-2 text-sm text-[#64748B]">
            {products.length === 0
              ? "Catalog is empty — check Medusa connectivity."
              : "Try a different category or sort option."}
          </p>
        </div>
      )}
    </>
  )
}

export function ShopCatalog({ products }: { products: StoreProduct[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const q = searchParams.get("q") || ""
  const category = searchParams.get("category") || ""
  const priceMin = parseCents(searchParams.get("price_min"))
  const priceMax = parseCents(searchParams.get("price_max"))
  const sortKey = parseProductSort(searchParams.get("sort") || "")
  const categoryPill = normalizeShopCategoryPill(category || undefined)

  useEffect(() => {
    if (category && categoryPill && category !== categoryPill) {
      const params = new URLSearchParams(searchParams.toString())
      params.set("category", categoryPill)
      router.replace(`/shop?${params.toString()}`)
    }
  }, [category, categoryPill, router, searchParams])

  const displayProducts = useMemo(() => {
    let next = category
      ? categoryPill
        ? filterByPill(products, category)
        : filterProductsByCategorySlug(products, category)
      : products

    const query = q.trim()
    if (query || priceMin != null || priceMax != null) {
      next = next.filter((product) => {
        if (query && !productMatchesQuery(product, query)) return false
        const cents = getDisplaySortPriceCents(product)
        if (priceMin != null && cents < priceMin) return false
        if (priceMax != null && cents > priceMax) return false
        return true
      })
    }

    return sortProducts(next, sortKey)
  }, [products, category, categoryPill, q, priceMin, priceMax, sortKey])

  return (
    <ShopCatalogView
      products={products}
      displayProducts={displayProducts}
      sortKey={sortKey}
      categoryPill={categoryPill ?? "all"}
    />
  )
}
