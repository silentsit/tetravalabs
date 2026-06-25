"use client"

import Link from "next/link"
import { FormEvent, useEffect, useMemo, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { Bitcoin, CreditCard } from "lucide-react"
import { useCart } from "@/components/cart-provider"
import { readAuthToken, retrieveCustomer } from "@/lib/medusa-auth"
import { getMedusaStoreHeaders } from "@/lib/medusa-headers"
import {
  CHECKOUT_CRYPTO_CATALOG,
  loadCheckoutPaymentOptions,
  type CheckoutCryptoOption
} from "@/lib/checkout-payment-options"
import { CHECKOUT_COUNTRIES } from "@/lib/checkout-countries"
import { CHECKOUT_US_STATES, normalizeUsStateCode } from "@/lib/checkout-us-states"
import { getProductImage } from "@/lib/product-image-map"
import { storePaymentUrl } from "@/components/payment-confirmation"
import { AddressAutocompleteInput } from "@/components/address-autocomplete-input"
import type { ParsedAddress } from "@/lib/google-places"

type CheckoutOrder = {
  id: string
  display_id?: number
  created_at: string
  email: string
  shipping_country: string
  total: number
  items: Array<{
    title: string
    variantTitle: string
    quantity: number
    unitPrice: number
  }>
}

type PaymentMethod = "card" | "crypto"

const ORDERS_KEY = "tetrava_orders_v1"
const DEFAULT_SHIPPING_USD = 15
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const US_ZIP_PATTERN = /^\d{5}(-\d{4})?$/
const PHONE_PATTERN = /^[\d\s()+\-.]{7,}$/

type AddressFieldKey =
  | "firstName"
  | "lastName"
  | "email"
  | "address1"
  | "city"
  | "province"
  | "postalCode"
  | "phone"
  | "country"

type AddressFieldErrors = Partial<Record<AddressFieldKey, string>>

type AddressValues = {
  firstName: string
  lastName: string
  email?: string
  address1: string
  city: string
  province: string
  postalCode: string
  phone: string
  country: string
}

function inputFieldClass(hasError: boolean) {
  return hasError
    ? "input-field border-red-400 focus:border-red-500 focus:ring-red-500/20"
    : "input-field"
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null
  return (
    <p id={id} className="mt-1.5 text-xs text-red-600" role="alert">
      {message}
    </p>
  )
}

function validateAddress(values: AddressValues, options?: { requireEmail?: boolean }): AddressFieldErrors {
  const errors: AddressFieldErrors = {}

  if (!values.firstName.trim()) errors.firstName = "First name is required."
  if (!values.lastName.trim()) errors.lastName = "Last name is required."

  if (options?.requireEmail) {
    const email = values.email?.trim() || ""
    if (!email) errors.email = "Email is required."
    else if (!EMAIL_PATTERN.test(email)) errors.email = "Enter a valid email address."
  }

  if (!values.address1.trim()) errors.address1 = "Street address is required."
  if (!values.city.trim()) errors.city = "Town / city is required."

  const country = values.country.trim().toUpperCase()
  if (!country) errors.country = "Country is required."

  if (country === "US") {
    if (!values.province.trim()) errors.province = "State is required."
    else if (!CHECKOUT_US_STATES.some((state) => state.code === values.province)) {
      errors.province = "Select a valid US state."
    }

    const postal = values.postalCode.trim()
    if (!postal) errors.postalCode = "ZIP code is required."
    else if (!US_ZIP_PATTERN.test(postal)) errors.postalCode = "Enter a valid US ZIP code."
  } else if (!values.postalCode.trim()) {
    errors.postalCode = "Postal code is required."
  }

  const phone = values.phone.trim()
  if (phone && !PHONE_PATTERN.test(phone)) {
    errors.phone = "Enter a valid phone number."
  }

  return errors
}

function validateAddressField(field: AddressFieldKey, values: AddressValues, requireEmail = false): string | undefined {
  return validateAddress(values, { requireEmail })[field]
}

function firstInvalidFieldId(payload: {
  billing: AddressFieldErrors
  shipping: AddressFieldErrors
  ruoAck?: string
  shipToDifferent: boolean
}): string | null {
  const billingOrder: Array<{ field: AddressFieldKey; id: string }> = [
    { field: "firstName", id: "billing-first-name" },
    { field: "lastName", id: "billing-last-name" },
    { field: "email", id: "billing-email" },
    { field: "country", id: "billing-country" },
    { field: "address1", id: "billing-address1" },
    { field: "city", id: "billing-city" },
    { field: "province", id: "billing-province" },
    { field: "postalCode", id: "billing-postal" },
    { field: "phone", id: "billing-phone" }
  ]

  for (const entry of billingOrder) {
    if (payload.billing[entry.field]) return entry.id
  }

  if (payload.shipToDifferent) {
    const shippingOrder = billingOrder
      .filter((entry) => entry.field !== "email")
      .map((entry) => ({
        field: entry.field,
        id: entry.id.replace("billing-", "shipping-")
      }))

    for (const entry of shippingOrder) {
      if (payload.shipping[entry.field]) return entry.id
    }
  }

  if (payload.ruoAck) return "checkout-ruo-ack"
  return null
}

function methodCardClass(selected: boolean) {
  return [
    "relative flex w-full cursor-pointer items-start gap-3 rounded-lg border p-3 text-left transition-all",
    selected
      ? "border-[#0D9488] bg-white shadow-[0_0_0_1px_#0D9488]"
      : "border-[#E2E8F0] bg-white hover:border-[#CBD5E1]"
  ].join(" ")
}

function FieldLabel({
  htmlFor,
  required,
  children
}: {
  htmlFor: string
  required?: boolean
  children: ReactNode
}) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm text-[#334155]">
      {children}
      {required ? <span className="text-red-500"> *</span> : null}
    </label>
  )
}

type AddressFieldsProps = {
  idPrefix: string
  firstName: string
  setFirstName: (value: string) => void
  lastName: string
  setLastName: (value: string) => void
  company: string
  setCompany: (value: string) => void
  country: string
  setCountry: (value: string) => void
  address1: string
  setAddress1: (value: string) => void
  address2: string
  setAddress2: (value: string) => void
  city: string
  setCity: (value: string) => void
  province: string
  setProvince: (value: string) => void
  postalCode: string
  setPostalCode: (value: string) => void
  phone: string
  setPhone: (value: string) => void
  email?: string
  setEmail?: (value: string) => void
  availableCountries: Array<{ code: string; name: string }>
  showEmail?: boolean
  errors?: AddressFieldErrors
  touched?: Partial<Record<AddressFieldKey, boolean>>
  attemptedSubmit?: boolean
  onFieldBlur?: (field: AddressFieldKey) => void
  onFieldChange?: (field: AddressFieldKey) => void
}

function fieldVisibleError(
  field: AddressFieldKey,
  errors: AddressFieldErrors | undefined,
  touched: Partial<Record<AddressFieldKey, boolean>> | undefined,
  attemptedSubmit: boolean | undefined
) {
  const message = errors?.[field]
  if (!message) return undefined
  if (attemptedSubmit || touched?.[field]) return message
  return undefined
}

function AddressFields({
  idPrefix,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  company,
  setCompany,
  country,
  setCountry,
  address1,
  setAddress1,
  address2,
  setAddress2,
  city,
  setCity,
  province,
  setProvince,
  postalCode,
  setPostalCode,
  phone,
  setPhone,
  email,
  setEmail,
  availableCountries,
  showEmail = false,
  errors,
  touched,
  attemptedSubmit = false,
  onFieldBlur,
  onFieldChange
}: AddressFieldsProps) {
  const isUs = country === "US"

  const showError = (field: AddressFieldKey) =>
    fieldVisibleError(field, errors, touched, attemptedSubmit)

  const errorId = (field: AddressFieldKey) => `${idPrefix}-${field}-error`

  const applyParsedAddress = (parsed: ParsedAddress) => {
    if (parsed.address1) setAddress1(parsed.address1)
    if (parsed.city) setCity(parsed.city)
    if (parsed.province) {
      setProvince(
        parsed.country.toUpperCase() === "US" || country === "US"
          ? normalizeUsStateCode(parsed.province)
          : parsed.province
      )
    }
    if (parsed.postalCode) setPostalCode(parsed.postalCode)
    if (
      parsed.country &&
      availableCountries.some((entry) => entry.code === parsed.country.toUpperCase())
    ) {
      setCountry(parsed.country.toUpperCase())
    }

    onFieldChange?.("address1")
    onFieldChange?.("city")
    onFieldChange?.("province")
    onFieldChange?.("postalCode")
    onFieldChange?.("country")
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <FieldLabel htmlFor={`${idPrefix}-first-name`} required>
            First name
          </FieldLabel>
          <input
            id={`${idPrefix}-first-name`}
            required
            autoComplete="given-name"
            value={firstName}
            onChange={(event) => {
              setFirstName(event.target.value)
              onFieldChange?.("firstName")
            }}
            onBlur={() => onFieldBlur?.("firstName")}
            aria-invalid={Boolean(showError("firstName"))}
            aria-describedby={showError("firstName") ? errorId("firstName") : undefined}
            className={inputFieldClass(Boolean(showError("firstName")))}
          />
          <FieldError id={errorId("firstName")} message={showError("firstName")} />
        </div>
        <div>
          <FieldLabel htmlFor={`${idPrefix}-last-name`} required>
            Last name
          </FieldLabel>
          <input
            id={`${idPrefix}-last-name`}
            required
            autoComplete="family-name"
            value={lastName}
            onChange={(event) => {
              setLastName(event.target.value)
              onFieldChange?.("lastName")
            }}
            onBlur={() => onFieldBlur?.("lastName")}
            aria-invalid={Boolean(showError("lastName"))}
            aria-describedby={showError("lastName") ? errorId("lastName") : undefined}
            className={inputFieldClass(Boolean(showError("lastName")))}
          />
          <FieldError id={errorId("lastName")} message={showError("lastName")} />
        </div>
      </div>

      <div>
        <FieldLabel htmlFor={`${idPrefix}-company`}>Company name (optional)</FieldLabel>
        <input
          id={`${idPrefix}-company`}
          autoComplete="organization"
          value={company}
          onChange={(event) => setCompany(event.target.value)}
          className="input-field"
        />
      </div>

      <div>
        <FieldLabel htmlFor={`${idPrefix}-country`} required>
          Country / Region
        </FieldLabel>
        <select
          id={`${idPrefix}-country`}
          required
          autoComplete="country"
          value={country}
          onChange={(event) => {
            setCountry(event.target.value)
            onFieldChange?.("country")
          }}
          onBlur={() => onFieldBlur?.("country")}
          aria-invalid={Boolean(showError("country"))}
          aria-describedby={showError("country") ? errorId("country") : undefined}
          className={inputFieldClass(Boolean(showError("country")))}
        >
          {availableCountries.map((entry) => (
            <option key={entry.code} value={entry.code}>
              {entry.name}
            </option>
          ))}
        </select>
        <FieldError id={errorId("country")} message={showError("country")} />
      </div>

      <div>
        <FieldLabel htmlFor={`${idPrefix}-address1`} required>
          Street address
        </FieldLabel>
        <AddressAutocompleteInput
          id={`${idPrefix}-address1`}
          required
          placeholder="House number and street name"
          value={address1}
          onChange={(value) => {
            setAddress1(value)
            onFieldChange?.("address1")
          }}
          onAddressSelect={applyParsedAddress}
          onBlur={() => onFieldBlur?.("address1")}
          countryCode={country}
          invalid={Boolean(showError("address1"))}
          className={inputFieldClass(Boolean(showError("address1")))}
          errorId={errorId("address1")}
        />
        <FieldError id={errorId("address1")} message={showError("address1")} />
      </div>

      <div>
        <FieldLabel htmlFor={`${idPrefix}-address2`}>
          Apartment, suite, unit, etc. (optional)
        </FieldLabel>
        <input
          id={`${idPrefix}-address2`}
          autoComplete="address-line2"
          value={address2}
          onChange={(event) => setAddress2(event.target.value)}
          className="input-field"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="sm:col-span-1">
          <FieldLabel htmlFor={`${idPrefix}-city`} required>
            Town / City
          </FieldLabel>
          <input
            id={`${idPrefix}-city`}
            required
            autoComplete="address-level2"
            value={city}
            onChange={(event) => {
              setCity(event.target.value)
              onFieldChange?.("city")
            }}
            onBlur={() => onFieldBlur?.("city")}
            aria-invalid={Boolean(showError("city"))}
            aria-describedby={showError("city") ? errorId("city") : undefined}
            className={inputFieldClass(Boolean(showError("city")))}
          />
          <FieldError id={errorId("city")} message={showError("city")} />
        </div>
        <div className="sm:col-span-1">
          <FieldLabel htmlFor={`${idPrefix}-province`} required={isUs}>
            State
          </FieldLabel>
          {isUs ? (
            <select
              id={`${idPrefix}-province`}
              required
              autoComplete="address-level1"
              value={province}
              onChange={(event) => {
                setProvince(event.target.value)
                onFieldChange?.("province")
              }}
              onBlur={() => onFieldBlur?.("province")}
              aria-invalid={Boolean(showError("province"))}
              aria-describedby={showError("province") ? errorId("province") : undefined}
              className={inputFieldClass(Boolean(showError("province")))}
            >
              <option value="">Select a state</option>
              {CHECKOUT_US_STATES.map((state) => (
                <option key={state.code} value={state.code}>
                  {state.name}
                </option>
              ))}
            </select>
          ) : (
            <input
              id={`${idPrefix}-province`}
              autoComplete="address-level1"
              value={province}
              onChange={(event) => {
                setProvince(event.target.value)
                onFieldChange?.("province")
              }}
              onBlur={() => onFieldBlur?.("province")}
              aria-invalid={Boolean(showError("province"))}
              aria-describedby={showError("province") ? errorId("province") : undefined}
              className={inputFieldClass(Boolean(showError("province")))}
            />
          )}
          <FieldError id={errorId("province")} message={showError("province")} />
        </div>
        <div className="sm:col-span-1">
          <FieldLabel htmlFor={`${idPrefix}-postal`} required>
            ZIP / Postal code
          </FieldLabel>
          <input
            id={`${idPrefix}-postal`}
            required
            autoComplete="postal-code"
            value={postalCode}
            onChange={(event) => {
              setPostalCode(event.target.value)
              onFieldChange?.("postalCode")
            }}
            onBlur={() => onFieldBlur?.("postalCode")}
            aria-invalid={Boolean(showError("postalCode"))}
            aria-describedby={showError("postalCode") ? errorId("postalCode") : undefined}
            className={inputFieldClass(Boolean(showError("postalCode")))}
          />
          <FieldError id={errorId("postalCode")} message={showError("postalCode")} />
        </div>
      </div>

      <div>
        <FieldLabel htmlFor={`${idPrefix}-phone`}>Phone (optional)</FieldLabel>
        <input
          id={`${idPrefix}-phone`}
          type="tel"
          autoComplete="tel"
          value={phone}
          onChange={(event) => {
            setPhone(event.target.value)
            onFieldChange?.("phone")
          }}
          onBlur={() => onFieldBlur?.("phone")}
          aria-invalid={Boolean(showError("phone"))}
          aria-describedby={showError("phone") ? errorId("phone") : undefined}
          className={inputFieldClass(Boolean(showError("phone")))}
        />
        <FieldError id={errorId("phone")} message={showError("phone")} />
      </div>

      {showEmail && setEmail ? (
        <div>
          <FieldLabel htmlFor={`${idPrefix}-email`} required>
            Email address
          </FieldLabel>
          <input
            id={`${idPrefix}-email`}
            required
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value)
              onFieldChange?.("email")
            }}
            onBlur={() => onFieldBlur?.("email")}
            aria-invalid={Boolean(showError("email"))}
            aria-describedby={showError("email") ? errorId("email") : undefined}
            className={inputFieldClass(Boolean(showError("email")))}
          />
          <FieldError id={errorId("email")} message={showError("email")} />
        </div>
      ) : null}
    </div>
  )
}

export function CheckoutForm() {
  const router = useRouter()
  const { items, subtotal, clear } = useCart()
  const [email, setEmail] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [company, setCompany] = useState("")
  const [address1, setAddress1] = useState("")
  const [address2, setAddress2] = useState("")
  const [city, setCity] = useState("")
  const [province, setProvince] = useState("")
  const [postalCode, setPostalCode] = useState("")
  const [phone, setPhone] = useState("")
  const [country, setCountry] = useState("US")
  const [shipToDifferent, setShipToDifferent] = useState(false)
  const [shipFirstName, setShipFirstName] = useState("")
  const [shipLastName, setShipLastName] = useState("")
  const [shipCompany, setShipCompany] = useState("")
  const [shipAddress1, setShipAddress1] = useState("")
  const [shipAddress2, setShipAddress2] = useState("")
  const [shipCity, setShipCity] = useState("")
  const [shipProvince, setShipProvince] = useState("")
  const [shipPostalCode, setShipPostalCode] = useState("")
  const [shipPhone, setShipPhone] = useState("")
  const [shipCountry, setShipCountry] = useState("US")
  const [ruoAck, setRuoAck] = useState(false)
  const [status, setStatus] = useState("")
  const [error, setError] = useState("")
  const [billingErrors, setBillingErrors] = useState<AddressFieldErrors>({})
  const [shippingErrors, setShippingErrors] = useState<AddressFieldErrors>({})
  const [billingTouched, setBillingTouched] = useState<Partial<Record<AddressFieldKey, boolean>>>({})
  const [shippingTouched, setShippingTouched] = useState<Partial<Record<AddressFieldKey, boolean>>>({})
  const [attemptedSubmit, setAttemptedSubmit] = useState(false)
  const [ruoError, setRuoError] = useState("")
  const [loading, setLoading] = useState(false)
  const [restrictedCountries, setRestrictedCountries] = useState<string[]>([])
  const [cardAvailable, setCardAvailable] = useState(false)
  const [cryptoLive, setCryptoLive] = useState(false)
  const [cryptoOptions, setCryptoOptions] = useState<CheckoutCryptoOption[]>(CHECKOUT_CRYPTO_CATALOG)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card")
  const [selectedAsset, setSelectedAsset] = useState("BTC")

  const estimatedTotal = subtotal + DEFAULT_SHIPPING_USD

  const billingValues = useMemo<AddressValues>(
    () => ({
      firstName,
      lastName,
      email,
      address1,
      city,
      province,
      postalCode,
      phone,
      country
    }),
    [firstName, lastName, email, address1, city, province, postalCode, phone, country]
  )

  const shippingValues = useMemo<AddressValues>(
    () => ({
      firstName: shipFirstName,
      lastName: shipLastName,
      address1: shipAddress1,
      city: shipCity,
      province: shipProvince,
      postalCode: shipPostalCode,
      phone: shipPhone,
      country: shipCountry
    }),
    [
      shipFirstName,
      shipLastName,
      shipAddress1,
      shipCity,
      shipProvince,
      shipPostalCode,
      shipPhone,
      shipCountry
    ]
  )

  const handleBillingBlur = (field: AddressFieldKey) => {
    setBillingTouched((prev) => ({ ...prev, [field]: true }))
    const message = validateAddressField(field, billingValues, true)
    setBillingErrors((prev) => {
      const next = { ...prev }
      if (message) next[field] = message
      else delete next[field]
      return next
    })
  }

  const handleShippingBlur = (field: AddressFieldKey) => {
    setShippingTouched((prev) => ({ ...prev, [field]: true }))
    const message = validateAddressField(field, shippingValues, false)
    setShippingErrors((prev) => {
      const next = { ...prev }
      if (message) next[field] = message
      else delete next[field]
      return next
    })
  }

  const clearBillingError = (field: AddressFieldKey) => {
    setBillingErrors((prev) => {
      if (!prev[field]) return prev
      const next = { ...prev }
      delete next[field]
      return next
    })
  }

  const clearShippingError = (field: AddressFieldKey) => {
    setShippingErrors((prev) => {
      if (!prev[field]) return prev
      const next = { ...prev }
      delete next[field]
      return next
    })
  }

  useEffect(() => {
    if (!shipToDifferent) {
      setShippingErrors({})
      setShippingTouched({})
    }
  }, [shipToDifferent])

  useEffect(() => {
    void fetch("/api/compliance/restricted-countries")
      .then((response) => response.json())
      .then((data) => {
        if (data?.ok && Array.isArray(data.countries)) {
          setRestrictedCountries(data.countries)
        }
      })
      .catch(() => {
        // Server-side checkout still enforces restrictions.
      })
  }, [])

  useEffect(() => {
    const medusaUrl = (process.env.NEXT_PUBLIC_MEDUSA_URL || "http://localhost:9000").replace(/\/$/, "")
    void loadCheckoutPaymentOptions(fetch, medusaUrl, getMedusaStoreHeaders()).then((options) => {
      setCardAvailable(options.cardAvailable)
      setCryptoLive(options.cryptoLive)
      setCryptoOptions(options.cryptoOptions)

      const preferred = options.cryptoOptions.find((item) => item.asset === "BTC")
      if (preferred) setSelectedAsset(preferred.asset)
      else if (options.cryptoOptions[0]?.asset) setSelectedAsset(options.cryptoOptions[0].asset)

      if (!options.cardAvailable) {
        setPaymentMethod("crypto")
      }
    })
  }, [])

  useEffect(() => {
    void retrieveCustomer().then((customer) => {
      if (!customer) return
      if (customer.email) setEmail(customer.email)
      if (customer.first_name) setFirstName(customer.first_name)
      if (customer.last_name) setLastName(customer.last_name)
    })
  }, [])

  const availableCountries = useMemo(
    () => CHECKOUT_COUNTRIES.filter((entry) => !restrictedCountries.includes(entry.code)),
    [restrictedCountries]
  )

  const submitLabel = useMemo(() => {
    if (loading) return "Processing…"
    if (paymentMethod === "card") return "Place order"
    return "Continue to crypto payment"
  }, [loading, paymentMethod])

  const shippingAddress = useMemo(() => {
    if (!shipToDifferent) {
      return {
        firstName,
        lastName,
        company,
        address1,
        address2,
        city,
        province,
        postalCode,
        phone,
        country
      }
    }
    return {
      firstName: shipFirstName,
      lastName: shipLastName,
      company: shipCompany,
      address1: shipAddress1,
      address2: shipAddress2,
      city: shipCity,
      province: shipProvince,
      postalCode: shipPostalCode,
      phone: shipPhone,
      country: shipCountry
    }
  }, [
    shipToDifferent,
    firstName,
    lastName,
    company,
    address1,
    address2,
    city,
    province,
    postalCode,
    phone,
    country,
    shipFirstName,
    shipLastName,
    shipCompany,
    shipAddress1,
    shipAddress2,
    shipCity,
    shipProvince,
    shipPostalCode,
    shipPhone,
    shipCountry
  ])

  const persistLocalOrder = (order: CheckoutOrder) => {
    const raw = window.localStorage.getItem(ORDERS_KEY)
    let parsed: CheckoutOrder[] = []
    if (raw) {
      try {
        parsed = JSON.parse(raw) as CheckoutOrder[]
      } catch {
        parsed = []
      }
    }
    parsed.unshift(order)
    window.localStorage.setItem(ORDERS_KEY, JSON.stringify(parsed))
  }

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError("")
    setStatus("")
    setAttemptedSubmit(true)

    const nextBillingErrors = validateAddress(billingValues, { requireEmail: true })
    const nextShippingErrors = shipToDifferent
      ? validateAddress(shippingValues, { requireEmail: false })
      : {}
    const nextRuoError = ruoAck ? "" : "Please acknowledge RUO requirements before checkout."

    setBillingErrors(nextBillingErrors)
    setShippingErrors(nextShippingErrors)
    setRuoError(nextRuoError)

    const invalidFieldId = firstInvalidFieldId({
      billing: nextBillingErrors,
      shipping: nextShippingErrors,
      ruoAck: nextRuoError || undefined,
      shipToDifferent
    })

    if (invalidFieldId) {
      document.getElementById(invalidFieldId)?.focus()
      if (nextRuoError && !Object.keys(nextBillingErrors).length && !Object.keys(nextShippingErrors).length) {
        setError(nextRuoError)
      }
      return
    }

    if (!items.length) {
      setError("Cart is empty.")
      return
    }
    if (paymentMethod === "card" && !cardAvailable) {
      setError("Card checkout is temporarily unavailable. Please pay with cryptocurrency.")
      return
    }
    if (paymentMethod === "crypto" && !cryptoLive) {
      setError(
        "Cryptocurrency checkout is not available right now. Use card payment, or try again once BTCPay/Paymento is configured on the server."
      )
      return
    }

    const normalizedCountry = shippingAddress.country.trim().toUpperCase()
    if (restrictedCountries.includes(normalizedCountry)) {
      setError(`Shipping to ${normalizedCountry} is restricted under our compliance policy.`)
      return
    }

    setLoading(true)
    let orderId = `draft_${Date.now()}`
    let displayId: number | undefined
    let orderTotal = estimatedTotal
    let paymentUrl: string | null = null
    let paymentProvider: string | null = null
    let resolvedPaymentMethod: PaymentMethod = paymentMethod

    try {
      const authToken = readAuthToken()
      const checkoutResponse = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...(authToken ? { authorization: `Bearer ${authToken}` } : {})
        },
        body: JSON.stringify({
          email,
          firstName: shippingAddress.firstName,
          lastName: shippingAddress.lastName,
          company: shippingAddress.company,
          address1: shippingAddress.address1,
          address2: shippingAddress.address2,
          city: shippingAddress.city,
          province: shippingAddress.province,
          postalCode: shippingAddress.postalCode,
          phone: shippingAddress.phone,
          country: shippingAddress.country,
          payment_method: paymentMethod,
          crypto_asset: selectedAsset,
          items: items.map((item) => ({
            variantId: item.variantId,
            quantity: item.quantity,
            title: item.title,
            variantTitle: item.variantTitle,
            unitPrice: item.unitPrice
          }))
        })
      })
      const checkoutJson = await checkoutResponse.json()
      if (!checkoutJson?.ok) {
        if (checkoutJson?.code === "shipping_restricted") {
          router.push("/shipping-restricted")
          setLoading(false)
          return
        }
        setError(checkoutJson?.message || "Checkout failed. Is Medusa running and bootstrapped?")
        setLoading(false)
        return
      }
      orderId = checkoutJson.order_id
      displayId = checkoutJson.display_id
      if (typeof checkoutJson.total === "number" && checkoutJson.total > 0) {
        orderTotal = checkoutJson.total
      }
      if (checkoutJson.payment_url) {
        paymentUrl = checkoutJson.payment_url
      }
      if (checkoutJson.payment_provider) {
        paymentProvider = checkoutJson.payment_provider
      }
      if (checkoutJson.payment_method === "crypto" || checkoutJson.payment_method === "card") {
        resolvedPaymentMethod = checkoutJson.payment_method
      }
      if (checkoutJson.payment_error && !checkoutJson.payment_url) {
        setStatus(checkoutJson.payment_error)
      }
    } catch {
      setError("Could not reach checkout API.")
      setLoading(false)
      return
    }

    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_MEDUSA_URL || "http://localhost:9000"}/store/compliance/acknowledge`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            order_id: orderId,
            disclaimer_version: "v1",
            acknowledged_at: new Date().toISOString(),
            shipping_country: shippingAddress.country,
            ip_country: null
          })
        }
      )
    } catch {
      // Non-blocking in development.
    }

    const order: CheckoutOrder = {
      id: orderId,
      display_id: displayId,
      created_at: new Date().toISOString(),
      email,
      shipping_country: shippingAddress.country,
      total: orderTotal,
      items: items.map((item) => ({
        title: item.title,
        variantTitle: item.variantTitle,
        quantity: item.quantity,
        unitPrice: item.unitPrice
      }))
    }

    persistLocalOrder(order)
    clear()

    if (paymentUrl && (paymentProvider === "peptidepay" || resolvedPaymentMethod === "card")) {
      storePaymentUrl(orderId, paymentUrl)
      window.location.assign(paymentUrl)
      return
    }

    if (paymentUrl && paymentProvider === "paymento") {
      storePaymentUrl(orderId, paymentUrl)
      window.location.assign(paymentUrl)
      return
    }

    setLoading(false)

    if (paymentUrl) {
      storePaymentUrl(orderId, paymentUrl)
    }

    const params = new URLSearchParams({
      order_id: orderId,
      total: orderTotal.toFixed(2)
    })
    if (displayId) params.set("display_id", String(displayId))

    router.push(`/checkout/payment?${params.toString()}`)
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-start">
        <div className="space-y-8">
          <section className="card p-6 sm:p-8">
            <h2 className="mb-6 font-serif text-xl text-[#0F172A]">Billing details</h2>
            <AddressFields
              idPrefix="billing"
              firstName={firstName}
              setFirstName={setFirstName}
              lastName={lastName}
              setLastName={setLastName}
              company={company}
              setCompany={setCompany}
              country={country}
              setCountry={setCountry}
              address1={address1}
              setAddress1={setAddress1}
              address2={address2}
              setAddress2={setAddress2}
              city={city}
              setCity={setCity}
              province={province}
              setProvince={setProvince}
              postalCode={postalCode}
              setPostalCode={setPostalCode}
              phone={phone}
              setPhone={setPhone}
              email={email}
              setEmail={setEmail}
              availableCountries={availableCountries}
              showEmail
              errors={billingErrors}
              touched={billingTouched}
              attemptedSubmit={attemptedSubmit}
              onFieldBlur={handleBillingBlur}
              onFieldChange={clearBillingError}
            />
          </section>

          <section className="card p-6 sm:p-8">
            <label className="flex cursor-pointer items-center gap-3 text-sm font-medium text-[#0F172A]">
              <input
                type="checkbox"
                checked={shipToDifferent}
                onChange={(event) => setShipToDifferent(event.target.checked)}
                className="h-4 w-4 rounded accent-[#0D9488]"
              />
              Ship to a different address?
            </label>

            {shipToDifferent ? (
              <div className="mt-6 border-t border-[#E2E8F0] pt-6">
                <h3 className="mb-6 font-serif text-lg text-[#0F172A]">Shipping details</h3>
                <AddressFields
                  idPrefix="shipping"
                  firstName={shipFirstName}
                  setFirstName={setShipFirstName}
                  lastName={shipLastName}
                  setLastName={setShipLastName}
                  company={shipCompany}
                  setCompany={setShipCompany}
                  country={shipCountry}
                  setCountry={setShipCountry}
                  address1={shipAddress1}
                  setAddress1={setShipAddress1}
                  address2={shipAddress2}
                  setAddress2={setShipAddress2}
                  city={shipCity}
                  setCity={setShipCity}
                  province={shipProvince}
                  setProvince={setShipProvince}
                  postalCode={shipPostalCode}
                  setPostalCode={setShipPostalCode}
                  phone={shipPhone}
                  setPhone={setShipPhone}
                  availableCountries={availableCountries}
                  errors={shippingErrors}
                  touched={shippingTouched}
                  attemptedSubmit={attemptedSubmit}
                  onFieldBlur={handleShippingBlur}
                  onFieldChange={clearShippingError}
                />
              </div>
            ) : null}
          </section>

          <section className="card bg-[#F0FDFA] p-5 sm:p-6">
              <h3 className="mb-4 font-serif text-lg text-[#0F172A]">Payment</h3>

              {cardAvailable ? (
                <label className={methodCardClass(paymentMethod === "card")}>
                  <input
                    type="radio"
                    name="payment_method"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={() => setPaymentMethod("card")}
                    className="mt-1 h-4 w-4 shrink-0 accent-[#0D9488]"
                  />
                  <span className="flex min-w-0 flex-1 flex-col gap-1">
                    <span className="flex flex-wrap items-center gap-2 text-sm font-medium text-[#0F172A]">
                      <CreditCard className="h-4 w-4 text-[#0D9488]" aria-hidden />
                      Credit / debit card
                    </span>
                    <span className="text-xs leading-relaxed text-[#64748B]">
                      Visa, Mastercard, Amex, Apple Pay &amp; Google Pay via secure hosted checkout.
                    </span>
                  </span>
                </label>
              ) : null}

              <label className={`${methodCardClass(paymentMethod === "crypto")} ${cardAvailable ? "mt-3" : ""}`}>
                <input
                  type="radio"
                  name="payment_method"
                  value="crypto"
                  checked={paymentMethod === "crypto"}
                  onChange={() => setPaymentMethod("crypto")}
                  className="mt-1 h-4 w-4 shrink-0 accent-[#0D9488]"
                />
                <span className="flex min-w-0 flex-1 flex-col gap-1">
                  <span className="flex items-center gap-2 text-sm font-medium text-[#0F172A]">
                    <Bitcoin className="h-4 w-4 text-[#D97706]" aria-hidden />
                    Cryptocurrency
                  </span>
                  <span className="text-xs leading-relaxed text-[#64748B]">
                    Bitcoin via BTCPay · USDT, ETH, SOL and more via Paymento.
                  </span>
                </span>
              </label>

              {paymentMethod === "crypto" ? (
                <div className="mt-4 rounded-lg border border-[#E2E8F0] bg-white p-4">
                  <FieldLabel htmlFor="checkout-crypto-asset">Select asset</FieldLabel>
                  <select
                    id="checkout-crypto-asset"
                    value={selectedAsset}
                    onChange={(event) => setSelectedAsset(event.target.value)}
                    className="input-field text-sm"
                  >
                    {cryptoOptions.map((option) => (
                      <option key={option.asset} value={option.asset}>
                        {option.label}
                        {option.provider === "btcpay"
                          ? " · BTCPay"
                          : option.provider === "paymento"
                            ? " · Paymento"
                            : ""}
                      </option>
                    ))}
                  </select>
                  {!cryptoLive ? (
                    <p className="mt-2 text-xs text-amber-700">
                      Crypto gateways are not connected in this environment yet.
                    </p>
                  ) : null}
                </div>
              ) : paymentMethod === "card" ? (
                <p className="mt-4 rounded-lg border border-[#E2E8F0] bg-white px-4 py-3 text-xs leading-relaxed text-[#64748B]">
                  Card details are entered on our secure hosted payment page after you place your order.
                </p>
              ) : null}
          </section>
        </div>

        <aside className="lg:sticky lg:top-6">
          <div className="card overflow-hidden">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-4 border-b border-[#E2E8F0] bg-[#0F172A] px-4 py-3 text-sm font-medium text-white">
              <span>Product</span>
              <span>Subtotal</span>
            </div>

            {items.length === 0 ? (
              <div className="px-4 py-6 text-sm text-[#64748B]">
                Your cart is empty.{" "}
                <Link href="/shop" className="text-[#0D9488] hover:underline">
                  Browse catalog
                </Link>
              </div>
            ) : (
              <ul className="divide-y divide-[#E2E8F0]">
                {items.map((item) => (
                  <li key={item.id} className="flex gap-3 px-4 py-4">
                    <img
                      src={getProductImage(item.handle)}
                      alt={item.title}
                      className="h-14 w-14 shrink-0 rounded-lg bg-white object-contain"
                    />
                    <div className="flex min-w-0 flex-1 items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-[#0F172A]">{item.title}</p>
                        {item.variantTitle ? (
                          <p className="mt-0.5 text-xs text-[#94A3B8]">{item.variantTitle}</p>
                        ) : null}
                        <p className="mt-1 text-xs text-[#64748B]">Qty: {item.quantity}</p>
                      </div>
                      <p className="shrink-0 tabular-nums text-sm text-[#0F172A]">
                        ${(item.unitPrice * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <div className="space-y-2 border-t border-[#E2E8F0] px-4 py-4 text-sm text-[#475569]">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span className="tabular-nums">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Shipping</span>
                <span className="tabular-nums">${DEFAULT_SHIPPING_USD.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between border-t border-[#E2E8F0] pt-3 text-base font-semibold text-[#0F172A]">
                <span>Total</span>
                <span className="tabular-nums">${estimatedTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <label
            className={`mt-4 flex items-start gap-3 rounded-xl border bg-[#FFFBEB]/60 p-4 text-sm leading-relaxed text-[#475569] ${
              ruoError && attemptedSubmit ? "border-red-300" : "border-[#E2E8F0]"
            }`}
          >
            <input
              id="checkout-ruo-ack"
              checked={ruoAck}
              onChange={(event) => {
                setRuoAck(event.target.checked)
                if (event.target.checked) setRuoError("")
              }}
              type="checkbox"
              aria-invalid={Boolean(ruoError && attemptedSubmit)}
              aria-describedby={ruoError && attemptedSubmit ? "checkout-ruo-error" : undefined}
              className="mt-0.5 h-4 w-4 shrink-0 rounded accent-[#0D9488]"
            />
            I confirm these compounds are for research use only and not for human consumption.
          </label>
          <FieldError id="checkout-ruo-error" message={attemptedSubmit ? ruoError : undefined} />

          <p className="mt-5 text-xs leading-relaxed text-[#64748B]">
            Your personal data will be used to process your order and for other purposes described in our{" "}
            <Link href="/privacy" className="text-[#0D9488] hover:underline">
              privacy policy
            </Link>
            .
          </p>

          <button
            type="submit"
            disabled={loading || !items.length}
            className="btn-primary mt-5 w-full py-3.5 text-base disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitLabel}
          </button>

          {error ? (
            <p
              className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
              role="alert"
            >
              {error}
            </p>
          ) : null}
          {status ? <p className="mt-4 text-sm text-[#475569]">{status}</p> : null}
        </aside>
      </div>
    </form>
  )
}
