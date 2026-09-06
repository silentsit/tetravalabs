import {
  getPeptideIdentity,
  identityDoseStem,
  listPeptideIdentities
} from "@/lib/peptide-identity/catalog"
import { PRESENTATION_MERGES } from "@/lib/peptide-identity/curated"
import { formatMass, ionLabel, roundMass } from "@/lib/peptide-identity/residues"
import type { ObservedMassMatch, PeptideIdentity } from "@/lib/peptide-identity/types"

export function normalizeIdentityKey(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "")
}

function presentationMoleculeId(raw: string): string | null {
  const key = normalizeIdentityKey(raw)
  if (PRESENTATION_MERGES[raw]) return PRESENTATION_MERGES[raw].moleculeId
  const match = Object.entries(PRESENTATION_MERGES).find(
    ([handle]) => normalizeIdentityKey(handle) === key
  )
  return match?.[1].moleculeId || null
}

export function resolvePeptideIdentityQuery(raw: string | null | undefined): PeptideIdentity | null {
  const query = raw?.trim()
  if (!query) return null

  const mergedId = presentationMoleculeId(query)
  if (mergedId) return getPeptideIdentity(mergedId)

  const key = normalizeIdentityKey(query)
  if (!key) return null

  const identities = listPeptideIdentities()
  const exactId = identities.find((item) => normalizeIdentityKey(item.id) === key)
  if (exactId) return exactId

  const exactField = identities.find((item) =>
    [item.name, item.casNumber, ...item.aliases].some(
      (value) => value && normalizeIdentityKey(value) === key
    )
  )
  if (exactField) return exactField

  const stemHits = identities.filter((item) => normalizeIdentityKey(identityDoseStem(item.id)) === key)
  return stemHits.length === 1 ? stemHits[0] : null
}

function scoreIdentity(identity: PeptideIdentity, query: string, key: string): number {
  const idKey = normalizeIdentityKey(identity.id)
  const nameKey = normalizeIdentityKey(identity.name)
  if (idKey === key || nameKey === key) return 100
  if (identity.casNumber && normalizeIdentityKey(identity.casNumber) === key) return 95
  if (identity.aliases.some((alias) => normalizeIdentityKey(alias) === key)) return 90
  if (idKey.startsWith(key) || nameKey.startsWith(key)) return 70
  if (idKey.includes(key) || nameKey.includes(key)) return 50
  const haystack = [
    identity.sequence,
    identity.formula,
    identity.note,
    ...identity.aliases,
    ...identity.presentations.map((item) => item.label)
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()
  if (haystack.includes(query.toLowerCase()) || normalizeIdentityKey(haystack).includes(key)) {
    return 30
  }
  return 0
}

export function searchPeptideIdentities(query: string, limit = 8): PeptideIdentity[] {
  const trimmed = query.trim()
  if (!trimmed) return []
  const key = normalizeIdentityKey(trimmed)
  if (!key) return []

  return listPeptideIdentities()
    .map((identity) => ({ identity, score: scoreIdentity(identity, trimmed, key) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.identity.name.localeCompare(b.identity.name, "en"))
    .slice(0, limit)
    .map((entry) => entry.identity)
}

export function matchObservedMass(identity: PeptideIdentity, observed: number): ObservedMassMatch[] {
  if (!Number.isFinite(observed) || observed <= 0) return []
  const rows: ObservedMassMatch[] = []
  const push = (label: string, expected: number, tolerance: number) => {
    rows.push({
      label,
      expected,
      delta: roundMass(observed - expected, 4),
      consistent: Math.abs(observed - expected) <= tolerance
    })
  }

  if (identity.catalogMassDa) {
    push("Catalog average mass", identity.catalogMassDa, 1)
  }
  if (identity.computed) {
    push("Sequence average mass", identity.computed.averageDa, 1)
    push("Sequence monoisotopic mass", identity.computed.monoisotopicDa, 0.6)
    for (const ion of identity.ions) {
      push(ionLabel(ion.charge), ion.mz, 0.4)
    }
  }
  return rows
}

export function bestObservedMatch(matches: ObservedMassMatch[]): ObservedMassMatch | null {
  const hits = matches.filter((item) => item.consistent)
  if (!hits.length) return null
  return hits.slice().sort((a, b) => Math.abs(a.delta) - Math.abs(b.delta))[0] || null
}

export function observedMassSummary(identity: PeptideIdentity, observed: number): string {
  const matches = matchObservedMass(identity, observed)
  if (!matches.length) {
    return "No computed ions for this entry. Compare the number to the catalog mass by eye."
  }
  const best = bestObservedMatch(matches)
  if (best) {
    return `${formatMass(observed, 2)} is consistent with ${best.label} (${formatMass(best.expected, 2)}, Δ ${best.delta > 0 ? "+" : ""}${formatMass(best.delta, 2)}).`
  }
  return `${formatMass(observed, 2)} does not match the catalog mass or the expected ions for this sequence.`
}
