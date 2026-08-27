import Link from "next/link"
import type { Metadata } from "next"
import { LegalPageShell } from "@/components/legal-page-shell"
import { buildPageMetadata } from "@/lib/seo"

export const metadata: Metadata = buildPageMetadata({
  title: "Shipping Restricted",
  description:
    "Checkout is unavailable for your location due to Tetrava Labs shipping compliance restrictions.",
  path: "/shipping-restricted",
  noIndex: true
})

export default function ShippingRestrictedPage() {
  return (
    <LegalPageShell eyebrow="Compliance" title="Shipping Restricted">
      <div className="space-y-6 text-sm leading-relaxed text-[#475569]">
        <p>
          Checkout is unavailable for your selected or detected location. Tetrava Labs restricts
          shipments to jurisdictions where research-compound distribution conflicts with local
          regulations or our internal compliance policy.
        </p>

        <section className="space-y-3">
          <h2 className="text-base font-medium text-[#0F172A]">Why this happens</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>Your shipping country is on our restricted-destination list.</li>
            <li>Browser or network geolocation suggests a blocked region at checkout.</li>
            <li>An institutional or freight-forwarding address cannot be verified for RUO use.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-medium text-[#0F172A]">What you can do</h2>
          <p>
            If you are a qualified researcher at an eligible institution, contact support with your
            organization name, intended shipping address, and research application. We review
            exceptions on a case-by-case basis where permitted by law.
          </p>
        </section>

        <div className="rounded-xl border border-[#F59E0B]/40 bg-[#FFFBEB] p-5 text-[#92400E]">
          Restrictions apply at order placement. Attempting to circumvent geo-blocks or misrepresent
          shipping destinations may result in order cancellation without refund.
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href="/shop" className="btn-secondary min-h-11 px-5">
          Browse catalog
        </Link>
        <Link href="/contact" className="btn-primary min-h-11 px-5">
          Contact support
        </Link>
        <Link href="/ruo" className="inline-flex min-h-11 items-center px-2 text-sm text-[#0D9488] hover:underline">
          RUO policy
        </Link>
      </div>
    </LegalPageShell>
  )
}
