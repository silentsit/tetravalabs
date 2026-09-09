import { resolveShippingUsd } from "@/lib/checkout-shipping"

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://tetravalabs.com").replace(/\/$/, "")

export const ORGANIZATION_ID = `${SITE_URL}#organization`
export const WEBSITE_ID = `${SITE_URL}#website`
export const MERCHANT_RETURN_POLICY_ID = `${SITE_URL}/refund#policy`
export const SHIPPING_SERVICE_ID = `${SITE_URL}/shipping#policy`

/** ISO countries named on /shipping for the 2–7 business-day window. */
const TRANSIT_2_7 = ["US", "CA", "GB", "AU"] as const

/** South-East Asia window on /shipping: 2–4 business days. */
const TRANSIT_2_4 = ["BN", "KH", "ID", "LA", "MM", "MY", "PH", "SG", "TH", "TL", "VN"] as const

/**
 * Rest-of-world window on /shipping: 5–11 business days.
 * Google caps return-policy country lists at 50; this is the documented remainder,
 * not every checkout country.
 */
const TRANSIT_5_11 = [
  "AE",
  "AR",
  "AT",
  "BE",
  "BR",
  "CH",
  "CL",
  "CZ",
  "DE",
  "DK",
  "ES",
  "FI",
  "FR",
  "GR",
  "HK",
  "HU",
  "IE",
  "IL",
  "IN",
  "IT",
  "JP",
  "KR",
  "MX",
  "NL",
  "NO",
  "NZ",
  "PL",
  "PT",
  "SE",
  "TW",
  "ZA"
] as const

type TransitWindow = {
  countries: readonly string[]
  minTransitDays: number
  maxTransitDays: number
}

const SHIPPING_WINDOWS: TransitWindow[] = [
  { countries: TRANSIT_2_7, minTransitDays: 2, maxTransitDays: 7 },
  { countries: TRANSIT_2_4, minTransitDays: 2, maxTransitDays: 4 },
  { countries: TRANSIT_5_11, minTransitDays: 5, maxTransitDays: 11 }
]

export const MERCHANT_LISTING_COUNTRIES = [
  ...TRANSIT_2_7,
  ...TRANSIT_2_4,
  ...TRANSIT_5_11
]

function definedRegion(countries: readonly string[]) {
  return {
    "@type": "DefinedRegion",
    addressCountry: [...countries]
  }
}

function deliveryTime(minTransitDays: number, maxTransitDays: number) {
  return {
    "@type": "ShippingDeliveryTime",
    handlingTime: {
      "@type": "QuantitativeValue",
      minValue: 0,
      maxValue: 1,
      unitCode: "DAY"
    },
    transitTime: {
      "@type": "QuantitativeValue",
      minValue: minTransitDays,
      maxValue: maxTransitDays,
      unitCode: "DAY"
    }
  }
}

function freeShippingRate() {
  return {
    "@type": "MonetaryAmount",
    value: resolveShippingUsd().toFixed(2),
    currency: "USD"
  }
}

/** Matches /refund: peptides are not restocked; change-of-mind returns are not accepted. */
export function merchantReturnPolicyJsonLd() {
  return {
    "@type": "MerchantReturnPolicy",
    "@id": MERCHANT_RETURN_POLICY_ID,
    applicableCountry: [...MERCHANT_LISTING_COUNTRIES],
    returnPolicyCountry: "US",
    returnPolicyCategory: "https://schema.org/MerchantReturnNotPermitted",
    merchantReturnLink: `${SITE_URL}/refund`
  }
}

/**
 * Free standard shipping (resolveShippingUsd). Transit windows match /shipping.
 * Handling is same-day / next-day (orders process within 12 hours of payment).
 */
export function offerShippingDetailsJsonLd() {
  return SHIPPING_WINDOWS.map((window) => ({
    "@type": "OfferShippingDetails",
    shippingRate: freeShippingRate(),
    shippingDestination: definedRegion(window.countries),
    deliveryTime: deliveryTime(window.minTransitDays, window.maxTransitDays)
  }))
}

/** Organization-level shipping policy (Google merchant knowledge panel, Nov 2025+). */
export function shippingServiceJsonLd() {
  return {
    "@type": "ShippingService",
    "@id": SHIPPING_SERVICE_ID,
    name: "Free worldwide cold-chain shipping",
    description:
      "Free shipping on all orders where checkout is available. USA, Canada, Australia, and the UK: 2-7 business days. South-East Asia: 2-4 business days. Rest of world: 5-11 business days. Some destinations are restricted.",
    fulfillmentType: "https://schema.org/FulfillmentTypeDelivery",
    shippingConditions: SHIPPING_WINDOWS.map((window) => ({
      "@type": "ShippingConditions",
      shippingOrigin: definedRegion(["US"]),
      shippingDestination: definedRegion(window.countries),
      shippingRate: freeShippingRate()
    }))
  }
}

export function merchantOfferFields() {
  return {
    shippingDetails: offerShippingDetailsJsonLd(),
    hasMerchantReturnPolicy: { "@id": MERCHANT_RETURN_POLICY_ID }
  }
}

export function variantSizeLabel(strengthLabel: string, packTitle: string) {
  const strength = strengthLabel.trim()
  const pack = packTitle.trim() || "1 vial"
  if (!strength || strength.toLowerCase() === "standard") return pack
  return `${strength} · ${pack}`
}
