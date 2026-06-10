import Link from "next/link"
import { FaqAccordion } from "@/components/faq-accordion"
import { faqItems } from "@/lib/faq-content"

export function FaqPreview() {
  const preview = faqItems.slice(0, 4)

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-[#5EEAD4]">Support</p>
          <h2 className="mt-2 font-serif text-3xl text-[#E8E8F0]">Common Questions</h2>
        </div>
        <Link href="/faq" className="text-sm text-[#5EEAD4] hover:underline">
          View all FAQs
        </Link>
      </div>
      <FaqAccordion items={preview} />
    </section>
  )
}
