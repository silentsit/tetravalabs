import { getCheckoutSubdivisions } from "@/lib/checkout-subdivisions"

export const CHECKOUT_US_STATES = getCheckoutSubdivisions("US")

export function normalizeUsStateCode(value: string): string {
  const trimmed = value.trim()
  if (!trimmed) return ""

  const upper = trimmed.toUpperCase()
  const byCode = CHECKOUT_US_STATES.find((state) => state.code === upper)
  if (byCode) return byCode.code

  const byName = CHECKOUT_US_STATES.find(
    (state) => state.name.toLowerCase() === trimmed.toLowerCase()
  )
  return byName?.code ?? upper
}
