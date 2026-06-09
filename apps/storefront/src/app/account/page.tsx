import Link from "next/link"
import { AccountDashboard } from "@/components/account-dashboard"

export default function AccountPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-semibold">Account</h1>
      <p className="text-[#8A8AA0]">Manage your research account, orders, and compliance records.</p>
      <AccountDashboard />
      <p className="text-xs text-[#8A8AA0]">
        Need an account?{" "}
        <Link href="/register" className="text-[#5EEAD4]">
          Register here
        </Link>
        .
      </p>
    </section>
  )
}
