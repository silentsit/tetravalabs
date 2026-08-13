import type { BlogHeading } from "@/lib/blog-utils"

type Props = {
  headings: BlogHeading[]
}

export function BlogTableOfContents({ headings }: Props) {
  if (headings.length < 2) return null

  return (
    <nav aria-label="Table of contents" className="card p-6">
      <p className="font-serif text-xl text-[#0F172A]">Table of contents</p>
      <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-[#475569]">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              className="text-[#0D9488] underline-offset-2 hover:underline"
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
