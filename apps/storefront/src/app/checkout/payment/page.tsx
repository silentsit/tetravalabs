import { Suspense } from "react"
import { PaymentConfirmation } from "@/components/payment-confirmation"

export default function CheckoutPaymentPage() {
  return (
    <Suspense fallback={<p className="text-sm text-[#8A8AA0]">Loading payment details...</p>}>
      <PaymentConfirmation />
    </Suspense>
  )
}
