import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { getProductByHandle } from "@/lib/medusa"

type Props = { params: Promise<{ handle: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params
  const product = await getProductByHandle(handle)
  if (!product) return { title: "Product Not Found | Tetrava Labs" }
  return {
    title: `${product.title} | Tetrava Labs`,
    description: "Research-use product listing with technical metadata and COA references."
  }
}

export default async function ProductPage({ params }: Props) {
  const { handle } = await params
  const product = await getProductByHandle(handle)
  if (!product) notFound()

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    sku: product.variants?.[0]?.id,
    category: product.metadata?.source_category || "Research Peptides",
    offers: {
      "@type": "Offer",
      priceCurrency: "USD"
    }
  }

  return (
    <article className="space-y-5">
      <h1 className="text-3xl font-semibold">{product.title}</h1>
      <p className="text-sm text-[#FBBF24]">For Research Use Only. Not for human consumption.</p>

      <section className="rounded-lg border border-white/10 bg-[#0A0A10] p-5">
        <h2 className="text-lg font-medium">Variants</h2>
        <ul className="mt-3 space-y-2 text-sm text-[#8A8AA0]">
          {(product.variants || []).map((variant) => (
            <li key={variant.id}>
              {variant.title} -{" "}
              {variant.prices?.[0]
                ? `$${(variant.prices[0].amount / 100).toFixed(2)}`
                : "Price pending"}
            </li>
          ))}
        </ul>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
    </article>
  )
}
