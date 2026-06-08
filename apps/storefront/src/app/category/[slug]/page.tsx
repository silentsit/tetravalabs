import Link from "next/link"
import { listProducts } from "@/lib/medusa"
import { AddToCartButton } from "@/components/add-to-cart-button"

type Props = { params: Promise<{ slug: string }> }

export const revalidate = 300

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params
  const products = await listProducts()
  const normalizedSlug = slug.toLowerCase()
  const filtered = products.filter((product) =>
    String(product.metadata?.source_category || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .includes(normalizedSlug)
  )

  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-semibold">Category: {slug}</h1>
      <p className="text-[#8A8AA0]">Products filtered by Medusa category metadata.</p>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((product) => {
          const variant = product.variants?.[0]
          const amount = (variant?.prices?.[0]?.amount || 0) / 100
          return (
            <article key={product.id} className="rounded border border-white/10 bg-[#0A0A10] p-4">
              <Link href={`/product/${product.handle}`} className="text-lg text-[#E8E8F0]">
                {product.title}
              </Link>
              <p className="mt-1 text-xs text-[#8A8AA0]">{variant?.title || "Default"}</p>
              <p className="mt-2 text-sm">${amount.toFixed(2)}</p>
              {variant ? (
                <div className="mt-3">
                  <AddToCartButton
                    productId={product.id}
                    handle={product.handle}
                    title={product.title}
                    variantId={variant.id}
                    variantTitle={variant.title}
                    unitPrice={amount}
                  />
                </div>
              ) : null}
            </article>
          )
        })}
      </div>
    </section>
  )
}
