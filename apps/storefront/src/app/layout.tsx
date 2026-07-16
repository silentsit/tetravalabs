import type { Metadata } from "next"
import { headers } from "next/headers"
import { JetBrains_Mono, Jost, Lora } from "next/font/google"
import "./globals.css"
import "@/lib/json-ld-registry"
import { AnnouncementBar } from "@/components/announcement-bar"
import { CartDrawer } from "@/components/cart-drawer"
import { CartProvider } from "@/components/cart-provider"
import { JsonLd } from "@/components/json-ld"
import { ScrollToTop } from "@/components/scroll-to-top"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { SocialProofToast } from "@/components/social-proof-widget"
import { resolvePageJsonLd } from "@/lib/json-ld-store"
import {
  clampMetaDescription,
  organizationJsonLd,
  resolveMetaTitles,
  siteConfig,
  websiteJsonLd,
  webPageJsonLd
} from "@/lib/seo"
import Script from "next/script"

const jost = Jost({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-jost"
})

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-lora"
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono"
})

const defaultSiteTitle = resolveMetaTitles({
  title: `${siteConfig.name} — ${siteConfig.tagline}`
}).fullTitle
const defaultSiteDescription = clampMetaDescription(siteConfig.description)

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: defaultSiteTitle,
    template: `%s | ${siteConfig.name}`
  },
  description: defaultSiteDescription,
  keywords: siteConfig.keywords,
  alternates: { canonical: siteConfig.url },
  openGraph: {
    title: defaultSiteTitle,
    description: defaultSiteDescription,
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: defaultSiteTitle,
    description: defaultSiteDescription
  },
  robots: { index: true, follow: true },
  icons: {
    icon: "/brand/tetravalabs-icon.png",
    apple: "/brand/tetravalabs-icon.png"
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
      <body
        className={`${jost.variable} ${lora.variable} ${jetbrainsMono.variable} min-h-screen overflow-x-hidden bg-[#F8FAFC] text-[#0F172A]`}
      >
        <CartProvider>
          <AnnouncementBar />
          <SiteHeader />
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
