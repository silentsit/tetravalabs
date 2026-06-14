"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { GuidedWalletModal } from "@/components/guided-wallet-modal"
import {
  createPaymentSession,
  loadPaymentSession,
  savePaymentSession
} from "@/lib/payment-session"

const payUrlKey = (orderId: string) => `tetrava_pay_${orderId}`

type PaymentBootstrap = {
  payUrl: string
  provider: string
  totalUsd: number
  cryptoAsset: string
}

export function PaymentConfirmation() {
  const params = useSearchParams()
  const orderId = params.get("order_id") || ""
  const displayId = params.get("display_id") || undefined
  const totalParam = params.get("total") || ""
  const assetParam = params.get("asset") || "USDT"
  const [bootstrap, setBootstrap] = useState<PaymentBootstrap | null>(null)

  useEffect(() => {
    if (!orderId) return

    const session = loadPaymentSession(orderId)
    const storedUrl = sessionStorage.getItem(payUrlKey(orderId)) || ""
    const payUrl = session?.providerUrl || storedUrl
    const provider = session?.provider || ""
    const totalUsd =
      session?.totalUsd ||
      (totalParam ? Number(totalParam) : 0) ||
      0
    const cryptoAsset = session?.cryptoAsset || assetParam

    if (!session && totalUsd > 0) {
      savePaymentSession(
        createPaymentSession({
          orderId,
          displayId,
          totalUsd,
          providerUrl: payUrl,
          provider,
          cryptoAsset
        })
      )
    }

    setBootstrap({ payUrl, provider, totalUsd, cryptoAsset })
  }, [orderId, displayId, totalParam, assetParam])

  if (!orderId) {
    return (
      <section className="page-container mx-auto max-w-xl py-8">
        <p className="text-sm text-[#475569]">Missing order ID. Return to checkout to place an order.</p>
      </section>
    )
  }

  if (!bootstrap) {
    return (
      <section className="page-container mx-auto max-w-xl py-8">
        <p className="text-sm text-[#475569]">Loading payment details…</p>
      </section>
    )
  }

  return (
    <>
      <section className="page-container mx-auto max-w-xl space-y-4 py-8">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Checkout", href: "/checkout" },
            { label: "Payment" }
          ]}
        />
        <p className="text-sm text-[#475569]">
          Your order is waiting for payment. Use the modal below to pay with crypto or buy USDC first.
        </p>
      </section>
      <GuidedWalletModal
        orderId={orderId}
        displayId={displayId}
        totalUsd={bootstrap.totalUsd}
        initialPayUrl={bootstrap.payUrl}
        initialProvider={bootstrap.provider}
        cryptoAsset={bootstrap.cryptoAsset}
      />
    </>
  )
}

export function storePaymentUrl(
  orderId: string,
  url: string,
  meta?: { provider?: string; totalUsd?: number; cryptoAsset?: string; displayId?: string }
) {
  if (typeof window === "undefined") return
  sessionStorage.setItem(payUrlKey(orderId), url)

  const existing = loadPaymentSession(orderId)
  if (existing) {
    savePaymentSession({ ...existing, providerUrl: url, provider: meta?.provider || existing.provider })
    return
  }

  if (meta?.totalUsd) {
    savePaymentSession(
      createPaymentSession({
        orderId,
        displayId: meta.displayId,
        totalUsd: meta.totalUsd,
        providerUrl: url,
        provider: meta.provider || "",
        cryptoAsset: meta.cryptoAsset || "USDT"
      })
    )
  }
}
