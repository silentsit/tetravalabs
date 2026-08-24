"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  ACCOUNT_ADMIN_NAV_ITEMS,
  ACCOUNT_LOGOUT_ITEM,
  ACCOUNT_NAV_ITEMS,
  accountNavIsActive,
  type AccountNavItem
} from "@/lib/account-nav"
import { isStoreAdminEmail } from "@/lib/admin-access"
import { logoutCustomer, retrieveCustomer } from "@/lib/medusa-auth"

function NavLink({ item, pathname }: { item: AccountNavItem; pathname: string }) {
  const active = accountNavIsActive(pathname, item)
  const Icon = item.icon
  return (
    <li className="border-b border-[#E2E8F0] last:border-b-0">
      <Link
        href={item.href}
        className={`flex min-h-11 items-center gap-3 px-4 py-3.5 text-sm transition-colors ${
          active
            ? "bg-[#0F172A] font-medium text-white"
            : "text-[#334155] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
        }`}
      >
        <Icon className="h-[18px] w-[18px] shrink-0" aria-hidden />
        {item.label}
      </Link>
    </li>
  )
}

export function AccountSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const LogoutIcon = ACCOUNT_LOGOUT_ITEM.icon
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    void retrieveCustomer().then((customer) => {
      setIsAdmin(isStoreAdminEmail(customer?.email))
    })
  }, [])

  const onLogout = async () => {
    await logoutCustomer()
    router.push("/account")
    router.refresh()
  }

  return (
    <nav aria-label="Account sections" className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white">
      <ul>
        {ACCOUNT_NAV_ITEMS.map((item) => (
          <NavLink key={item.href} item={item} pathname={pathname} />
        ))}
        {isAdmin
          ? ACCOUNT_ADMIN_NAV_ITEMS.map((item) => (
              <NavLink key={item.href} item={item} pathname={pathname} />
            ))
          : null}
        <li className="border-t border-[#E2E8F0]">
          <button
            type="button"
            onClick={onLogout}
            className="flex min-h-11 w-full items-center gap-3 px-4 py-3.5 text-left text-sm text-[#334155] transition-colors hover:bg-[#F8FAFC] hover:text-[#0F172A]"
          >
            <LogoutIcon className="h-[18px] w-[18px] shrink-0" aria-hidden />
            {ACCOUNT_LOGOUT_ITEM.label}
          </button>
        </li>
      </ul>
    </nav>
  )
}
