export const dynamic = "force-dynamic"

import Link from "next/link"

export default function AccountPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-semibold">Account</h1>
      <p className="text-[#8A8AA0]">Customer account workspace for orders and compliance.</p>
      <div className="grid gap-3 md:grid-cols-2">
        <Link href="/orders" className="rounded-lg border border-white/10 bg-[#0A0A10] p-4">
          <h2 className="text-lg">Order History</h2>
          <p className="text-xs text-[#8A8AA0]">View previously placed research orders.</p>
        </Link>
        <Link href="/coa-library" className="rounded-lg border border-white/10 bg-[#0A0A10] p-4">
          <h2 className="text-lg">COA Library</h2>
          <p className="text-xs text-[#8A8AA0]">Access COA/HPLC files by batch and variant.</p>
        </Link>
      </div>
    </section>
  )
}
