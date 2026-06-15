"use client"

import { FormEvent, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/components/cart-provider"
import { readAuthToken, retrieveCustomer } from "@/lib/medusa-auth"
import { getMedusaStoreHeaders, getMedusaStoreUrl } from "@/lib/medusa-headers"
import { storePaymentUrl } from "@/components/payment-confirmation"

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
const DEFAULT_SHIPPING_USD = 15

type CryptoOption = {
  asset: string
  label: string
  provider: string
}

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
  const [restrictedCountries, setRestrictedCountries] = useState<string[]>([])
  const [cryptoOptions, setCryptoOptions] = useState<CryptoOption[]>([])
  const [selectedAsset, setSelectedAsset] = useState("BTC")

  useEffect(() => {
    void fetch("/api/compliance/restricted-countries")
      .then((response) => response.json())
      .then((data) => {
        if (data?.ok && Array.isArray(data.countries)) {
          setRestrictedCountries(data.countries)
        }
      })
      .catch(() => {
        // Server-side checkout still enforces restrictions.
      })
  }, [])

  useEffect(() => {
    void fetch(getMedusaStoreUrl("/store/payments/crypto-options"), {
      headers: getMedusaStoreHeaders()
    })
      .then((response) => response.json())
      .then((data) => {
        if (data?.ok && Array.isArray(data.assets) && data.assets.length) {
          setCryptoOptions(data.assets)
          const preferred = data.assets.find((item: CryptoOption) => item.asset === "BTC")
          setSelectedAsset(preferred?.asset || data.assets[0].asset)
        }
      })
      .catch(() => {
        // Falls back to BTC-only when Medusa is unreachable.
      })
  }, [])

  useEffect(() => {
    void retrieveCustomer().then((customer) => {
      if (!customer) return
      if (customer.email) setEmail(customer.email)
      if (customer.first_name) setFirstName(customer.first_name)
      if (customer.last_name) setLastName(customer.last_name)
    })
  }, [])

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

    const normalizedCountry = country.trim().toUpperCase()
    if (restrictedCountries.includes(normalizedCountry)) {
      setError(`Shipping to ${normalizedCountry} is restricted under our compliance policy.`)
      return
    }

    setLoading(true)
    let orderId = `draft_${Date.now()}`
    let displayId: number | undefined
    let orderTotal = subtotal + DEFAULT_SHIPPING_USD
    let paymentUrl: string | null = null
    let paymentProvider: string | null = null

    try {
      const authToken = readAuthToken()
      const checkoutResponse = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...(authToken ? { authorization: `Bearer ${authToken}` } : {})
        },
        body: JSON.stringify({
          email,
          firstName,
          lastName,
          address1,
          city,
          postalCode,
          country,
          crypto_asset: selectedAsset,
          items: items.map((item) => ({
            variantId: item.variantId,
            quantity: item.quantity,
            title: item.title,
            variantTitle: item.variantTitle,
            unitPrice: item.unitPrice
          }))
        })
      })
      const checkoutJson = await checkoutResponse.json()
      if (!checkoutJson?.ok) {
        if (checkoutJson?.code === "shipping_restricted") {
          router.push("/shipping-restricted")
          setLoading(false)
          return
        }
        setError(checkoutJson?.message || "Checkout failed. Is Medusa running and bootstrapped?")
        setLoading(false)
        return
      }
      orderId = checkoutJson.order_id
      displayId = checkoutJson.display_id
      if (typeof checkoutJson.total === "number" && checkoutJson.total > 0) {
        orderTotal = checkoutJson.total
      }
      if (checkoutJson.payment_url) {
        paymentUrl = checkoutJson.payment_url
      }
      if (checkoutJson.payment_provider) {
        paymentProvider = checkoutJson.payment_provider
      }
      if (checkoutJson.payment_error && !checkoutJson.payment_url) {
        setStatus(checkoutJson.payment_error)
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
      if (!paymentUrl) {
        const intentResponse = await fetch(getMedusaStoreUrl("/store/payments/crypto-intent"), {
          method: "POST",
          headers: getMedusaStoreHeaders({ "content-type": "application/json" }),
          body: JSON.stringify({
            order_id: orderId,
            email,
            amount_usd: orderTotal,
            currency: "USD",
            crypto_asset: selectedAsset
          })
        })
        const intentJson = await intentResponse.json()
        if (intentJson?.provider_url) {
          paymentUrl = intentJson.provider_url
          setCheckoutUrl(intentJson.provider_url)
        }
        if (intentJson?.provider === "paymento" && intentJson?.provider_url) {
          storePaymentUrl(orderId, intentJson.provider_url)
          clear()
          setLoading(false)
          window.location.assign(intentJson.provider_url)
          return
        }
      } else if (paymentProvider === "paymento" && paymentUrl) {
        storePaymentUrl(orderId, paymentUrl)
        clear()
        setLoading(false)
        window.location.assign(paymentUrl)
        return
      }
    } catch {
      // Crypto intent fallback when checkout API did not return a payment URL.
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

    clear()
    setLoading(false)

    if (paymentUrl) {
      storePaymentUrl(orderId, paymentUrl)
    }

    const params = new URLSearchParams({
      order_id: orderId,
      total: orderTotal.toFixed(2)
    })
    if (displayId) params.set("display_id", String(displayId))

    router.push(`/checkout/payment?${params.toString()}`)
  }

  return (
    <form onSubmit={onSubmit} className="card space-y-4 p-5">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="block text-xs text-[#475569]">First name</label>
          <input
            required
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            className="input-field mt-1"
          />
        </div>
        <div>
          <label className="block text-xs text-[#475569]">Last name</label>
          <input
            required
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            className="input-field mt-1"
          />
        </div>
      </div>
      <div>
        <label className="block text-xs text-[#475569]">Email</label>
        <input
          required
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="input-field mt-1"
        />
      </div>
      <div>
        <label className="block text-xs text-[#475569]">Address</label>
        <input
          required
          value={address1}
          onChange={(event) => setAddress1(event.target.value)}
          className="input-field mt-1"
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="block text-xs text-[#475569]">City</label>
          <input
            required
            value={city}
            onChange={(event) => setCity(event.target.value)}
            className="input-field mt-1"
          />
        </div>
        <div>
          <label className="block text-xs text-[#475569]">Postal code</label>
          <input
            required
            value={postalCode}
            onChange={(event) => setPostalCode(event.target.value)}
            className="input-field mt-1"
          />
        </div>
      </div>
      <div>
        <label className="block text-xs text-[#475569]">Shipping country</label>
        <input
          required
          value={country}
          onChange={(event) => setCountry(event.target.value.toUpperCase())}
          placeholder="US"
          className="input-field mt-1"
        />
      </div>
      <label className="flex items-start gap-2 text-sm text-[#475569]">
        <input
          checked={ruoAck}
          onChange={(event) => setRuoAck(event.target.checked)}
          type="checkbox"
          className="mt-1"
        />
        I confirm these compounds are for research use only and not for human consumption.
      </label>
      <p className="text-sm text-[#0F172A]">Subtotal: ${subtotal.toFixed(2)}</p>
      <p className="text-sm text-[#475569]">Estimated shipping: ${DEFAULT_SHIPPING_USD.toFixed(2)}</p>
      <p className="text-sm font-medium text-[#0F172A]">
        Estimated total: ${(subtotal + DEFAULT_SHIPPING_USD).toFixed(2)}
      </p>
      {cryptoOptions.length > 0 ? (
        <div>
          <label className="block text-xs text-[#475569]">Pay with cryptocurrency</label>
          <select
            value={selectedAsset}
            onChange={(event) => setSelectedAsset(event.target.value)}
            className="input-field mt-1 text-sm"
          >
            {cryptoOptions.map((option) => (
              <option key={option.asset} value={option.asset}>
                {option.label}
                {option.provider === "btcpay" ? " (BTCPay)" : option.provider === "paymento" ? " (Paymento)" : ""}
              </option>
            ))}
          </select>
        </div>
      ) : null}
      <button disabled={loading} className="btn-primary disabled:opacity-60">
        {loading ? "Placing order..." : "Place Research Order"}
      </button>
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
      {status ? <p className="text-xs text-[#475569]">{status}</p> : null}
      {checkoutUrl ? (
        <a href={checkoutUrl} target="_blank" rel="noreferrer" className="block text-xs text-[#0D9488]">
          Continue to crypto payment
        </a>
      ) : null}
    </form>
  )
}
