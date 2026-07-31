import type { FaqItem } from "@/lib/faq-content"
import productEnrichment from "@/lib/product-enrichment.generated.json"
import { getCompoundFamily } from "@/lib/compound-product"
import {
  normalizeTb500DisplayText,
  stripStrengthFromDisplayName
} from "@/lib/revamp/product-visual"

type EnrichmentRow = {
  cas_number?: string
  appearance?: string
  category?: string
  storage?: string
}

type ResearchForm = "powder" | "capsule" | "nasal" | "liquid"

export type ProductFaqContext = {
  parentHandle: string
  productName?: string
  category?: string
  appearance?: string
}

const ENRICHMENT = productEnrichment as Record<string, EnrichmentRow>

const CATEGORY_RESEARCH_ANGLE: Record<string, string> = {
  "GLP-1 Research": "metabolic and incretin-pathway research models",
  "Tissue Repair": "tissue repair, angiogenesis, and related laboratory models",
  "Growth Hormone Axis": "growth-hormone axis and secretagogue research models",
  "Longevity & Neuropeptides": "longevity, thymic, and neuropeptide research models",
  "Metabolic & Mitochondrial": "metabolic and mitochondrial research models",
  "Research Blends": "multi-component research-blend study designs",
  "Lab Supplies": "laboratory preparation and reconstitution workflows"
}

function enrichmentFor(handle: string): EnrichmentRow {
  if (ENRICHMENT[handle]) return ENRICHMENT[handle]
  const family = getCompoundFamily(handle)
  for (const member of family?.members || []) {
    if (ENRICHMENT[member.handle]) return ENRICHMENT[member.handle]
  }
  return {}
}

function titleFromHandle(handle: string): string {
  return normalizeTb500DisplayText(
    handle
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase())
  )
}

function detectForm(appearance: string, handle: string, productName: string): ResearchForm {
  const hay = `${appearance} ${handle} ${productName}`.toLowerCase()
  if (/nasal/.test(hay)) return "nasal"
  if (/capsule/.test(hay)) return "capsule"
  if (
    /bacteriostatic|acetic acid|benzyl alcohol|solvent|solution|injectable|lipo-c|lemon bottle|l-carnitine|reconstitution/.test(
      hay
    ) ||
    (/\d+\s*ml\b/.test(hay) && !/\d+\s*mg\b/.test(hay))
  ) {
    return "liquid"
  }
  return "powder"
}

function researchAngle(category: string): string {
  return (
    CATEGORY_RESEARCH_ANGLE[category] ||
    `${category || "research peptide"} laboratory study designs`
  )
}

function formHandlingFaq(productName: string, form: ResearchForm): FaqItem {
  switch (form) {
    case "nasal":
      return {
        question: `How should ${productName} nasal spray be handled in the lab?`,
        answer: `${productName} is supplied as a nasal spray formulation for controlled laboratory handling. Keep the unit sealed until use, store per the product specifications, and follow sterile technique under your institutional SOP. This is research-handling guidance only — not clinical administration advice.`
      }
    case "capsule":
      return {
        question: `How should ${productName} capsules be handled for research?`,
        answer: `${productName} is supplied in capsule form for measured research workflows. Store in a cool, dry environment, record lot identity in your ELN, and handle according to your laboratory protocol. Not for human consumption.`
      }
    case "liquid":
      return {
        question: `How should ${productName} liquid be handled in the laboratory?`,
        answer: `${productName} is supplied as a research liquid. Handle under sterile conditions, follow the published storage guidance for this SKU, and retain lot documentation with working stocks. Laboratory use only.`
      }
    default:
      return {
        question: `How should lyophilized ${productName} be reconstituted in the lab?`,
        answer: `Reconstitute under sterile technique with a protocol-appropriate diluent. Avoid vigorous foaming, record diluent lot and final concentration in your ELN, and follow institutional chemical-handling rules. This guidance is for laboratory preparation only — not dosing advice.`
      }
  }
}

function storageFaq(productName: string, form: ResearchForm, storageHint: string): FaqItem {
  if (form === "capsule") {
    return {
      question: `How should ${productName} be stored?`,
      answer: `Store ${productName} capsules in a cool, dry place away from excess heat and moisture, per your laboratory inventory policy. Keep containers sealed and labeled with lot identity.`
    }
  }
  if (form === "liquid" || form === "nasal") {
    return {
      question: `How should ${productName} be stored?`,
      answer: `Follow the storage guidance on this product page${storageHint ? ` (${storageHint})` : ""}. Keep sealed until use, protect from unnecessary temperature excursions, and record open/use dates in your ELN when required by SOP.`
    }
  }
  return {
    question: `How should I store ${productName}?`,
    answer: `Store lyophilized ${productName} at -20°C for long-term stability${storageHint ? ` (catalog note: ${storageHint})` : ""}. Once reconstituted, store at 4°C, minimize freeze–thaw cycles, and use within the window defined by your laboratory protocol.`
  }
}

/**
 * Unique-enough PDP FAQs for any catalog product from handle + enrichment.
 * RUO-safe; no dosing / human-use advice.
 */
export function buildAutoProductFaqs(input: ProductFaqContext): FaqItem[] {
  const handle = input.parentHandle.trim().toLowerCase()
  const enrichment = enrichmentFor(handle)
  // Base compound name only — never selected strength (e.g. "FOXO4-DRI", not "FOXO4-DRI 10mg").
  const productName =
    stripStrengthFromDisplayName(
      normalizeTb500DisplayText(input.productName || "").trim() || titleFromHandle(handle)
    ) || titleFromHandle(handle)
  const category =
    String(input.category || enrichment.category || "research peptide").trim() ||
    "research peptide"
  const appearance = String(input.appearance || enrichment.appearance || "").trim()
  const form = detectForm(appearance, handle, productName)
  const storageHint = String(enrichment.storage || "").trim()
  const cas =
    enrichment.cas_number && enrichment.cas_number !== "N/A"
      ? enrichment.cas_number
      : null
  const angle = researchAngle(category)

  const identityExtra = cas
    ? ` Published identity markers for this catalog family include CAS ${cas}; always cross-check the lot COA before comparative work.`
    : ""

  return [
    {
      question: `What is ${productName} used for in laboratory research?`,
      answer: `${productName} is offered by Tetrava Labs as a Research Use Only reagent for ${angle}. It is intended for qualified laboratory professionals with lot-linked documentation — not for human or veterinary use.${identityExtra}`
    },
    {
      question: `What purity and COA documentation come with ${productName}?`,
      answer: `Lots are verified by independent third-party HPLC-MS analysis where applicable. The purity percentage shown on this page is confirmed on the Certificate of Analysis when published for that batch. Match the COA batch number to the vial before starting work.`
    },
    formHandlingFaq(productName, form),
    storageFaq(productName, form, storageHint),
    {
      question: `How is ${productName} shipped?`,
      answer: `${productName} ships in temperature-controlled packaging where required for the SKU form. Packages are discreet. Tracking is emailed when the carrier label is generated — see the Shipping page for regional delivery windows.`
    },
    {
      question: `Is ${productName} Research Use Only?`,
      answer: `Yes. Tetrava Labs ${productName} is designated Research Use Only. It is not approved for human consumption, diagnostic use, or therapeutic applications. Buyers must be qualified research professionals.`
    }
  ]
}
