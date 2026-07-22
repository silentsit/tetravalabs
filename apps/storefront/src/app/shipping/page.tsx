import Link from "next/link"
import type { Metadata } from "next"
import { LegalPageShell } from "@/components/legal-page-shell"
import { buildPageMetadata } from "@/lib/seo"

export const metadata: Metadata = buildPageMetadata({
  title: "Shipping Information",
  description:
    "Tetrava Labs international delivery times, fulfillment, cold-chain packaging, tracking guidance, and customs information for research peptide orders.",
  path: "/shipping"
})

export default function ShippingPage() {
  return (
    <LegalPageShell eyebrow="Shipping" title="Shipping Information">
      <div className="space-y-6 text-sm leading-relaxed text-[#475569]">
        <p>
          Orders begin processing after payment is confirmed. Lyophilized peptides are packed with
          cold packs when required and shipped in discreet, unmarked packaging.
        </p>
        <p>
          Shipping timeframes are estimates and may change due to weather, carrier volume, holidays,
          customs, or other delays. Shipping restrictions apply to certain regions — if checkout is
          blocked for your location, see our{" "}
          <Link href="/shipping-restricted" className="text-[#0D9488] hover:underline">
            shipping compliance policy
          </Link>
          .
        </p>

        <section className="space-y-3">
          <h2 className="text-base font-medium text-[#0F172A]">International shipments</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong>USA, Canada, Australia, UK</strong> — 5–11 business days
            </li>
            <li>
              <strong>South-East Asia</strong> — 3–5 business days
            </li>
            <li>
              <strong>Rest of the world</strong> — 7–14 business days
            </li>
          </ul>
          <p>
            Customers outside the US may face additional import restrictions, procedures, and fees.
            Any customs duties, taxes, or postal fees are the recipient&apos;s responsibility.
            Delivery into destinations that permanently block peptide research materials is not
            guaranteed — see our{" "}
            <Link href="/refund" className="text-[#0D9488] hover:underline">
              refund &amp; delivery policy
            </Link>{" "}
            and{" "}
            <Link href="/shipping-restricted" className="text-[#0D9488] hover:underline">
              shipping restrictions
            </Link>
            .
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-medium text-[#0F172A]">
            Shipping process: what happens after you order?
          </h2>
          <p>
            All orders are processed within <strong>12 hours</strong> of payment confirmation.
            We will email your tracking number once your order has been dispatched.
          </p>
          <p>
            In the event of slight delays, rest assured that the Tetrava Labs team is doing our best
            to get your parcels to you in the shortest possible time.
          </p>
          <p>
            There will be rare occasions where we overlook an order or miss a parcel — simply{" "}
            <Link href="/contact" className="text-[#0D9488] hover:underline">
              email us
            </Link>{" "}
            and we will get on it right away.
          </p>
          <p>
            We provide <strong>24-hour customer support</strong>, so getting in touch will never be
            an issue.
          </p>
          <p>
            You will be able to track your parcel with the tracking number provided. Please note
            that it often takes about <strong>3 days</strong> for the tracking number to go live on
            global tracking systems.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-medium text-[#0F172A]">How to track your order</h2>
          <p>
            Always try tracking with{" "}
            <a
              href="https://posttrack.com/"
              target="_blank"
              rel="noreferrer"
              className="text-[#0D9488] hover:underline"
            >
              Post Track
            </a>{" "}
            or{" "}
            <a
              href="https://www.17track.net/"
              target="_blank"
              rel="noreferrer"
              className="text-[#0D9488] hover:underline"
            >
              17 Track
            </a>{" "}
            first. We find them to be the most updated and accurate compared to other shipment
            tracking platforms.
          </p>
          <p>Depending on your tracking number or destination, also try:</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong>US domestic orders</strong> —{" "}
              <a
                href="https://tools.usps.com/go/TrackConfirmAction_input"
                target="_blank"
                rel="noreferrer"
                className="text-[#0D9488] hover:underline"
              >
                USPS
              </a>
            </li>
            <li>
              <strong>SG suffix</strong> — SingPost
            </li>
            <li>
              <strong>IN suffix</strong> — India Post
            </li>
            <li>
              <strong>CH suffix</strong> — Swiss Post
            </li>
            <li>
              <strong>FR suffix</strong> — La Poste
            </li>
            <li>
              <strong>INAWABET prefix</strong> — DHL India
            </li>
            <li>
              <strong>UK deliveries</strong> — Royal Mail
            </li>
          </ul>
          <p>
            If you encounter an issue you do not understand, please reach out via{" "}
            <Link href="/contact" className="text-[#0D9488] hover:underline">
              email
            </Link>
            , and we will be happy to assist you in any way we can.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-medium text-[#0F172A]">Rates and packaging</h2>
          <p>Shipping rate is shown at checkout before payment.</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>Cold-chain packing with cold packs when required for lyophilized peptides</li>
            <li>Discreet, unmarked outer packaging</li>
            <li>Tracking emailed after dispatch</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-medium text-[#0F172A]">PO Box, military, and signature</h2>
          <p>
            We can deliver to PO Box and APO/FPO addresses when the address format is accepted at
            checkout.
          </p>
          <p>
            A signature on delivery is not required by default. To request a signature requirement,
            contact{" "}
            <Link href="/contact" className="text-[#0D9488] hover:underline">
              support
            </Link>{" "}
            before your order ships.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-medium text-[#0F172A]">Force majeure</h2>
          <p>
            We are not responsible for delays or losses caused by circumstances beyond our control,
            including civil unrest, war, natural disasters, government actions, customs delays, or
            carrier failures. For lost-in-transit and customs-exception handling, our{" "}
            <Link href="/refund" className="text-[#0D9488] hover:underline">
              delivery guarantee
            </Link>{" "}
            applies as stated on that page.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-medium text-[#0F172A]">
            Cancellations, modifications, and address changes
          </h2>
          <p>
            Review your product selections and shipping address carefully before placing your order.
            Contact{" "}
            <Link href="/contact" className="text-[#0D9488] hover:underline">
              support
            </Link>{" "}
            immediately if you need a change. Cancellations are only possible while the order is
            still processing and has not been handed to the carrier.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-medium text-[#0F172A]">Missing, wrong, or damaged products</h2>
          <p>
            Contact us within <strong>7 days of delivery</strong> with your order number and clear
            photos. Approved cases are resolved by free reshipment. See our{" "}
            <Link href="/refund" className="text-[#0D9488] hover:underline">
              refund &amp; delivery policy
            </Link>
            .
          </p>
        </section>
      </div>
    </LegalPageShell>
  )
}
