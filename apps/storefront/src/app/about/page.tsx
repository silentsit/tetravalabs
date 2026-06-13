import Link from "next/link"
import type { Metadata } from "next"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { buildPageMetadata } from "@/lib/seo"

export const metadata: Metadata = buildPageMetadata({
  title: "About us",
  description:
    "Research peptide supplier with HPLC-MS verification, lot-linked COAs, and cold-chain logistics for qualified laboratories worldwide.",
  path: "/about"
})

const stats = [
  { label: "Compounds", value: "120+" },
  { label: "Purity Standard", value: "99%+" },
  { label: "Research Clients", value: "5,000+" },
  { label: "Countries Shipped", value: "40+" }
]

export default function AboutPage() {
  return (
    <section className="page-container mx-auto max-w-4xl space-y-10 py-8">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About" }]} />
      <div>
        <span className="section-label">About us</span>
        <h1 className="mt-4 font-serif text-4xl text-[#0F172A]">About Tetrava Labs</h1>
      </div>
      <div className="space-y-6 text-base leading-relaxed text-[#475569]">
        <p>
          Tetrava Labs provides the scientific community with access to high-quality, verified research
          compounds. Every product in our catalog is backed by transparent analytical data and strict
          research-use-only compliance controls.
        </p>
        <p>
          Our team includes researchers, analytical chemists, and logistics specialists with experience in
          peptide synthesis, quality control, and scientific supply chain management. We serve research
          institutions, biotechnology firms, and independent laboratories worldwide.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="card p-5 text-center">
            <p className="font-serif text-2xl text-[#0F172A]">{stat.value}</p>
            <p className="mt-1 text-xs text-[#475569]">{stat.label}</p>
          </div>
        ))}
      </div>
      <div className="card p-8">
        <h2 className="font-serif text-2xl text-[#0F172A]">Our mission</h2>
        <p className="mt-4 text-sm leading-relaxed text-[#475569]">
          To advance scientific discovery by providing researchers with reliable materials, batch-level
          documentation, and responsive support. Reliable materials are the foundation of reliable science.
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        <Link href="/shop" className="btn-primary px-6 py-2.5">
          Browse catalog
        </Link>
        <Link href="/coa-library" className="btn-secondary px-6 py-2.5">
          View COA library
        </Link>
      </div>
    </section>
  )
}
