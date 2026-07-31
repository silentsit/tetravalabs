"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import type { StoreCoaDocument } from "@/lib/medusa"
import type { ProductReviewsResponse } from "@/lib/reviews"
import type { FaqItem } from "@/lib/faq-content"
import {
  buildCompoundProductPath,
  compoundSeoName,
  pickDefaultPackQty,
  pickDefaultStrengthKey,
  type CompoundProductView
} from "@/lib/compound-product"
import { siteConfig } from "@/lib/seo"
import { ProductImageGallery } from "@/components/product-image-gallery"
import { ProductPurchasePanel } from "@/components/product-purchase-panel"
import {
  ProductDetailTabs,
  type ProductOverviewImage
} from "@/components/product-detail-tabs"
import { ProductOfferSummary } from "@/components/product-offer-summary"
import { ProductReviewSummary } from "@/components/product-review-summary"
import { ProductTrustStrip } from "@/components/product-trust-strip"
import type { PackTier } from "@/lib/pack-pricing"
import { getCuratedOverviewImagePaths } from "@/lib/product-overview-images"

const OVERVIEW_CONTEXT_IMAGES = [
  "/images/blog/lab-vial-presentation.jpg",
  "/images/blog/lab-synthesizer.jpg"
] as const

/**
 * Prefer curated editorial images for featured compounds; otherwise gallery +
 * shared lab context photos (three distinct URLs when possible).
 */
function buildOverviewImages(
  parentHandle: string,
  galleryImages: string[],
  productName: string
): ProductOverviewImage[] {
  const unique: string[] = []

  for (const src of getCuratedOverviewImagePaths(parentHandle)) {
    if (src && !unique.includes(src)) unique.push(src)
  }

  if (unique.length < 3) {
    for (const src of galleryImages) {
      if (src && !unique.includes(src)) unique.push(src)
      if (unique.length >= 3) break
    }
  }
  if (unique.length < 3) {
    for (const src of OVERVIEW_CONTEXT_IMAGES) {
      if (unique.length >= 3) break
      if (!unique.includes(src)) unique.push(src)
    }
  }

  const alts = [
    `${productName} research vial from Tetrava Labs`,
    `${productName} laboratory research preparation`,
    `${productName} analytical documentation and lot records`
  ]

  return unique.slice(0, 3).map((src, index) => ({
    src,
    alt: alts[index] || `${productName} research documentation`
  }))
}

type Props = {
  view: CompoundProductView
  initialStrength?: string | null
  initialPack?: string | null
  coasByStrength: Record<string, StoreCoaDocument[]>
  reviewsByStrength: Record<string, ProductReviewsResponse>
  researchSummariesByStrength: Record<string, string>
  faqs: FaqItem[]
}

/** Keep the address bar on the clean parent path (no ?strength= / ?pack=). */
function syncUrl(parentHandle: string) {
  if (typeof window === "undefined") return
  const next = buildCompoundProductPath(parentHandle)
  const current = `${window.location.pathname}${window.location.search}`
  if (current === next) return
  window.history.replaceState(null, "", next)
}

/** Per-strength catalog handles (legacy slugs when merged). */
function catalogHandlesForView(view: CompoundProductView): string {
  const handles = view.strengths.map((strength) => strength.imageHandle || strength.handle)
  const unique = [...new Set(handles.filter(Boolean))]
  return unique.join(", ")
}

export function ProductCompoundView({
  view,
  initialStrength,
  initialPack,
  coasByStrength,
  reviewsByStrength,
  researchSummariesByStrength,
  faqs
}: Props) {
  const [strengthKey, setStrengthKey] = useState(() =>
    pickDefaultStrengthKey(view.strengths, initialStrength)
  )

  const selectedStrength = useMemo(
    () => view.strengths.find((item) => item.strengthKey === strengthKey) || view.strengths[0],
    [strengthKey, view.strengths]
  )

  const [packQty, setPackQty] = useState<number | null>(() =>
    pickDefaultPackQty(
      view.strengths.find((item) => item.strengthKey === pickDefaultStrengthKey(view.strengths, initialStrength)) ||
        view.strengths[0],
      initialPack
    )
  )

  useEffect(() => {
    const nextPack = pickDefaultPackQty(selectedStrength, packQty != null ? String(packQty) : null)
    if (nextPack !== packQty) setPackQty(nextPack)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only re-clamp when strength changes
  }, [selectedStrength?.strengthKey])

  useEffect(() => {
    if (!selectedStrength) return

    // Strength/pack stay in React state; URL is always the clean parent handle.
    syncUrl(view.parentHandle)

    const seoName = compoundSeoName(view, selectedStrength.strengthKey)
    document.title = `${seoName} — ${view.categoryLabel} | ${siteConfig.name}`

    const description = `${seoName} for laboratory research (RUO). ${selectedStrength.purity} purity with lot-linked COA.`
    let meta = document.querySelector('meta[name="description"]')
    if (!meta) {
      meta = document.createElement("meta")
      meta.setAttribute("name", "description")
      document.head.appendChild(meta)
    }
    meta.setAttribute("content", description)
  }, [packQty, selectedStrength, view])

  const onStrengthChange = useCallback((next: string) => {
    setStrengthKey(next)
  }, [])

  const onPackChange = useCallback((tier: PackTier) => {
    setPackQty(tier.qty)
  }, [])

  if (!selectedStrength) return null

  const headingName = compoundSeoName(view, selectedStrength.strengthKey)

  const coas = coasByStrength[selectedStrength.strengthKey] || []
  const reviews = reviewsByStrength[selectedStrength.strengthKey] || {
    product_handle: selectedStrength.handle,
    count: 0,
    aggregate: { ratingValue: 0, reviewCount: 0 },
    items: [],
    viewer: null
  }

  const galleryImages = selectedStrength.galleryImages.length
    ? selectedStrength.galleryImages
    : [selectedStrength.image]

  return (
    <>
      <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
        <div className="card overflow-hidden p-4 lg:max-w-md">
          <ProductImageGallery
            key={selectedStrength.imageHandle}
            productImages={galleryImages}
            productName={headingName}
            coas={coas}
          />
        </div>

        <div className="space-y-5">
          <header>
            <span className="section-label">{view.categoryLabel}</span>
            <h1 className="product-card-title mt-2 break-words text-3xl text-[color:var(--color-text)] sm:text-4xl">
              {headingName}
            </h1>
            {view.displaySubtitle ? (
              <p className="mt-1 text-sm text-[color:var(--color-text-secondary)]">
                {view.displaySubtitle}
              </p>
            ) : null}
            <p className="mt-2 text-sm text-[#D97706]">
              For Research Use Only. Not for human consumption.
            </p>
            <p className="mt-3 inline-flex rounded-full bg-[#CCFBF1] px-3 py-1 font-mono text-xs text-[color:var(--color-teal)]">
              {selectedStrength.purity} purity
            </p>
            <ProductReviewSummary aggregate={reviews.aggregate} />
          </header>

          <ProductOfferSummary
            displayName={view.displayName}
            categoryLabel={view.categoryLabel}
            researchSummary={
              researchSummariesByStrength[selectedStrength.strengthKey] ||
              String(selectedStrength.metadata?.research_summary || "").trim()
            }
            selectedStrength={selectedStrength}
          />

          <ProductPurchasePanel
            displayName={view.displayName}
            strengths={view.strengths}
            selectedStrengthKey={selectedStrength.strengthKey}
            selectedPackQty={packQty}
            onStrengthChange={onStrengthChange}
            onPackChange={onPackChange}
          />
          <ProductTrustStrip />
        </div>
      </div>

      <ProductDetailTabs
        key={selectedStrength.handle}
        product={{
          title: view.displayName,
          handle: selectedStrength.imageHandle || selectedStrength.handle,
          catalogHandleLabel: catalogHandlesForView(view),
          category: view.categoryLabel,
          purity: selectedStrength.purity,
          primaryVariantTitle: selectedStrength.variants[0]?.title || selectedStrength.strengthLabel,
          casNumber: view.casNumber,
          molecularFormula: view.molecularFormula,
          molecularWeight: view.molecularWeight,
          storage: view.storage,
          appearance: view.appearance,
          sequence: view.sequence,
          researchSummary:
            researchSummariesByStrength[selectedStrength.strengthKey] ||
            String(selectedStrength.metadata?.research_summary || "").trim()
        }}
        productId={selectedStrength.productId}
        coas={coas}
        faqs={faqs}
        reviews={reviews}
        overviewImages={buildOverviewImages(view.parentHandle, galleryImages, headingName)}
      />
    </>
  )
}
