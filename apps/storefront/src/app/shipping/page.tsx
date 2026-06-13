import Link from "next/link"
import type { Metadata } from "next"
import { LegalPageShell } from "@/components/legal-page-shell"
import { buildPageMetadata } from "@/lib/seo"

export const metadata: Metadata = buildPageMetadata({
  title: "Shipping information",
  description: "Cold-chain shipping, delivery times, and packaging for research peptide orders.",
  path: "/shipping"
})

export default function ShippingPage() {
  return (
    <LegalPageShell eyebrow="Shipping" title="Shipping Information">
      <div className="space-y-4 text-sm leading-relaxed text-[#8A8AA0]">
        <p>
          Orders ship after payment confirmation. Lyophilized peptides are packed with cold packs when
          required and sent in discreet, unmarked packaging.
        </p>
        <p>
          Domestic orders typically arrive within 2–5 business days after fulfillment. International
          delivery times vary by destination and customs processing.
        </p>
        <p>
          Shipping restrictions apply to certain regions. If checkout is blocked for your location, see
          our{" "}
          <Link href="/shipping-restricted" className="text-[#5EEAD4] hover:underline">
            shipping compliance policy
          </Link>
          .
        </p>
      </div>
      <ul className="space-y-2 rounded-xl border border-white/10 bg-[#0A0A10] p-6 text-sm text-[#E8E8F0]">
        <li>Standard research shipping — flat rate at checkout</li>
        <li>Tracking provided when carrier label is generated</li>
        <li>Import duties and customs fees are the recipient&apos;s responsibility</li>
      </ul>
    </LegalPageShell>
  )
}
