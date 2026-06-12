"use client"

import Link from "next/link"
import { Check, ShoppingCart } from "lucide-react"
import type { StoreProduct } from "@/lib/medusa"
import { useCart } from "@/components/cart-provider"
import {
  getPrimaryVariant,
  getProductImage,
  getProductPrice,
  getProductPurity,
  isBlendProduct
} from "@/lib/revamp/product-visual"

export function ProductCard({ product }: { product: StoreProduct }) {
  const { addItem } = useCart()
  const variant = getPrimaryVariant(product)
  const price = getProductPrice(product)
  const inStock = Boolean(variant?.id)

  const handleAdd = () => {
    if (!variant?.id) return
    addItem({
      id: `${product.id}:${variant.id}`,
      productId: product.id,
      handle: product.handle,
      title: product.title,
      variantId: variant.id,
      variantTitle: variant.title,
      unitPrice: price
    })
  }

  return (
    <div className="card card-hover group flex flex-col overflow-hidden">
      <Link href={`/product/${product.handle}`} className="relative block aspect-[3/4] overflow-hidden bg-white">
        <img
          src={getProductImage(product)}
          alt={product.title}
          className="h-full w-full object-contain p-3 transition-transform duration-300 group-hover:scale-[1.04]"
          loading="lazy"
        />
        {isBlendProduct(product) ? (
          <span className="absolute left-3 top-3 rounded-md bg-[#7C3AED] px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
            Blend
          </span>
        ) : null}
        <span className="absolute right-3 top-3 rounded-full bg-[#CCFBF1] px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-[#0D9488]">
          {getProductPurity(product)}
        </span>
      </Link>
      <div className="flex flex-1 flex-col border-t border-[#E2E8F0] p-4">
        <Link href={`/product/${product.handle}`}>
          <h3 className="text-[15px] font-semibold leading-snug text-[#0F172A] transition-colors group-hover:text-[#0D9488]">
            {product.title}
          </h3>
        </Link>
        <div className="mt-0.5 flex items-center gap-2">
          <p className="font-mono text-[11px] font-medium text-[#94A3B8]">{variant?.title || "Standard"}</p>
          {inStock ? (
            <span className="flex items-center gap-0.5 font-mono text-[10px] text-[#059669]">
              <Check className="h-3 w-3" /> In Stock
            </span>
          ) : (
            <span className="font-mono text-[10px] text-[#EF4444]">Out of Stock</span>
          )}
        </div>
        <div className="mt-auto flex items-center justify-between gap-2 pt-3">
          <span className="text-base font-bold text-[#0F172A]">${price.toFixed(2)}</span>
          <button
            type="button"
            onClick={handleAdd}
            disabled={!inStock}
            className="flex h-8 items-center gap-1.5 rounded-lg bg-[#0D9488] px-3 text-xs font-semibold text-white transition-all hover:bg-[#0F766E] hover:shadow-md active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ShoppingCart className="h-3.5 w-3.5" /> Add
          </button>
        </div>
      </div>
    </div>
  )
}
