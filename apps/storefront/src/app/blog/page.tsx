import Image from "next/image"
import type { Metadata } from "next"
import { listBlogPosts } from "@/lib/sanity"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { BlogHub } from "@/components/blog-hub"
import { buildPageMetadata } from "@/lib/seo"

export const revalidate = 600

export const metadata: Metadata = buildPageMetadata({
  title: "Research Hub — articles & protocols",
  description:
    "Protocol notes, peptide handling guidance, and analytical documentation for qualified research buyers.",
  path: "/blog"
})

export default async function BlogPage() {
  const posts = await listBlogPosts()

  return (
    <div className="min-h-screen pb-16">
      <section className="relative overflow-hidden bg-[#F8FAFC]">
        <div className="page-container grid gap-10 py-12 lg:grid-cols-2 lg:items-center lg:py-16">
          <div>
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Research Hub" }]} />
            <span className="section-label mt-6 inline-block">Knowledge Base</span>
            <h1 className="mt-3 font-serif text-4xl text-[#0F172A] md:text-5xl">Research Hub</h1>
            <p className="mt-4 max-w-xl text-[#475569]">
              Protocols, analytical methods, and compliance guidance for qualified research buyers.
            </p>
          </div>
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-[#E2E8F0] shadow-sm">
            <Image
              src="/v2/blog-research.jpg"
              alt="Laboratory research documentation"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="page-container pt-10">
        <BlogHub posts={posts} />
      </section>
    </div>
  )
}
