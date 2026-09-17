"use client"

import { useEffect, useMemo, useState } from "react"
import {
  formatPackTierSavingsLabel,
  formatPackTierYouSave,
  packTierSavingsUsd,
  packTotalUsd,
  pickPreferredPackQty,
  type PackTier
} from "@/lib/pack-pricing"

type Props = {
  tiers: PackTier[]
  unitLabel?: "vial" | "unit"
  /** Controlled selection (pack qty). */
  value?: number
  onChange?: (tier: PackTier) => void
  /** Loti-style compare-at strikethrough + You save (preview). */
  showCompareAtPricing?: boolean
}

function money(amount: number): string {
  return `$${amount.toFixed(2)}`
}

export function PackSizeSelector({
  tiers,
  unitLabel = "vial",
  value,
  onChange,
  showCompareAtPricing = false
}: Props) {
  const displayTiers = tiers

  const [internalQty, setInternalQty] = useState(
    value ?? pickPreferredPackQty(displayTiers) ?? 5
  )

  useEffect(() => {
    if (value != null) setInternalQty(value)
  }, [value])

  const selectedQty = value ?? internalQty
  const selected = useMemo(
    () => displayTiers.find((tier) => tier.qty === selectedQty) || displayTiers[0],
    [selectedQty, displayTiers]
  )

  if (!selected) return null

  const unitSuffix = unitLabel === "vial" ? "/vial" : "/unit"
  const unitWord = unitLabel === "vial" ? "vial" : "unit"

  const pickTier = (tier: PackTier) => {
    if (value == null) setInternalQty(tier.qty)
    onChange?.(tier)
  }

  const selectedSavings = packTierSavingsUsd(selected)
  const selectedPackTotal = packTotalUsd(selected)
  const selectedCompareAtPack =
    showCompareAtPricing &&
    selected.compareAtPack != null &&
    selected.compareAtPack > selectedPackTotal

  return (
    <div className="space-y-4">
      <div>
        <span className="mb-2 block text-sm font-medium text-[#475569]">Choose pack size</span>
        <p className="text-xs text-[#94A3B8]">
          {displayTiers.map((tier) => tier.qty).join(" / ")}{" "}
          {displayTiers.length === 1 && displayTiers[0]?.qty === 1
            ? unitWord
            : `${unitWord}s`}
        </p>
      </div>

      <div className="space-y-3">
        {displayTiers.map((tier) => {
          const active = selected.qty === tier.qty
          const savingsLabel = formatPackTierSavingsLabel(tier)
          const packTotal = packTotalUsd(tier)
          const showCardCompare =
            showCompareAtPricing &&
            tier.compareAtPerUnit != null &&
            tier.compareAtPerUnit > tier.perUnit
          const showPackCompare =
            showCompareAtPricing &&
            packTierSavingsUsd(tier) > 0 &&
            tier.compareAtPack != null &&
            tier.compareAtPack > packTotal

          return (
            <button
              key={tier.qty}
              type="button"
              onClick={() => pickTier(tier)}
              aria-pressed={active}
              aria-label={`${tier.tier}, ${money(packTotal)} pack total, ${money(tier.perUnit)}${unitSuffix}`}
              className={`flex w-full items-start gap-3 rounded-xl border px-4 py-4 text-left transition sm:gap-4 ${
                active
                  ? "border-[#0D9488] bg-[#F0FDFA] shadow-[0_0_0_1px_#0D9488]"
                  : "border-[#E2E8F0] bg-white hover:border-[#CBD5E1]"
              }`}
            >
              <span
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                  active ? "border-[#0D9488]" : "border-[#CBD5E1]"
                }`}
              >
                <span
                  className={`h-2.5 w-2.5 rounded-full ${active ? "bg-[#0D9488]" : "bg-transparent"}`}
                />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-[#0F172A]">{tier.tier}</span>
                      {tier.qty === 5 ? (
                        <span className="rounded-full bg-[#E2E8F0] px-2 py-0.5 font-mono text-[10px] font-semibold text-[#475569]">
                          Best fit
                        </span>
                      ) : null}
                      {tier.qty === 10 ? (
                        <span className="rounded-full bg-[#6366F1] px-2 py-0.5 font-mono text-[10px] font-semibold text-white">
                          Most Popular
                        </span>
                      ) : null}
                      {savingsLabel ? (
                        <span className="rounded-full bg-[#CCFBF1] px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wide text-[#0F766E]">
                          {savingsLabel}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1 font-mono text-xs tabular-nums whitespace-nowrap text-[#64748B]">
                      {showCardCompare ? (
                        <>
                          <span className="text-[#94A3B8] line-through">
                            {money(tier.compareAtPerUnit!)}
                            {unitSuffix}
                          </span>{" "}
                        </>
                      ) : null}
                      {money(tier.perUnit)}
                      {unitSuffix}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    {showPackCompare ? (
                      <p className="font-mono text-xs tabular-nums text-[#94A3B8] line-through">
                        {money(tier.compareAtPack!)}
                      </p>
                    ) : null}
                    <p className="text-xl font-bold tabular-nums leading-tight text-[#0F172A]">
                      {money(packTotal)}
                    </p>
                  </div>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      <div>
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <p className="text-2xl font-bold tabular-nums text-[#0F172A]">
            {money(selectedPackTotal)}
          </p>
          {selectedCompareAtPack ? (
            <p className="text-base tabular-nums text-[#94A3B8] line-through">
              {money(selected.compareAtPack!)}
            </p>
          ) : null}
        </div>
        <p className="mt-1 text-sm text-[#64748B]">
          {selected.tier} · {money(selected.perUnit)}
          {unitSuffix}
        </p>
        {showCompareAtPricing && selectedSavings > 0 ? (
          <p className="mt-1 text-sm font-medium text-[#0D9488]">
            {formatPackTierYouSave(selected) || `You save ${money(selectedSavings)}`}
          </p>
        ) : null}
      </div>
    </div>
  )
}
