"use client"

import { FormEvent, useState } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/components/cart-provider"

type CheckoutOrder = {
  id: string
  display_id?: number
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
  const router = useRouter()
  const { items, subtotal, clear } = useCart()
  const [email, setEmail] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [address1, setAddress1] = useState("")
  const [city, setCity] = useState("")
  const [postalCode, setPostalCode] = useState("")
  const [country, setCountry] = useState("")
  const [ruoAck, setRuoAck] = useState(false)
  const [status, setStatus] = useState("")
  const [error, setError] = useState("")
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError("")
    setStatus("")

    if (!ruoAck) {
      setError("Please acknowledge RUO requirements before checkout.")
      return
    }
    if (!items.length) {
      setError("Cart is empty.")
      return
    }

    setLoading(true)
    let orderId = `draft_${Date.now()}`
    let displayId: number | undefined
    let orderTotal = subtotal

    try {
      const checkoutResponse = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email,
          firstName,
          lastName,
          address1,
          city,
          postalCode,
          country,
          items: items.map((item) => ({
            variantId: item.variantId,
            quantity: item.quantity
          }))
        })
      })
      const checkoutJson = await checkoutResponse.json()
      if (!checkoutJson?.ok) {
        setError(checkoutJson?.message || "Checkout failed. Is Medusa running and bootstrapped?")
        setLoading(false)
        return
      }
      orderId = checkoutJson.order_id
      displayId = checkoutJson.display_id
      if (typeof checkoutJson.total === "number" && checkoutJson.total > 0) {
        orderTotal = checkoutJson.total
      }
    } catch {
      setError("Could not reach checkout API.")
      setLoading(false)
      return
    }

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
      // Non-blocking in development.
    }

    try {
      const intentResponse = await fetch(
        `${process.env.NEXT_PUBLIC_MEDUSA_URL || "http://localhost:9000"}/store/payments/crypto-intent`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            order_id: orderId,
            email,
            amount_usd: orderTotal,
            currency: "USD"
          })
        }
      )
      const intentJson = await intentResponse.json()
      if (intentJson?.provider_url) {
        setCheckoutUrl(intentJson.provider_url)
      }
    } catch {
      // Crypto intent is optional until BTCPay is configured.
    }

    const order: CheckoutOrder = {
      id: orderId,
      display_id: displayId,
      created_at: new Date().toISOString(),
      email,
      shipping_country: country,
      total: orderTotal,
      items: items.map((item) => ({
        title: item.title,
        variantTitle: item.variantTitle,
        quantity: item.quantity,
        unitPrice: item.unitPrice
      }))
    }

    const raw = window.localStorage.getItem(ORDERS_KEY)
    let parsed: CheckoutOrder[] = []
    if (raw) {
      try {
        parsed = JSON.parse(raw) as CheckoutOrder[]
      } catch {
        parsed = []
      }
    }
    parsed.unshift(order)
    window.localStorage.setItem(ORDERS_KEY, JSON.stringify(parsed))

    try {
      await fetch("/api/orders/notify", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, orderId, total: orderTotal })
      })
    } catch {
      // Email is optional until Resend is configured.
    }

    clear()
    const label = displayId ? `#${displayId}` : orderId
    setStatus(`Order placed: ${label}`)
    setLoading(false)
    router.push("/orders")
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-lg border border-white/10 bg-[#0A0A10] p-5">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="block text-xs text-[#8A8AA0]">First name</label>
          <input
            required
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            className="mt-1 w-full rounded border border-white/20 bg-[#050508] px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-xs text-[#8A8AA0]">Last name</label>
          <input
            required
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            className="mt-1 w-full rounded border border-white/20 bg-[#050508] px-3 py-2"
          />
        </div>
      </div>
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
        <label className="block text-xs text-[#8A8AA0]">Address</label>
        <input
          required
          value={address1}
          onChange={(event) => setAddress1(event.target.value)}
          className="mt-1 w-full rounded border border-white/20 bg-[#050508] px-3 py-2"
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="block text-xs text-[#8A8AA0]">City</label>
          <input
            required
            value={city}
            onChange={(event) => setCity(event.target.value)}
            className="mt-1 w-full rounded border border-white/20 bg-[#050508] px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-xs text-[#8A8AA0]">Postal code</label>
          <input
            required
            value={postalCode}
            onChange={(event) => setPostalCode(event.target.value)}
            className="mt-1 w-full rounded border border-white/20 bg-[#050508] px-3 py-2"
          />
        </div>
      </div>
      <div>
        <label className="block text-xs text-[#8A8AA0]">Shipping country</label>
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
      <button
        disabled={loading}
        className="rounded bg-[#5EEAD4] px-4 py-2 text-sm font-medium text-[#050508] disabled:opacity-60"
      >
        {loading ? "Placing order..." : "Place Research Order"}
      </button>
      {error ? <p className="text-xs text-[#F87171]">{error}</p> : null}
      {status ? <p className="text-xs text-[#8A8AA0]">{status}</p> : null}
      {checkoutUrl ? (
        <a href={checkoutUrl} target="_blank" rel="noreferrer" className="block text-xs text-[#5EEAD4]">
          Continue to crypto payment
        </a>
      ) : null}
    </form>
  )
}
