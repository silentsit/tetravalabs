export type ProductSeoOverride = {
  /** Exact document title (includes brand suffix). */
  absoluteTitle: string;
  description: string;
  /** Primary product image alt text. */
  imageAlt?: string;
  /** Curated on-page H1 (overrides the auto strength-aware compound name). */
  pageHeading?: string;
};

/** Curated SERP copy keyed by catalog parent handle (e.g. bpc-157). */
const PRODUCT_SEO_OVERRIDES: Record<string, ProductSeoOverride> = {
  "bpc-157": {
    absoluteTitle:
      "Buy BPC-157 Peptide Online | BPC-157 Peptides for Sale | Tetrava",
    description:
      "Buy BPC-157 peptide online from Tetrava Labs — BPC-157 peptides for sale with third-party 99%+ HPLC-MS purity and lot-linked COAs. Best place to buy BPC-157 for qualified labs (RUO).",
    imageAlt: "Buy BPC-157 peptide for sale in research vial",
  },
  sermorelin: {
    absoluteTitle: "Buy Sermorelin Peptide | Sermorelin for Sale | Tetrava",
    description:
      "Buy sermorelin peptide online in 5mg and 10mg — lot-linked 99%+ HPLC-MS purity, COA on file, and cold-chain shipping for qualified research labs. RUO only.",
    imageAlt: "Buy sermorelin peptide for sale in research vial",
  },
  retatrutide: {
    absoluteTitle:
      "Buy Retatrutide Peptide Online | Retatrutide for Sale | Tetrava",
    description:
      "Wondering where to buy retatrutide? Find 99%+ pure retatrutide for sale. Get competitive pricing, lab-tested retatrutide peptides & same-day dispatch.",
    imageAlt: "Buy retatrutide peptide for sale in research vial",
  },
  "mots-c": {
    absoluteTitle: "Buy MOTS-c Peptide Online | MOTS-c for Sale | Tetrava",
    description:
      "Buy MOTS-c peptide online for qualified labs. Get 99%+ HPLC-MS purity, lot-linked COA documentation, competitive pricing, and cold-chain dispatch. RUO only.",
    imageAlt: "Buy MOTS-c peptide for sale in research vial",
  },
};

export function getProductSeoOverride(
  parentHandle: string,
): ProductSeoOverride | null {
  return PRODUCT_SEO_OVERRIDES[parentHandle] || null;
}
