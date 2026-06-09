"use client"

import { useState } from "react"
import type { FaqItem } from "@/lib/faq-content"

type Props = {
  items: FaqItem[]
}

export function FaqAccordion({ items }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const isOpen = openIndex === index
        return (
          <div
            key={item.question}
            className={`overflow-hidden rounded-lg border transition-colors ${
              isOpen ? "border-[rgba(120,160,220,0.3)] bg-[#0A0A10]" : "border-white/[0.06] bg-[#0A0A10]"
            }`}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="flex w-full items-center justify-between px-5 py-4 text-left"
              aria-expanded={isOpen}
            >
              <span className="pr-4 text-sm font-medium text-[#E8E8F0]">{item.question}</span>
              <span className={`text-[#8A8AA0] transition-transform ${isOpen ? "rotate-180" : ""}`}>
                ▾
              </span>
            </button>
            {isOpen ? (
              <div className="px-5 pb-4">
                <p className="text-sm leading-relaxed text-[#8A8AA0]">{item.answer}</p>
              </div>
            ) : null}
          </div>
        )
      })}
    </div>
  )
}
