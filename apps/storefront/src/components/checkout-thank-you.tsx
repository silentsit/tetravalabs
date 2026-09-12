"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { CheckCircle2 } from "lucide-react"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { MANUAL_CARD_INVOICE_THANK_YOU } from "@/lib/manual-card-invoice"

const ORDERS_KEY = "tetrava_orders_v1"

type StoredOrder = {
  id: string
  display_id?: number
  email?: string
  total?: number
  items?: Array<{
    title: string
    variantTitle?: string
    quantity: number
    unitPrice: number
  }>
}

function readStoredOrder(orderId: string): StoredOrder | null {
  if (typeof window === "undefined" || !orderId) return null
  try {
    const raw = window.localStorage.getItem(ORDERS_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as StoredOrder[]
    return parsed.find((order) => order.id === orderId) || null
  } catch {
    return null
  }
}

export function CheckoutThankYouContent() {
  const params = useSearchParams()
  const orderId = params.get("order") || params.get("order_id") || ""
  const displayId = params.get("display_id") || ""
  const totalParam = params.get("total") || ""

  const [stored, setStored] = useState<StoredOrder | null>(null)

  useEffect(() => {
    setStored(readStoredOrder(orderId))
  }, [orderId])
  const label = displayId
    ? `Order #${displayId}`
    : stored?.display_id
      ? `Order #${stored.display_id}`
      : orderId
        ? orderId
        : "Your order"
  const total =
    totalParam && !Number.isNaN(Number(totalParam))
      ? Number(totalParam)
      : typeof stored?.total === "number"
        ? stored.total
        : null
  const items = stored?.items || []

  return (
    <section className="page-container mx-auto max-w-xl space-y-6 py-8 sm:py-12">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Checkout", href: "/checkout" },
          { label: "Order received" }
        ]}
        includeSchema={false}
      />

      <div className="card overflow-hidden">
        <div className="bg-gradient-to-br from-[#F0FDFA] to-white px-6 py-10 text-center sm:px-8">
          <CheckCircle2 className="mx-auto h-14 w-14 text-[#059669]" aria-hidden />
          <h1 className="mt-5 font-serif text-2xl text-[#0F172A] sm:text-3xl">Order received</h1>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-[#475569]">
            {MANUAL_CARD_INVOICE_THANK_YOU}
          </p>
        </div>

        <div className="space-y-4 border-t border-[#E2E8F0] px-6 py-6 sm:px-8">
          <p className="text-sm text-[#0F172A]">
            {label}
            {total != null ? (
              <span className="block mt-1 tabular-nums text-[#475569]">
                Total ${total.toFixed(2)} USD
              </span>
            ) : null}
          </p>
          {items.length ? (
            <ul className="space-y-2 text-sm text-[#475569]">
              {items.map((item, index) => (
                <li key={`${item.title}-${index}`} className="flex justify-between gap-3">
                  <span>
                    {item.title}
                    {item.variantTitle ? ` · ${item.variantTitle}` : ""} × {item.quantity}
                  </span>
                  <span className="tabular-nums">
                    ${(item.unitPrice * item.quantity).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
          ) : null}
          <p className="text-xs leading-relaxed text-[#64748B]">
            Place order does not charge you at checkout. Your payment link arrives by email.
          </p>
          {orderId ? (
            <p className="text-xs text-[#94A3B8]">
              Reference: <span className="font-mono text-[#64748B]">{orderId}</span>
            </p>
          ) : null}
          <Link href="/orders" className="btn-primary block w-full py-3 text-center">
            View orders
          </Link>
          <Link href="/shop" className="btn-secondary block w-full py-3 text-center">
            Continue shopping
          </Link>
        </div>
      </div>
    </section>
  )
}
