import { sdk } from "@/lib/medusa-client"

export type StoreCustomer = {
  id: string
  email?: string | null
  first_name?: string | null
  last_name?: string | null
}

export async function retrieveCustomer(): Promise<StoreCustomer | null> {
  try {
    const { customer } = await sdk.store.customer.retrieve()
    return customer || null
  } catch {
    return null
  }
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
