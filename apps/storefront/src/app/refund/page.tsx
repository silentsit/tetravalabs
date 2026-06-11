import Link from "next/link"
import { LegalPageShell } from "@/components/legal-page-shell"

export const metadata = {
  title: "Refund Policy | Tetrava Labs"
}

export default function RefundPage() {
  return (
    <LegalPageShell eyebrow="Legal" title="Refund Policy">
      <div className="space-y-6 text-sm leading-relaxed text-[#8A8AA0]">
        <p>
          Because research compounds are temperature-sensitive and batch-specific, refunds are
          limited to qualifying fulfillment issues outlined below.
        </p>

        <section className="space-y-3">
          <h2 className="text-base font-medium text-[#E8E8F0]">Eligible claims</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>Shipment lost in transit with no delivery scan after the carrier investigation window.</li>
            <li>Product arrived damaged or compromised due to packaging failure.</li>
            <li>Incorrect item or variant shipped versus the confirmed order.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-medium text-[#E8E8F0]">Non-refundable situations</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>Orders blocked by shipping compliance or RUO policy violations.</li>
            <li>Products stored or handled outside recommended conditions after delivery.</li>
            <li>Change-of-mind requests after shipment — research materials cannot be resold.</li>
          </ul>
        </section>

        <p>
          To open a claim, contact{" "}
          <Link href="/contact" className="text-[#5EEAD4] hover:underline">
            support
          </Link>{" "}
          within 7 days of delivery with your order ID, batch number, and photos where applicable.
        </p>

        <p className="text-xs">
          Template policy for RUO ecommerce — have counsel review before production.
        </p>
      </div>
    </LegalPageShell>
  )
}
