"use client"

import { useEffect, useState } from "react"

type StoredOrder = {
  id: string
  created_at: string
  total: number
  shipping_country: string
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<StoredOrder[]>([])

  useEffect(() => {
    const raw = window.localStorage.getItem("tetrava_orders_v1")
    if (!raw) return
    try {
      setOrders(JSON.parse(raw))
    } catch {
      setOrders([])
    }
  }, [])

  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-semibold">Order History</h1>
      <p className="text-[#8A8AA0]">
        Past orders list with statuses, totals, and compliance acknowledgments.
      </p>
      {orders.length === 0 ? (
        <p className="text-sm text-[#8A8AA0]">No orders found.</p>
      ) : (
        <ul className="space-y-3">
          {orders.map((order) => (
            <li key={order.id} className="rounded-lg border border-white/10 bg-[#0A0A10] p-4">
              <p className="text-sm text-[#E8E8F0]">{order.id}</p>
              <p className="text-xs text-[#8A8AA0]">
                {new Date(order.created_at).toLocaleString()} - {order.shipping_country}
              </p>
              <p className="text-xs text-[#8A8AA0]">Total: ${order.total.toFixed(2)}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
