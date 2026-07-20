import type { Metadata } from "next"
import { Suspense } from "react"
import { CheckoutSuccessContent } from "@/components/checkout-success"
import { buildPageMetadata } from "@/lib/seo"

export const metadata: Metadata = buildPageMetadata({
  title: "Order confirmed",
  description: "Your Tetrava Labs order confirmation.",
  path: "/checkout/success",
  noIndex: true,
  registerWebPage: false
})

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <p className="page-container py-12 text-center text-sm text-[#475569]">Loading confirmation…</p>
      }
    >
      <CheckoutSuccessContent />
    </Suspense>
  )
}
