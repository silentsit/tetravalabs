import Link from "next/link"
import type { StoreProduct } from "@/lib/medusa"
import { AddToCartButton } from "@/components/add-to-cart-button"

type Props = {
  product: StoreProduct
}

export function ProductCard({ product }: Props) {
  const variant = product.variants?.[0]
  const amount = (variant?.prices?.[0]?.amount || 0) / 100
  const category = String(product.metadata?.source_category || "Research Product")

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-white/[0.06] bg-[#0A0A10] transition-all duration-300 hover:-translate-y-0.5 hover:border-[rgba(120,160,220,0.3)]">
      <Link
        href={`/product/${product.handle}`}
        className="relative block aspect-[4/3] overflow-hidden bg-[#050508]"
      >
        <div className="flex h-full items-center justify-center p-6 text-center">
          <span className="font-serif text-lg text-[#5EEAD4]">{product.title}</span>
        </div>
        <span className="absolute left-3 top-3 rounded bg-[#FBBF24]/20 px-2 py-0.5 font-mono text-[10px] text-[#FBBF24]">
          RUO
        </span>
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <p className="font-mono text-[10px] uppercase tracking-wide text-[#5EEAD4]">{category}</p>
        <Link href={`/product/${product.handle}`}>
          <h3 className="mt-2 font-serif text-lg leading-tight text-[#E8E8F0] transition-colors group-hover:text-[#5EEAD4]">
            {product.title}
          </h3>
        </Link>
        <p className="mt-1 font-mono text-xs text-[#8A8AA0]">{variant?.title || "Default variant"}</p>
        <div className="mt-auto flex items-center justify-between pt-4">
          <span className="text-lg font-semibold text-[#E8E8F0]">${amount.toFixed(2)}</span>
        </div>
        {variant ? (
          <div className="mt-3">
            <AddToCartButton
              productId={product.id}
              handle={product.handle}
              title={product.title}
              variantId={variant.id}
              variantTitle={variant.title}
              unitPrice={amount}
            />
          </div>
        ) : null}
      </div>
    </article>
  )
}
