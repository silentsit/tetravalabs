import Link from "next/link"
import { FooterAcceptedPayments } from "@/components/footer-accepted-payments"
import { SiteLogo } from "@/components/site-logo"

const shopLinks = [
  { label: "All Products", href: "/shop" },
  { label: "GLP-1 Research", href: "/category/glp-1-research" },
  { label: "Tissue Repair", href: "/category/tissue-repair" },
  { label: "Lab Supplies", href: "/category/lab-supplies" },
  { label: "My Account", href: "/account" }
]

const helpLinks = [
  { label: "How to Pay", href: "/payment" },
  { label: "FAQ", href: "/faq" },
  { label: "Refund & Delivery", href: "/refund" }
]

const resourceLinks = [
  { label: "Tetrava Labs", href: "/" },
  { label: "COA Library", href: "/coa-library" },
  { label: "Research Hub", href: "/blog" },
  { label: "Sitemap", href: "/sitemap" },
  { label: "RUO Disclaimer", href: "/ruo" }
]

const columns = [
  { title: "Shop", links: shopLinks },
  { title: "Help", links: helpLinks },
  { title: "Resources", links: resourceLinks }
] as const

export function SiteFooter() {
  return (
    <footer className="bg-[#0F172A] text-white">
      <div className="page-container py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
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
            &copy; {new Date().getFullYear()} Tetrava Labs. All rights reserved.{" "}
            <Link href="/terms" className="transition-colors hover:text-white">
              Terms of Service
            </Link>
            <span className="mx-1.5 text-[#475569]">|</span>
            <Link href="/privacy" className="transition-colors hover:text-white">
              Privacy Policy
            </Link>
          </p>
          <p className="max-w-2xl text-center text-[11px] leading-relaxed text-[#D97706]/80 sm:text-right">
            FDA Disclaimer: These statements have not been evaluated by the Food and Drug
            Administration (or HSA in Singapore). These products are not intended to diagnose,
            treat, cure, or prevent any disease. Always consult with a qualified healthcare
            professional before beginning any diet, exercise, or supplementation program,
            especially if you are pregnant, nursing, or taking medications.
          </p>
        </div>
      </div>
    </footer>
  )
}
