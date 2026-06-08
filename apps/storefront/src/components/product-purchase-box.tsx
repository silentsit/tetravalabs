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
    <section className="rounded-lg border border-white/10 bg-[#0A0A10] p-5">
      <h2 className="text-lg font-medium">Select Strength</h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {variants.map((variant) => (
          <button
            key={variant.id}
            onClick={() => setSelectedId(variant.id)}
            className={`rounded border px-3 py-2 text-xs ${
              selected.id === variant.id
                ? "border-[#5EEAD4] text-[#5EEAD4]"
                : "border-white/20 text-[#8A8AA0]"
            }`}
          >
            {variant.title}
          </button>
        ))}
      </div>
      <p className="mt-3 text-sm text-[#E8E8F0]">${price.toFixed(2)}</p>
      <div className="mt-3">
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
