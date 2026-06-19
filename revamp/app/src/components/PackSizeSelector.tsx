import { useMemo, useState } from "react"
import type { PackTier } from "@/data/pack-pricing"

type Props = {
  tiers: PackTier[]
  unitLabel?: "vial" | "unit"
  onChange?: (tier: PackTier) => void
}

export default function PackSizeSelector({ tiers, unitLabel = "vial", onChange }: Props) {
  const [selectedQty, setSelectedQty] = useState(tiers[0]?.qty || 5)
  const selected = useMemo(
    () => tiers.find((tier) => tier.qty === selectedQty) || tiers[0],
    [selectedQty, tiers]
  )

  if (!selected) return null

  const unitSuffix = unitLabel === "vial" ? "/vial" : "/unit"
  const prices = tiers.map((tier) => tier.price)
  const priceRange =
    prices.length > 1
      ? `$${Math.min(...prices).toFixed(2)} – $${Math.max(...prices).toFixed(2)}`
      : `$${selected.price.toFixed(2)}`

  const pickTier = (tier: PackTier) => {
    setSelectedQty(tier.qty)
    onChange?.(tier)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="mb-2 block text-sm font-medium text-[#475569]">Choose pack size</span>
          <p className="text-xs text-[#94A3B8]">Economy-of-scale pricing on multi-vial packs</p>
        </div>
        <p className="text-sm font-medium text-[#475569]">{priceRange}</p>
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
              className={`flex w-full items-center gap-4 rounded-xl border px-4 py-4 text-left transition ${
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
              <div className="min-w-0 flex-1">
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
                <p className="mt-1 font-mono text-xs text-[#64748B]">
                  ${tier.perUnit.toFixed(2)}
                  {unitSuffix}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-[#0F172A]">${tier.price.toFixed(2)}</p>
              </div>
            </button>
          )
        })}
      </div>

      <p className="text-2xl font-bold text-[#0F172A]">${selected.price.toFixed(2)}</p>
      <p className="text-sm text-[#64748B]">
        ${selected.perUnit.toFixed(2)}
        {unitSuffix} · {selected.tier}
      </p>
    </div>
  )
}

export function useSelectedPackTier(tiers: PackTier[]) {
  const [selectedQty, setSelectedQty] = useState(tiers[0]?.qty || 1)
  const selected = tiers.find((tier) => tier.qty === selectedQty) || tiers[0]
  return { selected, setSelectedQty }
}
