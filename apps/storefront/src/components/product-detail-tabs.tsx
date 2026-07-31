"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Download } from "lucide-react"
import type { StoreCoaDocument } from "@/lib/medusa"
import type { ProductReviewsResponse } from "@/lib/reviews"
import { CoaDocumentPreview } from "@/components/coa-document-preview"
import { ProductReviewsPanel } from "@/components/product-reviews-panel"
import type { FaqItem } from "@/lib/faq-content"
import { FaqAccordion } from "@/components/faq-accordion"
import { normalizeTb500DisplayText } from "@/lib/revamp/product-visual"

export type ProductDetailData = {
  title: string
  /** Canonical handle used for reviews API + login return URL. */
  handle: string
  /** Specs display only — may list multiple legacy strength slugs. */
  catalogHandleLabel?: string
  category: string
  purity: string
  primaryVariantTitle: string
  casNumber: string
  molecularFormula: string
  molecularWeight: string
  storage: string
  appearance: string
  sequence: string
  researchSummary: string
}

export type ProductOverviewImage = {
  src: string
  alt: string
}

type Props = {
  product: ProductDetailData
  productId: string
  coas: StoreCoaDocument[]
  faqs: FaqItem[]
  reviews: ProductReviewsResponse
  /** Up to three editorial images for the long-form overview article. */
  overviewImages?: ProductOverviewImage[]
}

/** After first paragraph, mid-article, and near the end (before the closing para when possible). */
function overviewImageInsertAfter(paragraphCount: number): number[] {
  if (paragraphCount <= 0) return []
  if (paragraphCount === 1) return [0]
  if (paragraphCount === 2) return [0, 1]
  if (paragraphCount === 3) return [0, 1, 2]

  const first = 0
  let middle = Math.floor((paragraphCount - 1) / 2)
  let nearEnd = paragraphCount - 2
  if (middle <= first) middle = first + 1
  if (nearEnd <= middle) nearEnd = Math.min(paragraphCount - 1, middle + 1)
  return [first, middle, nearEnd]
}

const tabs = ["Overview", "Specifications", "Storage", "COA", "Reviews"] as const
type TabId = (typeof tabs)[number]

function tabLabel(tab: TabId, reviewCount: number) {
  if (tab === "Reviews" && reviewCount > 0) return `Reviews (${reviewCount})`
  return tab
}

export function ProductDetailTabs({
  product,
  productId,
  coas,
  faqs,
  reviews,
  overviewImages = []
}: Props) {
  const [activeTab, setActiveTab] = useState<TabId>("Overview")
  const primaryCoa = coas[0]

  useEffect(() => {
    if (typeof window === "undefined") return
    if (window.location.hash.replace(/^#/, "").toLowerCase() === "reviews") {
      setActiveTab("Reviews")
    }
  }, [])

  const overviewParagraphs = product.researchSummary
    .split(/\n\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
  const imageAfterIndices = overviewImageInsertAfter(overviewParagraphs.length)
  const placedOverviewImages = overviewImages.slice(0, 3)

  return (
    <section className="space-y-8">
      <div>
        <div className="scrollbar-hide flex gap-0 overflow-x-auto border-b border-[#E2E8F0]">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap border-b-2 px-3 py-3 text-sm font-medium transition-colors sm:px-5 ${
                activeTab === tab
                  ? "border-[#0D9488] text-[#0F172A]"
                  : "border-transparent text-[#94A3B8] hover:text-[#475569]"
              }`}
            >
              {tabLabel(tab, reviews.aggregate.reviewCount)}
            </button>
          ))}
        </div>

        <div className="py-8">
          {activeTab === "Overview" ? (
            <div className="space-y-10">
              <article className="max-w-3xl">
                <h3 className="mb-5 font-serif text-2xl text-[#0F172A]">Product Overview</h3>
                <div className="space-y-5 text-[15px] leading-7 text-[#475569]">
                  {overviewParagraphs.map((paragraph, index) => {
                    const imageSlot = imageAfterIndices.indexOf(index)
                    const image =
                      imageSlot >= 0 ? placedOverviewImages[imageSlot] : undefined
                    return (
                      <div key={`${index}-${paragraph.slice(0, 24)}`} className="space-y-5">
                        <p>{paragraph}</p>
                        {image ? (
                          <figure className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-[#F8FAFC]">
                            <Image
                              src={image.src}
                              alt={image.alt}
                              width={1200}
                              height={750}
                              className="h-auto max-h-[420px] w-full object-contain"
                              sizes="(max-width: 768px) 100vw, 48rem"
                            />
                          </figure>
                        ) : null}
                      </div>
                    )
                  })}
                </div>
              </article>
              <div className="max-w-3xl">
                <h3 className="mb-4 font-serif text-xl text-[#0F172A]">Analytical Data</h3>
                <AnalyticalTable
                  rows={[
                    { label: "CAS Number", value: product.casNumber },
                    { label: "Molecular Formula", value: product.molecularFormula },
                    { label: "Molecular Weight", value: product.molecularWeight },
                    { label: "Purity", value: product.purity },
                    { label: "Appearance", value: product.appearance },
                    { label: "Sequence", value: product.sequence }
                  ]}
                />
              </div>
            </div>
          ) : null}

          {activeTab === "Specifications" ? (
            <div className="max-w-2xl space-y-3">
              <h3 className="mb-4 font-serif text-xl text-[#0F172A]">Product Specifications</h3>
              {[
                { label: "Product Name", value: normalizeTb500DisplayText(product.title) },
                { label: "Catalog Handle", value: product.catalogHandleLabel || product.handle },
                { label: "Category", value: normalizeTb500DisplayText(product.category) },
                { label: "Strength", value: product.primaryVariantTitle },
                { label: "Form", value: "Lyophilized Powder" },
                { label: "Purity (HPLC)", value: product.purity },
                { label: "Appearance", value: product.appearance },
                { label: "Storage", value: product.storage },
                { label: "Stability", value: "24 months at -20°C (lyophilized)" }
              ].map((row) => (
                <SpecRow key={row.label} label={row.label} value={row.value} />
              ))}
            </div>
          ) : null}

          {activeTab === "Storage" ? (
            <div className="max-w-2xl space-y-4 text-sm leading-relaxed text-[#475569]">
              <p>
                Store lyophilized powder at {product.storage.replace(/lyophilized/i, "").trim() || "-20°C"} for
                maximum stability. Avoid repeated freeze-thaw cycles. Once reconstituted, store at 4°C and
                use within the timeframe specified in your laboratory protocol.
              </p>
              <p>
                Handle under sterile conditions in a certified laboratory environment. Use appropriate
                personal protective equipment when preparing research solutions.
              </p>
            </div>
          ) : null}

          {activeTab === "COA" ? (
            <div>
              <h3 className="mb-4 font-serif text-xl text-[#0F172A]">Certificate of Analysis</h3>
              <p className="mb-6 text-sm text-[#475569]">
                Each batch is independently tested. Lot-linked COA documents are published when available.
              </p>
              {primaryCoa ? (
                <div className="space-y-6">
                  <CoaDocumentPreview document={primaryCoa} />
                  {primaryCoa.document_url ? (
                    <a
                      href={primaryCoa.document_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg border border-[#E2E8F0] px-4 py-2 text-sm text-[#0F172A] transition-colors hover:border-[#0D9488] hover:text-[#0D9488]"
                    >
                      <Download className="h-4 w-4" aria-hidden />
                      Download COA (PDF)
                    </a>
                  ) : null}
                  {coas.length > 1 ? (
                    <ul className="space-y-2 text-sm text-[#475569]">
                      {coas.slice(1).map((doc) => (
                        <li key={doc.id}>
                          Batch {doc.batch_number} — {doc.document_type.toUpperCase()}
                          {doc.document_url ? (
                            <>
                              {" "}
                              ·{" "}
                              <a href={doc.document_url} target="_blank" rel="noreferrer" className="text-[#0D9488] hover:underline">
                                View
                              </a>
                            </>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              ) : (
                <p className="text-sm text-[#475569]">No batch documents published yet for this variant.</p>
              )}
            </div>
          ) : null}

          {activeTab === "Reviews" ? (
            <div id="reviews">
              <ProductReviewsPanel
                productId={productId}
                productHandle={product.handle}
                initialData={reviews}
              />
            </div>
          ) : null}
        </div>
      </div>

      <div className="max-w-3xl">
        <h2 className="mb-6 font-serif text-2xl text-[#0F172A]">Frequently Asked Questions</h2>
        <FaqAccordion items={faqs} />
      </div>
    </section>
  )
}

function AnalyticalTable({ rows }: { rows: Array<{ label: string; value: string }> }) {
  return (
    <div className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white">
      {rows.map((row) => (
        <div
          key={row.label}
          className="flex flex-col gap-1 border-b border-[#E2E8F0] px-5 py-3 last:border-0 sm:flex-row sm:justify-between sm:gap-4"
        >
          <span className="font-mono text-xs text-[#94A3B8]">{row.label}</span>
          <span className="break-words font-mono text-xs text-[#0F172A] sm:text-right">{row.value}</span>
        </div>
      ))}
    </div>
  )
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 border-b border-[#E2E8F0] py-2 sm:flex-row sm:justify-between sm:gap-4">
      <span className="text-sm text-[#475569]">{label}</span>
      <span className="break-words text-sm text-[#0F172A] sm:text-right">{value}</span>
    </div>
  )
}
