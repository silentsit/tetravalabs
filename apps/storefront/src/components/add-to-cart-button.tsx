"use client"

import { useState } from "react"
import { useCart } from "@/components/cart-provider"

type Props = {
  productId: string
  handle: string
  title: string
  variantId: string
  variantTitle: string
  unitPrice: number
  quantity?: number
}

export function AddToCartButton({
  productId,
  handle,
  title,
  variantId,
  variantTitle,
  unitPrice,
  quantity = 1
}: Props) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  return (
    <button
      onClick={() => {
        addItem(
          {
            id: `${productId}:${variantId}`,
            productId,
            handle,
            title,
            variantId,
            variantTitle,
            unitPrice
          },
          quantity
        )
        setAdded(true)
        setTimeout(() => setAdded(false), 900)
      }}
      className="rounded-lg bg-[#0D9488] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0F766E]"
    >
      {added ? "Added" : "Add to cart"}
    </button>
  )
}
