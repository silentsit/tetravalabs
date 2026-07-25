const PRODUCT_NAME_MAX = 80

type SkuItem = {
  handle?: string
  variantTitle?: string
}

/** Peptide Pay descriptor — opaque fallback when catalog SKUs are unavailable server-side. */
export function buildPeptidepayProductName(items: SkuItem[]): string {
  const handles = items
    .map((item) => item.handle?.trim())
    .filter((handle): handle is string => Boolean(handle))

  const unique = [...new Set(handles)]
  if (!unique.length) return "TV-ORDER"

  const code = unique[0]
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 24)

  if (unique.length === 1) return `TV-${code}`.slice(0, PRODUCT_NAME_MAX)
  return `TV-${code}+${unique.length - 1}`.slice(0, PRODUCT_NAME_MAX)
}
