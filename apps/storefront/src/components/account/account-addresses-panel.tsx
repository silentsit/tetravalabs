"use client"

import { FormEvent, useEffect, useState } from "react"
import { AddressAutocompleteInput } from "@/components/address-autocomplete-input"
import { AccountEmptyNotice } from "@/components/account/account-empty-notice"
import { CHECKOUT_COUNTRIES } from "@/lib/checkout-countries"
import { CHECKOUT_US_STATES, normalizeUsStateCode } from "@/lib/checkout-us-states"
import type { ParsedAddress } from "@/lib/google-places"
import {
  createCustomerAddress,
  deleteCustomerAddress,
  formatAddressLines,
  listCustomerAddresses,
  updateCustomerAddress,
  type StoreCustomerAddress
} from "@/lib/medusa-auth"
import { MapPin } from "lucide-react"

type AddressFormState = {
  first_name: string
  last_name: string
  company: string
  address_1: string
  address_2: string
  city: string
  province: string
  postal_code: string
  country_code: string
  phone: string
  is_default_billing: boolean
  is_default_shipping: boolean
}

const EMPTY_FORM: AddressFormState = {
  first_name: "",
  last_name: "",
  company: "",
  address_1: "",
  address_2: "",
  city: "",
  province: "",
  postal_code: "",
  country_code: "US",
  phone: "",
  is_default_billing: false,
  is_default_shipping: false
}

function RequiredLabel({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="block text-sm text-[#0F172A]">
      {children} <span className="text-red-600">*</span>
    </label>
  )
}

export function AccountAddressesPanel() {
  const [addresses, setAddresses] = useState<StoreCustomerAddress[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<AddressFormState>(EMPTY_FORM)
  const [status, setStatus] = useState("")
  const [saving, setSaving] = useState(false)

  const loadAddresses = async () => {
    setLoading(true)
    const rows = await listCustomerAddresses()
    setAddresses(rows)
    setLoading(false)
  }

  useEffect(() => {
    void loadAddresses()
  }, [])

  const isUs = form.country_code === "US"

  const applyParsedAddress = (parsed: ParsedAddress) => {
    if (parsed.address1) setForm((prev) => ({ ...prev, address_1: parsed.address1 }))
    if (parsed.city) setForm((prev) => ({ ...prev, city: parsed.city }))
    if (parsed.province) {
      setForm((prev) => ({
        ...prev,
        province:
          parsed.country.toUpperCase() === "US" || prev.country_code === "US"
            ? normalizeUsStateCode(parsed.province)
            : parsed.province
      }))
    }
    if (parsed.postalCode) setForm((prev) => ({ ...prev, postal_code: parsed.postalCode }))
    if (parsed.country && CHECKOUT_COUNTRIES.some((entry) => entry.code === parsed.country.toUpperCase())) {
      setForm((prev) => ({ ...prev, country_code: parsed.country.toUpperCase() }))
    }
  }

  const openCreateForm = () => {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setShowForm(true)
    setStatus("")
  }

  const openEditForm = (address: StoreCustomerAddress) => {
    setEditingId(address.id)
    setForm({
      first_name: address.first_name || "",
      last_name: address.last_name || "",
      company: address.company || "",
      address_1: address.address_1 || "",
      address_2: address.address_2 || "",
      city: address.city || "",
      province: address.province || "",
      postal_code: address.postal_code || "",
      country_code: (address.country_code || "US").toUpperCase(),
      phone: address.phone || "",
      is_default_billing: Boolean(address.is_default_billing),
      is_default_shipping: Boolean(address.is_default_shipping)
    })
    setShowForm(true)
    setStatus("")
  }

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setSaving(true)
    setStatus("")

    try {
      const payload = {
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        company: form.company.trim() || undefined,
        address_1: form.address_1.trim(),
        address_2: form.address_2.trim() || undefined,
        city: form.city.trim(),
        province: form.province.trim(),
        postal_code: form.postal_code.trim(),
        country_code: form.country_code,
        phone: form.phone.trim() || undefined,
        is_default_billing: form.is_default_billing,
        is_default_shipping: form.is_default_shipping
      }

      if (editingId) {
        await updateCustomerAddress(editingId, payload)
        setStatus("Address updated.")
      } else {
        await createCustomerAddress(payload)
        setStatus("Address added.")
      }

      setShowForm(false)
      setEditingId(null)
      setForm(EMPTY_FORM)
      await loadAddresses()
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to save address.")
    } finally {
      setSaving(false)
    }
  }

  const onDelete = async (addressId: string) => {
    if (!window.confirm("Delete this address?")) return
    setSaving(true)
    setStatus("")
    try {
      await deleteCustomerAddress(addressId)
      setStatus("Address deleted.")
      if (editingId === addressId) {
        setShowForm(false)
        setEditingId(null)
        setForm(EMPTY_FORM)
      }
      await loadAddresses()
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to delete address.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <p className="text-sm text-[#475569]">Loading addresses...</p>
  }

  return (
    <div className="space-y-6">
      <p className="text-sm leading-relaxed text-[#475569]">
        The following addresses will be used on the checkout page by default.
      </p>

      {!addresses.length && !showForm ? (
        <AccountEmptyNotice
          icon={MapPin}
          message="You have not set up any addresses yet."
          actionLabel="Add address"
          onAction={openCreateForm}
        />
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        {addresses.map((address) => (
          <div key={address.id} className="card p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-[#0F172A]">
                  {address.is_default_shipping ? "Default shipping" : "Address"}
                  {address.is_default_billing ? " · Default billing" : ""}
                </p>
                <div className="mt-2 space-y-1 text-sm text-[#475569]">
                  {formatAddressLines(address).map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" className="btn-secondary px-4 py-2 text-xs" onClick={() => openEditForm(address)}>
                Edit
              </button>
              <button
                type="button"
                className="px-4 py-2 text-xs text-red-600 hover:underline"
                onClick={() => void onDelete(address.id)}
                disabled={saving}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {showForm ? (
        <form id="add-address" onSubmit={onSubmit} className="card space-y-4 p-5">
          <h3 className="text-lg text-[#0F172A]">{editingId ? "Edit address" : "Add address"}</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <RequiredLabel htmlFor="addr-first-name">First name</RequiredLabel>
              <input
                id="addr-first-name"
                className="input-field mt-1"
                value={form.first_name}
                onChange={(event) => setForm((prev) => ({ ...prev, first_name: event.target.value }))}
                required
              />
            </div>
            <div>
              <RequiredLabel htmlFor="addr-last-name">Last name</RequiredLabel>
              <input
                id="addr-last-name"
                className="input-field mt-1"
                value={form.last_name}
                onChange={(event) => setForm((prev) => ({ ...prev, last_name: event.target.value }))}
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="addr-company" className="block text-sm text-[#0F172A]">
              Company
            </label>
            <input
              id="addr-company"
              className="input-field mt-1"
              value={form.company}
              onChange={(event) => setForm((prev) => ({ ...prev, company: event.target.value }))}
            />
          </div>

          <div>
            <RequiredLabel htmlFor="addr-country">Country</RequiredLabel>
            <select
              id="addr-country"
              className="input-field mt-1"
              value={form.country_code}
              onChange={(event) => setForm((prev) => ({ ...prev, country_code: event.target.value }))}
            >
              {CHECKOUT_COUNTRIES.map((entry) => (
                <option key={entry.code} value={entry.code}>
                  {entry.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <RequiredLabel htmlFor="addr-line1">Street address</RequiredLabel>
            <AddressAutocompleteInput
              id="addr-line1"
              className="input-field mt-1"
              value={form.address_1}
              countryCode={form.country_code}
              onChange={(value) => setForm((prev) => ({ ...prev, address_1: value }))}
              onAddressSelect={applyParsedAddress}
              required
            />
          </div>

          <div>
            <label htmlFor="addr-line2" className="block text-sm text-[#0F172A]">
              Apartment, suite, etc.
            </label>
            <input
              id="addr-line2"
              className="input-field mt-1"
              value={form.address_2}
              onChange={(event) => setForm((prev) => ({ ...prev, address_2: event.target.value }))}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <RequiredLabel htmlFor="addr-city">City</RequiredLabel>
              <input
                id="addr-city"
                className="input-field mt-1"
                value={form.city}
                onChange={(event) => setForm((prev) => ({ ...prev, city: event.target.value }))}
                required
              />
            </div>
            <div>
              <RequiredLabel htmlFor="addr-province">{isUs ? "State" : "State / province"}</RequiredLabel>
              {isUs ? (
                <select
                  id="addr-province"
                  className="input-field mt-1"
                  value={form.province}
                  onChange={(event) => setForm((prev) => ({ ...prev, province: event.target.value }))}
                  required
                >
                  <option value="">Select state</option>
                  {CHECKOUT_US_STATES.map((entry) => (
                    <option key={entry.code} value={entry.code}>
                      {entry.name}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  id="addr-province"
                  className="input-field mt-1"
                  value={form.province}
                  onChange={(event) => setForm((prev) => ({ ...prev, province: event.target.value }))}
                  required
                />
              )}
            </div>
          </div>

          <div>
            <RequiredLabel htmlFor="addr-postal">ZIP / postal code</RequiredLabel>
            <input
              id="addr-postal"
              className="input-field mt-1"
              value={form.postal_code}
              onChange={(event) => setForm((prev) => ({ ...prev, postal_code: event.target.value }))}
              required
            />
          </div>

          <div>
            <label htmlFor="addr-phone" className="block text-sm text-[#0F172A]">
              Phone
            </label>
            <input
              id="addr-phone"
              className="input-field mt-1"
              value={form.phone}
              onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
            />
          </div>

          <div className="space-y-2 text-sm text-[#475569]">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.is_default_shipping}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, is_default_shipping: event.target.checked }))
                }
              />
              Set as default shipping address
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.is_default_billing}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, is_default_billing: event.target.checked }))
                }
              />
              Set as default billing address
            </label>
          </div>

          <div className="flex flex-wrap gap-3">
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? "Saving..." : editingId ? "Save address" : "Add address"}
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                setShowForm(false)
                setEditingId(null)
                setForm(EMPTY_FORM)
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : addresses.length > 0 ? (
        <button type="button" className="btn-primary" onClick={openCreateForm}>
          Add address
        </button>
      ) : null}

      {status ? <p className="text-sm text-[#475569]">{status}</p> : null}
    </div>
  )
}
