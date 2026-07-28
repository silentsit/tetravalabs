"use client"

import Link from "next/link"
import { PortableText, type PortableTextComponents } from "@portabletext/react"
import { ProductCard } from "@/components/product-card"
import {
  isPortableBlogBody,
  renderBlogParagraphs
} from "@/lib/blog-utils"
import type { BlogBody } from "@/lib/sanity"
import type { StoreProduct } from "@/lib/medusa"

type CardVariant = "shop" | "featured" | "default"

type Props = {
  body?: BlogBody
  productsByHandle: Map<string, StoreProduct>
}

function resolveCardVariant(value: unknown): CardVariant {
  if (value === "shop" || value === "default" || value === "featured") return value
  return "featured"
}

export function BlogBody({ body, productsByHandle }: Props) {
  if (!body) return null

  if (!isPortableBlogBody(body)) {
    const paragraphs = renderBlogParagraphs(body)
    if (!paragraphs.length) return null
    return (
      <div className="card space-y-4 p-6 text-base leading-relaxed text-[#475569]">
        {paragraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 48)}>{paragraph}</p>
        ))}
      </div>
    )
  }

  const components: PortableTextComponents = {
    block: {
      normal: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
      h2: ({ children }) => (
        <h2 className="mb-3 mt-8 font-serif text-2xl text-[#0F172A] first:mt-0">{children}</h2>
      ),
      h3: ({ children }) => (
        <h3 className="mb-2 mt-6 font-serif text-xl text-[#0F172A] first:mt-0">{children}</h3>
      )
    },
    list: {
      bullet: ({ children }) => (
        <ul className="mb-4 list-disc space-y-2 pl-5 last:mb-0">{children}</ul>
      ),
      number: ({ children }) => (
        <ol className="mb-4 list-decimal space-y-2 pl-5 last:mb-0">{children}</ol>
      )
    },
    marks: {
      strong: ({ children }) => <strong className="font-semibold text-[#0F172A]">{children}</strong>,
      em: ({ children }) => <em>{children}</em>,
      link: ({ children, value }) => {
        const href = typeof value?.href === "string" ? value.href : "#"
        const external = href.startsWith("http")
        return (
          <Link
            href={href}
            className="text-[#0D9488] underline-offset-2 hover:underline"
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            {children}
          </Link>
        )
      }
    },
    types: {
      productEmbed: ({ value }) => {
        const handle = typeof value?.handle === "string" ? value.handle.trim() : ""
        if (!handle) return null
        const product = productsByHandle.get(handle) || productsByHandle.get(handle.toLowerCase())
        // Graceful failure: archived/missing products skip this block only.
        if (!product) return null
        return (
          <div className="my-8 max-w-sm">
            <ProductCard product={product} variant={resolveCardVariant(value?.cardVariant)} />
          </div>
        )
      }
    }
  }

  return (
    <div className="card space-y-4 p-6 text-base leading-relaxed text-[#475569]">
      <PortableText value={body as never} components={components} />
    </div>
  )
}
