"use client"

import { FormEvent, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { FetchError } from "@medusajs/js-sdk"
import { AddressAutocompleteInput } from "@/components/address-autocomplete-input"
import { SocialAuthButtons } from "@/components/social-auth-buttons"
import { CHECKOUT_COUNTRIES } from "@/lib/checkout-countries"
import { CHECKOUT_US_STATES, normalizeUsStateCode } from "@/lib/checkout-us-states"
import type { ParsedAddress } from "@/lib/google-places"
import { notifyAuthSessionChanged } from "@/lib/medusa-auth"
import { sdk } from "@/lib/medusa-client"

type Props = {
  layout?: "default" | "account"
}

function RequiredLabel({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="block text-sm text-[#0F172A]">
      {children} <span className="text-red-600">*</span>
    </label>
  )
}

export function RegisterForm({ layout = "default" }: Props) {
  const router = useRouter()
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [country, setCountry] = useState("US")
  const [address1, setAddress1] = useState("")
  const [city, setCity] = useState("")
  const [province, setProvince] = useState("")
  const [postalCode, setPostalCode] = useState("")
  const [status, setStatus] = useState("")
  const [loading, setLoading] = useState(false)

  const isAccount = layout === "account"
  const isUs = country === "US"

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
    if (parsed.country && CHECKOUT_COUNTRIES.some((entry) => entry.code === parsed.country.toUpperCase())) {
      setCountry(parsed.country.toUpperCase())
    }
  }

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setStatus("")

    try {
      await sdk.auth.register("customer", "emailpass", { email, password })
    } catch (error) {
      const fetchError = error as FetchError
      const identityExists =
        fetchError.statusText === "Unauthorized" &&
        fetchError.message === "Identity with email already exists"

      if (!identityExists) {
        setStatus(fetchError.message || "Unable to create account.")
        setLoading(false)
        return
      }

      try {
        const loginToken = await sdk.auth.login("customer", "emailpass", { email, password })
        if (typeof loginToken !== "string") {
          setStatus("Account exists but requires additional authentication.")
          setLoading(false)
          return
        }
      } catch (loginError) {
        const loginFetchError = loginError as FetchError
        setStatus(loginFetchError.message || "An account with this email already exists.")
        setLoading(false)
        return
      }
    }

    try {
      await sdk.store.customer.create({
        first_name: firstName || "Research",
        last_name: lastName || "Customer",
        email
      })

      if (isAccount && address1.trim()) {
        await sdk.store.customer.createAddress({
          first_name: firstName || "Research",
          last_name: lastName || "Customer",
          address_1: address1.trim(),
          city: city.trim(),
          province: province.trim(),
          postal_code: postalCode.trim(),
          country_code: country,
          is_default_billing: true,
          is_default_shipping: true
        })
      }

      notifyAuthSessionChanged()
      router.push("/account")
      router.refresh()
    } catch (error) {
      const fetchError = error as FetchError
      setStatus(fetchError.message || "Account created but profile setup failed.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className={isAccount ? "space-y-5" : "card max-w-md space-y-3 p-5"}
    >
      {isAccount ? <h2 className="text-xl font-semibold text-[#0F172A]">Register</h2> : null}

      {!isAccount ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="block text-xs text-[#475569]">First Name</label>
            <input
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              className="input-field mt-1"
            />
          </div>
          <div>
            <label className="block text-xs text-[#475569]">Last Name</label>
            <input
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              className="input-field mt-1"
            />
          </div>
        </div>
      ) : null}

      <div>
        {isAccount ? (
          <RequiredLabel htmlFor="register-email">Email address</RequiredLabel>
        ) : (
          <label className="block text-xs text-[#475569]">Email</label>
        )}
        <input
          id="register-email"
          required
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className={`input-field mt-2 ${isAccount ? "rounded-md" : "mt-1"}`}
        />
      </div>

      <div>
        {isAccount ? (
          <RequiredLabel htmlFor="register-password">Password</RequiredLabel>
        ) : (
          <label className="block text-xs text-[#475569]">Password</label>
        )}
        <input
          id="register-password"
          required
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className={`input-field mt-2 ${isAccount ? "rounded-md" : "mt-1"}`}
        />
        {isAccount ? (
          <p className="mt-2 text-sm text-[#475569]">
            Choose a password to secure your research account.
          </p>
        ) : null}
      </div>

      {isAccount ? (
        <div className="space-y-4 rounded-md border border-[#E2E8F0] p-4">
          <div>
            <p className="text-sm font-medium text-[#0F172A]">Billing address (optional)</p>
            <p className="mt-1 text-xs text-[#64748B]">
              Save an address now for faster checkout later.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="register-first-name" className="block text-sm text-[#0F172A]">
                First name
              </label>
              <input
                id="register-first-name"
                autoComplete="given-name"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                className="input-field mt-2 rounded-md"
              />
            </div>
            <div>
              <label htmlFor="register-last-name" className="block text-sm text-[#0F172A]">
                Last name
              </label>
              <input
                id="register-last-name"
                autoComplete="family-name"
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                className="input-field mt-2 rounded-md"
              />
            </div>
          </div>

          <div>
            <label htmlFor="register-country" className="block text-sm text-[#0F172A]">
              Country / Region
            </label>
            <select
              id="register-country"
              autoComplete="country"
              value={country}
              onChange={(event) => setCountry(event.target.value)}
              className="input-field mt-2 rounded-md"
            >
              {CHECKOUT_COUNTRIES.map((entry) => (
                <option key={entry.code} value={entry.code}>
                  {entry.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="register-address" className="block text-sm text-[#0F172A]">
              Street address
            </label>
            <AddressAutocompleteInput
              id="register-address"
              value={address1}
              onChange={setAddress1}
              onAddressSelect={applyParsedAddress}
              countryCode={country}
              placeholder="Start typing your address"
              className="input-field mt-2 rounded-md"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="register-city" className="block text-sm text-[#0F172A]">
                Town / City
              </label>
              <input
                id="register-city"
                autoComplete="address-level2"
                value={city}
                onChange={(event) => setCity(event.target.value)}
                className="input-field mt-2 rounded-md"
              />
            </div>
            <div>
              <label htmlFor="register-province" className="block text-sm text-[#0F172A]">
                {isUs ? "State" : "State / County"}
              </label>
              {isUs ? (
                <select
                  id="register-province"
                  autoComplete="address-level1"
                  value={province}
                  onChange={(event) => setProvince(event.target.value)}
                  className="input-field mt-2 rounded-md"
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
                  id="register-province"
                  autoComplete="address-level1"
                  value={province}
                  onChange={(event) => setProvince(event.target.value)}
                  className="input-field mt-2 rounded-md"
                />
              )}
            </div>
          </div>

          <div>
            <label htmlFor="register-postal-code" className="block text-sm text-[#0F172A]">
              ZIP / Postcode
            </label>
            <input
              id="register-postal-code"
              autoComplete="postal-code"
              value={postalCode}
              onChange={(event) => setPostalCode(event.target.value)}
              className="input-field mt-2 rounded-md"
            />
          </div>
        </div>
      ) : null}

      {isAccount ? (
        <p className="text-sm leading-relaxed text-[#475569]">
          Your personal data will be used to support your experience throughout this website, to manage
          access to your account, and for other purposes described in our{" "}
          <Link href="/privacy" className="text-[#0F172A] underline underline-offset-2">
            privacy policy
          </Link>
          .
        </p>
      ) : null}

      <button
        disabled={loading}
        type="submit"
        className={`btn-primary disabled:opacity-60 ${isAccount ? "rounded-md px-8" : ""}`}
      >
        {loading ? "Creating account..." : isAccount ? "Register" : "Create Account"}
      </button>

      {isAccount ? <SocialAuthButtons returnUrl="/account" placement="below" /> : null}

      {status ? <p className="text-xs text-red-600">{status}</p> : null}
    </form>
  )
}
