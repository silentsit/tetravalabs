"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"

const payUrlKey = (orderId: string) => `tetrava_pay_${orderId}`

type PaymentStatus = {
  status?: string
  provider_url?: string
  amount_usd?: number
}

export function PaymentConfirmation() {
  const params = useSearchParams()
  const orderId = params.get("order_id") || ""
  const displayId = params.get("display_id") || ""
  const total = params.get("total") || ""
  const [payUrl, setPayUrl] = useState("")
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null)

  useEffect(() => {
    if (!orderId) return

    const stored = sessionStorage.getItem(payUrlKey(orderId))
    if (stored) setPayUrl(stored)

    const loadStatus = async () => {
      try {
        const response = await fetch(`/api/payment-status?order_id=${encodeURIComponent(orderId)}`)
        if (!response.ok) return
        const data = await response.json()
        if (!data.ok) return
        setPaymentStatus({
          status: data.status,
          provider_url: data.provider_url,
          amount_usd: data.amount_usd
        })
        if (data.provider_url && !stored) {
          setPayUrl(data.provider_url)
          sessionStorage.setItem(payUrlKey(orderId), data.provider_url)
        }
      } catch {
        // Keep sessionStorage fallback when API is unavailable.
      }
    }

    void loadStatus()
  }, [orderId])

  const label = displayId ? `Order #${displayId}` : orderId
  const resolvedUrl = payUrl || paymentStatus?.provider_url || ""
  const amount =
    total || (paymentStatus?.amount_usd != null ? String(paymentStatus.amount_usd) : "")
  const isPaid =
    paymentStatus?.status === "paid" ||
    paymentStatus?.status === "settled" ||
    paymentStatus?.status === "completed"

  return (
    <section className="mx-auto max-w-xl space-y-6">
      <div>
        <p className="font-mono text-xs uppercase tracking-wider text-[#5EEAD4]">Payment</p>
        <h1 className="mt-4 text-3xl font-semibold text-[#E8E8F0]">
          {isPaid ? "Payment Received" : "Complete Crypto Payment"}
        </h1>
        <p className="mt-3 text-[#8A8AA0]">
          {label ? `${label} was created.` : "Your order was created."}{" "}
          {isPaid
            ? "Your crypto payment is confirmed. Fulfillment will begin shortly."
            : "Pay with crypto to confirm fulfillment."}
        </p>
      </div>
      <div className="space-y-4 rounded-xl border border-white/10 bg-[#0A0A10] p-6">
        {amount ? <p className="text-lg text-[#E8E8F0]">Amount due: ${Number(amount).toFixed(2)} USD</p> : null}
        {paymentStatus?.status ? (
          <p className="text-sm text-[#8A8AA0]">
            Payment status: <span className="text-[#E8E8F0]">{paymentStatus.status}</span>
          </p>
        ) : null}
        {!isPaid && resolvedUrl && !resolvedUrl.includes("example.com") ? (
          <a
            href={resolvedUrl}
            className="block w-full rounded-lg bg-[#5EEAD4] px-6 py-3 text-center text-sm font-medium text-[#050508]"
          >
            Pay with Crypto (BTCPay)
          </a>
        ) : !isPaid ? (
          <p className="text-sm text-[#FBBF24]">
            BTCPay is not configured yet. Your order is recorded; payment instructions will follow by email.
          </p>
        ) : null}
        <Link href="/orders" className="block text-center text-sm text-[#5EEAD4]">
          View order history
        </Link>
      </div>
      <p className="text-xs text-[#8A8AA0]">
        After payment confirms on-chain, fulfillment begins. Research Use Only — not for human consumption.
      </p>
    </section>
  )
}

export function storePaymentUrl(orderId: string, url: string) {
  if (typeof window === "undefined") return
  sessionStorage.setItem(payUrlKey(orderId), url)
}
