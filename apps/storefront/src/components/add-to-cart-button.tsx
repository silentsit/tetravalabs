"use client"

import { useState } from "react"
import { useCart } from "@/components/cart-provider"
import {
  LAB_RESTOCK_COPY,
  type FulfillmentMode,
  type LabRestockCadenceDays
} from "@/lib/lab-restock"

type Props = {
  productId: string
  handle: string
  title: string
  variantId: string
  variantTitle: string
  unitPrice: number
  quantity?: number
  lineId: string
  fulfillment?: FulfillmentMode
  restockCadenceDays?: LabRestockCadenceDays
  oneTimeUnitPrice?: number
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
  fulfillment = "one_time",
  restockCadenceDays,
  oneTimeUnitPrice,
  label
}: Props) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  const buttonLabel =
    label ||
    (fulfillment === "lab_restock" ? LAB_RESTOCK_COPY.ctaRestock : LAB_RESTOCK_COPY.ctaOneTime)

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
            unitPrice,
            fulfillment,
            restockCadenceDays:
              fulfillment === "lab_restock" ? restockCadenceDays : undefined,
            oneTimeUnitPrice
          },
          quantity
        )
        setAdded(true)
        setTimeout(() => setAdded(false), 900)
      }}
      className="w-full rounded-lg bg-[#0D9488] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0F766E] sm:w-auto"
    >
      {added ? "Added" : buttonLabel}
    </button>
  )
}
