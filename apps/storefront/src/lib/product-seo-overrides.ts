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
  "aod-9604": {
    absoluteTitle:
      "Buy AOD-9604 Peptide Online (5mg / 10mg) | 99%+ COA | Tetrava",
    description:
      "Buy AOD-9604 peptide online in 5mg and 10mg vials. 99%+ HPLC-MS lab-tested purity, lot-linked COA. Research-grade hGH fragment 176-191. RUO.",
    imageAlt: "Buy AOD-9604 peptide for sale in research vial",
  },
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
  nad: {
    absoluteTitle:
      "Buy NAD+ Peptide Online (100mg/500mg/1000mg) | 99%+ Purity | Tetrava",
    description:
      "Buy research-grade NAD+ online in 100mg, 500mg, and 1000mg. Verified 99%+ HPLC-MS purity with lot-linked COAs. Cold-chain shipping. Research use only (RUO).",
    imageAlt: "Buy NAD+ peptide for sale in research vial",
  },
  dsip: {
    absoluteTitle:
      "Buy DSIP Peptide Online (5mg / 10mg / 15mg) | 99%+ COA | Tetrava",
    description:
      "Buy DSIP peptide online in 5mg, 10mg, and 15mg vials. 99%+ HPLC-MS lab-tested purity, lot-linked COA. Delta Sleep-Inducing Peptide for research. RUO.",
    imageAlt: "Buy DSIP peptide for sale in research vial",
  },
};

export function getProductSeoOverride(
  parentHandle: string,
): ProductSeoOverride | null {
  return PRODUCT_SEO_OVERRIDES[parentHandle] || null;
}
