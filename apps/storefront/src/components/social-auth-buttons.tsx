"use client"

import { useState } from "react"
import { startSocialAuth } from "@/lib/social-auth"
import { isSocialAuthEnabled, socialAuthConfig } from "@/lib/social-auth-config"

type Props = {
  returnUrl?: string
  placement?: "above" | "below"
}

function GoogleIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  )
}

function AppleIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-current">
      <path d="M16.365 12.636c.02 2.14 1.873 2.858 1.898 2.872-.016.05-.297 1.017-.98 2.016-.59.86-1.2 1.716-2.163 1.733-.94.016-1.24-.555-2.315-.555-1.075 0-1.412.538-2.304.572-.936.034-1.65-.94-2.24-1.796-1.22-1.767-2.154-4.985-.918-7.14 1.22-2.12 3.4-3.45 5.35-3.484 1.005-.017 1.952.67 2.575.67.623 0 1.79-.828 3.02-.706.514.021 1.956.208 2.88 1.566-.075.046-1.72 1.004-1.698 2.992M13.92 4.24c.545-.66 1.43-1.105 2.265-1.17.107 1-.305 2.01-.92 2.704-.58.67-1.54 1.19-2.4 1.12-.125-.97.355-1.97.955-2.654" />
    </svg>
  )
}

export function SocialAuthButtons({ returnUrl = "/account", placement = "above" }: Props) {
  const [status, setStatus] = useState("")
  const [loadingProvider, setLoadingProvider] = useState<"google" | "apple" | null>(null)

  if (!isSocialAuthEnabled()) return null

  const onSocialAuth = async (provider: "google" | "apple") => {
    setLoadingProvider(provider)
    setStatus("")
    try {
      await startSocialAuth(provider, returnUrl)
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to continue with social sign-in."
      setStatus(message)
      setLoadingProvider(null)
    }
  }

  const divider = (
    <div className="relative py-1">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-[#E2E8F0]" />
      </div>
      <div className="relative flex justify-center">
        <span className="bg-white px-3 text-xs uppercase tracking-wide text-[#94A3B8]">
          {placement === "below" ? "Or continue with" : "Or continue with email"}
        </span>
      </div>
    </div>
  )

  return (
    <div className="space-y-3">
      {placement === "above" ? divider : null}

      {socialAuthConfig.google ? (
        <button
          type="button"
          disabled={loadingProvider !== null}
          onClick={() => void onSocialAuth("google")}
          className="flex h-11 w-full items-center justify-center gap-3 rounded-md border border-[#E2E8F0] bg-white px-4 text-sm font-medium text-[#0F172A] transition-colors hover:border-[#CBD5E1] hover:bg-[#F8FAFC] disabled:opacity-60"
        >
          <GoogleIcon />
          {loadingProvider === "google" ? "Redirecting..." : "Continue with Google"}
        </button>
      ) : null}

      {socialAuthConfig.apple ? (
        <button
          type="button"
          disabled={loadingProvider !== null}
          onClick={() => void onSocialAuth("apple")}
          className="flex h-11 w-full items-center justify-center gap-3 rounded-md border border-[#0F172A] bg-[#0F172A] px-4 text-sm font-medium text-white transition-colors hover:bg-black disabled:opacity-60"
        >
          <AppleIcon />
          {loadingProvider === "apple" ? "Redirecting..." : "Continue with Apple"}
        </button>
      ) : null}

      {placement === "below" ? divider : null}

      {status ? <p className="text-xs text-red-600">{status}</p> : null}
    </div>
  )
}
