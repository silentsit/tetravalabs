import generated from "@/lib/checkout-subdivisions.json"

export type CheckoutSubdivision = { code: string; name: string }

const GENERATED = generated as Record<string, CheckoutSubdivision[]>

/** WooCommerce leaves GB as free text; keep a UK nation select. */
const GB_COUNTRIES: CheckoutSubdivision[] = [
  { code: "ENG", name: "England" },
  { code: "NIR", name: "Northern Ireland" },
  { code: "SCT", name: "Scotland" },
  { code: "WLS", name: "Wales" }
]

export function getCheckoutSubdivisions(countryCode: string): CheckoutSubdivision[] {
  const code = countryCode.trim().toUpperCase()
  if (code === "GB") return GB_COUNTRIES
  return GENERATED[code] || []
}

export function getSubdivisionLabel(countryCode: string) {
  switch (countryCode.trim().toUpperCase()) {
    case "US":
    case "MX":
    case "IN":
    case "BR":
    case "DE":
      return "State"
    case "CA":
    case "TH":
    case "ID":
    case "CN":
      return "Province"
    case "AU":
      return "State / territory"
    case "GB":
      return "Country"
    case "JP":
      return "Prefecture"
    default:
      return "State / province"
  }
}

export function getSubdivisionPlaceholder(countryCode: string) {
  switch (countryCode.trim().toUpperCase()) {
    case "US":
    case "MX":
    case "IN":
    case "BR":
    case "DE":
      return "Select a state"
    case "CA":
    case "TH":
    case "ID":
    case "CN":
      return "Select a province"
    case "AU":
      return "Select a state / territory"
    case "GB":
      return "Select a country"
    case "JP":
      return "Select a prefecture"
    default:
      return "Select a state / province"
  }
}

export function getPostalLabel(countryCode: string) {
  switch (countryCode.trim().toUpperCase()) {
    case "US":
      return "ZIP code"
    case "GB":
      return "Postcode"
    default:
      return "Postal code"
  }
}

export function isValidSubdivision(countryCode: string, value: string) {
  const subdivisions = getCheckoutSubdivisions(countryCode)
  if (!subdivisions.length) return true
  const normalized = value.trim().toLowerCase()
  return subdivisions.some(
    (entry) =>
      entry.code.toLowerCase() === normalized || entry.name.toLowerCase() === normalized
  )
}

export function normalizeSubdivision(countryCode: string, value: string) {
  const trimmed = value.trim()
  if (!trimmed) return ""
  const subdivisions = getCheckoutSubdivisions(countryCode)
  if (!subdivisions.length) return trimmed
  const upper = trimmed.toUpperCase()
  const byCode = subdivisions.find((entry) => entry.code.toUpperCase() === upper)
  if (byCode) return byCode.code
  const byName = subdivisions.find((entry) => entry.name.toLowerCase() === trimmed.toLowerCase())
  return byName?.code ?? trimmed
}

export function resolveSubdivisionSelectValue(countryCode: string, value: string) {
  const normalized = normalizeSubdivision(countryCode, value)
  return getCheckoutSubdivisions(countryCode).some((entry) => entry.code === normalized)
    ? normalized
    : ""
}

export function formatSubdivisionDisplay(countryCode: string, value: string) {
  const trimmed = value.trim()
  if (!trimmed) return ""
  const subdivisions = getCheckoutSubdivisions(countryCode)
  if (!subdivisions.length) return trimmed
  const normalized = trimmed.toLowerCase()
  const match = subdivisions.find(
    (entry) =>
      entry.code.toLowerCase() === normalized || entry.name.toLowerCase() === normalized
  )
  return match?.name ?? trimmed
}
