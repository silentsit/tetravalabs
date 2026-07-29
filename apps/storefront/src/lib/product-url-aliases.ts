/**
 * Pretty storefront slugs for products whose Medusa handles are long/catalog-style.
 * URL segment → catalog handle
 */
export const PRODUCT_URL_TO_HANDLE: Record<string, string> = {
  "bpc-157-capsules": "bpc-157-capsules-100-count-500mcg",
  "pinealon-capsules": "pinealon-capsules-100-count"
}

export const PRODUCT_HANDLE_TO_URL: Record<string, string> = Object.fromEntries(
  Object.entries(PRODUCT_URL_TO_HANDLE).map(([urlSegment, catalogHandle]) => [
    catalogHandle,
    urlSegment
  ])
)
