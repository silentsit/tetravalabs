export const PEPTIDEPAY_ONRAMP_IDS = ["stripe", "paypal", "transak", "topper", "banxa"] as const
export type PeptidepayOnrampId = (typeof PEPTIDEPAY_ONRAMP_IDS)[number]

export type PeptidepayOnrampNotice = "account_kyc"

export type PeptidepayOnrampOption = {
  id: PeptidepayOnrampId
  label: string
  minUsd: number
  description: string
  notice?: PeptidepayOnrampNotice
}

/** Shown to every shopper, in this order. Shipping country does not hide rails. */
export const PEPTIDEPAY_ONRAMPS: PeptidepayOnrampOption[] = [
  {
    id: "stripe",
    label: "Stripe",
    minUsd: 2,
    description: "Card checkout."
  },
  {
    id: "paypal",
    label: "PayPal",
    minUsd: 5,
    description: "Pay with a PayPal account, or pay by card."
  },
  {
    id: "transak",
    label: "Transak",
    minUsd: 15,
    description: "Card checkout.",
    notice: "account_kyc"
  },
  {
    id: "topper",
    label: "Topper",
    minUsd: 10,
    description: "Card checkout.",
    notice: "account_kyc"
  },
  {
    id: "banxa",
    label: "Banxa",
    minUsd: 10,
    description: "Card checkout.",
    notice: "account_kyc"
  }
]

export function peptidepayOnrampNoticeText(option: PeptidepayOnrampOption): string | null {
  if (option.notice === "account_kyc") {
    return `Requires a ${option.label} account and simple KYC (3 min).`
  }
  return null
}

export function isPeptidepayOnrampId(value: unknown): value is PeptidepayOnrampId {
  return typeof value === "string" && (PEPTIDEPAY_ONRAMP_IDS as readonly string[]).includes(value)
}

export function isUsShippingCountry(country: string | undefined | null): boolean {
  return (country || "").trim().toUpperCase() === "US"
}

export function peptidepayOnrampEligible(option: PeptidepayOnrampOption, amountUsd: number): boolean {
  return amountUsd + 1e-9 >= option.minUsd
}

export function visiblePeptidepayOnramps(): PeptidepayOnrampOption[] {
  return PEPTIDEPAY_ONRAMPS
}

export function listEligiblePeptidepayOnramps(amountUsd: number) {
  return PEPTIDEPAY_ONRAMPS.filter((option) => peptidepayOnrampEligible(option, amountUsd))
}

export function defaultPeptidepayOnramp(country: string, amountUsd: number): PeptidepayOnrampId | null {
  const eligible = listEligiblePeptidepayOnramps(amountUsd)
  if (!eligible.length) return null
  if (isUsShippingCountry(country)) {
    return (
      eligible.find((option) => option.id === "stripe")?.id ||
      eligible.find((option) => option.id === "paypal")?.id ||
      eligible[0].id
    )
  }
  return (
    eligible.find((option) => option.id === "transak")?.id ||
    eligible.find((option) => option.id === "topper")?.id ||
    eligible.find((option) => option.id === "banxa")?.id ||
    eligible.find((option) => option.id === "stripe")?.id ||
    eligible[0].id
  )
}

export function resolvePeptidepayOnramp(input: {
  requested?: string | null
  country: string
  amountUsd: number
}): { ok: true; provider: PeptidepayOnrampId } | { ok: false; error: string } {
  const requested = input.requested?.trim().toLowerCase() || ""
  if (requested) {
    if (!isPeptidepayOnrampId(requested)) {
      return { ok: false, error: "Choose a supported card processor." }
    }
    const option = PEPTIDEPAY_ONRAMPS.find((entry) => entry.id === requested)
    if (!option) {
      return { ok: false, error: "Choose a supported card processor." }
    }
    if (!peptidepayOnrampEligible(option, input.amountUsd)) {
      return {
        ok: false,
        error: `${option.label} requires a minimum order of $${option.minUsd.toFixed(0)}. Choose another card processor or pay with cryptocurrency.`
      }
    }
    return { ok: true, provider: requested }
  }

  const fallback = defaultPeptidepayOnramp(input.country, input.amountUsd)
  if (!fallback) {
    return {
      ok: false,
      error:
        "No card processor is available for this order total. Pay with cryptocurrency, or increase the order total."
    }
  }
  return { ok: true, provider: fallback }
}

export function restockShippingCountry(shippingAddress: Record<string, unknown> | null | undefined): string {
  const ship = shippingAddress || {}
  const raw =
    (typeof ship.country_code === "string" && ship.country_code) ||
    (typeof ship.country === "string" && ship.country) ||
    "US"
  return raw.trim().toUpperCase()
}
