import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { getBlogPostBySlug, listBlogPosts } from "@/lib/sanity"
import { listProductsByHandles, type StoreProduct } from "@/lib/medusa"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { BlogBody } from "@/components/blog-body"
import { BlogPostCard } from "@/components/blog-post-card"
import { BlogTableOfContents } from "@/components/blog-table-of-contents"
import { CitationFootnote } from "@/components/citation-footnote"
import { ComplianceNotice } from "@/components/compliance-notice"
import { PageJsonLd } from "@/components/page-json-ld"
import { YoutubeEmbed } from "@/components/youtube-embed"
import { EditorialByline } from "@/components/editorial-byline"
import { ArticleShareLinks } from "@/components/article-share-links"
import {
  blogImageForPost,
  collectProductEmbedHandles,
  collectBlogHeadings,
  formatReadTime,
  getRelatedBlogPosts,
  isMeaningfullyUpdated
} from "@/lib/blog-utils"
import { buildPageMetadata, pageUrl, siteConfig } from "@/lib/seo"
import { getAuthor } from "@/lib/authors"

type Props = { params: Promise<{ slug: string }> }

export const revalidate = 600
/** Retired and unknown slugs 404 instead of redirecting to `/blog`. */
export const dynamicParams = false

export async function generateStaticParams() {
  const posts = await listBlogPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)
  if (!post) {
    return buildPageMetadata({
      title: "Article Not Found",
      path: `/blog/${slug}`,
      noIndex: true
    })
  }
  const description =
    post.seoDescription || post.excerpt || "Research article from Tetrava Labs."
  const editorialAuthor = getAuthor("editorial-team")
  return buildPageMetadata({
    title: post.seoTitle || post.title,
    absoluteTitle: post.seoTitle,
    description,
    keywords: post.keywords,
    authors: [{ name: editorialAuthor.name, url: pageUrl(editorialAuthor.url || "/about") }],
    publisher: siteConfig.name,
    path: `/blog/${slug}`,
    type: "article",
    publishedTime: post.publishedAt,
    ogTitle: post.title,
    ogEyebrow: post.category || "Research Hub",
    ogKicker: editorialAuthor.name,
    image: blogImageForPost(post),
    registerWebPage: false
  })
}

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params
  const [post, allPosts] = await Promise.all([getBlogPostBySlug(slug), listBlogPosts()])
  if (!post) notFound()

  const related = getRelatedBlogPosts(allPosts, post)
  const heroImage = blogImageForPost(post)
  const video = post.video?.youtubeId ? post.video : null
  const embedHandles = collectProductEmbedHandles(post.body)
  const embedProducts =
    embedHandles.length > 0 ? await listProductsByHandles(embedHandles) : []
  const productsByHandle = new Map<string, StoreProduct>()
  for (const product of embedProducts) {
    productsByHandle.set(product.handle, product)
    productsByHandle.set(product.handle.toLowerCase(), product)
  }

  return (
    <article className="page-container mx-auto max-w-3xl space-y-10 py-8">
      <PageJsonLd pathname={`/blog/${slug}`} />
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
        <div className="mt-4">
          <EditorialByline
            variant="compact"
            publishedAt={post.publishedAt}
            updatedAt={
              isMeaningfullyUpdated(post.publishedAt, post.updatedAt) ? post.updatedAt : undefined
            }
            readTime={formatReadTime(post.readTimeMinutes)}
          />
        </div>
        {post.excerpt ? <p className="mt-4 text-lg text-[#475569]">{post.excerpt}</p> : null}
        <div className="mt-6">
          <ArticleShareLinks url={pageUrl(`/blog/${slug}`)} title={post.title} />
        </div>
      </header>

      <div className="overflow-hidden rounded-xl border border-[#E2E8F0]">
        <Image
          src={heroImage}
          alt={post.title}
          width={1200}
          height={800}
          priority
          unoptimized
          sizes="(max-width: 768px) 100vw, 768px"
          className="h-auto w-full object-cover"
        />
      </div>

      {video ? (
        <figure>
          <YoutubeEmbed video={video} />
          <figcaption className="mt-2 text-sm text-[#94A3B8]">
            Source video cited in this article
            {video.presenter ? `: ${video.presenter}, fact-checked below.` : "."}
          </figcaption>
        </figure>
      ) : null}

      <BlogTableOfContents headings={collectBlogHeadings(post.body)} />

      <BlogBody body={post.body} productsByHandle={productsByHandle} />

      <CitationFootnote references={post.references} />

      <EditorialByline
        publishedAt={post.publishedAt}
        updatedAt={
          isMeaningfullyUpdated(post.publishedAt, post.updatedAt) ? post.updatedAt : undefined
        }
      />

      <ArticleShareLinks
        url={pageUrl(`/blog/${slug}`)}
        title={post.title}
        label="Share this article at the end"
      />

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
