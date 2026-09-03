export const PEPTIDEPAY_ONRAMP_IDS = ["stripe", "paypal", "transak", "topper", "banxa"] as const
export type PeptidepayOnrampId = (typeof PEPTIDEPAY_ONRAMP_IDS)[number]

export type PeptidepayOnrampMethod = "visa" | "mastercard" | "applepay"
export type PeptidepayOnrampIdCheck = "none" | "quick" | "standard"

export type PeptidepayOnrampOption = {
  id: PeptidepayOnrampId
  label: string
  minUsd: number
  description: string
  methods: PeptidepayOnrampMethod[]
  idCheck: PeptidepayOnrampIdCheck
  eta: string
  /** Peptide Pay GET /providers restrictedTo. Missing = worldwide. */
  restrictedTo?: string[]
}

/** Shown to every shopper, in this order. Shipping country does not hide rails. */
export const PEPTIDEPAY_ONRAMPS: PeptidepayOnrampOption[] = [
  {
    id: "stripe",
    label: "Stripe",
    minUsd: 2,
    description: "Pay by card or Apple Pay (~2 min)",
    methods: ["visa", "mastercard", "applepay"],
    idCheck: "none",
    eta: "~2 min",
    restrictedTo: ["US"]
  },
  {
    id: "paypal",
    label: "PayPal",
    minUsd: 5,
    description: "Pay with PayPal (~2 min)",
    methods: [],
    idCheck: "none",
    eta: "~2 min",
    restrictedTo: ["US"]
  },
  {
    id: "transak",
    label: "Transak",
    minUsd: 15,
    description: "Pay by card or Apple Pay (~2 min)",
    methods: ["visa", "mastercard", "applepay"],
    idCheck: "quick",
    eta: "~2 min"
  },
  {
    id: "topper",
    label: "Topper",
    minUsd: 10,
    description: "Pay by card or Apple Pay (~2 min)",
    methods: ["visa", "mastercard", "applepay"],
    idCheck: "quick",
    eta: "~2 min"
  },
  {
    id: "banxa",
    label: "Banxa",
    minUsd: 10,
    description: "Pay by card or Apple Pay (~3 min)",
    methods: ["visa", "mastercard", "applepay"],
    idCheck: "standard",
    eta: "~3 min"
  }
]

export function isPeptidepayOnrampId(value: unknown): value is PeptidepayOnrampId {
  return typeof value === "string" && (PEPTIDEPAY_ONRAMP_IDS as readonly string[]).includes(value)
}

export function getPeptidepayOnramp(id: string | null | undefined): PeptidepayOnrampOption | undefined {
  if (!isPeptidepayOnrampId(id)) return undefined
  return PEPTIDEPAY_ONRAMPS.find((entry) => entry.id === id)
}

export function isUsShippingCountry(country: string | undefined | null): boolean {
  return (country || "").trim().toUpperCase() === "US"
}

export function peptidepayBuyerIpCountry(value: unknown): string | null {
  const code = typeof value === "string" ? value.trim().toUpperCase() : ""
  if (!code || code === "XX" || code === "T1") return null
  return code
}

export function peptidepayOnrampEligible(option: PeptidepayOnrampOption, amountUsd: number): boolean {
  return amountUsd + 1e-9 >= option.minUsd
}

/** Peptide Pay pins Stripe/PayPal to buyer IP, not shipping country. Unknown IP is not blocked. */
export function peptidepayOnrampAvailableForIp(
  option: PeptidepayOnrampOption,
  ipCountry: string | null | undefined
): boolean {
  if (!option.restrictedTo?.length) return true
  if (!ipCountry) return true
  return option.restrictedTo.includes(ipCountry)
}

export function peptidepayOnrampLocationError(option: PeptidepayOnrampOption): string {
  return `${option.label} is not available from your location. Choose Transak, Topper, or Banxa.`
}

export function visiblePeptidepayOnramps(): PeptidepayOnrampOption[] {
  return PEPTIDEPAY_ONRAMPS
}

export function listEligiblePeptidepayOnramps(amountUsd: number, ipCountry?: string | null) {
  return PEPTIDEPAY_ONRAMPS.filter(
    (option) =>
      peptidepayOnrampEligible(option, amountUsd) && peptidepayOnrampAvailableForIp(option, ipCountry)
  )
}

export function defaultPeptidepayOnramp(
  country: string,
  amountUsd: number,
  ipCountry?: string | null
): PeptidepayOnrampId | null {
  const eligible = listEligiblePeptidepayOnramps(amountUsd, ipCountry)
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
  ipCountry?: string | null
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
    if (!peptidepayOnrampAvailableForIp(option, input.ipCountry)) {
      return { ok: false, error: peptidepayOnrampLocationError(option) }
    }
    if (!peptidepayOnrampEligible(option, input.amountUsd)) {
      return {
        ok: false,
        error: `${option.label} requires a minimum order of $${option.minUsd.toFixed(0)}. Choose another card processor or pay with cryptocurrency.`
      }
    }
    return { ok: true, provider: requested }
  }

  const fallback = defaultPeptidepayOnramp(input.country, input.amountUsd, input.ipCountry)
  if (!fallback) {
    return {
      ok: false,
      error:
        "No card processor is available for this order total. Pay with cryptocurrency, or increase the order total."
    }
  }
  return { ok: true, provider: fallback }
}
