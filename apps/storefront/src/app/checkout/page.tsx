export const dynamic = "force-dynamic"

import { Breadcrumbs } from "@/components/breadcrumbs"
import { CartPanel } from "@/components/cart-panel"
import { CheckoutForm } from "@/components/checkout-form"

export default function CheckoutPage() {
  return (
    <section className="page-container space-y-8 py-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Cart", href: "/cart" },
          { label: "Checkout" }
        ]}
      />
      <div>
        <span className="section-label">Order</span>
        <h1 className="mt-2 font-serif text-4xl text-[#0F172A]">Checkout</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#475569]">
          Crypto-first checkout with RUO compliance recording. Orders are placed through Medusa and completed
          via BTCPay or Paymento when configured.{" "}
          <a href="/payment" className="text-[#0D9488] hover:underline">
            Payment guide
          </a>
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <CartPanel />
        <CheckoutForm />
      </div>
    </section>
  )
}
