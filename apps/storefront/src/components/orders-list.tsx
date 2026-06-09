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

const ORDERS_KEY = "tetrava_orders_v1"

export function OrdersList() {
  const [localOrders, setLocalOrders] = useState<StoredOrder[]>([])
  const [medusaOrders, setMedusaOrders] = useState<MedusaOrder[]>([])
  const [source, setSource] = useState<"loading" | "medusa" | "local">("loading")

  useEffect(() => {
    const load = async () => {
      try {
        const { orders } = await sdk.store.order.list({ limit: 20 })
        if (orders?.length) {
          setMedusaOrders(orders)
          setSource("medusa")
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
      try {
        setLocalOrders(JSON.parse(raw))
      } catch {
        setLocalOrders([])
      }
      setSource("local")
    }

    void load()
  }, [])

  if (source === "loading") {
    return <p className="text-sm text-[#8A8AA0]">Loading orders...</p>
  }

  if (source === "medusa") {
    return (
      <ul className="space-y-3">
        {medusaOrders.map((order) => (
          <li key={order.id} className="rounded-lg border border-white/10 bg-[#0A0A10] p-4">
            <p className="text-sm text-[#E8E8F0]">
              Order {order.display_id ? `#${order.display_id}` : order.id}
            </p>
            <p className="text-xs text-[#8A8AA0]">
              {order.created_at ? new Date(order.created_at).toLocaleString() : "—"} ·{" "}
              {order.status || "pending"}
            </p>
            <p className="text-xs text-[#8A8AA0]">
              Total: ${((order.total || 0) / 100).toFixed(2)} {order.currency_code?.toUpperCase()}
            </p>
          </li>
        ))}
      </ul>
    )
  }

  if (localOrders.length === 0) {
    return (
      <p className="text-sm text-[#8A8AA0]">
        No orders found. Sign in to view Medusa order history, or place a checkout order first.
      </p>
    )
  }

  return (
    <ul className="space-y-3">
      {localOrders.map((order) => (
        <li key={order.id} className="rounded-lg border border-white/10 bg-[#0A0A10] p-4">
          <p className="text-sm text-[#E8E8F0]">
            {order.display_id ? `Order #${order.display_id}` : order.id}
          </p>
          <p className="text-xs text-[#8A8AA0]">
            {new Date(order.created_at).toLocaleString()} · {order.shipping_country}
          </p>
          <p className="text-xs text-[#8A8AA0]">Total: ${order.total.toFixed(2)}</p>
        </li>
      ))}
    </ul>
  )
}
