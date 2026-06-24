import type { Metadata } from "next"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { AccountShell } from "@/components/account/account-shell"
import { buildPageMetadata } from "@/lib/seo"

export const metadata: Metadata = buildPageMetadata({
  title: "Account",
  description: "Manage your Tetrava Labs research account.",
  path: "/account",
  noIndex: true
})

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="page-container py-8 sm:py-10 lg:py-12">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "My Account", href: "/account" }]} />
      <AccountShell>{children}</AccountShell>
    </section>
  )
}
