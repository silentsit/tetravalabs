import { notFound, redirect } from "next/navigation"
import type { Metadata } from "next"
import {
  compoundSeoName,
  findRelatedCompoundProducts,
  getCompoundProductView,
  loadStrengthSideData,
  pickDefaultStrengthKey,
  productPath,
  resolveCatalogHandle,
  resolveCompoundRedirect,
  resolvePrettyUrlRedirect
} from "@/lib/compound-product"
import { categorySlugFromLabel } from "@/lib/categories"
import { shopNavLabel } from "@/lib/shop-filters"
import { ProductCompoundView } from "@/components/product-compound-view"
import { ProductCard } from "@/components/product-card"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { ComplianceNotice } from "@/components/compliance-notice"
import { buildPageMetadata } from "@/lib/seo"
import { getProductFaqs } from "@/lib/product-faqs"

type Props = {
  params: Promise<{ handle: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params

  const prettyRedirect = resolvePrettyUrlRedirect(handle)
  if (prettyRedirect) {
    return buildPageMetadata({
      title: "Redirecting",
      path: prettyRedirect,
      noIndex: true
    })
  }

  const memberRedirect = resolveCompoundRedirect(handle)
  if (memberRedirect) {
    return buildPageMetadata({
      title: "Redirecting",
      path: memberRedirect,
      noIndex: true
    })
  }

  const catalogHandle = resolveCatalogHandle(handle)
  const view = await getCompoundProductView(catalogHandle)
  if (!view) {
    return buildPageMetadata({
      title: "Product Not Found",
      path: productPath(handle),
      noIndex: true
    })
  }

  const strengthKey = pickDefaultStrengthKey(view.strengths)
  const selected = view.strengths.find((item) => item.strengthKey === strengthKey) || view.strengths[0]
  const productName = compoundSeoName(view, strengthKey)
  const cas = view.casNumber !== "N/A" ? ` CAS ${view.casNumber}.` : ""

  return buildPageMetadata({
    title: `${productName} — ${view.categoryLabel}`,
    description: `${productName} for laboratory research (RUO). ${selected?.purity || "99%+"} purity with lot-linked COA.${cas}`,
    path: productPath(view.parentHandle),
    image: selected?.image
  })
}

export default async function ProductPage({ params }: Props) {
  const { handle } = await params

  const prettyRedirect = resolvePrettyUrlRedirect(handle)
  if (prettyRedirect) redirect(prettyRedirect)

  const memberRedirect = resolveCompoundRedirect(handle)
  if (memberRedirect) redirect(memberRedirect)

  const catalogHandle = resolveCatalogHandle(handle)
  const view = await getCompoundProductView(catalogHandle)
  if (!view) notFound()

  const [{ coasByStrength, reviewsByStrength }, related] = await Promise.all([
    loadStrengthSideData(view.strengths),
    findRelatedCompoundProducts(view)
  ])

  const defaultStrengthKey = pickDefaultStrengthKey(view.strengths)
  const categorySlug = String(categorySlugFromLabel(view.categoryLabel))
  const crumbName = compoundSeoName(view, defaultStrengthKey)
  const faqs = getProductFaqs(view.parentHandle, {
    productName: view.displayName,
    category: view.categoryLabel,
    appearance: view.appearance
  })

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
        coasByStrength={coasByStrength}
        reviewsByStrength={reviewsByStrength}
        faqs={faqs}
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
