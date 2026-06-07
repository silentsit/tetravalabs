import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
  allowMultiple?: boolean;
}

export default function FAQAccordion({ items, allowMultiple }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (idx: number) => {
    if (allowMultiple) {
      setOpenIndex(openIndex === idx ? null : idx);
    } else {
      setOpenIndex(openIndex === idx ? null : idx);
    }
  };

  return (
    <div className="space-y-3">
      {items.map((item, idx) => (
        <div
          key={idx}
          className={`overflow-hidden rounded-lg border transition-colors duration-200 ${
            openIndex === idx
              ? 'border-[rgba(120,160,220,0.3)] bg-[#0A0A10]'
              : 'border-white/[0.06] bg-[#0A0A10]'
          }`}
        >
          <button
            onClick={() => toggle(idx)}
            className="flex w-full items-center justify-between px-5 py-4 text-left"
          >
            <span className="text-sm font-medium text-[#E8E8F0] pr-4">{item.question}</span>
            <ChevronDown
              className={`h-4 w-4 shrink-0 text-[#8A8AA0] transition-transform duration-200 ${
                openIndex === idx ? 'rotate-180' : ''
              }`}
            />
          </button>
          {openIndex === idx && (
            <div className="px-5 pb-4">
              <p className="text-sm leading-relaxed text-[#8A8AA0]">{item.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
