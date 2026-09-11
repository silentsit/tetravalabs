import type { Metadata } from "next"
import { Suspense } from "react"
import { CheckoutThankYouContent } from "@/components/checkout-thank-you"
import { buildPageMetadata } from "@/lib/seo"

export const metadata: Metadata = buildPageMetadata({
  title: "Order received",
  description: "Your Tetrava Labs order is recorded. Check email for your payment link.",
  path: "/checkout/thank-you",
  noIndex: true,
  registerWebPage: false
})

export default function CheckoutThankYouPage() {
  return (
    <Suspense
      fallback={
        <p className="page-container py-12 text-center text-sm text-[#475569]">Loading confirmation…</p>
      }
    >
      <CheckoutThankYouContent />
    </Suspense>
  )
}
