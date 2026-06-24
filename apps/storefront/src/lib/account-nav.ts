import type { LucideIcon } from "lucide-react"
import {
  Download,
  LayoutDashboard,
  LogOut,
  MapPin,
  ShoppingBag,
  User
} from "lucide-react"

export type AccountNavItem = {
  href: string
  label: string
  icon: LucideIcon
  exact?: boolean
}

export const ACCOUNT_NAV_ITEMS: AccountNavItem[] = [
  { href: "/account", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/account/orders", label: "Orders", icon: ShoppingBag },
  { href: "/account/downloads", label: "Downloads", icon: Download },
  { href: "/account/addresses", label: "Addresses", icon: MapPin },
  { href: "/account/details", label: "Account details", icon: User }
]

export const ACCOUNT_LOGOUT_ITEM = {
  label: "Log out",
  icon: LogOut
} as const

export function accountNavIsActive(pathname: string, item: AccountNavItem) {
  if (item.exact) return pathname === item.href
  return pathname === item.href || pathname.startsWith(`${item.href}/`)
}
