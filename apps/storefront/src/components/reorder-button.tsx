"use client"

import { useState } from "react"
import { useCart } from "@/components/cart-provider"
import { buildReorderCartItems, type ReorderLineInput } from "@/lib/reorder-cart"

type Props = {
  orderLabel: string
  lines: ReorderLineInput[]
  className?: string
}

export function ReorderButton({ orderLabel, lines, className }: Props) {
  const { addItem, setIsOpen } = useCart()
  const [message, setMessage] = useState("")
  const [busy, setBusy] = useState(false)

  const onReorder = () => {
    setBusy(true)
    setMessage("")
    const { items, skipped } = buildReorderCartItems(lines)
    for (const item of items) {
      const { quantity, ...rest } = item
      addItem(rest, quantity)
    }
    setIsOpen(true)
    if (items.length) {
      const skipNote = skipped.length ? ` Skipped: ${skipped.join(", ")}.` : ""
      setMessage(`${items.length} item(s) added from ${orderLabel}.${skipNote}`)
    } else {
      setMessage(
        skipped.length
          ? `Could not reorder: ${skipped.join(", ")}`
          : "No reorderable items on this order."
      )
    }
    setBusy(false)
  }

  if (!lines.length) return null

  return (
    <div className="mt-3 space-y-1">
      <button
        type="button"
        disabled={busy}
        onClick={onReorder}
        className={
          className ||
          "rounded-lg bg-[#0D9488] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#0F766E] disabled:opacity-60"
        }
      >
        Reorder
      </button>
      {message ? <p className="text-xs text-[#64748B]">{message}</p> : null}
    </div>
  )
}
