import type { Metadata } from "next"
import { PaymentConfirmation } from "@/components/payment-confirmation"
import { buildPageMetadata } from "@/lib/seo"

export const metadata: Metadata = buildPageMetadata({
  title: "Payment",
  description: "Complete payment for your Tetrava Labs order.",
  path: "/checkout/payment",
  noIndex: true,
  registerWebPage: false
})

type PageProps = {
  searchParams: Promise<{
    order_id?: string
    display_id?: string
    total?: string
    onramp?: string
  }>
}

export default async function CheckoutPaymentPage({ searchParams }: PageProps) {
  const params = await searchParams

  return (
    <PaymentConfirmation
      orderId={params.order_id ?? ""}
      displayId={params.display_id ?? ""}
      total={params.total ?? ""}
      onrampFromUrl={params.onramp ?? ""}
    />
  )
}
