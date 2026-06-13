import Link from "next/link"
import type { Metadata } from "next"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { ComplianceNotice } from "@/components/compliance-notice"
import { FaqAccordion } from "@/components/faq-accordion"
import { faqItems } from "@/lib/faq-content"
import { buildPageMetadata, faqJsonLd } from "@/lib/seo"

export const metadata: Metadata = buildPageMetadata({
  title: "FAQ — ordering, shipping & COAs",
  description:
    "Answers about research-use peptides, HPLC verification, certificates of analysis, shipping, and payment.",
  path: "/faq"
})

export default function FaqPage() {
  const jsonLd = faqJsonLd(faqItems)

  return (
    <section className="page-container mx-auto max-w-3xl space-y-8 py-8">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "FAQ" }]} />
      <div>
        <span className="section-label">Support</span>
        <h1 className="mt-4 font-serif text-4xl text-[#0F172A]">Frequently asked questions</h1>
        <p className="mt-4 text-[#475569]">
          Answers about research compounds, ordering, shipping, and analytical documentation.
        </p>
      </div>
      <FaqAccordion items={faqItems} />
      <div className="card p-6 text-center">
        <p className="text-[#0F172A]">Still have questions?</p>
        <p className="mt-2 text-sm text-[#475569]">Our research support team is here to help.</p>
        <Link href="/contact" className="btn-primary mt-4 inline-flex px-6 py-2.5">
          Contact us
        </Link>
      </div>
      <ComplianceNotice />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </section>
  )
}
