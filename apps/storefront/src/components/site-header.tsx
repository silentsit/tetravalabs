"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Suspense, useEffect, useRef, useState } from "react"
import { ArrowRight, Menu, Search, ShoppingCart, X } from "lucide-react"
import { useCart } from "@/components/cart-provider"
import { ShopNavMenu } from "@/components/shop-nav-menu"
import { SiteLogo } from "@/components/site-logo"
import { shopNavLabel } from "@/lib/shop-filters"

const navLinks = [
  { label: "How To Pay", href: "/payment" },
  { label: "Categories", href: "/categories" },
  { label: "Research Hub", href: "/blog" },
  { label: "COA Library", href: "/coa-library" },
  { label: "About", href: "/about" }
]

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const { totalItems, setIsOpen } = useCart()
  const pathname = usePathname()
  const router = useRouter()
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    let frame = 0
    const onScroll = () => {
      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(() => {
        setScrolled(window.scrollY > 50)
      })
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener("scroll", onScroll)
    }
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setSearchOpen(false)
  }, [pathname])

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus()
  }, [searchOpen])

  const submitSearch = () => {
    const q = searchQuery.trim()
    setSearchOpen(false)
    if (q) router.push(`/search?q=${encodeURIComponent(q)}`)
  }

  return (
    <>
      <header
        className={`sticky top-0 z-50 h-16 border-b bg-white/95 backdrop-blur-md transition-all duration-200 ${
          scrolled ? "border-slate-200 shadow-sm" : "border-slate-200/60"
        }`}
      >
        <div className="page-container flex h-full items-center justify-between">
          <Link href="/" className="flex shrink-0 items-center">
            <SiteLogo className="w-[156px] sm:w-[216px]" />
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <Suspense
              fallback={
                <Link href="/shop" className="text-sm text-[#475569] hover:text-[#0F172A]">
                  {shopNavLabel}
                </Link>
              }
            >
              <ShopNavMenu variant="desktop" />
            </Suspense>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm transition-colors ${
                  pathname === link.href
                    ? "font-medium text-[#0D9488]"
                    : "text-[#475569] hover:text-[#0F172A]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="text-[#475569] transition-colors hover:text-[#0F172A]"
            >
              <Search className="h-5 w-5" />
            </button>
            <Link href="/account" className="text-[#475569] transition-colors hover:text-[#0F172A]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </Link>
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="relative text-[#475569] transition-colors hover:text-[#0F172A]"
            >
              <ShoppingCart className="h-5 w-5" />
              <span
                className={`absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-medium text-white transition-opacity ${
                  totalItems > 0 ? "bg-[#0D9488] opacity-100" : "bg-[#0D9488] opacity-0"
                }`}
                aria-hidden={totalItems === 0}
              >
                {totalItems > 0 ? totalItems : "0"}
              </span>
            </button>
            <button
              type="button"
              className="text-[#475569] transition-colors hover:text-[#0F172A] md:hidden"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {searchOpen ? (
        <div
          className="fixed inset-0 z-[70] bg-black/40 backdrop-blur-sm"
          onClick={() => setSearchOpen(false)}
        >
          <div
            className="absolute left-1/2 top-20 w-full max-w-2xl -translate-x-1/2 px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-2xl">
              <div className="flex items-center gap-3 border-b border-[#E2E8F0] px-5 py-4">
                <Search className="h-5 w-5 text-[#94A3B8]" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") submitSearch()
                  }}
                  placeholder="Search compounds, categories, strengths..."
                  className="flex-1 bg-transparent text-base text-[#0F172A] outline-none placeholder:text-[#94A3B8]"
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="text-[#94A3B8] hover:text-[#0F172A]"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="border-t border-[#E2E8F0] px-5 py-4">
                <button
                  type="button"
                  onClick={submitSearch}
                  className="flex w-full items-center justify-center gap-2 text-sm text-[#0D9488] transition-colors hover:text-[#0F766E]"
                >
                  Search catalog <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {mobileOpen ? (
        <div className="fixed inset-0 z-[60] bg-white">
          <div className="flex h-full flex-col p-6">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex shrink-0 items-center">
                <SiteLogo className="w-[180px] sm:w-[216px]" />
              </Link>
              <button type="button" onClick={() => setMobileOpen(false)} className="text-[#475569]">
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="mt-10 flex flex-col gap-6">
              <Suspense fallback={<Link href="/shop" className="font-serif text-2xl text-[#0F172A]">{shopNavLabel}</Link>}>
                <ShopNavMenu variant="mobile" onNavigate={() => setMobileOpen(false)} />
              </Suspense>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-serif text-2xl text-[#0F172A] transition-colors hover:text-[#0D9488]"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="mt-auto flex flex-col gap-3 sm:flex-row">
              <Link
                href="/account"
                className="inline-flex justify-center rounded-lg border border-[#0D9488] px-6 py-2.5 text-sm font-medium text-[#0D9488] transition-colors hover:bg-[#0D9488] hover:text-white"
              >
                Sign In
              </Link>
              <Link
                href="/account"
                className="inline-flex justify-center rounded-lg bg-[#0D9488] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#0F766E]"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
