"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { AccountAuthPanel } from "@/components/account-auth-panel"
import { AccountSidebar } from "@/components/account/account-sidebar"
import { retrieveCustomer, type StoreCustomer } from "@/lib/medusa-auth"

type Props = {
  children: React.ReactNode
}

function AccountAuthSkeleton() {
  return (
    <div className="grid min-h-[1900px] gap-8 lg:min-h-[760px] lg:grid-cols-2 lg:gap-0">
      <div className="space-y-5 lg:border-r lg:border-dotted lg:border-[#CBD5E1] lg:pr-12 xl:pr-16">
        <div className="h-7 w-20 animate-pulse rounded bg-[#E2E8F0]" />
        <div className="h-12 animate-pulse rounded-md bg-[#E2E8F0]" />
        <div className="h-12 animate-pulse rounded-md bg-[#E2E8F0]" />
        <div className="h-10 w-28 animate-pulse rounded-md bg-[#E2E8F0]" />
      </div>
      <div className="space-y-5 lg:pl-12 xl:pl-16">
        <div className="h-7 w-24 animate-pulse rounded bg-[#E2E8F0]" />
        <div className="h-12 animate-pulse rounded-md bg-[#E2E8F0]" />
        <div className="h-12 animate-pulse rounded-md bg-[#E2E8F0]" />
        <div className="h-64 animate-pulse rounded-md bg-[#E2E8F0]" />
      </div>
    </div>
  )
}

export function AccountShell({ children }: Props) {
  const pathname = usePathname()
  const router = useRouter()
  const isOAuthRoute = pathname.startsWith("/account/oauth")
  const [customer, setCustomer] = useState<StoreCustomer | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    void retrieveCustomer().then((result) => {
      setCustomer(result)
      setLoading(false)
    })
  }, [pathname])

  useEffect(() => {
    if (loading || customer || pathname === "/account" || isOAuthRoute) return
    router.replace(`/account?returnUrl=${encodeURIComponent(pathname)}`)
  }, [customer, isOAuthRoute, loading, pathname, router])

  if (loading && !isOAuthRoute) {
    return <AccountAuthSkeleton />
  }

  if (isOAuthRoute) {
    return <>{children}</>
  }

  if (!customer) {
    if (pathname === "/account") {
      return <AccountAuthPanel />
    }
    return <p className="text-sm text-[#475569]">Redirecting to sign in...</p>
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <AccountSidebar />
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  )
}
