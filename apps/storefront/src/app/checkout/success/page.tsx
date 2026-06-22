import { Suspense } from "react"
import { CheckoutSuccessContent } from "@/components/checkout-success"

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
