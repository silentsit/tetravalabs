import type { Metadata } from "next"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { PageJsonLd } from "@/components/page-json-ld"
import { ContactForm } from "@/components/contact-form"
import { SocialProfileLinks } from "@/components/social-profile-links"
import { buildPageMetadata } from "@/lib/seo"

export const metadata: Metadata = buildPageMetadata({
  title: "Contact Tetrava Labs",
  absoluteTitle: "Contact Tetrava Labs | Customer & Technical Support",
  description:
    "Contact Tetrava Labs for research support, order questions, COA documents, and compliance inquiries.",
  path: "/contact",
  pageType: "ContactPage"
})

export default function ContactPage() {
  return (
    <section className="page-container mx-auto max-w-4xl space-y-8 pt-8 pb-20">
      <PageJsonLd pathname="/contact" />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Contact" }]} />
      <div>
        <h1 className="font-serif text-3xl text-[#0F172A] sm:text-4xl">Contact us</h1>
        <p className="mt-4 text-[#475569]">
          Reach our research support team about products, orders, COA documents, or compliance questions.
        </p>
      </div>
      <div className="grid gap-10 lg:grid-cols-[1fr_280px]">
        <ContactForm />
        <aside className="space-y-4 text-sm text-[#475569]">
          <div className="card p-4">
            <p className="font-medium text-[#0F172A]">Research support</p>
            <p className="mt-2">Typical response within 1–2 business days.</p>
          </div>
          <div className="card p-4">
            <p className="font-medium text-[#0F172A]">Order questions</p>
            <p className="mt-2">Include your order ID or display number for faster lookup.</p>
          </div>
          <div className="card p-4">
            <p className="font-medium text-[#0F172A]">Social</p>
            <SocialProfileLinks className="mt-2" />
          </div>
        </aside>
      </div>
    </section>
  )
}
