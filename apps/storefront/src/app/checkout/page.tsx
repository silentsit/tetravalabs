export const dynamic = "force-dynamic"

import Link from "next/link"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { CheckoutForm } from "@/components/checkout-form"

export default function CheckoutPage() {
  return (
    <section className="page-container space-y-6 py-6 pb-20 sm:space-y-8 sm:py-8 sm:pb-24 lg:pb-28">
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
      <p className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 text-sm text-[#475569]">
        Returning customer?{" "}
        <Link href="/login" className="font-medium text-[#0D9488] hover:underline">
          Click here to log in
        </Link>
      </p>
      <CheckoutForm />
    </section>
  )
}
