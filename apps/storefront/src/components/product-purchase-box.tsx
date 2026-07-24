"use client"

import { useMemo, useState } from "react"
import { AddToCartButton } from "@/components/add-to-cart-button"
import { PackSizeSelector } from "@/components/pack-size-selector"
import type { StoreVariant } from "@/lib/product-price"
import { getVariantPriceCents } from "@/lib/product-price"
import {
  getVariantStrengthKey,
  resolveProductPurchaseLayout,
  showCompareAtPricingForHandle,
  type PackTier
} from "@/lib/pack-pricing"

type Variant = StoreVariant

type Props = {
  productId: string
  handle: string
  title: string
  variants: Variant[]
}

function StrengthSelector({
  variants,
  selectedId,
  onSelect
}: {
  variants: Variant[]
  selectedId: string
  onSelect: (id: string) => void
}) {
  return (
    <>
      <h2 className="font-serif text-lg text-[#0F172A]">Select strength</h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {variants.map((variant) => (
          <button
            key={variant.id}
            type="button"
            onClick={() => onSelect(variant.id)}
            className={`rounded-lg border px-3 py-2 text-xs font-medium transition ${
              selectedId === variant.id
                ? "border-[#0D9488] bg-[#CCFBF1] text-[#0F766E]"
                : "border-[#E2E8F0] text-[#475569] hover:border-[#0D9488]"
            }`}
          >
            {variant.metadata?.strength ? String(variant.metadata.strength) : variant.title}
          </button>
        ))}
      </div>
    </>
  )
}

export function ProductPurchaseBox({ productId, handle, title, variants }: Props) {
  const layout = useMemo(() => resolveProductPurchaseLayout(variants), [variants])

  const [strengthKey, setStrengthKey] = useState(() => {
    if (layout.mode === "strength-and-pack") {
      return getVariantStrengthKey(layout.strengthVariants[0])
    }
    return ""
  })

  const [selectedStrengthId, setSelectedStrengthId] = useState(
    layout.mode === "strength-only" ? layout.strengthVariants[0]?.id || "" : ""
  )

  const [selectedPackTier, setSelectedPackTier] = useState<PackTier | null>(() => {
    if (layout.mode === "pack-only") return layout.packTiers[0] || null
    if (layout.mode === "strength-and-pack") {
      const key = getVariantStrengthKey(layout.strengthVariants[0])
      return layout.packTiersByStrength.get(key)?.[0] || null
    }
    return null
  })

  const selectedSimple = useMemo(() => {
    if (layout.mode !== "simple") return variants[0]
    return variants.find((v) => v.id === selectedStrengthId) || variants[0]
  }, [layout.mode, selectedStrengthId, variants])

  const activePackTiers = useMemo(() => {
    if (layout.mode === "pack-only") return layout.packTiers
    if (layout.mode === "strength-and-pack") {
      return layout.packTiersByStrength.get(strengthKey) || []
    }
    return []
  }, [layout, strengthKey])

  const selectedVariant = useMemo(() => {
    if (layout.mode === "pack-only" || layout.mode === "strength-and-pack") {
      const tier = selectedPackTier || activePackTiers[0]
      return variants.find((v) => v.id === tier?.variantId) || variants[0]
    }
    if (layout.mode === "strength-only") {
      return variants.find((v) => v.id === selectedStrengthId) || variants[0]
    }
    return selectedSimple
  }, [
    activePackTiers,
    layout.mode,
    selectedPackTier,
    selectedSimple,
    selectedStrengthId,
    variants
  ])

  const price = getVariantPriceCents(selectedVariant) / 100

  if (!selectedVariant) return null

  const handleStrengthPick = (variant: Variant) => {
    const key = getVariantStrengthKey(variant)
    setStrengthKey(key)
    if (layout.mode === "strength-only") {
      setSelectedStrengthId(variant.id)
      return
    }
    if (layout.mode === "strength-and-pack") {
      const tiers = layout.packTiersByStrength.get(key)
      setSelectedPackTier(tiers?.[0] || null)
    }
  }

  return (
    <section className="card p-6 space-y-5">
      {layout.mode === "strength-only" || layout.mode === "strength-and-pack" ? (
        <StrengthSelector
          variants={
            layout.mode === "strength-only"
              ? layout.strengthVariants
              : layout.strengthVariants
          }
          selectedId={
            layout.mode === "strength-only"
              ? selectedStrengthId
              : layout.strengthVariants.find((v) => getVariantStrengthKey(v) === strengthKey)?.id ||
                layout.strengthVariants[0]?.id ||
                ""
          }
          onSelect={(id) => {
            const variant = variants.find((v) => v.id === id)
            if (variant) handleStrengthPick(variant)
          }}
        />
      ) : null}

      {layout.mode === "pack-only" || layout.mode === "strength-and-pack" ? (
        <PackSizeSelector
          key={layout.mode === "strength-and-pack" ? strengthKey : "pack"}
          tiers={activePackTiers}
          onChange={setSelectedPackTier}
          showCompareAtPricing={showCompareAtPricingForHandle(handle)}
        />
      ) : layout.mode === "simple" ? (
        <>
          <h2 className="font-serif text-lg text-[#0F172A]">Price</h2>
          <p className="mt-2 text-2xl font-bold text-[#0F172A]">${price.toFixed(2)}</p>
        </>
      ) : (
        <>
          <p className="text-2xl font-bold text-[#0F172A]">${price.toFixed(2)}</p>
        </>
      )}

      {layout.mode === "strength-only" ? (
        <p className="text-2xl font-bold text-[#0F172A]">${price.toFixed(2)}</p>
      ) : null}

      <div className={layout.mode === "strength-only" ? "" : "pt-1"}>
        <AddToCartButton
          productId={productId}
          handle={handle}
          title={title}
          variantId={selectedVariant.id}
          variantTitle={selectedVariant.title}
          unitPrice={price}
        />
      </div>
    </section>
  )
}
