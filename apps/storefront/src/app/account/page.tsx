import { Breadcrumbs } from "@/components/breadcrumbs"
import { AccountDashboard } from "@/components/account-dashboard"

export default function AccountPage() {
  return (
    <section className="page-container py-8 sm:py-10 lg:py-12">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "My Account" }]} />
      <AccountDashboard />
    </section>
  )
}