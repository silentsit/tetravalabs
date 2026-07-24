/**
 * Shared compound (multi-strength) grouping for catalog normalization + Medusa merge.
 * Parent handle is derived from slug suffix, e.g. bpc-157-5mg → parent bpc-157.
 */

export const STRENGTH_SUFFIX_RE = /-((?:0-\d+mg)|\d+mg|\d+ml|\d+mcg|\d+-iu)$/i

export const STRENGTH_OPTION = "Strength"
export const PACK_OPTION = "Pack Size"

export function parseStrengthFromSlug(slug) {
  const match = String(slug || "").match(STRENGTH_SUFFIX_RE)
  if (!match) return null
  const strengthKey = match[1]
  const parentHandle = slug.slice(0, -(strengthKey.length + 1))
  if (!parentHandle) return null
  return { parentHandle, strengthKey }
}

export function formatStrengthLabel(strengthKey) {
  if (/^\d+-iu$/i.test(strengthKey)) {
    return `${strengthKey.replace(/-iu$/i, "")} IU`
  }
  if (/^\d+-\d+mg$/i.test(strengthKey)) {
    return strengthKey.replace("-", ".")
  }
  return strengthKey
}

export function strengthSortKey(strengthKey) {
  const iu = strengthKey.match(/^(\d+)-iu$/i)
  if (iu) return Number(iu[1])
  const decimalMg = strengthKey.match(/^(\d+)-(\d+)mg$/i)
  if (decimalMg) return Number(`${decimalMg[1]}.${decimalMg[2]}`)
  const num = strengthKey.match(/^(\d+(?:\.\d+)?)/)
  return num ? Number(num[1]) : 0
}

/**
 * Group catalog rows that share a compound name + parent handle (2+ strengths).
 * Returns Map<parentHandle, row[]>.
 */
export function groupRowsForCompoundMerge(rows) {
  const byParent = new Map()

  for (const row of rows) {
    const parsed = parseStrengthFromSlug(row.slug)
    if (!parsed) continue
    const list = byParent.get(parsed.parentHandle) || []
    list.push({ row, ...parsed })
    byParent.set(parsed.parentHandle, list)
  }

  const merged = new Map()
  for (const [parentHandle, entries] of byParent) {
    if (entries.length < 2) continue
    const name = entries[0].row.name
    if (!entries.every((entry) => entry.row.name === name)) continue
    entries.sort((a, b) => strengthSortKey(a.strengthKey) - strengthSortKey(b.strengthKey))
    merged.set(parentHandle, entries)
  }

  return merged
}

export function strengthOptionValue(row, strengthKey) {
  const fromRow = String(row.strength || "").trim()
  if (fromRow && fromRow !== "Standard") return fromRow
  return formatStrengthLabel(strengthKey)
}
