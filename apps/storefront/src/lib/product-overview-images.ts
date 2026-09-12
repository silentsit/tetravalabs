import overviewManifest from "@/lib/overview-images.generated.json"
import {
  normalizeTb500DisplayText,
  stripStrengthFromDisplayName
} from "@/lib/revamp/product-visual"
import { getProductSeoOverride } from "@/lib/product-seo-overrides"

export type ProductOverviewImage = {
  src: string
  alt: string
}

type ProductForm = "vial" | "capsule" | "nasal" | "supply"

const SLOTS = [1, 2, 3] as const

const CURATED_HANDLES = new Set(
  (overviewManifest as { handles?: string[] }).handles?.map((handle) => handle.toLowerCase()) || []
)

/**
 * Per-product overview assets at /images/overview/{handle}-{1,2,3}.webp.
 * Never reuse the same image file across different product handles.
 */
export function getCuratedOverviewImagePaths(parentHandle: string): string[] {
  const handle = parentHandle.trim().toLowerCase()
  if (!CURATED_HANDLES.has(handle)) return []
  return SLOTS.map((slot) => `/images/overview/${handle}-${slot}.webp`)
}

function uniquePush(list: string[], src: string | null | undefined) {
  const value = String(src || "").trim()
  if (!value || list.includes(value)) return
  list.push(value)
}

function detectProductForm(parentHandle: string, productName: string): ProductForm {
  const haystack = `${parentHandle} ${productName}`.toLowerCase()
  if (haystack.includes("nasal") || haystack.includes("spray")) return "nasal"
  if (haystack.includes("capsule") || haystack.includes("softgel")) return "capsule"
  if (
    haystack.includes("water") ||
    haystack.includes("alcohol") ||
    haystack.includes("acetic") ||
    haystack.includes("lipo-c") ||
    haystack.includes("lemon-bottle") ||
    haystack.includes("l-carnitine") ||
    haystack.includes("lab-supplies")
  ) {
    return "supply"
  }
  return "vial"
}

function seoBaseName(productName: string): string {
  return (
    stripStrengthFromDisplayName(normalizeTb500DisplayText(productName)) || "Research peptide"
  )
}

/**
 * Per-product, per-slot alt overrides for people-focused editorial illustrations (0-based).
 */
const PEOPLE_ILLUSTRATION_ALT_OVERRIDES: Record<string, Record<number, string>> = {
  "aod-9604": {
    0: "Scientist reviewing an adipocyte lipolysis pathway diagram beside an AOD-9604 research vial",
    1: "Two lab researchers comparing the full-length growth hormone chain to the isolated AOD-9604 fragment on a whiteboard",
    2: "Gloved researcher matching an AOD-9604 Certificate of Analysis and HPLC chromatogram to its vial",
  },
  nad: {
    0: "Scientist pointing to a glowing NAD+/NADH redox cycle diagram beside an NAD+ research vial",
    1: "Two lab researchers reviewing an NAD+ decline-with-age data chart beside a rack of research vials",
    2: "Gloved researcher loading a 96-well microplate for a colorimetric NAD+/NADH redox assay beside an HPLC chromatogram and vial",
  },
  "bpc-157": {
    0: "Scientist comparing BPC-157 and TB-500 research vials in a laboratory",
    1: "Two lab researchers examining a BPC-157 peptide vial together under a lab lamp",
    2: "Female lab scientist using a micropipette to prepare a BPC-157 research vial",
  },
  sermorelin: {
    0: "Research scientist reviewing growth hormone axis data beside a peptide research vial",
    1: "Two lab researchers collaborating on sermorelin assay protocols at a lab bench",
    2: "Scientist preparing a sermorelin research sample with an electronic micropipette",
  },
  mazdutide: {
    0: "Two researchers comparing mazdutide, tirzepatide, and retatrutide molecular diagrams on a lab whiteboard",
    1: "Scientist reviewing a dual GLP-1/glucagon receptor pathway diagram beside a mazdutide research vial",
    2: "Lab researcher matching a mazdutide Certificate of Analysis and HPLC chromatogram to its vial",
  },
  "mots-c": {
    0: "Researcher reviewing a mitochondrial AMPK signaling pathway diagram beside a MOTS-c research vial",
    1: "Lab researcher holding a MOTS-c research vial beside an exercise-capacity metabolic chamber",
    2: "MOTS-c and SS-31 research vials placed on a chromatogram printout for comparative analysis",
  },
  selank: {
    0: "Scientist pointing to a Selank enkephalinase-inhibition pathway diagram while holding a Selank research vial",
    1: "Two lab researchers comparing Selank and Semax molecular structure diagrams beside their research vials",
    2: "Gloved researcher loading a 96-well stress-model assay plate beside a Selank vial and HPLC chromatogram",
  },
  semax: {
    0: "Scientist pointing to a Semax BDNF/TrkB neurotrophin signaling pathway diagram while holding a Semax research vial",
    1: "Two lab researchers comparing Semax and Selank molecular structure diagrams on a whiteboard beside their research vials",
    2: "Gloved researcher holding a rodent cerebral ischemia infarct-volume brain scan beside a Semax vial and HPLC chromatogram",
  },
  dsip: {
    0: "Researcher pointing to delta-wave sleep EEG traces on a polysomnography monitor beside a DSIP research vial",
    1: "Two lab researchers reviewing a rodent stroke motor-function recovery chart and HPLC purity chromatogram beside a DSIP vial",
    2: "Researcher reviewing an FDA compounding advisory committee review document on a tablet beside a DSIP vial and Certificate of Analysis",
  },
  "selank-nasal-spray-10mg": {
    0: "Scientist pointing to an intranasal research-delivery diagram of olfactory and hippocampal pathways beside a Selank nasal spray bottle",
    1: "Two lab researchers reviewing a hippocampal BDNF expression chart from an intranasal Selank study beside the nasal spray bottle and an HPLC chromatogram",
    2: "Gloved hand placing a Selank nasal spray bottle onto a 2-8 C refrigerator shelf beside a -20 C lyophilized Selank vial",
  },
  "semax-nasal-spray-10mg": {
    0: "Scientist pointing to an ACTH(4-7)-PGP structure diagram of Met-Glu-His-Phe-Pro-Gly-Pro beside a Semax nasal spray bottle",
    1: "Two lab researchers reviewing a hippocampal BDNF/TrkB fold-change chart from a single-dose intranasal Semax rat study beside the nasal spray bottle",
    2: "Gloved hand placing a Semax nasal spray bottle onto a 2-8 C refrigerator shelf beside a -20 C lyophilized Semax vial and an Adamax vial",
  },
  "cu-50mg-tb500-10mg-bpc-157-10mg-kpv-10mg-80mg": {
    0: "Gloved researcher matching the KLOW Blend 80mg vial against its four individual component vials, BPC-157, TB-500, GHK-Cu, and KPV, beside a printed Certificate of Analysis",
    1: "Lab monitor showing four converging research pathway diagrams, tissue-repair, copper-peptide gene signaling, actin regulation, and anti-inflammatory cytokine signaling, meeting at a labeled KLOW Blend vial",
    2: "Side-by-side HPLC chromatograms comparing the three-component GLOW blend to the four-component KLOW Blend, with a gloved hand pointing at the additional KPV peak",
  },
  "pinealon-10mg": {
    0: "Researcher tracing Pinealon's isolation from human cortex brain tissue through HPLC purification to the finished Glu-Asp-Arg tripeptide vial",
    1: "Lab researcher holding a Pinealon research vial while reviewing a reactive-oxygen-species suppression chart from a cerebellar granule cell oxidative-stress assay",
    2: "Gloved hand holding Pinealon and Epitalon research vials side by side in front of a monitor showing their tripeptide and tetrapeptide structures and separate HPLC chromatogram peaks",
  },
  semaglutide: {
    0: "Researcher pointing to a semaglutide molecular engineering diagram showing the Aib2 substitution and C18 fatty diacid side chain beside a labeled Research Use Only vial",
    1: "Lab researcher reviewing a 68-week body-weight-reduction trial line chart on a monitor beside a semaglutide research vial and printed data sheet",
    2: "Gloved hand holding semaglutide and tirzepatide research vials side by side in front of a monitor comparing single GLP-1 receptor activation to dual GLP-1/GIP receptor activation",
  },
  "ss-31": {
    0: "Two researchers pointing at a mitochondrion cutaway model of inner-membrane cristae and cardiolipin while a monitor shows the SS-31 tetrapeptide sequence D-Arg-Dmt-Lys-Phe-NH2",
    1: "Two lab researchers comparing an MMPOWER-3 six-minute-walk chart that missed its endpoints with a Barth syndrome knee-extensor strength chart beside SS-31 RUO vials and a Forzinity carton",
    2: "Two researchers comparing a MOTS-c AMPK nuclear-signaling diagram with an SS-31 cardiolipin inner-membrane diagram beside both research vials and a 96-well assay plate",
  },
  "ghk-cu": {
    0: "Scientist reviewing a GHK-Cu copper-tripeptide binding diagram beside a GHK-Cu peptide vial for sale",
    1: "Two lab researchers comparing topical GHK-Cu serum notes with a lyophilized GHK-Cu research vial and HPLC chromatogram",
    2: "Gloved researcher matching a GHK-Cu Certificate of Analysis to the vial before a buy GHK-Cu online inventory check",
  },
  tb500: {
    0: "Scientist pointing to the Ac-LKKTETQ fragment on a TB-500 peptide structure diagram beside a TB-500 vial for sale",
    1: "Two researchers comparing a full-length thymosin beta-4 model with a TB-500 research vial and mass-spec printout",
    2: "Gloved hand placing a TB-500 peptide for sale vial onto a COA sheet next to a BPC-157 comparator vial",
  },
  ipamorelin: {
    0: "Scientist reviewing an ipamorelin GHS-R1a receptor diagram beside an ipamorelin peptide vial",
    1: "Two lab researchers comparing ipamorelin vs sermorelin pathway sketches on a whiteboard beside both research vials",
    2: "Gloved researcher checking an ipamorelin Certificate of Analysis before a buy ipamorelin online lot release",
  },
  tesamorelin: {
    0: "Scientist pointing to a tesamorelin GHRH analog diagram beside a tesamorelin peptide vial for sale",
    1: "Two researchers reviewing a tesamorelin visceral-adipose imaging chart next to a tesamorelin 10mg research vial",
    2: "Gloved hand matching tesamorelin 10mg for sale paperwork to the lyophilized vial and HPLC trace",
  },
  "hgh-191aa": {
    0: "Scientist comparing a 191-amino-acid somatropin ribbon diagram with an HGH 191aa research vial",
    1: "Two lab researchers reviewing HGH 191aa vs fragment 176-191 sequences on a monitor beside both vials",
    2: "Gloved researcher aligning an HGH 191aa for sale vial with its lot-linked Certificate of Analysis",
  },
  "igf-1-lr3": {
    0: "Scientist pointing to the Arg3 substitution on an IGF-1 LR3 peptide diagram beside an IGF-1 LR3 vial for sale",
    1: "Two researchers comparing IGF-1 LR3 vs native IGF-1 binding notes beside a buy IGF-1 LR3 inventory tray",
    2: "Gloved hand placing an IGF-1 LR3 research vial onto an HPLC-MS purity chromatogram",
  },
  "cjc-1295-without-dac": {
    0: "Scientist reviewing a CJC-1295 without DAC GHRH(1-29) analog diagram beside the research vial",
    1: "Two lab researchers comparing CJC-1295 with DAC vs without DAC half-life sketches on a whiteboard",
    2: "Gloved researcher checking a buy CJC-1295 no DAC Certificate of Analysis against the lyophilized vial",
  },
  "cjc-1295-with-dac": {
    0: "Scientist pointing to the Drug Affinity Complex albumin-binding tail on a CJC-1295 with DAC diagram",
    1: "Two researchers reviewing a CJC-1295 with DAC GH and IGF-1 time-course chart beside the 10mg vial",
    2: "Gloved hand matching a CJC-1295 with DAC research vial to its lot-linked HPLC chromatogram",
  },
  kpv: {
    0: "Scientist reviewing a KPV peptide Lys-Pro-Val structure diagram beside a KPV peptide vial for sale",
    1: "Two lab researchers comparing KPV peptide oral vs injection notes for a mucosal-transport assay",
    2: "Gloved researcher placing a buy KPV peptide vial onto its Certificate of Analysis",
  },
  epithalon: {
    0: "Scientist comparing epitalon vs epithalon Ala-Glu-Asp-Gly sequence cards beside an epithalon research vial",
    1: "Two researchers reviewing pineal tetrapeptide literature next to an epithalon 50mg vial for sale",
    2: "Gloved hand aligning a buy epithalon lot label with the HPLC purity chromatogram",
  },
  "bpc-157-tb500-blend": {
    0: "Scientist comparing BPC-157 and TB-500 structures on one Wolverine blend vial for sale",
    1: "Two lab researchers reviewing where to buy BPC-157 and TB-500 blend notes beside the dual-peptide vial",
    2: "Gloved researcher matching a BPC-157 TB-500 peptide for sale COA to the labeled blend vial",
  },
  "glow-bpc-157-tb500-ghk-cu": {
    0: "Scientist reviewing a GLOW peptide three-component map, BPC-157, TB-500, and GHK-Cu, beside the blend vial",
    1: "Two researchers comparing a GLOW blend peptide vial with separate component vials and an HPLC overlay",
    2: "Gloved hand placing a glow peptide buy online vial onto its Certificate of Analysis",
  },
  "melanotan-2-10mg": {
    0: "Scientist pointing to a Melanotan 2 cyclic heptapeptide diagram beside a Melanotan 2 vial for sale",
    1: "Two lab researchers comparing Melanotan 2 vs 1 receptor-selectivity notes on a whiteboard",
    2: "Gloved researcher checking where to buy Melanotan 2 lot paperwork against the lyophilized vial",
  },
  "mk-677-5mg": {
    0: "Scientist reviewing an ibutamoren MK-677 ghrelin-receptor diagram beside an MK-677 for sale vial",
    1: "Two researchers comparing oral MK-677 vs injectable GHRP notes next to the research vial",
    2: "Gloved hand matching a buy MK-677 Certificate of Analysis to the labeled 5mg vial",
  },
  "hexarelin-acetate": {
    0: "Scientist pointing to a hexarelin GHS-R1a hexapeptide diagram beside a hexarelin peptide vial",
    1: "Two lab researchers comparing hexarelin vs ipamorelin receptor notes on a lab monitor",
    2: "Gloved researcher aligning a buy hexarelin online COA with the hexarelin acetate vial",
  },
  "thymosin-alpha-1": {
    0: "Scientist reviewing a thymosin alpha-1 28-residue diagram beside a thymosin alpha-1 10mg vial for sale",
    1: "Two researchers checking immune-modulatory assay plates next to a buy thymosin alpha-1 inventory box",
    2: "Gloved hand placing a thymosin alpha-1 peptide buy online vial onto its HPLC chromatogram",
  },
  "kisspeptin-10": {
    0: "Scientist pointing to a kisspeptin-10 KISS1R diagram beside a kisspeptin-10 vial for sale",
    1: "Two lab researchers reviewing kisspeptin-10 for men vs women study notes beside the research vial",
    2: "Gloved researcher matching a buy kisspeptin-10 Certificate of Analysis to the 5mg vial",
  },
  "cagrilintide-semaglutide": {
    0: "Scientist comparing a cagrilintide semaglutide dual-vial layout with amylin and GLP-1 receptor diagrams",
    1: "Two researchers reviewing cagrilintide vs tirzepatide pathway cards beside the blend research vials",
    2: "Gloved hand aligning a cagrilintide-semaglutide blend COA with both lyophilized vials",
  },
  hcg: {
    0: "Scientist reviewing an HCG peptide heterodimer diagram beside an HCG peptide for sale vial",
    1: "Two lab researchers comparing HCG 5000 IU and 10000 IU research vials on a documented lot tray",
    2: "Gloved researcher matching a buy HCG peptide Certificate of Analysis to the lyophilized vial",
  },
  "aicar-50mg": {
    0: "Scientist pointing to an AICAR peptide AMPK activation diagram beside an AICAR 50mg vial for sale",
    1: "Two researchers comparing AICAR vs MOTS-c metabolic-pathway notes beside both research vials",
    2: "Gloved hand placing a buy AICAR vial onto its lot-linked HPLC chromatogram",
  },
}

/** SEO-focused alt text for overview article images — unique wording per slot. */
export function overviewSeoAlt(input: {
  productName: string
  parentHandle: string
  categoryLabel: string
  src: string
  index: number
}): string {
  const baseName = seoBaseName(input.productName)
  const form = detectProductForm(input.parentHandle, baseName)

  const peopleAlt =
    PEOPLE_ILLUSTRATION_ALT_OVERRIDES[input.parentHandle.trim().toLowerCase()]?.[input.index]
  if (peopleAlt) return peopleAlt

  const override = getProductSeoOverride(input.parentHandle)?.imageAlt
  if (input.index === 0 && override?.trim()) {
    return override.trim()
  }

  const category = input.categoryLabel.trim() || "research"

  if (form === "capsule") {
    const name = baseName.replace(/\s*capsules?\s*$/i, "").trim() || baseName
    if (input.index === 0) return `${name} capsules for sale`
    if (input.index === 1) return `Buy ${name} capsules online for laboratory research`
    return `${name} research capsules — ${category}`
  }

  if (form === "nasal") {
    const name = baseName.replace(/\s*nasal\s*spray\s*$/i, "").trim() || baseName
    if (input.index === 0) return `${name} nasal spray for sale`
    if (input.index === 1) return `Buy ${name} nasal spray online for research`
    return `${name} research nasal spray — ${category}`
  }

  if (form === "supply") {
    if (input.index === 0) return `${baseName} for sale for laboratory research`
    if (input.index === 1) return `Buy ${baseName} online — lab supply`
    return `${baseName} research lab supply — ${category}`
  }

  // vial / peptide default
  if (input.index === 0) return `${baseName} peptide for sale in vial`
  if (input.index === 1) return `Buy ${baseName} peptide online — research use only`
  if (/mots-c/i.test(baseName) || /mots-c/i.test(input.src)) {
    return `${baseName} mitochondrial research peptide for sale`
  }
  return `${baseName} research peptide for sale — ${category}`
}

/**
 * Overview article images for the long-form research section.
 * Each product must use its own handle-scoped assets — never share files across PDPs.
 */
export function buildOverviewImages(
  parentHandle: string,
  galleryImages: string[],
  productName: string,
  categoryLabel: string
): ProductOverviewImage[] {
  const unique: string[] = []

  for (const src of getCuratedOverviewImagePaths(parentHandle)) {
    uniquePush(unique, src)
  }

  if (unique.length < 3) {
    for (const src of galleryImages) {
      if (unique.length >= 3) break
      uniquePush(unique, src)
    }
  }

  return unique.slice(0, 3).map((src, index) => ({
    src,
    alt: overviewSeoAlt({
      productName,
      parentHandle,
      categoryLabel,
      src,
      index,
    }),
  }))
}
