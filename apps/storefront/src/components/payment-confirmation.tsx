"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

const payUrlKey = (orderId: string) => `tetrava_pay_${orderId}`
const POLL_MS = 12_000

type PaymentStatus = {
  status?: string
  provider?: string
  provider_url?: string
  amount_usd?: number
}

function isPaidStatus(status?: string) {
  return status === "paid" || status === "settled" || status === "completed"
}

export function PaymentConfirmation() {
  const router = useRouter()
  const params = useSearchParams()
  const orderId = params.get("order_id") || ""
  const displayId = params.get("display_id") || ""
  const total = params.get("total") || ""
  const [payUrl, setPayUrl] = useState("")
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null)
  const [polling, setPolling] = useState(false)

  useEffect(() => {
    if (!orderId) return

    const stored = sessionStorage.getItem(payUrlKey(orderId))
    if (stored) setPayUrl(stored)

    let active = true

    const loadStatus = async () => {
      try {
        const response = await fetch(`/api/payment-status?order_id=${encodeURIComponent(orderId)}`)
        if (!response.ok) return null
        const data = await response.json()
        if (!data.ok) return null

        const nextStatus: PaymentStatus = {
          status: data.status,
          provider: data.provider,
          provider_url: data.provider_url,
          amount_usd: data.amount_usd
        }

        if (active) {
          setPaymentStatus(nextStatus)
          if (data.provider_url && !stored) {
            setPayUrl(data.provider_url)
            sessionStorage.setItem(payUrlKey(orderId), data.provider_url)
          }
        }

        return nextStatus
      } catch {
        return null
      }
    }

    let interval: number | undefined

    void loadStatus().then((status) => {
      if (!active) return
      if (isPaidStatus(status?.status)) {
        router.replace("/orders?payment=complete")
        return
      }
      setPolling(true)
      interval = window.setInterval(async () => {
        const next = await loadStatus()
        if (isPaidStatus(next?.status)) {
          if (interval) window.clearInterval(interval)
          setPolling(false)
          router.replace("/orders?payment=complete")
        }
      }, POLL_MS)
    })

    return () => {
      active = false
      if (interval) window.clearInterval(interval)
    }
  }, [orderId, router])

  const label = displayId ? `Order #${displayId}` : orderId
  const resolvedUrl = payUrl || paymentStatus?.provider_url || ""
  const amount =
    total || (paymentStatus?.amount_usd != null ? String(paymentStatus.amount_usd) : "")
  const isPaid = isPaidStatus(paymentStatus?.status)
  const isProcessing = paymentStatus?.status === "processing"
  const provider = paymentStatus?.provider || ""
  const payButtonLabel =
    provider === "paymento"
      ? "Open Paymento checkout"
      : provider === "btcpay"
        ? "Pay with Bitcoin (BTCPay)"
        : "Pay with Crypto"

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
        {isProcessing ? (
          <p className="text-sm text-[#FBBF24]">
            Payment detected and processing on-chain. This page will update automatically.
          </p>
        ) : null}
        {polling && !isPaid ? (
          <p className="text-xs text-[#8A8AA0]">Checking payment status every few seconds…</p>
        ) : null}
        {!isPaid && resolvedUrl && !resolvedUrl.includes("example.com") ? (
          <a
            href={resolvedUrl}
            className="block w-full rounded-lg bg-[#5EEAD4] px-6 py-3 text-center text-sm font-medium text-[#050508]"
          >
            {payButtonLabel}
          </a>
        ) : !isPaid ? (
          <p className="text-sm text-[#FBBF24]">
            Crypto checkout is not fully configured yet. Your order is recorded; payment instructions will follow by
            email.
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
