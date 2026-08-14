import type { Metadata } from "next"
import { AccountAuthPanel } from "@/components/account-auth-panel"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { buildPageMetadata } from "@/lib/seo"

export const metadata: Metadata = buildPageMetadata({
  title: "Create account",
  description: "Create a Tetrava Labs research account.",
  path: "/register",
  noIndex: true
})

export default function RegisterPage() {
  return (
    <section className="page-container space-y-8 py-8 sm:py-10 lg:py-12">
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Create account" }]}
        includeSchema={false}
      />
      <AccountAuthPanel />
    </section>
  )
}
