"use client"

import { useMemo, useState } from "react"
import type { PackTier } from "@/lib/pack-pricing"

type Props = {
  tiers: PackTier[]
  unitLabel?: "vial" | "unit"
  onChange?: (tier: PackTier) => void
}

export function PackSizeSelector({ tiers, unitLabel = "vial", onChange }: Props) {
  const [selectedQty, setSelectedQty] = useState(tiers[0]?.qty || 5)
  const selected = useMemo(
    () => tiers.find((tier) => tier.qty === selectedQty) || tiers[0],
    [selectedQty, tiers]
  )

  if (!selected) return null

  const unitSuffix = unitLabel === "vial" ? "/vial" : "/unit"
  const unitWord = unitLabel === "vial" ? "vial" : "unit"
  const moqQty = tiers[0]?.qty ?? 5
  const perUnits = tiers.map((tier) => tier.perUnit)
  const perUnitRange =
    perUnits.length > 1 && Math.min(...perUnits) !== Math.max(...perUnits)
      ? `$${Math.min(...perUnits).toFixed(2)} – $${Math.max(...perUnits).toFixed(2)}`
      : `$${selected.perUnit.toFixed(2)}`

  const pickTier = (tier: PackTier) => {
    setSelectedQty(tier.qty)
    onChange?.(tier)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="mb-2 block text-sm font-medium text-[#475569]">Choose pack size</span>
          <p className="text-xs text-[#94A3B8]">
            Sold in multi-{unitWord} packs only · {moqQty}-{unitWord} minimum
          </p>
        </div>
        <p className="text-sm font-medium tabular-nums text-[#475569]">
          {perUnitRange}
          {unitSuffix}
        </p>
      </div>

      <div className="space-y-3">
        {tiers.map((tier) => {
          const active = selected.qty === tier.qty
          const savingsLabel =
            tier.savingsPct > 0 ? `save ${Math.round(tier.savingsPct * 100)}%` : null
          return (
            <button
              key={tier.qty}
              type="button"
              onClick={() => pickTier(tier)}
              className={`flex w-full flex-col gap-3 rounded-xl border px-4 py-4 text-left transition sm:flex-row sm:items-center sm:gap-4 ${
                active
                  ? "border-[#0D9488] bg-[#F0FDFA] shadow-[0_0_0_1px_#0D9488]"
                  : "border-[#E2E8F0] bg-white hover:border-[#CBD5E1]"
              }`}
            >
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                  active ? "border-[#0D9488]" : "border-[#CBD5E1]"
                }`}
              >
                <span
                  className={`h-2.5 w-2.5 rounded-full ${active ? "bg-[#0D9488]" : "bg-transparent"}`}
                />
              </span>
              <div className="min-w-0 flex-1 self-stretch sm:self-auto">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium text-[#0F172A]">{tier.tier}</span>
                  {tier.qty === 10 ? (
                    <span className="rounded-full bg-[#6366F1] px-2 py-0.5 font-mono text-[10px] font-semibold text-white">
                      Most Popular
                    </span>
                  ) : null}
                  {tier.qty === 20 ? (
                    <span className="rounded-full bg-[#0D9488] px-2 py-0.5 font-mono text-[10px] font-semibold text-white">
                      Best value
                    </span>
                  ) : null}
                  {savingsLabel ? (
                    <span className="rounded-full bg-[#CCFBF1] px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wide text-[#0F766E]">
                      {savingsLabel}
                    </span>
                  ) : null}
                </div>
                <p className="mt-1 font-mono text-xs text-[#64748B]">${tier.price.toFixed(2)} pack total</p>
              </div>
              <div className="shrink-0 text-left sm:text-right">
                <p className="text-lg font-bold tabular-nums text-[#0F172A]">
                  ${tier.perUnit.toFixed(2)}
                  <span className="text-xs font-semibold text-[#64748B]">{unitSuffix}</span>
                </p>
              </div>
            </button>
          )
        })}
      </div>

      <p className="text-2xl font-bold tabular-nums text-[#0F172A]">
        ${selected.perUnit.toFixed(2)}
        <span className="text-base font-semibold text-[#64748B]">{unitSuffix}</span>
      </p>
      <p className="text-sm text-[#64748B]">
        ${selected.price.toFixed(2)} pack total · {selected.tier}
      </p>
    </div>
  )
}
