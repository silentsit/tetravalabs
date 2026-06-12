import Link from "next/link"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { AccountDashboard } from "@/components/account-dashboard"

export default function AccountPage() {
  return (
    <section className="page-container space-y-6 py-8">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Account" }]} />
      <div>
        <span className="section-label">Account</span>
        <h1 className="mt-2 font-serif text-4xl text-[#0F172A]">Your account</h1>
        <p className="mt-3 text-sm text-[#475569]">Manage your research account, orders, and compliance records.</p>
      </div>
      <AccountDashboard />
      <p className="text-xs text-[#475569]">
        Need an account?{" "}
        <Link href="/register" className="text-[#0D9488] hover:underline">
          Register here
        </Link>
        .
      </p>
    </section>
  )
}
