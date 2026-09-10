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
  lineId: string
  label?: string
}

export function AddToCartButton({
  productId,
  handle,
  title,
  variantId,
  variantTitle,
  unitPrice,
  quantity = 1,
  lineId,
  label = "Add to cart"
}: Props) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  return (
    <button
      type="button"
      onClick={() => {
        addItem(
          {
            id: lineId,
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
      className="btn-primary w-full min-h-11 sm:w-auto"
    >
      {added ? "Added" : label}
    </button>
  )
}
