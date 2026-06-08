import { notFound } from "next/navigation"
import { getBlogPostBySlug } from "@/lib/sanity"

type Props = { params: Promise<{ slug: string }> }

export const revalidate = 600

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)
  if (!post) notFound()

  return (
    <article className="space-y-4">
      <h1 className="text-3xl font-semibold">{post.title}</h1>
      <p className="text-[#8A8AA0]">{post.excerpt || "Research article"}</p>
      <div className="rounded border border-white/10 bg-[#0A0A10] p-4 text-sm text-[#8A8AA0]">
        {post.body || "Body content will render from Sanity portable text in the next step."}
      </div>
    </article>
  )
}
