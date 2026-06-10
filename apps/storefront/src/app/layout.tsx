import type { Metadata } from "next"
import Script from "next/script"
import "./globals.css"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { CartProvider } from "@/components/cart-provider"
import { SocialProofToast } from "@/components/social-proof-widget"

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
      <body>
        <CartProvider>
          <SiteHeader />
          <main className="mx-auto min-h-[70vh] w-full max-w-6xl px-4 py-8">{children}</main>
          <SiteFooter />
          <SocialProofToast />
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
