"use client"

import { Suspense } from "react"
import { LoginForm } from "@/components/login-form"
import { RegisterForm } from "@/components/register-form"

export function AccountAuthPanel() {
  return (
    <div className="grid gap-12 lg:grid-cols-2 lg:gap-0">
      <div className="lg:border-r lg:border-dotted lg:border-[#CBD5E1] lg:pr-12 xl:pr-16">
        <Suspense fallback={<p className="text-sm text-[#475569]">Loading...</p>}>
          <LoginForm layout="account" />
        </Suspense>
      </div>
      <div className="lg:pl-12 xl:pl-16">
        <RegisterForm layout="account" />
      </div>
    </div>
  )
}
