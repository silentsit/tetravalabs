import Link from "next/link"
import type { Metadata } from "next"
import { LegalPageShell } from "@/components/legal-page-shell"
import { buildPageMetadata } from "@/lib/seo"

export const metadata: Metadata = buildPageMetadata({
  title: "Terms of Service",
  description:
    "Terms governing Tetrava Labs website use and research-compound purchases, including RUO requirements, orders, shipping, quality, and liability.",
  path: "/terms"
})

export default function TermsPage() {
  return (
    <LegalPageShell eyebrow="Legal" title="Terms of Service" pathname="/terms">
      <div className="space-y-6 text-sm leading-relaxed text-[#475569]">
        <p>
          These Terms of Service (&quot;Terms&quot;) govern your access to tetravalabs.com and any
          purchase of research compounds from Tetrava Labs. By browsing the site or placing an order,
          you confirm that you have read, understood, and agree to these Terms, our{" "}
          <Link href="/ruo" className="text-[#0D9488] hover:underline">
            Research Use Only (RUO) policy
          </Link>
          ,{" "}
          <Link href="/privacy" className="text-[#0D9488] hover:underline">
            Privacy Policy
          </Link>
          ,{" "}
          <Link href="/shipping" className="text-[#0D9488] hover:underline">
            Shipping Information
          </Link>
          , and{" "}
          <Link href="/refund" className="text-[#0D9488] hover:underline">
            Refund &amp; Delivery Policy
          </Link>
          .
        </p>
        <p>
          If you do not agree, do not use this website or place an order. Tetrava Labs may update
          these Terms at any time by posting a revised version on this page. Continued use after
          changes constitutes acceptance of the updated Terms.
        </p>

        <section className="space-y-3">
          <h2 className="text-base font-medium text-[#0F172A]">1. Eligibility</h2>
          <p>
            You must be at least <strong>18 years of age</strong> and authorized to purchase on
            behalf of a legitimate research institution, laboratory, or qualified professional
            entity. By ordering, you represent that you meet these requirements and that you will
            use products only for lawful laboratory research.
          </p>
          <p>
            We reserve the right to refuse, limit, or cancel any order if we reasonably believe the
            purchaser is underage, unqualified, purchasing for a non-research purpose, or otherwise
            in violation of these Terms or applicable law.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-medium text-[#0F172A]">
            2. Research and laboratory use only
          </h2>
          <p>
            All products sold by Tetrava Labs are supplied <strong>exclusively for in-vitro
            laboratory and research use</strong> by qualified professionals. Products are{" "}
            <strong>not</strong> approved for human or veterinary consumption, clinical use,
            diagnostic use on living subjects, cosmetic use, dietary supplementation, or any
            application involving living humans or animals.
          </p>
          <p>The following uses are strictly prohibited:</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>Oral consumption or any form of ingestion</li>
            <li>Injection or administration to humans or animals</li>
            <li>Use in foods, drugs, cosmetics, or medical devices</li>
            <li>Resale, relabeling, or marketing as suitable for human or animal use</li>
            <li>Any use that violates applicable local, national, or international law</li>
          </ul>
          <p>
            Listing a product on this site does not grant a license to use it in a way that
            infringes any patent. Products must be handled only by trained individuals under
            appropriate laboratory safety protocols. Purchasers acknowledge that products have not
            been sterilized or validated by Tetrava Labs for safety or efficacy in food, drug,
            medical device, cosmetic, commercial, or any non-research use.
          </p>
          <p>
            Full purchaser obligations and product disclaimers are set out in our{" "}
            <Link href="/ruo" className="text-[#0D9488] hover:underline">
              RUO policy
            </Link>
            .
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-medium text-[#0F172A]">3. Purchaser responsibilities</h2>
          <p>By purchasing, you confirm that you have independently reviewed and understand:</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              Government regulations governing possession, use, and exposure to the products you
              buy
            </li>
            <li>Health and safety hazards associated with handling research compounds</li>
            <li>
              Laboratory hygiene and controls needed to protect workers and the research
              environment
            </li>
            <li>
              Your duty to communicate relevant hazards to anyone who may handle the materials
            </li>
          </ul>
          <p>
            You agree to test, store, use, and dispose of products — and any materials produced
            with them — in compliance with all applicable laws and the standards of a qualified
            professional. You assume full responsibility for ensuring that any use is lawful in
            your jurisdiction, including chemical inventory and import regulations where they
            apply.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-medium text-[#0F172A]">4. Orders, pricing, and payment</h2>
          <p>
            Prices are listed in <strong>USD</strong> unless otherwise stated. We accept payment
            methods displayed at checkout (including card via Peptide Pay hosted checkout and
            supported cryptocurrency options for eligible one-time carts). An order is confirmed
            only after payment is successfully received and verified.
          </p>
          <p>
            We may correct pricing or catalog errors and cancel affected orders. If payment has
            already been collected for a cancelled error order, we will refund the amount paid for
            the affected items subject to our refund processing rules.
          </p>
          <p>
            You are responsible for providing accurate shipping and contact details. Orders placed
            with incorrect addresses may not be eligible for refund or free reshipment — see our{" "}
            <Link href="/refund" className="text-[#0D9488] hover:underline">
              Refund &amp; Delivery Policy
            </Link>
            .
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-medium text-[#0F172A]">
            5. Shipping, international orders, and customs
          </h2>
          <p>
            Fulfillment is subject to our{" "}
            <Link href="/shipping" className="text-[#0D9488] hover:underline">
              shipping information
            </Link>{" "}
            and regional compliance restrictions. Orders to restricted destinations will not be
            processed. See{" "}
            <Link href="/shipping-restricted" className="text-[#0D9488] hover:underline">
              shipping restrictions
            </Link>{" "}
            for details.
          </p>
          <p>
            Tetrava Labs does not warrant that every product is lawful for research use in every
            country. Customers outside our fulfillment origin are responsible for confirming that
            the products they purchase comply with the laws and regulations of their destination.
          </p>
          <p>
            <strong>Customs, duties, import clearance, and local postal coordination are the
            buyer&apos;s sole responsibility.</strong> Tetrava Labs is not liable for delays,
            seizures, returns, or losses caused by customs or import enforcement. Where a
            country&apos;s customs permanently blocks peptides, delivery into that country is not
            guaranteed — as described in our{" "}
            <Link href="/refund" className="text-[#0D9488] hover:underline">
              Refund &amp; Delivery Policy
            </Link>
            .
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-medium text-[#0F172A]">
            6. Delivery guarantee, returns, refunds, and cancellations
          </h2>
          <p>
            <strong>We guarantee delivery</strong> when your order does not arrive for reasons
            outside your control (for example, carrier loss). In those cases we will typically{" "}
            <strong>resend the order</strong>. The primary exception is when customs completely
            blocks peptides into the destination country.
          </p>
          <p>
            Peptides are temperature- and light-sensitive and generally{" "}
            <strong>cannot be returned</strong> for change of mind, opened products, or improper
            storage after delivery. Wrong, damaged, or missing items must be reported within{" "}
            <strong>7 days of delivery</strong> with your order number and supporting photos;
            approved cases are usually resolved by reshipment.
          </p>
          <p>
            Where a refund is approved instead of a reshipment, a{" "}
            <strong>$15 USD processing fee</strong> may be deducted. Cancellations are only
            possible while an order is still processing and has not been handed to the carrier.
            Once shipped, the order cannot be cancelled or modified.
          </p>
          <p>
            Full rules, timelines, and exceptions are in our{" "}
            <Link href="/refund" className="text-[#0D9488] hover:underline">
              Refund &amp; Delivery Policy
            </Link>
            .
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-medium text-[#0F172A]">7. Product quality and documentation</h2>
          <p>
            Tetrava Labs stands behind product identity and stated purity specifications at the
            time of dispatch, consistent with batch documentation. Lot-linked Certificates of
            Analysis (COA) and related documentation are made available through our{" "}
            <Link href="/coa-library" className="text-[#0D9488] hover:underline">
              COA Library
            </Link>{" "}
            or on request where published for the applicable lot.
          </p>
          <p>
            COA and purity data reflect batch-specific testing at the time of manufacture.
            Specifications may vary between lots. No product statement constitutes medical advice,
            a therapeutic claim, or an endorsement of off-label use.
          </p>
          <p>
            Quality concerns should be raised promptly via{" "}
            <Link href="/contact" className="text-[#0D9488] hover:underline">
              support
            </Link>{" "}
            with your order number, product name, and lot number (if available). Remedies for
            confirmed fulfillment or quality issues are limited to replacement, account credit, or
            refund of the purchase price of the affected product under our refund policy. We do not
            accept liability for consequential research costs, lost experiments, or third-party
            testing fees unless we expressly agree in writing.
          </p>
          <p>
            Quality outcomes assume sealed products stored according to labeled or published
            conditions. Opening, transferring, or storing products outside recommended conditions
            may void quality remedies.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-medium text-[#0F172A]">8. Website content</h2>
          <p>
            Articles, product pages, FAQs, and other materials on this site are for informational
            and educational purposes related to laboratory research. They are not medical advice
            and must not be interpreted as instructions for human or animal use. You are
            responsible for complying with all laws in your jurisdiction.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-medium text-[#0F172A]">9. Competition and regulated use</h2>
          <p>
            None of our products is approved by athletic commissions or anti-doping authorities.
            Products must not be used by anyone subject to such rules. Tetrava Labs assumes no
            liability for non-compliance with athletic, employment, or other regulatory regimes.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-medium text-[#0F172A]">
            10. Limitation of liability and indemnification
          </h2>
          <p>
            To the maximum extent permitted by law, products are provided without warranty of
            fitness for any particular purpose beyond documented batch specifications at dispatch.
            Tetrava Labs is not liable for misuse, improper handling, storage outside recommended
            conditions, or any application outside approved laboratory research.
          </p>
          <p>
            Under no circumstances shall Tetrava Labs or its affiliates be liable for special,
            incidental, indirect, or consequential damages — whether arising from contract,
            negligence, strict liability, or otherwise — including lost research time, lost data,
            or substitute procurement costs.
          </p>
          <p>
            By completing a purchase, you agree to indemnify and hold Tetrava Labs harmless from
            claims, expenses, losses, and liabilities arising from your handling, possession, or
            use of the products — whether alone or combined with other substances — or from your
            breach of these Terms.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-medium text-[#0F172A]">11. Intellectual property</h2>
          <p>
            Site content, branding, product descriptions, and related materials are owned by
            Tetrava Labs or its licensors. You may not copy, scrape, or reuse site content for
            commercial purposes without prior written permission.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-medium text-[#0F172A]">12. Contact</h2>
          <p>
            Questions about these Terms, an order, or a compliance concern can be sent through our{" "}
            <Link href="/contact" className="text-[#0D9488] hover:underline">
              contact page
            </Link>{" "}
            or to{" "}
            <a href="mailto:info@tetravalabs.com" className="text-[#0D9488] hover:underline">
              info@tetravalabs.com
            </a>
            . Include your order number when writing about a purchase.
          </p>
        </section>

        <p className="text-xs text-[#94A3B8]">Last updated: July 28, 2026</p>
      </div>
    </LegalPageShell>
  )
}
