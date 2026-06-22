"use client"

import Link from "next/link"
import Image from "next/image"
import { Plus, ShoppingCart } from "lucide-react"
import type { StoreProduct } from "@/lib/medusa"
import { useCart } from "@/components/cart-provider"
import { getFeaturedProductImage, getProductImage } from "@/lib/product-image-map"
import {
  getPrimaryVariant,
  getProductDisplayName,
  getProductPrice,
  isBlendProduct
} from "@/lib/revamp/product-visual"
import { hasMultiplePackTiers, getLowestPackPrice, packTiersFromVariants } from "@/lib/pack-pricing"

interface ProductCardProps {
  product: StoreProduct
  /** Tighter grid layout for shop page revamp */
  variant?: "shop" | "default" | "featured"
  /** Optional override (e.g. photorealistic PNG on homepage featured row) */
  imageOverride?: string
  /** Optional category line under price (shop grid) */
  categoryLabel?: string
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

  const priceLabel = showFromPrice
    ? `From $${price.toFixed(2)}`
    : `$${price.toFixed(2)}`

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
            <h3 className="text-[15px] font-semibold leading-snug text-[#0F172A] transition-colors group-hover:text-[#0D9488]">
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
    <Link href={`/product/${product.handle}`} className="group relative block">
      <button
        type="button"
        onClick={handleQuickAdd}
        disabled={!inStock}
        className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-[#E2E8F0] bg-white/95 text-[#64748B] shadow-sm transition-all hover:border-[#0D9488] hover:bg-[#0D9488] hover:text-white disabled:pointer-events-none disabled:opacity-40"
        aria-label="Add to cart"
      >
        <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
      </button>

      <div className="relative aspect-[3/4] overflow-hidden rounded-lg border border-[#E2E8F0] bg-[#F8FAFC]">
        <Image
          src={imageUrl}
          alt={displayName}
          fill
          unoptimized
          className="object-contain p-4 transition-transform duration-300 ease-out group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
        />

        {showBlendBadge ? (
          <span className="absolute left-2 top-2 rounded-full bg-violet-600/90 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
            Blend
          </span>
        ) : null}
      </div>

      <div className="mt-2 space-y-0.5 px-0.5">
        <h3 className="line-clamp-2 min-h-[2.5em] text-[13px] font-bold leading-tight text-[#0F172A] transition-colors group-hover:text-[#0D9488]">
          {displayName}
        </h3>
        <p className="text-[13px] font-bold text-[#0D9488]">{priceLabel}</p>
        {categoryLabel ? (
          <p className="text-[10px] font-medium uppercase tracking-wider text-[#94A3B8]">
            {categoryLabel}
          </p>
        ) : null}
      </div>
    </Link>
  )
}
