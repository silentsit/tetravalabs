import type { Metadata } from "next"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { OrdersList } from "@/components/orders-list"
import { buildPageMetadata } from "@/lib/seo"

export const metadata: Metadata = buildPageMetadata({
  title: "Order history",
  description: "View past orders or look up a guest checkout with your email and order number.",
  path: "/orders",
  noIndex: true
})

type Props = {
  searchParams: Promise<{ payment?: string }>
}

export default async function OrdersPage({ searchParams }: Props) {
  const { payment } = await searchParams

  return (
    <section className="page-container space-y-6 py-8">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Orders" }]} />
      <div>
        <span className="section-label">Account</span>
        <h1 className="mt-2 font-serif text-4xl text-[#0F172A]">Order history</h1>
      </div>
      {payment === "complete" ? (
        <p className="rounded-xl border border-[#0D9488]/30 bg-[#CCFBF1] px-4 py-3 text-sm text-[#0D9488]">
          Payment received — thank you. Fulfillment will begin once the transaction is confirmed.
        </p>
      ) : null}
      <p className="text-sm text-[#475569]">
        Signed-in customers see purchase history with line items automatically. Guest checkouts can be
        retrieved with the email and order number from your confirmation — or saved locally in this browser.
      </p>
      <OrdersList />
    </section>
  )
}
