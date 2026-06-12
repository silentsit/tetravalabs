"use client"

import { useEffect, useState } from "react"
import { sdk } from "@/lib/medusa-client"

type StoredOrder = {
  id: string
  display_id?: number
  created_at: string
  total: number
  shipping_country: string
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

export function OrdersList() {
  const [localOrders, setLocalOrders] = useState<StoredOrder[]>([])
  const [medusaOrders, setMedusaOrders] = useState<MedusaOrder[]>([])
  const [paymentByOrder, setPaymentByOrder] = useState<Record<string, PaymentStatus>>({})
  const [source, setSource] = useState<"loading" | "medusa" | "local">("loading")

  useEffect(() => {
    const load = async () => {
      try {
        const { orders } = await sdk.store.order.list({ limit: 20 })
        if (orders?.length) {
          setMedusaOrders(orders)
          setSource("medusa")

          const statuses: Record<string, PaymentStatus> = {}
          await Promise.all(
            orders.map(async (order) => {
              const status = await fetchPaymentStatus(order.id)
              if (status) statuses[order.id] = status
            })
          )
          setPaymentByOrder(statuses)
          return
        }
      } catch {
        // Fall back to guest/local orders when not authenticated.
      }

      const raw = window.localStorage.getItem(ORDERS_KEY)
      if (!raw) {
        setSource("local")
        return
      }

      let parsed: StoredOrder[] = []
      try {
        parsed = JSON.parse(raw)
      } catch {
        parsed = []
      }
      setLocalOrders(parsed)
      setSource("local")

      const statuses: Record<string, PaymentStatus> = {}
      await Promise.all(
        parsed.map(async (order) => {
          const status = await fetchPaymentStatus(order.id)
          if (status) statuses[order.id] = status
        })
      )
      setPaymentByOrder(statuses)
    }

    void load()
  }, [])

  if (source === "loading") {
    return <p className="text-sm text-[#475569]">Loading orders...</p>
  }

  if (source === "medusa") {
    return (
      <ul className="space-y-3">
        {medusaOrders.map((order) => {
          const payment = paymentByOrder[order.id]
          return (
            <li key={order.id} className="card p-4">
              <p className="text-sm text-[#0F172A]">
                Order {order.display_id ? `#${order.display_id}` : order.id}
              </p>
              <p className="text-xs text-[#475569]">
                {order.created_at ? new Date(order.created_at).toLocaleString() : "—"} ·{" "}
                {order.status || "pending"}
              </p>
              <p className="text-xs text-[#475569]">
                Total: ${((order.total || 0) / 100).toFixed(2)} {order.currency_code?.toUpperCase()}
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
    )
  }

  if (localOrders.length === 0) {
    return (
      <p className="text-sm text-[#475569]">
        No orders found. Sign in to view Medusa order history, or place a checkout order first.
      </p>
    )
  }

  return (
    <ul className="space-y-3">
      {localOrders.map((order) => {
        const payment = paymentByOrder[order.id]
        return (
          <li key={order.id} className="card p-4">
            <p className="text-sm text-[#0F172A]">
              {order.display_id ? `Order #${order.display_id}` : order.id}
            </p>
            <p className="text-xs text-[#475569]">
              {new Date(order.created_at).toLocaleString()} · {order.shipping_country}
            </p>
            <p className="text-xs text-[#475569]">Total: ${order.total.toFixed(2)}</p>
            <PaymentBadge status={payment?.status} payUrl={payment?.provider_url} />
          </li>
        )
      })}
    </ul>
  )
}
