"use client"

import Link from "next/link"
import { useCallback, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Check, Lock } from "lucide-react"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { CheckoutHandoffShell } from "@/components/checkout-handoff-shell"
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

function readStoredPayUrl(orderId: string) {
  if (typeof window === "undefined" || !orderId) return ""
  return sessionStorage.getItem(payUrlKey(orderId)) || ""
}

function resolveOnrampId(orderId: string, onrampFromUrl: string) {
  if (onrampFromUrl) return onrampFromUrl
  return readStoredOnramp(orderId)
}

export type PaymentConfirmationProps = {
  orderId?: string
  displayId?: string
  total?: string
  onrampFromUrl?: string
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

export function PaymentConfirmation({
  orderId = "",
  displayId = "",
  total = "",
  onrampFromUrl = ""
}: PaymentConfirmationProps) {
  const router = useRouter()
  const [payUrl, setPayUrl] = useState(() => readStoredPayUrl(orderId))
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null)
  const [polling, setPolling] = useState(false)
  const [handedOff, setHandedOff] = useState(() => readStoredHandoff(orderId))
  const [onrampId, setOnrampId] = useState(() => resolveOnrampId(orderId, onrampFromUrl))
  const [payLinkResolved, setPayLinkResolved] = useState(() => Boolean(readStoredPayUrl(orderId)))
  const [opening, setOpening] = useState(false)
  const [handoffError, setHandoffError] = useState("")
  const handoffStarted = useRef(false)

  useEffect(() => {
    if (onrampFromUrl) {
      setOnrampId(onrampFromUrl)
      if (orderId) sessionStorage.setItem(onrampKey(orderId), onrampFromUrl)
    } else {
      const storedOnramp = readStoredOnramp(orderId)
      if (storedOnramp) setOnrampId(storedOnramp)
    }
    if (orderId && readStoredHandoff(orderId)) setHandedOff(true)

    const storedPayUrl = readStoredPayUrl(orderId)
    if (storedPayUrl) setPayUrl(storedPayUrl)
  }, [orderId, onrampFromUrl])

  useEffect(() => {
    if (!orderId) {
      setPayLinkResolved(true)
      return
    }

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
      } finally {
        if (active) setPayLinkResolved(true)
      }
    }

    let interval: number | undefined

    if (storedPayUrl) setPayLinkResolved(true)

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
  const amountUsd = amount && !Number.isNaN(Number(amount)) ? Number(amount) : 0
  const canStartHandoff = Boolean(orderId && isPeptidepayOnrampId(onrampId) && amountUsd > 0)

  const beginHandoff = useCallback(async () => {
    if (!canStartHandoff || handoffStarted.current || opening) return
    setHandoffError("")
    setOpening(true)

    try {
      const response = await fetch("/api/checkout/card-handoff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: orderId,
          provider: onrampId
        })
      })
      const data = (await response.json()) as {
        ok?: boolean
        message?: string
        provider_url?: string
        card_onramp?: string
      }

      if (!response.ok || !data.ok || !data.provider_url) {
        setHandoffError(data.message || "Could not open your card checkout. Try another processor.")
        handoffStarted.current = false
        setOpening(false)
        return
      }

      handoffStarted.current = true
      if (orderId) {
        sessionStorage.setItem(handoffKey(orderId), "1")
        sessionStorage.setItem(payUrlKey(orderId), data.provider_url)
        if (data.card_onramp) sessionStorage.setItem(onrampKey(orderId), data.card_onramp)
      }
      setPayUrl(data.provider_url)
      if (data.card_onramp && isPeptidepayOnrampId(data.card_onramp)) {
        setOnrampId(data.card_onramp)
      }
      setHandedOff(true)
      setOpening(false)

      const popup = window.open(data.provider_url, "_blank", "noopener,noreferrer")
      if (!popup) {
        window.location.assign(data.provider_url)
      }
    } catch {
      setHandoffError("Could not reach the payment server. Try again in a moment.")
      handoffStarted.current = false
      setOpening(false)
    }
  }, [canStartHandoff, onrampId, opening, orderId])

  if (isCard && !isPaid) {
    return (
      <CheckoutHandoffShell>
        <CardHandoff
          amount={amount}
          beginHandoff={beginHandoff}
          canOpenPayUrl={canOpenPayUrl}
          canStartHandoff={canStartHandoff}
          handedOff={handedOff}
          handoffError={handoffError}
          onramp={onramp}
          opening={opening}
          payLinkResolved={payLinkResolved}
          polling={polling}
          processorName={processorName}
          resolvedUrl={resolvedUrl}
        />
      </CheckoutHandoffShell>
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

function HandoffProcessorSummary({
  onramp,
  processorName
}: {
  onramp?: PeptidepayOnrampOption
  processorName: string
}) {
  return (
    <div className="handoff-provider-tile" aria-label={`Payment via ${processorName}`}>
      <p className="handoff-provider-tile__name">{processorName}</p>
      {onramp?.eta ? <p className="handoff-provider-tile__eta">{onramp.eta}</p> : null}
      <div className="handoff-provider-tile__marks">
        {onramp?.id === "paypal" ? (
          <span className="handoff-provider-tile__paypal">PayPal</span>
        ) : (
          <ProcessorMarks methods={onramp?.methods || []} />
        )}
      </div>
    </div>
  )
}

function CardHandoff({
  amount,
  beginHandoff,
  canOpenPayUrl,
  canStartHandoff,
  handedOff,
  handoffError,
  onramp,
  opening,
  payLinkResolved,
  polling,
  processorName,
  resolvedUrl
}: {
  amount: string
  beginHandoff: () => void | Promise<void>
  canOpenPayUrl: boolean
  canStartHandoff: boolean
  handedOff: boolean
  handoffError: string
  onramp?: PeptidepayOnrampOption
  opening: boolean
  payLinkResolved: boolean
  polling: boolean
  processorName: string
  resolvedUrl: string
}) {
  const formattedAmount =
    amount && !Number.isNaN(Number(amount)) ? Number(amount).toFixed(2) : ""

  if (!payLinkResolved && !handedOff) {
    return (
      <div className="handoff-page">
        <div className="handoff-card handoff-card--loading">
          <SiteLogo className="mx-auto h-10 sm:h-11" />
          <p className="mt-6 text-center text-sm text-[#64748B]">Loading your order…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="handoff-page">
      <div className="handoff-card">
        {handedOff ? (
          <div className="handoff-processing">
            <div className="handoff-processing__icon" aria-hidden>
              <Check className="h-8 w-8" strokeWidth={2.5} />
            </div>
            <h1 className="handoff-processing__title">Payment processing</h1>
            <p className="handoff-processing__lead">
              Complete your purchase on the {processorName} page that just opened. If nothing opened,
              use the button below. When payment clears, this page updates automatically and Tetrava
              is notified.
            </p>
            {polling ? (
              <p className="handoff-processing__meta">Checking payment status every few seconds.</p>
            ) : null}
            <p className="handoff-processing__hint">Taking longer than expected?</p>
            <Link href="/payment" className="handoff-processing__link">
              Surprised by identity verification? Here&apos;s why it&apos;s needed.
            </Link>
            {canOpenPayUrl ? (
              <a href={resolvedUrl} target="_blank" rel="noopener noreferrer" className="handoff-btn handoff-btn--outline">
                Reopen {processorName}
              </a>
            ) : null}
            <Link href="/checkout" className="handoff-btn handoff-btn--outline">
              Return to checkout
            </Link>
          </div>
        ) : (
          <>
            <div className="handoff-card__header">
              <SiteLogo className="mx-auto h-10 sm:h-11" />
              <h1 className="handoff-card__title">Complete your purchase</h1>
              <p className="handoff-card__secure">
                <Lock className="h-3.5 w-3.5 shrink-0" aria-hidden />
                Secure &amp; Encrypted Payment
              </p>
            </div>

            <p className="handoff-card__notice">
              You&apos;ll finish on {processorName}&apos;s secure page. Do not change the amount there.
              Once payment clears, you&apos;ll get confirmation and Tetrava is notified instantly.
            </p>

            <HandoffProcessorSummary onramp={onramp} processorName={processorName} />

            <p className="handoff-card__kyc">
              Identity verification may be required by {processorName}.{" "}
              <Link href="/payment" className="handoff-card__kyc-link">
                What to expect?
              </Link>
            </p>

            {formattedAmount ? (
              <div className="handoff-total-bar">
                <p className="handoff-total-bar__label">Total amount</p>
                <p className="handoff-total-bar__amount">{formattedAmount} USD</p>
              </div>
            ) : null}

            {handoffError ? <p className="handoff-card__error">{handoffError}</p> : null}

            {canStartHandoff ? (
              <button
                type="button"
                className="handoff-btn handoff-btn--primary"
                onClick={() => void beginHandoff()}
                disabled={opening}
              >
                {opening ? "Opening payment…" : "Pay Now"}
              </button>
            ) : (
              <p className="handoff-card__error">
                This order cannot start card checkout yet.{" "}
                <Link href="/checkout" className="text-[#0D9488] hover:underline">
                  Return to checkout
                </Link>
              </p>
            )}
          </>
        )}
      </div>

      <p className="handoff-ruo">Research Use Only. Not for human consumption.</p>
    </div>
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
