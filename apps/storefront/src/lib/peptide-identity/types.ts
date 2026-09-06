export type PeptideKind =
  | "peptide"
  | "small-molecule"
  | "blend"
  | "solvent"
  | "mixture"
  | "reference"

export type PeptidePresentation = {
  handle: string
  label: string
  shopPath: string | null
}

export type ComputedPeptideMass = {
  monoisotopicDa: number
  averageDa: number
  residueCount: number
  nAcetyl: boolean
  cAmide: boolean
  notes: string[]
}

export type PeptideIon = {
  charge: number
  mz: number
}

export type PeptideIdentity = {
  id: string
  name: string
  aliases: string[]
  kind: PeptideKind
  casNumber: string | null
  formula: string | null
  sequence: string | null
  catalogMassDa: number | null
  catalogMassLabel: string | null
  computed: ComputedPeptideMass | null
  ions: PeptideIon[]
  pubchemCid: string | null
  inCatalog: boolean
  shopPath: string | null
  coaPath: string | null
  presentations: PeptidePresentation[]
  note: string | null
  confusedWith: string[]
}

export type ConfusionPair = {
  a: string
  b: string
  label: string
  blurb: string
}

export type IdentityVerdictStatus = "same" | "same-presentation" | "not-same"

export type IdentityVerdict = {
  status: IdentityVerdictStatus
  headline: string
  reason: string
}

export type ObservedMassMatch = {
  label: string
  expected: number
  delta: number
  consistent: boolean
}
