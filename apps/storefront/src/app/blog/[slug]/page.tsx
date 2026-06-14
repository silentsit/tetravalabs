import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { getBlogPostBySlug, listBlogPosts } from "@/lib/sanity"
import { Breadcrumbs } from "@/components/breadcrumbs"
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
  const post = await getBlogPostBySlug(slug)
  if (!post) notFound()

  return (
    <article className="page-container mx-auto max-w-3xl space-y-8 py-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Research Hub", href: "/blog" },
          { label: post.title }
        ]}
      />
      <header>
        <span className="section-label">Research Hub</span>
        <h1 className="mt-4 font-serif text-4xl text-[#0F172A]">{post.title}</h1>
        {post.publishedAt ? (
          <p className="mt-3 text-sm text-[#94A3B8]">
            {new Date(post.publishedAt).toLocaleDateString()}
          </p>
        ) : null}
        {post.excerpt ? <p className="mt-4 text-lg text-[#475569]">{post.excerpt}</p> : null}
      </header>
      <div className="card space-y-4 p-6 text-base leading-relaxed text-[#475569]">
        {(post.body || "").split("\n\n").map((paragraph) => (
          <p key={paragraph.slice(0, 40)}>{paragraph}</p>
        ))}
      </div>
      <Link href="/shop" className="btn-primary inline-flex">
        Browse research compounds
      </Link>
    </article>
  )
}
