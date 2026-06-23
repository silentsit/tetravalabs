export type SocialAuthProvider = "google" | "apple"

function isEnabled(flag: string | undefined) {
  return flag !== "false"
}

export const socialAuthConfig = {
  google: isEnabled(process.env.NEXT_PUBLIC_AUTH_GOOGLE_ENABLED),
  apple: isEnabled(process.env.NEXT_PUBLIC_AUTH_APPLE_ENABLED)
} as const

export function isSocialAuthEnabled() {
  return socialAuthConfig.google || socialAuthConfig.apple
}

export function oauthCallbackUrl(provider: SocialAuthProvider) {
  if (typeof window === "undefined") return ""
  return `${window.location.origin}/account/oauth/${provider}/callback`
}

export const OAUTH_RETURN_URL_KEY = "tetrava_oauth_return_url"
