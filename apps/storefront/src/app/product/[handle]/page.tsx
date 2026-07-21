import { notFound, redirect } from "next/navigation"
import type { Metadata } from "next"
import {
  compoundSeoName,
  findRelatedCompoundProducts,
  getCompoundProductView,
  getProductHref,
  loadStrengthSideData,
  pickDefaultStrengthKey,
  resolveCompoundRedirect
} from "@/lib/compound-product"
import { slugifyCategory } from "@/lib/categories"
import { shopNavLabel } from "@/lib/shop-filters"
import { ProductCompoundView } from "@/components/product-compound-view"
import { ProductCard } from "@/components/product-card"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { ComplianceNotice } from "@/components/compliance-notice"
import { buildPageMetadata } from "@/lib/seo"
import { productFaqItems } from "@/lib/faq-content"

type Props = {
  params: Promise<{ handle: string }>
  searchParams: Promise<{ strength?: string; pack?: string }>
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { handle } = await params
  const query = await searchParams

  const memberRedirect = resolveCompoundRedirect(handle, query)
  if (memberRedirect) {
    return buildPageMetadata({
      title: "Redirecting",
      path: memberRedirect,
      noIndex: true
    })
  }

  const view = await getCompoundProductView(handle)
  if (!view) {
    return buildPageMetadata({
      title: "Product Not Found",
      path: `/product/${handle}`,
      noIndex: true
    })
  }

  const strengthKey = pickDefaultStrengthKey(view.strengths, query.strength)
  const selected = view.strengths.find((item) => item.strengthKey === strengthKey) || view.strengths[0]
  const productName = compoundSeoName(view, strengthKey)
  const cas = view.casNumber !== "N/A" ? ` CAS ${view.casNumber}.` : ""
  const path = getProductHref(selected?.handle || handle)

  return buildPageMetadata({
    title: `${productName} — ${view.categoryLabel}`,
    description: `${productName} for laboratory research (RUO). ${selected?.purity || "99%+"} purity with lot-linked COA.${cas}`,
    path,
    image: selected?.image
  })
}

export default async function ProductPage({ params, searchParams }: Props) {
  const { handle } = await params
  const query = await searchParams

  const memberRedirect = resolveCompoundRedirect(handle, query)
  if (memberRedirect) redirect(memberRedirect)

  const view = await getCompoundProductView(handle)
  if (!view) notFound()

  const [{ coasByStrength, reviewsByStrength }, related] = await Promise.all([
    loadStrengthSideData(view.strengths),
    findRelatedCompoundProducts(view)
  ])

  const defaultStrengthKey = pickDefaultStrengthKey(view.strengths, query.strength)
  const categorySlug = slugifyCategory(view.categoryLabel)
  const crumbName = compoundSeoName(view, defaultStrengthKey)

  return (
    <article className="page-container space-y-10 py-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: shopNavLabel, href: "/shop" },
          { label: view.categoryLabel, href: `/category/${categorySlug}` },
          { label: crumbName }
        ]}
      />

      <ProductCompoundView
        view={view}
        initialStrength={query.strength}
        initialPack={query.pack}
        coasByStrength={coasByStrength}
        reviewsByStrength={reviewsByStrength}
        faqs={productFaqItems}
      />

      {related.length > 0 ? (
        <section>
          <h2 className="mb-6 font-serif text-2xl text-[color:var(--color-text)]">
            Related Compounds
          </h2>
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
