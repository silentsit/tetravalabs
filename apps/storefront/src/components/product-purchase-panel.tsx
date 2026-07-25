"use client"

import { useEffect, useMemo, useState } from "react"
import { AddToCartButton } from "@/components/add-to-cart-button"
import { LabRestockSelector } from "@/components/lab-restock-selector"
import { PackSizeSelector } from "@/components/pack-size-selector"
import { StockNotifyForm } from "@/components/stock-notify-form"
import {
  isVariantInStock,
  type CompoundStrengthOption
} from "@/lib/compound-product"
import { getVariantPriceCents } from "@/lib/product-price"
import type { PackTier } from "@/lib/pack-pricing"
import { showCompareAtPricingForHandle } from "@/lib/pack-pricing"
import {
  applyLabRestockPrice,
  cartLineId,
  defaultFulfillmentMode,
  defaultRestockCadence,
  isLabRestockEligible,
  LAB_RESTOCK_COPY,
  restockSavingsUsd,
  type FulfillmentMode,
  type LabRestockCadenceDays
} from "@/lib/lab-restock"

type Props = {
  displayName: string
  strengths: CompoundStrengthOption[]
  selectedStrengthKey: string
  selectedPackQty: number | null
  onStrengthChange: (strengthKey: string) => void
  onPackChange: (tier: PackTier) => void
}

export function ProductPurchasePanel({
  displayName,
  strengths,
  selectedStrengthKey,
  selectedPackQty,
  onStrengthChange,
  onPackChange
}: Props) {
  const selectedStrength = useMemo(
    () =>
      strengths.find((item) => item.strengthKey === selectedStrengthKey) || strengths[0],
    [selectedStrengthKey, strengths]
  )

  const packTiers = selectedStrength?.packTiers || []
  const eligible = isLabRestockEligible(selectedStrength?.handle)

  const [fulfillment, setFulfillment] = useState<FulfillmentMode>(() =>
    eligible ? defaultFulfillmentMode(selectedStrength?.handle) : "one_time"
  )
  const [cadenceDays, setCadenceDays] = useState<LabRestockCadenceDays>(() =>
    defaultRestockCadence(selectedStrength?.handle)
  )

  useEffect(() => {
    if (!eligible) {
      setFulfillment("one_time")
      return
    }
    setFulfillment(defaultFulfillmentMode(selectedStrength?.handle))
    setCadenceDays(defaultRestockCadence(selectedStrength?.handle))
  }, [eligible, selectedStrength?.handle])

  const selectedTier = useMemo(() => {
    if (!packTiers.length) return null
    return packTiers.find((tier) => tier.qty === selectedPackQty) || packTiers[0]
  }, [packTiers, selectedPackQty])

  const selectedVariant = useMemo(() => {
    if (!selectedStrength) return undefined
    if (selectedTier) {
      return (
        selectedStrength.variants.find((variant) => variant.id === selectedTier.variantId) ||
        selectedStrength.variants[0]
      )
    }
    return selectedStrength.variants[0]
  }, [selectedStrength, selectedTier])

  const oneTimePrice = selectedTier
    ? selectedTier.price
    : getVariantPriceCents(selectedVariant) / 100

  const restockPrice = applyLabRestockPrice(oneTimePrice)
  const chargePrice = fulfillment === "lab_restock" ? restockPrice : oneTimePrice
  const savingsUsd = restockSavingsUsd(oneTimePrice, 1)
  const perUnit =
    selectedTier && selectedTier.qty > 0
      ? (fulfillment === "lab_restock"
          ? applyLabRestockPrice(selectedTier.perUnit)
          : selectedTier.perUnit
        ).toFixed(2)
      : null

  const inStock = isVariantInStock(selectedVariant)

  if (!selectedStrength || !selectedVariant) return null

  const showStrengthSelector = strengths.length > 1
  const showPackSelector = packTiers.length >= 2
  const variantTitle = selectedTier?.tier || selectedVariant.title
  const lineId = cartLineId(
    selectedStrength.productId,
    selectedVariant.id,
    fulfillment,
    fulfillment === "lab_restock" ? cadenceDays : null
  )

  return (
    <section className="card space-y-5 p-6" aria-label="Purchase options">
      {showStrengthSelector ? (
        <div>
          <h2 className="font-serif text-lg text-[color:var(--color-text)]">Select strength</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {strengths.map((strength) => {
              const active = strength.strengthKey === selectedStrength.strengthKey
              return (
                <button
                  key={strength.strengthKey}
                  type="button"
                  onClick={() => onStrengthChange(strength.strengthKey)}
                  aria-pressed={active}
                  className={`rounded-lg border px-3 py-2 font-mono text-xs font-medium transition ${
                    active
                      ? "border-[color:var(--color-teal)] bg-[#CCFBF1] text-[#0F766E]"
                      : "border-[color:var(--color-border)] text-[color:var(--color-text-secondary)] hover:border-[color:var(--color-teal)]"
                  }`}
                >
                  {strength.strengthLabel}
                </button>
              )
            })}
          </div>
        </div>
      ) : null}

      {showPackSelector ? (
        <PackSizeSelector
          key={selectedStrength.strengthKey}
          tiers={packTiers}
          value={selectedTier?.qty}
          onChange={onPackChange}
          showCompareAtPricing={showCompareAtPricingForHandle(selectedStrength.handle)}
        />
      ) : (
        <div>
          <h2 className="font-serif text-lg text-[color:var(--color-text)]">Price</h2>
          <p className="mt-2 text-2xl font-bold tabular-nums text-[color:var(--color-text)]">
            ${chargePrice.toFixed(2)}
          </p>
        </div>
      )}

      {eligible ? (
        <LabRestockSelector
          fulfillment={fulfillment}
          cadenceDays={cadenceDays}
          onFulfillmentChange={setFulfillment}
          onCadenceChange={setCadenceDays}
          oneTimePrice={oneTimePrice}
          restockPrice={restockPrice}
          savingsUsd={savingsUsd}
          perUnitLabel={perUnit ? `$${perUnit}/vial` : undefined}
        />
      ) : null}

      <div className="space-y-3 pt-1">
        {inStock ? (
          <AddToCartButton
            productId={selectedStrength.productId}
            handle={selectedStrength.handle}
            title={displayName}
            variantId={selectedVariant.id}
            variantTitle={
              fulfillment === "lab_restock"
                ? `${variantTitle} · Refill every ${cadenceDays}d`
                : variantTitle
            }
            unitPrice={chargePrice}
            lineId={lineId}
            fulfillment={fulfillment}
            restockCadenceDays={fulfillment === "lab_restock" ? cadenceDays : undefined}
            oneTimeUnitPrice={oneTimePrice}
            label={
              fulfillment === "lab_restock"
                ? LAB_RESTOCK_COPY.ctaRestock
                : LAB_RESTOCK_COPY.ctaOneTime
            }
          />
        ) : (
          <>
            <button type="button" className="btn-primary w-full opacity-50 sm:w-auto" disabled>
              Out of stock
            </button>
            <StockNotifyForm
              productHandle={selectedStrength.handle}
              productTitle={displayName}
              variantId={selectedVariant.id}
              strengthLabel={selectedStrength.strengthLabel}
            />
          </>
        )}
      </div>
    </section>
  )
}
