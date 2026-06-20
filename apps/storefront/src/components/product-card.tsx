"use client"

import Link from "next/link"
import Image from "next/image"
import { ShoppingCart } from "lucide-react"
import type { StoreProduct } from "@/lib/medusa"
import { useCart } from "@/components/cart-provider"
import { getProductImage } from "@/lib/product-image-map"
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
  variant?: "shop" | "default"
}

export function ProductCard({ product, variant = "shop" }: ProductCardProps) {
  const { addItem } = useCart()
  const variantRow = getPrimaryVariant(product)
  const displayName = getProductDisplayName(product)
  const packTiers = packTiersFromVariants(product.variants || [])
  const showFromPrice = hasMultiplePackTiers(product)
  const price = showFromPrice ? getLowestPackPrice(product) : getProductPrice(product)
  const cartVariant = showFromPrice ? packTiers[0] : null
  const inStock = Boolean(cartVariant?.variantId || variantRow?.id)
  const imageUrl = getProductImage(product.handle)
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
    <Link href={`/product/${product.handle}`} className="group block">
      <div className="relative aspect-[2/3] overflow-hidden rounded-lg border border-[#E2E8F0] bg-[#F8FAFC]">
        <Image
          src={imageUrl}
          alt={displayName}
          fill
          unoptimized
          className="object-contain p-6 transition-transform duration-500 ease-out group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <button
          type="button"
          onClick={handleQuickAdd}
          disabled={!inStock}
          className="absolute bottom-3 right-3 flex h-9 w-9 translate-y-2 items-center justify-center rounded-full bg-white/90 text-[#0F172A] opacity-0 shadow-md backdrop-blur-sm transition-all duration-300 hover:bg-[#0D9488] hover:text-white group-hover:translate-y-0 group-hover:opacity-100 disabled:pointer-events-none disabled:opacity-0"
          aria-label="Add to cart"
        >
          <ShoppingCart className="h-4 w-4" />
        </button>

        {showBlendBadge ? (
          <span className="absolute left-3 top-3 rounded-full bg-violet-600/90 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
            Blend
          </span>
        ) : null}
      </div>

      <div className="mt-3 space-y-1 px-0.5">
        <h3 className="line-clamp-1 text-[15px] font-semibold leading-tight text-[#0F172A] transition-colors group-hover:text-[#0D9488]">
          {displayName}
        </h3>
        <p className="text-[14px] font-medium text-[#64748B]">{priceLabel}</p>
      </div>
    </Link>
  )
}
