import type { Metadata } from "next"
import { LegalPageShell } from "@/components/legal-page-shell"
import { buildPageMetadata } from "@/lib/seo"

export const metadata: Metadata = buildPageMetadata({
  title: "Privacy Policy",
  description:
    "How Tetrava Labs collects, uses, and protects order and account information for research-use customers.",
  path: "/privacy"
})

export default function PrivacyPage() {
  return (
    <LegalPageShell eyebrow="Legal" title="Privacy Policy">
      <div className="space-y-6 text-sm leading-relaxed text-[#8A8AA0]">
        <p>
          Tetrava Labs collects only the information needed to process orders, provide customer
          support, and maintain compliance records for research-use sales.
        </p>

        <section className="space-y-3">
          <h2 className="text-base font-medium text-[#E8E8F0]">Information we collect</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>Contact and shipping details submitted at checkout.</li>
            <li>Order history, payment references, and RUO acknowledgment timestamps.</li>
            <li>Support correspondence when you contact us.</li>
            <li>Aggregated analytics (page views, referrers) when Plausible is enabled — no ad tracking.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-medium text-[#E8E8F0]">How we use data</h2>
          <p>
            Data is used to fulfill orders, send transactional emails, enforce shipping restrictions,
            respond to inquiries, and improve site reliability. We do not sell personal information
            to third parties.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-medium text-[#E8E8F0]">Retention and security</h2>
          <p>
            Order and compliance records are retained as required for accounting and regulatory
            purposes. Access is limited to systems necessary for operations. Request data deletion or
            export via the contact page where applicable law permits.
          </p>
        </section>

        <p className="text-xs">
          Operational privacy template — finalize with legal counsel before production, including
          cookie/analytics disclosures for your deployment region.
        </p>
      </div>
    </LegalPageShell>
  )
}
