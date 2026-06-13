import type { Metadata } from "next"
import Link from "next/link"
import { listBlogPosts } from "@/lib/sanity"
import { Breadcrumbs } from "@/components/breadcrumbs"
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
    <section className="page-container mx-auto max-w-4xl space-y-8 py-8">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Research Hub" }]} />
      <div>
        <span className="section-label">Research Hub</span>
        <h1 className="mt-4 font-serif text-4xl text-[#0F172A] md:text-5xl">Research articles</h1>
        <p className="mt-4 max-w-2xl text-[#475569]">
          Protocol notes, handling guidance, and analytical documentation for qualified research buyers.
        </p>
      </div>
      <div className="grid gap-4">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="card card-hover block p-5"
          >
            <h2 className="font-serif text-xl text-[#0F172A]">{post.title}</h2>
            <p className="mt-2 text-sm text-[#475569]">{post.excerpt || "Research article"}</p>
            {post.publishedAt ? (
              <p className="mt-3 text-xs text-[#94A3B8]">
                {new Date(post.publishedAt).toLocaleDateString()}
              </p>
            ) : null}
          </Link>
        ))}
      </div>
    </section>
  )
}
