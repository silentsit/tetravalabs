"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  ACCOUNT_LOGOUT_ITEM,
  ACCOUNT_NAV_ITEMS,
  accountNavIsActive
} from "@/lib/account-nav"
import { logoutCustomer } from "@/lib/medusa-auth"

export function AccountSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const LogoutIcon = ACCOUNT_LOGOUT_ITEM.icon

  const onLogout = async () => {
    await logoutCustomer()
    router.push("/account")
    router.refresh()
  }

  return (
    <nav aria-label="Account sections" className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white">
      <ul>
        {ACCOUNT_NAV_ITEMS.map((item) => {
          const active = accountNavIsActive(pathname, item)
          const Icon = item.icon
          return (
            <li key={item.href} className="border-b border-[#E2E8F0] last:border-b-0">
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3.5 text-sm transition-colors ${
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
        })}
        <li className="border-t border-[#E2E8F0]">
          <button
            type="button"
            onClick={onLogout}
            className="flex w-full items-center gap-3 px-4 py-3.5 text-left text-sm text-[#334155] transition-colors hover:bg-[#F8FAFC] hover:text-[#0F172A]"
          >
            <LogoutIcon className="h-[18px] w-[18px] shrink-0" aria-hidden />
            {ACCOUNT_LOGOUT_ITEM.label}
          </button>
        </li>
      </ul>
    </nav>
  )
}
