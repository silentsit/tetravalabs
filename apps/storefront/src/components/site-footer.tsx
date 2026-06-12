import Link from "next/link"

function FooterLogoIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M10 2v6.292a7 7 0 1 0 4 0V2" />
      <path d="M5 2h14" />
      <path d="M8.5 2h7" />
    </svg>
  )
}

const shopLinks = [
  { label: "GLP-1 Research", href: "/shop?category=glp-1-research" },
  { label: "Growth Factors", href: "/shop?category=growth-factors" },
  { label: "Research Blends", href: "/shop?category=research-blends" },
  { label: "Lab Supplies", href: "/shop?category=lab-supplies" }
]

const supportLinks = [
  { label: "COA Library", href: "/coa-library" },
  { label: "Research Hub", href: "/blog" },
  { label: "Shipping", href: "/shipping" },
  { label: "Contact", href: "/contact" },
  { label: "FAQ", href: "/faq" }
]

const legalLinks = [
  { label: "Terms of Service", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "RUO Disclaimer", href: "/ruo" },
  { label: "Refund Policy", href: "/refund" }
]

export function SiteFooter() {
  return (
    <footer className="bg-[#0F172A] text-white">
      <div className="page-container py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <FooterLogoIcon className="h-5 w-5 text-[#0D9488]" />
              <span className="font-mono text-sm font-medium tracking-[0.15em]">
                TETRAVA<span className="ml-1 text-[#64748B]">Labs</span>
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-[#94A3B8]">
              Research-grade peptides and compounds for qualified laboratory professionals.
            </p>
          </div>
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-[#64748B]">Shop</h4>
            <ul className="space-y-3">
              {shopLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-[#94A3B8] transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-[#64748B]">Support</h4>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-[#94A3B8] transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-[#64748B]">Legal</h4>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-[#94A3B8] transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[#1E293B] pt-8 sm:flex-row">
          <p className="text-xs text-[#64748B]">&copy; {new Date().getFullYear()} Tetrava Labs. All rights reserved.</p>
          <p className="text-xs text-[#D97706]/80">Research Use Only. Not for human consumption.</p>
        </div>
      </div>
    </footer>
  )
}
