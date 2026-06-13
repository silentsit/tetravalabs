import Link from "next/link"
import type { Metadata } from "next"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { ProductCard } from "@/components/product-card"
import { listProducts } from "@/lib/medusa"
import { filterProductsByCategorySlug, groupProductsByCategory } from "@/lib/categories"
import { searchProducts } from "@/lib/search"
import { buildPageMetadata } from "@/lib/seo"

export const revalidate = 300

export const metadata: Metadata = buildPageMetadata({
  title: "Shop Research Peptides",
  description:
    "Browse the full Tetrava Labs catalog — GLP-1 peptides, tissue repair compounds, growth secretagogues, and lab supplies with batch COAs.",
  path: "/shop"
})

type Props = {
  searchParams: Promise<{ q?: string; category?: string }>
}

export default async function ShopPage({ searchParams }: Props) {
  const { q = "", category = "" } = await searchParams
  const products = await listProducts()
  const categories = groupProductsByCategory(products)

  let displayProducts = products
  if (q) {
    const { results } = await searchProducts(q)
    const handles = new Set(results.map((result) => result.handle))
    displayProducts = products.filter((product) => handles.has(product.handle))
  }

  if (category) {
    displayProducts = filterProductsByCategorySlug(displayProducts, category)
  }

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

      <form action="/shop" className="max-w-xl">
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
      </form>

      <div className="flex flex-wrap gap-2 text-xs text-[#475569]">
        <Link
          href="/shop"
          className={`rounded-full border px-3 py-1 transition ${
            !category ? "border-[#0D9488] text-[#0D9488]" : "border-[#E2E8F0] hover:border-[#CBD5E1]"
          }`}
        >
          All ({products.length})
        </Link>
        {categories.map((item) => (
          <Link
            key={item.slug}
            href={`/shop?category=${item.slug}`}
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

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {displayProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

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
