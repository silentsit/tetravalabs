import Link from "next/link"
import { listBlogPosts } from "@/lib/sanity"

export const revalidate = 600

export default async function BlogPage() {
  const posts = await listBlogPosts()

  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-semibold">Research Blog</h1>
      <p className="text-[#8A8AA0]">
        Research guides and protocol notes sourced from Sanity with local fallback content.
      </p>
      <div className="grid gap-3">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="rounded border border-white/10 bg-[#0A0A10] p-4"
          >
            <h2 className="text-lg text-[#E8E8F0]">{post.title}</h2>
            <p className="mt-1 text-sm text-[#8A8AA0]">{post.excerpt || "Research article"}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}
