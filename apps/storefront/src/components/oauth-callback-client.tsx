"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { notifyAuthSessionChanged } from "@/lib/medusa-auth"
import {
  clearOAuthReturnUrl,
  completeSocialAuth,
  readOAuthReturnUrl
} from "@/lib/social-auth"
import type { SocialAuthProvider } from "@/lib/social-auth-config"

type Props = {
  provider: SocialAuthProvider
}

export function OAuthCallbackClient({ provider }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [message, setMessage] = useState("Completing sign-in...")

  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries())
    const returnUrl = readOAuthReturnUrl("/account")

    void completeSocialAuth(provider, params)
      .then(() => {
        clearOAuthReturnUrl()
        notifyAuthSessionChanged()
        router.replace(returnUrl.startsWith("/") ? returnUrl : "/account")
        router.refresh()
      })
      .catch((error) => {
        const text = error instanceof Error ? error.message : "Unable to complete sign-in."
        setMessage(text)
      })
  }, [provider, router, searchParams])

  return <p className="text-sm text-[#475569]">{message}</p>
}
