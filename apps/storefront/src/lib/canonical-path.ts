import {
  canonicalizeCategorySlug,
  isStorefrontCategorySlug
} from "@/lib/category-url"
import {
  LEGACY_PRETTY_URL_REDIRECTS,
  PRODUCT_HANDLE_TO_URL,
  PRODUCT_URL_TO_HANDLE
} from "@/lib/product-url-aliases"
import compoundLegacyRedirects from "@/lib/compound-legacy-redirects.generated.json"

const LEGACY_STRENGTH_TO_PARENT = compoundLegacyRedirects as Record<
  string,
  { parent: string }
>

/** First-path segments that are app routes, not product handles. */
const RESERVED_SEGMENTS = new Set([
  "about",
  "account",
  "api",
  "auth",
  "blog",
  "brand",
  "cart",
  "categories",
  "category",
  "checkout",
  "coa-library",
  "contact",
  "faq",
  "images",
  "login",
  "md-mirror",
  "orders",
  "payment",
  "privacy",
  "product",
  "products",
  "refund",
  "register",
  "reorder",
  "reviews",
  "ruo",
  "search",
  "shipping",
  "shipping-restricted",
  "shop",
  "terms"
])

/** Map any known product URL segment to the canonical public slug. */
export function publicProductSegment(segment: string): string | null {
  if (!segment) return null
  if (PRODUCT_URL_TO_HANDLE[segment]) return segment
  const prettyLegacy = LEGACY_PRETTY_URL_REDIRECTS[segment]
  if (prettyLegacy) return prettyLegacy
  if (PRODUCT_HANDLE_TO_URL[segment]) return PRODUCT_HANDLE_TO_URL[segment]
  const parent = LEGACY_STRENGTH_TO_PARENT[segment]?.parent
  if (parent) return PRODUCT_HANDLE_TO_URL[parent] || parent
  return null
}

/**
 * Return the canonical pathname, or null if `pathname` is already canonical
 * (or is not a known alias). Trailing slashes should be stripped by the caller.
 */
export function canonicalPathname(pathname: string): string | null {
  const categoryMatch = pathname.match(/^\/category\/([^/]+)$/)
  if (categoryMatch) {
    const slug = categoryMatch[1]
    if (isStorefrontCategorySlug(slug)) return null
    const canonical = canonicalizeCategorySlug(slug)
    if (canonical && canonical !== slug) return `/category/${canonical}`
    return null
  }

  const prefixed = pathname.match(/^\/products?\/([^/]+)$/)
  if (prefixed) {
    const dest = publicProductSegment(prefixed[1])
    return dest ? `/${dest}` : null
  }

  const single = pathname.match(/^\/([^/]+)$/)
  if (!single) return null
  const segment = single[1]
  if (RESERVED_SEGMENTS.has(segment)) return null
  const dest = publicProductSegment(segment)
  if (dest && dest !== segment) return `/${dest}`
  return null
}
