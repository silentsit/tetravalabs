import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Clock } from "lucide-react"
import { getBlogPostBySlug, listBlogPosts } from "@/lib/sanity"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { BlogPostCard } from "@/components/blog-post-card"
import { ComplianceNotice } from "@/components/compliance-notice"
import {
  blogImageForCategory,
  formatReadTime,
  getRelatedBlogPosts,
  renderBlogParagraphs
} from "@/lib/blog-utils"
import { buildPageMetadata } from "@/lib/seo"

type Props = { params: Promise<{ slug: string }> }

export const revalidate = 600

export async function generateStaticParams() {
  const posts = await listBlogPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)
  if (!post) return {}
  const description = post.excerpt || "Research article from Tetrava Labs."
  return buildPageMetadata({
    title: post.title,
    description,
    path: `/blog/${slug}`,
    type: "article",
    publishedTime: post.publishedAt,
    registerWebPage: false
  })
}

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params
  const [post, allPosts] = await Promise.all([getBlogPostBySlug(slug), listBlogPosts()])
  if (!post) notFound()

  const related = getRelatedBlogPosts(allPosts, post)
  const paragraphs = renderBlogParagraphs(post.body)
  const heroImage = blogImageForCategory(post.category)

  return (
    <article className="page-container mx-auto max-w-3xl space-y-10 py-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Research Hub", href: "/blog" },
          { label: post.title }
        ]}
      />
      <header>
        <span className="section-label">Research Hub</span>
        {post.category ? (
          <span className="ml-3 inline-block rounded bg-[#CCFBF1] px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-[#0D9488]">
            {post.category}
          </span>
        ) : null}
        <h1 className="mt-4 font-serif text-4xl text-[#0F172A]">{post.title}</h1>
        <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-[#94A3B8]">
          <span>Tetrava Research Team</span>
          {post.publishedAt ? <span>{new Date(post.publishedAt).toLocaleDateString()}</span> : null}
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" aria-hidden />
            {formatReadTime(post.readTimeMinutes)}
          </span>
        </div>
        {post.excerpt ? <p className="mt-4 text-lg text-[#475569]">{post.excerpt}</p> : null}
      </header>

      <div className="relative aspect-video overflow-hidden rounded-xl border border-[#E2E8F0]">
        <Image
          src={heroImage}
          alt={post.title}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 768px"
          className="object-cover"
        />
      </div>

      <div className="card space-y-4 p-6 text-base leading-relaxed text-[#475569]">
        {paragraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 48)}>{paragraph}</p>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href="/shop" className="btn-primary inline-flex">
          Browse research compounds
        </Link>
        <Link href="/coa-library" className="btn-secondary inline-flex">
          View COA Library
        </Link>
      </div>

      <ComplianceNotice />

      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-sm text-[#475569] hover:text-[#0D9488]"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Back to Research Hub
      </Link>

      {related.length > 0 ? (
        <section className="border-t border-[#E2E8F0] pt-10">
          <h2 className="mb-6 font-serif text-2xl text-[#0F172A]">Related articles</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <BlogPostCard key={item.slug} post={item} compact />
            ))}
          </div>
        </section>
      ) : null}
    </article>
  )
}
