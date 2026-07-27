import Link from "next/link"
import { FooterAcceptedPayments } from "@/components/footer-accepted-payments"
import { SiteLogo } from "@/components/site-logo"

const shopLinks = [
  { label: "Shop", href: "/shop" },
  { label: "GLP-1 Research", href: "/category/glp-1-research" },
  { label: "Tissue Repair", href: "/category/tissue-repair" },
  { label: "Lab Supplies", href: "/category/lab-supplies" },
  { label: "Orders", href: "/account/orders" }
]

const helpLinks = [
  { label: "How to Pay", href: "/payment" },
  { label: "Shipping", href: "/shipping" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
  { label: "Refund & Delivery", href: "/refund" }
]

const resourceLinks = [
  { label: "COA Library", href: "/coa-library" },
  { label: "Research Hub", href: "/blog" },
  { label: "RUO Disclaimer", href: "/ruo" }
]

const companyLinks = [
  { label: "About", href: "/about" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" }
]

const columns = [
  { title: "Shop", links: shopLinks },
  { title: "Help", links: helpLinks },
  { title: "Resources", links: resourceLinks },
  { title: "Company", links: companyLinks }
] as const

export function SiteFooter() {
  return (
    <footer className="bg-[#0F172A] text-white">
      <div className="page-container py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div>
            <Link href="/" className="inline-flex shrink-0 items-center">
              <SiteLogo variant="footer" />
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-[#94A3B8]">
              Research-grade peptides and compounds for qualified laboratory professionals.
            </p>
            <FooterAcceptedPayments />
          </div>
          {columns.map((column) => (
            <div key={column.title}>
              <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                {column.title}
              </h4>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-[#94A3B8] transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[#1E293B] pt-8 sm:flex-row">
          <p className="text-xs text-[#64748B]">
            &copy; {new Date().getFullYear()} Tetrava Labs. All rights reserved.
          </p>
          <p className="max-w-xl text-center text-xs leading-relaxed text-[#D97706]/80 sm:text-right">
            FDA Disclaimer: All products are for laboratory and research use only. Not for human
            consumption.
          </p>
        </div>
      </div>
    </footer>
  )
}
