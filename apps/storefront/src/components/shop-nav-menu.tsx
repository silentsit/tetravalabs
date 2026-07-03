"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { ChevronDown } from "lucide-react"
import { resolveActiveShopPill, shopNavLabel, shopNavLinks } from "@/lib/shop-filters"

function cn(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ")
}

type Props = {
  variant: "desktop" | "mobile"
  onNavigate?: () => void
}

export function ShopNavMenu({ variant, onNavigate }: Props) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const onShopRoute = pathname === "/shop"
  const activePill = onShopRoute ? resolveActiveShopPill(searchParams.get("category") || undefined) : "all"

  if (variant === "mobile") {
    return (
      <div className="space-y-4">
        <Link
          href="/shop"
          className={cn(
            "font-serif text-2xl transition-colors hover:text-[#0D9488]",
            onShopRoute ? "text-[#0D9488]" : "text-[#0F172A]"
          )}
          onClick={onNavigate}
        >
          {shopNavLabel}
        </Link>
        <ul className="ml-4 space-y-3 border-l border-[#E2E8F0] pl-4">
          {shopNavLinks.map((link) => {
            const isActive = onShopRoute && activePill === link.key
            return (
              <li key={link.key}>
                <Link
                  href={link.href}
                  className={cn(
                    "block text-base transition-colors hover:text-[#0D9488]",
                    isActive ? "font-medium text-[#0D9488]" : "text-[#475569]"
                  )}
                  onClick={onNavigate}
                >
                  {link.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }

  return (
    <div className="group relative">
      <Link
        href="/shop"
        className={cn(
          "inline-flex items-center gap-1 text-sm transition-colors",
          onShopRoute ? "font-medium text-[#0D9488]" : "text-[#475569] hover:text-[#0F172A]"
        )}
      >
        {shopNavLabel}
        <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180 group-focus-within:rotate-180" />
      </Link>

      <div className="invisible absolute left-0 top-full z-50 min-w-[220px] pt-2 opacity-0 transition-all group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
        <ul
          role="menu"
          aria-label={`${shopNavLabel} categories`}
          className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white py-1 shadow-lg"
        >
          {shopNavLinks.map((link) => {
            const isActive = onShopRoute && activePill === link.key
            return (
              <li key={link.key} role="none">
                <Link
                  href={link.href}
                  role="menuitem"
                  className={cn(
                    "block px-4 py-2.5 text-sm transition-colors hover:bg-[#F8FAFC] hover:text-[#0F172A]",
                    isActive ? "bg-[#F0FDFA] font-medium text-[#0D9488]" : "text-[#475569]"
                  )}
                >
                  {link.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
