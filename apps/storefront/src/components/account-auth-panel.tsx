"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { LoginForm } from "@/components/login-form"
import { RegisterForm } from "@/components/register-form"

function safeReturnUrl(url: string | null) {
  if (!url || !url.startsWith("/") || url.startsWith("//")) return "/account"
  return url
}

function AccountAuthPanelContent() {
  const searchParams = useSearchParams()
  const returnUrl = safeReturnUrl(searchParams.get("returnUrl"))

  return (
    <div className="grid min-h-[1900px] gap-8 lg:min-h-[760px] lg:grid-cols-2 lg:gap-0">
      <div className="lg:border-r lg:border-dotted lg:border-[#CBD5E1] lg:pr-12 xl:pr-16">
        <Suspense fallback={<p className="text-sm text-[#475569]">Loading...</p>}>
          <LoginForm layout="account" returnUrl={returnUrl} />
        </Suspense>
      </div>
      <div className="lg:pl-12 xl:pl-16">
        <RegisterForm layout="account" returnUrl={returnUrl} />
      </div>
    </div>
  )
}

export function AccountAuthPanel() {
  return (
    <Suspense fallback={<p className="text-sm text-[#475569]">Loading...</p>}>
      <AccountAuthPanelContent />
    </Suspense>
  )
}
