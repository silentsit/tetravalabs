import Link from "next/link"
import {
  ArrowRight,
  CheckCircle,
  Copy,
  CreditCard,
  FileCheck,
  Wallet
} from "lucide-react"
import type { Metadata } from "next"
import { ProductCard } from "@/components/product-card"
import { BlogPostCard } from "@/components/blog-post-card"
import { ComplianceNotice } from "@/components/compliance-notice"
import { FaqAccordion } from "@/components/faq-accordion"
import { TrustBadgesRow } from "@/components/trust-badges"
import { LiveVisitorCounter, SocialProofReviews } from "@/components/social-proof-widget"
import { categoryArt, categoryArtForSlug } from "@/lib/revamp/category-art"
import { groupProductsByCategory } from "@/lib/categories"
import { faqItems } from "@/lib/faq-content"
import { listProducts, listRecentCoas } from "@/lib/medusa"
import { listBlogPosts } from "@/lib/sanity"
import { CoaDocumentPreview } from "@/components/coa-document-preview"
import { buildPageMetadata } from "@/lib/seo"

export const metadata: Metadata = buildPageMetadata({
  title: "Research-Grade Peptides — Verified, Documented, Delivered",
  description:
    "Shop HPLC-MS verified research peptides with lot-linked COAs, cold-chain shipping, and crypto checkout for qualified laboratories.",
  path: "/"
})

export default async function HomePage() {
  const [products, recentCoas, blogPosts] = await Promise.all([
    listProducts(),
    listRecentCoas(3),
    listBlogPosts()
  ])
  const latestPosts = blogPosts.slice(0, 3)
  const grouped = groupProductsByCategory(products)
  const featured = products.slice(0, 8)

  const categories = grouped.slice(0, 4).map((group) => {
    const art = categoryArtForSlug(group.slug, group.name)
    return { ...art, name: group.name, slug: group.slug, productCount: group.count }
  })

  const fallbackCategories =
    categories.length >= 4
      ? categories
      : categoryArt.map((item) => ({
          ...item,
          productCount: products.filter((p) =>
            String(p.metadata?.source_category || "")
              .toLowerCase()
              .includes(item.name.split(" ")[0].toLowerCase())
          ).length
        }))

  return (
    <>
      <section className="relative overflow-hidden bg-[#F8FAFC]">
        <div className="absolute inset-0 overflow-hidden">
          <div className="animate-mesh-1 absolute -left-20 -top-20 h-96 w-96 rounded-full bg-[#0D9488]/10 blur-3xl" />
          <div className="animate-mesh-2 absolute -right-20 top-20 h-80 w-80 rounded-full bg-[#2563EB]/10 blur-3xl" />
          <div className="animate-mesh-3 absolute bottom-10 left-1/3 h-72 w-72 rounded-full bg-[#0D9488]/10 blur-3xl" />
        </div>
        <div className="page-container relative grid gap-10 py-20 lg:grid-cols-2 lg:py-28">
          <div className="flex flex-col justify-center">
            <span className="section-label mb-4">Research-Grade Peptides</span>
            <h1 className="font-serif text-4xl leading-[1.1] text-[#0F172A] sm:text-5xl lg:text-[3.5rem]">
              Verified. Documented. Delivered.
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-[#475569]">
              99%+ purity. HPLC-MS tested. Lot-linked COAs. Cold-chain shipping worldwide. Every batch
              verified by independent third-party laboratories.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/shop" className="btn-cta gap-2">
                Shop Catalog <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/coa-library" className="btn-secondary gap-2">
                <FileCheck className="h-4 w-4" /> View COA Library
              </Link>
            </div>
            <div className="mt-6">
              <LiveVisitorCounter />
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative aspect-[4/3] w-full max-w-lg overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-sm">
              <img
                src="/v2/hero-products.jpg"
                alt="Research peptide vials"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="page-container">
          <div className="mb-10">
            <span className="section-label">Browse</span>
            <h2 className="mt-2 font-serif text-3xl text-[#0F172A]">Shop by Research Area</h2>
            <p className="mt-2 text-[#475569]">Specialized compounds organized by application</p>
          </div>
          <div className="product-card-grid">
            {fallbackCategories.slice(0, 4).map((cat) => (
              <Link
                key={cat.slug}
                href={`/shop?category=${cat.slug}`}
                className="card card-hover group flex flex-col overflow-hidden"
              >
                <div className="aspect-[16/10] overflow-hidden bg-[#F8FAFC]">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="h-full w-full object-cover opacity-70 transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-serif text-xl text-[#0F172A] transition-colors group-hover:text-[#0D9488]">
                    {cat.name}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm text-[#94A3B8]">{cat.description}</p>
                  <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-medium text-[#0D9488]">
                    Explore <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-[#F8FAFC]">
        <div className="page-container">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <span className="section-label">Popular</span>
              <h2 className="mt-2 font-serif text-3xl text-[#0F172A]">Most Requested</h2>
              <p className="mt-2 text-[#475569]">Frequently reordered by research institutions</p>
            </div>
            <Link
              href="/shop"
              className="hidden items-center gap-1 text-sm font-medium text-[#0D9488] hover:text-[#0F766E] sm:flex"
            >
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="product-card-grid">
            {featured.length === 0 ? (
              <p className="col-span-full rounded-xl border border-[#E2E8F0] bg-white p-6 text-sm text-[#475569]">
                Catalog is loading from Medusa. If this persists, check NEXT_PUBLIC_MEDUSA_URL in
                .env.local.
              </p>
            ) : (
              featured.map((product) => <ProductCard key={product.id} product={product} />)
            )}
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="page-container">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="section-label">Transparency</span>
              <h2 className="mt-2 font-serif text-3xl text-[#0F172A]">See the Data Before You Buy</h2>
              <p className="mt-4 leading-relaxed text-[#475569]">
                Every batch is independently tested using HPLC-MS analysis. We publish lot-linked
                Certificates of Analysis for compounds in our catalog.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "HPLC purity verification (≥99%)",
                  "Mass spectrometry molecular weight confirmation",
                  "Batch-specific COAs with chromatograms",
                  "Free download for all verified customers"
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-[#475569]">
                    <CheckCircle className="h-4 w-4 shrink-0 text-[#0D9488]" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/coa-library" className="btn-primary mt-6 gap-2">
                Browse COA Library <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 shadow-sm">
              {recentCoas.length > 0 ? (
                <div className="grid gap-4">
                  {recentCoas.slice(0, 1).map((doc) => (
                    <CoaDocumentPreview key={doc.id} document={doc} compact />
                  ))}
                </div>
              ) : (
                <img src="/v2/coa-preview.jpg" alt="Certificate of Analysis preview" className="rounded-xl" />
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-[#F1F5F9]">
        <div className="page-container">
          <div className="mb-10 text-center">
            <span className="section-label">Trust</span>
            <h2 className="mt-2 font-serif text-3xl text-[#0F172A]">Why Researchers Choose Tetrava</h2>
          </div>
          <TrustBadgesRow />
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="page-container">
          <div className="mb-10 text-center">
            <span className="section-label">Testimonials</span>
            <h2 className="mt-2 font-serif text-3xl text-[#0F172A]">Trusted by Researchers Worldwide</h2>
          </div>
          <SocialProofReviews />
        </div>
      </section>

      <section className="section-padding bg-[#F8FAFC]">
        <div className="page-container">
          <div className="mb-10 text-center">
            <span className="section-label">Payments</span>
            <h2 className="mt-2 font-serif text-3xl text-[#0F172A]">Simple Payment System</h2>
            <p className="mt-2 text-[#475569]">Two paths. Zero friction.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="card p-8">
              <Wallet className="mb-4 h-10 w-10 text-[#0D9488]" />
              <h3 className="font-serif text-xl text-[#0F172A]">Have Crypto?</h3>
              <p className="mt-4 text-sm text-[#475569]">Pay with BTC, USDT, ETH and more at checkout.</p>
            </div>
            <div className="card p-8">
              <CreditCard className="mb-4 h-10 w-10 text-[#2563EB]" />
              <h3 className="font-serif text-xl text-[#0F172A]">New to Crypto?</h3>
              <p className="mt-4 text-sm text-[#475569]">
                Follow our payment guide to fund a wallet and complete your order.
              </p>
              <Link href="/payment" className="mt-4 inline-flex text-sm font-medium text-[#0D9488]">
                View payment guide →
              </Link>
            </div>
          </div>
          <div className="mt-6 flex items-center gap-3 rounded-xl border border-[#FDE68A] bg-[#FEF3C7] p-4">
            <Copy className="h-5 w-5 shrink-0 text-[#D97706]" />
            <p className="text-sm text-[#D97706]/80">
              When prompted, paste our wallet address exactly as shown at checkout.
            </p>
          </div>
        </div>
      </section>

      {latestPosts.length > 0 ? (
      <section className="section-padding bg-white">
        <div className="page-container">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="section-label">Research Hub</span>
              <h2 className="mt-2 font-serif text-3xl text-[#0F172A]">Latest research articles</h2>
              <p className="mt-2 text-[#475569]">Protocols, analytics, and compliance for qualified buyers</p>
            </div>
            <Link href="/blog" className="inline-flex items-center gap-1 text-sm font-medium text-[#0D9488] hover:text-[#0F766E]">
              View all articles <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {latestPosts.map((post) => (
              <BlogPostCard key={post.slug} post={post} compact />
            ))}
          </div>
        </div>
      </section>
      ) : null}

      <section className="section-padding bg-white">
        <div className="page-container max-w-3xl">
          <div className="mb-8 text-center">
            <span className="section-label">Support</span>
            <h2 className="mt-2 font-serif text-3xl text-[#0F172A]">Common Questions</h2>
          </div>
          <FaqAccordion items={faqItems.slice(0, 4)} />
          <div className="mt-8 text-center">
            <Link
              href="/faq"
              className="inline-flex items-center gap-1 text-sm font-medium text-[#0D9488] hover:text-[#0F766E]"
            >
              View All FAQs <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <div className="page-container max-w-3xl pb-16">
        <ComplianceNotice />
      </div>
    </>
  )
}
