import type { ConfusionPair, PeptideKind } from "@/lib/peptide-identity/types"

export type PresentationMerge = {
  moleculeId: string
  label: string
}

export type IdentityOverride = {
  name?: string
  aliases?: string[]
  casNumber?: string | null
  formula?: string | null
  sequence?: string | null
  catalogMassDa?: number | null
  catalogMassLabel?: string | null
  kind?: PeptideKind
  note?: string | null
  parseSequence?: string | null
  inCatalog?: boolean
  shopHandle?: string | null
}

/** Same molecule, different vial / spray / capsule presentation. */
export const PRESENTATION_MERGES: Record<string, PresentationMerge> = {
  "selank-nasal-spray-10mg": { moleculeId: "selank", label: "Nasal spray" },
  "semax-nasal-spray-10mg": { moleculeId: "semax", label: "Nasal spray" },
  "bpc-157-capsules-100-count-500mcg": { moleculeId: "bpc-157", label: "Capsules" },
  "pinealon-capsules-100-count": { moleculeId: "pinealon-10mg", label: "Capsules" },
  "igf-1-lr3-0-1mg": { moleculeId: "igf-1-lr3", label: "0.1 mg vial" },
  "igf-1-lr3-1mg": { moleculeId: "igf-1-lr3", label: "1 mg vial" }
}

export const DISPLAY_NAMES: Record<string, string> = {
  tb500: "TB-500",
  adamax: "Adamax",
  nad: "NAD+",
  "hgh-191aa": "HGH 191aa",
  "5-amino-1mq": "5-Amino-1MQ",
  "bpc-157-tb500-blend": "BPC-157 + TB-500 blend",
  "glow-bpc-157-tb500-ghk-cu": "Glow blend",
  "cjc-1295-with-dac": "CJC-1295 with DAC",
  "cjc-1295-without-dac": "CJC-1295 without DAC",
  "cjc-1295-without-dac-ipamorelin-blend-10mg": "CJC-1295 no DAC + ipamorelin",
  "cjc-1295-without-dac-sermorelin-ipamorelin-blend-5mg": "CJC-1295 no DAC + sermorelin + ipamorelin",
  "cu-50mg-tb500-10mg-bpc-157-10mg-kpv-10mg-80mg": "Klow blend",
  "ss-31": "SS-31",
  "igf-1-lr3": "IGF-1 LR3",
  "mk-677-5mg": "MK-677",
  "ll-37-5mg": "LL-37",
  "mots-c": "MOTS-c",
  "ghk-cu": "GHK-Cu",
  "aod-9604": "AOD-9604",
  "ghrp-2-acetate": "GHRP-2 acetate",
  "ghrp-6-acetate": "GHRP-6 acetate",
  "hexarelin-acetate": "Hexarelin acetate",
  "oxytocin-acetate": "Oxytocin acetate",
  "kisspeptin-10": "Kisspeptin-10",
  "thymosin-alpha-1": "Thymosin alpha-1",
  "pinealon-10mg": "Pinealon",
  "melanotan-1-10mg": "Melanotan 1",
  "melanotan-2-10mg": "Melanotan 2",
  "mgf-2mg": "MGF",
  "peg-mgf-2mg": "PEG-MGF",
  "hmg-75-iu": "HMG",
  "vip-10mg": "VIP",
  "snap-8-10mg": "SNAP-8",
  "ara-290-10mg": "ARA-290",
  "foxo4-dri-10mg": "FOXO4-DRI",
  "humanin-10mg": "Humanin",
  "b-12-10mg": "Vitamin B-12",
  "l-glu-100mg": "L-glutamine",
  "l-carnitine-600mg-10ml": "L-carnitine",
  "acetic-acid-water-3ml": "Acetic acid water",
  "bacteriostatic-water": "Bacteriostatic water",
  "benzyl-alcohol": "Benzyl alcohol",
  "lemon-bottle-10ml": "Lemon Bottle",
  "lipo-c-10ml": "Lipo-C",
  "cerebrolysin-10mg": "Cerebrolysin",
  "thymalin-10mg": "Thymalin",
  "survodutide-10mg": "Survodutide"
}

/**
 * TB-500 catalog row reuses full-length thymosin beta-4 CAS / formula / mass.
 * The sequence field is the fragment. This tool splits those identities.
 */
export const IDENTITY_OVERRIDES: Record<string, IdentityOverride> = {
  tb500: {
    name: "TB-500",
    aliases: [
      "TB500",
      "TB 500",
      "Ac-LKKTETQ",
      "Ac-Leu-Lys-Lys-Thr-Glu-Thr-Gln",
      "thymosin fragment",
      "Tbeta4 fragment"
    ],
    casNumber: null,
    formula: null,
    sequence: "Ac-Leu-Lys-Lys-Thr-Glu-Thr-Gln",
    parseSequence: "Ac-Leu-Lys-Lys-Thr-Glu-Thr-Gln",
    catalogMassDa: null,
    catalogMassLabel: null,
    note:
      "Trade name for the N-acetylated 17-23 fragment of thymosin beta-4 (Ac-LKKTETQ). CAS 77591-33-4 and the ~4,963 Da mass belong to the full-length protein, not this heptapeptide."
  },
  "thymosin-beta-4": {
    name: "Thymosin beta-4",
    aliases: ["thymosin β4", "thymosin beta 4", "Tβ4", "TMSB4", "T beta 4"],
    casNumber: "77591-33-4",
    formula: "C212H350N56O78S",
    sequence: "43-residue protein (not the TB-500 fragment)",
    parseSequence: null,
    catalogMassDa: 4963.49,
    kind: "reference",
    inCatalog: false,
    shopHandle: null,
    note:
      "Full-length protein, about 4,963 Da. Material sold as TB-500 is a short N-acetylated fragment of this sequence, not the protein itself."
  }
}

/** PubChem CIDs already cited on Tetrava product research pages. */
export const PUBCHEM_CIDS: Record<string, string> = {
  "bpc-157": "9941957",
  "aod-9604": "71300630",
  nad: "5892",
  sermorelin: "16132413",
  mazdutide: "167312357",
  "mots-c": "146675088",
  tirzepatide: "156588324",
  retatrutide: "171390338",
  selank: "11765600",
  semax: "9811102",
  dsip: "68816",
  "ss-31": "11764719"
}

export const EXTRA_ALIASES: Record<string, string[]> = {
  "bpc-157": ["BPC157", "body protection compound 157", "bepecin"],
  adamax: ["N-acetyl Semax amidate", "NA-Semax", "N-Acetyl Semax Amidate"],
  semax: ["ACTH(4-7)-PGP", "Met-Glu-His-Phe-Pro-Gly-Pro"],
  selank: ["tuftsin analog", "Thr-Lys-Pro-Arg-Pro-Gly-Pro"],
  "aod-9604": ["hGH 176-191", "fragment 176-191", "Tyr-Aib-hGH(177-191)"],
  "hgh-191aa": ["somatropin", "rhGH", "growth hormone 191aa", "191aa"],
  "ss-31": ["elamipretide", "MTP-131", "Bendavia"],
  nad: ["NAD+", "nadide", "nicotinamide adenine dinucleotide"],
  "cjc-1295-without-dac": ["CJC-1295 no DAC", "mod GRF 1-29", "CJC no DAC", "CJC without DAC"],
  "cjc-1295-with-dac": ["CJC-1295 DAC", "CJC with DAC", "CJC DAC"],
  ipamorelin: ["IPA"],
  sermorelin: ["GHRH(1-29)", "Geref"],
  tesamorelin: ["Egrifta"],
  "ghk-cu": ["copper peptide", "GHK copper"],
  "melanotan-1-10mg": ["afamelanotide", "MT-1", "melanotan I"],
  "melanotan-2-10mg": ["MT-2", "melanotan II", "bremelanotide analog"],
  bremelanotide: ["PT-141"],
  "mgf-2mg": ["IGF-1 Ec", "mechano growth factor"],
  "peg-mgf-2mg": ["PEGylated MGF", "PEG MGF"],
  "igf-1-lr3": ["Long Arg3 IGF-1", "IGF1 LR3", "LR3 IGF-1"],
  "kisspeptin-10": ["KP-10", "metastin fragment"],
  gonadorelin: ["GnRH", "LHRH"],
  hcg: ["human chorionic gonadotropin"],
  "hmg-75-iu": ["human menopausal gonadotropin", "menotropin"],
  "pinealon-10mg": ["EDR", "Glu-Asp-Arg"],
  epithalon: ["epitalon", "AEDG", "Ala-Glu-Asp-Gly"],
  "mots-c": ["MOTSc", "mitochondrial ORF"],
  humanin: ["HN"],
  kpv: ["Lys-Pro-Val"],
  "ll-37-5mg": ["cathelicidin LL-37"],
  "foxo4-dri-10mg": ["FOXO4 DRI"],
  "mk-677-5mg": ["ibutamoren"],
  "glow-bpc-157-tb500-ghk-cu": ["GLOW", "BPC GHK TB"],
  "cu-50mg-tb500-10mg-bpc-157-10mg-kpv-10mg-80mg": ["KLOW", "Klow"],
  "bpc-157-tb500-blend": ["wolverine blend", "BPC TB-500"]
}

export const CONFUSION_PAIRS: ConfusionPair[] = [
  {
    a: "tb500",
    b: "thymosin-beta-4",
    label: "TB-500 vs thymosin beta-4",
    blurb: "Fragment versus the 43-residue protein. Same family, not the same molecule."
  },
  {
    a: "semax",
    b: "adamax",
    label: "Semax vs Adamax",
    blurb: "Adamax is N-acetyl Semax amidate. Extra caps on both termini."
  },
  {
    a: "hgh-191aa",
    b: "aod-9604",
    label: "HGH 191aa vs AOD-9604",
    blurb: "Full-length somatropin versus a modified C-terminal fragment."
  },
  {
    a: "cjc-1295-with-dac",
    b: "cjc-1295-without-dac",
    label: "CJC-1295 with DAC vs without",
    blurb: "Drug-affinity complex changes mass, clearance, and the CAS number."
  },
  {
    a: "semaglutide",
    b: "tirzepatide",
    label: "Semaglutide vs tirzepatide",
    blurb: "GLP-1 analog versus a GIP/GLP-1 dual agonist. Different sequences."
  },
  {
    a: "melanotan-1-10mg",
    b: "melanotan-2-10mg",
    label: "Melanotan 1 vs 2",
    blurb: "Linear tridecapeptide versus a shorter cyclic analog."
  },
  {
    a: "mgf-2mg",
    b: "peg-mgf-2mg",
    label: "MGF vs PEG-MGF",
    blurb: "Same IGF-1 Ec stretch. PEGylation makes the mass variable."
  },
  {
    a: "bpc-157",
    b: "tb500",
    label: "BPC-157 vs TB-500",
    blurb: "Fifteen residues versus seven. Often ordered together, never interchangeable."
  },
  {
    a: "selank",
    b: "semax",
    label: "Selank vs Semax",
    blurb: "Both are heptapeptides with a PGP tail. Different N-terminal sequences."
  },
  {
    a: "pinealon-10mg",
    b: "epithalon",
    label: "Pinealon vs epithalon",
    blurb: "EDR versus AEDG. Short Khavinson peptides, not the same residue set."
  },
  {
    a: "ipamorelin",
    b: "sermorelin",
    label: "Ipamorelin vs sermorelin",
    blurb: "GHRP-class pentapeptide versus GHRH(1-29)."
  },
  {
    a: "tesamorelin",
    b: "sermorelin",
    label: "Tesamorelin vs sermorelin",
    blurb: "Tesamorelin is longer and N-terminally modified. Not Geref."
  },
  {
    a: "ghrp-2-acetate",
    b: "ghrp-6-acetate",
    label: "GHRP-2 vs GHRP-6",
    blurb: "Related hexapeptides. Position 1 and 2 residues differ."
  },
  {
    a: "kisspeptin-10",
    b: "gonadorelin",
    label: "Kisspeptin-10 vs gonadorelin",
    blurb: "KP-10 sits upstream of GnRH. Different sequence and mass."
  },
  {
    a: "hcg",
    b: "hmg-75-iu",
    label: "HCG vs HMG",
    blurb: "A heterodimeric glycoprotein versus an FSH/LH mixture."
  },
  {
    a: "nad",
    b: "mots-c",
    label: "NAD+ vs MOTS-c",
    blurb: "NAD+ is a dinucleotide, not a peptide. MOTS-c is 16 amino acids."
  },
  {
    a: "tirzepatide",
    b: "retatrutide",
    label: "Tirzepatide vs retatrutide",
    blurb: "Dual agonist versus triple agonist. Do not treat trial data as interchangeable."
  },
  {
    a: "glow-bpc-157-tb500-ghk-cu",
    b: "cu-50mg-tb500-10mg-bpc-157-10mg-kpv-10mg-80mg",
    label: "Glow vs Klow",
    blurb: "Both are mixtures. Klow adds KPV. Neither is a single CAS identity."
  },
  {
    a: "bpc-157",
    b: "bpc-157-tb500-blend",
    label: "BPC-157 vs BPC/TB-500 blend",
    blurb: "A single sequence versus two peptides in one vial."
  }
]

export const FEATURED_PAIR_IDS = [
  "tb500/thymosin-beta-4",
  "semax/adamax",
  "hgh-191aa/aod-9604",
  "cjc-1295-with-dac/cjc-1295-without-dac",
  "semaglutide/tirzepatide",
  "melanotan-1-10mg/melanotan-2-10mg",
  "mgf-2mg/peg-mgf-2mg",
  "bpc-157/tb500",
  "selank/semax",
  "pinealon-10mg/epithalon"
] as const
