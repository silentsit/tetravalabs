import Link from "next/link"
import type { Metadata } from "next"
import { LegalPageShell } from "@/components/legal-page-shell"
import { buildPageMetadata } from "@/lib/seo"

export const metadata: Metadata = buildPageMetadata({
  title: "Terms of Service",
  path: "/terms"
})

export default function TermsPage() {
  return (
    <LegalPageShell eyebrow="Legal" title="Terms of Service">
      <div className="space-y-6 text-sm leading-relaxed text-[#8A8AA0]">
        <p>
          These terms govern your use of the Tetrava Labs website and purchase of research compounds.
          By placing an order, you confirm that you have read and accept these terms and our{" "}
          <Link href="/ruo" className="text-[#5EEAD4] hover:underline">
            Research Use Only policy
          </Link>
          .
        </p>

        <section className="space-y-3">
          <h2 className="text-base font-medium text-[#E8E8F0]">Eligibility</h2>
          <p>
            You must be at least 18 years old and authorized to purchase on behalf of a research
            institution, laboratory, or qualified professional entity. We reserve the right to refuse
            or cancel orders that do not meet eligibility or compliance requirements.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-medium text-[#E8E8F0]">Orders and payment</h2>
          <p>
            Prices are listed in USD. Orders are confirmed after payment is received through our
            supported crypto payment providers. We may correct pricing errors and cancel affected
            orders with a full refund of amounts paid.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-medium text-[#E8E8F0]">Shipping and restrictions</h2>
          <p>
            Fulfillment is subject to our shipping policy and regional compliance restrictions.
            Orders to restricted destinations will not be processed. See{" "}
            <Link href="/shipping" className="text-[#5EEAD4] hover:underline">
              shipping information
            </Link>{" "}
            for delivery timelines and recipient responsibilities.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-medium text-[#E8E8F0]">Limitation of liability</h2>
          <p>
            Products are provided without warranty of fitness for any particular purpose beyond
            documented batch specifications. Tetrava Labs is not liable for misuse, improper handling,
            or applications outside approved laboratory research.
          </p>
        </section>

        <p className="text-xs">
          This is operational template copy for a research-use storefront. Replace with counsel-reviewed
          terms before production launch.
        </p>
      </div>
    </LegalPageShell>
  )
}
