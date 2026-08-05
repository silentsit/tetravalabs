export type ProductSeoOverride = {
  /** Exact document title (includes brand suffix). */
  absoluteTitle: string
  description: string
  /** Primary product image alt text. */
  imageAlt?: string
}

/** Curated SERP copy keyed by catalog parent handle (e.g. bpc-157). */
const PRODUCT_SEO_OVERRIDES: Record<string, ProductSeoOverride> = {
  "bpc-157": {
    absoluteTitle: "BPC-157 Peptide for Sale | Buy BPC-157 (5mg/10mg) | Tetrava Labs",
    description:
      "BPC-157 peptide for sale at Tetrava Labs — third-party verified 99%+ purity with lot-linked COA. Buy BPC-157 online with us today.",
    imageAlt: "BPC-157 peptide for sale in vial"
  }
}

export function getProductSeoOverride(parentHandle: string): ProductSeoOverride | null {
  return PRODUCT_SEO_OVERRIDES[parentHandle] || null
}
