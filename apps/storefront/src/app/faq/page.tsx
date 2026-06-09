import Link from "next/link"
import { FaqAccordion } from "@/components/faq-accordion"
import { faqItems } from "@/lib/faq-content"

export default function FaqPage() {
  return (
    <section className="mx-auto max-w-3xl space-y-8">
      <div>
        <p className="font-mono text-xs uppercase tracking-wider text-[#5EEAD4]">Support</p>
        <h1 className="mt-4 font-serif text-4xl text-[#E8E8F0]">Frequently Asked Questions</h1>
        <p className="mt-4 text-[#8A8AA0]">
          Answers about research compounds, ordering, shipping, and analytical documentation.
        </p>
      </div>
      <FaqAccordion items={faqItems} />
      <div className="rounded-xl border border-white/[0.06] bg-[#0A0A10] p-6 text-center">
        <p className="text-[#E8E8F0]">Still have questions?</p>
        <p className="mt-2 text-sm text-[#8A8AA0]">Our research support team is here to help.</p>
        <Link
          href="/contact"
          className="mt-4 inline-block rounded-lg bg-[#5EEAD4] px-6 py-2.5 text-sm font-medium text-[#050508]"
        >
          Contact Us
        </Link>
      </div>
      <p className="rounded-xl border border-[#FBBF24]/20 bg-white/[0.03] p-5 text-sm text-[#FBBF24]/90">
        All products are sold strictly for in-vitro laboratory research. Not for human or veterinary use.
      </p>
    </section>
  )
}
