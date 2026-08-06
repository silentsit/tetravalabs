"use client"

import { Fragment, useEffect, useState } from "react"
import Image from "next/image"
import { Download } from "lucide-react"
import type { StoreCoaDocument } from "@/lib/medusa"
import type { ProductReviewsResponse } from "@/lib/reviews"
import type { ProductResearchDetail, ResearchSection } from "@/lib/product-research-detail"
import { authorBioText, authorDisplayName, getAuthor } from "@/lib/authors"
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
  /** Up to three editorial images for the long-form overview / research article. */
  overviewImages?: ProductOverviewImage[]
  /** Curated short description + Research + References + Author Profile content. */
  researchDetail?: ProductResearchDetail | null
}

/** After first block, mid-article, and near the end (before the closing block when possible). */
function overviewImageInsertAfter(blockCount: number): number[] {
  if (blockCount <= 0) return []
  if (blockCount === 1) return [0]
  if (blockCount === 2) return [0, 1]
  if (blockCount === 3) return [0, 1, 2]

  const first = 0
  let middle = Math.floor((blockCount - 1) / 2)
  let nearEnd = blockCount - 2
  if (middle <= first) middle = first + 1
  if (nearEnd <= middle) nearEnd = Math.min(blockCount - 1, middle + 1)
  return [first, middle, nearEnd]
}

/** Renders literal "[n]" citation markers in curated copy as superscript anchor links. */
function renderWithCitations(text: string) {
  const parts = text.split(/(\[\d+\])/g)
  return parts.map((part, index) => {
    const match = part.match(/^\[(\d+)\]$/)
    if (!match) return <Fragment key={index}>{part}</Fragment>
    const refId = match[1]
    return (
      <sup key={index} className="ml-0.5">
        <a
          href={`#research-ref-${refId}`}
          className="text-[#0D9488] no-underline hover:underline"
        >
          [{refId}]
        </a>
      </sup>
    )
  })
}

const tabs = ["Description", "COA", "Reviews"] as const
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
  overviewImages = [],
  researchDetail = null
}: Props) {
  const [activeTab, setActiveTab] = useState<TabId>("Description")
  const primaryCoa = coas[0]

  useEffect(() => {
    if (typeof window === "undefined") return
    if (window.location.hash.replace(/^#/, "").toLowerCase() === "reviews") {
      setActiveTab("Reviews")
    }
  }, [])

  const fallbackParagraphs = product.researchSummary
    .split(/\n\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)

  const shortDescriptionParagraphs = researchDetail?.shortDescription?.length
    ? researchDetail.shortDescription
    : fallbackParagraphs.slice(0, 1)

  const researchBlocks: ResearchSection[] = researchDetail
    ? researchDetail.sections
    : fallbackParagraphs.slice(1).map((paragraph) => ({ heading: "", paragraphs: [paragraph] }))

  const imageAfterIndices = overviewImageInsertAfter(researchBlocks.length)
  const placedOverviewImages = overviewImages.slice(0, 3)

  const identityRows = [
    { label: "CAS Number", value: product.casNumber },
    { label: "Molecular Formula", value: product.molecularFormula },
    { label: "Molecular Weight", value: product.molecularWeight },
    { label: "Sequence", value: product.sequence },
    ...(researchDetail?.otherKnownTitles?.length
      ? [{ label: "Other Known Titles", value: researchDetail.otherKnownTitles.join(", ") }]
      : []),
    { label: "Purity (HPLC)", value: product.purity },
    { label: "Appearance", value: product.appearance },
    { label: "Storage", value: product.storage },
    { label: "Category", value: normalizeTb500DisplayText(product.category) },
    { label: "Strength", value: product.primaryVariantTitle },
    { label: "Form", value: "Lyophilized Powder" },
    { label: "Stability", value: "24 months at -20°C (lyophilized)" },
    { label: "Catalog Handle", value: product.catalogHandleLabel || product.handle }
  ]

  const author = researchDetail ? getAuthor(researchDetail.authorId) : null
  const productName = normalizeTb500DisplayText(product.title)

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
          {activeTab === "Description" ? (
            <div className="space-y-10">
              <article className="max-w-3xl">
                <h3 className="mb-5 font-serif text-2xl text-[#0F172A]">{productName}</h3>
                <div className="space-y-5 text-[15px] leading-7 text-[#475569]">
                  {shortDescriptionParagraphs.map((paragraph, index) => (
                    <p key={`short-desc-${index}`}>{renderWithCitations(paragraph)}</p>
                  ))}
                </div>
              </article>

              <div className="max-w-3xl">
                <h3 className="mb-4 font-serif text-xl text-[#0F172A]">Specifications</h3>
                <AnalyticalTable rows={identityRows} />
              </div>

              {researchBlocks.length > 0 ? (
                <article className="max-w-3xl">
                  <h3 className="mb-5 font-serif text-2xl text-[#0F172A]">
                    {researchDetail ? `${productName} Peptide Research` : "Research Overview"}
                  </h3>
                  <div className="space-y-7">
                    {researchBlocks.map((block, index) => {
                      const imageSlot = imageAfterIndices.indexOf(index)
                      const image = imageSlot >= 0 ? placedOverviewImages[imageSlot] : undefined
                      return (
                        <div key={`${block.heading || "block"}-${index}`} className="space-y-5">
                          {block.heading ? (
                            <h4 className="font-serif text-lg text-[#0F172A]">{block.heading}</h4>
                          ) : null}
                          <div className="space-y-4 text-[15px] leading-7 text-[#475569]">
                            {block.paragraphs.map((paragraph, pIndex) => (
                              <p key={pIndex}>{renderWithCitations(paragraph)}</p>
                            ))}
                            {block.bullets?.length ? (
                              <ul className="list-disc space-y-2 pl-5">
                                {block.bullets.map((bullet, bIndex) => (
                                  <li key={bIndex}>{renderWithCitations(bullet)}</li>
                                ))}
                              </ul>
                            ) : null}
                          </div>
                          {image ? (
                            <figure className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-[#F8FAFC]">
                              <Image
                                src={image.src}
                                alt={image.alt}
                                width={1200}
                                height={675}
                                className="h-auto w-full object-cover"
                                sizes="(max-width: 768px) 100vw, 48rem"
                              />
                            </figure>
                          ) : null}
                        </div>
                      )
                    })}
                  </div>
                </article>
              ) : null}

              {!researchDetail ? (
                <div className="max-w-2xl space-y-4 text-sm leading-relaxed text-[#475569]">
                  <h3 className="mb-1 font-serif text-lg text-[#0F172A]">
                    Storage &amp; Handling for Research Use
                  </h3>
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

              {researchDetail?.references?.length ? (
                <section
                  aria-labelledby="research-references-heading"
                  className="max-w-3xl border-t border-[#E2E8F0] pt-8"
                >
                  <h3 id="research-references-heading" className="mb-4 font-serif text-xl text-[#0F172A]">
                    References &amp; Citations
                  </h3>
                  <ol className="list-decimal space-y-3 pl-5 text-sm leading-relaxed text-[#475569]">
                    {researchDetail.references.map((ref) => (
                      <li key={ref.id} id={`research-ref-${ref.id}`}>
                        {ref.url ? (
                          <a
                            href={ref.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#0F766E] underline-offset-2 hover:underline"
                          >
                            {ref.citation}
                          </a>
                        ) : (
                          ref.citation
                        )}
                      </li>
                    ))}
                  </ol>
                </section>
              ) : null}

              {author ? (
                <section className="max-w-3xl rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-6">
                  <p className="mb-3 text-xs font-medium uppercase tracking-wide text-[#94A3B8]">
                    Author Profile
                  </p>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                    {author.image ? (
                      <Image
                        src={author.image}
                        alt={authorDisplayName(author)}
                        width={88}
                        height={88}
                        className="h-[88px] w-[88px] shrink-0 rounded-full border border-[#E2E8F0] object-cover"
                      />
                    ) : null}
                    <div>
                      <p className="font-serif text-lg text-[#0F172A]">{authorDisplayName(author)}</p>
                      <p className="mb-3 text-sm text-[#0D9488]">{author.title}</p>
                      <p className="text-sm leading-relaxed text-[#475569]">{authorBioText(author)}</p>
                    </div>
                  </div>
                </section>
              ) : null}
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
