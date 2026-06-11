import Link from "next/link"
import { LegalPageShell } from "@/components/legal-page-shell"

export const metadata = {
  title: "Shipping Restricted | Tetrava Labs"
}

export default function ShippingRestrictedPage() {
  return (
    <LegalPageShell eyebrow="Compliance" title="Shipping Restricted">
      <div className="space-y-6 text-sm leading-relaxed text-[#8A8AA0]">
        <p>
          Checkout is unavailable for your selected or detected location. Tetrava Labs restricts
          shipments to jurisdictions where research-compound distribution conflicts with local
          regulations or our internal compliance policy.
        </p>

        <section className="space-y-3">
          <h2 className="text-base font-medium text-[#E8E8F0]">Why this happens</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>Your shipping country is on our restricted-destination list.</li>
            <li>Browser or network geolocation suggests a blocked region at checkout.</li>
            <li>An institutional or freight-forwarding address cannot be verified for RUO use.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-medium text-[#E8E8F0]">What you can do</h2>
          <p>
            If you are a qualified researcher at an eligible institution, contact support with your
            organization name, intended shipping address, and research application. We review
            exceptions on a case-by-case basis where permitted by law.
          </p>
        </section>

        <div className="rounded-xl border border-[#FBBF24]/30 bg-[#FBBF24]/10 p-5 text-[#FBBF24]">
          Restrictions apply at order placement. Attempting to circumvent geo-blocks or misrepresent
          shipping destinations may result in order cancellation without refund.
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/shop"
          className="rounded-lg border border-white/10 px-5 py-2.5 text-sm text-[#E8E8F0] transition hover:border-[#5EEAD4]/40"
        >
          Browse catalog
        </Link>
        <Link
          href="/contact"
          className="rounded-lg bg-[#5EEAD4] px-5 py-2.5 text-sm font-medium text-[#050508] transition hover:brightness-110"
        >
          Contact support
        </Link>
        <Link href="/ruo" className="px-2 py-2.5 text-sm text-[#5EEAD4] hover:underline">
          RUO policy
        </Link>
      </div>
    </LegalPageShell>
  )
}
