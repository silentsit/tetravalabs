import { PACK_OPTION, STRENGTH_OPTION } from "./compound-merge.mjs"

export function isMergedCatalogProduct(product) {
  return Boolean(product?.metadata?.compound_merged)
}

export function packQtyFromVariant(variant) {
  const fromMeta = variant.metadata?.pack_qty
  if (fromMeta != null && Number(fromMeta) > 0) return Number(fromMeta)

  const titleMatch = String(variant.title || "").match(/^(\d+)\s+vials?$/i)
  if (titleMatch) return Number(titleMatch[1])

  const opaqueMatch = String(variant.sku || "").match(/^TV-\d{4}-(\d{2})$/i)
  if (opaqueMatch) return Number(opaqueMatch[1])

  const legacyMatch = String(variant.sku || "").match(/_(\d+)PK$/i)
  if (legacyMatch) return Number(legacyMatch[1])

  return null
}

export function strengthKeyFromVariant(variant) {
  const key = variant.metadata?.strength_key
  if (key) return String(key)
  const strength = variant.metadata?.strength
  if (strength) return String(strength).toLowerCase().replace(/\s+/g, "-").replace(/\./g, "-")
  return null
}

export function strengthOptionFromVariant(variant) {
  return (
    variant.metadata?.strength_option ||
    variant.metadata?.strength ||
    strengthKeyFromVariant(variant)
  )
}

export function variantMatchKey(variant, mergedProduct = false) {
  const merged =
    mergedProduct ||
    Boolean(variant.metadata?.compound_merged || variant.metadata?.compound_parent_handle)
  if (merged) {
    return `${strengthKeyFromVariant(variant)}::${packQtyFromVariant(variant)}`
  }
  return String(packQtyFromVariant(variant) ?? variant.sku ?? variant.title)
}

export function catalogVariantMatchKey(catalogVariant, merged) {
  if (merged) {
    return `${catalogVariant.metadata.strength_key}::${catalogVariant.metadata.pack_qty}`
  }
  return String(catalogVariant.metadata.pack_qty ?? catalogVariant.sku)
}

export function buildProductOptions(catalogProduct) {
  const merged = isMergedCatalogProduct(catalogProduct)

  if (merged) {
    const strengthValues = [
      ...new Set(catalogProduct.variants.map((v) => v.metadata.strength_option))
    ]
    const packValues = [...new Set(catalogProduct.variants.map((v) => v.title))]
    return [
      { title: STRENGTH_OPTION, values: strengthValues },
      { title: PACK_OPTION, values: packValues }
    ]
  }

  return [
    {
      title: PACK_OPTION,
      values: catalogProduct.variants.map((variant) => variant.title)
    }
  ]
}

export function catalogVariantPayload(catalogVariant, merged) {
  const options = merged
    ? {
        [STRENGTH_OPTION]: catalogVariant.metadata.strength_option,
        [PACK_OPTION]: catalogVariant.title
      }
    : { [PACK_OPTION]: catalogVariant.title }

  return {
    title: catalogVariant.title,
    sku: catalogVariant.sku,
    manage_inventory: false,
    options,
    prices: [
      {
        amount: Math.round(catalogVariant.amount_usd * 100),
        currency_code: catalogVariant.currency_code || "usd"
      }
    ],
    metadata: catalogVariant.metadata
  }
}

export function buildVariantBatch(existingProduct, catalogProduct) {
  const merged = isMergedCatalogProduct(catalogProduct)
  const existingVariants = existingProduct.variants || []
  const catalogKeys = new Set(
    catalogProduct.variants.map((v) => catalogVariantMatchKey(v, merged))
  )

  const byKey = new Map()
  for (const variant of existingVariants) {
    const qty = packQtyFromVariant(variant)
    const key = merged
      ? `${strengthKeyFromVariant(variant)}::${qty}`
      : String(qty ?? variant.sku)
    if (!byKey.has(key)) byKey.set(key, variant)
  }

  const create = []
  const update = []
  const deleteIds = []

  for (const catalogVariant of catalogProduct.variants) {
    const key = catalogVariantMatchKey(catalogVariant, merged)
    const existing = byKey.get(key)
    const payload = catalogVariantPayload(catalogVariant, merged)

    if (existing) {
      update.push({ id: existing.id, ...payload })
    } else {
      create.push(payload)
    }
  }

  for (const variant of existingVariants) {
    const qty = packQtyFromVariant(variant)
    if (qty == null && !merged) continue
    const key = merged
      ? `${strengthKeyFromVariant(variant)}::${qty}`
      : String(qty)
    if (!catalogKeys.has(key)) {
      deleteIds.push(variant.id)
    }
  }

  return { create, update, delete: deleteIds }
}
