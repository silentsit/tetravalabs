import { Link } from 'react-router-dom';
import { FlaskConical } from 'lucide-react';

const shopLinks = [
  { label: 'GLP-1 Research', href: '/shop?category=glp-1-research' },
  { label: 'Growth Factors', href: '/shop?category=growth-factors' },
  { label: 'Research Blends', href: '/shop?category=research-blends' },
  { label: 'Lab Supplies', href: '/shop?category=lab-supplies' },
];

const supportLinks = [
  { label: 'Shipping & Returns', href: '/shipping' },
  { label: 'COA Requests', href: '/coa' },
  { label: 'Contact', href: '/contact' },
  { label: 'FAQ', href: '/faq' },
];

const legalLinks = [
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'RUO Disclaimer', href: '/ruo-disclaimer' },
  { label: 'Refund Policy', href: '/refund-policy' },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#0A0A10]">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2">
              <FlaskConical className="h-5 w-5 text-[#5EEAD4]" />
              <span className="font-mono text-sm tracking-[0.15em] text-[#E8E8F0]">
                TETRAVA
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-[#8A8AA0]">
              Research-Use-Only Compounds
            </p>
            <p className="mt-2 text-xs leading-relaxed text-[#5A5A70]">
              Premium peptides and research materials for qualified laboratory professionals.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="mb-4 text-xs font-medium uppercase tracking-[0.05em] text-[#5A5A70]">
              Shop
            </h4>
            <ul className="space-y-3">
              {shopLinks.map(link => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-[#8A8AA0] transition-colors hover:text-[#E8E8F0]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="mb-4 text-xs font-medium uppercase tracking-[0.05em] text-[#5A5A70]">
              Support
            </h4>
            <ul className="space-y-3">
              {supportLinks.map(link => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-[#8A8AA0] transition-colors hover:text-[#E8E8F0]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="mb-4 text-xs font-medium uppercase tracking-[0.05em] text-[#5A5A70]">
              Legal
            </h4>
            <ul className="space-y-3">
              {legalLinks.map(link => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-[#8A8AA0] transition-colors hover:text-[#E8E8F0]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] pt-8 sm:flex-row">
          <p className="text-xs text-[#5A5A70]">
            &copy; {new Date().getFullYear()} Tetrava Labs. All rights reserved.
          </p>
          <p className="text-xs text-[#FBBF24]/60">
            Research Use Only. Not for human consumption.
          </p>
        </div>
      </div>
    </footer>
  );
}
