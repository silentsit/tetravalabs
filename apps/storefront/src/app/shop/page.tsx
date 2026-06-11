import Link from "next/link"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { ProductCard } from "@/components/product-card"
import { listProducts } from "@/lib/medusa"
import { filterProductsByCategorySlug, groupProductsByCategory } from "@/lib/categories"
import { searchProducts } from "@/lib/search"

export const revalidate = 300

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
    <section className="space-y-8">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Shop" }]} />
      <div>
        <p className="font-mono text-xs uppercase tracking-wider text-[#5EEAD4]">Catalog</p>
        <h1 className="mt-2 font-serif text-4xl text-[#E8E8F0]">Research Compounds</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#8A8AA0]">
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
            className="w-full rounded-lg border border-white/10 bg-[#0A0A10] px-4 py-2.5 text-sm text-[#E8E8F0] outline-none transition focus:border-[#5EEAD4]/40"
          />
          {category ? <input type="hidden" name="category" value={category} /> : null}
          <button
            type="submit"
            className="shrink-0 rounded-lg border border-white/10 px-4 py-2.5 text-sm text-[#E8E8F0] transition hover:border-[#5EEAD4]/40"
          >
            Filter
          </button>
        </div>
      </form>

      <div className="flex flex-wrap gap-2 text-xs text-[#8A8AA0]">
        <Link
          href="/shop"
          className={`rounded-full border px-3 py-1 transition ${
            !category ? "border-[#5EEAD4] text-[#5EEAD4]" : "border-white/10 hover:border-white/20"
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
                ? "border-[#5EEAD4] text-[#5EEAD4]"
                : "border-white/10 hover:border-white/20"
            }`}
          >
            {item.name} ({item.count})
          </Link>
        ))}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {displayProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {displayProducts.length === 0 ? (
        <p className="rounded-xl border border-white/10 bg-[#0A0A10] p-6 text-sm text-[#8A8AA0]">
          No products found. Run catalog normalization and Medusa import, then connect Medusa env
          vars — or try a different search term.
        </p>
      ) : null}
    </section>
  )
}
