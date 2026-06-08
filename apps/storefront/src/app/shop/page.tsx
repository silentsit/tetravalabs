import Link from "next/link"
import { listProducts } from "@/lib/medusa"
import { AddToCartButton } from "@/components/add-to-cart-button"

export const revalidate = 300

export default async function ShopPage() {
  const products = await listProducts()
  const byCategory = products.reduce<Record<string, typeof products>>((acc, p) => {
    const key = String(p.metadata?.source_category || "Research Product")
    if (!acc[key]) acc[key] = []
    acc[key].push(p)
    return acc
  }, {})

  return (
    <section className="space-y-6">
      <h1 className="text-4xl font-semibold">Research Compounds</h1>
      <p className="max-w-3xl text-[#8A8AA0]">
        Browse the live catalog synced from Medusa. All products are sold strictly for
        laboratory research use.
      </p>
      <div className="flex flex-wrap gap-2 text-xs text-[#8A8AA0]">
        {Object.keys(byCategory).map((category) => (
          <span key={category} className="rounded-full border border-white/10 px-3 py-1">
            {category} ({byCategory[category].length})
          </span>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => {
          const firstVariant = product.variants?.[0]
          const firstPrice = firstVariant?.prices?.[0]?.amount
          return (
            <article
              key={product.id}
              className="rounded-lg border border-white/10 bg-[#0A0A10] p-4 hover:border-[#5EEAD4]/50"
            >
              <Link href={`/product/${product.handle}`}>
                <h2 className="text-lg font-medium">{product.title}</h2>
              </Link>
              <p className="mt-1 text-xs text-[#8A8AA0]">
                {String(product.metadata?.source_category || "Research Product")}
              </p>
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
      {products.length === 0 && (
        <p className="rounded-md border border-white/10 bg-[#0A0A10] p-4 text-[#8A8AA0]">
          No products found. Run catalog normalization and Medusa import, then connect
          `NEXT_PUBLIC_MEDUSA_URL` and publishable key.
        </p>
      )}
    </section>
  )
}
