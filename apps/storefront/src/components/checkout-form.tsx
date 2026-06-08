"use client"

import { FormEvent, useState } from "react"
import { useCart } from "@/components/cart-provider"

type CheckoutOrder = {
  id: string
  created_at: string
  email: string
  shipping_country: string
  total: number
  items: Array<{
    title: string
    variantTitle: string
    quantity: number
    unitPrice: number
  }>
}

const ORDERS_KEY = "tetrava_orders_v1"

export function CheckoutForm() {
  const { items, subtotal, clear } = useCart()
  const [email, setEmail] = useState("")
  const [country, setCountry] = useState("")
  const [ruoAck, setRuoAck] = useState(false)
  const [status, setStatus] = useState("")

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!ruoAck) {
      setStatus("Please acknowledge RUO requirements before checkout.")
      return
    }
    if (!items.length) {
      setStatus("Cart is empty.")
      return
    }

    const orderId = `draft_${Date.now()}`
    const payload = {
      order_id: orderId,
      disclaimer_version: "v1",
      acknowledged_at: new Date().toISOString(),
      shipping_country: country,
      ip_country: null
    }

    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_MEDUSA_URL || "http://localhost:9000"}/store/compliance/acknowledge`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(payload)
        }
      )
    } catch {
      // Keep checkout resilient in development when Medusa is offline.
    }

    const order: CheckoutOrder = {
      id: orderId,
      created_at: new Date().toISOString(),
      email,
      shipping_country: country,
      total: subtotal,
      items: items.map((item) => ({
        title: item.title,
        variantTitle: item.variantTitle,
        quantity: item.quantity,
        unitPrice: item.unitPrice
      }))
    }

    const raw = window.localStorage.getItem(ORDERS_KEY)
    const parsed = raw ? (JSON.parse(raw) as CheckoutOrder[]) : []
    parsed.unshift(order)
    window.localStorage.setItem(ORDERS_KEY, JSON.stringify(parsed))
    clear()
    setStatus(`Order recorded: ${orderId}`)
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-lg border border-white/10 bg-[#0A0A10] p-5">
      <div>
        <label className="block text-xs text-[#8A8AA0]">Email</label>
        <input
          required
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="mt-1 w-full rounded border border-white/20 bg-[#050508] px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-xs text-[#8A8AA0]">Shipping Country</label>
        <input
          required
          value={country}
          onChange={(event) => setCountry(event.target.value.toUpperCase())}
          placeholder="US"
          className="mt-1 w-full rounded border border-white/20 bg-[#050508] px-3 py-2"
        />
      </div>
      <label className="flex items-start gap-2 text-sm text-[#8A8AA0]">
        <input
          checked={ruoAck}
          onChange={(event) => setRuoAck(event.target.checked)}
          type="checkbox"
          className="mt-1"
        />
        I confirm these compounds are for research use only and not for human consumption.
      </label>
      <p className="text-sm text-[#E8E8F0]">Subtotal: ${subtotal.toFixed(2)}</p>
      <button className="rounded bg-[#5EEAD4] px-4 py-2 text-sm font-medium text-[#050508]">
        Place Research Order
      </button>
      {status ? <p className="text-xs text-[#8A8AA0]">{status}</p> : null}
    </form>
  )
}
