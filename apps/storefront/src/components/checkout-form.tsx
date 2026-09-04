"use client"

import Image from "next/image"
import Link from "next/link"
import { FormEvent, useCallback, useEffect, useMemo, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import {
  Bitcoin,
  ChevronDown,
  CreditCard,
  FileCheck,
  FlaskConical,
  HelpCircle,
  Lock,
  Minus,
  Plus,
  Snowflake
} from "lucide-react"
import { useCart, type CartItem } from "@/components/cart-provider"
import { readAuthToken, retrieveCustomer, AUTH_SESSION_CHANGED_EVENT } from "@/lib/medusa-auth"
import {
  CHECKOUT_CRYPTO_CATALOG,
  type CheckoutCryptoOption
} from "@/lib/checkout-payment-options"
import { CHECKOUT_COUNTRIES } from "@/lib/checkout-countries"
import { resolveShippingUsd } from "@/lib/checkout-shipping"
import {
  defaultPeptidepayOnramp,
  isPeptidepayOnrampId,
  peptidepayOnrampAvailableForIp,
  peptidepayOnrampEligible,
  resolvePeptidepayOnramp,
  visiblePeptidepayOnramps,
  type PeptidepayOnrampId
} from "@/lib/peptidepay-onramps"
import {
  getCheckoutSubdivisions,
  getPostalLabel,
  getSubdivisionLabel,
  getSubdivisionPlaceholder,
  isValidSubdivision,
  normalizeSubdivision,
  resolveSubdivisionSelectValue
} from "@/lib/checkout-subdivisions"
import { getProductImage } from "@/lib/product-image-map"
import { localImageProps } from "@/lib/local-image"
import { storeCardOnramp, storePaymentUrl } from "@/components/payment-confirmation"
import { storeCardHandoffContext } from "@/lib/card-handoff-context"
import { AddressAutocompleteInput } from "@/components/address-autocomplete-input"
import type { ParsedAddress } from "@/lib/google-places"
import {
  cancelCheckoutAbandonIntent,
  scheduleCheckoutAbandonIntent
} from "@/lib/checkout-abandon"

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
const CHECKOUT_RETURN_PATH = "/checkout"
const CHECKOUT_LOGIN_HREF = `/login?returnUrl=${encodeURIComponent(CHECKOUT_RETURN_PATH)}`
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
    else if (!isValidSubdivision("US", values.province)) {
      errors.province = "Select a valid US state."
    }

    const postal = values.postalCode.trim()
    if (!postal) errors.postalCode = "ZIP code is required."
    else if (!US_ZIP_PATTERN.test(postal)) errors.postalCode = "Enter a valid US ZIP code."
  } else {
    const subdivisions = getCheckoutSubdivisions(country)
    const label = getSubdivisionLabel(country)
    if (subdivisions.length) {
      if (!values.province.trim()) errors.province = `${label} is required.`
      else if (!isValidSubdivision(country, values.province)) {
        errors.province = `Select a valid ${label.toLowerCase()}.`
      }
    }

    if (!values.postalCode.trim()) errors.postalCode = "Postal code is required."
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
    { field: "email", id: "billing-email" },
    { field: "firstName", id: "billing-first-name" },
    { field: "lastName", id: "billing-last-name" },
    { field: "address1", id: "billing-address1" },
    { field: "country", id: "billing-country" },
    { field: "postalCode", id: "billing-postal" },
    { field: "province", id: "billing-province" },
    { field: "city", id: "billing-city" },
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

function onrampCardClass(selected: boolean, disabled: boolean) {
  return [
    "relative flex w-full items-start gap-3 rounded-lg border p-2.5 text-left transition-all",
    disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
    selected && !disabled
      ? "border-[#0D9488] bg-white shadow-[0_0_0_1px_#0D9488]"
      : "border-[#E2E8F0] bg-white",
    !disabled && !selected ? "hover:border-[#CBD5E1]" : ""
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

function OptionalExpandField({
  id,
  toggleLabel,
  fieldLabel,
  value,
  onChange,
  autoComplete
}: {
  id: string
  toggleLabel: string
  fieldLabel: string
  value: string
  onChange: (value: string) => void
  autoComplete?: string
}) {
  const [open, setOpen] = useState(Boolean(value.trim()))

  useEffect(() => {
    if (value.trim()) setOpen(true)
  }, [value])

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-sm font-medium text-[#0D9488] hover:underline"
      >
        + {toggleLabel}
      </button>
    )
  }

  return (
    <div>
      <FieldLabel htmlFor={id}>{fieldLabel}</FieldLabel>
      <input
        id={id}
        autoComplete={autoComplete}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="input-field"
      />
    </div>
  )
}

function CheckoutStepper() {
  return (
    <nav aria-label="Checkout steps" className="flex items-center gap-2 text-sm sm:gap-3">
      <Link href="/cart" className="font-medium text-[#0D9488] hover:underline">
        Cart
      </Link>
      <span className="text-[#CBD5E1]" aria-hidden>
        /
      </span>
      <span className="font-medium text-[#0F172A]">Checkout</span>
    </nav>
  )
}

function QtyControl({
  quantity,
  onChange
}: {
  quantity: number
  onChange: (quantity: number) => void
}) {
  return (
    <div className="mt-2 inline-flex items-center rounded-lg border border-[#E2E8F0]">
      <button
        type="button"
        className="flex h-8 w-8 items-center justify-center text-[#475569] hover:text-[#0F172A]"
        onClick={() => onChange(quantity - 1)}
        aria-label="Decrease quantity"
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span className="min-w-[1.5rem] text-center text-sm tabular-nums text-[#0F172A]">{quantity}</span>
      <button
        type="button"
        className="flex h-8 w-8 items-center justify-center text-[#475569] hover:text-[#0F172A]"
        onClick={() => onChange(quantity + 1)}
        aria-label="Increase quantity"
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}

function CheckoutTrustRow() {
  const items = [
    { icon: FileCheck, label: "Lot-linked COA" },
    { icon: Snowflake, label: "Cold-chain shipping" },
    { icon: Lock, label: "Encrypted checkout" },
    { icon: FlaskConical, label: "Research use only" }
  ]

  return (
    <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {items.map((item) => (
        <li
          key={item.label}
          className="flex items-center gap-2 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-2.5 py-2 text-[11px] leading-tight text-[#475569]"
        >
          <item.icon className="h-3.5 w-3.5 shrink-0 text-[#0D9488]" aria-hidden />
          {item.label}
        </li>
      ))}
    </ul>
  )
}

function CheckoutHelpBanner() {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 text-sm text-[#475569]">
      <HelpCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#0D9488]" aria-hidden />
      <p>
        Need help? Email{" "}
        <a href="mailto:info@tetravalabs.com" className="font-medium text-[#0D9488] hover:underline">
          info@tetravalabs.com
        </a>
        .
      </p>
    </div>
  )
}

function CheckoutOrderSummary({
  items,
  subtotal,
  shippingUsd,
  estimatedTotal,
  updateQty
}: {
  items: CartItem[]
  subtotal: number
  shippingUsd: number
  estimatedTotal: number
  updateQty: (id: string, quantity: number) => void
}) {
  return (
    <div className="space-y-3">
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
          {items.map((item) => {
            const image = getProductImage(item.handle)
            return (
              <li key={item.id} className="flex gap-3 px-4 py-4">
                <Image
                  src={image}
                  alt={item.title}
                  width={56}
                  height={56}
                  {...localImageProps(image)}
                  className="h-14 w-14 shrink-0 rounded-lg bg-white object-contain"
                />
                <div className="flex min-w-0 flex-1 items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#0F172A]">{item.title}</p>
                    {item.variantTitle ? (
                      <p className="mt-0.5 text-xs text-[#94A3B8]">{item.variantTitle}</p>
                    ) : null}
                    <QtyControl
                      quantity={item.quantity}
                      onChange={(quantity) => updateQty(item.id, quantity)}
                    />
                  </div>
                  <p className="shrink-0 tabular-nums text-sm text-[#0F172A]">
                    ${(item.unitPrice * item.quantity).toFixed(2)}
                  </p>
                </div>
              </li>
            )
          })}
        </ul>
      )}

      <div className="space-y-2 border-t border-[#E2E8F0] px-4 py-4 text-sm text-[#475569]">
        <div className="flex items-center justify-between">
          <span>Subtotal</span>
          <span className="tabular-nums">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Shipping</span>
          <span className="tabular-nums">${shippingUsd.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between border-t border-[#E2E8F0] pt-3 text-base font-semibold text-[#0F172A]">
          <span>Total</span>
          <span className="tabular-nums">${estimatedTotal.toFixed(2)}</span>
        </div>
      </div>
      </div>
      <CheckoutHelpBanner />
    </div>
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
  loggedIn?: boolean
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
  onFieldChange,
  loggedIn = false
}: AddressFieldsProps) {
  const subdivisions = getCheckoutSubdivisions(country)
  const subdivisionLabel = getSubdivisionLabel(country)
  const postalLabel = getPostalLabel(country)
  const hasSubdivisionSelect = subdivisions.length > 0

  const showError = (field: AddressFieldKey) =>
    fieldVisibleError(field, errors, touched, attemptedSubmit)

  const errorId = (field: AddressFieldKey) => `${idPrefix}-${field}-error`

  const applyParsedAddress = (parsed: ParsedAddress) => {
    if (parsed.address1) setAddress1(parsed.address1)
    if (parsed.city) setCity(parsed.city)
    if (parsed.province) {
      setProvince(normalizeSubdivision(parsed.country || country, parsed.province))
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
      {showEmail && setEmail ? (
        <div>
          {loggedIn ? (
            <p className="mb-2 text-sm text-[#475569]">
              Signed in as{" "}
              <span className="font-medium text-[#0F172A]">{email || "your account"}</span>.{" "}
              <Link href="/account" className="font-medium text-[#0D9488] hover:underline">
                View account
              </Link>
            </p>
          ) : (
            <p id={`${idPrefix}-email-guest-note`} className="mb-2 text-sm text-[#64748B]">
              Guest checkout is available.{" "}
              <Link href={CHECKOUT_LOGIN_HREF} className="font-medium text-[#0D9488] hover:underline">
                Log in
              </Link>{" "}
              if you already have an account.
            </p>
          )}
          <div className="relative">
            <label
              htmlFor={`${idPrefix}-email`}
              className="pointer-events-none absolute left-3.5 top-2.5 text-xs text-[#64748B]"
            >
              Email address
            </label>
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
              aria-describedby={
                showError("email")
                  ? errorId("email")
                  : !loggedIn
                    ? `${idPrefix}-email-guest-note`
                    : undefined
              }
              className={`${inputFieldClass(Boolean(showError("email")))} pb-2.5 pt-7`}
            />
          </div>
          <FieldError id={errorId("email")} message={showError("email")} />
        </div>
      ) : null}

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

      <OptionalExpandField
        id={`${idPrefix}-company`}
        toggleLabel="Add company name (optional)"
        fieldLabel="Company name (optional)"
        value={company}
        onChange={setCompany}
        autoComplete="organization"
      />

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

      <OptionalExpandField
        id={`${idPrefix}-address2`}
        toggleLabel="Add apartment, suite, unit (optional)"
        fieldLabel="Apartment, suite, unit, etc. (optional)"
        value={address2}
        onChange={setAddress2}
        autoComplete="address-line2"
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <FieldLabel htmlFor={`${idPrefix}-country`} required>
            Country / region
          </FieldLabel>
          <select
            id={`${idPrefix}-country`}
            required
            autoComplete="country"
            value={country}
            onChange={(event) => {
              const nextCountry = event.target.value
              setCountry(nextCountry)
              setProvince("")
              onFieldChange?.("country")
              onFieldChange?.("province")
            }}
            onBlur={() => onFieldBlur?.("country")}
            aria-invalid={Boolean(showError("country"))}
            aria-describedby={showError("country") ? errorId("country") : undefined}
            className={inputFieldClass(Boolean(showError("country")))}
          >
            <option value="">Select a country / region…</option>
            {availableCountries.map((entry) => (
              <option key={entry.code} value={entry.code}>
                {entry.name}
              </option>
            ))}
          </select>
          <FieldError id={errorId("country")} message={showError("country")} />
        </div>
        <div>
          <FieldLabel htmlFor={`${idPrefix}-postal`} required>
            {postalLabel}
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
        <div>
          <FieldLabel htmlFor={`${idPrefix}-province`} required={hasSubdivisionSelect}>
            {subdivisionLabel}
          </FieldLabel>
          {hasSubdivisionSelect ? (
            <select
              id={`${idPrefix}-province`}
              required
              autoComplete="address-level1"
              value={resolveSubdivisionSelectValue(country, province)}
              onChange={(event) => {
                setProvince(event.target.value)
                onFieldChange?.("province")
              }}
              onBlur={() => onFieldBlur?.("province")}
              aria-invalid={Boolean(showError("province"))}
              aria-describedby={showError("province") ? errorId("province") : undefined}
              className={inputFieldClass(Boolean(showError("province")))}
            >
              <option value="">{getSubdivisionPlaceholder(country)}</option>
              {subdivisions.map((entry) => (
                <option key={entry.code} value={entry.code}>
                  {entry.name}
                </option>
              ))}
            </select>
          ) : (
            <input
              id={`${idPrefix}-province`}
              autoComplete="address-level1"
              value={province}
              placeholder={country ? "State / province" : "Select a country first"}
              disabled={!country}
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
      </div>

      <div>
        <FieldLabel htmlFor={`${idPrefix}-city`} required>
          Town / city
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
    </div>
  )
}

export function CheckoutForm({ initialCardOnramp }: { initialCardOnramp?: string }) {
  const router = useRouter()
  const { items, subtotal, clear, updateQty } = useCart()
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
  const [cardAvailable, setCardAvailable] = useState(false)
  const [paymentOptionsLoaded, setPaymentOptionsLoaded] = useState(false)
  const [cryptoLive, setCryptoLive] = useState(false)
  const [cryptoOptions, setCryptoOptions] = useState<CheckoutCryptoOption[]>(CHECKOUT_CRYPTO_CATALOG)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card")
  const [cardOnramp, setCardOnramp] = useState<PeptidepayOnrampId>("stripe")
  const [buyerIpCountry, setBuyerIpCountry] = useState<string | null>(null)
  const [selectedAsset, setSelectedAsset] = useState("USDT")
  const [loggedIn, setLoggedIn] = useState(false)
  const [summaryOpen, setSummaryOpen] = useState(false)

  const shippingUsd = resolveShippingUsd(items)
  const estimatedTotal = subtotal + shippingUsd

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

    if (field === "email" && !message && email.trim() && items.length) {
      void scheduleCheckoutAbandonIntent({
        email: email.trim(),
        items: items.map((item) => ({
          title: item.title,
          variantTitle: item.variantTitle,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          handle: item.handle
        })),
        subtotalUsd: subtotal
      }).catch(() => {
        // Non-blocking marketing capture.
      })
    }
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
    void fetch("/api/checkout-payment-options", { cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error("Unable to load payment options")
        return response.json()
      })
      .then((data) => {
        if (!data?.ok) return

        setCardAvailable(Boolean(data.cardAvailable))
        setCryptoLive(Boolean(data.cryptoLive))
        setCryptoOptions(Array.isArray(data.cryptoOptions) ? data.cryptoOptions : CHECKOUT_CRYPTO_CATALOG)

        const options = Array.isArray(data.cryptoOptions) ? data.cryptoOptions : CHECKOUT_CRYPTO_CATALOG
        const preferred =
          options.find((item: CheckoutCryptoOption) => item.asset === "USDT") ||
          options.find((item: CheckoutCryptoOption) => item.asset === "USDT_TRC20")
        if (preferred) setSelectedAsset(preferred.asset)
        else if (options[0]?.asset) setSelectedAsset(options[0].asset)

        if (!data.cardAvailable && data.cryptoLive) {
          setPaymentMethod("crypto")
        }
      })
      .catch(() => {
        // Keep card visible; submit handler still validates availability.
      })
      .finally(() => {
        setPaymentOptionsLoaded(true)
      })
  }, [])

  useEffect(() => {
    void fetch("/api/geo", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        const code =
          typeof data?.country === "string" && data.country.trim() ? data.country.trim().toUpperCase() : null
        if (code && code !== "XX" && code !== "T1") setBuyerIpCountry(code)
      })
      .catch(() => undefined)
  }, [])

  useEffect(() => {
    if (!initialCardOnramp || !isPeptidepayOnrampId(initialCardOnramp)) return
    setCardOnramp(initialCardOnramp)
    setPaymentMethod("card")
    window.requestAnimationFrame(() => {
      document.getElementById("checkout-card-onramp")?.scrollIntoView({ behavior: "smooth", block: "center" })
    })
  }, [initialCardOnramp])

  const loadCustomerSession = useCallback(async () => {
    try {
      const hasToken = Boolean(readAuthToken())
      if (!hasToken) {
        setLoggedIn(false)
        return
      }

      const customer = await retrieveCustomer()
      if (!customer) {
        setLoggedIn(false)
        return
      }

      setLoggedIn(true)
      if (customer.email) setEmail(customer.email)
      if (customer.first_name) setFirstName(customer.first_name)
      if (customer.last_name) setLastName(customer.last_name)
    } catch {
      setLoggedIn(false)
    }
  }, [])

  useEffect(() => {
    void loadCustomerSession()
  }, [loadCustomerSession])

  useEffect(() => {
    const onAuthChange = () => {
      void loadCustomerSession()
    }
    window.addEventListener(AUTH_SESSION_CHANGED_EVENT, onAuthChange)
    return () => window.removeEventListener(AUTH_SESSION_CHANGED_EVENT, onAuthChange)
  }, [loadCustomerSession])

  useEffect(() => {
    if (!email.trim() || !EMAIL_PATTERN.test(email.trim()) || !items.length) return

    const timer = window.setTimeout(() => {
      void scheduleCheckoutAbandonIntent({
        email: email.trim(),
        items: items.map((item) => ({
          title: item.title,
          variantTitle: item.variantTitle,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          handle: item.handle
        })),
        subtotalUsd: subtotal
      }).catch(() => {
        // Non-blocking.
      })
    }, 2500)

    return () => window.clearTimeout(timer)
  }, [email, items, subtotal])

  const availableCountries = CHECKOUT_COUNTRIES

  const submitLabel = useMemo(() => {
    if (loading) return "Processing…"
    if (paymentMethod === "card") return "Continue to card payment"
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

  const cardOnrampOptions = useMemo(() => visiblePeptidepayOnramps(), [])

  const defaultCardOnramp = useMemo(
    () => defaultPeptidepayOnramp(shippingAddress.country, estimatedTotal, buyerIpCountry),
    [buyerIpCountry, shippingAddress.country, estimatedTotal]
  )

  useEffect(() => {
    const selected = cardOnrampOptions.find((option) => option.id === cardOnramp)
    const stillEligible = Boolean(
      selected &&
        peptidepayOnrampEligible(selected, estimatedTotal) &&
        peptidepayOnrampAvailableForIp(selected, buyerIpCountry)
    )
    if (!stillEligible && defaultCardOnramp) {
      setCardOnramp(defaultCardOnramp)
    }
  }, [buyerIpCountry, cardOnramp, cardOnrampOptions, defaultCardOnramp, estimatedTotal])

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
      window.requestAnimationFrame(() => {
        document.getElementById(invalidFieldId)?.focus()
      })
      if (nextRuoError && !Object.keys(nextBillingErrors).length && !Object.keys(nextShippingErrors).length) {
        setError(nextRuoError)
      }
      return
    }

    if (!items.length) {
      setError("Cart is empty.")
      return
    }
    if (paymentMethod === "card" && paymentOptionsLoaded && !cardAvailable) {
      setError("Card checkout is temporarily unavailable. Please pay with cryptocurrency.")
      return
    }

    if (paymentMethod === "card") {
      const onramp = resolvePeptidepayOnramp({
        requested: cardOnramp,
        country: shippingAddress.country,
        amountUsd: estimatedTotal,
        ipCountry: buyerIpCountry
      })
      if (!onramp.ok) {
        setError(onramp.error)
        window.requestAnimationFrame(() => {
          document.getElementById("checkout-card-onramp")?.focus()
        })
        return
      }
    }
    if (paymentMethod === "crypto" && !cryptoLive) {
      setError(
        "Cryptocurrency checkout is not available right now. Use card payment, or try again once Paymento is configured on the server."
      )
      return
    }

    setLoading(true)
    let orderId = `draft_${Date.now()}`
    let displayId: number | undefined
    let orderTotal = estimatedTotal
    let paymentUrl: string | null = null
    let paymentProvider: string | null = null
    let resolvedPaymentMethod: PaymentMethod = paymentMethod
    let resolvedCardOnramp: string = cardOnramp

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
          peptidepay_provider: paymentMethod === "card" ? cardOnramp : undefined,
          crypto_asset: selectedAsset,
          items: items.map((item) => ({
            variantId: item.variantId,
            quantity: item.quantity,
            handle: item.handle,
            title: item.title,
            variantTitle: item.variantTitle,
            unitPrice: item.unitPrice,
            productId: item.productId
          }))
        }),
        signal: AbortSignal.timeout(45000)
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
      if (typeof checkoutJson.card_onramp === "string" && checkoutJson.card_onramp) {
        resolvedCardOnramp = checkoutJson.card_onramp
      }
    } catch (error) {
      const timedOut =
        error instanceof DOMException
          ? error.name === "TimeoutError" || error.name === "AbortError"
          : error instanceof Error && (error.name === "TimeoutError" || error.name === "AbortError")
      setError(
        timedOut
          ? "Checkout is taking too long. Wait a moment and try again."
          : "Could not reach checkout API."
      )
      setLoading(false)
      return
    }

    void fetch(
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
        }),
        signal: AbortSignal.timeout(4000)
      }
    ).catch(() => {
      // Must not delay redirect to Peptide Pay.
    })

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
    void cancelCheckoutAbandonIntent().catch(() => {
      // Non-blocking.
    })
    clear()

    if (paymentUrl && paymentProvider === "paymento") {
      storePaymentUrl(orderId, paymentUrl)
      setLoading(false)
      window.location.assign(paymentUrl)
      return
    }

    if (resolvedPaymentMethod === "card" || paymentProvider === "peptidepay") {
      if (paymentUrl) storePaymentUrl(orderId, paymentUrl)
      if (resolvedCardOnramp && isPeptidepayOnrampId(resolvedCardOnramp)) {
        storeCardHandoffContext(orderId, {
          email,
          country: shippingAddress.country,
          amountUsd: orderTotal,
          provider: resolvedCardOnramp,
          fallbackUrl: paymentUrl || undefined
        })
      }
      const params = new URLSearchParams({
        order_id: orderId,
        total: orderTotal.toFixed(2)
      })
      if (displayId) params.set("display_id", String(displayId))
      if (resolvedCardOnramp) {
        params.set("onramp", resolvedCardOnramp)
        storeCardOnramp(orderId, resolvedCardOnramp)
      }
      setLoading(false)
      router.push(`/checkout/payment?${params.toString()}`)
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

  const summaryProps = {
    items,
    subtotal,
    shippingUsd,
    estimatedTotal,
    updateQty
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      <CheckoutStepper />

      <div className="space-y-3 lg:hidden">
        <button
          type="button"
          className="flex w-full items-center justify-between rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 text-sm"
          onClick={() => setSummaryOpen((open) => !open)}
          aria-expanded={summaryOpen}
        >
          <span className="flex items-center gap-2 font-medium text-[#0D9488]">
            {summaryOpen ? "Hide order summary" : "Show order summary"}
            <ChevronDown className={`h-4 w-4 transition-transform ${summaryOpen ? "rotate-180" : ""}`} />
          </span>
          <span className="tabular-nums font-semibold text-[#0F172A]">${estimatedTotal.toFixed(2)}</span>
        </button>
        {summaryOpen ? <CheckoutOrderSummary {...summaryProps} /> : <CheckoutHelpBanner />}
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-start">
        <div className="space-y-6">
          <section className="card p-6 sm:p-8">
                <h2 className="mb-6 font-serif text-xl text-[#0F172A]">Contact and shipping</h2>
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
                  loggedIn={loggedIn}
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

              <section id="checkout-payment" className="card bg-[#F0FDFA] p-5 sm:p-6">
                <h2 className="mb-4 font-serif text-lg text-[#0F172A]">Payment</h2>

                <label
                  className={`${methodCardClass(paymentMethod === "card")} ${paymentOptionsLoaded && !cardAvailable ? "opacity-70" : ""}`}
                >
                  <input
                    type="radio"
                    name="payment_method"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={() => setPaymentMethod("card")}
                    disabled={paymentOptionsLoaded && !cardAvailable}
                    className="mt-1 h-4 w-4 shrink-0 accent-[#0D9488] disabled:cursor-not-allowed"
                  />
                  <span className="flex min-w-0 flex-1 flex-col gap-1">
                    <span className="flex flex-wrap items-center gap-2 text-sm font-medium text-[#0F172A]">
                      <CreditCard className="h-4 w-4 text-[#0D9488]" aria-hidden />
                      Credit / debit card
                    </span>
                    <span className="text-xs leading-relaxed text-[#64748B]">
                      Visa, Mastercard, Amex, Apple Pay &amp; Google Pay via secure hosted checkout.
                    </span>
                    {!paymentOptionsLoaded ? (
                      <span className="text-xs text-[#64748B]">Checking card availability…</span>
                    ) : !cardAvailable ? (
                      <span className="text-xs text-amber-700">
                        Card gateway did not respond — refresh the page or use cryptocurrency below.
                      </span>
                    ) : null}
                  </span>
                </label>

                <label className={`${methodCardClass(paymentMethod === "crypto")} mt-3`}>
                  <input
                    type="radio"
                    name="payment_method"
                    value="crypto"
                    checked={paymentMethod === "crypto"}
                    onChange={() => setPaymentMethod("crypto")}
                    className="mt-1 h-4 w-4 shrink-0 accent-[#0D9488] disabled:cursor-not-allowed"
                  />
                  <span className="flex min-w-0 flex-1 flex-col gap-1">
                    <span className="flex items-center gap-2 text-sm font-medium text-[#0F172A]">
                      <Bitcoin className="h-4 w-4 text-[#D97706]" aria-hidden />
                      Cryptocurrency
                    </span>
                    <span className="text-xs leading-relaxed text-[#64748B]">
                      USDT, ETH, SOL, and other assets via Paymento.
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
                  <fieldset
                    id="checkout-card-onramp"
                    tabIndex={-1}
                    className="mt-4 rounded-lg border border-[#E2E8F0] bg-white p-4"
                  >
                    <legend className="px-1 text-sm font-medium text-[#0F172A]">Card processor</legend>
                    {buyerIpCountry && buyerIpCountry !== "US" ? (
                      <p className="mb-3 text-xs font-semibold leading-relaxed text-[#475569]">
                        Stripe and PayPal need a US connection.
                      </p>
                    ) : null}
                    <div className="flex flex-col gap-2">
                      {cardOnrampOptions.map((option) => {
                        const eligible = peptidepayOnrampEligible(option, estimatedTotal)
                        const inLocation = peptidepayOnrampAvailableForIp(option, buyerIpCountry)
                        const selectable = eligible && inLocation
                        const selected = cardOnramp === option.id
                        return (
                          <label key={option.id} className={onrampCardClass(selected, !selectable)}>
                            <input
                              type="radio"
                              name="card_onramp"
                              value={option.id}
                              checked={selected}
                              disabled={!selectable}
                              onChange={() => setCardOnramp(option.id)}
                              className="mt-1 h-4 w-4 shrink-0 accent-[#0D9488] disabled:cursor-not-allowed"
                            />
                            <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                              <span className="text-sm font-medium text-[#0F172A]">{option.label}</span>
                              <span className="text-xs leading-relaxed text-[#64748B]">
                                {option.description}
                              </span>
                              {!inLocation ? (
                                <span className="text-xs text-amber-700">Not available from your location.</span>
                              ) : !eligible ? (
                                <span className="text-xs text-amber-700">
                                  Available from ${option.minUsd.toFixed(0)}.
                                </span>
                              ) : null}
                            </span>
                          </label>
                        )
                      })}
                    </div>
                    {!defaultCardOnramp ? (
                      <p className="mt-3 text-xs text-amber-700">
                        No card processor is available for this total. Pay with cryptocurrency.
                      </p>
                    ) : null}
                  </fieldset>
                ) : null}
              </section>

              {paymentMethod === "card" ? (
                <div className="space-y-3 text-sm leading-relaxed text-[#64748B]">
                  <h3 className="font-serif text-lg text-[#0F172A]">What happens next</h3>
                  <ul className="list-disc space-y-1 pl-4">
                    <li>
                      Tetrava confirms the order, then you finish on your selected processor's secure page.
                    </li>
                    <li>
                      First time with Transak, Topper, or Banxa? A quick ID check, usually under two minutes
                      (Banxa can take a little longer).
                    </li>
                    <li>Once payment is confirmed, you return here and fulfillment begins.</li>
                  </ul>
                </div>
              ) : null}

              <label
                className={`flex items-start gap-3 rounded-xl border bg-[#FFFBEB]/60 p-4 text-sm leading-relaxed text-[#475569] ${
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

              <p className="text-xs leading-relaxed text-[#64748B]">
                Your personal data will be used to process your order and for other purposes described in our{" "}
                <Link href="/privacy" className="text-[#0D9488] hover:underline">
                  privacy policy
                </Link>
                .
              </p>

              <button
                type="submit"
                disabled={loading || !items.length}
                className="btn-primary w-full py-3.5 text-base disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitLabel}
              </button>

          {error ? (
            <p
              className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
              role="alert"
            >
              {error}
            </p>
          ) : null}
          {status ? <p className="text-sm text-[#475569]">{status}</p> : null}

          <CheckoutTrustRow />

          <p className="flex items-center gap-2 text-xs text-[#94A3B8]">
            <Lock className="h-3.5 w-3.5" aria-hidden />
            Payments run on a hosted, encrypted checkout. We do not store card numbers.
          </p>
        </div>

        <aside className="hidden lg:sticky lg:top-6 lg:block">
          <CheckoutOrderSummary {...summaryProps} />
        </aside>
      </div>
    </form>
  )
}
