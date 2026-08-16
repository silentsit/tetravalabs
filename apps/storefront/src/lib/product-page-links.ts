import "server-only"

import type { ResearchReference } from "@/lib/product-research-detail"

const INTERNAL_LINK_PATTERN = /\[([^[\]]+)\]\(\/[^)]+\)/g

export function countInternalLinks(text: string): number {
  return [...text.matchAll(INTERNAL_LINK_PATTERN)].length
}

/** Append a footer paragraph when overview copy has fewer than two internal markdown links. */
export function ensureMinimumInternalLinks(
  overview: string,
  categorySlug: string,
  categoryLabel: string
): string {
  const trimmed = overview.trim()
  if (!trimmed) return trimmed
  if (countInternalLinks(trimmed) >= 2) return trimmed

  const footer = `Lot-specific identity data is published in the [COA library](/coa-library). Browse related ${categoryLabel} reagents in the [${categoryLabel} category](/category/${categorySlug}).`

  return `${trimmed}\n\n${footer}`
}

export function buildDefaultProductReferences(input: {
  productName: string
  casNumber?: string | null
}): ResearchReference[] {
  const cas = String(input.casNumber || "").trim()
  const name = input.productName.trim() || "this compound"

  if (cas && !/^n\/a$/i.test(cas)) {
    return [
      {
        id: 1,
        citation: `PubChem compound registry search for CAS ${cas} (${name}). National Library of Medicine.`,
        url: `https://pubchem.ncbi.nlm.nih.gov/#query=${encodeURIComponent(cas)}`
      }
    ]
  }

  return [
    {
      id: 1,
      citation: `PubChem compound search for ${name}. National Library of Medicine.`,
      url: `https://pubchem.ncbi.nlm.nih.gov/#query=${encodeURIComponent(name)}`
    }
  ]
}
