import type { Metadata } from "next"
import dynamic from "next/dynamic"
import Script from "next/script"
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
import {
  clampMetaDescription,
  organizationJsonLd,
  resolveMetaTitles,
  siteConfig,
  websiteJsonLd
} from "@/lib/seo"

const SocialProofToast = dynamic(
  () => import("@/components/social-proof-widget").then((mod) => mod.SocialProofToast),
  { ssr: false }
)
const AiChatWidget = dynamic(
  () => import("@/components/ai-chat-widget").then((mod) => mod.AiChatWidget),
  { ssr: false }
)

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
  variable: "--font-mono",
  preload: false
})

const defaultSiteTitle = resolveMetaTitles({
  title: `${siteConfig.name} — ${siteConfig.tagline}`
}).fullTitle
const defaultSiteDescription = clampMetaDescription(siteConfig.description)

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: defaultSiteTitle,
    template: `%s | ${siteConfig.titleBrand}`
  },
  description: defaultSiteDescription,
  keywords: siteConfig.keywords,
  openGraph: {
    title: defaultSiteTitle,
    description: defaultSiteDescription,
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    type: "website",
    images: [{ url: siteConfig.defaultOgImage, alt: siteConfig.name }]
  },
  twitter: {
    card: "summary_large_image",
    title: defaultSiteTitle,
    description: defaultSiteDescription,
    images: [siteConfig.defaultOgImage],
    ...(siteConfig.twitterHandle ? { site: siteConfig.twitterHandle } : {})
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
  const gaMeasurementId =
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() || "G-YZ9KZMZZLW"
  const jsonLdGraph = [organizationJsonLd(), websiteJsonLd()]

  return (
    <html lang="en">
      <head>
        {/* Google tag (gtag.js) — single install for all pages */}
        <Script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaMeasurementId}');
          `}
        </Script>
        <JsonLd graph={jsonLdGraph} />
        <link rel="alternate" type="text/plain" href="/llms.txt" title="LLM context" />
        <link rel="alternate" type="text/markdown" href="/auth.md" title="Agent auth" />
        <link rel="api-catalog" href="/.well-known/api-catalog" />
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
          <AiChatWidget />
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
