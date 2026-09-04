import type { CompoundStrengthOption } from "@/lib/compound-product"
import { getVariantPriceCents } from "@/lib/product-price"

type Props = {
  displayName: string
  categoryLabel: string
  researchSummary?: string
  selectedStrength: CompoundStrengthOption
}

const BENEFITS: Array<{ lead: string; rest: string }> = [
  { lead: "FREE", rest: " express shipping on all orders" },
  { lead: "Guaranteed", rest: " delivery worldwide" },
  { lead: "Secure", rest: " payment via credit card or crypto" },
  { lead: "Save", rest: " up to 20% on bulk orders" }
]

function pricesForStrength(strength: CompoundStrengthOption): number[] {
  if (strength.packTiers.length) {
    return strength.packTiers.map((tier) => tier.price).filter((n) => n > 0)
  }
  return strength.variants
    .map((variant) => getVariantPriceCents(variant) / 100)
    .filter((n) => n > 0)
}

export function formatUsdRange(amounts: number[]): string | null {
  if (!amounts.length) return null
  const min = Math.min(...amounts)
  const max = Math.max(...amounts)
  const fmt = (n: number) =>
    n.toLocaleString("en-US", { style: "currency", currency: "USD" })
  if (min === max) return fmt(min)
  return `${fmt(min)} – ${fmt(max)}`
}

/** First 1–2 sentences of research copy, capped for the PDP hero. */
export function shortProductWriteup(
  researchSummary: string | undefined,
  displayName: string,
  categoryLabel: string
): string {
  const firstBlock = String(researchSummary || "")
    .split(/\n\n/)[0]
    ?.trim()

  if (firstBlock) {
    const sentences = firstBlock.match(/[^.!?]+[.!?]+/g)
    if (sentences?.length) {
      return sentences.slice(0, 2).join(" ").trim()
    }
    if (firstBlock.length <= 220) return firstBlock
    return `${firstBlock.slice(0, 217).trim()}…`
  }

  return `${displayName} is a research-grade compound in the ${categoryLabel} category, supplied for laboratory use with lot-linked documentation when available.`
}

export function ProductOfferSummary({
  displayName,
  categoryLabel,
  researchSummary,
  selectedStrength
}: Props) {
  const priceLabel = formatUsdRange(pricesForStrength(selectedStrength))
  const writeup = shortProductWriteup(researchSummary, displayName, categoryLabel)

  return (
    <div className="space-y-4">
      {priceLabel ? (
        <p className="text-2xl font-bold tabular-nums tracking-tight text-[color:var(--color-text)] sm:text-[1.65rem]">
          {priceLabel}
        </p>
      ) : null}

      <p className="max-w-xl text-[16px] leading-relaxed text-[#475569]">{writeup}</p>

      <ul className="space-y-1.5 text-[16px] leading-snug text-[#334155]">
        {BENEFITS.map((item) => (
          <li key={item.lead}>
            <span className="text-[#94A3B8]" aria-hidden>
              —{" "}
            </span>
            <strong className="font-semibold text-[color:var(--color-text)]">{item.lead}</strong>
            {item.rest}
          </li>
        ))}
      </ul>

      <p className="text-sm italic text-[#94A3B8]">
        24-hour customer support via email &amp; Telegram
      </p>
    </div>
  )
}
