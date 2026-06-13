"use client"

import { useEffect, useMemo, useState } from "react"
import { sdk } from "@/lib/medusa-client"
import { OrderLookupForm, type LookupOrder } from "@/components/order-lookup-form"

type StoredOrder = {
  id: string
  display_id?: number
  created_at: string
  total: number
  shipping_country: string
  email?: string
}

type MedusaOrder = {
  id: string
  display_id?: number
  created_at?: string | Date
  total?: number
  currency_code?: string
  status?: string
}

type PaymentStatus = {
  status?: string
  provider_url?: string
}

const ORDERS_KEY = "tetrava_orders_v1"

async function fetchPaymentStatus(orderId: string): Promise<PaymentStatus | null> {
  try {
    const response = await fetch(`/api/payment-status?order_id=${encodeURIComponent(orderId)}`)
    if (!response.ok) return null
    const data = await response.json()
    if (!data.ok) return null
    return { status: data.status, provider_url: data.provider_url }
  } catch {
    return null
  }
}

function PaymentBadge({
  status,
  orderStatus,
  payUrl
}: {
  status?: string
  orderStatus?: string
  payUrl?: string
}) {
  const normalizedOrderStatus = orderStatus?.toLowerCase()
  const normalizedPaymentStatus = status?.toLowerCase()
  const isPaid =
    normalizedPaymentStatus === "completed" ||
    normalizedPaymentStatus === "paid" ||
    normalizedPaymentStatus === "settled" ||
    normalizedOrderStatus === "completed"

  const label = isPaid
    ? "Paid"
    : status
      ? `Payment: ${status}`
      : orderStatus
        ? `Order: ${orderStatus}`
        : null

  if (!label) return null

  return (
    <div className="mt-2 flex flex-wrap items-center gap-2">
      <span
        className={`rounded px-2 py-0.5 text-xs ${
          isPaid ? "bg-[#CCFBF1] text-[#0D9488]" : "bg-amber-100 text-amber-700"
        }`}
      >
        {label}
      </span>
      {!isPaid && payUrl && !payUrl.includes("example.com") ? (
        <a href={payUrl} className="text-xs text-[#0D9488] underline">
          Pay now
        </a>
      ) : null}
    </div>
  )
}

function mergeLookupOrder(order: LookupOrder): LookupOrder {
  return order
}

export function OrdersList() {
  const [localOrders, setLocalOrders] = useState<StoredOrder[]>([])
  const [medusaOrders, setMedusaOrders] = useState<MedusaOrder[]>([])
  const [lookedUp, setLookedUp] = useState<LookupOrder[]>([])
  const [paymentByOrder, setPaymentByOrder] = useState<Record<string, PaymentStatus>>({})
  const [source, setSource] = useState<"loading" | "ready">("loading")

  useEffect(() => {
    const load = async () => {
      try {
        const { orders } = await sdk.store.order.list({ limit: 20 })
        if (orders?.length) setMedusaOrders(orders)
      } catch {
        // Guest or unsigned — local + lookup still available.
      }

      const raw = window.localStorage.getItem(ORDERS_KEY)
      if (raw) {
        try {
          setLocalOrders(JSON.parse(raw) as StoredOrder[])
        } catch {
          setLocalOrders([])
        }
      }

      setSource("ready")
    }

    void load()
  }, [])

  const mergedOrders = useMemo(() => {
    const map = new Map<string, LookupOrder>()

    for (const order of medusaOrders) {
      map.set(order.id, {
        id: order.id,
        display_id: order.display_id,
        created_at: order.created_at ? String(order.created_at) : new Date().toISOString(),
        total: (order.total || 0) / 100,
        status: order.status,
        currency_code: order.currency_code,
        source: "medusa"
      })
    }

    for (const order of localOrders) {
      if (!map.has(order.id)) {
        map.set(order.id, {
          id: order.id,
          display_id: order.display_id,
          created_at: order.created_at,
          total: order.total,
          email: order.email,
          shipping_country: order.shipping_country,
          source: "local"
        })
      }
    }

    for (const order of lookedUp) {
      map.set(order.id, mergeLookupOrder(order))
    }

    return Array.from(map.values()).sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
  }, [localOrders, medusaOrders, lookedUp])

  useEffect(() => {
    if (!mergedOrders.length) return

    void (async () => {
      const statuses: Record<string, PaymentStatus> = {}
      await Promise.all(
        mergedOrders.map(async (order) => {
          const status = await fetchPaymentStatus(order.id)
          if (status) statuses[order.id] = status
        })
      )
      setPaymentByOrder(statuses)
    })()
  }, [mergedOrders])

  if (source === "loading") {
    return <p className="text-sm text-[#475569]">Loading orders...</p>
  }

  return (
    <div className="space-y-6">
      <OrderLookupForm
        onFound={(order) => {
          setLookedUp((prev) => {
            if (prev.some((item) => item.id === order.id)) return prev
            return [order, ...prev]
          })
        }}
      />

      {mergedOrders.length === 0 ? (
        <p className="text-sm text-[#475569]">
          No orders yet. Place a checkout order or look up a guest order with your email and order number.
        </p>
      ) : (
        <ul className="space-y-3">
          {mergedOrders.map((order) => {
            const payment = paymentByOrder[order.id]
            return (
              <li key={order.id} className="card p-4">
                <p className="text-sm text-[#0F172A]">
                  Order {order.display_id ? `#${order.display_id}` : order.id}
                </p>
                <p className="text-xs text-[#475569]">
                  {new Date(order.created_at).toLocaleString()}
                  {order.shipping_country ? ` · ${order.shipping_country}` : ""}
                  {order.status ? ` · ${order.status}` : ""}
                </p>
                <p className="text-xs text-[#475569]">
                  Total: ${order.total.toFixed(2)} {order.currency_code?.toUpperCase() || "USD"}
                </p>
                <PaymentBadge
                  status={payment?.status}
                  orderStatus={order.status}
                  payUrl={payment?.provider_url}
                />
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
