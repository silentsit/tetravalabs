import type { StoreProduct } from "@/lib/medusa"
import { getProductPriceCents, getVariantPriceCents } from "@/lib/product-price"
import productImageMap from "@/lib/revamp/product-image-map.json"

type AliasEntry = { slug: string; image: string }

const kimiImages = productImageMap.kimi as Record<string, string>
const handleAliases = productImageMap.aliases as Record<string, AliasEntry>

const visualFallback: Record<string, string> = {
  vial: "/v2/vial-single.jpg",
  capsule: "/products/bottle-capsules.jpg",
  water: "/products/vial-water.jpg",
  water_solution: "/products/vial-water.jpg",
  blend: "/v2/cat-blends.jpg",
  hgh: "/products/hgh-10iu.jpg",
  liquid: "/products/vial-water.jpg"
}

function normalizeKey(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "")
}

export function getProductImageForHandle(handle: string, variantHandle?: string) {
  const metadataImage = handleAliases[handle]?.image
  if (metadataImage) return metadataImage

  const candidates = [variantHandle, handle].filter(Boolean) as string[]
  for (const candidate of candidates) {
    if (kimiImages[candidate]) return kimiImages[candidate]
    const alias = handleAliases[candidate]
    if (alias?.image) return alias.image
  }

  const normalizedHandle = normalizeKey(handle)
  for (const [slug, image] of Object.entries(kimiImages)) {
    const normalizedSlug = normalizeKey(slug)
    if (
      normalizedSlug === normalizedHandle ||
      normalizedSlug.startsWith(normalizedHandle) ||
      normalizedHandle.startsWith(normalizedSlug.replace(/\d+.*/, ""))
    ) {
      return image
    }
  }

  return null
}

export function getProductImage(product: StoreProduct) {
  const metadataUrl = String(product.metadata?.product_image || product.metadata?.image_url || "")
  if (metadataUrl.startsWith("/") || metadataUrl.startsWith("http")) {
    return metadataUrl
  }

  const variantHandle = product.variants?.[0]?.title
    ? `${product.handle}-${product.variants[0].title.toLowerCase().replace(/\s+/g, "")}`
    : undefined

  const mapped = getProductImageForHandle(product.handle, variantHandle)
  if (mapped) return mapped

  const visual = String(product.metadata?.visual_type || "vial")
  if (visual === "capsule") {
    return visualFallback.capsule
  }

  return visualFallback[visual] || "/v2/vial-single.jpg"
}

export function getProductPurity(product: StoreProduct) {
  const purity = product.metadata?.purity_percent
  if (typeof purity === "number") return `${purity}%`
  return String(product.metadata?.purity || "99%+")
}

export function getPrimaryVariant(product: StoreProduct) {
  return product.variants?.[0]
}

export function getProductPrice(product: StoreProduct) {
  return getProductPriceCents(product) / 100
}

export { getVariantPriceCents }

export function isBlendProduct(product: StoreProduct) {
  const visual = String(product.metadata?.visual_type || "")
  return visual === "blend" || product.handle.includes("blend")
}
