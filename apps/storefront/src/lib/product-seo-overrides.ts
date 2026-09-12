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
      "Buy BPC-157 Peptide Online | BPC-157 for Sale | Tetrava",
    description:
      "Buy BPC-157 peptide online from Tetrava Labs — BPC-157 peptides for sale with third-party 99%+ HPLC-MS purity and lot-linked COAs. Best place to buy BPC-157 for qualified labs (RUO).",
    pageHeading: "BPC-157",
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
      "Wondering where to buy retatrutide? Find 99%+ pure retatrutide for sale with lot-linked COA, competitive pricing, and cold-chain dispatch. RUO.",
    imageAlt: "Buy retatrutide peptide for sale in research vial",
  },
  semaglutide: {
    absoluteTitle:
      "Buy Semaglutide Online (5mg, 10mg) | 99% Purity | Tetrava",
    description:
      "Buy research-grade Semaglutide online in 5mg and 10mg. Verified 99%+ HPLC-MS purity with lot-linked COAs. Cold-chain shipping. RUO. CAS 910463-68-2.",
    imageAlt: "Buy semaglutide peptide for sale in research vial",
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
  "cu-50mg-tb500-10mg-bpc-157-10mg-kpv-10mg-80mg": {
    absoluteTitle: "Buy KLOW Blend Online (80mg) | 99%+ Purity COA | Tetrava",
    pageHeading: "KLOW Blend (80mg)",
    description:
      "Buy KLOW Blend (80mg) online: BPC-157 10mg, TB-500 10mg, GHK-Cu 10mg, and KPV 50mg in one lyophilized vial. 99%+ HPLC-MS purity, lot-linked COA. RUO.",
    imageAlt: "Buy KLOW Blend 80mg research peptide vial",
  },
  "selank-nasal-spray-10mg": {
    absoluteTitle:
      "Buy Selank Nasal Spray Online (10mg) | 99%+ Purity COA | Tetrava",
    pageHeading: "Selank Nasal Spray",
    description:
      "Buy Selank nasal spray online (10mg). 99%+ HPLC-MS purity, lot-linked COA, 2-8C refrigerated research spray. Research use only (RUO).",
    imageAlt: "Buy Selank nasal spray online, 10mg research bottle",
  },
  "semax-nasal-spray-10mg": {
    absoluteTitle:
      "Buy Semax Nasal Spray Online (10mg) | 99%+ Purity COA | Tetrava",
    pageHeading: "Semax Nasal Spray",
    description:
      "Buy Semax nasal spray online (10mg). 99%+ HPLC-MS purity, lot-linked COA, 2-8C refrigerated research spray. Research use only (RUO).",
    imageAlt: "Buy Semax nasal spray online, 10mg research bottle",
  },
  "pinealon-capsules-100-count": {
    absoluteTitle: "Buy Pinealon Capsules (500 mcg) | 100 capsules | Tetrava",
    pageHeading: "Pinealon Capsules (500 mcg)",
    description:
      "Buy Pinealon capsules (500 mcg, 100 count) for oral-route Glu-Asp-Arg research. Lot-linked COA. Research use only (RUO).",
    imageAlt: "Buy Pinealon capsules 500 mcg, 100-count research bottle",
  },
  "ghk-cu": {
    absoluteTitle: "Buy GHK-Cu Peptide Online | GHK-Cu for Sale | Tetrava",
    description:
      "Where to buy GHK-Cu peptide? 50mg and 100mg research vials with 99%+ HPLC-MS purity and lot-linked COA. Cold-chain shipping. Research use only.",
    imageAlt: "Buy GHK-Cu peptide for sale in research vial",
  },
  tb500: {
    absoluteTitle: "Buy TB-500 Peptide Online | TB-500 for Sale | Tetrava",
    description:
      "Buy TB-500 peptide online in 5mg and 10mg. TB-500 for sale with 99%+ HPLC-MS purity, lot-linked COA, and cold-chain shipping. Research use only (RUO).",
    imageAlt: "Buy TB-500 peptide for sale in research vial",
  },
  ipamorelin: {
    absoluteTitle: "Buy Ipamorelin Peptide | Ipamorelin for Sale | Tetrava",
    description:
      "Buy ipamorelin online in 5mg and 10mg. Where to buy ipamorelin peptide with 99%+ HPLC-MS purity and lot-linked COA. Cold-chain. Research use only.",
    imageAlt: "Buy ipamorelin peptide for sale in research vial",
  },
  tesamorelin: {
    absoluteTitle:
      "Buy Tesamorelin Peptide Online | 5mg / 10mg / 20mg | Tetrava",
    description:
      "Buy tesamorelin peptide online in 5mg, 10mg, and 20mg. Tesamorelin 10mg for sale with 99%+ HPLC-MS and lot-linked COA. Cold-chain. Research use only.",
    imageAlt: "Buy tesamorelin peptide for sale in research vial",
  },
  "hgh-191aa": {
    absoluteTitle: "Buy HGH 191aa Online | HGH 191aa for Sale | Tetrava",
    description:
      "HGH 191aa for sale as a documented 191-amino-acid research reagent. 99%+ HPLC-MS purity, lot-linked COA, cold-chain shipping. Not a fragment. RUO.",
    imageAlt: "Buy HGH 191aa for sale in research vial",
  },
  "igf-1-lr3": {
    absoluteTitle: "Buy IGF-1 LR3 Peptide Online | IGF-1 LR3 for Sale | Tetrava",
    description:
      "Buy IGF-1 LR3 peptide online in 0.1mg and 1mg. IGF-1 LR3 for sale with 99%+ HPLC-MS purity and lot-linked COA. Cold-chain shipping. Research use only.",
    imageAlt: "Buy IGF-1 LR3 peptide for sale in research vial",
  },
  "cjc-1295-without-dac": {
    absoluteTitle: "Buy CJC-1295 No DAC | CJC-1295 without DAC | Tetrava",
    description:
      "Buy CJC-1295 no DAC online in 5mg and 10mg. CJC-1295 without DAC for sale with 99%+ HPLC-MS and lot-linked COA. Not the DAC analog. RUO.",
    imageAlt: "Buy CJC-1295 without DAC peptide for sale in research vial",
  },
  "cjc-1295-with-dac": {
    absoluteTitle: "Buy CJC-1295 with DAC Online | 5mg / 10mg | Tetrava",
    description:
      "Buy CJC-1295 with DAC online in 5mg and 10mg, including CJC-1295 with DAC 10mg. 99%+ HPLC-MS, lot-linked COA, cold-chain. Research use only.",
    imageAlt: "Buy CJC-1295 with DAC peptide for sale in research vial",
  },
  kpv: {
    absoluteTitle: "Buy KPV Peptide Online | KPV Peptide for Sale | Tetrava",
    description:
      "Where to buy KPV peptide? Buy KPV peptide online in 5mg and 10mg research vials. 99%+ HPLC-MS, lot-linked COA, cold-chain. Research use only (RUO).",
    imageAlt: "Buy KPV peptide for sale in research vial",
  },
  epithalon: {
    absoluteTitle: "Buy Epithalon (Epitalon) | Epitalon Peptide | Tetrava",
    description:
      "Buy epithalon online (also searched as epitalon) in 10mg, 20mg, and 50mg. 99%+ HPLC-MS purity, lot-linked COA, cold-chain shipping. Research use only.",
    imageAlt: "Buy epithalon peptide for sale in research vial",
  },
  "bpc-157-tb500-blend": {
    absoluteTitle: "Buy BPC-157 and TB-500 Blend | Wolverine Stack | Tetrava",
    description:
      "Where to buy BPC-157 and TB-500? Wolverine peptide stack for sale in 10mg and 20mg blend vials. 99%+ HPLC-MS, lot-linked COA. Research use only.",
    imageAlt: "Buy BPC-157 and TB-500 blend for sale in research vial",
  },
  "glow-bpc-157-tb500-ghk-cu": {
    absoluteTitle: "Buy GLOW Peptide Online | GLOW Blend for Sale | Tetrava",
    description:
      "Buy GLOW peptide online. GLOW blend peptide for sale (BPC-157, TB-500, GHK-Cu) in 30mg, 70mg, and 85mg. 99%+ HPLC-MS, lot-linked COA. RUO.",
    imageAlt: "Buy GLOW peptide blend for sale in research vial",
  },
  "melanotan-2-10mg": {
    absoluteTitle: "Buy Melanotan 2 Online | Melanotan 2 for Sale | Tetrava",
    description:
      "Where to buy Melanotan 2? Melanotan 2 for sale as a 10mg research vial with 99%+ HPLC-MS purity and lot-linked COA. Cold-chain. Research use only.",
    imageAlt: "Buy Melanotan 2 for sale in research vial",
  },
  "mk-677-5mg": {
    absoluteTitle: "MK-677 for Sale | Buy MK-677 (Ibutamoren) | Tetrava",
    description:
      "MK-677 for sale (ibutamoren). Buy MK-677 online as a documented 5mg research reagent with 99%+ HPLC-MS and lot-linked COA. Cold-chain. Research use only.",
    imageAlt: "Buy MK-677 for sale in research vial",
  },
  "hexarelin-acetate": {
    absoluteTitle: "Buy Hexarelin Online | Hexarelin Peptide for Sale | Tetrava",
    description:
      "Buy hexarelin online in 2mg and 5mg. Hexarelin peptide for sale with 99%+ HPLC-MS purity and lot-linked COA. Cold-chain shipping. Research use only.",
    imageAlt: "Buy hexarelin peptide for sale in research vial",
  },
  "thymosin-alpha-1": {
    absoluteTitle: "Buy Thymosin Alpha-1 Online (5mg / 10mg) | Tetrava",
    description:
      "Buy thymosin alpha-1 online in 5mg and 10mg, including thymosin alpha-1 10mg. 99%+ HPLC-MS, lot-linked COA, cold-chain. Research use only (RUO).",
    imageAlt: "Buy thymosin alpha-1 peptide for sale in research vial",
  },
  "kisspeptin-10": {
    absoluteTitle:
      "Buy Kisspeptin-10 Online | Kisspeptin-10 for Sale | Tetrava",
    description:
      "Buy kisspeptin-10 for sale in 5mg and 10mg research vials. 99%+ HPLC-MS purity, lot-linked COA, and cold-chain shipping. Research use only (RUO).",
    imageAlt: "Buy kisspeptin-10 for sale in research vial",
  },
  "cagrilintide-semaglutide": {
    absoluteTitle:
      "Buy Cagrilintide Semaglutide Blend | 5mg / 10mg | Tetrava",
    description:
      "Buy cagrilintide semaglutide blend online in 5mg and 10mg. Two-ligand research vial, 99%+ HPLC-MS, lot-linked COA. Not a branded pen. RUO.",
    imageAlt: "Buy cagrilintide semaglutide blend for sale in research vials",
  },
  hcg: {
    absoluteTitle: "Buy HCG Peptide Online | HCG 5000 IU / 10000 IU | Tetrava",
    description:
      "Buy HCG peptide online in 5000 IU and 10000 IU. Where can I buy HCG online with lot-linked COA and 99%+ HPLC-MS? Cold-chain. Research use only.",
    imageAlt: "Buy HCG peptide for sale in research vial",
  },
  "aicar-50mg": {
    absoluteTitle: "Buy AICAR Peptide Online | AICAR 50mg for Sale | Tetrava",
    description:
      "Buy AICAR peptide online. AICAR 50mg for sale with 99%+ HPLC-MS purity and lot-linked COA. AMPK research reagent. Cold-chain. Research use only.",
    imageAlt: "Buy AICAR peptide for sale in research vial",
  },
};

export function getProductSeoOverride(
  parentHandle: string,
): ProductSeoOverride | null {
  return PRODUCT_SEO_OVERRIDES[parentHandle] || null;
}
