"use client"

import { useEffect, useMemo, useState } from "react"
import { type PackTier } from "@/lib/pack-pricing"

type Props = {
  tiers: PackTier[]
  unitLabel?: "vial" | "unit"
  /** Controlled selection (pack qty). */
  value?: number
  onChange?: (tier: PackTier) => void
  /** Loti-style compare-at strikethrough + You save (preview). */
  showCompareAtPricing?: boolean
}

export function PackSizeSelector({
  tiers,
  unitLabel = "vial",
  value,
  onChange,
  showCompareAtPricing = false
}: Props) {
  const displayTiers = tiers

  const [internalQty, setInternalQty] = useState(value ?? displayTiers[0]?.qty ?? 5)

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
  const perUnits = displayTiers.map((tier) => tier.perUnit)
  const perUnitRange =
    perUnits.length > 1 && Math.min(...perUnits) !== Math.max(...perUnits)
      ? `$${Math.min(...perUnits).toFixed(2)} – $${Math.max(...perUnits).toFixed(2)}`
      : `$${selected.perUnit.toFixed(2)}`

  const pickTier = (tier: PackTier) => {
    if (value == null) setInternalQty(tier.qty)
    onChange?.(tier)
  }

  const selectedSavings = selected.savingsUsd ?? 0
  const selectedCompareAt =
    showCompareAtPricing &&
    selected.compareAtPerUnit != null &&
    selected.compareAtPerUnit > selected.perUnit

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <span className="mb-1 block text-xs font-medium text-[#475569]">Choose pack size</span>
          <p className="text-[11px] text-[#94A3B8]">
            {displayTiers.map((tier) => tier.qty).join(" / ")} {unitWord}
            {displayTiers.length === 1 && displayTiers[0]?.qty === 1 ? "" : "s"}
          </p>
        </div>
        <p className="text-xs font-medium tabular-nums text-[#475569]">
          {perUnitRange}
          {unitSuffix}
        </p>
      </div>

      <div className="space-y-2">
        {displayTiers.map((tier) => {
          const active = selected.qty === tier.qty
          const savingsLabel =
            tier.savingsPct > 0 ? `save ${Math.round(tier.savingsPct * 100)}%` : null
          const showCardCompare =
            showCompareAtPricing &&
            tier.compareAtPerUnit != null &&
            tier.compareAtPerUnit > tier.perUnit
          const showPackCompare =
            showCompareAtPricing &&
            (tier.savingsUsd ?? 0) > 0 &&
            tier.compareAtPack != null

          return (
            <button
              key={tier.qty}
              type="button"
              onClick={() => pickTier(tier)}
              className={`flex w-full flex-col gap-2 rounded-lg border px-3 py-2.5 text-left transition sm:flex-row sm:items-center sm:gap-3 ${
                active
                  ? "border-[#0D9488] bg-[#F0FDFA] shadow-[0_0_0_1px_#0D9488]"
                  : "border-[#E2E8F0] bg-white hover:border-[#CBD5E1]"
              }`}
            >
              <span
                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                  active ? "border-[#0D9488]" : "border-[#CBD5E1]"
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${active ? "bg-[#0D9488]" : "bg-transparent"}`}
                />
              </span>
              <div className="min-w-0 flex-1 self-stretch sm:self-auto">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-sm font-medium text-[#0F172A]">{tier.tier}</span>
                  {tier.qty === 5 ? (
                    <span className="rounded-full bg-[#E2E8F0] px-1.5 py-0.5 font-mono text-[10px] font-semibold text-[#475569]">
                      Best fit
                    </span>
                  ) : null}
                  {tier.qty === 10 ? (
                    <span className="rounded-full bg-[#6366F1] px-1.5 py-0.5 font-mono text-[10px] font-semibold text-white">
                      Most Popular
                    </span>
                  ) : null}
                  {savingsLabel ? (
                    <span className="rounded-full bg-[#CCFBF1] px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wide text-[#0F766E]">
                      {savingsLabel}
                    </span>
                  ) : null}
                </div>
                <p className="mt-0.5 font-mono text-[11px] text-[#64748B]">
                  {showPackCompare ? (
                    <>
                      <span className="mr-1.5 text-[#94A3B8] line-through">
                        ${tier.compareAtPack!.toFixed(2)}
                      </span>
                      ${tier.price.toFixed(2)} pack total
                    </>
                  ) : (
                    <>${tier.price.toFixed(2)} pack total</>
                  )}
                </p>
              </div>
              <div className="shrink-0 text-left sm:text-right">
                {showCardCompare ? (
                  <p className="font-mono text-[11px] tabular-nums text-[#94A3B8] line-through">
                    ${tier.compareAtPerUnit!.toFixed(2)}
                    {unitSuffix}
                  </p>
                ) : null}
                <p className="text-base font-bold tabular-nums text-[#0F172A]">
                  ${tier.perUnit.toFixed(2)}
                  <span className="text-[11px] font-semibold text-[#64748B]">{unitSuffix}</span>
                </p>
              </div>
            </button>
          )
        })}
      </div>

      <div>
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <p className="text-xl font-bold tabular-nums text-[#0F172A]">
            ${selected.perUnit.toFixed(2)}
            <span className="text-sm font-semibold text-[#64748B]">{unitSuffix}</span>
          </p>
          {selectedCompareAt ? (
            <p className="text-sm tabular-nums text-[#94A3B8] line-through">
              ${selected.compareAtPerUnit!.toFixed(2)}
              {unitSuffix}
            </p>
          ) : null}
        </div>
        <p className="mt-0.5 text-xs text-[#64748B]">
          ${selected.price.toFixed(2)} pack total · {selected.tier}
        </p>
        {showCompareAtPricing && selectedSavings > 0 ? (
          <p className="mt-0.5 text-xs font-medium text-[#0D9488]">
            You save ${selectedSavings.toFixed(2)}
          </p>
        ) : null}
      </div>
    </div>
  )
}
