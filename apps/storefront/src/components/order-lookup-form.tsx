"use client"

import { FormEvent, useState } from "react"

export type LookupOrder = {
  id: string
  display_id?: number
  created_at: string
  total: number
  status?: string
  currency_code?: string
  email?: string
  shipping_country?: string
  source: "lookup" | "local" | "medusa"
  items?: Array<{
    id?: string
    title?: string
    quantity?: number
    product?: { handle?: string; title?: string } | null
    variant?: { title?: string } | null
  }> | null
}

type Props = {
  onFound: (order: LookupOrder) => void
}

export function OrderLookupForm({ onFound }: Props) {
  const [email, setEmail] = useState("")
  const [displayId, setDisplayId] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError("")
    setLoading(true)

    try {
      const params = new URLSearchParams({
        email: email.trim(),
        display_id: displayId.trim()
      })
      const response = await fetch(`/api/orders/lookup?${params.toString()}`)
      const data = await response.json()
      if (!response.ok || !data.ok) {
        setError(data.message || "Order not found. Check your email and order number.")
        return
      }

      onFound({
        id: data.order.id,
        display_id: data.order.display_id,
        created_at: data.order.created_at,
        total: (data.order.total || 0) / 100,
        status: data.order.status,
        currency_code: data.order.currency_code,
        email: data.order.email,
        source: "lookup"
      })
    } catch {
      setError("Could not look up order. Try again in a moment.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="card space-y-3 p-4">
      <p className="text-sm font-medium text-[#0F172A]">Find a guest order</p>
      <p className="text-xs text-[#475569]">
        Enter the email used at checkout and your order number from the confirmation email.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="block text-xs text-[#475569]">Email</label>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field mt-1"
          />
        </div>
        <div>
          <label className="block text-xs text-[#475569]">Order number</label>
          <input
            required
            inputMode="numeric"
            value={displayId}
            onChange={(e) => setDisplayId(e.target.value)}
            placeholder="e.g. 30"
            className="input-field mt-1"
          />
        </div>
      </div>
      <button type="submit" disabled={loading} className="btn-secondary text-sm disabled:opacity-60">
        {loading ? "Looking up..." : "Look up order"}
      </button>
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </form>
  )
}
