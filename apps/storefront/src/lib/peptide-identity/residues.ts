import type { ComputedPeptideMass, PeptideIon } from "@/lib/peptide-identity/types"

/** IUPAC monoisotopic / average residue masses (neutral residue). */
const STANDARD: Record<string, { mono: number; avg: number }> = {
  A: { mono: 71.0371138, avg: 71.0788 },
  R: { mono: 156.101111, avg: 156.1875 },
  N: { mono: 114.0429274, avg: 114.1038 },
  D: { mono: 115.026943, avg: 115.0886 },
  C: { mono: 103.0091848, avg: 103.1388 },
  Q: { mono: 128.0585775, avg: 128.1307 },
  E: { mono: 129.0425931, avg: 129.1155 },
  G: { mono: 57.0214637, avg: 57.0519 },
  H: { mono: 137.0589119, avg: 137.1411 },
  I: { mono: 113.084064, avg: 113.1594 },
  L: { mono: 113.084064, avg: 113.1594 },
  K: { mono: 128.094963, avg: 128.1741 },
  M: { mono: 131.0404846, avg: 131.1926 },
  F: { mono: 147.0684139, avg: 147.1766 },
  P: { mono: 97.05276385, avg: 97.1167 },
  S: { mono: 87.0320284, avg: 87.0782 },
  T: { mono: 101.0476785, avg: 101.1051 },
  W: { mono: 186.079313, avg: 186.2132 },
  Y: { mono: 163.0633285, avg: 163.176 },
  V: { mono: 99.06841391, avg: 99.1326 }
}

const THREE_TO_ONE: Record<string, string> = {
  ala: "A",
  arg: "R",
  asn: "N",
  asp: "D",
  cys: "C",
  gln: "Q",
  glu: "E",
  gly: "G",
  his: "H",
  ile: "I",
  leu: "L",
  lys: "K",
  met: "M",
  phe: "F",
  pro: "P",
  ser: "S",
  thr: "T",
  trp: "W",
  tyr: "Y",
  val: "V",
  nle: "L",
  aib: "AIB",
  pglu: "PE",
  pyr: "PE",
  glp: "PE",
  dmt: "DMT",
  nal: "NAL",
  "2nal": "NAL"
}

const EXTRA: Record<string, { mono: number; avg: number }> = {
  AIB: { mono: 85.05276385, avg: 85.1045 },
  PE: { mono: 111.0320284, avg: 111.0992 },
  DMT: { mono: 191.0946287, avg: 191.226 },
  NAL: { mono: 197.084064, avg: 197.233 }
}

const WATER = { mono: 18.0105647, avg: 18.01528 }
const ACETYL = { mono: 42.0105647, avg: 42.0367 }
const AMIDE_DELTA = { mono: -0.9840156, avg: -0.984 }
const PROTON = 1.00727647

const ONE_LETTER_RE = /^[ACDEFGHIKLMNPQRSTVWY]+$/i

function residueMass(code: string): { mono: number; avg: number } | null {
  if (STANDARD[code]) return STANDARD[code]
  if (EXTRA[code]) return EXTRA[code]
  return null
}

function stripSequenceComment(raw: string): { sequence: string; notes: string[] } {
  const notes: string[] = []
  let sequence = raw.trim()
  const comment = sequence.match(/\s+\((.+)\)\s*$/)
  if (comment) {
    const text = comment[1].trim()
    sequence = sequence.slice(0, comment.index).trim()
    if (/disulfide/i.test(text)) {
      notes.push("Linear sequence mass. Disulfide bridges are not subtracted.")
    }
    if (/copper/i.test(text)) {
      notes.push("Mass is the free peptide. Bound copper is not added.")
    }
  }
  return { sequence, notes }
}

function resolveThreeLetter(token: string): string | null {
  const cleaned = token.replace(/^d-/i, "").replace(/[^a-z0-9]/gi, "").toLowerCase()
  if (!cleaned) return null
  return THREE_TO_ONE[cleaned] || null
}

function tokenizeThreeLetter(sequence: string): string[] | null {
  if (
    /cyclo|aeea|pegylat|hexenoyl|γ-|modified |see |multi-|n\/a|\([^)]*dac/i.test(sequence)
  ) {
    return null
  }

  const tokens: string[] = []
  let rest = sequence.trim()
  while (rest.length) {
    rest = rest.replace(/^\s+/, "")
    if (!rest) break
    if (rest.startsWith("-")) {
      rest = rest.slice(1)
      continue
    }

    const known = rest.match(
      /^(Ac|NH2|OH|H|D-2-Nal|D-2Nal|2-Nal|2Nal|pGlu|Aib|Nle|Dmt|D-[A-Za-z]{3}|[A-Za-z]{3})(?=$|[-/\s]|\()/i
    )
    if (!known) return null
    const token = known[1]
    rest = rest.slice(token.length)
    if (rest.startsWith("(")) return null
    tokens.push(token)
  }
  return tokens.length ? tokens : null
}

export function parsePeptideSequence(raw: string | null | undefined): ComputedPeptideMass | null {
  if (!raw) return null
  const { sequence, notes } = stripSequenceComment(raw)
  if (!sequence || /^n\/a/i.test(sequence)) return null

  let nAcetyl = false
  let cAmide = false
  const residues: string[] = []

  if (!sequence.includes("-") && ONE_LETTER_RE.test(sequence)) {
    for (const letter of sequence.toUpperCase()) residues.push(letter)
  } else {
    const tokens = tokenizeThreeLetter(sequence)
    if (!tokens) return null
    for (const token of tokens) {
      if (/^ac$/i.test(token)) {
        nAcetyl = true
        continue
      }
      if (/^nh2$/i.test(token)) {
        cAmide = true
        continue
      }
      if (/^(oh|h)$/i.test(token)) continue
      const code = resolveThreeLetter(token)
      if (!code) return null
      residues.push(code)
    }
  }

  if (!residues.length) return null

  let mono = WATER.mono
  let avg = WATER.avg
  for (const code of residues) {
    const mass = residueMass(code)
    if (!mass) return null
    mono += mass.mono
    avg += mass.avg
  }
  if (nAcetyl) {
    mono += ACETYL.mono
    avg += ACETYL.avg
  }
  if (cAmide) {
    mono += AMIDE_DELTA.mono
    avg += AMIDE_DELTA.avg
  }

  return {
    monoisotopicDa: roundMass(mono, 4),
    averageDa: roundMass(avg, 2),
    residueCount: residues.length,
    nAcetyl,
    cAmide,
    notes
  }
}

export function expectedIons(monoisotopicDa: number, maxCharge = 3): PeptideIon[] {
  const ions: PeptideIon[] = []
  for (let charge = 1; charge <= maxCharge; charge += 1) {
    ions.push({
      charge,
      mz: roundMass((monoisotopicDa + charge * PROTON) / charge, 4)
    })
  }
  return ions
}

export function parseCatalogMass(value: string | null | undefined): number | null {
  if (!value) return null
  const match = value.replace(/,/g, "").match(/^\s*(\d+(?:\.\d+)?)\s*$/)
  if (!match) return null
  const mass = Number(match[1])
  return Number.isFinite(mass) && mass > 0 ? mass : null
}

export function roundMass(value: number, digits: number): number {
  const factor = 10 ** digits
  return Math.round(value * factor) / factor
}

export function formatMass(value: number, digits = 2): string {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  })
}

export function formatMz(value: number): string {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4
  })
}

export function ionLabel(charge: number): string {
  if (charge === 1) return "[M+H]+"
  return `[M+${charge}H]${charge}+`
}
