"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/components/cart-provider"
import { buildReorderCartItems } from "@/lib/reorder-cart"

type Props = {
  token: string
}

export function ReorderTokenClient({ token }: Props) {
  const router = useRouter()
  const { addItem, setIsOpen } = useCart()
  const [error, setError] = useState("")
  const [status, setStatus] = useState("Preparing your reorder…")
  const seededRef = useRef(false)

  useEffect(() => {
    if (seededRef.current) return
    const sessionKey = `reorder-seeded:${token}`
    if (typeof window !== "undefined" && sessionStorage.getItem(sessionKey)) {
      setStatus("Items already added from this link. Opening cart…")
      setIsOpen(true)
      router.replace("/cart")
      return
    }

    let cancelled = false
    seededRef.current = true

    const run = async () => {
      try {
        const response = await fetch(`/api/reorder/${encodeURIComponent(token)}`)
        const data = await response.json()
        if (!response.ok || !data.ok) {
          seededRef.current = false
          if (!cancelled) setError(data.message || "This reorder link is invalid or expired.")
          return
        }

        const lines = (data.items || []).map(
          (item: {
            variantId?: string
            productId?: string
            handle?: string
            title?: string
            variantTitle?: string
            quantity?: number
            unitPrice?: number
          }) => ({
            variantId: item.variantId,
            productId: item.productId,
            handle: item.handle,
            title: item.title,
            variantTitle: item.variantTitle,
            quantity: item.quantity,
            unitPrice: item.unitPrice
          })
        )

        const { items, skipped } = buildReorderCartItems(lines)
        for (const item of items) {
          const { quantity, ...rest } = item
          addItem(rest, quantity)
        }

        if (cancelled) return
        if (!items.length) {
          seededRef.current = false
          setError(
            skipped.length
              ? `Could not add items: ${skipped.join(", ")}`
              : "No reorderable items found for this link."
          )
          return
        }

        sessionStorage.setItem(sessionKey, "1")
        setStatus(
          skipped.length
            ? `Added ${items.length} item(s). Skipped: ${skipped.join(", ")}.`
            : `Added ${items.length} item(s) to your cart.`
        )
        setIsOpen(true)
        router.replace("/cart")
      } catch {
        seededRef.current = false
        if (!cancelled) setError("Could not load this reorder link. Try again.")
      }
    }

    void run()
    return () => {
      cancelled = true
    }
  }, [addItem, router, setIsOpen, token])

  if (error) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="font-display text-2xl text-[#0F172A]">Reorder link unavailable</h1>
        <p className="mt-3 text-sm text-[#64748B]">{error}</p>
        <a href="/shop" className="mt-6 inline-block text-sm font-semibold text-[#0D9488]">
          Browse shop
        </a>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <h1 className="font-display text-2xl text-[#0F172A]">Reordering compounds</h1>
      <p className="mt-3 text-sm text-[#64748B]">{status}</p>
    </div>
  )
}
