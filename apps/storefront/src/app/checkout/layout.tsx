import type { Metadata } from "next"
import { buildPageMetadata } from "@/lib/seo"

export const metadata: Metadata = buildPageMetadata({
  title: "Checkout",
  description: "Complete your Tetrava Labs research order.",
  path: "/checkout",
  noIndex: true,
  registerWebPage: false
})

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return children
}
