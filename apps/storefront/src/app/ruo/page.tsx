import type { Metadata } from "next"
import { LegalPageShell } from "@/components/legal-page-shell"
import { buildPageMetadata } from "@/lib/seo"

export const metadata: Metadata = buildPageMetadata({
  title: "Research Use Only Policy",
  description:
    "Tetrava Labs Research Use Only (RUO) policy — compounds are for qualified laboratory research, not human consumption.",
  path: "/ruo"
})

export default function RuoGatePage() {
  return (
    <LegalPageShell eyebrow="Compliance" title="Research Use Only Policy">
      <div className="space-y-6 text-sm leading-relaxed text-[#8A8AA0]">
        <p>
          Tetrava Labs supplies peptides and research compounds exclusively for in-vitro laboratory
          research by qualified professionals. Products are not approved for human or veterinary
          consumption, clinical use, or any application involving living subjects.
        </p>

        <section className="space-y-3">
          <h2 className="text-base font-medium text-[#0F172A]">Purchaser obligations</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>You are 18 years of age or older and purchasing on behalf of a legitimate research entity.</li>
            <li>You will use products only in controlled laboratory settings with appropriate safety protocols.</li>
            <li>You will not resell, relabel, or represent products as suitable for human or animal use.</li>
            <li>You accept full responsibility for handling, storage, and disposal per institutional guidelines.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-medium text-[#0F172A]">Product disclaimers</h2>
          <p>
            Certificates of Analysis (COA) and purity data reflect batch-specific testing at time of
            manufacture. Specifications may change between lots. No product statement constitutes
            medical advice, a therapeutic claim, or an endorsement of off-label use.
          </p>
        </section>

        <div className="rounded-xl border border-[#FBBF24]/30 bg-[#FBBF24]/10 p-5 text-[#FBBF24]">
          Purchasers acknowledge that they understand these restrictions and agree to comply with
          all applicable laws in their jurisdiction. Checkout requires a separate Research Use Only
          confirmation before an order can be placed.
        </div>
      </div>
    </LegalPageShell>
  )
}
