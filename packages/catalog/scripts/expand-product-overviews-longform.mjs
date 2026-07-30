/**
 * Expand curated short product overviews into long-form RUO articles.
 * Reads seed paragraphs + enrichment; writes catalog + storefront JSON.
 *
 * Usage: node packages/catalog/scripts/expand-product-overviews-longform.mjs
 */
import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, "..", "..", "..")
const seedPath = path.join(root, "packages", "catalog", "data", "product-overviews.json")
const enrichPath = path.join(
  root,
  "apps",
  "storefront",
  "src",
  "lib",
  "product-enrichment.generated.json"
)
const outCatalog = seedPath
const outStorefront = path.join(
  root,
  "apps",
  "storefront",
  "src",
  "lib",
  "product-overviews.generated.json"
)

function detectForm(handle, appearance = "") {
  const hay = `${handle} ${appearance}`.toLowerCase()
  if (/nasal/.test(hay)) return "nasal"
  if (/capsule/.test(hay)) return "capsule"
  if (
    /bacteriostatic|acetic|benzyl|solvent|water|lipo-c|lemon-bottle|l-carnitine/.test(hay) ||
    (/\d+ml/.test(hay) && !/\d+mg/.test(hay))
  ) {
    return "liquid"
  }
  return "powder"
}

function handlingParagraph(productLabel, form) {
  switch (form) {
    case "nasal":
      return `${productLabel} arrives as a nasal spray research formulation. Keep the primary container sealed until use, store according to the published temperature guidance, and dispense only under controlled laboratory conditions with appropriate PPE and documentation.`
    case "capsule":
      return `${productLabel} is supplied in capsule form for measured research workflows. Store capsules in a cool, dry environment away from light and humidity, and reconcile counts against your inventory log before each assay series.`
    case "liquid":
      return `${productLabel} is supplied as a ready research liquid. Inspect clarity before use, handle aseptically, and follow the lot-specific storage instructions so solvent or preservative systems remain within validated conditions.`
    default:
      return `${productLabel} is supplied as lyophilized powder for stability during storage and transport. Reconstitute under sterile technique with a protocol-appropriate diluent, avoid vigorous foaming, and aliquot promptly if your study design requires multiple sessions from one vial.`
  }
}

function categoryResearchParagraph(category) {
  const c = String(category || "research peptide").toLowerCase()
  if (/incretin|glp|metabolic|mitochondrial/.test(c)) {
    return `Within ${category} research, investigators typically pair this material with receptor-binding, second-messenger, or metabolic endpoint assays. Comparative designs often include parallel arms against related pathway modulators so effect sizes can be interpreted against a shared assay backbone.`
  }
  if (/tissue|repair|cosmetic|copper|tanning/.test(c)) {
    return `In ${category} models, laboratories commonly evaluate migration, angiogenesis, extracellular-matrix, or inflammatory readouts. Dose-response plates and time-course sampling help separate early signaling events from longer remodeling endpoints.`
  }
  if (/growth hormone|ghrh|ghrp|cjc|ipamorelin/.test(c)) {
    return `GH-axis laboratories use ${category} reagents in receptor pharmacology, secretory-pathway, and comparative analogue studies. Keeping lot identity linked to each plate or ELN entry is essential when stacking multi-peptide protocols.`
  }
  if (/neuropeptide|longevity|cognitive|nootropic/.test(c)) {
    return `Neuropeptide and longevity groups typically deploy ${category} materials in CNS-signaling, neurotrophic, or cellular-stress assays. Stability of the reconstituted stock and consistent vehicle controls are especially important for multi-day incubation designs.`
  }
  if (/lab supplies|reconstitution|solvent/.test(c)) {
    return `As a ${category} item, this SKU supports preparation and handling workflows rather than a single pathway endpoint. Standardize lot recording the same way you would for active peptides so reconstitution variables remain auditable.`
  }
  return `Researchers place this material in ${category} study designs where lot consistency, documented purity, and reproducible preparation matter as much as the nominal mechanism of interest.`
}

function identityParagraph(enrich) {
  const bits = []
  if (enrich.cas_number && enrich.cas_number !== "N/A") bits.push(`CAS ${enrich.cas_number}`)
  if (enrich.molecular_formula && enrich.molecular_formula !== "N/A") {
    bits.push(`molecular formula ${enrich.molecular_formula}`)
  }
  if (enrich.molecular_weight && enrich.molecular_weight !== "N/A") {
    bits.push(`approximate molecular weight ${enrich.molecular_weight}`)
  }
  const sequence = enrich.sequence && enrich.sequence !== "N/A" ? enrich.sequence : null
  if (!bits.length && !sequence) {
    return `Identity confirmation should follow your laboratory SOP: retain the Certificate of Analysis with the working stock, and record catalog handle, batch, and preparation date in the ELN or inventory system.`
  }
  const head = bits.length
    ? `Published identity markers for this catalog family include ${bits.join("; ")}.`
    : `Published structural identity for this catalog family is summarized on the product analytical panel.`
  const seq = sequence
    ? ` Sequence / composition note: ${sequence}.`
    : ""
  return `${head}${seq} Always cross-check the lot COA against these fields before initiating comparative work.`
}

function expandArticle(handle, seedParagraphs, enrich = {}) {
  const [p1 = "", p2 = "", p3 = ""] = seedParagraphs
  const category = enrich.category || "Research peptide"
  const form = detectForm(handle, enrich.appearance || "")
  const label = "{productName}"

  const intro =
    p1.trim() ||
    `Buy ${label} online from Tetrava Labs for qualified laboratory research in the ${category} category.`

  const mechanism =
    p2.trim() ||
    `${label} is supplied for controlled laboratory investigation within the ${category} category.`

  const deeper = `${label} is positioned for teams that need a documented research reagent rather than an unverified bulk chemical. When protocols span multiple lots or operators, keep reconstitution parameters, diluent choice, and storage temperature identical across arms so analytical noise is not mistaken for biology. Procurement notes, packing-list reconciliation, and COA filing should happen before the first reconstitution so the chain of custody is intact from receipt to assay.`

  const researchCtx = categoryResearchParagraph(category)

  const comparative = `Comparative and bridging studies benefit from writing the material identity into the protocol itself: catalog handle, nominal strength, intended working concentration, and acceptable purity threshold. If a method is transferred between sites, include a small bridging panel on the same lot so site-to-site bias can be quantified separately from compound effects.`

  const workflows = `Typical laboratory workflows start with verifying the sealed vial against the packing list, filing the COA, and assigning an internal material ID. From there, analysts prepare working solutions at concentrations dictated by the assay plate map, reserve a retention aliquot when policy requires it, and dispose of unused reconstituted material according to institutional chemical-waste rules. Electronic lab notebooks should capture operator, timestamp, diluent lot, and any deviations so later audits can reconstruct preparation conditions.`

  const handling = handlingParagraph(label, form)
  const stability = `Stability practice matters as much as nominal potency. Minimize freeze–thaw cycles for reconstituted stocks, protect light-sensitive solutions when the COA or literature flags photolability, and segregate opened vials from unopened inventory. If a study pauses for more than a few days, prefer fresh reconstitution from lyophilized material over aging working solutions unless your validated method says otherwise.`
  const identity = identityParagraph(enrich)

  const quality = `Tetrava Labs emphasizes lot-linked documentation: when a Certificate of Analysis is published for a batch, treat it as part of the experimental record alongside HPLC or MS summaries referenced on the COA. Third-party analytical testing is used to support identity and purity claims for research procurement — not as a substitute for your own method qualification. If impurity profiles or residual solvents are critical to your endpoint, review the lot documentation before locking the experimental design.`

  const procurement = `Buy ${label} online when you need research-grade supply with transparent catalog identity and cold-chain aware fulfillment for qualified laboratories. Pack options and strength selections on the product page are designed for lab inventory planning; choose the configuration that matches your assay cadence and retention policy rather than ad-hoc vial counts mid-study.`

  const ruo =
    p3.trim() ||
    `For research use only — not for human or veterinary consumption. ${label} is not a drug, food, or cosmetic and must not be used for clinical, diagnostic, or therapeutic purposes.`

  return [
    intro,
    mechanism,
    deeper,
    researchCtx,
    comparative,
    workflows,
    handling,
    stability,
    identity,
    quality,
    procurement,
    ruo
  ]
}

async function run() {
  const seed = JSON.parse(await fs.readFile(seedPath, "utf8"))
  const enrich = JSON.parse(await fs.readFile(enrichPath, "utf8"))

  const payload = {}
  for (const [handle, row] of Object.entries(seed)) {
    const paragraphs = Array.isArray(row.paragraphs) ? row.paragraphs : []
    payload[handle] = {
      paragraphs: expandArticle(handle, paragraphs, enrich[handle] || {})
    }
  }

  // Ensure merge parents exist even if seed lacked them
  for (const [parent, from] of [
    ["igf-1-lr3", "igf-1-lr3-1mg"],
    ["bpc-157-tb500-blend", "bpc-157-5mg-tb500-5mg-10mg"]
  ]) {
    if (!payload[parent] && payload[from]) payload[parent] = payload[from]
  }

  const json = `${JSON.stringify(payload, null, 2)}\n`
  await fs.writeFile(outCatalog, json, "utf8")
  await fs.writeFile(outStorefront, json, "utf8")

  const sample = payload["bpc-157"]?.paragraphs?.join(" ") || ""
  console.log(
    `Wrote ${Object.keys(payload).length} long-form overviews (sample bpc-157 ~${sample.split(/\s+/).length} words)`
  )
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
