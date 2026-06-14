"use client"

import { useMemo, useState } from "react"
import type { BlogCategory, BlogPost } from "@/lib/sanity"
import { BLOG_CATEGORIES } from "@/lib/blog-utils"
import { BlogPostCard } from "@/components/blog-post-card"

type Props = {
  posts: BlogPost[]
}

export function BlogHub({ posts }: Props) {
  const [activeFilter, setActiveFilter] = useState<BlogCategory | "All">("All")

  const filtered = useMemo(() => {
    if (activeFilter === "All") return posts
    return posts.filter((post) => post.category === activeFilter)
  }, [activeFilter, posts])

  return (
    <>
      <div className="mb-10 flex flex-wrap items-center justify-center gap-2">
        <FilterPill active={activeFilter === "All"} onClick={() => setActiveFilter("All")} label="All" />
        {BLOG_CATEGORIES.map((category) => (
          <FilterPill
            key={category}
            active={activeFilter === category}
            onClick={() => setActiveFilter(category)}
            label={category}
          />
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-xl border border-[#E2E8F0] bg-white p-6 text-center text-sm text-[#475569]">
          No articles in this category yet.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post) => (
            <BlogPostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </>
  )
}

function FilterPill({
  active,
  onClick,
  label
}: {
  active: boolean
  onClick: () => void
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm transition-all ${
        active
          ? "bg-[#0D9488] text-white"
          : "border border-[#E2E8F0] bg-white text-[#475569] hover:text-[#0F172A]"
      }`}
    >
      {label}
    </button>
  )
}
