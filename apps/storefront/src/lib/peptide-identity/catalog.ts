import productEnrichment from "@/lib/product-enrichment.generated.json"
import { getCatalogCompoundTitle, resolveCatalogParentHandle } from "@/lib/catalog-filter"
import { PRODUCT_HANDLE_TO_URL } from "@/lib/product-url-aliases"
import {
  DISPLAY_NAMES,
  EXTRA_ALIASES,
  IDENTITY_OVERRIDES,
  PRESENTATION_MERGES,
  PUBCHEM_CIDS,
  type IdentityOverride
} from "@/lib/peptide-identity/curated"
import { expectedIons, parseCatalogMass, parsePeptideSequence } from "@/lib/peptide-identity/residues"
import type {
  ComputedPeptideMass,
  PeptideIdentity,
  PeptideKind,
  PeptidePresentation
} from "@/lib/peptide-identity/types"

type EnrichmentRow = {
  cas_number?: string | null
  molecular_formula?: string | null
  molecular_weight?: string | null
  sequence?: string | null
  category?: string | null
}

const ENRICHMENT = productEnrichment as Record<string, EnrichmentRow>

function shopPathFor(handle: string): string | null {
  const segment = PRODUCT_HANDLE_TO_URL[handle]
  if (segment) return `/${segment}`
  if (resolveCatalogParentHandle(handle) === handle) return `/${handle}`
  return null
}

/** Strip a trailing strength token so adamax-10mg still matches the stem "adamax". */
export function identityDoseStem(id: string): string {
  return id.replace(/-\d+(?:\.\d+)?(?:-iu|mg|mcg|iu|ml)$/i, "")
}

function lookupByIdOrStem<T>(table: Record<string, T>, id: string): T | undefined {
  if (Object.prototype.hasOwnProperty.call(table, id)) return table[id]
  const stem = identityDoseStem(id)
  if (stem !== id && Object.prototype.hasOwnProperty.call(table, stem)) return table[stem]
  return undefined
}

function aliasesFor(id: string, handle: string): string[] {
  const stem = identityDoseStem(id)
  return uniqueStrings([
    id,
    handle,
    stem !== id ? stem : null,
    ...(lookupByIdOrStem(EXTRA_ALIASES, id) || [])
  ])
}

function titleFromHandle(handle: string): string {
  const curated = lookupByIdOrStem(DISPLAY_NAMES, handle)
  if (curated) return curated
  const familyTitle = getCatalogCompoundTitle(handle)
  if (familyTitle) return familyTitle.replace(/TB500/g, "TB-500")
  return handle
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .replace(/\bTb500\b/g, "TB-500")
    .replace(/\bCjc\b/g, "CJC")
    .replace(/\bBpc\b/g, "BPC")
    .replace(/\bGhk\b/g, "GHK")
}

function classifyKind(row: EnrichmentRow, handle: string): PeptideKind {
  const sequence = (row.sequence || "").toLowerCase()
  const category = (row.category || "").toLowerCase()
  if (category === "lab supplies" || /solvent|preservative/.test(sequence)) return "solvent"
  if (/multi-component|see component|blend/.test(sequence) || category === "research blends") {
    return "blend"
  }
  if (/mixture|hydrolysate|complex|glycoprotein/.test(sequence)) return "mixture"
  if (/n\/a \(|small molecule|dinucleotide|non-peptide|nucleoside|quaternary|cobalamin|amino acid\)/.test(sequence)) {
    return "small-molecule"
  }
  if (handle === "nad" || handle === "mk-677-5mg" || handle === "5-amino-1mq" || handle === "aicar-50mg") {
    return "small-molecule"
  }
  return "peptide"
}

function cleanText(value: string | null | undefined): string | null {
  if (!value) return null
  const trimmed = value.trim()
  if (!trimmed || /^n\/a$/i.test(trimmed)) return null
  return trimmed
}

function uniqueStrings(values: Array<string | null | undefined>): string[] {
  const seen = new Set<string>()
  const out: string[] = []
  for (const value of values) {
    const trimmed = value?.trim()
    if (!trimmed) continue
    const key = trimmed.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    out.push(trimmed)
  }
  return out
}

function attachMassMismatch(
  computed: ComputedPeptideMass | null,
  catalogMassDa: number | null
): ComputedPeptideMass | null {
  if (!computed || !catalogMassDa) return computed
  if (Math.abs(computed.averageDa - catalogMassDa) <= 2) return computed
  const note =
    `Sequence average (${computed.averageDa.toFixed(2)} Da) differs from the catalog mass (${catalogMassDa.toFixed(2)} Da). Read the lot COA for the figure that lot used.`
  if (computed.notes.includes(note)) return computed
  return { ...computed, notes: [...computed.notes, note] }
}

function applyOverride(base: PeptideIdentity, override?: IdentityOverride): PeptideIdentity {
  if (!override) return base
  const sequence = override.sequence !== undefined ? override.sequence : base.sequence
  const parseFrom = override.parseSequence !== undefined ? override.parseSequence : sequence
  const computed = parsePeptideSequence(parseFrom)
  return {
    ...base,
    name: override.name || base.name,
    aliases: uniqueStrings([...(override.aliases || []), ...base.aliases]),
    casNumber: override.casNumber !== undefined ? override.casNumber : base.casNumber,
    formula: override.formula !== undefined ? override.formula : base.formula,
    sequence,
    catalogMassDa: override.catalogMassDa !== undefined ? override.catalogMassDa : base.catalogMassDa,
    catalogMassLabel:
      override.catalogMassLabel !== undefined ? override.catalogMassLabel : base.catalogMassLabel,
    kind: override.kind || base.kind,
    note: override.note !== undefined ? override.note : base.note,
    inCatalog: override.inCatalog !== undefined ? override.inCatalog : base.inCatalog,
    shopPath:
      override.shopHandle === null
        ? null
        : override.shopHandle
          ? shopPathFor(override.shopHandle)
          : base.shopPath,
    computed: attachMassMismatch(computed, override.catalogMassDa !== undefined ? override.catalogMassDa : base.catalogMassDa),
    ions: computed ? expectedIons(computed.monoisotopicDa) : []
  }
}

function identityFromRow(id: string, row: EnrichmentRow, handle: string): PeptideIdentity {
  const sequence = cleanText(row.sequence)
  const computed = parsePeptideSequence(sequence)
  const catalogMassDa = parseCatalogMass(row.molecular_weight)
  return {
    id,
    name: titleFromHandle(id),
    aliases: aliasesFor(id, handle),
    kind: classifyKind(row, id),
    casNumber: cleanText(row.cas_number),
    formula: cleanText(row.molecular_formula),
    sequence,
    catalogMassDa,
    catalogMassLabel: catalogMassDa ? null : cleanText(row.molecular_weight),
    computed: attachMassMismatch(computed, catalogMassDa),
    ions: computed ? expectedIons(computed.monoisotopicDa) : [],
    pubchemCid: lookupByIdOrStem(PUBCHEM_CIDS, id) || null,
    inCatalog: true,
    shopPath: shopPathFor(id) || shopPathFor(handle),
    coaPath: `/coa-library/${encodeURIComponent(id)}`,
    presentations: [],
    note: null,
    confusedWith: []
  }
}

function buildIndex(): PeptideIdentity[] {
  const byId = new Map<string, PeptideIdentity>()
  const presentations: Array<{ targetId: string; presentation: PeptidePresentation }> = []

  for (const [handle, row] of Object.entries(ENRICHMENT)) {
    const merge = PRESENTATION_MERGES[handle]
    if (merge) {
      presentations.push({
        targetId: merge.moleculeId,
        presentation: {
          handle,
          label: merge.label,
          shopPath: shopPathFor(handle)
        }
      })
      continue
    }

    const parent = resolveCatalogParentHandle(handle) || handle
    const id = parent
    const existing = byId.get(id)
    if (existing) {
      if (!existing.shopPath) existing.shopPath = shopPathFor(handle)
      continue
    }
    byId.set(id, identityFromRow(id, row, handle))
  }

  for (const [id, override] of Object.entries(IDENTITY_OVERRIDES)) {
    const current = byId.get(id)
    if (current) {
      byId.set(id, applyOverride(current, override))
      continue
    }
    const empty: PeptideIdentity = {
      id,
      name: override.name || titleFromHandle(id),
      aliases: uniqueStrings([id, ...(override.aliases || []), ...aliasesFor(id, id)]),
      kind: override.kind || "reference",
      casNumber: override.casNumber ?? null,
      formula: override.formula ?? null,
      sequence: override.sequence ?? null,
      catalogMassDa: override.catalogMassDa ?? null,
      catalogMassLabel: override.catalogMassLabel ?? null,
      computed: parsePeptideSequence(override.parseSequence ?? override.sequence ?? null),
      ions: [],
      pubchemCid: lookupByIdOrStem(PUBCHEM_CIDS, id) || null,
      inCatalog: override.inCatalog ?? false,
      shopPath: override.shopHandle ? shopPathFor(override.shopHandle) : null,
      coaPath: null,
      presentations: [],
      note: override.note ?? null,
      confusedWith: []
    }
    empty.ions = empty.computed ? expectedIons(empty.computed.monoisotopicDa) : []
    byId.set(id, empty)
  }

  for (const entry of presentations) {
    let target = byId.get(entry.targetId)
    if (!target) {
      const sourceRow = ENRICHMENT[entry.presentation.handle]
      if (!sourceRow) continue
      target = applyOverride(
        identityFromRow(entry.targetId, sourceRow, entry.presentation.handle),
        IDENTITY_OVERRIDES[entry.targetId]
      )
      byId.set(entry.targetId, target)
    }
    if (!target.presentations.some((item) => item.handle === entry.presentation.handle)) {
      target.presentations.push(entry.presentation)
    }
  }

  return [...byId.values()].sort((a, b) => a.name.localeCompare(b.name, "en"))
}

let cached: PeptideIdentity[] | null = null

export function listPeptideIdentities(): PeptideIdentity[] {
  if (!cached) cached = buildIndex()
  return cached
}

export function getPeptideIdentity(id: string): PeptideIdentity | null {
  return listPeptideIdentities().find((item) => item.id === id) || null
}
