import type { Metadata } from "next"
import { buildPageMetadata } from "@/lib/seo"

export const metadata: Metadata = buildPageMetadata({
  title: "Contact research support",
  description:
    "Reach Tetrava Labs for order questions, COA requests, shipping, and qualified laboratory support.",
  path: "/contact"
})

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
