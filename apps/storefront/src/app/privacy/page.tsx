import Link from "next/link"
import type { Metadata } from "next"
import { LegalPageShell } from "@/components/legal-page-shell"
import { buildPageMetadata } from "@/lib/seo"

export const metadata: Metadata = buildPageMetadata({
  title: "Privacy Policy",
  description:
    "How Tetrava Labs collects, uses, stores, and protects personal information for research-use customers on tetravalabs.com.",
  path: "/privacy"
})

export default function PrivacyPage() {
  return (
    <LegalPageShell eyebrow="Legal" title="Privacy Policy" pathname="/privacy">
      <div className="space-y-6 text-sm leading-relaxed text-[#475569]">
        <p>
          This Privacy Policy explains how Tetrava Labs (&quot;we,&quot; &quot;us,&quot; or
          &quot;our&quot;) collects, uses, stores, and protects information when you visit
          tetravalabs.com, create an account, contact support, or place an order for research
          compounds. By using this website or purchasing from us, you agree to this Privacy Policy
          and our{" "}
          <Link href="/terms" className="text-[#0D9488] hover:underline">
            Terms of Service
          </Link>
          .
        </p>
        <p>
          If you do not agree with this Privacy Policy, please leave the site and do not submit
          personal information or place an order.
        </p>

        <section className="space-y-3">
          <h2 className="text-base font-medium text-[#0F172A]">1. Information we collect</h2>
          <p>
            We collect information you provide directly and limited technical data generated when
            you use the site.
          </p>
          <p className="font-medium text-[#0F172A]">Information you provide</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              Name, email address, phone number, company (if provided), and shipping / billing
              address at checkout or account registration
            </li>
            <li>Order contents, purchase history, and order notes</li>
            <li>Account credentials and profile details when you register</li>
            <li>
              Messages, attachments, and contact details when you use our{" "}
              <Link href="/contact" className="text-[#0D9488] hover:underline">
                contact form
              </Link>{" "}
              or email support
            </li>
            <li>
              Research Use Only acknowledgments and related compliance confirmations at checkout
            </li>
          </ul>
          <p className="font-medium text-[#0F172A]">Payment information</p>
          <p>
            Card payments are processed through Peptide Pay&apos;s hosted checkout. Cryptocurrency
            payments are processed through our configured crypto payment providers. We receive
            payment status, references, and limited transaction metadata needed to fulfill your
            order. We do <strong>not</strong> store full card numbers on Tetrava Labs servers.
          </p>
          <p className="font-medium text-[#0F172A]">Technical and usage information</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              Browser type, device information, approximate location derived from IP, and pages
              visited
            </li>
            <li>
              Server and application logs used for security, reliability, and fraud prevention
            </li>
            <li>
              Cart and local preferences stored in your browser (for example, cart contents in
              local storage)
            </li>
            <li>
              Aggregated analytics (such as page views and referrers) when privacy-friendly
              analytics (e.g. Plausible) is enabled — without ad tracking or selling profiles
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-medium text-[#0F172A]">2. How we use information</h2>
          <p>We use personal information to:</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>Process, fulfill, track, and support orders</li>
            <li>Send transactional emails (order confirmation, payment, shipping, and support)</li>
            <li>Create and manage customer accounts</li>
            <li>Enforce shipping restrictions and Research Use Only compliance</li>
            <li>Respond to inquiries, claims, and reshipment requests</li>
            <li>Improve site performance, search, catalog accuracy, and customer experience</li>
            <li>Detect, investigate, and prevent fraud, abuse, or security incidents</li>
            <li>
              Send optional product or promotional communications where permitted and where you
              have not opted out
            </li>
            <li>Meet accounting, tax, and legal record-keeping obligations</li>
          </ul>
          <p>
            We do <strong>not</strong> sell your personal information to data brokers or
            third-party advertisers. We do not rent or loan customer lists for unrelated marketing.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-medium text-[#0F172A]">3. Emails and communications</h2>
          <p>
            By placing an order or creating an account, you agree that we may email you about that
            order and related account activity. Transactional messages (payment, shipping, order
            status, security, and policy notices) are necessary to fulfill your purchase and are
            not marketing.
          </p>
          <p>
            Where we send promotional emails, you may unsubscribe at any time using the link in
            those messages, or by contacting us. Please allow a reasonable period for suppression
            lists to update. Opting out of marketing does not stop transactional order emails.
          </p>
          <p>
            Phone numbers collected at checkout are used primarily for shipping and delivery
            coordination. We do not share mobile numbers with third parties for their own
            marketing.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-medium text-[#0F172A]">4. Cookies and local storage</h2>
          <p>
            We use cookies, local storage, and similar technologies to keep you signed in, remember
            cart contents, maintain session security, and understand how the site is used. You can
            clear or block cookies and site data through your browser settings. Doing so may affect
            checkout, account login, or cart persistence.
          </p>
          <p>
            Address autocomplete (where enabled) may use Google Places APIs to help you enter a
            shipping address accurately. Use of that feature is also subject to Google&apos;s
            applicable terms and privacy disclosures.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-medium text-[#0F172A]">5. Log files and analytics</h2>
          <p>
            Our hosting and application systems may record technical logs such as IP address,
            request path, browser user agent, timestamps, and error diagnostics. These logs help us
            operate the site, investigate issues, and protect against abuse. They are not used to
            build advertising profiles.
          </p>
          <p>
            If privacy-oriented analytics is enabled, we may review aggregated traffic metrics
            (pages viewed, referrers, device types) without selling that data or using invasive
            cross-site tracking.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-medium text-[#0F172A]">6. Service providers and processors</h2>
          <p>
            We use trusted vendors to operate tetravalabs.com. They process data only as needed to
            provide their services to us, under contractual or industry-standard safeguards
            appropriate to the service. Depending on how you use the site, this may include:
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong>Commerce platform</strong> — Medusa and related infrastructure to manage
              products, carts, customers, and orders
            </li>
            <li>
              <strong>Payment processors</strong> — Peptide Pay (cards) and crypto payment providers
              to collect and confirm payment
            </li>
            <li>
              <strong>Email delivery</strong> — Resend (or similar) to send transactional and
              support-related email
            </li>
            <li>
              <strong>Hosting and storage</strong> — cloud hosts and object storage used for the
              storefront, API, and document assets (such as COA files)
            </li>
            <li>
              <strong>Search and content</strong> — search indexing and CMS tools used to power
              catalog search and research content
            </li>
            <li>
              <strong>Carriers and fulfillment partners</strong> — name and address data needed to
              ship your order
            </li>
          </ul>
          <p>
            We do not authorize these providers to use your information for their own unrelated
            marketing. We may also disclose information if required by law, valid legal process, or
            to protect the rights, safety, and property of Tetrava Labs, our customers, or others.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-medium text-[#0F172A]">7. Storage and security</h2>
          <p>
            We apply reasonable administrative, technical, and organizational measures to protect
            personal information, including HTTPS/SSL encryption in transit for website traffic and
            access controls on production systems. No method of transmission or storage is 100%
            secure; we cannot guarantee absolute security against every threat.
          </p>
          <p>
            We aim to collect only what is needed to process orders, support customers, and meet
            compliance obligations. Order and account records are retained as long as reasonably
            necessary for fulfillment, accounting, dispute resolution, and legal requirements, then
            deleted or anonymized when no longer needed.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-medium text-[#0F172A]">8. Your choices and rights</h2>
          <p>Depending on your location, you may have rights to:</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>Request access to personal information we hold about you</li>
            <li>Request correction of inaccurate information</li>
            <li>Request deletion or export of information, subject to legal retention needs</li>
            <li>Opt out of promotional email</li>
            <li>Object to or restrict certain processing where applicable law allows</li>
          </ul>
          <p>
            To exercise these rights, contact us through the{" "}
            <Link href="/contact" className="text-[#0D9488] hover:underline">
              contact page
            </Link>{" "}
            or email{" "}
            <a href="mailto:info@tetravalabs.com" className="text-[#0D9488] hover:underline">
              info@tetravalabs.com
            </a>
            . We may need to verify your identity before fulfilling a request. We may decline
            deletion of records we must keep for orders, taxes, fraud prevention, or legal claims.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-medium text-[#0F172A]">9. Children&apos;s privacy</h2>
          <p>
            This website is intended for adults purchasing research materials for qualified
            laboratory use. We do not knowingly collect personal information from anyone under 18.
            If you believe a minor has provided information, contact us and we will take
            appropriate steps to delete it.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-medium text-[#0F172A]">10. International visitors</h2>
          <p>
            Tetrava Labs operates online and may process information in countries other than where
            you live. By using the site, you understand that your information may be transferred to
            and processed in jurisdictions with different data-protection laws. We take steps
            appropriate to the services we use to protect that information.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-medium text-[#0F172A]">11. User-submitted content</h2>
          <p>
            If you send us ideas, feedback, or other non-personal content (for example, product
            suggestions), you grant Tetrava Labs a non-exclusive, royalty-free, worldwide license to
            use that feedback to operate and improve our business. Do not submit unlawful,
            defamatory, or infringing material.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-medium text-[#0F172A]">12. Changes to this policy</h2>
          <p>
            We may update this Privacy Policy from time to time. The revised version will be posted
            on this page with an updated &quot;Last updated&quot; date. Continued use of the site
            after changes means you accept the updated policy.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-medium text-[#0F172A]">13. Contact</h2>
          <p>
            Privacy questions or data requests:{" "}
            <a href="mailto:info@tetravalabs.com" className="text-[#0D9488] hover:underline">
              info@tetravalabs.com
            </a>{" "}
            or our{" "}
            <Link href="/contact" className="text-[#0D9488] hover:underline">
              contact page
            </Link>
            .
          </p>
        </section>

        <p className="text-xs text-[#94A3B8]">Last updated: July 28, 2026</p>
      </div>
    </LegalPageShell>
  )
}
