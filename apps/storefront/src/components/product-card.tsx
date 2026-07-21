"use client"

import Link from "next/link"
import Image from "next/image"
import { ShoppingCart } from "lucide-react"
import type { StoreProduct } from "@/lib/medusa"
import { useCart } from "@/components/cart-provider"
import { getFeaturedProductImage, getProductImage } from "@/lib/product-image-map"
import {
  getPrimaryVariant,
  getProductDisplayName,
  getProductDisplaySubtitle,
  getProductPrice,
  isBlendProduct,
  isCapsuleProduct
} from "@/lib/revamp/product-visual"
import {
  formatShelfPriceFromProduct,
  packTiersFromVariants,
  resolveProductPurchaseLayout
} from "@/lib/pack-pricing"
import { getProductHref } from "@/lib/compound-product"
import { ShelfPriceLabel } from "@/components/shelf-price-label"

interface ProductCardProps {
  product: StoreProduct
  /** Tighter grid layout for shop page revamp */
  variant?: "shop" | "default" | "featured"
  /** Optional override (e.g. photorealistic PNG on homepage featured row) */
  imageOverride?: string
}

function productNeedsOptions(product: StoreProduct): boolean {
  return resolveProductPurchaseLayout(product.variants || []).mode !== "simple"
}

export function ProductCard({
  product,
  variant = "shop",
  imageOverride
}: ProductCardProps) {
  const { addItem } = useCart()
  const variantRow = getPrimaryVariant(product)
  const displayName = getProductDisplayName(product)
  const capsuleSubtitle = isCapsuleProduct(product) ? getProductDisplaySubtitle(product) : null
  const packTiers = packTiersFromVariants(product.variants || [])
  const cartPackTier = packTiers[0] ?? null
  const fallbackCartPrice = getProductPrice(product)
  const inStock = Boolean(cartPackTier?.variantId || variantRow?.id)
  const imageUrl =
    imageOverride ??
    (variant === "featured"
      ? getFeaturedProductImage(product.handle)
      : getProductImage(product.handle))
  const showBlendBadge = isBlendProduct(product)

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const variantId = cartPackTier?.variantId || variantRow?.id
    if (!variantId) return

    addItem({
      id: `${product.id}:${variantId}`,
      productId: product.id,
      handle: product.handle,
      title: displayName,
      variantId,
      variantTitle: cartPackTier?.tier || variantRow?.title || "Standard",
      unitPrice: cartPackTier?.price ?? fallbackCartPrice
    })
  }

  const shelfPrice = formatShelfPriceFromProduct(product)
  const needsOptions = productNeedsOptions(product)
  const productHref = getProductHref(product.handle)
  const TitleTag = variant === "shop" ? "h2" : "h3"

  if (variant === "default") {
    return (
      <div className="card card-hover group flex flex-col overflow-hidden">
        <Link href={productHref} className="product-card-media">
          <Image
            src={imageUrl}
            alt={displayName}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
            className="product-card-media-image"
          />
          {showBlendBadge ? (
            <span className="absolute left-3 top-3 rounded-md bg-[#7C3AED] px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
              Blend
            </span>
          ) : null}
        </Link>
        <div className="flex flex-1 flex-col border-t border-[#E2E8F0] p-4">
          <Link href={productHref}>
            <h3 className="product-card-title text-[15px] leading-snug text-[#0F172A] transition-colors group-hover:text-[#0D9488]">
              {displayName}
            </h3>
            {capsuleSubtitle ? (
              <p className="mt-0.5 text-xs leading-snug text-[#64748B]">{capsuleSubtitle}</p>
            ) : null}
          </Link>
          <div className="mt-auto flex items-end justify-between gap-2 pt-3">
            <ShelfPriceLabel shelf={shelfPrice} variant="default" />
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
          <div className="relative aspect-[3/4] w-[78%] max-w-[280px] overflow-hidden bg-white min-[480px]:w-[85%]">
            <Image
              src={imageUrl}
              alt={displayName}
              fill
              sizes="(max-width: 480px) 90vw, (max-width: 768px) 42vw, (max-width: 1280px) 28vw, 220px"
              className="h-full w-full object-contain transition-transform duration-300 ease-out group-hover:scale-[1.03]"
            />

            {showBlendBadge ? (
              <span className="absolute left-2 top-2 rounded-full bg-violet-600/90 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
                Blend
              </span>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col px-3.5 pb-2 pt-1">
          <TitleTag
            className={`product-card-title line-clamp-2 text-base font-bold leading-[1.25] text-[#0F172A] transition-colors group-hover:text-[#0D9488] ${
              capsuleSubtitle ? "" : "min-[480px]:min-h-[2.5em]"
            }`}
          >
            {displayName}
          </TitleTag>
          {capsuleSubtitle ? (
            <p className="mt-0.5 text-sm leading-snug text-[#64748B]">{capsuleSubtitle}</p>
          ) : null}
          <ShelfPriceLabel shelf={shelfPrice} variant="shop" />
        </div>
      </Link>

      <div className="mt-auto px-3.5 pb-3.5">
        {needsOptions ? (
          <Link
            href={productHref}
            className="flex h-10 w-full items-center justify-center rounded-full border border-[#0D9488] bg-white text-sm font-semibold text-[#0D9488] transition-colors hover:bg-[#0D9488] hover:text-white"
          >
            Select options
          </Link>
        ) : (
          <button
            type="button"
            onClick={handleQuickAdd}
            disabled={!inStock}
            className="flex h-10 w-full items-center justify-center gap-2 rounded-full bg-[#0D9488] text-sm font-semibold text-white transition-colors hover:bg-[#0F766E] disabled:cursor-not-allowed disabled:opacity-45"
          >
            <ShoppingCart className="h-4 w-4" strokeWidth={2.25} />
            Add to cart
          </button>
        )}
      </div>
    </article>
  )
}
