import { Suspense } from "react"
import type { Metadata } from "next"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { ProductCard } from "@/components/product-card"
import { ProductSort } from "@/components/product-sort"
import { listProducts } from "@/lib/medusa"
import { filterProductsByCategorySlug } from "@/lib/categories"
import { filterByPill, normalizeShopCategoryPill, shopNavLabel } from "@/lib/shop-filters"
import { searchProducts } from "@/lib/search"
import { buildPageMetadata } from "@/lib/seo"
import {
  orderProductsBySearchResults,
  parseProductSort,
  sortProducts
} from "@/lib/sort-products"

export const revalidate = 300

export const metadata: Metadata = buildPageMetadata({
  title: "Shop Research Peptides",
  description:
    "Browse the full Tetrava Labs catalog — GLP-1 peptides, tissue repair compounds, growth secretagogues, and lab supplies with batch COAs.",
  path: "/shop"
})

type Props = {
  searchParams: Promise<{
    q?: string
    category?: string
    price_min?: string
    price_max?: string
    sort?: string
  }>
}

function parseCents(value?: string) {
  if (!value?.trim()) return undefined
  const dollars = Number(value)
  if (!Number.isFinite(dollars) || dollars < 0) return undefined
  return Math.round(dollars * 100)
}

function ShopSortSkeleton() {
  return <div className="h-10 w-40 animate-pulse rounded-lg bg-[#F1F5F9]" />
}

export default async function ShopPage({ searchParams }: Props) {
  const { q = "", category = "", price_min = "", price_max = "", sort = "" } = await searchParams
  const products = await listProducts()
  const priceMin = parseCents(price_min)
  const priceMax = parseCents(price_max)
  const sortKey = parseProductSort(sort)
  const categoryPill = normalizeShopCategoryPill(category || undefined)

  let displayProducts = category
    ? categoryPill
      ? filterByPill(products, category)
      : filterProductsByCategorySlug(products, category)
    : products
  const useSearch = Boolean(q.trim() || priceMin != null || priceMax != null)

  if (useSearch) {
    const { results } = await searchProducts(q, { priceMin, priceMax })
    const handles = new Set(results.map((result) => result.handle))
    displayProducts = displayProducts.filter((product) => handles.has(product.handle))
    displayProducts =
      sortKey === "featured"
        ? orderProductsBySearchResults(displayProducts, results)
        : sortProducts(displayProducts, sortKey)
  } else {
    displayProducts = sortProducts(displayProducts, sortKey)
  }

  return (
    <section className="page-container space-y-8 py-8">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: shopNavLabel }]} />

      <div className="border-b border-[#E2E8F0] pb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="section-label">Catalog</span>
            <h1 className="mt-2 font-serif text-4xl text-[#0F172A]">Research Compounds</h1>
            <p className="mt-2 text-sm text-[#64748B]">
              {displayProducts.length} product{displayProducts.length === 1 ? "" : "s"}
              {sortKey !== "featured" ? ` · sorted by ${sortKey.replace("-", " ")}` : ""}
            </p>
          </div>
          <Suspense fallback={<ShopSortSkeleton />}>
            <ProductSort currentSort={sortKey} />
          </Suspense>
        </div>
      </div>

      {displayProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 xl:gap-6 [&>*]:min-w-0">
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
    </section>
  )
}
