import { META_TITLE_MAX } from "@/lib/seo"
import { stripStrengthFromDisplayName } from "@/lib/revamp/product-visual"

function uniqueStrengthLabels(labels: Array<string | null | undefined>) {
  return [
    ...new Set(
      labels
        .map((label) => String(label || "").trim())
        .filter((label) => label && label.toLowerCase() !== "standard")
    )
  ]
}

/** " in 5mg and 10mg" / " in 5mg, 10mg, and 20mg" */
export function formatStrengthsForMeta(labels: Array<string | null | undefined>) {
  const strengths = uniqueStrengthLabels(labels)
  if (!strengths.length) return ""
  if (strengths.length === 1) return ` in ${strengths[0]}`
  if (strengths.length === 2) return ` in ${strengths[0]} and ${strengths[1]}`
  return ` in ${strengths.slice(0, -1).join(", ")}, and ${strengths[strengths.length - 1]}`
}

function strengthParen(labels: string[]) {
  return labels.length ? ` (${labels.join(" / ")})` : ""
}

/**
 * CTR-oriented product title with progressive fallbacks so multi-strength
 * compounds stay under META_TITLE_MAX without dangling separators.
 *
 * Preferred: Buy {Name} Online (5mg / 10mg) | 99%+ Purity COA | Tetrava Labs
 */
export function buildProductSeoTitle(input: {
  displayName: string
  strengthLabels: Array<string | null | undefined>
}) {
  const name = stripStrengthFromDisplayName(input.displayName)
  const strengths = uniqueStrengthLabels(input.strengthLabels)
  const withStrengths = strengthParen(strengths)

  // Prefer keeping strengths over the purity badge when the full formula is too long.
  const candidates = [
    `Buy ${name} Online${withStrengths} | 99%+ Purity COA | Tetrava Labs`,
    `Buy ${name} Online${withStrengths} | Tetrava Labs`,
    `${name}${withStrengths} | 99%+ Purity COA | Tetrava Labs`,
    `${name}${withStrengths} | Tetrava Labs`,
    `Buy ${name} Online | 99%+ Purity COA | Tetrava Labs`,
    `Buy ${name} Online | Tetrava Labs`,
    `${name} | Tetrava Labs`
  ]

  return candidates.find((title) => title.length <= META_TITLE_MAX) || candidates[candidates.length - 1]
}

/** 120–155 char target meta description with buyer triggers + RUO. */
export function buildProductSeoDescription(input: {
  displayName: string
  strengthLabels: Array<string | null | undefined>
  purity?: string | null
  casNumber?: string | null
}) {
  const name = stripStrengthFromDisplayName(input.displayName)
  const strengthPhrase = formatStrengthsForMeta(input.strengthLabels)
  const purity = (input.purity || "99%+").trim() || "99%+"
  const cas =
    input.casNumber && input.casNumber !== "N/A" ? ` CAS ${input.casNumber}.` : ""

  const candidates = [
    `Buy research-grade ${name} online${strengthPhrase}. Verified ${purity} HPLC-MS purity with lot-linked COAs. Cold-chain shipping. Research use only (RUO).${cas}`,
    `Buy research-grade ${name} online${strengthPhrase}. Verified ${purity} HPLC-MS purity with lot-linked COAs. Cold-chain shipping. RUO.${cas}`,
    `Buy research-grade ${name} online${strengthPhrase}. Verified ${purity} HPLC-MS purity, lot-linked COAs, cold-chain shipping. RUO.`,
    `Buy research-grade ${name} online. Verified ${purity} HPLC-MS purity with lot-linked COAs. Cold-chain shipping. RUO.`
  ]

  return candidates.find((text) => text.length <= 160) || candidates[candidates.length - 1]
}
