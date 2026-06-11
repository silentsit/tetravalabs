export const dynamic = "force-dynamic"

import { Breadcrumbs } from "@/components/breadcrumbs"
import { CartPanel } from "@/components/cart-panel"
import { CheckoutForm } from "@/components/checkout-form"

export default function CheckoutPage() {
  return (
    <section className="space-y-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Cart", href: "/cart" },
          { label: "Checkout" }
        ]}
      />
      <div>
        <p className="font-mono text-xs uppercase tracking-wider text-[#5EEAD4]">Order</p>
        <h1 className="mt-2 font-serif text-4xl text-[#E8E8F0]">Checkout</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#8A8AA0]">
          Crypto-first checkout with RUO compliance recording. Orders are placed through Medusa and
          completed via BTCPay or Paymento when configured.
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <CartPanel />
        <CheckoutForm />
      </div>
    </section>
  )
}
