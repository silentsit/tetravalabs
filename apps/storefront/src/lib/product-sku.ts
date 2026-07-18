import catalogSkus from "@/lib/catalog-skus.generated.json"

type CatalogSkuPayload = {
  scheme?: string
  skus?: Record<string, string>
  productCodes?: Record<string, number>
}

const PAYLOAD = catalogSkus as CatalogSkuPayload
const SKU_BY_KEY = PAYLOAD.skus || (catalogSkus as Record<string, string>)
const PRODUCT_CODES = PAYLOAD.productCodes || {}
const PRODUCT_NAME_MAX = 80

export type SkuLookupItem = {
  handle?: string
  variantTitle?: string
  sku?: string | null
}

/** Pack quantity from variant title ("5 vials") or defaults to 1 for Standard / simple SKUs. */
export function packQtyFromVariantTitle(variantTitle?: string): number {
  const match = String(variantTitle || "").match(/^(\d+)\s+vials?$/i)
  if (match) return Number(match[1])
  return 1
}

/** Opaque SKU: TV-{product}-{pack} — never derived from product names. */
export function formatOpaqueSku(productCode: number, packQty = 1): string {
  const qty = Number.isFinite(packQty) && packQty > 0 ? Math.floor(packQty) : 1
  return `TV-${String(productCode).padStart(4, "0")}-${String(qty).padStart(2, "0")}`
}

export function isOpaqueSku(sku?: string | null): boolean {
  return Boolean(sku && /^TV-\d{4}-\d{2}$/i.test(sku.trim()))
}

export function resolveProductSku(item: SkuLookupItem): string | null {
  const explicit = item.sku?.trim()
  // Prefer opaque SKUs only — ignore legacy name-based codes if still present on variants.
  if (explicit && isOpaqueSku(explicit)) return explicit.toUpperCase()

  const handle = item.handle?.trim()
  if (!handle) return null

  const packQty = packQtyFromVariantTitle(item.variantTitle)
  const byQty = SKU_BY_KEY[`${handle}:${packQty}`]
  if (byQty && isOpaqueSku(byQty)) return byQty.toUpperCase()

  const title = item.variantTitle?.trim()
  if (title) {
    const byTitle = SKU_BY_KEY[`${handle}::${title}`]
    if (byTitle && isOpaqueSku(byTitle)) return byTitle.toUpperCase()
  }

  const productCode = PRODUCT_CODES[handle]
  if (productCode != null && Number(productCode) > 0) {
    return formatOpaqueSku(Number(productCode), packQty)
  }

  return null
}

/**
 * Peptide Pay `product_name` — opaque SKU codes only (no human product titles).
 * Single-item carts send one SKU; multi-item carts join with "+" (max 80 chars).
 */
export function buildPeptidepayProductName(items: SkuLookupItem[]): string {
  const skus = items
    .map((item) => resolveProductSku(item))
    .filter((sku): sku is string => Boolean(sku))

  const unique: string[] = []
  for (const sku of skus) {
    if (!unique.includes(sku)) unique.push(sku)
  }

  if (!unique.length) return "TV-ORDER"

  if (unique.length === 1) return unique[0].slice(0, PRODUCT_NAME_MAX)

  const joined = unique.join("+")
  if (joined.length <= PRODUCT_NAME_MAX) return joined

  const head = unique[0]
  const suffix = `+${unique.length - 1}`
  return `${head.slice(0, PRODUCT_NAME_MAX - suffix.length)}${suffix}`
}
