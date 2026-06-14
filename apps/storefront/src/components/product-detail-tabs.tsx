"use client"

import { useState } from "react"
import { Download } from "lucide-react"
import type { StoreCoaDocument } from "@/lib/medusa"
import { CoaDocumentPreview } from "@/components/coa-document-preview"
import type { FaqItem } from "@/lib/faq-content"
import { FaqAccordion } from "@/components/faq-accordion"

export type ProductDetailData = {
  title: string
  handle: string
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

type Props = {
  product: ProductDetailData
  coas: StoreCoaDocument[]
  faqs: FaqItem[]
}

const tabs = ["Overview", "Specifications", "Storage", "COA", "Shipping"] as const
type TabId = (typeof tabs)[number]

export function ProductDetailTabs({ product, coas, faqs }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>("Overview")
  const primaryCoa = coas[0]

  return (
    <section className="space-y-8">
      <div>
        <div className="flex gap-0 overflow-x-auto border-b border-[#E2E8F0]">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap border-b-2 px-5 py-3 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "border-[#0D9488] text-[#0F172A]"
                  : "border-transparent text-[#94A3B8] hover:text-[#475569]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="py-8">
          {activeTab === "Overview" ? (
            <div className="grid gap-8 lg:grid-cols-2">
              <div>
                <h3 className="mb-4 font-serif text-xl text-[#0F172A]">Research Overview</h3>
                <p className="text-sm leading-relaxed text-[#475569]">{product.researchSummary}</p>
                <p className="mt-4 text-sm leading-relaxed text-[#475569]">
                  Supplied as lyophilized powder for stability during storage and transport.
                  Reconstitution should be performed under sterile laboratory conditions. For
                  research use only — not for human or veterinary consumption.
                </p>
              </div>
              <div>
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
                { label: "Product Name", value: product.title },
                { label: "Catalog Handle", value: product.handle },
                { label: "Category", value: product.category },
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

          {activeTab === "Shipping" ? (
            <div className="max-w-2xl space-y-4 text-sm leading-relaxed text-[#475569]">
              <p>
                Lyophilized peptides ship in temperature-controlled packaging with cold packs where
                required. Domestic orders typically arrive within 2–5 business days; international
                delivery varies by destination and customs processing.
              </p>
              <p>
                Packages are shipped in plain, unmarked outer packaging. Tracking is provided when
                your carrier supports it. See our{" "}
                <a href="/shipping" className="text-[#0D9488] hover:underline">
                  shipping policy
                </a>{" "}
                for restricted regions.
              </p>
            </div>
          ) : null}
        </div>
      </div>

      <div className="max-w-3xl">
        <h2 className="mb-6 font-serif text-2xl text-[#0F172A]">Common Questions</h2>
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
          className="flex justify-between gap-4 border-b border-[#E2E8F0] px-5 py-3 last:border-0"
        >
          <span className="font-mono text-xs text-[#94A3B8]">{row.label}</span>
          <span className="text-right font-mono text-xs text-[#0F172A]">{row.value}</span>
        </div>
      ))}
    </div>
  )
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-[#E2E8F0] py-2">
      <span className="text-sm text-[#475569]">{label}</span>
      <span className="text-right text-sm text-[#0F172A]">{value}</span>
    </div>
  )
}
