"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"

const payUrlKey = (orderId: string) => `tetrava_pay_${orderId}`

export function PaymentConfirmation() {
  const params = useSearchParams()
  const orderId = params.get("order_id") || ""
  const displayId = params.get("display_id") || ""
  const total = params.get("total") || ""
  const [payUrl, setPayUrl] = useState("")

  useEffect(() => {
    if (!orderId) return
    const stored = sessionStorage.getItem(payUrlKey(orderId))
    setPayUrl(stored || "")
  }, [orderId])

  const label = displayId ? `Order #${displayId}` : orderId

  return (
    <section className="mx-auto max-w-xl space-y-6">
      <div>
        <p className="font-mono text-xs uppercase tracking-wider text-[#5EEAD4]">Payment</p>
        <h1 className="mt-4 text-3xl font-semibold text-[#E8E8F0]">Complete Crypto Payment</h1>
        <p className="mt-3 text-[#8A8AA0]">
          {label ? `${label} was created.` : "Your order was created."} Pay with crypto to confirm fulfillment.
        </p>
      </div>
      <div className="space-y-4 rounded-xl border border-white/10 bg-[#0A0A10] p-6">
        {total ? <p className="text-lg text-[#E8E8F0]">Amount due: ${Number(total).toFixed(2)} USD</p> : null}
        {payUrl && !payUrl.includes("example.com") ? (
          <a
            href={payUrl}
            className="block w-full rounded-lg bg-[#5EEAD4] px-6 py-3 text-center text-sm font-medium text-[#050508]"
          >
            Pay with Crypto (BTCPay)
          </a>
        ) : (
          <p className="text-sm text-[#FBBF24]">
            BTCPay is not configured yet. Your order is recorded; payment instructions will follow by email.
          </p>
        )}
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
