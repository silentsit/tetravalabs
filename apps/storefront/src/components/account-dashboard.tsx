"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { logoutCustomer, retrieveCustomer, type StoreCustomer } from "@/lib/medusa-auth"

export function AccountDashboard() {
  const router = useRouter()
  const [customer, setCustomer] = useState<StoreCustomer | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    void retrieveCustomer().then((result) => {
      if (!result) {
        router.replace("/login")
        return
      }
      setCustomer(result)
      setLoading(false)
    })
  }, [router])

  const onSignOut = async () => {
    await logoutCustomer()
    router.push("/login")
  }

  if (loading) {
    return <p className="text-sm text-[#8A8AA0]">Loading account...</p>
  }

  if (!customer) return null

  const name = [customer.first_name, customer.last_name].filter(Boolean).join(" ") || "Research Customer"

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-white/10 bg-[#0A0A10] p-5">
        <p className="text-xs uppercase tracking-wide text-[#5EEAD4]">Signed in</p>
        <h2 className="mt-2 text-xl font-medium text-[#E8E8F0]">{name}</h2>
        <p className="mt-1 text-sm text-[#8A8AA0]">{customer.email}</p>
        <button
          type="button"
          onClick={onSignOut}
          className="mt-4 rounded border border-white/20 px-4 py-2 text-sm text-[#E8E8F0] hover:border-[#5EEAD4]"
        >
          Sign out
        </button>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <Link href="/orders" className="rounded-lg border border-white/10 bg-[#0A0A10] p-4">
          <h3 className="text-lg text-[#E8E8F0]">Order History</h3>
          <p className="text-xs text-[#8A8AA0]">View Medusa orders linked to this account.</p>
        </Link>
        <Link href="/coa-library" className="rounded-lg border border-white/10 bg-[#0A0A10] p-4">
          <h3 className="text-lg text-[#E8E8F0]">COA Library</h3>
          <p className="text-xs text-[#8A8AA0]">Access batch COA and HPLC documents.</p>
        </Link>
      </div>
    </div>
  )
}
