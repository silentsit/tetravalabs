/**
 * Expand curated short product overviews into long-form RUO articles (~800–1200 words).
 * Pipeline: write-product-overviews.mjs (3-para seeds) → this script → catalog + storefront JSON.
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

const LABEL = "{productName}"

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

function seedTriple(paragraphs) {
  const list = Array.isArray(paragraphs) ? paragraphs.map((p) => String(p || "").trim()) : []
  if (!list.length) return ["", "", ""]

  // Prefer original 3-para seeds; if already expanded, use first / second / last RUO-ish close.
  if (list.length <= 3) return [list[0] || "", list[1] || "", list[2] || ""]

  const ruo =
    [...list].reverse().find((p) => /research use only|not for human/i.test(p)) || list[list.length - 1]
  return [list[0] || "", list[1] || "", ruo || ""]
}

function handlingParagraph(form) {
  switch (form) {
    case "nasal":
      return `${LABEL} arrives as a nasal spray research formulation. Keep the primary container sealed until use, store according to the published temperature guidance, and dispense only under controlled laboratory conditions with appropriate PPE and chain-of-custody documentation. Prime devices according to your SOP when the format requires it, and never share applicators across operators or study arms.`
    case "capsule":
      return `${LABEL} is supplied in capsule form for measured research workflows. Store capsules in a cool, dry environment away from light and humidity, reconcile counts against your inventory log before each assay series, and document any damaged units as deviations rather than informal discards.`
    case "liquid":
      return `${LABEL} is supplied as a ready research liquid. Inspect clarity and container integrity before use, handle aseptically, and follow the lot-specific storage instructions so solvent or preservative systems remain within validated conditions. Record open-date and expiry-after-opening rules in the ELN when your QMS requires them.`
    default:
      return `${LABEL} is supplied as lyophilized powder for stability during storage and transport. Reconstitute under sterile technique with a protocol-appropriate diluent, avoid vigorous foaming, allow full dissolution before adjusting concentration, and aliquot promptly if your study design requires multiple sessions from one vial.`
  }
}

function categoryResearchParagraph(category) {
  const c = String(category || "research peptide").toLowerCase()
  if (/incretin|glp|metabolic|mitochondrial|weight|obesity/.test(c)) {
    return `Within ${category} research, investigators typically pair this material with receptor-binding, second-messenger, glucose-handling, or metabolic endpoint assays. Comparative designs often include parallel arms against related pathway modulators so effect sizes can be interpreted against a shared assay backbone, identical plate maps, and the same vehicle controls.`
  }
  if (/tissue|repair|cosmetic|copper|tanning|heal|musculo/.test(c)) {
    return `In ${category} models, laboratories commonly evaluate migration, angiogenesis, extracellular-matrix remodeling, or inflammatory readouts. Dose-response plates and time-course sampling help separate early signaling events from longer remodeling endpoints, especially when co-studying companion repair peptides.`
  }
  if (/growth hormone|ghrh|ghrp|secretagog|pituitary|gh-axis/.test(c)) {
    return `GH-axis laboratories use ${category} reagents in receptor pharmacology, secretory-pathway, and comparative analogue studies. Keeping lot identity linked to each plate or ELN entry is essential when stacking multi-peptide protocols or bridging GHRH and GHRP arms.`
  }
  if (/neuropeptide|longevity|cognitive|nootropic|neuro|brain/.test(c)) {
    return `Neuropeptide and longevity groups typically deploy ${category} materials in CNS-signaling, neurotrophic, or cellular-stress assays. Stability of the reconstituted stock and consistent vehicle controls are especially important for multi-day incubation designs and cross-site method transfers.`
  }
  if (/immune|thym|host.defense|inflammation/.test(c)) {
    return `Immunology-oriented ${category} work often combines cell-activation markers, cytokine panels, and host-defense pathway readouts. Document lot identity for every stimulatory condition so immune assay drift is not confused with material variability.`
  }
  if (/lab supplies|reconstitution|solvent|diluent|water|alcohol/.test(c)) {
    return `As a ${category} item, this SKU supports preparation and handling workflows rather than a single pathway endpoint. Standardize lot recording the same way you would for active peptides so reconstitution variables remain auditable across operators and study phases.`
  }
  return `Researchers place this material in ${category} study designs where lot consistency, documented purity, and reproducible preparation matter as much as the nominal mechanism of interest. Write acceptance criteria into the protocol before the first reconstitution.`
}

function mechanismBridgeParagraph(category) {
  return `Mechanism framing for ${LABEL} should stay tied to peer-reviewed pathway language and your laboratory's validated endpoints. Treat marketing synonyms and informal nicknames as labels only. Protocol text should use the catalog identity, category (${category}), and the analytical fields you verified on receipt. When literature reports conflicting potency across analogues, design a head-to-head panel instead of assuming class-wide interchangeability.`
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
    return `Identity confirmation should follow your laboratory SOP: retain the Certificate of Analysis with the working stock, photograph or scan labels into the ELN when policy requires visual evidence, and record catalog handle, batch, and preparation date before any comparative work begins.`
  }
  const head = bits.length
    ? `Published identity markers for this catalog family include ${bits.join("; ")}.`
    : `Published structural identity for this catalog family is summarized on the product analytical panel.`
  const seq = sequence ? ` Sequence / composition note: ${sequence}.` : ""
  return `${head}${seq} Always cross-check the lot COA against these fields before initiating comparative work, and flag mismatches as deviations rather than informal "close enough" substitutions.`
}

function suppliesParagraph(form) {
  if (form === "liquid" || form === "nasal" || form === "capsule") {
    return `Supporting supplies should match the format: calibrated pipettes or dispensers, appropriate PPE, labeled secondary containment, and a documented quarantine shelf for newly received lots until COA filing is complete. Avoid mixing opened and unopened inventory in the same bin without clear status tags.`
  }
  return `Most lyophilized peptide workflows also budget bacteriostatic or sterile diluent, alcohol wipes, sterile vials or tubes for aliquots, and cold-chain capacity consistent with the labeled storage temperature. Align diluent choice with the study design (preserved versus preservative-free) and record the diluent lot beside the peptide lot in every preparation entry.`
}

function expandArticle(handle, seedParagraphs, enrich = {}) {
  const [seedIntro, seedMechanism, seedRuo] = seedTriple(seedParagraphs)
  const category = enrich.category || "Research peptide"
  const form = detectForm(handle, enrich.appearance || "")

  const intro =
    seedIntro ||
    `Buy ${LABEL} online from Tetrava Labs for qualified laboratory research in the ${category} category.`

  const mechanism =
    seedMechanism ||
    `${LABEL} is supplied for controlled laboratory investigation within the ${category} category.`

  const deeper = `${LABEL} is positioned for teams that need a documented research reagent rather than an unverified bulk chemical. When protocols span multiple lots or operators, keep reconstitution parameters, diluent choice, and storage temperature identical across arms so analytical noise is not mistaken for biology. Procurement notes, packing-list reconciliation, and COA filing should happen before the first reconstitution so the chain of custody is intact from receipt to assay. If purchasing is split across weeks, still treat each lot as a separate experimental factor unless a bridging panel demonstrates otherwise.`

  const mechanismBridge = mechanismBridgeParagraph(category)
  const researchCtx = categoryResearchParagraph(category)

  const comparative = `Comparative and bridging studies benefit from writing the material identity into the protocol itself: catalog handle, nominal strength, intended working concentration, and acceptable purity threshold. If a method is transferred between sites, include a small bridging panel on the same lot so site-to-site bias can be quantified separately from compound effects. Blind plate maps where feasible, and reserve enough retention material to repeat a failed run without opening a second anonymous vial. Archive raw plate exports with the same material ID used in the ELN.`

  const workflows = `Typical laboratory workflows start with verifying the sealed vial against the packing list, filing the COA, and assigning an internal material ID. From there, analysts prepare working solutions at concentrations dictated by the assay plate map, reserve a retention aliquot when policy requires it, and dispose of unused reconstituted material according to institutional chemical-waste rules. Electronic lab notebooks should capture operator, timestamp, diluent lot, and any deviations so later audits can reconstruct preparation conditions. A short pre-assay checklist (label match, COA on file, diluent lot recorded) prevents the most common documentation gaps.`

  const handling = handlingParagraph(form)
  const supplies = suppliesParagraph(form)

  const stability = `Stability practice matters as much as nominal potency. Minimize freeze–thaw cycles for reconstituted stocks, protect light-sensitive solutions when the COA or literature flags photolability, and segregate opened vials from unopened inventory. If a study pauses for more than a few days, prefer fresh reconstitution from lyophilized material over aging working solutions unless your validated method says otherwise. Temperature excursions during shipping or bench work should be logged even when the material remains visually unchanged. When in doubt, quarantine the vial and consult the lot COA plus your QMS before continuing.`

  const identity = identityParagraph(enrich)

  const quality = `Tetrava Labs emphasizes lot-linked documentation: when a Certificate of Analysis is published for a batch, treat it as part of the experimental record alongside HPLC or MS summaries referenced on the COA. Third-party analytical testing is used to support identity and purity claims for research procurement, not as a substitute for your own method qualification. If impurity profiles or residual solvents are critical to your endpoint, review the lot documentation before locking the experimental design. Publish or file any in-house confirmatory assays next to the vendor COA so reviewers see both sources.`

  const procurement = `Buy ${LABEL} online when you need research-grade supply with transparent catalog identity and cold-chain aware fulfillment for qualified laboratories. Pack options and strength selections on the product page are designed for lab inventory planning; choose the configuration that matches your assay cadence and retention policy rather than ad-hoc vial counts mid-study. Centralize reorders against the same catalog handle so historical lots remain comparable in your purchasing and ELN systems. Keep packing slips with the batch record for at least as long as your raw data retention policy.`

  const ruoClose =
    seedRuo && /research use only|not for human/i.test(seedRuo)
      ? seedRuo
      : `For research use only. Not for human or veterinary consumption. ${LABEL} is not a drug, food, or cosmetic and must not be used for clinical, diagnostic, or therapeutic purposes.`

  const ethics = `Institutional review, biosafety committee rules, and local chemical-hygiene plans take precedence over any general catalog description. Train operators on spill response and sharps handling before first use, and store access credentials or purchasing rights to staff who understand the research-only restriction. Misuse outside a controlled laboratory setting voids the intended purpose of this SKU. Display research-only labeling on secondary containers whenever material leaves the original vial.`

  return [
    intro,
    mechanism,
    deeper,
    mechanismBridge,
    researchCtx,
    comparative,
    workflows,
    handling,
    supplies,
    stability,
    identity,
    quality,
    procurement,
    ethics,
    ruoClose
  ]
}

function wordCount(paragraphs) {
  return paragraphs.join(" ").trim().split(/\s+/).filter(Boolean).length
}

async function run() {
  const seed = JSON.parse(await fs.readFile(seedPath, "utf8"))
  const enrich = JSON.parse(await fs.readFile(enrichPath, "utf8"))

  const payload = {}
  const lengths = []

  for (const [handle, row] of Object.entries(seed)) {
    const paragraphs = expandArticle(handle, row.paragraphs || [], enrich[handle] || {})
    payload[handle] = { paragraphs }
    lengths.push({ handle, words: wordCount(paragraphs) })
  }

  for (const [parent, from] of [
    ["igf-1-lr3", "igf-1-lr3-1mg"],
    ["bpc-157-tb500-blend", "bpc-157-5mg-tb500-5mg-10mg"]
  ]) {
    if (!payload[parent] && payload[from]) payload[parent] = payload[from]
  }

  const json = `${JSON.stringify(payload, null, 2)}\n`
  await fs.writeFile(outCatalog, json, "utf8")
  await fs.writeFile(outStorefront, json, "utf8")

  lengths.sort((a, b) => a.words - b.words)
  const under = lengths.filter((row) => row.words < 800)
  const over = lengths.filter((row) => row.words > 1200)
  console.log(
    `Wrote ${Object.keys(payload).length} long-form overviews (words ${lengths[0].words}–${lengths[lengths.length - 1].words}, median ${lengths[Math.floor(lengths.length / 2)].words})`
  )
  if (under.length) {
    console.warn(
      `Below 800 words (${under.length}): ${under
        .slice(0, 8)
        .map((row) => `${row.handle}:${row.words}`)
        .join(", ")}`
    )
  }
  if (over.length) {
    console.warn(
      `Above 1200 words (${over.length}): ${over
        .slice(0, 8)
        .map((row) => `${row.handle}:${row.words}`)
        .join(", ")}`
    )
  }
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
