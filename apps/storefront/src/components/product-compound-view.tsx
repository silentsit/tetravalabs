"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { StoreCoaDocument } from "@/lib/medusa";
import { emptyProductReviews, type ProductReviewsResponse } from "@/lib/reviews";
import type { FaqItem } from "@/lib/faq-content";
import type { ProductResearchDetail, ResearchReference } from "@/lib/product-research-detail";
import {
  buildCompoundProductPath,
  compoundSeoName,
  pickDefaultPackQty,
  pickDefaultStrengthKey,
  type CompoundProductView,
} from "@/lib/compound-product";
import { getProductSeoOverride } from "@/lib/product-seo-overrides";
import { publicCatalogHandle } from "@/lib/revamp/product-visual";
import { ProductImageGallery } from "@/components/product-image-gallery";
import { ProductPurchasePanel } from "@/components/product-purchase-panel";
import {
  ProductDetailTabs,
  type ProductOverviewImage,
} from "@/components/product-detail-tabs";
import { ProductOfferSummary } from "@/components/product-offer-summary";
import { ProductReviewSummary } from "@/components/product-review-summary";
import { ProductTrustStrip } from "@/components/product-trust-strip";
import { ProductCoaDownload } from "@/components/product-coa-download";
import { ProductReviewsPanel } from "@/components/product-reviews-panel";
import type { PackTier } from "@/lib/pack-pricing";

type Props = {
  view: CompoundProductView;
  initialStrength?: string | null;
  initialPack?: string | null;
  coasByStrength: Record<string, StoreCoaDocument[]>;
  reviewsByStrength: Record<string, ProductReviewsResponse>;
  researchSummariesByStrength: Record<string, string>;
  overviewImagesByStrength: Record<string, ProductOverviewImage[]>;
  researchDetail?: ProductResearchDetail | null;
  defaultReferences?: ResearchReference[];
  faqs: FaqItem[];
};

/** Keep the address bar on the clean parent path (no ?strength= / ?pack=). */
function syncUrl(parentHandle: string) {
  if (typeof window === "undefined") return;
  const next = buildCompoundProductPath(parentHandle);
  const current = `${window.location.pathname}${window.location.search}`;
  if (current === next) return;
  window.history.replaceState(null, "", next);
}

/** Per-strength catalog handles (legacy slugs when merged). */
function catalogHandlesForView(view: CompoundProductView): string {
  const handles = view.strengths.map((strength) =>
    publicCatalogHandle(strength.imageHandle || strength.handle),
  );
  const unique = [...new Set(handles.filter(Boolean))];
  return unique.join(", ");
}

export function ProductCompoundView({
  view,
  initialStrength,
  initialPack,
  coasByStrength,
  reviewsByStrength,
  researchSummariesByStrength,
  overviewImagesByStrength,
  researchDetail = null,
  defaultReferences = [],
  faqs,
}: Props) {
  const [strengthKey, setStrengthKey] = useState(() =>
    pickDefaultStrengthKey(view.strengths, initialStrength),
  );

  const selectedStrength = useMemo(
    () =>
      view.strengths.find((item) => item.strengthKey === strengthKey) ||
      view.strengths[0],
    [strengthKey, view.strengths],
  );

  const serverReviews = selectedStrength
    ? reviewsByStrength[selectedStrength.strengthKey]
    : undefined;
  const [reviewData, setReviewData] = useState<ProductReviewsResponse | null>(
    () => serverReviews || null,
  );

  useEffect(() => {
    if (serverReviews) setReviewData(serverReviews);
  }, [selectedStrength?.strengthKey]);

  const [packQty, setPackQty] = useState<number | null>(() =>
    pickDefaultPackQty(
      view.strengths.find(
        (item) =>
          item.strengthKey ===
          pickDefaultStrengthKey(view.strengths, initialStrength),
      ) || view.strengths[0],
      initialPack,
    ),
  );

  useEffect(() => {
    const nextPack = pickDefaultPackQty(
      selectedStrength,
      packQty != null ? String(packQty) : null,
    );
    if (nextPack !== packQty) setPackQty(nextPack);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only re-clamp when strength changes
  }, [selectedStrength?.strengthKey]);

  useEffect(() => {
    // Strength/pack stay in React state; URL + title/description stay on the
    // parent compound page (server generateMetadata). Do not rewrite <title>
    // per strength — that made variants look like separate SEO pages.
    syncUrl(view.parentHandle);
  }, [packQty, selectedStrength, view.parentHandle]);

  const onStrengthChange = useCallback((next: string) => {
    setStrengthKey(next);
  }, []);

  const onPackChange = useCallback((tier: PackTier) => {
    setPackQty(tier.qty);
  }, []);

  if (!selectedStrength) return null;

  const seoOverride = getProductSeoOverride(view.parentHandle);
  const headingName =
    seoOverride?.pageHeading ||
    compoundSeoName(view, selectedStrength.strengthKey);
  const galleryAlt = seoOverride?.imageAlt || headingName;

  const coas = coasByStrength[selectedStrength.strengthKey] || [];
  const reviews = reviewData || serverReviews || emptyProductReviews(selectedStrength.handle);

  const galleryImages = selectedStrength.galleryImages.length
    ? selectedStrength.galleryImages
    : [selectedStrength.image];

  const overviewImages =
    overviewImagesByStrength[selectedStrength.strengthKey] || [];

  return (
    <>
      <div className="grid gap-x-10 gap-y-5 lg:grid-cols-2">
        <div className="flex min-h-0 flex-col gap-4 lg:h-0 lg:max-w-md lg:min-h-full">
          <div className="card shrink-0 overflow-hidden p-4">
            <ProductImageGallery
              key={selectedStrength.imageHandle}
              productImages={galleryImages}
              productName={galleryAlt}
              coas={coas}
            />
          </div>
          <div className="shrink-0">
            <ProductCoaDownload coas={coas} />
          </div>
          <ProductReviewsPanel
            key={`${selectedStrength.handle}-reviews`}
            productId={selectedStrength.productId}
            productHandle={selectedStrength.handle}
            initialData={reviews}
            mode="quotes"
            onReviewsChange={setReviewData}
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
        </div>

        <div className="lg:col-start-2">
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
          primaryVariantTitle:
            selectedStrength.variants[0]?.title ||
            selectedStrength.strengthLabel,
          casNumber: view.casNumber,
          molecularFormula: view.molecularFormula,
          molecularWeight: view.molecularWeight,
          storage: view.storage,
          appearance: view.appearance,
          sequence: view.sequence,
          researchSummary:
            researchSummariesByStrength[selectedStrength.strengthKey] ||
            String(selectedStrength.metadata?.research_summary || "").trim(),
        }}
        productId={selectedStrength.productId}
        faqs={faqs}
        reviews={reviews}
        onReviewsChange={setReviewData}
        reviewsHandle={selectedStrength.handle}
        overviewImages={overviewImages}
        researchDetail={researchDetail}
        defaultReferences={defaultReferences}
      />
    </>
  );
}
