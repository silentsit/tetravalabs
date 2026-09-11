import type { Metadata } from "next"
import { InvoiceOrdersPanel } from "@/components/account/invoice-orders-panel"
import { AccountPageHeader } from "@/components/account/account-page-header"
import { buildPageMetadata } from "@/lib/seo"

export const metadata: Metadata = buildPageMetadata({
  title: "Invoice orders",
  description: "Review on-hold card orders and mark payment received after the customer pays.",
  path: "/account/invoices",
  noIndex: true
})

export default function AccountInvoicesPage() {
  return (
    <>
      <AccountPageHeader
        title="Invoice orders"
        description="Awaiting card payment: send the customer their payment link, then mark payment received here. That moves the order to processing and emails the customer."
      />
      <InvoiceOrdersPanel />
    </>
  )
}
