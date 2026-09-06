import { getPeptideIdentity } from "@/lib/peptide-identity/catalog"
import { CONFUSION_PAIRS, PRESENTATION_MERGES } from "@/lib/peptide-identity/curated"
import { resolvePeptideIdentityQuery } from "@/lib/peptide-identity/search"
import type { ConfusionPair, IdentityVerdict, PeptideIdentity } from "@/lib/peptide-identity/types"

function normalizeSequence(value: string | null): string | null {
  if (!value) return null
  const stripped = value
    .replace(/\s+\(.+\)\s*$/, "")
    .replace(/[^a-z0-9]/gi, "")
    .toLowerCase()
  return stripped || null
}

type ResolvedPair = { a: string; b: string; blurb: string }

let resolvedPairs: ResolvedPair[] | null = null

function listResolvedPairs(): ResolvedPair[] {
  if (resolvedPairs) return resolvedPairs
  resolvedPairs = CONFUSION_PAIRS.flatMap((pair: ConfusionPair) => {
    const a = resolvePeptideIdentityQuery(pair.a)
    const b = resolvePeptideIdentityQuery(pair.b)
    if (!a || !b || a.id === b.id) return []
    return [{ a: a.id, b: b.id, blurb: pair.blurb }]
  })
  return resolvedPairs
}

function pairNote(left: PeptideIdentity, right: PeptideIdentity): string | null {
  const match = listResolvedPairs().find(
    (pair) =>
      (pair.a === left.id && pair.b === right.id) || (pair.a === right.id && pair.b === left.id)
  )
  return match?.blurb || null
}

function isPresentationOf(id: string, other: PeptideIdentity): boolean {
  if (other.presentations.some((item) => item.handle === id || PRESENTATION_MERGES[item.handle]?.moleculeId === id)) {
    return true
  }
  const merge = PRESENTATION_MERGES[id]
  return merge?.moleculeId === other.id
}

export function comparePeptideIdentities(
  left: PeptideIdentity,
  right: PeptideIdentity
): IdentityVerdict {
  if (left.id === right.id) {
    return {
      status: "same",
      headline: "Same molecule",
      reason: `${left.name} is listed once. Different strengths or packs of this reagent are the same identity.`
    }
  }

  if (isPresentationOf(left.id, right) || isPresentationOf(right.id, left)) {
    return {
      status: "same-presentation",
      headline: "Same molecule, different presentation",
      reason:
        pairNote(left, right) ||
        `${left.name} and ${right.name} share the same sequence. The vial, spray, or capsule is a different form, not a different peptide.`
    }
  }

  const leftSeq = normalizeSequence(left.sequence)
  const rightSeq = normalizeSequence(right.sequence)
  const sequencesMatch =
    Boolean(leftSeq && rightSeq && leftSeq === rightSeq) &&
    left.kind !== "blend" &&
    right.kind !== "blend"
  const casMatch =
    Boolean(left.casNumber && right.casNumber && left.casNumber === right.casNumber) &&
    left.kind !== "blend" &&
    right.kind !== "blend" &&
    left.kind !== "mixture" &&
    right.kind !== "mixture"

  if (sequencesMatch && (casMatch || (!left.casNumber && !right.casNumber))) {
    return {
      status: "same",
      headline: "Same molecule",
      reason:
        pairNote(left, right) ||
        "Sequence and identity fields match. Treat these names as the same research reagent."
    }
  }

  if (casMatch && !sequencesMatch && left.kind !== "reference" && right.kind !== "reference") {
    return {
      status: "not-same",
      headline: "Not the same molecule",
      reason:
        pairNote(left, right) ||
        "These rows share a CAS number in supplier tables, but the sequences do not match. Do not treat the CAS alone as identity."
    }
  }

  return {
    status: "not-same",
    headline: "Not the same molecule",
    reason:
      pairNote(left, right) ||
      `${left.name} and ${right.name} differ in sequence, mass, or class. Do not swap literature or a COA from one onto the other.`
  }
}

export function confusedWith(identity: PeptideIdentity): PeptideIdentity[] {
  const fromField = identity.confusedWith
    .map((id) => resolvePeptideIdentityQuery(id) || getPeptideIdentity(id))
    .filter((item): item is PeptideIdentity => Boolean(item))
  const fromPairs = listResolvedPairs()
    .filter((pair) => pair.a === identity.id || pair.b === identity.id)
    .flatMap((pair) => {
      const otherId = pair.a === identity.id ? pair.b : pair.a
      const other = getPeptideIdentity(otherId)
      return other ? [other] : []
    })
  const seen = new Set<string>()
  const out: PeptideIdentity[] = []
  for (const item of [...fromField, ...fromPairs]) {
    if (item.id === identity.id || seen.has(item.id)) continue
    seen.add(item.id)
    out.push(item)
  }
  return out
}
