import Link from "next/link"
import type { Metadata } from "next"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { ComplianceNotice } from "@/components/compliance-notice"
import { buildPageMetadata, webPageJsonLd } from "@/lib/seo"

const META_DESCRIPTION =
  "Tetrava Labs supplies HPLC-MS verified, COA-documented research peptides with cold-chain shipping to qualified labs. Verified. Documented. Delivered. RUO."

export const metadata: Metadata = buildPageMetadata({
  title: "About",
  absoluteTitle: "About Tetrava Labs | Verified Research-Use-Only Peptides",
  description: META_DESCRIPTION,
  path: "/about",
  registerWebPage: false,
  jsonLd: webPageJsonLd({
    title: "About Tetrava Labs",
    description: META_DESCRIPTION,
    path: "/about",
    type: "AboutPage"
  })
})

const pillars = [
  {
    title: "Purity that's measured, not claimed",
    body: "Products are verified by HPLC-MS, with purity typically at 99%+. We treat analytical verification as a release requirement, not a marketing line."
  },
  {
    title: "Documentation you can trace",
    body: "Every batch carries a lot-linked Certificate of Analysis. Our COA Library lets you match the vial in your hand to the exact analytical record behind it."
  },
  {
    title: "Integrity through the cold chain",
    body: "Peptides are fragile. We ship cold-chain with discreet, protective packaging so material arrives stable, intact, and ready for use."
  },
  {
    title: "Discretion and flexibility at checkout",
    body: "Guest checkout, straightforward order lookup, and crypto and alternative payment options for qualified buyers."
  }
]

const processSteps = [
  {
    title: "Sourced & qualified",
    body: "We work only with synthesis partners who deliver the same quality batch after batch."
  },
  {
    title: "Verified (HPLC-MS)",
    body: "Every batch is tested for purity and identity; material that doesn't meet spec doesn't ship."
  },
  {
    title: "Documented",
    body: "Each lot is assigned a number and a matching COA, stored in our COA Library."
  },
  {
    title: "Protected",
    body: "Cold-chain storage and discreet, protective packaging preserve integrity from intake to delivery."
  },
  {
    title: "Supported",
    body: "Clear payment instructions, easy order lookup, and a real person at info@tetravalabs.com."
  }
]

const catalogCategories = [
  "GLP-1 / metabolic research peptides — including semaglutide, tirzepatide, and retatrutide",
  "Tissue repair & recovery peptides — including BPC-157 and TB-500",
  "Growth hormone secretagogues — including CJC-1295, ipamorelin, and sermorelin",
  "Blends, laboratory water, and ancillary research materials"
]

export default function AboutPage() {
  return (
    <section className="page-container mx-auto max-w-4xl space-y-10 py-8">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About" }]} />

      <div>
        <span className="section-label">About us</span>
        <h1 className="mt-4 font-serif text-4xl text-[#0F172A] md:text-5xl">About Tetrava Labs</h1>
        <p className="mt-4 font-serif text-xl text-[#0F766E]">Verified. Documented. Delivered.</p>
      </div>

      <div className="space-y-6 text-base leading-relaxed text-[#475569]">
        <p>
          Tetrava Labs is a research-use-only (RUO) peptide supplier built for people who read the
          Certificate of Analysis before they read the price. We supply qualified laboratories and
          independent researchers with high-purity peptides, blends, and ancillary lab materials — every
          lot verified, every batch documented, every order handled like the data depends on it. Because
          it does.
        </p>
      </div>

      <div className="card p-8">
        <h2 className="font-serif text-2xl text-[#0F172A]">Why we exist</h2>
        <div className="mt-4 space-y-4 text-sm leading-relaxed text-[#475569]">
          <p>
            The research peptide market has a trust problem. Purity claims without paperwork. &ldquo;99%&rdquo;
            printed on a label that no instrument ever validated. Vials that arrive warm, unlabeled, or
            inconsistent from one batch to the next — quietly introducing variables into work that&apos;s
            supposed to control for them.
          </p>
          <p>
            We started Tetrava Labs to remove that uncertainty. In research, a compound is only as good
            as your confidence in what&apos;s actually in the vial. Our job is to make that confidence the
            default, not the exception.
          </p>
        </div>
      </div>

      <div>
        <h2 className="font-serif text-2xl text-[#0F172A]">The four pillars</h2>
        <p className="mt-3 text-sm text-[#475569]">
          Our name comes from <em>tetra</em> — four. It&apos;s also how we think about every order we ship.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {pillars.map((pillar) => (
            <div key={pillar.title} className="card p-6">
              <h3 className="font-medium text-[#0F172A]">{pillar.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#475569]">{pillar.body}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-8">
        <h2 className="font-serif text-2xl text-[#0F172A]">Our process</h2>
        <p className="mt-3 text-sm text-[#475569]">
          Consistency isn&apos;t an accident — it&apos;s a workflow.
        </p>
        <ul className="mt-6 space-y-4">
          {processSteps.map((step) => (
            <li key={step.title} className="text-sm leading-relaxed text-[#475569]">
              <span className="font-medium text-[#0F172A]">{step.title}</span>
              {" — "}
              {step.body}
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm leading-relaxed text-[#475569]">
          The throughline: verify before it ships, document every batch, and protect the molecule end to
          end.
        </p>
      </div>

      <div>
        <h2 className="font-serif text-2xl text-[#0F172A]">What we supply</h2>
        <p className="mt-3 text-sm text-[#475569]">
          Our catalog is focused on the categories serious research programs actually request:
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-[#475569]">
          {catalogCategories.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="mt-4 text-sm leading-relaxed text-[#475569]">
          Every product page is backed by the same standard: verified purity, batch-level documentation,
          and inventory handled with the care these compounds demand.
        </p>
      </div>

      <div className="card p-8">
        <h2 className="font-serif text-2xl text-[#0F172A]">How we work with researchers</h2>
        <p className="mt-4 text-sm leading-relaxed text-[#475569]">
          We&apos;re a supplier, not a black box. Browse the catalog, review the COA before you buy, and
          reach a real person when you need one. Whether you&apos;re sourcing for an institution or running
          independent work, you get the same documentation and the same handling standards on every order.
        </p>
        <p className="mt-4 text-sm text-[#475569]">
          Questions, lot requests, or sourcing inquiries:{" "}
          <a href="mailto:info@tetravalabs.com" className="text-[#0F766E] hover:underline">
            info@tetravalabs.com
          </a>
          .
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

      <ComplianceNotice />
    </section>
  )
}
