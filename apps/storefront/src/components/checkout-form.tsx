"use client"

import { FormEvent, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Bitcoin, CreditCard, Lock, ShieldCheck } from "lucide-react"
import { useCart } from "@/components/cart-provider"
import { readAuthToken, retrieveCustomer } from "@/lib/medusa-auth"
import { getMedusaStoreHeaders } from "@/lib/medusa-headers"
import {
  CHECKOUT_CRYPTO_CATALOG,
  loadCheckoutPaymentOptions,
  type CheckoutCryptoOption
} from "@/lib/checkout-payment-options"
import { CHECKOUT_COUNTRIES } from "@/lib/checkout-countries"
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

type PaymentMethod = "card" | "crypto"

const ORDERS_KEY = "tetrava_orders_v1"
const DEFAULT_SHIPPING_USD = 15

function methodCardClass(selected: boolean) {
  return [
    "relative flex w-full cursor-pointer items-start gap-3 rounded-xl border p-4 text-left transition-all",
    "focus-within:ring-2 focus-within:ring-[#0D9488]/30",
    selected
      ? "border-[#0D9488] bg-[#F0FDFA] shadow-[0_0_0_1px_#0D9488]"
      : "border-[#E2E8F0] bg-white hover:border-[#CBD5E1] hover:bg-[#F8FAFC]"
  ].join(" ")
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
  const [country, setCountry] = useState("US")
  const [ruoAck, setRuoAck] = useState(false)
  const [status, setStatus] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [restrictedCountries, setRestrictedCountries] = useState<string[]>([])
  const [cardAvailable, setCardAvailable] = useState(false)
  const [cryptoLive, setCryptoLive] = useState(false)
  const [cryptoOptions, setCryptoOptions] = useState<CheckoutCryptoOption[]>(CHECKOUT_CRYPTO_CATALOG)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card")
  const [selectedAsset, setSelectedAsset] = useState("BTC")

  const estimatedTotal = subtotal + DEFAULT_SHIPPING_USD

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
    const medusaUrl = (process.env.NEXT_PUBLIC_MEDUSA_URL || "http://localhost:9000").replace(/\/$/, "")
    void loadCheckoutPaymentOptions(fetch, medusaUrl, getMedusaStoreHeaders()).then((options) => {
      setCardAvailable(options.cardAvailable)
      setCryptoLive(options.cryptoLive)
      setCryptoOptions(options.cryptoOptions)

      const preferred = options.cryptoOptions.find((item) => item.asset === "BTC")
      if (preferred) setSelectedAsset(preferred.asset)
      else if (options.cryptoOptions[0]?.asset) setSelectedAsset(options.cryptoOptions[0].asset)

      if (!options.cardAvailable) {
        setPaymentMethod("crypto")
      }
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

  const availableCountries = useMemo(
    () => CHECKOUT_COUNTRIES.filter((entry) => !restrictedCountries.includes(entry.code)),
    [restrictedCountries]
  )

  const submitLabel = useMemo(() => {
    if (loading) return "Processing…"
    if (paymentMethod === "card") return `Pay $${estimatedTotal.toFixed(2)} with card`
    return "Continue to crypto payment"
  }, [estimatedTotal, loading, paymentMethod])

  const persistLocalOrder = (order: CheckoutOrder) => {
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
  }

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
    if (paymentMethod === "card" && !cardAvailable) {
      setError("Card checkout is temporarily unavailable. Please pay with cryptocurrency.")
      return
    }
    if (paymentMethod === "crypto" && !cryptoLive) {
      setError(
        "Cryptocurrency checkout is not available right now. Use card payment, or try again once BTCPay/Paymento is configured on the server."
      )
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
    let orderTotal = estimatedTotal
    let paymentUrl: string | null = null
    let paymentProvider: string | null = null
    let resolvedPaymentMethod: PaymentMethod = paymentMethod

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
          payment_method: paymentMethod,
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
      if (checkoutJson.payment_method === "crypto" || checkoutJson.payment_method === "card") {
        resolvedPaymentMethod = checkoutJson.payment_method
      }
      if (checkoutJson.payment_error && !checkoutJson.payment_url) {
        setStatus(checkoutJson.payment_error)
      }
    } catch {
      setError("Could not reach checkout API.")
      setLoading(false)
      return
    }

    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_MEDUSA_URL || "http://localhost:9000"}/store/compliance/acknowledge`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            order_id: orderId,
            disclaimer_version: "v1",
            acknowledged_at: new Date().toISOString(),
            shipping_country: country,
            ip_country: null
          })
        }
      )
    } catch {
      // Non-blocking in development.
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

    persistLocalOrder(order)
    clear()

    if (paymentUrl && (paymentProvider === "peptidepay" || resolvedPaymentMethod === "card")) {
      storePaymentUrl(orderId, paymentUrl)
      window.location.assign(paymentUrl)
      return
    }

    if (paymentUrl && paymentProvider === "paymento") {
      storePaymentUrl(orderId, paymentUrl)
      window.location.assign(paymentUrl)
      return
    }

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
    <form onSubmit={onSubmit} className="card overflow-hidden">
      <div className="border-b border-[#E2E8F0] bg-gradient-to-br from-[#F0FDFA] to-white px-4 py-5 sm:px-6">
        <h2 className="font-serif text-xl text-[#0F172A] sm:text-2xl">Shipping &amp; payment</h2>
        <p className="mt-1 text-sm text-[#475569]">
          Secure checkout · encrypted connection
        </p>
        <div className="mt-3 flex flex-wrap gap-3 text-xs text-[#64748B]">
          <span className="inline-flex items-center gap-1">
            <Lock className="h-3.5 w-3.5 text-[#0D9488]" aria-hidden />
            SSL secured
          </span>
          <span className="inline-flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5 text-[#0D9488]" aria-hidden />
            RUO compliance recorded
          </span>
        </div>
      </div>

      <div className="space-y-6 p-4 sm:p-6">
        <fieldset className="space-y-3">
          <legend className="text-sm font-medium text-[#0F172A]">Contact &amp; shipping</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="checkout-first-name" className="block text-xs font-medium text-[#475569]">
                First name
              </label>
              <input
                id="checkout-first-name"
                required
                autoComplete="given-name"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                className="input-field mt-1.5"
              />
            </div>
            <div>
              <label htmlFor="checkout-last-name" className="block text-xs font-medium text-[#475569]">
                Last name
              </label>
              <input
                id="checkout-last-name"
                required
                autoComplete="family-name"
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                className="input-field mt-1.5"
              />
            </div>
          </div>
          <div>
            <label htmlFor="checkout-email" className="block text-xs font-medium text-[#475569]">
              Email
            </label>
            <input
              id="checkout-email"
              required
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="input-field mt-1.5"
            />
          </div>
          <div>
            <label htmlFor="checkout-address" className="block text-xs font-medium text-[#475569]">
              Street address
            </label>
            <input
              id="checkout-address"
              required
              autoComplete="street-address"
              value={address1}
              onChange={(event) => setAddress1(event.target.value)}
              className="input-field mt-1.5"
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="checkout-city" className="block text-xs font-medium text-[#475569]">
                City
              </label>
              <input
                id="checkout-city"
                required
                autoComplete="address-level2"
                value={city}
                onChange={(event) => setCity(event.target.value)}
                className="input-field mt-1.5"
              />
            </div>
            <div>
              <label htmlFor="checkout-postal" className="block text-xs font-medium text-[#475569]">
                Postal code
              </label>
              <input
                id="checkout-postal"
                required
                autoComplete="postal-code"
                value={postalCode}
                onChange={(event) => setPostalCode(event.target.value)}
                className="input-field mt-1.5"
              />
            </div>
          </div>
          <div>
            <label htmlFor="checkout-country" className="block text-xs font-medium text-[#475569]">
              Country
            </label>
            <select
              id="checkout-country"
              required
              autoComplete="country"
              value={country}
              onChange={(event) => setCountry(event.target.value)}
              className="input-field mt-1.5"
            >
              {availableCountries.map((entry) => (
                <option key={entry.code} value={entry.code}>
                  {entry.name}
                </option>
              ))}
            </select>
          </div>
        </fieldset>

        <fieldset className="space-y-3">
          <legend className="text-sm font-medium text-[#0F172A]">Payment method</legend>
          <p className="text-xs leading-relaxed text-[#64748B]">
            Card is the fastest option. Choose crypto below for Bitcoin (BTCPay) or other assets (Paymento).
          </p>

          {cardAvailable ? (
            <label className={methodCardClass(paymentMethod === "card")}>
              <input
                type="radio"
                name="payment_method"
                value="card"
                checked={paymentMethod === "card"}
                onChange={() => setPaymentMethod("card")}
                className="mt-1 h-4 w-4 shrink-0 accent-[#0D9488]"
              />
              <span className="flex min-w-0 flex-1 flex-col gap-1">
                <span className="flex flex-wrap items-center gap-2 text-sm font-medium text-[#0F172A]">
                  <CreditCard className="h-4 w-4 text-[#0D9488]" aria-hidden />
                  Credit or debit card
                  <span className="rounded-full bg-[#0D9488]/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#0F766E]">
                    Recommended
                  </span>
                </span>
                <span className="text-xs leading-relaxed text-[#64748B]">
                  Visa, Mastercard, Amex, Apple Pay &amp; Google Pay via secure hosted checkout.
                </span>
              </span>
            </label>
          ) : null}

          <label className={methodCardClass(paymentMethod === "crypto")}>
            <input
              type="radio"
              name="payment_method"
              value="crypto"
              checked={paymentMethod === "crypto"}
              onChange={() => setPaymentMethod("crypto")}
              className="mt-1 h-4 w-4 shrink-0 accent-[#0D9488]"
            />
            <span className="flex min-w-0 flex-1 flex-col gap-1">
              <span className="flex items-center gap-2 text-sm font-medium text-[#0F172A]">
                <Bitcoin className="h-4 w-4 text-[#D97706]" aria-hidden />
                Pay with cryptocurrency
              </span>
              <span className="text-xs leading-relaxed text-[#64748B]">
                Bitcoin via BTCPay · USDT, ETH, SOL and more via Paymento.
              </span>
            </span>
          </label>

          {paymentMethod === "crypto" ? (
            <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
              <label htmlFor="checkout-crypto-asset" className="block text-xs font-medium text-[#475569]">
                Select asset
              </label>
              <select
                id="checkout-crypto-asset"
                value={selectedAsset}
                onChange={(event) => setSelectedAsset(event.target.value)}
                className="input-field mt-2 text-sm"
              >
                {cryptoOptions.map((option) => (
                  <option key={option.asset} value={option.asset}>
                    {option.label}
                    {option.provider === "btcpay" ? " · BTCPay" : option.provider === "paymento" ? " · Paymento" : ""}
                  </option>
                ))}
              </select>
              {!cryptoLive ? (
                <p className="mt-2 text-xs text-amber-700">
                  Crypto gateways are not connected in this environment yet. Production checkout uses live
                  BTCPay and Paymento.
                </p>
              ) : null}
            </div>
          ) : null}
        </fieldset>

        <label className="flex items-start gap-3 rounded-xl border border-[#E2E8F0] bg-[#FFFBEB]/60 p-4 text-sm leading-relaxed text-[#475569]">
          <input
            checked={ruoAck}
            onChange={(event) => setRuoAck(event.target.checked)}
            type="checkbox"
            className="mt-0.5 h-4 w-4 shrink-0 rounded accent-[#0D9488]"
          />
          I confirm these compounds are for research use only and not for human consumption.
        </label>

        <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
          <div className="flex items-center justify-between text-sm text-[#475569]">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-sm text-[#475569]">
            <span>Shipping Fee</span>
            <span>${DEFAULT_SHIPPING_USD.toFixed(2)}</span>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-[#E2E8F0] pt-3">
            <span className="text-sm font-medium text-[#0F172A]">Estimated total</span>
            <span className="font-serif text-xl text-[#0F172A]">${estimatedTotal.toFixed(2)}</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !items.length}
          className="btn-primary w-full py-3.5 text-base disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitLabel}
        </button>

        {error ? (
          <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
            {error}
          </p>
        ) : null}
        {status ? <p className="text-sm text-[#475569]">{status}</p> : null}
      </div>
    </form>
  )
}
