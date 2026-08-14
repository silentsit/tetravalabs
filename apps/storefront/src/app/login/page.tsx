import type { Metadata } from "next"
import { AccountAuthPanel } from "@/components/account-auth-panel"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { buildPageMetadata } from "@/lib/seo"

export const metadata: Metadata = buildPageMetadata({
  title: "Sign in",
  description: "Sign in to your Tetrava Labs research account.",
  path: "/login",
  noIndex: true
})

export default function LoginPage() {
  return (
    <section className="page-container space-y-8 py-8 sm:py-10 lg:py-12">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Sign in" }]} includeSchema={false} />
      <AccountAuthPanel />
    </section>
  )
}
