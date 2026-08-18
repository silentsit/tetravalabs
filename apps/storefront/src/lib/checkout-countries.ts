/** ISO 3166-1 alpha-2 destinations shown at checkout. */
import worldCountries from "./world-countries.json"

export type CheckoutCountry = { code: string; name: string }

export const CHECKOUT_COUNTRIES: CheckoutCountry[] = [...worldCountries].sort((a, b) => {
  if (a.code === "US") return -1
  if (b.code === "US") return 1
  return a.name.localeCompare(b.name)
})

export function isCheckoutCountry(code: string) {
  const normalized = code.trim().toUpperCase()
  return CHECKOUT_COUNTRIES.some((entry) => entry.code === normalized)
}
