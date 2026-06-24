"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { AccountAuthPanel } from "@/components/account-auth-panel"
import { AccountSidebar } from "@/components/account/account-sidebar"
import {
  AUTH_SESSION_CHANGED_EVENT,
  retrieveCustomer,
  type StoreCustomer
} from "@/lib/medusa-auth"

type Props = {
  children: React.ReactNode
}

export function AccountShell({ children }: Props) {
  const pathname = usePathname()
  const router = useRouter()
  const isOAuthRoute = pathname.startsWith("/account/oauth")
  const [customer, setCustomer] = useState<StoreCustomer | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    const loadCustomer = () => {
      void retrieveCustomer().then((result) => {
        if (cancelled) return
        setCustomer(result)
        setLoading(false)
      })
    }

    loadCustomer()
    window.addEventListener(AUTH_SESSION_CHANGED_EVENT, loadCustomer)
    return () => {
      cancelled = true
      window.removeEventListener(AUTH_SESSION_CHANGED_EVENT, loadCustomer)
    }
  }, [pathname])

  useEffect(() => {
    if (loading || customer || pathname === "/account" || isOAuthRoute) return
    router.replace(`/account?returnUrl=${encodeURIComponent(pathname)}`)
  }, [customer, isOAuthRoute, loading, pathname, router])

  if (loading && !isOAuthRoute) {
    return <p className="text-sm text-[#475569]">Loading account...</p>
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
