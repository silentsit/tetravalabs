import { resolveShippingUsd } from "@/lib/checkout-shipping"

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://tetravalabs.com").replace(/\/$/, "")

export const MERCHANT_RETURN_POLICY_ID = `${SITE_URL}/refund#policy`

/** Matches /refund: peptides are not restocked; change-of-mind returns are not accepted. */
export function merchantReturnPolicyJsonLd() {
  return {
    "@type": "MerchantReturnPolicy",
    "@id": MERCHANT_RETURN_POLICY_ID,
    applicableCountry: ["US", "CA", "GB", "AU"],
    returnPolicyCategory: "https://schema.org/MerchantReturnNotPermitted",
    merchantReturnLink: `${SITE_URL}/refund`
  }
}

/**
 * Free standard shipping on all orders (resolveShippingUsd).
 * Transit windows match /shipping for USA, Canada, Australia, and UK (2–7 business days).
 * Handling is same-day / next-day (orders process within 12 hours of payment).
 */
export function offerShippingDetailsJsonLd() {
  return {
    "@type": "OfferShippingDetails",
    shippingRate: {
      "@type": "MonetaryAmount",
      value: resolveShippingUsd().toFixed(2),
      currency: "USD"
    },
    shippingDestination: {
      "@type": "DefinedRegion",
      addressCountry: ["US", "CA", "GB", "AU"]
    },
    deliveryTime: {
      "@type": "ShippingDeliveryTime",
      handlingTime: {
        "@type": "QuantitativeValue",
        minValue: 0,
        maxValue: 1,
        unitCode: "DAY"
      },
      transitTime: {
        "@type": "QuantitativeValue",
        minValue: 2,
        maxValue: 7,
        unitCode: "DAY"
      }
    }
  }
}

export function variantSizeLabel(strengthLabel: string, packTitle: string) {
  const strength = strengthLabel.trim()
  const pack = packTitle.trim() || "1 vial"
  if (!strength || strength.toLowerCase() === "standard") return pack
  return `${strength} · ${pack}`
}
