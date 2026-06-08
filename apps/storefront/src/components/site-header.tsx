"use client"

import Link from "next/link"
import { useCart } from "@/components/cart-provider"

const links = [
  { href: "/shop", label: "Shop" },
  { href: "/coa-library", label: "COA Library" },
  { href: "/blog", label: "Research" },
  { href: "/checkout", label: "Checkout" }
]

export function SiteHeader() {
  const { totalItems } = useCart()

  return (
    <header className="border-b border-white/10 bg-[#0A0A10]/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-semibold tracking-wide">
          Tetrava Labs
        </Link>
        <nav className="flex gap-5 text-sm text-[#8A8AA0]">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-[#E8E8F0]">
              {link.label}
            </Link>
          ))}
          <Link href="/cart" className="hover:text-[#E8E8F0]">
            Cart ({totalItems})
          </Link>
        </nav>
      </div>
    </header>
  )
}
