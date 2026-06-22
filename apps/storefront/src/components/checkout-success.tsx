"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { CheckCircle2, Loader2 } from "lucide-react"
import { Breadcrumbs } from "@/components/breadcrumbs"

const POLL_MS = 4_000

function isPaidStatus(status?: string) {
  return status === "paid" || status === "settled" || status === "completed"
}

export function CheckoutSuccessContent() {
  const router = useRouter()
  const params = useSearchParams()
  const orderId = params.get("order_id") || ""
  const [status, setStatus] = useState<string | null>(null)
  const [polling, setPolling] = useState(true)

  useEffect(() => {
    if (!orderId) return

    let active = true
    let interval: number | undefined

    const loadStatus = async () => {
      try {
        const response = await fetch(`/api/payment-status?order_id=${encodeURIComponent(orderId)}`)
        if (!response.ok) return null
        const data = await response.json()
        if (!data.ok || !active) return null
        setStatus(data.status)
        return data.status as string
      } catch {
        return null
      }
    }

    void loadStatus().then((next) => {
      if (!active) return
      if (isPaidStatus(next ?? undefined)) {
        setPolling(false)
        window.setTimeout(() => router.replace("/orders?payment=complete"), 1200)
        return
      }

      interval = window.setInterval(async () => {
        const latest = await loadStatus()
        if (isPaidStatus(latest ?? undefined)) {
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

  const paid = isPaidStatus(status ?? undefined)

  return (
    <section className="page-container mx-auto max-w-lg space-y-6 py-8 sm:py-12">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Checkout", href: "/checkout" },
          { label: "Confirmation" }
        ]}
      />

      <div className="card overflow-hidden text-center">
        <div className="bg-gradient-to-br from-[#F0FDFA] to-white px-6 py-10 sm:px-8">
          {paid ? (
            <CheckCircle2 className="mx-auto h-14 w-14 text-[#059669]" aria-hidden />
          ) : (
            <Loader2 className="mx-auto h-14 w-14 animate-spin text-[#0D9488]" aria-hidden />
          )}
          <h1 className="mt-5 font-serif text-2xl text-[#0F172A] sm:text-3xl">
            {paid ? "Payment confirmed" : "Confirming your payment"}
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-[#475569]">
            {paid
              ? "Thank you. Your order is paid and will move into fulfillment shortly."
              : "Your card payment is being verified. This usually takes under a minute."}
          </p>
          {polling && !paid ? (
            <p className="mt-2 text-xs text-[#94A3B8]">Checking status automatically…</p>
          ) : null}
        </div>

        <div className="space-y-3 border-t border-[#E2E8F0] px-6 py-6 sm:px-8">
          {orderId ? (
            <p className="text-xs text-[#94A3B8]">
              Reference: <span className="font-mono text-[#64748B]">{orderId}</span>
            </p>
          ) : null}
          <Link href="/orders" className="btn-primary block w-full py-3">
            View orders
          </Link>
          <Link href="/shop" className="btn-secondary block w-full py-3">
            Continue shopping
          </Link>
        </div>
      </div>
    </section>
  )
}
