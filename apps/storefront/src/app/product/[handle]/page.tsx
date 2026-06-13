import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { getProductByHandle, listCoasByVariant } from "@/lib/medusa"
import { slugifyCategory } from "@/lib/categories"
import { getProductImage, getProductPurity } from "@/lib/revamp/product-visual"
import { ProductPurchaseBox } from "@/components/product-purchase-box"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { ComplianceNotice } from "@/components/compliance-notice"
import { buildPageMetadata, pageUrl } from "@/lib/seo"

type Props = { params: Promise<{ handle: string }> }

function productPriceRange(product: Awaited<ReturnType<typeof getProductByHandle>>) {
  if (!product) return { low: 0, high: 0 }
  const amounts = (product.variants || [])
    .flatMap((variant) => variant.prices || [])
    .map((price) => Number(price.amount || 0) / 100)
    .filter((amount) => amount > 0)
  if (!amounts.length) return { low: 0, high: 0 }
  return { low: Math.min(...amounts), high: Math.max(...amounts) }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params
  const product = await getProductByHandle(handle)
  if (!product) return { title: "Product Not Found" }
  const category = String(product.metadata?.source_category || "Research peptide")
  const cas = product.metadata?.cas_number ? ` CAS ${product.metadata.cas_number}.` : ""
  return buildPageMetadata({
    title: `${product.title} — ${category}`,
    description: `${product.title} for laboratory research (RUO). ${getProductPurity(product)} purity with lot-linked COA.${cas}`,
    path: `/product/${handle}`
  })
}

export default async function ProductPage({ params }: Props) {
  const { handle } = await params
  const product = await getProductByHandle(handle)
  if (!product) notFound()
  const primaryVariantId = product.variants?.[0]?.id
  const coas = primaryVariantId ? await listCoasByVariant(primaryVariantId) : []
  const image = getProductImage(product)
  const categoryLabel = String(product.metadata?.source_category || "Research Product")
  const categorySlug = slugifyCategory(categoryLabel)
  const { low, high } = productPriceRange(product)
  const offerPrice = low || high

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: `${product.title} — research-use only (RUO) peptide with HPLC-MS verification.`,
    image: image.startsWith("http") ? image : pageUrl(image),
    sku: product.variants?.[0]?.id,
    category: categoryLabel,
    brand: { "@type": "Brand", name: "Tetrava Labs" },
    offers: {
      "@type": "Offer",
      url: pageUrl(`/product/${handle}`),
      priceCurrency: "USD",
      price: offerPrice || undefined,
      ...(low && high && low !== high ? { lowPrice: low, highPrice: high } : {}),
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition"
    }
  }

  return (
    <article className="page-container space-y-8 py-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/shop" },
          { label: categoryLabel, href: `/category/${categorySlug}` },
          { label: product.title }
        ]}
      />

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="card overflow-hidden">
          <div className="aspect-square bg-white p-6">
            <img src={image} alt={product.title} className="h-full w-full object-contain" />
          </div>
        </div>
        <div className="space-y-5">
          <div>
            <span className="section-label">{categoryLabel}</span>
            <h1 className="mt-2 break-words font-serif text-3xl text-[#0F172A] sm:text-4xl">{product.title}</h1>
            <p className="mt-2 text-sm text-[#D97706]">For Research Use Only. Not for human consumption.</p>
            <p className="mt-3 inline-flex rounded-full bg-[#CCFBF1] px-3 py-1 font-mono text-xs text-[#0D9488]">
              {getProductPurity(product)} purity
            </p>
          </div>
          <ProductPurchaseBox
            productId={product.id}
            handle={product.handle}
            title={product.title}
            variants={product.variants || []}
          />
        </div>
      </div>

      <section className="card p-6">
        <h2 className="font-serif text-xl text-[#0F172A]">Specifications</h2>
        <div className="mt-4 grid gap-2 text-sm text-[#475569] sm:grid-cols-2">
          <p>CAS: {String(product.metadata?.cas_number || "N/A")}</p>
          <p>Formula: {String(product.metadata?.molecular_formula || "N/A")}</p>
          <p>Weight: {String(product.metadata?.molecular_weight || "N/A")}</p>
          <p>Storage: {String(product.metadata?.storage || "-20°C lyophilized")}</p>
          <p>Appearance: {String(product.metadata?.appearance || "Lyophilized powder")}</p>
          <p>Sequence: {String(product.metadata?.sequence || "N/A")}</p>
        </div>
      </section>

      <section className="card p-6">
        <h2 className="font-serif text-xl text-[#0F172A]">COA / HPLC documents</h2>
        {coas.length === 0 ? (
          <p className="mt-3 text-sm text-[#475569]">No batch documents published yet for this variant.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {coas.map((doc) => (
              <li
                key={doc.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 text-sm"
              >
                <span className="text-[#0F172A]">
                  Batch {doc.batch_number} — {doc.document_type.toUpperCase()}
                  {doc.purity_percent != null ? ` (${doc.purity_percent}%)` : ""}
                </span>
                {doc.document_url ? (
                  <a
                    href={doc.document_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#0D9488] hover:underline"
                  >
                    View document
                  </a>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>

      <ComplianceNotice />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
    </article>
  )
}
