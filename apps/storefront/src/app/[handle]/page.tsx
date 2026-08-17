import { notFound, permanentRedirect } from "next/navigation"
import type { Metadata } from "next"
import {
  canonicalProductSegment,
  compoundSeoProductName,
  getCompoundProductView,
  loadStrengthSideData,
  pickDefaultStrengthKey,
  productPath,
  resolveCatalogHandle
} from "@/lib/compound-product"
import { categorySlugFromLabel } from "@/lib/categories"
import { shopNavLabel } from "@/lib/shop-filters"
import { ProductCompoundView } from "@/components/product-compound-view"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { ComplianceNotice } from "@/components/compliance-notice"
import { PageJsonLd } from "@/components/page-json-ld"
import { buildPageMetadata, siteConfig } from "@/lib/seo"
import { getAuthor } from "@/lib/authors"
import { buildProductSeoDescription, buildProductSeoTitle } from "@/lib/product-seo"
import { getProductSeoOverride } from "@/lib/product-seo-overrides"
import { getProductFaqs } from "@/lib/product-faqs"
import { getProductResearchDetail } from "@/lib/product-research-detail"
import { buildDefaultProductReferences } from "@/lib/product-page-links"
import { buildResearchOverview } from "@/lib/research-overview"
import { buildOverviewImages } from "@/lib/product-overview-images"
import { listProducts } from "@/lib/medusa"

type Props = {
  params: Promise<{ handle: string }>
}

export const revalidate = 300

/** Pre-render each canonical product URL while allowing ISR for catalog updates. */
export async function generateStaticParams() {
  const products = await listProducts()
  const handles = new Set(products.map((product) => productPath(product.handle).slice(1)))
  return [...handles].map((handle) => ({ handle }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params

  const catalogHandle = resolveCatalogHandle(handle)
  const view = await getCompoundProductView(catalogHandle)
  if (!view) notFound()
  const canonicalSegment = canonicalProductSegment(view.parentHandle)
  if (handle !== canonicalSegment) {
    permanentRedirect(productPath(view.parentHandle))
  }

  const strengthKey = pickDefaultStrengthKey(view.strengths)
  const selected = view.strengths.find((item) => item.strengthKey === strengthKey) || view.strengths[0]
  const strengthLabels = view.strengths.map((item) => item.strengthLabel)
  const seoOverride = getProductSeoOverride(view.parentHandle)
  const absoluteTitle =
    seoOverride?.absoluteTitle ||
    buildProductSeoTitle({
      displayName: view.displayName,
      strengthLabels
    })

  const editorialAuthor = getAuthor("editorial-team")

  return buildPageMetadata({
    title: absoluteTitle,
    absoluteTitle,
    description:
      seoOverride?.description ||
      buildProductSeoDescription({
        displayName: view.displayName,
        strengthLabels,
        purity: selected?.purity,
        casNumber: view.casNumber
      }),
    path: productPath(view.parentHandle),
    image: selected?.image,
    authors: [{ name: editorialAuthor.name }],
    publisher: siteConfig.name
  })
}

export default async function ProductPage({ params }: Props) {
  const { handle } = await params

  const catalogHandle = resolveCatalogHandle(handle)
  const view = await getCompoundProductView(catalogHandle)
  if (!view) notFound()
  if (handle !== canonicalProductSegment(view.parentHandle)) {
    permanentRedirect(productPath(view.parentHandle))
  }

  const { coasByStrength, reviewsByStrength } = await loadStrengthSideData(view.strengths)

  const categorySlug = String(categorySlugFromLabel(view.categoryLabel))
  const crumbName = compoundSeoProductName(view)
  const researchDetail = getProductResearchDetail(view.parentHandle)
  const defaultReferences = researchDetail
    ? []
    : buildDefaultProductReferences({
        productName: view.displayName,
        casNumber: view.casNumber
      })
  const faqs = getProductFaqs(view.parentHandle, {
    productName: view.displayName,
    category: view.categoryLabel,
    appearance: view.appearance
  })
  const researchSummariesByStrength = Object.fromEntries(
    view.strengths.map((strength) => [
      strength.strengthKey,
      buildResearchOverview({
        productName: view.displayName,
        category: view.categoryLabel,
        appearance: view.appearance,
        handle: strength.handle,
        parentHandle: view.parentHandle,
        customSummary: String(strength.metadata?.research_summary || "")
      })
    ])
  )
  const overviewImagesByStrength = Object.fromEntries(
    view.strengths.map((strength) => [
      strength.strengthKey,
      buildOverviewImages(
        view.parentHandle,
        strength.galleryImages.length ? strength.galleryImages : [strength.image],
        view.displayName,
        view.categoryLabel
      )
    ])
  )

  return (
    <article className="page-container space-y-10 py-8">
      <PageJsonLd pathname={productPath(view.parentHandle)} />
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
        researchSummariesByStrength={researchSummariesByStrength}
        overviewImagesByStrength={overviewImagesByStrength}
        researchDetail={researchDetail}
        defaultReferences={defaultReferences}
        faqs={faqs}
      />

      <ComplianceNotice />
    </article>
  )
}
