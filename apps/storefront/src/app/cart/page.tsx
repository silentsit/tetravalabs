export const dynamic = "force-dynamic"

import type { Metadata } from "next"
import Link from "next/link"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { CartPanel } from "@/components/cart-panel"
import { buildPageMetadata } from "@/lib/seo"

export const metadata: Metadata = buildPageMetadata({
  title: "Cart",
  description: "Review your selected research compounds before checkout.",
  path: "/cart",
  noIndex: true
})

export default function CartPage() {
  return (
    <section className="page-container space-y-6 py-8">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Cart" }]} />
      <div>
        <span className="section-label">Order</span>
        <h1 className="mt-2 font-serif text-4xl text-[#0F172A]">Cart</h1>
        <p className="mt-3 text-sm text-[#475569]">Review your selected research compounds before checkout.</p>
      </div>
      <CartPanel />
      <Link href="/checkout" className="btn-primary inline-flex">
        Continue to checkout
      </Link>
    </section>
  )
}
