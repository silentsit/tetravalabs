import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { getProductByHandle, listCoasByVariant } from "@/lib/medusa"
import { slugifyCategory } from "@/lib/categories"
import { ProductPurchaseBox } from "@/components/product-purchase-box"
import { Breadcrumbs } from "@/components/breadcrumbs"

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
  const primaryVariantId = product.variants?.[0]?.id
  const coas = primaryVariantId ? await listCoasByVariant(primaryVariantId) : []

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

  const categoryLabel = String(product.metadata?.source_category || "Research Product")
  const categorySlug = slugifyCategory(categoryLabel)

  return (
    <article className="space-y-5">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/shop" },
          { label: categoryLabel, href: `/category/${categorySlug}` },
          { label: product.title }
        ]}
      />
      <h1 className="text-3xl font-semibold">{product.title}</h1>
      <p className="text-sm text-[#FBBF24]">For Research Use Only. Not for human consumption.</p>

      <ProductPurchaseBox
        productId={product.id}
        handle={product.handle}
        title={product.title}
        variants={product.variants || []}
      />

      <section className="rounded-lg border border-white/10 bg-[#0A0A10] p-5">
        <h2 className="text-lg font-medium">Specifications</h2>
        <div className="mt-3 grid gap-2 text-sm text-[#8A8AA0]">
          <p>Category: {String(product.metadata?.source_category || "Research Product")}</p>
          <p>Visual Type: {String(product.metadata?.visual_type || "vial")}</p>
          <p>CAS: {String(product.metadata?.cas_number || "N/A")}</p>
          <p>Molecular Formula: {String(product.metadata?.molecular_formula || "N/A")}</p>
          <p>Molecular Weight: {String(product.metadata?.molecular_weight || "N/A")}</p>
          <p>Storage: {String(product.metadata?.storage || "-20C lyophilized")}</p>
          <p>Appearance: {String(product.metadata?.appearance || "Lyophilized powder")}</p>
        </div>
      </section>

      <section className="rounded-lg border border-white/10 bg-[#0A0A10] p-5">
        <h2 className="text-lg font-medium">Available Variants</h2>
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

      <section className="rounded-lg border border-white/10 bg-[#0A0A10] p-5">
        <h2 className="text-lg font-medium">COA / HPLC Documents</h2>
        {coas.length === 0 ? (
          <p className="mt-2 text-sm text-[#8A8AA0]">
            No batch documents published yet for this variant.
          </p>
        ) : (
          <ul className="mt-3 space-y-2 text-sm text-[#8A8AA0]">
            {coas.map((doc) => (
              <li key={doc.id}>
                Batch {doc.batch_number} — {doc.document_type.toUpperCase()}
                {doc.purity_percent != null ? ` (${doc.purity_percent}% purity)` : ""}
                {doc.document_url ? (
                  <>
                    {" "}
                    <a
                      href={doc.document_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#5EEAD4] underline"
                    >
                      View document
                    </a>
                  </>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
    </article>
  )
}
