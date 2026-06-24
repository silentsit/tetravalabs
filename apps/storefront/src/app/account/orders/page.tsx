import type { Metadata } from "next"
import { AccountOrdersPanel } from "@/components/account/account-orders-panel"
import { AccountPageHeader } from "@/components/account/account-page-header"
import { buildPageMetadata } from "@/lib/seo"

export const metadata: Metadata = buildPageMetadata({
  title: "Orders",
  description: "View your Tetrava Labs order history.",
  path: "/account/orders",
  noIndex: true
})

type Props = {
  searchParams: Promise<{ payment?: string }>
}

export default async function AccountOrdersPage({ searchParams }: Props) {
  const { payment } = await searchParams

  return (
    <>
      <AccountPageHeader
        title="Orders"
        description="Review past purchases, line items, and payment status linked to your account."
      />
      {payment === "complete" ? (
        <p className="mb-6 rounded-xl border border-[#0D9488]/30 bg-[#CCFBF1] px-4 py-3 text-sm text-[#0D9488]">
          Payment received — thank you. Fulfillment will begin once the transaction is confirmed.
        </p>
      ) : null}
      <AccountOrdersPanel />
    </>
  )
}
