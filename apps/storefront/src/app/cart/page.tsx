export const dynamic = "force-dynamic"

import Link from "next/link"
import { CartPanel } from "@/components/cart-panel"

export default function CartPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-semibold">Cart</h1>
      <p className="text-[#8A8AA0]">Review your selected research compounds before checkout.</p>
      <CartPanel />
      <Link href="/checkout" className="inline-block rounded border border-white/20 px-4 py-2">
        Continue to Checkout
      </Link>
    </section>
  )
}
