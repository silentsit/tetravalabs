import Link from "next/link"

const links = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/faq", label: "FAQ" },
  { href: "/shipping", label: "Shipping" },
  { href: "/terms", label: "Terms" },
  { href: "/privacy", label: "Privacy" },
  { href: "/refund", label: "Refunds" },
  { href: "/ruo", label: "RUO Policy" }
]

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-white/10">
      <div className="mx-auto max-w-6xl space-y-4 px-4 py-8 text-sm text-[#8A8AA0]">
        <nav className="flex flex-wrap gap-4">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-[#E8E8F0]">
              {link.label}
            </Link>
          ))}
        </nav>
        <p>Tetrava Labs — Research Use Only. Not for human consumption.</p>
        <p className="text-xs">
          All products are intended strictly for in-vitro laboratory research by qualified professionals.
        </p>
      </div>
    </footer>
  )
}
