import Link from "next/link"
import { listProducts } from "@/lib/medusa"
import { AddToCartButton } from "@/components/add-to-cart-button"
import { filterProductsByCategorySlug, groupProductsByCategory, slugifyCategory } from "@/lib/categories"

export const revalidate = 300

type Props = {
  searchParams: Promise<{ q?: string; category?: string }>
}

export default async function ShopPage({ searchParams }: Props) {
  const { q = "", category = "" } = await searchParams
  const products = await listProducts()
  const qLower = q.toLowerCase()

  let filteredProducts = q
    ? products.filter((product) => {
        const haystack = [
          product.title,
          product.handle,
          String(product.metadata?.cas_number || ""),
          String(product.metadata?.molecular_formula || "")
        ]
          .join(" ")
          .toLowerCase()
        return haystack.includes(qLower)
      })
    : products

  if (category) {
    filteredProducts = filterProductsByCategorySlug(filteredProducts, category)
  }

  const categories = groupProductsByCategory(products)

  return (
    <section className="space-y-6">
      <h1 className="text-4xl font-semibold">Research Compounds</h1>
      <p className="max-w-3xl text-[#8A8AA0]">
        Browse the live catalog synced from Medusa. All products are sold strictly for laboratory research use.
      </p>
      <form action="/shop" className="max-w-xl space-y-3">
        <input
          name="q"
          defaultValue={q}
          placeholder="Filter by name, CAS, formula..."
          className="w-full rounded border border-white/20 bg-[#0A0A10] px-3 py-2"
        />
        {category ? <input type="hidden" name="category" value={category} /> : null}
      </form>
      <div className="flex flex-wrap gap-2 text-xs text-[#8A8AA0]">
        <Link
          href="/shop"
          className={`rounded-full border px-3 py-1 ${!category ? "border-[#5EEAD4] text-[#5EEAD4]" : "border-white/10"}`}
        >
          All ({products.length})
        </Link>
        {categories.map((item) => (
          <Link
            key={item.slug}
            href={`/shop?category=${item.slug}`}
            className={`rounded-full border px-3 py-1 ${
              category === item.slug ? "border-[#5EEAD4] text-[#5EEAD4]" : "border-white/10"
            }`}
          >
            {item.name} ({item.count})
          </Link>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.map((product) => {
          const firstVariant = product.variants?.[0]
          const firstPrice = firstVariant?.prices?.[0]?.amount
          const categoryLabel = String(product.metadata?.source_category || "Research Product")
          return (
            <article
              key={product.id}
              className="rounded-lg border border-white/10 bg-[#0A0A10] p-4 hover:border-[#5EEAD4]/50"
            >
              <Link href={`/product/${product.handle}`}>
                <h2 className="text-lg font-medium">{product.title}</h2>
              </Link>
              <Link
                href={`/category/${slugifyCategory(categoryLabel)}`}
                className="mt-1 inline-block text-xs text-[#8A8AA0] hover:text-[#5EEAD4]"
              >
                {categoryLabel}
              </Link>
              <p className="mt-3 text-sm text-[#E8E8F0]">
                {firstPrice ? `$${(firstPrice / 100).toFixed(2)}` : "Price pending"}
              </p>
              {firstVariant ? (
                <div className="mt-3">
                  <AddToCartButton
                    productId={product.id}
                    handle={product.handle}
                    title={product.title}
                    variantId={firstVariant.id}
                    variantTitle={firstVariant.title}
                    unitPrice={(firstPrice || 0) / 100}
                  />
                </div>
              ) : null}
            </article>
          )
        })}
      </div>
      {filteredProducts.length === 0 && (
        <p className="rounded-md border border-white/10 bg-[#0A0A10] p-4 text-[#8A8AA0]">
          No products found. Run catalog normalization and Medusa import, then connect Medusa env vars.
        </p>
      )}
    </section>
  )
}
