import type { Metadata } from "next"
import Link from "next/link"
import { buildPageMetadata } from "@/lib/seo"

export const metadata: Metadata = buildPageMetadata({
  title: "Page not found",
  description:
    "The page you requested does not exist on tetravalabs.com. Browse the research peptide catalog or return home.",
  path: "/404",
  noIndex: true
})

export default function NotFound() {
  return (
    <div className="page-container py-24 text-center">
      <h1 className="font-serif text-3xl text-[#0F172A] sm:text-4xl">Page not found</h1>
      <p className="mt-3 text-sm text-[#475569]">The page you requested does not exist.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link href="/" className="btn-primary min-h-11">
          Back to home
        </Link>
        <Link href="/shop" className="btn-secondary min-h-11">
          Browse shop
        </Link>
      </div>
    </div>
  )
}
