"use client"

import Link from "next/link"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { QRCodeSVG } from "qrcode.react"
import {
  ArrowUpRight,
  Clock,
  ExternalLink,
  RefreshCw,
  ShieldCheck,
  Wallet
} from "lucide-react"
import { buildOnrampLinks, resolveOnrampRegion, type OnrampLink } from "@/lib/onramp-links"
import { buildPaymentQrPayload } from "@/lib/payment-uri"
import {
  createPaymentSession,
  formatCountdown,
  loadPaymentSession,
  remainingMs,
  savePaymentSession,
  type PaymentSession,
  usdcFromUsd
} from "@/lib/payment-session"

const POLL_MS = 5_000

type TabId = "have-crypto" | "buy-crypto"

type PaymentStatus = {
  status?: string
  provider?: string
  provider_url?: string
  amount_usd?: number
}

type Props = {
  orderId: string
  displayId?: string
  totalUsd: number
  initialPayUrl?: string
  initialProvider?: string
  cryptoAsset?: string
}

function isPaidStatus(status?: string) {
  return status === "paid" || status === "settled" || status === "completed"
}

export function GuidedWalletModal({
  orderId,
  displayId,
  totalUsd,
  initialPayUrl = "",
  initialProvider = "",
  cryptoAsset = "USDT"
}: Props) {
  const router = useRouter()
  const [tab, setTab] = useState<TabId>("have-crypto")
  const [session, setSession] = useState<PaymentSession | null>(null)
  const [countdown, setCountdown] = useState("")
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null)
  const [polling, setPolling] = useState(false)
  const [country, setCountry] = useState<string | null>(null)
  const [open, setOpen] = useState(true)
  const sessionReady = useRef(false)

  const payUrl = session?.providerUrl || paymentStatus?.provider_url || initialPayUrl || ""
  const provider = session?.provider || paymentStatus?.provider || initialProvider || ""
  const amountUsd = session?.totalUsd || paymentStatus?.amount_usd || totalUsd
  const lockedUsdc = session?.lockedUsdc ?? usdcFromUsd(amountUsd)
  const isPaid = isPaidStatus(paymentStatus?.status)
  const isProcessing = paymentStatus?.status === "processing"

  const region = useMemo(() => resolveOnrampRegion(country), [country])
  const onrampLinks: OnrampLink[] = useMemo(
    () => buildOnrampLinks(lockedUsdc, region),
    [lockedUsdc, region]
  )

  const qrPayload = useMemo(
    () =>
      buildPaymentQrPayload({
        providerUrl: payUrl,
        asset: cryptoAsset,
        amountUsd: lockedUsdc,
        orderLabel: displayId ? `Order ${displayId}` : orderId
      }),
    [payUrl, cryptoAsset, lockedUsdc, displayId, orderId]
  )

  useEffect(() => {
    if (!orderId || sessionReady.current) return
    sessionReady.current = true

    const existing = loadPaymentSession(orderId)
    if (existing) {
      setSession(existing)
      return
    }

    const created = createPaymentSession({
      orderId,
      displayId,
      totalUsd,
      providerUrl: initialPayUrl,
      provider: initialProvider,
      cryptoAsset
    })
    savePaymentSession(created)
    setSession(created)
  }, [orderId, displayId, totalUsd, initialPayUrl, initialProvider, cryptoAsset])

  useEffect(() => {
    const url = paymentStatus?.provider_url || initialPayUrl
    if (!url) return
    setSession((prev) => {
      if (!prev || prev.providerUrl === url) return prev
      const updated = {
        ...prev,
        providerUrl: url,
        provider: paymentStatus?.provider || prev.provider
      }
      savePaymentSession(updated)
      return updated
    })
  }, [paymentStatus?.provider_url, paymentStatus?.provider, initialPayUrl])

  useEffect(() => {
    void fetch("/api/geo")
      .then((response) => response.json())
      .then((data) => {
        if (data?.country) setCountry(data.country)
      })
      .catch(() => undefined)
  }, [])

  useEffect(() => {
    if (!session) return
    const tick = () => {
      const ms = remainingMs(session)
      setCountdown(ms > 0 ? formatCountdown(ms) : "0:00")
    }
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [session])

  const rateLockExpired = session ? remainingMs(session) === 0 : false

  const loadStatus = useCallback(async () => {
    if (!orderId) return null
    try {
      const response = await fetch(`/api/payment-status?order_id=${encodeURIComponent(orderId)}`)
      if (!response.ok) return null
      const data = await response.json()
      if (!data.ok) return null

      const next: PaymentStatus = {
        status: data.status,
        provider: data.provider,
        provider_url: data.provider_url,
        amount_usd: data.amount_usd
      }
      setPaymentStatus(next)
      return next
    } catch {
      return null
    }
  }, [orderId])

  useEffect(() => {
    if (!orderId) return

    let active = true
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

    const refresh = () => {
      if (document.visibilityState === "visible") void loadStatus()
    }
    window.addEventListener("focus", refresh)
    document.addEventListener("visibilitychange", refresh)

    return () => {
      active = false
      if (interval) window.clearInterval(interval)
      window.removeEventListener("focus", refresh)
      document.removeEventListener("visibilitychange", refresh)
    }
  }, [orderId, loadStatus, router])

  if (!open && !isPaid) {
    return (
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-[#E2E8F0] bg-white p-4 shadow-lg">
        <div className="page-container flex items-center justify-between gap-4">
          <p className="text-sm text-[#475569]">
            Payment pending — {lockedUsdc.toFixed(2)} USDC
            {polling ? " · watching for payment" : ""}
          </p>
          <button type="button" onClick={() => setOpen(true)} className="btn-primary shrink-0 px-5 py-2.5">
            Complete payment
          </button>
        </div>
      </div>
    )
  }

  const orderLabel = displayId ? `Order #${displayId}` : orderId

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#0F172A]/60 p-4 sm:items-center">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="payment-modal-title"
        className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-[#E2E8F0] bg-white shadow-2xl"
      >
        <div className="border-b border-[#E2E8F0] px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="section-label">Checkout</p>
              <h2 id="payment-modal-title" className="mt-1 font-serif text-2xl text-[#0F172A]">
                Complete Your Payment
              </h2>
              <p className="mt-1 text-sm text-[#475569]">{orderLabel}</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg px-2 py-1 text-sm text-[#94A3B8] hover:bg-[#F1F5F9] hover:text-[#475569]"
              aria-label="Minimize payment modal"
            >
              Minimize
            </button>
          </div>

          <div className="mt-4 flex items-center justify-between rounded-xl bg-[#F8FAFC] px-4 py-3">
            <div>
              <p className="text-xs text-[#64748B]">Amount due (rate locked)</p>
              <p className="font-mono text-lg font-medium text-[#0F172A]">
                {lockedUsdc.toFixed(2)} USDC
              </p>
              <p className="text-xs text-[#94A3B8]">${amountUsd.toFixed(2)} USD equivalent</p>
            </div>
            <div className="text-right">
              <p className="flex items-center justify-end gap-1 text-xs text-[#64748B]">
                <Clock className="h-3.5 w-3.5" />
                Rate lock
              </p>
              <p className="font-mono text-lg font-medium text-[#D97706]">
                {rateLockExpired ? "Expired" : countdown || "15:00"}
              </p>
            </div>
          </div>
          {rateLockExpired ? (
            <p className="mt-2 text-xs text-amber-700">
              Rate lock expired — you can still pay, but verify the amount before sending.
            </p>
          ) : null}
        </div>

        <div className="flex border-b border-[#E2E8F0]">
          <button
            type="button"
            onClick={() => setTab("have-crypto")}
            className={`flex-1 px-4 py-3 text-sm font-medium transition ${
              tab === "have-crypto"
                ? "border-b-2 border-[#0D9488] text-[#0D9488]"
                : "text-[#64748B] hover:text-[#0F172A]"
            }`}
          >
            I Have Crypto
          </button>
          <button
            type="button"
            onClick={() => setTab("buy-crypto")}
            className={`flex-1 px-4 py-3 text-sm font-medium transition ${
              tab === "buy-crypto"
                ? "border-b-2 border-[#0D9488] text-[#0D9488]"
                : "text-[#64748B] hover:text-[#0F172A]"
            }`}
          >
            Buy Crypto Now
          </button>
        </div>

        <div className="space-y-4 px-6 py-5">
          {isPaid ? (
            <div className="rounded-xl border border-[#BBF7D0] bg-[#F0FDF4] p-4 text-sm text-[#166534]">
              Payment received. Redirecting to your orders…
            </div>
          ) : null}

          {isProcessing ? (
            <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              <RefreshCw className="h-4 w-4 animate-spin" />
              Payment detected on-chain — confirming…
            </div>
          ) : null}

          {polling && !isPaid ? (
            <p className="text-xs text-[#94A3B8]">Watching for payment every few seconds…</p>
          ) : null}

          {tab === "have-crypto" ? (
            <div className="space-y-4">
              {payUrl && !payUrl.includes("example.com") ? (
                <>
                  <div className="flex flex-col items-center rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-5">
                    <QRCodeSVG value={qrPayload} size={192} level="M" includeMargin />
                    <p className="mt-3 text-center text-xs text-[#64748B]">
                      Scan with your mobile wallet — opens{" "}
                      {provider === "btcpay" ? "BTCPay" : provider === "paymento" ? "Paymento" : "checkout"}{" "}
                      with amount pre-filled where supported (BIP21 / EIP-681).
                    </p>
                  </div>
                  <a
                    href={payUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-primary flex w-full items-center justify-center gap-2 py-3"
                  >
                    {provider === "btcpay"
                      ? "Open BTCPay checkout"
                      : provider === "paymento"
                        ? "Open Paymento checkout"
                        : "Open crypto checkout"}
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </>
              ) : (
                <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                  Payment link is loading. If this persists, contact support with your order ID.
                </p>
              )}
              <p className="flex items-start gap-2 text-xs text-[#64748B]">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#0D9488]" />
                Send the exact amount shown. This page updates automatically when your payment is detected.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-[#475569]">
                Need USDC first? Buy exactly{" "}
                <span className="font-medium text-[#0F172A]">{lockedUsdc.toFixed(2)} USDC</span> on an
                on-ramp, then return here — your session stays active for {countdown || "15:00"}.
              </p>
              {country ? (
                <p className="text-xs text-[#94A3B8]">
                  Detected region: {country} — showing recommended options
                </p>
              ) : null}
              <ul className="space-y-2">
                {onrampLinks.map((link) => (
                  <li key={link.id}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 transition hover:border-[#0D9488] hover:bg-[#F0FDFA]"
                    >
                      <div>
                        <p className="flex items-center gap-1 text-sm font-medium text-[#0F172A]">
                          <Wallet className="h-4 w-4 text-[#0D9488]" />
                          {link.label}
                        </p>
                        <p className="mt-0.5 text-xs text-[#64748B]">{link.description}</p>
                      </div>
                      <ArrowUpRight className="h-4 w-4 shrink-0 text-[#94A3B8]" />
                    </a>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => setTab("have-crypto")}
                className="btn-secondary w-full py-2.5 text-sm"
              >
                I bought crypto — show payment QR
              </button>
            </div>
          )}

          <div className="flex flex-col gap-2 border-t border-[#E2E8F0] pt-4">
            <Link href="/orders" className="text-center text-sm text-[#0D9488] hover:underline">
              View order history
            </Link>
            <Link href="/payment" className="text-center text-xs text-[#94A3B8] hover:text-[#0D9488]">
              How payments work
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
