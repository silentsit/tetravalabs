import Link from "next/link"
import Image from "next/image"
import dynamic from "next/dynamic"
import {
  ArrowRight,
  CheckCircle,
  Copy,
  CreditCard,
  Wallet
} from "lucide-react"
import type { Metadata } from "next"
import { FeaturedProducts } from "@/components/home/featured-products"
import { HeroProductStage } from "@/components/home/hero-product-stage"
import { HeroTrustStrip } from "@/components/home/hero-trust-strip"
import { BlogPostCard } from "@/components/blog-post-card"
import { ComplianceNotice } from "@/components/compliance-notice"
import { FaqAccordion } from "@/components/faq-accordion"
import { TrustBadgesRow } from "@/components/trust-badges"
import { categoryArt } from "@/lib/revamp/category-art"
import { groupProductsByCategory } from "@/lib/categories"
import { faqItems } from "@/lib/faq-content"
import { listProducts, getFeaturedCoaDocument } from "@/lib/medusa"
import { listBlogPosts } from "@/lib/sanity"
import { CoaDocumentPreview } from "@/components/coa-document-preview"
import { buildPageMetadata, faqJsonLd } from "@/lib/seo"

const LiveVisitorCounter = dynamic(
  () => import("@/components/social-proof-widget").then((mod) => mod.LiveVisitorCounter),
  { loading: () => <span className="inline-block h-5 w-40 animate-pulse rounded bg-[#E2E8F0]" /> }
)

const SocialProofReviews = dynamic(
  () => import("@/components/social-proof-widget").then((mod) => mod.SocialProofReviews),
  { loading: () => <div className="h-48 animate-pulse rounded-xl bg-[#E2E8F0]" /> }
)


export const metadata: Metadata = buildPageMetadata({
  title: "Buy Peptides Online",
  description:
    "Buy peptides online from Tetrava Labs. Research-grade peptides with verified purity and third-party lab testing.",
  path: "/",
  jsonLd: faqJsonLd(faqItems.slice(0, 4), "/")
})

export default async function HomePage() {
  const productsPromise = listProducts()
  const [products, featuredCoa, blogPosts] = await Promise.all([
    productsPromise,
    productsPromise.then(getFeaturedCoaDocument),
    listBlogPosts()
  ])
  const latestPosts = blogPosts.slice(0, 3)
  const grouped = groupProductsByCategory(products)
  const groupedBySlug = new Map(grouped.map((group) => [group.slug, group]))

  const homepageCategories = categoryArt
    .map((item) => ({
      ...item,
      productCount: groupedBySlug.get(item.slug)?.count ?? 0
    }))
    .filter((item) => item.productCount > 0)

  return (
    <>
      <section className="relative z-10 flex items-center overflow-x-clip overflow-y-visible bg-[#F8FAFC]">
        <div className="absolute inset-0 overflow-hidden">
          <div className="animate-mesh-1 absolute -left-20 -top-20 h-96 w-96 rounded-full bg-[#0D9488]/10 blur-3xl" />
          <div className="animate-mesh-2 absolute -right-20 top-20 h-80 w-80 rounded-full bg-[#2563EB]/10 blur-3xl" />
          <div className="animate-mesh-3 absolute bottom-10 left-1/3 h-72 w-72 rounded-full bg-[#0D9488]/10 blur-3xl" />
        </div>
        <div className="page-container relative grid w-full items-center gap-6 overflow-visible py-6 sm:py-8 lg:grid-cols-2 lg:gap-8 lg:py-4">
          <div className="flex flex-col justify-center">
            <span className="section-label mb-4">≥ 99%+ Purity Verified</span>
            <h1 className="font-serif text-4xl leading-[1.15] tracking-tight text-[#0F172A] sm:text-5xl lg:text-[3.25rem]">
              Buy Peptides Online.
              <span className="mt-2 block sm:mt-2.5">Peptides People Trust.</span>
            </h1>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-[#475569]">
              Research-grade peptides — 99%+ verified purity. 100% delivered. Guaranteed.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link href="/shop" className="btn-cta gap-2.5">
                Buy Peptides <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-5">
              <LiveVisitorCounter />
            </div>
          </div>
          <div className="relative flex items-end justify-center overflow-visible pb-0 lg:h-full">
            <HeroProductStage />
          </div>
        </div>
      </section>

      <HeroTrustStrip />

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
          <FeaturedProducts products={products} />
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="page-container">
          <div className="mb-10 text-center">
            <span className="section-label">How to Pay</span>
            <h2 className="mt-2 font-serif text-3xl text-[#0F172A]">Simple Payment System</h2>
            <p className="mt-2 text-[#475569]">Card or crypto at checkout. Your choice.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="card p-8">
              <CreditCard className="mb-4 h-10 w-10 text-[#2563EB]" />
              <h3 className="font-serif text-xl text-[#0F172A]">Credit &amp; Debit Cards</h3>
              <p className="mt-4 text-sm text-[#475569]">
                Pay with Visa, Mastercard, Amex, Apple Pay, or Google Pay through our secure hosted
                checkout page.
              </p>
              <Link href="/payment" className="mt-4 inline-flex text-sm font-medium text-[#0D9488]">
                View payment guide →
              </Link>
            </div>
            <div className="card p-8">
              <Wallet className="mb-4 h-10 w-10 text-[#0D9488]" />
              <h3 className="font-serif text-xl text-[#0F172A]">Cryptocurrency</h3>
              <p className="mt-4 text-sm text-[#475569]">
                Prefer crypto? Pay with BTC, USDT, ETH, and other supported assets at checkout.
              </p>
            </div>
          </div>
          <div className="mt-6 flex items-center gap-3 rounded-xl border border-[#FDE68A] bg-[#FEF3C7] p-4">
            <Copy className="h-5 w-5 shrink-0 text-[#D97706]" />
            <p className="text-sm text-[#D97706]/80">
              For crypto orders, paste our wallet address exactly as shown at checkout.
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-[#F8FAFC]">
        <div className="page-container">
          <div className="mb-10 text-center">
            <span className="section-label">Trust</span>
            <h2 className="mt-2 font-serif text-3xl text-[#0F172A]">
              The Best Place to Buy Peptides Online
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-[#475569]">
              Looking for the best place to buy peptides online? Tetrava Labs supplies research-grade
              peptides with verified purity, third-party lab testing, and lot-linked COAs — so you know
              exactly what you&apos;re ordering before it ships.
            </p>
          </div>
          <TrustBadgesRow />
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
              <div className="grid gap-4">
                <CoaDocumentPreview document={featuredCoa.document} compact />
                {featuredCoa.productHandle ? (
                  <Link
                    href={`/product/${featuredCoa.productHandle}`}
                    className="inline-flex items-center gap-1 text-sm font-medium text-[#0D9488] hover:text-[#0F766E]"
                  >
                    View {featuredCoa.productTitle || "product"} <ArrowRight className="h-4 w-4" />
                  </Link>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-[#F8FAFC]">
        <div className="page-container">
          <div className="mb-10">
            <span className="section-label">Browse</span>
            <h2 className="mt-2 font-serif text-3xl text-[#0F172A]">Shop by Research Area</h2>
            <p className="mt-2 text-[#475569]">Specialized compounds organized by application</p>
          </div>
          <div className="product-card-grid">
            {homepageCategories.slice(0, 6).map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="card card-hover group flex flex-col overflow-hidden"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-white">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    loading="lazy"
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                    className="object-cover opacity-80 transition-transform duration-500 group-hover:scale-105"
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
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {latestPosts.map((post) => (
              <BlogPostCard key={post.slug} post={post} compact />
            ))}
          </div>
        </div>
      </section>
      ) : null}

      <section className={`section-padding ${latestPosts.length > 0 ? "bg-[#F8FAFC]" : "bg-white"}`}>
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
