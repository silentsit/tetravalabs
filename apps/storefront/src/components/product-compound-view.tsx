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
import { ProductDetailTabs } from "@/components/product-detail-tabs"
import { ProductReviewSummary } from "@/components/product-review-summary"
import { ProductTrustStrip } from "@/components/product-trust-strip"
import type { PackTier } from "@/lib/pack-pricing"

type Props = {
  view: CompoundProductView
  initialStrength?: string | null
  initialPack?: string | null
  coasByStrength: Record<string, StoreCoaDocument[]>
  reviewsByStrength: Record<string, ProductReviewsResponse>
  faqs: FaqItem[]
}

function syncUrl(parentHandle: string, strengthKey: string, packQty: number | null) {
  if (typeof window === "undefined") return
  const next = buildCompoundProductPath(parentHandle, strengthKey, packQty ?? undefined)
  const current = `${window.location.pathname}${window.location.search}`
  if (current === next) return
  window.history.replaceState(null, "", next)
}

export function ProductCompoundView({
  view,
  initialStrength,
  initialPack,
  coasByStrength,
  reviewsByStrength,
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

    // Only compound PDPs use ?strength= / ?pack= shareable state.
    if (view.isCompound) {
      syncUrl(view.parentHandle, selectedStrength.strengthKey, packQty)
    }

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

  const showStrengthInH1 =
    view.isCompound ||
    (Boolean(selectedStrength.strengthLabel) &&
      selectedStrength.strengthLabel !== "standard" &&
      !view.displayName.toLowerCase().includes(selectedStrength.strengthLabel.toLowerCase()))

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
            productName={view.displayName}
            coas={coas}
          />
        </div>

        <div className="space-y-5">
          <header>
            <span className="section-label">{view.categoryLabel}</span>
            <h1 className="product-card-title mt-2 break-words text-3xl text-[color:var(--color-text)] sm:text-4xl">
              {view.displayName}
              {showStrengthInH1 ? (
                <span className="ml-2 font-mono text-xl text-[color:var(--color-text-secondary)] sm:text-2xl">
                  {selectedStrength.strengthLabel}
                </span>
              ) : null}
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
          handle: selectedStrength.handle,
          category: view.categoryLabel,
          purity: selectedStrength.purity,
          primaryVariantTitle: selectedStrength.variants[0]?.title || selectedStrength.strengthLabel,
          casNumber: view.casNumber,
          molecularFormula: view.molecularFormula,
          molecularWeight: view.molecularWeight,
          storage: view.storage,
          appearance: view.appearance,
          sequence: view.sequence,
          researchSummary: view.researchSummary
        }}
        productId={selectedStrength.productId}
        coas={coas}
        faqs={faqs}
        reviews={reviews}
      />
    </>
  )
}
