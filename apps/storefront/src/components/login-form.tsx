"use client"

import { FormEvent, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"
import { FetchError } from "@medusajs/js-sdk"
import { SocialAuthButtons } from "@/components/social-auth-buttons"
import { notifyAuthSessionChanged } from "@/lib/medusa-auth"
import { sdk } from "@/lib/medusa-client"

const REMEMBER_EMAIL_KEY = "tetrava_remember_email"

function safeReturnUrl(url: string) {
  if (!url.startsWith("/") || url.startsWith("//")) return "/account"
  return url
}

type Props = {
  returnUrl?: string
  layout?: "default" | "account"
}

function RequiredLabel({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="block text-sm text-[#0F172A]">
      {children} <span className="text-red-600">*</span>
    </label>
  )
}

export function LoginForm({ returnUrl = "/account", layout = "default" }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("returnUrl") || returnUrl
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [status, setStatus] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (layout !== "account" || typeof window === "undefined") return
    const savedEmail = window.localStorage.getItem(REMEMBER_EMAIL_KEY)
    if (savedEmail) {
      setEmail(savedEmail)
      setRememberMe(true)
    }
  }, [layout])

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setStatus("")

    try {
      const token = await sdk.auth.login("customer", "emailpass", { email, password })
      if (typeof token !== "string") {
        setStatus("Additional authentication steps are required.")
        return
      }

      if (layout === "account" && typeof window !== "undefined") {
        if (rememberMe) {
          window.localStorage.setItem(REMEMBER_EMAIL_KEY, email)
        } else {
          window.localStorage.removeItem(REMEMBER_EMAIL_KEY)
        }
      }

      notifyAuthSessionChanged()
      router.push(safeReturnUrl(redirectTo))
      router.refresh()
    } catch (error) {
      const fetchError = error as FetchError
      setStatus(fetchError.message || "Unable to sign in. Check your credentials.")
    } finally {
      setLoading(false)
    }
  }

  const isAccount = layout === "account"

  return (
    <form
      onSubmit={onSubmit}
      className={isAccount ? "space-y-5" : "card max-w-md space-y-3 p-5"}
    >
      {isAccount ? <h2 className="text-xl font-semibold text-[#0F172A]">Login</h2> : null}

      <div>
        {isAccount ? (
          <RequiredLabel htmlFor="login-email">Email address</RequiredLabel>
        ) : (
          <label className="block text-xs text-[#475569]">Email</label>
        )}
        <input
          id="login-email"
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
          <RequiredLabel htmlFor="login-password">Password</RequiredLabel>
        ) : (
          <label className="block text-xs text-[#475569]">Password</label>
        )}
        <div className={`relative ${isAccount ? "mt-2" : "mt-1"}`}>
          <input
            id="login-password"
            required
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className={`input-field ${isAccount ? "rounded-md pr-11" : showPassword ? "pr-11" : ""}`}
          />
          {isAccount ? (
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#0F172A]"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          ) : null}
        </div>
      </div>

      {isAccount ? (
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 text-sm text-[#475569]">
            <input
              checked={rememberMe}
              onChange={(event) => setRememberMe(event.target.checked)}
              type="checkbox"
              className="h-4 w-4 rounded border-[#CBD5E1] text-[#0D9488] focus:ring-[#0D9488]"
            />
            Remember me
          </label>
          <button
            disabled={loading}
            type="submit"
            className="btn-primary rounded-md px-8 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Log in"}
          </button>
        </div>
      ) : (
        <button disabled={loading} className="btn-primary disabled:opacity-60">
          {loading ? "Signing in..." : "Sign In"}
        </button>
      )}

      {isAccount ? (
        <Link
          href="/account/forgot-password"
          className="inline-block text-sm text-[#0F172A] underline underline-offset-2"
        >
          Lost your password?
        </Link>
      ) : null}

      {isAccount ? (
        <SocialAuthButtons returnUrl={safeReturnUrl(redirectTo)} placement="below" />
      ) : null}

      {status ? <p className="text-xs text-red-600">{status}</p> : null}
    </form>
  )
}
