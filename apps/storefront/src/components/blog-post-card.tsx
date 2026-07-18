import Image from "next/image"
import Link from "next/link"
import { Clock } from "lucide-react"
import type { BlogPost } from "@/lib/sanity"
import { blogImageForCategory, formatReadTime } from "@/lib/blog-utils"

type Props = {
  post: BlogPost
  compact?: boolean
}

export function BlogPostCard({ post, compact = false }: Props) {
  const image = blogImageForCategory(post.category)

  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`card card-hover group flex flex-col overflow-hidden ${compact ? "" : "h-full"}`}
    >
      <div className={`relative overflow-hidden bg-[#F8FAFC] ${compact ? "aspect-[16/9]" : "aspect-video"}`}>
        <Image
          src={image}
          alt={post.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        {post.category ? (
          <span className="mb-2 inline-block w-fit rounded bg-[#CCFBF1] px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-[#0D9488]">
            {post.category}
          </span>
        ) : null}
        <h3
          className={`font-serif text-[#0F172A] transition-colors group-hover:text-[#0D9488] ${
            compact ? "text-lg" : "text-xl"
          }`}
        >
          {post.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-[#94A3B8]">{post.excerpt || "Research article"}</p>
        <div className="mt-auto flex flex-wrap items-center gap-3 pt-4 text-xs text-[#94A3B8]">
          {post.publishedAt ? (
            <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
          ) : null}
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" aria-hidden />
            {formatReadTime(post.readTimeMinutes)}
          </span>
        </div>
      </div>
    </Link>
  )
}
