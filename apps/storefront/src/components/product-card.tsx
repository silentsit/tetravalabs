"use client"

import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import type { StoreProduct } from "@/lib/medusa"
import { useCart } from "@/components/cart-provider"
import { getFeaturedProductImage, getProductImage } from "@/lib/product-image-map"
import {
  getPrimaryVariant,
  getProductDisplayName,
  getProductPrice,
  isBlendProduct
} from "@/lib/revamp/product-visual"
import {
  getLowestPackPrice,
  hasMultiplePackTiers,
  packTiersFromVariants,
  resolveProductPurchaseLayout
} from "@/lib/pack-pricing"

interface ProductCardProps {
  product: StoreProduct
  /** Tighter grid layout for shop page revamp */
  variant?: "shop" | "default" | "featured"
  /** Optional override (e.g. photorealistic PNG on homepage featured row) */
  imageOverride?: string
  /** Optional category line under price (shop grid) */
  categoryLabel?: string
}

function getShopPriceDisplay(product: StoreProduct): string {
  const packTiers = packTiersFromVariants(product.variants || [])
  if (packTiers.length >= 2) {
    const prices = packTiers.map((tier) => tier.price)
    const min = Math.min(...prices)
    const max = Math.max(...prices)
    if (min !== max) return `$${min.toFixed(2)} – $${max.toFixed(2)}`
    return `$${min.toFixed(2)}`
  }

  const price = getProductPrice(product)
  return `$${price.toFixed(2)}`
}

function productNeedsOptions(product: StoreProduct): boolean {
  return resolveProductPurchaseLayout(product.variants || []).mode !== "simple"
}

export function ProductCard({
  product,
  variant = "shop",
  imageOverride,
  categoryLabel
}: ProductCardProps) {
  const { addItem } = useCart()
  const variantRow = getPrimaryVariant(product)
  const displayName = getProductDisplayName(product)
  const packTiers = packTiersFromVariants(product.variants || [])
  const showFromPrice = hasMultiplePackTiers(product)
  const price = showFromPrice ? getLowestPackPrice(product) : getProductPrice(product)
  const cartVariant = showFromPrice ? packTiers[0] : null
  const inStock = Boolean(cartVariant?.variantId || variantRow?.id)
  const imageUrl =
    imageOverride ??
    (variant === "featured"
      ? getFeaturedProductImage(product.handle)
      : getProductImage(product.handle))
  const showBlendBadge = isBlendProduct(product)

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const variantId = cartVariant?.variantId || variantRow?.id
    if (!variantId) return

    addItem({
      id: `${product.id}:${variantId}`,
      productId: product.id,
      handle: product.handle,
      title: displayName,
      variantId,
      variantTitle: cartVariant?.tier || variantRow?.title || "Standard",
      unitPrice: cartVariant?.price ?? price
    })
  }

  const priceLabel = getShopPriceDisplay(product)
  const needsOptions = productNeedsOptions(product)
  const productHref = `/product/${product.handle}`

  if (variant === "default") {
    return (
      <div className="card card-hover group flex flex-col overflow-hidden">
        <Link href={`/product/${product.handle}`} className="product-card-media">
          <img
            src={imageUrl}
            alt={displayName}
            className="product-card-media-image"
            loading="lazy"
          />
          {showBlendBadge ? (
            <span className="absolute left-3 top-3 rounded-md bg-[#7C3AED] px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
              Blend
            </span>
          ) : null}
        </Link>
        <div className="flex flex-1 flex-col border-t border-[#E2E8F0] p-4">
          <Link href={`/product/${product.handle}`}>
            <h3 className="product-card-title text-[15px] leading-snug text-[#0F172A] transition-colors group-hover:text-[#0D9488]">
              {displayName}
            </h3>
          </Link>
          <div className="mt-auto flex items-center justify-between gap-2 pt-3">
            <span className="text-base font-bold text-[#0F172A]">{priceLabel}</span>
            <button
              type="button"
              onClick={handleQuickAdd}
              disabled={!inStock}
              className="flex h-8 items-center gap-1.5 rounded-lg bg-[#0D9488] px-3 text-xs font-semibold text-white transition-all hover:bg-[#0F766E] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ShoppingCart className="h-3.5 w-3.5" /> Add
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <article className="card card-hover group flex h-full min-w-0 flex-col overflow-hidden">
      <Link href={productHref} className="block flex-1 min-w-0">
        <div className="flex items-center justify-center px-3 pb-1 pt-3">
          <div className="relative aspect-[3/4] w-[85%] max-w-[280px] overflow-hidden bg-white">
            <img
              src={imageUrl}
              alt={displayName}
              className="h-full w-full object-contain transition-transform duration-300 ease-out group-hover:scale-[1.03]"
              loading="lazy"
            />

            {showBlendBadge ? (
              <span className="absolute left-2 top-2 rounded-full bg-violet-600/90 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
                Blend
              </span>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col px-3.5 pb-2 pt-1">
          <h3 className="product-card-title font-bold line-clamp-2 min-h-[2.5em] text-[15px] leading-[1.25] text-[#0F172A] transition-colors group-hover:text-[#0D9488]">
            {displayName}
          </h3>
          <p className="mt-1 text-[13px] font-bold tabular-nums text-[#0D9488]">{priceLabel}</p>
          {categoryLabel ? (
            <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-[#94A3B8]">
              {categoryLabel}
            </p>
          ) : null}
        </div>
      </Link>

      <div className="mt-auto px-3.5 pb-3.5">
        {needsOptions ? (
          <Link
            href={productHref}
            className="flex h-10 w-full items-center justify-center rounded-full border border-[#0D9488] bg-white text-[13px] font-semibold text-[#0D9488] transition-colors hover:bg-[#0D9488] hover:text-white"
          >
            Select options
          </Link>
        ) : (
          <button
            type="button"
            onClick={handleQuickAdd}
            disabled={!inStock}
            className="flex h-10 w-full items-center justify-center gap-2 rounded-full bg-[#0D9488] text-[13px] font-semibold text-white transition-colors hover:bg-[#0F766E] disabled:cursor-not-allowed disabled:opacity-45"
          >
            <ShoppingCart className="h-4 w-4" strokeWidth={2.25} />
            Add to cart
          </button>
        )}
      </div>
    </article>
  )
}
