"use client"

import { useMemo, useState } from "react"
import { AddToCartButton } from "@/components/add-to-cart-button"

type Variant = {
  id: string
  title: string
  prices?: Array<{ amount: number; currency_code: string }>
}

type Props = {
  productId: string
  handle: string
  title: string
  variants: Variant[]
}

export function ProductPurchaseBox({ productId, handle, title, variants }: Props) {
  const [selectedId, setSelectedId] = useState(variants[0]?.id || "")
  const selected = useMemo(
    () => variants.find((variant) => variant.id === selectedId) || variants[0],
    [selectedId, variants]
  )
  const price = (selected?.prices?.[0]?.amount || 0) / 100

  if (!selected) return null

  return (
    <section className="card p-6">
      <h2 className="font-serif text-lg text-[#0F172A]">Select strength</h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {variants.map((variant) => (
          <button
            key={variant.id}
            type="button"
            onClick={() => setSelectedId(variant.id)}
            className={`rounded-lg border px-3 py-2 text-xs font-medium transition ${
              selected.id === variant.id
                ? "border-[#0D9488] bg-[#CCFBF1] text-[#0F766E]"
                : "border-[#E2E8F0] text-[#475569] hover:border-[#0D9488]"
            }`}
          >
            {variant.title}
          </button>
        ))}
      </div>
      <p className="mt-4 text-2xl font-bold text-[#0F172A]">${price.toFixed(2)}</p>
      <div className="mt-4">
        <AddToCartButton
          productId={productId}
          handle={handle}
          title={title}
          variantId={selected.id}
          variantTitle={selected.title}
          unitPrice={price}
        />
      </div>
    </section>
  )
}
