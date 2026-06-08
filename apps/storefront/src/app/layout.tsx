import type { Metadata } from "next"
import "./globals.css"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { CartProvider } from "@/components/cart-provider"

export const metadata: Metadata = {
  title: "Tetrava Labs",
  description: "Research-use peptide ecommerce storefront"
}

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <SiteHeader />
          <main className="mx-auto min-h-[70vh] w-full max-w-6xl px-4 py-8">{children}</main>
          <SiteFooter />
        </CartProvider>
      </body>
    </html>
  )
}
