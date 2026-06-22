import type { ShelfPriceDisplay } from "@/lib/pack-pricing"

type Props = {
  shelf: ShelfPriceDisplay
  variant?: "shop" | "default" | "search"
}

export function ShelfPriceLabel({ shelf, variant = "shop" }: Props) {
  const amountClass =
    variant === "shop"
      ? "text-[13px] font-bold tabular-nums text-[#0D9488]"
      : variant === "search"
        ? "text-sm font-bold tabular-nums text-[#0D9488]"
        : "text-base font-bold tabular-nums text-[#0F172A]"

  const suffixClass =
    variant === "shop"
      ? "text-[11px] font-semibold text-[#64748B]"
      : "text-xs font-semibold text-[#64748B]"

  const detailClass =
    variant === "shop"
      ? "mt-0.5 text-[10px] font-medium text-[#94A3B8]"
      : "mt-0.5 text-[11px] font-medium text-[#94A3B8]"

  return (
    <div>
      <p className={amountClass}>
        {shelf.unitAmount}
        {shelf.unitSuffix ? <span className={suffixClass}> {shelf.unitSuffix}</span> : null}
      </p>
      {shelf.detail ? <p className={detailClass}>{shelf.detail}</p> : null}
    </div>
  )
}
