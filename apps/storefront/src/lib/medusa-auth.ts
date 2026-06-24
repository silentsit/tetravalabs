import { sdk } from "@/lib/medusa-client"

export type StoreCustomer = {
  id: string
  email?: string | null
  first_name?: string | null
  last_name?: string | null
  phone?: string | null
}

export type StoreCustomerAddress = {
  id: string
  first_name?: string | null
  last_name?: string | null
  company?: string | null
  address_1?: string | null
  address_2?: string | null
  city?: string | null
  province?: string | null
  postal_code?: string | null
  country_code?: string | null
  phone?: string | null
  is_default_billing?: boolean
  is_default_shipping?: boolean
}

export async function retrieveCustomer(): Promise<StoreCustomer | null> {
  try {
    const { customer } = await sdk.store.customer.retrieve()
    return customer || null
  } catch {
    return null
  }
}

export async function updateCustomerProfile(body: {
  first_name?: string
  last_name?: string
  phone?: string
}) {
  const { customer } = await sdk.store.customer.update(body)
  return customer as StoreCustomer
}

export async function listCustomerAddresses() {
  const { addresses } = await sdk.store.customer.listAddress({ limit: 50 })
  return (addresses || []) as StoreCustomerAddress[]
}

export async function createCustomerAddress(
  body: Parameters<typeof sdk.store.customer.createAddress>[0]
) {
  const { customer } = await sdk.store.customer.createAddress(body)
  return {
    customer: customer as StoreCustomer,
    addresses: (customer?.addresses || []) as StoreCustomerAddress[]
  }
}

export async function updateCustomerAddress(
  addressId: string,
  body: Parameters<typeof sdk.store.customer.updateAddress>[1]
) {
  const { customer } = await sdk.store.customer.updateAddress(addressId, body)
  return {
    customer: customer as StoreCustomer,
    addresses: (customer?.addresses || []) as StoreCustomerAddress[]
  }
}

export async function deleteCustomerAddress(addressId: string) {
  await sdk.store.customer.deleteAddress(addressId)
}

export async function logoutCustomer() {
  try {
    await sdk.auth.logout()
  } catch {
    // Clear local session even if API logout fails.
  }
}

export function readAuthToken(): string | null {
  if (typeof window === "undefined") return null

  for (let index = 0; index < window.localStorage.length; index += 1) {
    const key = window.localStorage.key(index)
    if (!key || !key.includes("medusa") || !key.includes("auth")) continue
    const value = window.localStorage.getItem(key)
    if (value && value.startsWith("eyJ")) return value
  }

  return window.localStorage.getItem("medusa_auth_token")
}

export function formatCustomerName(customer: Pick<StoreCustomer, "first_name" | "last_name">) {
  return [customer.first_name, customer.last_name].filter(Boolean).join(" ") || "Research Customer"
}

export function formatAddressLines(address: StoreCustomerAddress) {
  const lines = [
    [address.first_name, address.last_name].filter(Boolean).join(" "),
    address.company,
    address.address_1,
    address.address_2,
    [address.city, address.province, address.postal_code].filter(Boolean).join(", "),
    address.country_code?.toUpperCase()
  ].filter(Boolean)

  return lines
}
