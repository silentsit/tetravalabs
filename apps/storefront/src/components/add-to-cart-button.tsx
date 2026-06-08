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
      className="rounded-md bg-[#5EEAD4] px-4 py-2 text-sm font-medium text-[#050508] hover:brightness-110"
    >
      {added ? "Added" : "Add to cart"}
    </button>
  )
}
