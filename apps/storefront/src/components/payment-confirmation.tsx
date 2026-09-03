"use client"

import Link from "next/link"
import { useCallback, useEffect, useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Check, Lock } from "lucide-react"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { SiteLogo } from "@/components/site-logo"
import {
  getPeptidepayOnramp,
  isPeptidepayOnrampId,
  type PeptidepayOnrampMethod,
  type PeptidepayOnrampOption
} from "@/lib/peptidepay-onramps"

const payUrlKey = (orderId: string) => `tetrava_pay_${orderId}`
const handoffKey = (orderId: string) => `tetrava_handoff_${orderId}`
const onrampKey = (orderId: string) => `tetrava_onramp_${orderId}`
const POLL_MS = 12_000
const HANDOFF_DELAY_MS = 3_000

type PaymentStatus = {
  status?: string
  provider?: string
  provider_url?: string
  amount_usd?: number
}

const METHOD_MARKS: Record<
  PeptidepayOnrampMethod,
  { src: string; label: string; width: number; height: number }
> = {
  visa: { src: "/payments/visa.png", label: "Visa", width: 48, height: 30 },
  mastercard: { src: "/payments/mastercard.svg", label: "Mastercard", width: 28, height: 18 },
  applepay: { src: "/payments/apple-pay.png", label: "Apple Pay", width: 44, height: 18 }
}

function isPaidStatus(status?: string) {
  return status === "paid" || status === "settled" || status === "completed"
}

function readStoredHandoff(orderId: string) {
  if (typeof window === "undefined" || !orderId) return false
  return sessionStorage.getItem(handoffKey(orderId)) === "1"
}

function readStoredOnramp(orderId: string) {
  if (typeof window === "undefined" || !orderId) return ""
  return sessionStorage.getItem(onrampKey(orderId)) || ""
}

function ProcessorMarks({ methods }: { methods: PeptidepayOnrampMethod[] }) {
  if (!methods.length) return null
  return (
    <ul className="flex flex-wrap items-center gap-2" aria-label="Accepted cards">
      {methods.map((method) => {
        const mark = METHOD_MARKS[method]
        return (
          <li key={method} className="flex items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={mark.src}
              alt={mark.label}
              width={mark.width}
              height={mark.height}
              className="block shrink-0 object-contain"
              style={{ width: mark.width, height: mark.height }}
            />
          </li>
        )
      })}
    </ul>
  )
}

export function PaymentConfirmation() {
  const router = useRouter()
  const params = useSearchParams()
  const orderId = params.get("order_id") || ""
  const displayId = params.get("display_id") || ""
  const total = params.get("total") || ""
  const onrampFromUrl = params.get("onramp") || ""
  const [payUrl, setPayUrl] = useState("")
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null)
  const [polling, setPolling] = useState(false)
  const [handedOff, setHandedOff] = useState(false)
  const [onrampId, setOnrampId] = useState(onrampFromUrl)
  const [secondsLeft, setSecondsLeft] = useState(3)
  const [leaving, setLeaving] = useState(false)
  const [sessionReady, setSessionReady] = useState(false)
  const handoffStarted = useRef(false)

  useEffect(() => {
    if (onrampFromUrl) {
      setOnrampId(onrampFromUrl)
      if (orderId) sessionStorage.setItem(onrampKey(orderId), onrampFromUrl)
    } else if (orderId) {
      const storedOnramp = readStoredOnramp(orderId)
      if (storedOnramp) setOnrampId(storedOnramp)
    }
    if (orderId && readStoredHandoff(orderId)) setHandedOff(true)
    setSessionReady(true)
  }, [orderId, onrampFromUrl])

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
  const onramp = getPeptidepayOnramp(onrampId)
  const isCard =
    isPeptidepayOnrampId(onrampId) || provider === "peptidepay" || Boolean(onramp)
  const canOpenPayUrl = Boolean(resolvedUrl && !resolvedUrl.includes("example.com"))
  const processorName = onramp?.label || "your processor"

  const beginHandoff = useCallback(() => {
    if (!canOpenPayUrl || handoffStarted.current) return
    handoffStarted.current = true
    if (orderId) sessionStorage.setItem(handoffKey(orderId), "1")
    setHandedOff(true)
    setLeaving(true)
    window.location.assign(resolvedUrl)
  }, [canOpenPayUrl, orderId, resolvedUrl])

  useEffect(() => {
    if (!sessionReady || !isCard || handedOff || isPaid || !canOpenPayUrl || leaving) return
    const startedAt = Date.now()
    setSecondsLeft(3)
    const tick = window.setInterval(() => {
      const left = Math.max(0, Math.ceil((HANDOFF_DELAY_MS - (Date.now() - startedAt)) / 1000))
      setSecondsLeft(left)
      if (left === 0) {
        window.clearInterval(tick)
        beginHandoff()
      }
    }, 200)
    return () => window.clearInterval(tick)
  }, [beginHandoff, canOpenPayUrl, handedOff, isCard, isPaid, leaving, sessionReady])

  if (isCard && !isPaid && !sessionReady) {
    return <p className="page-container py-8 text-sm text-[#8A8AA0]">Loading payment details...</p>
  }

  if (isCard && !isPaid) {
    return (
      <CardHandoff
        amount={amount}
        beginHandoff={beginHandoff}
        canOpenPayUrl={canOpenPayUrl}
        handedOff={handedOff}
        label={label}
        leaving={leaving}
        onramp={onramp}
        polling={polling}
        processorName={processorName}
        resolvedUrl={resolvedUrl}
        secondsLeft={secondsLeft}
      />
    )
  }

  const payButtonLabel =
    provider === "peptidepay"
      ? "Complete card payment"
      : provider === "paymento"
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
        includeSchema={false}
      />
      <div>
        <span className="section-label">Payment</span>
        <h1 className="mt-4 font-serif text-3xl text-[#0F172A]">
          {isPaid ? "Payment received" : "Complete crypto payment"}
        </h1>
        <p className="mt-3 text-sm text-[#475569]">
          {label ? `${label} was created.` : "Your order was created."}{" "}
          {isPaid
            ? "Your payment is confirmed. Fulfillment will begin shortly."
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
        {!isPaid && canOpenPayUrl ? (
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

function CardHandoff({
  amount,
  beginHandoff,
  canOpenPayUrl,
  handedOff,
  label,
  leaving,
  onramp,
  polling,
  processorName,
  resolvedUrl,
  secondsLeft
}: {
  amount: string
  beginHandoff: () => void
  canOpenPayUrl: boolean
  handedOff: boolean
  label: string
  leaving: boolean
  onramp?: PeptidepayOnrampOption
  polling: boolean
  processorName: string
  resolvedUrl: string
  secondsLeft: number
}) {
  const formattedAmount =
    amount && !Number.isNaN(Number(amount)) ? `$${Number(amount).toFixed(2)} USD` : ""
  const idStep =
    onramp?.idCheck === "none" ? "Confirm payment" : "Quick ID check (first time only)"

  return (
    <section className="page-container mx-auto max-w-lg space-y-6 py-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Checkout", href: "/checkout" },
          { label: "Payment" }
        ]}
        includeSchema={false}
      />

      <div className="flex items-center justify-between gap-3">
        <SiteLogo className="h-7 sm:h-8" />
        <p className="flex items-center gap-1.5 text-xs font-medium text-[#0D9488]">
          <Lock className="h-3.5 w-3.5 shrink-0" aria-hidden />
          Secure checkout
        </p>
      </div>

      {handedOff ? (
        <div className="card space-y-5 p-6 text-center sm:p-8">
          <div
            className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#0D9488] text-white"
            aria-hidden
          >
            <Check className="h-7 w-7" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="font-serif text-3xl text-[#0F172A]">Waiting for your payment</h1>
            <p className="mt-3 text-sm leading-relaxed text-[#475569]">
              Finish on {processorName}. We'll update this page automatically.
            </p>
          </div>
          {formattedAmount ? (
            <p className="font-mono text-lg text-[#0F172A]">You pay {formattedAmount}</p>
          ) : null}
          {label ? <p className="text-sm text-[#64748B]">{label}</p> : null}
          {polling ? (
            <p className="text-xs text-[#94A3B8]">Checking payment status every few seconds.</p>
          ) : null}
          {canOpenPayUrl ? (
            <a href={resolvedUrl} className="btn-secondary block w-full py-3 text-center">
              Reopen {processorName}
            </a>
          ) : (
            <p className="text-sm text-amber-700">
              The payment link is missing. Return to checkout and choose a processor again.
            </p>
          )}
          <Link href="/checkout" className="block text-center text-sm text-[#0D9488] hover:underline">
            Use a different processor
          </Link>
        </div>
      ) : (
        <div className="card space-y-5 p-6 sm:p-8">
          <div>
            <h1 className="font-serif text-3xl text-[#0F172A]">Secure checkout</h1>
            {formattedAmount ? (
              <p className="mt-3 font-mono text-lg text-[#0F172A]">You pay {formattedAmount}</p>
            ) : null}
            {label ? <p className="mt-1 text-sm text-[#64748B]">{label}</p> : null}
          </div>

          <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3">
            <p className="text-sm font-medium text-[#0F172A]">{processorName}</p>
            {onramp?.eta ? <p className="mt-0.5 text-xs text-[#64748B]">{onramp.eta}</p> : null}
            <div className="mt-2">
              <ProcessorMarks methods={onramp?.methods || []} />
            </div>
          </div>

          <ol className="grid grid-cols-1 gap-3 text-sm text-[#475569] sm:grid-cols-3">
            <li className="rounded-xl border border-[#E2E8F0] px-3 py-3">
              <span className="font-mono text-xs text-[#94A3B8]">1</span>
              <p className="mt-1 font-medium text-[#0F172A]">
                {onramp?.id === "paypal" ? "Sign in to PayPal" : "Enter your card"}
              </p>
            </li>
            <li className="rounded-xl border border-[#E2E8F0] px-3 py-3">
              <span className="font-mono text-xs text-[#94A3B8]">2</span>
              <p className="mt-1 font-medium text-[#0F172A]">{idStep}</p>
            </li>
            <li className="rounded-xl border border-[#E2E8F0] px-3 py-3">
              <span className="font-mono text-xs text-[#94A3B8]">3</span>
              <p className="mt-1 font-medium text-[#0F172A]">You come back here</p>
            </li>
          </ol>

          <p className="text-sm leading-relaxed text-[#475569]">
            You'll finish on {processorName}'s secure page. Card details never touch Tetrava.
          </p>

          {canOpenPayUrl ? (
            <button
              type="button"
              className="btn-primary w-full py-3"
              onClick={beginHandoff}
              disabled={leaving}
            >
              {leaving ? "Opening payment" : "Continue to payment"}
            </button>
          ) : (
            <p className="text-sm text-amber-700">
              The payment link is not ready yet. Wait a moment, or return to checkout.
            </p>
          )}

          {canOpenPayUrl && !leaving ? (
            <p className="text-center text-xs text-[#94A3B8]" aria-live="polite">
              Continuing in {secondsLeft}s
            </p>
          ) : null}

          <Link href="/checkout" className="block text-center text-sm text-[#0D9488] hover:underline">
            Use a different processor
          </Link>
        </div>
      )}

      <p className="text-xs text-[#94A3B8]">
        Research Use Only. Not for human consumption.
      </p>
    </section>
  )
}

export function storePaymentUrl(orderId: string, url: string) {
  if (typeof window === "undefined") return
  sessionStorage.setItem(payUrlKey(orderId), url)
}

export function storeCardOnramp(orderId: string, onramp: string) {
  if (typeof window === "undefined" || !onramp) return
  sessionStorage.setItem(onrampKey(orderId), onramp)
}
