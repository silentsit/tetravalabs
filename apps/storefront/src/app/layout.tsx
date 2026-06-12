import type { Metadata } from "next"
import Script from "next/script"
import "./globals.css"
import { CartDrawer } from "@/components/cart-drawer"
import { CartProvider } from "@/components/cart-provider"
import { ScrollToTop } from "@/components/scroll-to-top"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { SocialProofToast } from "@/components/social-proof-widget"
import { TrustBar } from "@/components/trust-bar"

export const metadata: Metadata = {
  title: "Tetrava Labs",
  description: "Research-use peptide ecommerce storefront"
}

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN

  return (
    <html lang="en">
      <body className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
        <CartProvider>
          <SiteHeader />
          <TrustBar />
          <main>{children}</main>
          <SiteFooter />
          <CartDrawer />
          <SocialProofToast />
          <ScrollToTop />
        </CartProvider>
        {plausibleDomain ? (
          <Script
            defer
            data-domain={plausibleDomain}
            src="https://plausible.io/js/script.js"
            strategy="afterInteractive"
          />
        ) : null}
      </body>
    </html>
  )
}
