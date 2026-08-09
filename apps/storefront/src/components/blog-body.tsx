"use client"

import Link from "next/link"
import { PortableText, type PortableTextComponents } from "@portabletext/react"
import { ProductCard } from "@/components/product-card"
import { BlogTable, type BlogTableValue } from "@/components/blog-table"
import { isPortableBlogBody, parsePlainBlogBlocks } from "@/lib/blog-utils"
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

function createPortableTextComponents(
  productsByHandle: Map<string, StoreProduct>
): PortableTextComponents {
  return {
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
      code: ({ children }) => (
        <code className="rounded bg-[#F1F5F9] px-1.5 py-0.5 font-mono text-[0.92em] text-[#0F172A]">
          {children}
        </code>
      ),
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
        if (!product) return null
        return (
          <div className="my-8 max-w-sm">
            <ProductCard product={product} variant={resolveCardVariant(value?.cardVariant)} />
          </div>
        )
      },
      // Custom studio table + @sanity/table plugin documents both use rows[].cells
      tableBlock: ({ value }) => <BlogTable value={(value || {}) as BlogTableValue} />,
      table: ({ value }) => (
        <BlogTable value={{ ...(value || {}), hasHeaderRow: true } as BlogTableValue} />
      )
    },
    unknownMark: ({ children }) => <span>{children}</span>,
    unknownType: ({ value }) => {
      const type = typeof value?._type === "string" ? value._type : "unknown"
      if (process.env.NODE_ENV !== "production") {
        return (
          <p className="rounded border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
            Unsupported block type: {type}
          </p>
        )
      }
      return null
    },
    unknownBlockStyle: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>
  }
}

export function BlogBody({ body, productsByHandle }: Props) {
  if (!body) return null

  if (!isPortableBlogBody(body)) {
    const blocks = parsePlainBlogBlocks(body)
    if (!blocks.length) return null
    return (
      <div className="card space-y-4 p-6 text-base leading-relaxed text-[#475569]">
        {blocks.map((block, index) => {
          if (block.type === "h2") {
            return (
              <h2
                key={`h2-${index}`}
                className="mb-3 mt-8 font-serif text-2xl text-[#0F172A] first:mt-0"
              >
                {block.text}
              </h2>
            )
          }
          if (block.type === "h3") {
            return (
              <h3
                key={`h3-${index}`}
                className="mb-2 mt-6 font-serif text-xl text-[#0F172A] first:mt-0"
              >
                {block.text}
              </h3>
            )
          }
          return <p key={`p-${index}`}>{block.text}</p>
        })}
      </div>
    )
  }

  return (
    <div className="card space-y-4 p-6 text-base leading-relaxed text-[#475569]">
      <PortableText value={body as never} components={createPortableTextComponents(productsByHandle)} />
    </div>
  )
}
