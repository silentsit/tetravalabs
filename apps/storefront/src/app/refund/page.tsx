import Link from "next/link"
import type { Metadata } from "next"
import { LegalPageShell } from "@/components/legal-page-shell"
import { buildPageMetadata } from "@/lib/seo"

export const metadata: Metadata = buildPageMetadata({
  title: "Refund & Delivery Policy",
  description:
    "Tetrava Labs delivery guarantee, reshipment policy, customs exceptions, and refund conditions for research peptides.",
  path: "/refund"
})

export default function RefundPage() {
  return (
    <LegalPageShell eyebrow="Legal" title="Refund & Delivery Policy">
      <div className="space-y-6 text-sm leading-relaxed text-[#8A8AA0]">
        <p className="text-base text-[#E8E8F0]">
          <strong>We guarantee delivery.</strong> If your order does not arrive, we will resend it.
        </p>
        <p>
          The only exception is when a country&apos;s customs completely block peptides and will not
          clear the shipment. In that case, we cannot guarantee delivery into that country.
        </p>

        <section className="space-y-3">
          <h2 className="text-base font-medium text-[#E8E8F0]">Delivery guarantee</h2>
          <p>
            If your package is lost in transit, delayed beyond a reasonable carrier window, or never
            delivered for reasons outside your control, we will <strong>resend the order</strong>.
          </p>
          <p>
            Contact us with your order number so we can track the issue and arrange a replacement
            shipment.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-medium text-[#E8E8F0]">Customs exception</h2>
          <p>
            Some countries enforce strict customs rules that refuse peptide research materials.
          </p>
          <p>If customs seizes or permanently blocks your order for that reason:</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>We cannot guarantee delivery into that country</li>
            <li>Reshipment to the same address may not be possible</li>
            <li>
              Please check our{" "}
              <Link href="/shipping-restricted" className="text-[#5EEAD4] hover:underline">
                shipping restrictions
              </Link>{" "}
              before ordering
            </li>
          </ul>
          <p>Outside of that customs situation, we will happily resend.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-medium text-[#E8E8F0]">Returns</h2>
          <p>
            Peptides are temperature- and light-sensitive and cannot be restocked once shipped.
          </p>
          <p>
            We do <strong>not</strong> accept returns for change of mind, opened products, or
            improper storage after delivery.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-medium text-[#E8E8F0]">
            When we will help (wrong / damaged / missing)
          </h2>
          <p>Contact us within <strong>7 days of delivery</strong> if:</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>The wrong product was shipped</li>
            <li>The package arrived damaged or compromised</li>
            <li>Items are missing from the order</li>
          </ul>
          <p>
            Include your order number and clear photos. Approved cases are resolved by{" "}
            <strong>reshipment</strong>.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-medium text-[#E8E8F0]">Refunds</h2>
          <p>
            Where a refund is approved instead of a reshipment, a{" "}
            <strong>$15 USD processing fee</strong> applies and will be deducted from the refund
            amount.
          </p>
          <p>
            Shipping fees already paid are typically non-refundable once an order has been
            dispatched.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-medium text-[#E8E8F0]">Cancellations</h2>
          <p>
            You may request a cancellation only while the order is still processing and has not been
            handed to the carrier.
          </p>
          <p>Once shipped, the order cannot be cancelled or modified.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-medium text-[#E8E8F0]">Quick summary</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong>Lost / not delivered</strong> — We resend
            </li>
            <li>
              <strong>Wrong or damaged item</strong> — We resend
            </li>
            <li>
              <strong>Strict customs seize / block peptides</strong> — Delivery not guaranteed;
              reship may not be possible
            </li>
            <li>
              <strong>Change of mind after shipping</strong> — No return / no refund
            </li>
            <li>
              <strong>Approved refund (instead of reship)</strong> — Refund minus{" "}
              <strong>$15 USD</strong> processing fee
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-medium text-[#E8E8F0]">Contact</h2>
          <p>
            To open a claim or request a reship, contact{" "}
            <Link href="/contact" className="text-[#5EEAD4] hover:underline">
              support
            </Link>{" "}
            with your order number within 7 days of the delivery date (or expected delivery date for
            lost shipments).
          </p>
        </section>
      </div>
    </LegalPageShell>
  )
}
