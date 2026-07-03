import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { getProductByHandle, listCoasByVariant, listProducts } from "@/lib/medusa"
import { listProductReviews } from "@/lib/reviews"
import { getRelatedProducts, slugifyCategory } from "@/lib/categories"
import { shopNavLabel } from "@/lib/shop-filters"
import { getProductImage, getProductPurity, getProductDisplayName, getProductDisplaySubtitle, getProductStrengthLabel, getProductFullName, strengthAlreadyInName } from "@/lib/revamp/product-visual"
import { ProductImageGallery } from "@/components/product-image-gallery"
import { ProductPurchaseBox } from "@/components/product-purchase-box"
import { ProductDetailTabs } from "@/components/product-detail-tabs"
import { ProductTrustStrip } from "@/components/product-trust-strip"
import { ProductCard } from "@/components/product-card"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { ComplianceNotice } from "@/components/compliance-notice"
import { buildPageMetadata } from "@/lib/seo"
import { productFaqItems } from "@/lib/faq-content"

type Props = { params: Promise<{ handle: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params
  const product = await getProductByHandle(handle)
  if (!product) return { title: "Product Not Found" }
  const category = String(product.metadata?.source_category || "Research peptide")
  const cas = product.metadata?.cas_number ? ` CAS ${product.metadata.cas_number}.` : ""
  const displayName = getProductDisplayName(product)
  const strengthLabel = getProductStrengthLabel(product)
  const productName = getProductFullName(displayName, strengthLabel)
  return buildPageMetadata({
    title: `${productName} — ${category}`,
    description: `${productName} for laboratory research (RUO). ${getProductPurity(product)} purity with lot-linked COA.${cas}`,
    path: `/product/${handle}`
  })
}

function researchSummary(product: Awaited<ReturnType<typeof getProductByHandle>>) {
  if (!product) return ""
  const custom = String(product.metadata?.research_summary || "").trim()
  if (custom) return custom
  const category = String(product.metadata?.source_category || "research peptide")
  const name = getProductDisplayName(product)
  return `${name} is supplied for qualified laboratory research in the ${category} category. Each lot is documented with third-party analytical testing where COA documents are published.`
}

export default async function ProductPage({ params }: Props) {
  const { handle } = await params
  const [product, allProducts] = await Promise.all([getProductByHandle(handle), listProducts()])
  if (!product) notFound()
  const primaryVariantId = product.variants?.[0]?.id
  const [coas, reviews] = await Promise.all([
    primaryVariantId ? listCoasByVariant(primaryVariantId) : Promise.resolve([]),
    listProductReviews({ productHandle: handle, productId: product.id })
  ])
  const displayName = getProductDisplayName(product)
  const displaySubtitle = getProductDisplaySubtitle(product)
  const strengthLabel = getProductStrengthLabel(product)
  const productName = getProductFullName(displayName, strengthLabel)
  const showStrengthSeparately = strengthLabel && !strengthAlreadyInName(displayName, strengthLabel)
  const image = getProductImage(product)
  const categoryLabel = String(product.metadata?.source_category || "Research Product")
  const categorySlug = slugifyCategory(categoryLabel)
  const related = getRelatedProducts(product, allProducts)

  return (
    <article className="page-container space-y-10 py-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: shopNavLabel, href: "/shop" },
          { label: categoryLabel, href: `/category/${categorySlug}` },
          { label: productName }
        ]}
      />

      <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
        <div className="card overflow-hidden p-4 lg:max-w-md">
          <ProductImageGallery
            productImage={image}
            productName={displayName}
            coas={coas}
          />
        </div>
        <div className="space-y-5">
          <div>
            <span className="section-label">{categoryLabel}</span>
            <h1 className="product-card-title mt-2 break-words text-3xl text-[#0F172A] sm:text-4xl">
              {displayName}
              {showStrengthSeparately ? (
                <span className="ml-2 font-mono text-xl text-[#64748B] sm:text-2xl">{strengthLabel}</span>
              ) : null}
            </h1>
            {displaySubtitle ? (
              <p className="mt-1 text-sm text-[#64748B]">{displaySubtitle}</p>
            ) : null}
            <p className="mt-2 text-sm text-[#D97706]">For Research Use Only. Not for human consumption.</p>
            <p className="mt-3 inline-flex rounded-full bg-[#CCFBF1] px-3 py-1 font-mono text-xs text-[#0D9488]">
              {getProductPurity(product)} purity
            </p>
          </div>
          <ProductPurchaseBox
            productId={product.id}
            handle={product.handle}
            title={displayName}
            variants={product.variants || []}
          />
          <ProductTrustStrip />
        </div>
      </div>

      <ProductDetailTabs
        product={{
          title: displayName,
          handle: product.handle,
          category: categoryLabel,
          purity: getProductPurity(product),
          primaryVariantTitle: product.variants?.[0]?.title || "Standard",
          casNumber: String(product.metadata?.cas_number || "N/A"),
          molecularFormula: String(product.metadata?.molecular_formula || "N/A"),
          molecularWeight: String(product.metadata?.molecular_weight || "N/A"),
          storage: String(product.metadata?.storage || "-20°C lyophilized"),
          appearance: String(product.metadata?.appearance || "Lyophilized powder"),
          sequence: String(product.metadata?.sequence || "N/A"),
          researchSummary: researchSummary(product)
        }}
        productId={product.id}
        coas={coas}
        faqs={productFaqItems}
        reviews={reviews}
      />

      {related.length > 0 ? (
        <section>
          <h2 className="mb-6 font-serif text-2xl text-[#0F172A]">Related Compounds</h2>
          <div className="product-card-grid">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} variant="featured" />
            ))}
          </div>
        </section>
      ) : null}

      <ComplianceNotice />
    </article>
  )
}
