"use client"

import {
  LAB_RESTOCK_CADENCES,
  LAB_RESTOCK_COPY,
  LAB_RESTOCK_DISCOUNT_PCT,
  type FulfillmentMode,
  type LabRestockCadenceDays
} from "@/lib/lab-restock"

type Props = {
  fulfillment: FulfillmentMode
  cadenceDays: LabRestockCadenceDays
  onFulfillmentChange: (mode: FulfillmentMode) => void
  onCadenceChange: (days: LabRestockCadenceDays) => void
  oneTimePrice: number
  restockPrice: number
  savingsUsd: number
  perUnitLabel?: string
}

export function LabRestockSelector({
  fulfillment,
  cadenceDays,
  onFulfillmentChange,
  onCadenceChange,
  oneTimePrice,
  restockPrice,
  savingsUsd,
  perUnitLabel
}: Props) {
  const isRestock = fulfillment === "lab_restock"
  const saveLine = LAB_RESTOCK_COPY.saveVsOneTime(savingsUsd)

  return (
    <div className="space-y-3">
      <h2 className="font-serif text-lg text-[color:var(--color-text)]">
        {LAB_RESTOCK_COPY.modeLabel}
      </h2>

      <div className="grid gap-2 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => onFulfillmentChange("one_time")}
          aria-pressed={!isRestock}
          className={`rounded-xl border px-4 py-3 text-left transition ${
            !isRestock
              ? "border-[color:var(--color-teal)] bg-[#F0FDFA] ring-1 ring-[color:var(--color-teal)]"
              : "border-[color:var(--color-border)] hover:border-[color:var(--color-teal)]"
          }`}
        >
          <p className="text-sm font-semibold text-[color:var(--color-text)]">
            {LAB_RESTOCK_COPY.oneTimeLabel}
          </p>
          <p className="mt-1 text-lg font-bold tabular-nums text-[color:var(--color-text)]">
            ${oneTimePrice.toFixed(2)}
          </p>
          {perUnitLabel ? (
            <p className="mt-0.5 text-xs text-[color:var(--color-text-secondary)]">{perUnitLabel}</p>
          ) : null}
        </button>

        <button
          type="button"
          onClick={() => onFulfillmentChange("lab_restock")}
          aria-pressed={isRestock}
          className={`rounded-xl border px-4 py-3 text-left transition ${
            isRestock
              ? "border-[color:var(--color-teal)] bg-[#F0FDFA] ring-1 ring-[color:var(--color-teal)]"
              : "border-[color:var(--color-border)] hover:border-[color:var(--color-teal)]"
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold text-[color:var(--color-text)]">
              {LAB_RESTOCK_COPY.restockLabel}
            </p>
            <span className="rounded-full bg-[#CCFBF1] px-2 py-0.5 font-mono text-[10px] font-semibold text-[#0F766E]">
              {LAB_RESTOCK_COPY.restockBadge}
            </span>
          </div>
          <p className="mt-1 text-lg font-bold tabular-nums text-[color:var(--color-text)]">
            ${restockPrice.toFixed(2)}
          </p>
          <p className="mt-0.5 text-xs text-[color:var(--color-text-secondary)]">
            <span className="line-through tabular-nums text-[#94A3B8]">
              ${oneTimePrice.toFixed(2)}
            </span>
            {perUnitLabel ? ` · ${perUnitLabel}` : null}
          </p>
        </button>
      </div>

      {isRestock ? (
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-[color:var(--color-text-secondary)]">
            {LAB_RESTOCK_COPY.cadenceLabel}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {LAB_RESTOCK_CADENCES.map((days) => {
              const active = cadenceDays === days
              return (
                <button
                  key={days}
                  type="button"
                  onClick={() => onCadenceChange(days)}
                  aria-pressed={active}
                  className={`rounded-lg border px-3 py-2 font-mono text-xs font-medium transition ${
                    active
                      ? "border-[color:var(--color-teal)] bg-[#CCFBF1] text-[#0F766E]"
                      : "border-[color:var(--color-border)] text-[color:var(--color-text-secondary)] hover:border-[color:var(--color-teal)]"
                  }`}
                >
                  {days} {LAB_RESTOCK_COPY.cadenceSuffix}
                </button>
              )
            })}
          </div>
          {saveLine ? (
            <p className="mt-2 text-sm font-medium text-[#0F766E]">{saveLine}</p>
          ) : null}
          <ul className="mt-2 space-y-1 text-xs text-[color:var(--color-text-secondary)]">
            {LAB_RESTOCK_COPY.perks.map((perk) => (
              <li key={perk} className="flex gap-2">
                <span className="text-[color:var(--color-teal)]" aria-hidden>
                  ✓
                </span>
                <span>{perk}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <p className="text-xs text-[color:var(--color-text-secondary)]">{LAB_RESTOCK_COPY.micro}</p>
      <p className="text-[11px] text-[#94A3B8]">{LAB_RESTOCK_COPY.ruoNote}</p>
      <p className="sr-only">
        Peptide Refill discount is {LAB_RESTOCK_DISCOUNT_PCT} percent off the one-time pack price.
      </p>
    </div>
  )
}
