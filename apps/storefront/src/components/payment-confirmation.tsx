"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Breadcrumbs } from "@/components/breadcrumbs"

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
          if (data.provider_url) {
            setPayUrl((current) => current || data.provider_url)
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
    <section className="page-container mx-auto max-w-xl space-y-6 py-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Checkout", href: "/checkout" },
          { label: "Payment" }
        ]}
      />
      <div>
        <span className="section-label">Payment</span>
        <h1 className="mt-4 font-serif text-3xl text-[#0F172A]">
          {isPaid ? "Payment received" : "Complete crypto payment"}
        </h1>
        <p className="mt-3 text-sm text-[#475569]">
          {label ? `${label} was created.` : "Your order was created."}{" "}
          {isPaid
            ? "Your crypto payment is confirmed. Fulfillment will begin shortly."
            : "Pay with crypto to confirm fulfillment."}
        </p>
      </div>
      <div className="card space-y-4 p-6">
        {amount ? <p className="text-lg text-[#0F172A]">Amount due: ${Number(amount).toFixed(2)} USD</p> : null}
        {paymentStatus?.status ? (
          <p className="text-sm text-[#475569]">
            Payment status: <span className="font-medium text-[#0F172A]">{paymentStatus.status}</span>
          </p>
        ) : null}
        {isProcessing ? (
          <p className="text-sm text-amber-600">
            Payment detected and processing on-chain. This page will update automatically.
          </p>
        ) : null}
        {polling && !isPaid ? (
          <p className="text-xs text-[#94A3B8]">Checking payment status every few seconds…</p>
        ) : null}
        {!isPaid && resolvedUrl && !resolvedUrl.includes("example.com") ? (
          <a href={resolvedUrl} className="btn-primary block w-full py-3 text-center">
            {payButtonLabel}
          </a>
        ) : !isPaid ? (
          <p className="text-sm text-amber-600">
            Crypto checkout is not fully configured yet. Your order is recorded; payment instructions will
            follow by email.
          </p>
        ) : null}
        <Link href="/orders" className="block text-center text-sm text-[#0D9488] hover:underline">
          View order history
        </Link>
        <Link href="/payment" className="block text-center text-xs text-[#94A3B8] hover:text-[#0D9488]">
          How payments work
        </Link>
      </div>
      <p className="text-xs text-[#94A3B8]">
        After payment confirms on-chain, fulfillment begins. Research Use Only — not for human consumption.
      </p>
    </section>
  )
}

export function storePaymentUrl(orderId: string, url: string) {
  if (typeof window === "undefined") return
  sessionStorage.setItem(payUrlKey(orderId), url)
}
