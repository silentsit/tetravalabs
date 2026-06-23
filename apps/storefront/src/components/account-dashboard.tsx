"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AccountAuthPanel } from "@/components/account-auth-panel"
import { logoutCustomer, retrieveCustomer, type StoreCustomer } from "@/lib/medusa-auth"
import { PurchaseHistory } from "@/components/purchase-history"

export function AccountDashboard() {
  const router = useRouter()
  const [customer, setCustomer] = useState<StoreCustomer | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    void retrieveCustomer().then((result) => {
      setCustomer(result)
      setLoading(false)
    })
  }, [])

  const onSignOut = async () => {
    await logoutCustomer()
    setCustomer(null)
    router.refresh()
  }

  if (loading) {
    return <p className="text-sm text-[#475569]">Loading account...</p>
  }

  if (!customer) {
    return <AccountAuthPanel />
  }

  const name = [customer.first_name, customer.last_name].filter(Boolean).join(" ") || "Research Customer"

  return (
    <div className="space-y-6">
      <div className="card p-5">
        <p className="text-xs uppercase tracking-wide text-[#0D9488]">Signed in</p>
        <h2 className="mt-2 text-xl font-medium text-[#0F172A]">{name}</h2>
        <p className="mt-1 text-sm text-[#475569]">{customer.email}</p>
        <button type="button" onClick={onSignOut} className="btn-secondary mt-4">
          Sign out
        </button>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <Link href="/orders" className="card card-hover p-4">
          <h3 className="text-lg text-[#0F172A]">Order history</h3>
          <p className="text-xs text-[#475569]">View Medusa orders linked to this account.</p>
        </Link>
        <Link href="/coa-library" className="card card-hover p-4">
          <h3 className="text-lg text-[#0F172A]">COA library</h3>
          <p className="text-xs text-[#475569]">Access batch COA and HPLC documents.</p>
        </Link>
      </div>
      <div className="card p-5">
        <PurchaseHistory limit={5} compact showHeading />
      </div>
    </div>
  )
}
