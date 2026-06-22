import type { Metadata } from "next"
import { buildPageMetadata } from "@/lib/seo"

export const metadata: Metadata = buildPageMetadata({
  title: "Payment confirmed",
  description: "Your Tetrava Labs order payment is being confirmed.",
  path: "/checkout/success",
  noIndex: true
})

export default function CheckoutSuccessLayout({ children }: { children: React.ReactNode }) {
  return children
}
