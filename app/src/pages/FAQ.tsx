import { faqs } from '@/data/products';
import FAQAccordion from '@/components/FAQAccordion';
import ComplianceNotice from '@/components/ComplianceNotice';

const allFAQs = [
  ...faqs,
  {
    question: 'Do you ship internationally?',
    answer: 'Yes, we ship to over 40 countries worldwide. International orders are shipped with temperature-controlled packaging and full tracking. Delivery times vary by destination, typically 5-10 business days. Customs fees and import duties are the responsibility of the recipient.',
  },
  {
    question: 'What is your return policy?',
    answer: 'Due to the nature of research compounds, we cannot accept returns on opened or used products. Unopened products may be returned within 14 days of delivery for store credit. Please contact our support team to initiate a return.',
  },
  {
    question: 'How do I store lyophilized peptides?',
    answer: 'Store lyophilized peptides at -20°C in a frost-free freezer. Keep vials sealed until ready for reconstitution. Avoid exposure to light, moisture, and repeated freeze-thaw cycles. Properly stored lyophilized peptides remain stable for 24+ months.',
  },
  {
    question: 'What solvents should I use for reconstitution?',
    answer: 'Most peptides reconstitute well in bacteriostatic water. For hydrophobic peptides, try a small amount of acetic acid first, then dilute with bacteriostatic water. Always use sterile technique and work in a clean laboratory environment.',
  },
  {
    question: 'How do I verify the purity of my order?',
    answer: 'Every product ships with a unique Certificate of Analysis (COA) from an independent third-party laboratory. The COA includes HPLC chromatograms, mass spectrometry data, purity percentages, and molecular weight confirmation.',
  },
  {
    question: 'Do you offer bulk or institutional pricing?',
    answer: 'Yes, we offer volume discounts for institutional orders. Please contact our research support team with your requirements for a custom quote. We serve universities, pharmaceutical companies, and research institutions worldwide.',
  },
];

export default function FAQ() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-3xl px-6 lg:px-10">
        <span className="font-mono text-xs uppercase tracking-wider text-[#5EEAD4]">Support</span>
        <h1 className="mt-4 font-serif text-4xl text-[#E8E8F0] md:text-5xl">Frequently Asked Questions</h1>
        <p className="mt-4 text-[#8A8AA0]">
          Find answers to common questions about our research compounds, ordering, shipping, and more.
        </p>

        <div className="mt-10">
          <FAQAccordion items={allFAQs} />
        </div>

        <div className="mt-12 rounded-xl border border-white/[0.06] bg-[#0A0A10] p-6 text-center">
          <p className="text-[#E8E8F0]">Still have questions?</p>
          <p className="mt-2 text-sm text-[#8A8AA0]">
            Our research support team is here to help.
          </p>
          <a
            href="/contact"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#5EEAD4] px-6 py-2.5 text-sm font-medium text-[#050508] transition-all hover:brightness-110"
          >
            Contact Us
          </a>
        </div>

        <div className="mt-12">
          <ComplianceNotice />
        </div>
      </div>
    </div>
  );
}
