import type { Metadata } from "next"
import { Suspense } from "react"
import { PaymentConfirmation } from "@/components/payment-confirmation"
import { buildPageMetadata } from "@/lib/seo"

export const metadata: Metadata = buildPageMetadata({
  title: "Payment",
  description: "Complete payment for your Tetrava Labs order.",
  path: "/checkout/payment",
  noIndex: true,
  registerWebPage: false
})

export default function CheckoutPaymentPage() {
  return (
    <Suspense fallback={<p className="text-sm text-[#8A8AA0]">Loading payment details...</p>}>
      <PaymentConfirmation />
    </Suspense>
  )
}
