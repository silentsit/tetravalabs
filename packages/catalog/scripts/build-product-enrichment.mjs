/**
 * Rebuild packages/catalog/data/product-enrichment.json from:
 * - existing enrichment (storage/appearance overrides)
 * - COA sheet chemistry (_sheet-products.json)
 * - COA dataset formula/MW when available
 * - curated sequences + molecular weights
 *
 * Usage: node packages/catalog/scripts/build-product-enrichment.mjs
 */
import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, "..", "..", "..")
const enrichmentPath = path.join(root, "packages", "catalog", "data", "product-enrichment.json")
const catalogPath = path.join(root, "product_catalog_usd.json")
const sheetPath = path.join(root, "tools", "coa-replicate", "_sheet-products.json")
const datasetsDir = path.join(root, "tools", "coa-replicate", "datasets")

const SUB = {
  "₀": "0",
  "₁": "1",
  "₂": "2",
  "₃": "3",
  "₄": "4",
  "₅": "5",
  "₆": "6",
  "₇": "7",
  "₈": "8",
  "₉": "9"
}

const asciiFormula = (value) => {
  if (!value || value === "—" || value === "-") return null
  return String(value).replace(/[₀-₉]/g, (ch) => SUB[ch] || ch).trim()
}

const cleanMw = (value) => {
  if (!value || value === "—" || value === "-" || /see formula/i.test(String(value))) return null
  const match = String(value).replace(/,/g, "").match(/(\d+(?:\.\d+)?)/)
  return match ? match[1] : null
}

/** Catalog product name → sheet / chemistry lookup aliases */
const NAME_ALIASES = {
  TB500: ["TB-500", "TB500"],
  "BPC-157 + TB-500 Blend (10mg)": ["BPC-157 + TB-500", "BPC-157 + TB500 Blend"],
  "BPC-157 + TB-500 Blend (20mg)": ["BPC-157 + TB-500", "BPC-157 + TB500 Blend"],
  "CU 50mg + TB500 10mg + BPC-157 10mg + KPV 10mg (80mg)": [
    "BPC-157 + TB-500 + Cu + KPV",
    "CU 50mg + TB500 10mg + BPC-157 10mg + KPV 10mg"
  ],
  "Glow BPC-157 + TB500 + GHK-Cu": ["Glow Blend"],
  "Glow TB500 10mg + BPC-157 10mg + GHK-Cu 50mg (70mg)": ["Glow Blend"],
  "CJC-1295 with DAC": ["CJC-1295 + DAC"],
  "CJC-1295 without DAC": ["CJC-1295 [no DAC]", "CJC-1295 without DAC"],
  "CJC-1295 without DAC / Ipamorelin Blend": [
    "CJC-1295 [no DAC] + Ipamorelin",
    "CJC-1295 without DAC / Ipamorelin Blend"
  ],
  "CJC-1295 without DAC / Sermorelin / Ipamorelin Blend": [
    "CJC-1295 [no DAC] + Ipamorelin + Sermorelin"
  ],
  "Melanotan 1": ["Melanotan 1", "Melanotan-1"],
  "Melanotan 2": ["Melanotan 2", "Melanotan-2", "Melanotan-2"],
  "GHK-Cu": ["GHK-Cu", "GHK-CU"],
  "MOTS-c": ["MOTS-c", "MOTS-C"],
  "BPC-157 (Capsules)": ["BPC-157"],
  "Pinealon Capsules": ["Pinealon"],
  "IGF-1 LR3 0.1mg": ["IGF-1 LR3"],
  "L-Carnitine 600mg (10ml)": ["L-Carnitine"],
  "5-amino-1mq": ["5-amino-1mq", "5-Amino-1MQ"]
}

/** Authoritative MW (g/mol) — PubChem / literature / prior COAs */
const MW_BY_KEY = {
  Semaglutide: "4113.58",
  Tirzepatide: "4813.45",
  Retatrutide: "4731.33",
  Cagrilintide: "4409.01",
  Mazdutide: "4813.53",
  Survodutide: "4231.69",
  Tesamorelin: "5135.90",
  Sermorelin: "3357.93",
  "AOD-9604": "1815.08",
  "5-amino-1mq": "173.21",
  "BPC-157": "1419.53",
  TB500: "4963.49",
  Ipamorelin: "711.85",
  "CJC-1295 with DAC": "3647.28",
  "CJC-1295 without DAC": "3367.95",
  "GHK-Cu": "400.92",
  "Melanotan 2": "1024.18",
  "Melanotan 1": "1646.85",
  "MOTS-c": "2174.66",
  AICAR: "258.23",
  Adipotide: "2612.0",
  "ARA-290": "756.85",
  Bremelanotide: "1025.18",
  DSIP: "848.81",
  Dermorphin: "802.88",
  Dihexa: "438.53",
  Epithalon: "390.35",
  KPV: "342.43",
  "Kisspeptin-10": "1302.45",
  "LL-37": "4493.32",
  "NAD+": "663.43",
  "Oxytocin Acetate": "1007.19",
  Selank: "751.89",
  "Selank Nasal Spray": "751.89",
  Semax: "813.93",
  "Semax Nasal Spray": "813.93",
  "Thymosin alpha-1": "3108.37",
  VIP: "3325.87",
  Pinealon: "389.39",
  Humanin: "2687.23",
  Adamax: "826.91", // C37H54N12O10
  Glutathione: "307.32",
  "B-12": "1355.37",
  Gonadorelin: "1182.31",
  "HGH 191aa": "22124.0",
  "IGF-1 LR3": "9111.0",
  "GHRP-2 Acetate": "817.97",
  "GHRP-6 Acetate": "873.03",
  "Hexarelin Acetate": "887.06",
  "MK-677": "528.67",
  "Snap-8": "1075.16",
  "SS-31": "639.79",
  "L-Glu": "146.14",
  "Acetic Acid Water": "60.05",
  "Bacteriostatic Water": "18.02",
  "Benzyl Alcohol": "108.14",
  "L-Carnitine 600mg (10ml)": "161.20",
  FOXO4: "3500+",
  "FOXO4-DRI": "~3500 (synthetic peptide)",
  HCG: "~36700 (glycoprotein)",
  HMG: "Complex glycoprotein mixture",
  MGF: "2867.2",
  "PEG-MGF": "PEGylated MGF (variable)",
  "Lemon Bottle": "Multi-component blend",
  "Lipo-C": "Multi-component blend",
  Cerebrolysin: "Peptide mixture (porcine brain hydrolysate)",
  Thymalin: "Thymic peptide complex",
  "NAD+": "663.43",
  "Cagrilintide + Semaglutide": "See component peptides",
  "BPC-157 (Capsules)": "1419.53",
  "BPC-157 + TB-500 Blend (10mg)": "See component peptides",
  "BPC-157 + TB-500 Blend (20mg)": "See component peptides",
  "CU 50mg + TB500 10mg + BPC-157 10mg + KPV 10mg (80mg)": "See component peptides",
  "Glow BPC-157 + TB500 + GHK-Cu": "See component peptides",
  "Glow TB500 10mg + BPC-157 10mg + GHK-Cu 50mg (70mg)": "See component peptides",
  "CJC-1295 without DAC / Ipamorelin Blend": "See component peptides",
  "CJC-1295 without DAC / Sermorelin / Ipamorelin Blend": "See component peptides",
  "IGF-1 LR3 0.1mg": "9111.0",
  "Pinealon Capsules": "389.39"
}

/** Fallback formulas when sheet/COA omit them */
const FORMULA_BY_KEY = {
  "NAD+": "C21H26N7O14P2",
  "FOXO4-DRI": "Synthetic D-retro-inverso peptide",
  Thymalin: "Thymic peptide complex",
  Cerebrolysin: "Porcine brain peptide hydrolysate",
  "Lemon Bottle": "Multi-component (PPC / L-carnitine / riboflavin)",
  "Lipo-C": "Multi-component (choline / methionine / inositol / B vitamins)",
  HCG: "Glycoprotein hormone (α/β subunits)",
  HMG: "FSH/LH glycoprotein mixture",
  MGF: "C121H200N42O39",
  "PEG-MGF": "PEGylated MGF (variable PEG chain)"
}

/**
 * One-letter / standard peptide sequences where applicable.
 * Non-peptides and complex biologics → "N/A".
 * Blends → component note.
 */
const SEQUENCE_BY_KEY = {
  Semaglutide:
    "H-His-Aib-Glu-Gly-Thr-Phe-Thr-Ser-Asp-Val-Ser-Ser-Tyr-Leu-Glu-Gly-Gln-Ala-Ala-Lys(AEEA-AEEA-γ-Glu-C18 diacid)-Glu-Phe-Ile-Ala-Trp-Leu-Val-Arg-Gly-Arg-Gly-OH",
  Tirzepatide:
    "Y-Aib-EGTFTSDYSI-Aib-LDKIAQK(AEEA-AEEA-γ-Glu-C20 diacid)AFVQWLIAGGPSSGAPPPS-NH2",
  Retatrutide: "Modified triple-agonist peptide (GLP-1/GIP/glucagon): see literature for full sequence",
  Cagrilintide: "Modified amylin analogue: see literature for full sequence",
  Mazdutide: "Modified GLP-1/glucagon dual agonist: see literature for full sequence",
  Survodutide: "Modified GLP-1/glucagon dual agonist: see literature for full sequence",
  Tesamorelin: "trans-3-hexenoyl-Tyr-Ala-Asp-Ala-Ile-Phe-Thr-Asn-Ser-Tyr-Arg-Lys-Val-Leu-Gly-Gln-Leu-Ser-Ala-Arg-Lys-Leu-Leu-Gln-Asp-Ile-Met-Ser-Arg-Gln-Gln-Gly-Glu-Ser-Asn-Gln-Glu-Arg-Gly-Ala-Arg-Ala-Arg-Leu-NH2",
  Sermorelin: "Tyr-Ala-Asp-Ala-Ile-Phe-Thr-Asn-Ser-Tyr-Arg-Lys-Val-Leu-Gly-Gln-Leu-Ser-Ala-Arg-Lys-Leu-Leu-Gln-Asp-Ile-Met-Ser-Arg-NH2",
  "AOD-9604": "Tyr-hGH(177-191) with Aib substitution (Tyr-Leu-Arg-Ile-Val-Gln-Cys-Arg-Ser-Val-Glu-Gly-Ser-Cys-Gly-Phe)",
  "5-amino-1mq": "N/A (small molecule)",
  "BPC-157": "Gly-Glu-Pro-Pro-Pro-Gly-Lys-Pro-Ala-Asp-Asp-Ala-Gly-Leu-Val",
  "BPC-157 (Capsules)": "Gly-Glu-Pro-Pro-Pro-Gly-Lys-Pro-Ala-Asp-Asp-Ala-Gly-Leu-Val",
  TB500: "Ac-Leu-Lys-Lys-Thr-Glu-Thr-Gln (TB-500 / Thymosin β4 fragment)",
  Ipamorelin: "Aib-His-D-2-Nal-D-Phe-Lys-NH2",
  "CJC-1295 without DAC":
    "Tyr-D-Ala-Asp-Ala-Ile-Phe-Thr-Gln-Ser-Tyr-Arg-Lys-Val-Leu-Ala-Gln-Leu-Ser-Ala-Arg-Lys-Leu-Leu-Gln-Asp-Ile-Leu-Ser-Arg-NH2",
  "CJC-1295 with DAC":
    "Tyr-D-Ala-Asp-Ala-Ile-Phe-Thr-Gln-Ser-Tyr-Arg-Lys-Val-Leu-Ala-Gln-Leu-Ser-Ala-Arg-Lys-Leu-Leu-Gln-Asp-Ile-Leu-Ser-Arg-Lys(DAC)-NH2",
  "GHK-Cu": "Gly-His-Lys (copper complex)",
  "Melanotan 1": "Ac-Ser-Tyr-Ser-Nle-Glu-His-D-Phe-Arg-Trp-Gly-Lys-Pro-Val-NH2",
  "Melanotan 2": "Ac-Nle-cyclo[Asp-His-D-Phe-Arg-Trp-Lys]-NH2",
  "MOTS-c": "Met-Arg-Trp-Gln-Glu-Met-Gly-Tyr-Ile-Phe-Tyr-Pro-Arg-Lys-Leu-Arg",
  AICAR: "N/A (nucleoside analogue)",
  Adipotide: "CKGGRAKDC-GG-D(KLAKLAK)2",
  "ARA-290": "pGlu-Glu-Gln-Leu-Glu-Arg-Ala-Leu-Asn-Ser-Ser",
  Bremelanotide: "Ac-Nle-cyclo[Asp-His-D-Phe-Arg-Trp-Lys]-OH",
  DSIP: "Trp-Ala-Gly-Gly-Asp-Ala-Ser-Gly-Glu",
  Dermorphin: "Tyr-D-Ala-Phe-Gly-Tyr-Pro-Ser-NH2",
  Dihexa: "N/A (hexapeptide analogue / small molecule hybrid)",
  Epithalon: "Ala-Glu-Asp-Gly",
  "FOXO4-DRI": "D-retro-inverso FOXO4 p53-binding peptide",
  KPV: "Lys-Pro-Val",
  "Kisspeptin-10": "Tyr-Asn-Trp-Asn-Ser-Phe-Gly-Leu-Arg-Phe-NH2",
  "LL-37":
    "LLGDFFRKSKEKIGKEFKRIVQRIKDFLRNLVPRTES",
  "NAD+": "N/A (dinucleotide)",
  "Oxytocin Acetate": "Cys-Tyr-Ile-Gln-Asn-Cys-Pro-Leu-Gly-NH2 (disulfide 1–6)",
  Selank: "Thr-Lys-Pro-Arg-Pro-Gly-Pro",
  "Selank Nasal Spray": "Thr-Lys-Pro-Arg-Pro-Gly-Pro",
  Semax: "Met-Glu-His-Phe-Pro-Gly-Pro",
  "Semax Nasal Spray": "Met-Glu-His-Phe-Pro-Gly-Pro",
  Thymalin: "Thymic peptide complex (multi-component)",
  "Thymosin alpha-1":
    "Ac-Ser-Asp-Ala-Ala-Val-Asp-Thr-Ser-Ser-Glu-Ile-Thr-Thr-Lys-Asp-Leu-Lys-Glu-Lys-Lys-Glu-Val-Val-Glu-Glu-Ala-Glu-Asn-OH",
  VIP: "His-Ser-Asp-Ala-Val-Phe-Thr-Asp-Asn-Tyr-Thr-Arg-Leu-Arg-Lys-Gln-Met-Ala-Val-Lys-Lys-Tyr-Leu-Asn-Ser-Ile-Leu-Asn-NH2",
  Pinealon: "Glu-Asp-Arg",
  "Pinealon Capsules": "Glu-Asp-Arg",
  Humanin: "Met-Ala-Pro-Arg-Gly-Phe-Ser-Cys-Leu-Leu-Leu-Leu-Thr-Ser-Glu-Ile-Asp-Leu-Pro-Val-Lys-Arg-Arg-Ala",
  Adamax: "Ac-Met-Glu-His-Phe-Pro-Gly-Pro-NH2 (N-acetyl Semax amidate analogue)",
  Glutathione: "γ-Glu-Cys-Gly",
  "B-12": "N/A (cobalamin)",
  Gonadorelin: "pGlu-His-Trp-Ser-Tyr-Gly-Leu-Arg-Pro-Gly-NH2",
  HCG: "N/A (heterodimeric glycoprotein hormone)",
  "HGH 191aa": "191-aa somatropin sequence (see UniProt P01241)",
  HMG: "N/A (FSH/LH glycoprotein mixture)",
  "IGF-1 LR3": "Long Arg3 IGF-1 (83 aa analogue of IGF-1)",
  "IGF-1 LR3 0.1mg": "Long Arg3 IGF-1 (83 aa analogue of IGF-1)",
  MGF: "YQPPSTNKNTKSQRRKGSTFEEHK (IGF-1 Ec / MGF)",
  "PEG-MGF": "PEGylated MGF (YQPPSTNKNTKSQRRKGSTFEEHK)",
  "GHRP-2 Acetate": "D-Ala-D-2-Nal-Ala-Trp-D-Phe-Lys-NH2",
  "GHRP-6 Acetate": "His-D-Trp-Ala-Trp-D-Phe-Lys-NH2",
  "Hexarelin Acetate": "His-D-2-Me-Trp-Ala-Trp-D-Phe-Lys-NH2",
  "MK-677": "N/A (non-peptide ghrelin mimetic)",
  "Snap-8": "Ac-Glu-Glu-Met-Gln-Arg-Arg-Ala-Asp-NH2",
  "SS-31": "D-Arg-Dmt-Lys-Phe-NH2",
  "L-Glu": "N/A (amino acid)",
  "L-Carnitine 600mg (10ml)": "N/A (quaternary ammonium)",
  "Acetic Acid Water": "N/A (solvent)",
  "Bacteriostatic Water": "N/A (solvent)",
  "Benzyl Alcohol": "N/A (solvent / preservative)",
  "Lemon Bottle": "N/A (multi-component solution)",
  "Lipo-C": "N/A (multi-component solution)",
  Cerebrolysin: "N/A (peptide mixture)",
  "Cagrilintide + Semaglutide": "Multi-component: see Cagrilintide and Semaglutide",
  "BPC-157 + TB-500 Blend (10mg)": "Multi-component: see BPC-157 and TB-500",
  "BPC-157 + TB-500 Blend (20mg)": "Multi-component: see BPC-157 and TB-500",
  "CU 50mg + TB500 10mg + BPC-157 10mg + KPV 10mg (80mg)":
    "Multi-component: see GHK-Cu, TB-500, BPC-157, KPV",
  "Glow BPC-157 + TB500 + GHK-Cu": "Multi-component: see BPC-157, TB-500, GHK-Cu",
  "Glow TB500 10mg + BPC-157 10mg + GHK-Cu 50mg (70mg)":
    "Multi-component: see BPC-157, TB-500, GHK-Cu",
  "CJC-1295 without DAC / Ipamorelin Blend": "Multi-component: see CJC-1295 (no DAC) and Ipamorelin",
  "CJC-1295 without DAC / Sermorelin / Ipamorelin Blend":
    "Multi-component: see CJC-1295 (no DAC), Sermorelin, Ipamorelin"
}

const APPEARANCE_DEFAULTS = {
  "Selank Nasal Spray": "Clear nasal solution",
  "Semax Nasal Spray": "Clear nasal solution",
  "Bacteriostatic Water": "Clear, colorless liquid",
  "Acetic Acid Water": "Clear, colorless liquid",
  "Benzyl Alcohol": "Clear, colorless liquid",
  "Lemon Bottle": "Clear to pale yellow sterile solution",
  "Lipo-C": "Clear to pale yellow sterile solution",
  "L-Carnitine 600mg (10ml)": "Clear sterile solution",
  "GHK-Cu": "Blue to blue-green lyophilized powder",
  "BPC-157 (Capsules)": "White capsule",
  "Pinealon Capsules": "White capsule"
}

const STORAGE_DEFAULTS = {
  "Selank Nasal Spray": "2-8°C refrigerated; do not freeze",
  "Semax Nasal Spray": "2-8°C refrigerated; do not freeze",
  "Bacteriostatic Water": "15-30°C (controlled room temperature)",
  "Acetic Acid Water": "15-30°C (controlled room temperature)",
  "Benzyl Alcohol": "15-30°C (controlled room temperature)",
  "Lemon Bottle": "2-8°C refrigerated",
  "Lipo-C": "2-8°C refrigerated",
  "L-Carnitine 600mg (10ml)": "2-8°C refrigerated",
  "GHK-Cu": "2-8°C",
  "5-amino-1mq": "-20C lyophilized"
}

const readJson = async (filePath) => {
  const raw = await fs.readFile(filePath, "utf8")
  return JSON.parse(raw.replace(/^\uFEFF/, ""))
}

const lookupChemistry = (name, sheetByName, datasetByHandle) => {
  const aliases = NAME_ALIASES[name] || [name]
  for (const alias of aliases) {
    if (sheetByName[alias]) return { ...sheetByName[alias], source: "sheet" }
  }
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
  if (datasetByHandle[slug]) return { ...datasetByHandle[slug], source: "dataset" }
  for (const alias of aliases) {
    const aliasSlug = alias
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
    if (datasetByHandle[aliasSlug]) return { ...datasetByHandle[aliasSlug], source: "dataset" }
  }
  return null
}

const run = async () => {
  const existing = await readJson(enrichmentPath)
  const catalog = await readJson(catalogPath)
  const sheet = await readJson(sheetPath)

  const sheetByName = {}
  for (const row of sheet) {
    if (!sheetByName[row.product_name]) {
      sheetByName[row.product_name] = {
        cas: row.cas || null,
        formula: asciiFormula(row.formula)
      }
    }
  }

  const datasetByHandle = {}
  const files = await fs.readdir(datasetsDir)
  for (const file of files) {
    if (!file.endsWith(".json") || file.startsWith("_") || file === "schema.json") continue
    const data = await readJson(path.join(datasetsDir, file))
    const handle = data.product_handle
    if (!handle || datasetByHandle[handle]) continue
    const product = data.product || {}
    datasetByHandle[handle] = {
      cas: product.cas || null,
      formula: asciiFormula(product.formula),
      mw: cleanMw(product.mw),
      appearance: product.appearance || null
    }
  }

  const names = [...new Set(catalog.map((row) => row.name))]
  const out = {}

  for (const name of names) {
    const prev = existing[name] || {}
    const chem = lookupChemistry(name, sheetByName, datasetByHandle) || {}
    const curatedMw = MW_BY_KEY[name]
      ? cleanMw(MW_BY_KEY[name]) || MW_BY_KEY[name]
      : null
    const formula =
      FORMULA_BY_KEY[name] ||
      asciiFormula(prev.molecular_formula) ||
      chem.formula ||
      null
    const mw = curatedMw || cleanMw(prev.molecular_weight) || chem.mw || null
    const sequence = SEQUENCE_BY_KEY[name] || prev.sequence || "N/A"
    const isCapsule = /capsule/i.test(name)
    const isNasal = /nasal\s*spray/i.test(name)
    const isSolution =
      /(water|alcohol|lipo-c|lemon bottle|l-carnitine)/i.test(name) || isNasal

    out[name] = {
      cas_number: prev.cas_number || chem.cas || null,
      molecular_formula: formula,
      molecular_weight: mw,
      sequence,
      storage: prev.storage || STORAGE_DEFAULTS[name] || "-20C lyophilized",
      appearance:
        prev.appearance ||
        APPEARANCE_DEFAULTS[name] ||
        chem.appearance ||
        (isCapsule
          ? "White capsule"
          : isSolution
            ? "Clear solution"
            : "White lyophilized powder")
    }
  }

  // Keep orphan enrichment keys (legacy aliases) merged in for normalize lookups
  for (const [key, value] of Object.entries(existing)) {
    if (out[key]) continue
    out[key] = {
      cas_number: value.cas_number || null,
      molecular_formula: asciiFormula(value.molecular_formula),
      molecular_weight: cleanMw(value.molecular_weight),
      sequence: value.sequence || SEQUENCE_BY_KEY[key] || "N/A",
      storage: value.storage || "-20C lyophilized",
      appearance: value.appearance || "White lyophilized powder"
    }
  }

  const sorted = Object.fromEntries(
    Object.entries(out).sort(([a], [b]) => a.localeCompare(b, "en"))
  )

  await fs.writeFile(enrichmentPath, `${JSON.stringify(sorted, null, 2)}\n`, "utf8")

  const gaps = names.filter((name) => {
    const e = sorted[name]
    return !e.cas_number || !e.molecular_formula || !e.molecular_weight || !e.sequence
  })

  console.log(`Wrote enrichment for ${Object.keys(sorted).length} keys (${names.length} catalog names)`)
  console.log(`Remaining hard gaps: ${gaps.length}`)
  if (gaps.length) {
    for (const name of gaps) {
      const e = sorted[name]
      console.log(
        ` - ${name}: cas=${!!e.cas_number} formula=${!!e.molecular_formula} mw=${!!e.molecular_weight} seq=${!!e.sequence}`
      )
    }
  }
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
