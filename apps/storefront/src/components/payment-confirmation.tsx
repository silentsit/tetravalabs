"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { CheckoutWiseInfo } from "@/components/checkout-wise-info"
import { checkoutWhatsAppHref, formatCheckoutUsd } from "@/lib/checkout-support"
import {
  isCheckoutPaymentMethod,
  readCheckoutPaymentMethod,
  type CheckoutPaymentMethod
} from "@/lib/checkout-payment-method"

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

function readStoredPayUrl(orderId: string) {
  if (typeof window === "undefined" || !orderId) return ""
  return sessionStorage.getItem(payUrlKey(orderId)) || ""
}

export type PaymentConfirmationProps = {
  orderId?: string
  displayId?: string
  total?: string
  methodFromUrl?: string
}

function resolvePaymentMethod(orderId: string, methodFromUrl: string): CheckoutPaymentMethod | "" {
  if (
    methodFromUrl === "card" ||
    methodFromUrl === "cardtousdt" ||
    methodFromUrl === "cheque" ||
    methodFromUrl === "manual_card_invoice"
  ) {
    return "card"
  }
  if (isCheckoutPaymentMethod(methodFromUrl)) return methodFromUrl
  return readCheckoutPaymentMethod(orderId)
}

export function PaymentConfirmation({
  orderId = "",
  displayId = "",
  total = "",
  methodFromUrl = ""
}: PaymentConfirmationProps) {
  const router = useRouter()
  const [payUrl, setPayUrl] = useState(() => readStoredPayUrl(orderId))
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null)
  const [polling, setPolling] = useState(false)

  useEffect(() => {
    const storedPayUrl = readStoredPayUrl(orderId)
    if (storedPayUrl) setPayUrl(storedPayUrl)
  }, [orderId])

  useEffect(() => {
    if (!orderId) return

    let active = true
    const storedPayUrl = readStoredPayUrl(orderId)

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
          if (data.provider_url && !storedPayUrl) {
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
  const checkoutMethod = resolvePaymentMethod(orderId, methodFromUrl)
  const isWise = checkoutMethod === "wise" || provider === "wise"
  const isCard = checkoutMethod === "card" || provider === "cardtousdt"
  const isInvoiceFallback = isCard && provider === "manual_card_invoice"
  const canOpenPayUrl = Boolean(resolvedUrl && !resolvedUrl.includes("example.com"))

  useEffect(() => {
    if (!isInvoiceFallback) return
    const params = new URLSearchParams()
    if (orderId) params.set("order_id", orderId)
    if (displayId) params.set("display_id", displayId)
    if (total) params.set("total", total)
    router.replace(`/checkout/thank-you?${params.toString()}`)
  }, [displayId, isInvoiceFallback, orderId, router, total])

  if (isInvoiceFallback) {
    return (
      <p className="page-container py-12 text-center text-sm text-[#475569]">Opening order receipt…</p>
    )
  }

  if (isWise && !isPaid) {
    return (
      <WisePayment
        amount={amount}
        isPaid={isPaid}
        label={label}
        orderId={orderId}
        polling={polling}
      />
    )
  }

  const isHeld = paymentStatus?.status === "held"
  const payButtonLabel = isCard
    ? "Open card checkout"
    : provider === "paymento"
      ? "Open Paymento checkout"
      : "Pay with Crypto"

  return (
    <section className="page-container mx-auto max-w-xl space-y-6 py-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Checkout", href: "/checkout" },
          { label: "Payment" }
        ]}
        includeSchema={false}
      />
      <div>
        <span className="section-label">Payment</span>
        <h1 className="mt-4 font-serif text-3xl text-[#0F172A]">
          {isPaid
            ? "Payment received"
            : isCard
              ? "Complete card payment"
              : "Complete crypto payment"}
        </h1>
        <p className="mt-3 text-sm text-[#475569]">
          {label ? `${label} was created.` : "Your order was created."}{" "}
          {isPaid
            ? "Your payment is confirmed. Fulfillment will begin shortly."
            : isCard
              ? "Pay in the card checkout tab. The amount should match your order total. If a popup was blocked, use the button below."
              : "Pay with crypto to confirm fulfillment. Your order confirmation email is sent only after Paymento marks the transaction complete."}
        </p>
      </div>
      <div className="card space-y-4 p-6">
        {amount ? (
          <p className="text-lg text-[#0F172A]">Order total: ${Number(amount).toFixed(2)} USD</p>
        ) : null}
        {isCard && !isPaid ? (
          <p className="text-sm text-[#64748B]">
            Your Tetrava order is recorded at the total above. The CardToUSDT tab should show the same USD amount.
          </p>
        ) : null}
        {paymentStatus?.status ? (
          <p className="text-sm text-[#475569]">
            Payment status: <span className="font-medium text-[#0F172A]">{paymentStatus.status}</span>
          </p>
        ) : null}
        {isHeld ? (
          <p className="text-sm text-amber-600">
            Settlement arrived below the accepted amount or could not be priced. We will review before
            fulfillment.
          </p>
        ) : null}
        {isProcessing ? (
          <p className="text-sm text-amber-600">
            Payment detected and processing on-chain. This page will update automatically. Your
            confirmation email sends once settlement finishes.
          </p>
        ) : null}
        {!isCard && !isPaid && !isProcessing ? (
          <p className="text-sm text-[#64748B]">
            No order confirmation email is sent until crypto payment is fully confirmed.
          </p>
        ) : null}
        {polling && !isPaid ? (
          <p className="text-xs text-[#94A3B8]">Checking payment status every few seconds…</p>
        ) : null}
        {!isPaid && canOpenPayUrl ? (
          <a
            href={resolvedUrl}
            target={isCard ? "_blank" : undefined}
            rel={isCard ? "noopener noreferrer" : undefined}
            className="btn-primary block w-full py-3 text-center"
          >
            {payButtonLabel}
          </a>
        ) : !isPaid ? (
          <p className="text-sm text-amber-600">
            {isCard
              ? "Card checkout is not ready. Your order is recorded; payment instructions will follow by email."
              : "Crypto checkout is not fully configured yet. Your order is recorded; payment instructions will follow by email."}
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
        {isCard
          ? "After the card checkout settles, fulfillment begins. Research Use Only — not for human consumption."
          : "After payment confirms on-chain, fulfillment begins. Research Use Only — not for human consumption."}
      </p>
    </section>
  )
}

function WisePayment({
  amount,
  isPaid,
  label,
  orderId,
  polling
}: {
  amount: string
  isPaid: boolean
  label: string
  orderId: string
  polling: boolean
}) {
  const amountUsd = amount && !Number.isNaN(Number(amount)) ? Number(amount) : 0
  const charged = formatCheckoutUsd(amountUsd)
  const whatsappHref = checkoutWhatsAppHref(
    `Hi Tetrava, I placed ${label || "an order"} for ${charged} USD and want to pay with Wise.`
  )

  return (
    <section className="page-container mx-auto max-w-xl space-y-6 py-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Checkout", href: "/checkout" },
          { label: "Payment" }
        ]}
        includeSchema={false}
      />
      <div>
        <span className="section-label">Payment</span>
        <h1 className="mt-4 font-serif text-3xl text-[#0F172A]">
          {isPaid ? "Payment received" : "Pay with Wise"}
        </h1>
        <p className="mt-3 text-sm text-[#475569]">
          {label ? `${label} is recorded.` : "Your order is recorded."} Send the USD total through
          Wise, then message us on WhatsApp.
        </p>
      </div>
      <div className="card space-y-4 p-6">
        <CheckoutWiseInfo amountUsd={amountUsd} />
        {polling && !isPaid ? (
          <p className="text-xs text-[#94A3B8]">Checking payment status every few seconds…</p>
        ) : null}
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-cta block w-full py-3 text-center"
        >
          WhatsApp
        </a>
        <Link href="/orders" className="block text-center text-sm text-[#0D9488] hover:underline">
          View order history
        </Link>
        {orderId ? (
          <p className="text-center text-xs text-[#94A3B8]">Order {orderId}</p>
        ) : null}
      </div>
    </section>
  )
}

export function storePaymentUrl(orderId: string, url: string) {
  if (typeof window === "undefined") return
  sessionStorage.setItem(payUrlKey(orderId), url)
}
