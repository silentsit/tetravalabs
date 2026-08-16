import "server-only"

import compoundFamilies from "@/lib/compound-families.generated.json"
import compoundLegacyRedirects from "@/lib/compound-legacy-redirects.generated.json"
import productOverviews from "@/lib/product-overviews.generated.json"
import { categorySlugFromLabel } from "@/lib/categories"
import { ensureMinimumInternalLinks } from "@/lib/product-page-links"
import {
  normalizeTb500DisplayText,
  stripStrengthFromDisplayName
} from "@/lib/revamp/product-visual"

type ResearchForm = "nasal" | "capsule" | "liquid" | "powder"
type OverviewRow = { paragraphs?: string[] }

const OVERVIEWS_BY_HANDLE = productOverviews as Record<string, OverviewRow>
const LEGACY_PARENT = compoundLegacyRedirects as Record<string, { parent: string }>
const FAMILY_PARENTS = new Set(Object.keys(compoundFamilies))

function parentHandleFor(handle: string): string | null {
  if (FAMILY_PARENTS.has(handle)) return handle
  return LEGACY_PARENT[handle]?.parent || null
}

function detectResearchForm(appearance?: string, handle?: string, title?: string): ResearchForm {
  const hay = `${appearance || ""} ${handle || ""} ${title || ""}`.toLowerCase()
  if (/nasal/.test(hay)) return "nasal"
  if (/capsule/.test(hay)) return "capsule"
  if (
    /bacteriostatic|acetic acid|benzyl alcohol|solvent|solution|injectable|lipo-c|lemon bottle|l-carnitine/.test(
      hay
    ) ||
    (/\d+\s*ml\b/.test(hay) && !/\d+\s*mg\b/.test(hay))
  ) {
    return "liquid"
  }
  return "powder"
}

function researchFormParagraph(productName: string, form: ResearchForm): string {
  switch (form) {
    case "nasal":
      return `${productName} is supplied as a nasal spray formulation for controlled laboratory handling. Keep sealed and store per the product specifications until use under sterile laboratory conditions.`
    case "capsule":
      return `${productName} is supplied in capsule form for measured research workflows. Store in a cool, dry environment and handle according to your laboratory protocol.`
    case "liquid":
      return `${productName} is supplied as a ready research liquid for laboratory use. Handle under sterile conditions and follow the published storage guidance for this SKU.`
    default:
      return `${productName} is supplied as lyophilized powder for stability during storage and transport. Reconstitution should be performed under sterile laboratory conditions.`
  }
}

function overviewParagraphsForHandle(...keys: Array<string | null | undefined>): string[] | null {
  for (const key of keys) {
    if (!key) continue
    const paragraphs = OVERVIEWS_BY_HANDLE[key]?.paragraphs
    if (Array.isArray(paragraphs) && paragraphs.length) return paragraphs
  }
  return null
}

function fillOverviewTemplate(paragraphs: string[], productName: string): string {
  return paragraphs
    .map((paragraph) => paragraph.replaceAll("{productName}", productName).trim())
    .filter(Boolean)
    .join("\n\n")
}

function finalizeOverview(
  overview: string,
  category?: string
): string {
  const categoryLabel = String(category || "research peptide").trim() || "research peptide"
  const categorySlug = String(categorySlugFromLabel(categoryLabel))
  return ensureMinimumInternalLinks(overview, categorySlug, categoryLabel)
}

/** SEO product overview (long-form article). Server-side only — do not import from client components. */
export function buildResearchOverview(input: {
  productName: string
  category?: string
  appearance?: string
  handle?: string
  parentHandle?: string
  customSummary?: string | null
}): string {
  const custom = String(input.customSummary || "").trim()
  if (custom) return finalizeOverview(custom, input.category)

  const productName =
    stripStrengthFromDisplayName(
      normalizeTb500DisplayText(input.productName.trim() || "this compound")
    ) || "this compound"
  const curated = overviewParagraphsForHandle(
    input.parentHandle,
    input.handle,
    parentHandleFor(input.handle || "")
  )
  if (curated) return finalizeOverview(fillOverviewTemplate(curated, productName), input.category)

  const category = String(input.category || "research peptide").trim() || "research peptide"
  const form = detectResearchForm(input.appearance, input.handle, productName)

  const paragraphs = [
    `Buy ${productName} online from Tetrava Labs for qualified laboratory research in the ${category} category. Each lot is documented with third-party analytical testing, with COA documents published when available for the batch you receive.`,
    `${productName} is positioned for teams that need a documented research reagent with consistent identity and purity controls. Comparative protocols should keep reconstitution parameters, diluent choice, and vehicle controls identical across arms so analytical noise is not mistaken for biology.`,
    `Mechanism framing should stay tied to peer-reviewed pathway language and your laboratory’s validated endpoints. Treat informal nicknames as labels only — protocol text should use the catalog identity and the analytical fields verified on receipt.`,
    `Within ${category} study designs, laboratories typically combine receptor, signaling, or phenotypic readouts with careful lot tracking so results remain auditable across operators and time. Dose-response and time-course sampling help separate early signaling from later remodeling endpoints.`,
    `Comparative and bridging studies benefit from writing material identity into the protocol itself: catalog handle, nominal strength, intended working concentration, and acceptable purity threshold. Include a small same-lot bridging panel when methods move between sites.`,
    `Typical workflows begin with verifying the sealed vial, filing the COA, and assigning an internal material ID before preparing working solutions for the assay plate map. Capture operator, timestamp, diluent lot, and deviations in the ELN.`,
    researchFormParagraph(productName, form),
    `Supporting supplies — sterile diluent when required, PPE, labeled secondary containment, and a quarantine shelf for new lots — should be ready before the first open. Align diluent choice with preservative rules in the study design.`,
    `Stability practice matters as much as nominal potency. Minimize freeze–thaw cycles for reconstituted stocks, protect light-sensitive solutions when indicated, and prefer fresh reconstitution after multi-day pauses unless a validated method says otherwise.`,
    `Retain Certificates of Analysis with working stocks and record catalog handle, batch, and preparation date in your ELN or inventory system before initiating comparative work.`,
    `Tetrava Labs emphasizes lot-linked documentation to support research procurement decisions — not as a substitute for your own method qualification. Review impurity or residual-solvent notes on the COA when those fields are critical to your endpoint.`,
    `Buy ${productName} online when you need research-grade supply with transparent catalog identity for qualified laboratories. Choose pack and strength configurations that match assay cadence and retention policy.`,
    `Institutional biosafety and chemical-hygiene rules take precedence over any general catalog description. Limit purchasing access to staff who understand the research-only restriction.`,
    "For research use only — not for human or veterinary consumption."
  ]

  return finalizeOverview(paragraphs.join("\n\n"), input.category)
}
