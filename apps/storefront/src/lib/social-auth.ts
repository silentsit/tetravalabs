import { sdk } from "@/lib/medusa-client"
import { readAuthToken } from "@/lib/medusa-auth"
import {
  OAUTH_RETURN_URL_KEY,
  oauthCallbackUrl,
  type SocialAuthProvider
} from "@/lib/social-auth-config"

const MEDUSA_URL = (process.env.NEXT_PUBLIC_MEDUSA_URL || "http://localhost:9000").replace(/\/$/, "")
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

export async function startSocialAuth(provider: SocialAuthProvider, returnUrl = "/account") {
  if (typeof window !== "undefined") {
    window.sessionStorage.setItem(OAUTH_RETURN_URL_KEY, returnUrl)
  }

  const result = await sdk.auth.login("customer", provider, {
    callback_url: oauthCallbackUrl(provider)
  })

  if (typeof result === "object" && result && "location" in result && result.location) {
    window.location.href = result.location
    return
  }

  throw new Error("Unable to start social sign-in.")
}

export async function completeSocialAuth(
  provider: SocialAuthProvider,
  query: Record<string, string>
) {
  const result = await sdk.auth.callback("customer", provider, query)

  if (typeof result !== "string") {
    throw new Error("Social sign-in requires additional steps.")
  }

  try {
    const { customer } = await sdk.store.customer.retrieve()
    if (customer) return customer
  } catch {
    // Customer profile not linked yet.
  }

  const token = readAuthToken() || result
  const response = await fetch(`${MEDUSA_URL}/store/auth/oauth-complete`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "x-publishable-api-key": PUBLISHABLE_KEY
    }
  })

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { message?: string } | null
    throw new Error(payload?.message || "Unable to finish social sign-in.")
  }

  const { customer } = await sdk.store.customer.retrieve()
  return customer
}

export function readOAuthReturnUrl(fallback = "/account") {
  if (typeof window === "undefined") return fallback
  return window.sessionStorage.getItem(OAUTH_RETURN_URL_KEY) || fallback
}

export function clearOAuthReturnUrl() {
  if (typeof window === "undefined") return
  window.sessionStorage.removeItem(OAUTH_RETURN_URL_KEY)
}
