export const dynamic = "force-dynamic"

import Link from "next/link"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { CheckoutForm } from "@/components/checkout-form"

type PageProps = {
  searchParams: Promise<{ card_onramp?: string }>
}

export default async function CheckoutPage({ searchParams }: PageProps) {
  const params = await searchParams

  return (
    <section className="page-container space-y-6 py-6 pb-20 sm:space-y-8 sm:py-8 sm:pb-24 lg:pb-28">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Cart", href: "/cart" },
          { label: "Checkout" }
        ]}
        includeSchema={false}
      />
      <div>
        <span className="section-label">Order</span>
        <h1 className="mt-2 font-serif text-3xl text-[#0F172A] sm:text-4xl">Checkout</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#475569]">
          Pay by card or cryptocurrency. All orders require RUO acknowledgment before fulfillment.{" "}
          <Link href="/payment" className="text-[#0D9488] hover:underline">
            Payment guide
          </Link>
        </p>
      </div>
      <CheckoutForm initialCardOnramp={params.card_onramp} />
    </section>
  )
}
