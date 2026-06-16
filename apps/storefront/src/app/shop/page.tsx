import Link from "next/link"
import type { Metadata } from "next"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { ProductCard } from "@/components/product-card"
import { ProductSortSelect } from "@/components/product-sort-select"
import { listProducts } from "@/lib/medusa"
import {
  categoryLabelFromSlug,
  filterProductsByCategorySlug,
  getStorefrontCategorySections,
  groupProductsByCategory
} from "@/lib/categories"
import { searchProducts } from "@/lib/search"
import { buildPageMetadata } from "@/lib/seo"
import {
  buildShopHref,
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

export default async function ShopPage({ searchParams }: Props) {
  const { q = "", category = "", price_min = "", price_max = "", sort = "" } = await searchParams
  const products = await listProducts()
  const categories = groupProductsByCategory(products)
  const categoryLabel = category ? categoryLabelFromSlug(category, products) : undefined
  const priceMin = parseCents(price_min)
  const priceMax = parseCents(price_max)
  const sortKey = parseProductSort(sort)

  let displayProducts = products
  const useSearch = Boolean(q.trim() || priceMin != null || priceMax != null)

  if (useSearch) {
    const { results } = await searchProducts(q, {
      category: categoryLabel,
      priceMin,
      priceMax
    })
    const handles = new Set(results.map((result) => result.handle))
    displayProducts = products.filter((product) => handles.has(product.handle))
    displayProducts =
      sortKey === "featured"
        ? orderProductsBySearchResults(displayProducts, results)
        : sortProducts(displayProducts, sortKey)
  } else if (category) {
    displayProducts = sortProducts(filterProductsByCategorySlug(displayProducts, category), sortKey)
  } else {
    displayProducts = sortProducts(displayProducts, sortKey)
  }

  const showCategorySections = !category && !useSearch
  const categorySections = showCategorySections
    ? getStorefrontCategorySections(displayProducts, sortKey)
    : []
  const useCategorySections = showCategorySections && categorySections.length > 0

  return (
    <section className="page-container space-y-8 py-8">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Shop" }]} />
      <div>
        <span className="section-label">Catalog</span>
        <h1 className="mt-2 font-serif text-4xl text-[#0F172A]">Research Compounds</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#475569]">
          Browse the live catalog synced from Medusa. All products are sold strictly for laboratory
          research use.
        </p>
      </div>

      <form action="/shop" className="max-w-3xl space-y-3">
        <div className="flex gap-2">
          <input
            name="q"
            defaultValue={q}
            placeholder="Filter by name, CAS, formula..."
            className="input-field"
          />
          {category ? <input type="hidden" name="category" value={category} /> : null}
          <button type="submit" className="btn-secondary shrink-0 px-4 py-2.5">
            Filter
          </button>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="block text-xs text-[#64748B]">
            Min price (USD)
            <input
              name="price_min"
              type="number"
              min="0"
              step="0.01"
              defaultValue={price_min}
              placeholder="0.00"
              className="input-field mt-1"
            />
          </label>
          <label className="block text-xs text-[#64748B]">
            Max price (USD)
            <input
              name="price_max"
              type="number"
              min="0"
              step="0.01"
              defaultValue={price_max}
              placeholder="999.00"
              className="input-field mt-1"
            />
          </label>
          <ProductSortSelect defaultValue={sortKey} />
        </div>
      </form>

      <div className="flex flex-wrap gap-2 text-xs text-[#475569]">
        <Link
          href={buildShopHref({ q, price_min, price_max, sort })}
          className={`rounded-full border px-3 py-1 transition ${
            !category ? "border-[#0D9488] text-[#0D9488]" : "border-[#E2E8F0] hover:border-[#CBD5E1]"
          }`}
        >
          All ({products.length})
        </Link>
        {categories.map((item) => (
          <Link
            key={item.slug}
            href={buildShopHref({
              q,
              category: item.slug,
              price_min,
              price_max,
              sort
            })}
            className={`rounded-full border px-3 py-1 transition ${
              category === item.slug
                ? "border-[#0D9488] text-[#0D9488]"
                : "border-[#E2E8F0] hover:border-[#CBD5E1]"
            }`}
          >
            {item.name} ({item.count})
          </Link>
        ))}
      </div>

      <p className="text-sm text-[#64748B]">
        Showing {displayProducts.length} product{displayProducts.length === 1 ? "" : "s"}
        {sortKey !== "featured" ? ` · sorted by ${sortKey.replace("-", " ")}` : ""}
      </p>

      {useCategorySections ? (
        <div className="space-y-14">
          {categorySections.map((section) => (
            <section key={section.slug} className="space-y-6">
              <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#E2E8F0] pb-4">
                <div>
                  <h2 className="font-serif text-2xl text-[#0F172A] md:text-3xl">{section.name}</h2>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#475569]">
                    {section.description}
                  </p>
                </div>
                <Link
                  href={buildShopHref({ q, category: section.slug, price_min, price_max, sort })}
                  className="text-sm font-medium text-[#0D9488] hover:text-[#0F766E]"
                >
                  View all →
                </Link>
              </div>
              <div className="product-card-grid">
                {section.products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="product-card-grid">
          {displayProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {displayProducts.length === 0 ? (
        <p className="rounded-xl border border-[#E2E8F0] bg-white p-6 text-sm text-[#475569]">
          {products.length === 0
            ? "Catalog is empty — Medusa returned no products. Check NEXT_PUBLIC_MEDUSA_URL in .env.local and that the backend is reachable."
            : "No products match this filter. Try a different search term or category."}
        </p>
      ) : null}
    </section>
  )
}
