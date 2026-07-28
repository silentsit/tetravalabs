import type { BlogReference } from "@/lib/sanity"

type Props = {
  references?: BlogReference[] | null
}

function buildCitationLabel(ref: BlogReference) {
  if (ref.citationText?.trim()) return ref.citationText.trim()

  const parts: string[] = []
  if (ref.authors?.trim()) parts.push(ref.authors.trim())
  if (ref.year?.trim()) parts.push(`(${ref.year.trim()})`)
  if (ref.title?.trim()) parts.push(ref.title.trim())
  if (ref.publication?.trim()) parts.push(ref.publication.trim())

  return parts.join(". ").replace(/\.\s*\./g, ".") || "Untitled reference"
}

export function CitationFootnote({ references }: Props) {
  const items = (references || []).filter((ref) => ref?.title || ref?.citationText)
  if (items.length === 0) return null

  return (
    <section
      aria-labelledby="article-references-heading"
      className="border-t border-[#E2E8F0] pt-8"
    >
      <h2
        id="article-references-heading"
        className="font-serif text-xl text-[#0F172A]"
      >
        References
      </h2>
      <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm leading-relaxed text-[#475569]">
        {items.map((ref, index) => {
          const label = buildCitationLabel(ref)
          const key = ref._key || `${ref.title || "ref"}-${index}`
          return (
            <li key={key} id={`ref-${index + 1}`}>
              {ref.url ? (
                <a
                  href={ref.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0F766E] underline-offset-2 hover:underline"
                >
                  {label}
                </a>
              ) : (
                label
              )}
            </li>
          )
        })}
      </ol>
    </section>
  )
}
