"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useCart } from "@/components/cart-provider"
import { SearchBar } from "@/components/search-bar"
import { logoutCustomer, retrieveCustomer, type StoreCustomer } from "@/lib/medusa-auth"

const links = [
  { href: "/shop", label: "Shop" },
  { href: "/categories", label: "Categories" },
  { href: "/search", label: "Search" },
  { href: "/coa-library", label: "COA Library" },
  { href: "/blog", label: "Research" },
  { href: "/faq", label: "FAQ" }
]

export function SiteHeader() {
  const router = useRouter()
  const pathname = usePathname()
  const { totalItems } = useCart()
  const [customer, setCustomer] = useState<StoreCustomer | null>(null)

  useEffect(() => {
    void retrieveCustomer().then(setCustomer)
  }, [pathname])

  const onSignOut = async () => {
    await logoutCustomer()
    setCustomer(null)
    router.push("/")
  }

  return (
    <header className="border-b border-white/10 bg-[#0A0A10]/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="text-lg font-semibold tracking-wide text-[#E8E8F0]">
          Tetrava Labs
        </Link>
        <SearchBar className="order-3 w-full sm:order-none sm:w-auto" />
        <nav className="flex flex-wrap items-center gap-4 text-sm text-[#8A8AA0]">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-[#E8E8F0]">
              {link.label}
            </Link>
          ))}
          <Link href="/cart" className="hover:text-[#E8E8F0]">
            Cart ({totalItems})
          </Link>
          {customer ? (
            <>
              <Link href="/account" className="hover:text-[#E8E8F0]">
                Account
              </Link>
              <button type="button" onClick={onSignOut} className="hover:text-[#E8E8F0]">
                Sign Out
              </button>
            </>
          ) : (
            <Link href="/login" className="hover:text-[#E8E8F0]">
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
