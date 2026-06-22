export const dynamic = "force-dynamic"

import { Breadcrumbs } from "@/components/breadcrumbs"
import { CartPanel } from "@/components/cart-panel"
import { CheckoutForm } from "@/components/checkout-form"

export default function CheckoutPage() {
  return (
    <section className="page-container space-y-6 py-6 sm:space-y-8 sm:py-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Cart", href: "/cart" },
          { label: "Checkout" }
        ]}
      />
      <div>
        <span className="section-label">Order</span>
        <h1 className="mt-2 font-serif text-3xl text-[#0F172A] sm:text-4xl">Checkout</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#475569]">
          Pay securely by card or cryptocurrency. All orders require RUO acknowledgment before
          fulfillment.{" "}
          <a href="/payment" className="text-[#0D9488] hover:underline">
            Payment guide
          </a>
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-start">
        <div className="order-2 lg:order-1">
          <CartPanel />
        </div>
        <div className="order-1 lg:order-2 lg:sticky lg:top-6">
          <CheckoutForm />
        </div>
      </div>
    </section>
  )
}
