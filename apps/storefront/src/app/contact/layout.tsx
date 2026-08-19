import type { Metadata } from "next"
import { buildPageMetadata } from "@/lib/seo"

export const metadata: Metadata = buildPageMetadata({
  title: "Contact Tetrava Labs",
  absoluteTitle: "Contact Tetrava Labs | Customer & Technical Support",
  description:
    "Contact Tetrava Labs for research support, order questions, COA documents, and compliance inquiries.",
  path: "/contact",
  pageType: "ContactPage"
})

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
