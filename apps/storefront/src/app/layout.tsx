import type { Metadata } from "next"
import { headers } from "next/headers"
import "./globals.css"
import "@/lib/json-ld-registry"
import { CartDrawer } from "@/components/cart-drawer"
import { CartProvider } from "@/components/cart-provider"
import { JsonLd } from "@/components/json-ld"
import { ScrollToTop } from "@/components/scroll-to-top"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { SocialProofToast } from "@/components/social-proof-widget"
import { TrustBar } from "@/components/trust-bar"
import { resolvePageJsonLd } from "@/lib/json-ld-store"
import { organizationJsonLd, siteConfig, websiteJsonLd, webPageJsonLd } from "@/lib/seo"
import Script from "next/script"

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  alternates: { canonical: siteConfig.url },
  openGraph: {
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description
  },
  robots: { index: true, follow: true },
  icons: {
    icon: "/brand/tetravalabs-icon.jpg",
    apple: "/brand/tetravalabs-icon.jpg"
  }
}

export default async function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN
  const pathname = (await headers()).get("x-pathname") || "/"
  const pageGraphs = await resolvePageJsonLd(pathname)
  const fallbackPageGraph =
    pageGraphs.length === 0
      ? [
          webPageJsonLd({
            title: siteConfig.name,
            description: siteConfig.description,
            path: pathname
          })
        ]
      : pageGraphs

  const jsonLdGraph = [organizationJsonLd(), websiteJsonLd(), ...fallbackPageGraph]

  return (
    <html lang="en">
      <head>
        <JsonLd graph={jsonLdGraph} />
        <link rel="alternate" type="text/plain" href="/llms.txt" title="LLM context" />
      </head>
      <body className="min-h-screen overflow-x-hidden bg-[#F8FAFC] text-[#0F172A]">
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
