export const dynamic = "force-dynamic"

import { CartPanel } from "@/components/cart-panel"
import { CheckoutForm } from "@/components/checkout-form"

export default function CheckoutPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-semibold">Checkout</h1>
      <p className="text-[#8A8AA0]">
        Crypto-first checkout with RUO compliance recording. Orders are placed through Medusa and
        completed via BTCPay when configured.
      </p>
      <div className="grid gap-4 lg:grid-cols-2">
        <CartPanel />
        <CheckoutForm />
      </div>
    </section>
  )
}
