"use client"

import { FormEvent, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { FetchError } from "@medusajs/js-sdk"
import { SocialAuthButtons } from "@/components/social-auth-buttons"
import { notifyAuthSessionChanged } from "@/lib/medusa-auth"
import { sdk } from "@/lib/medusa-client"

type Props = {
  layout?: "default" | "account"
}

function RequiredLabel({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="block text-sm text-[#0F172A]">
      {children} <span className="text-red-600">*</span>
    </label>
  )
}

export function RegisterForm({ layout = "default" }: Props) {
  const router = useRouter()
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [status, setStatus] = useState("")
  const [loading, setLoading] = useState(false)

  const isAccount = layout === "account"

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setStatus("")

    try {
      await sdk.auth.register("customer", "emailpass", { email, password })
    } catch (error) {
      const fetchError = error as FetchError
      const identityExists =
        fetchError.statusText === "Unauthorized" &&
        fetchError.message === "Identity with email already exists"

      if (!identityExists) {
        setStatus(fetchError.message || "Unable to create account.")
        setLoading(false)
        return
      }

      try {
        const loginToken = await sdk.auth.login("customer", "emailpass", { email, password })
        if (typeof loginToken !== "string") {
          setStatus("Account exists but requires additional authentication.")
          setLoading(false)
          return
        }
      } catch (loginError) {
        const loginFetchError = loginError as FetchError
        setStatus(loginFetchError.message || "An account with this email already exists.")
        setLoading(false)
        return
      }
    }

    try {
      await sdk.store.customer.create({
        first_name: firstName || "Research",
        last_name: lastName || "Customer",
        email
      })

      notifyAuthSessionChanged()
      router.push("/account")
      router.refresh()
    } catch (error) {
      const fetchError = error as FetchError
      setStatus(fetchError.message || "Account created but profile setup failed.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className={isAccount ? "space-y-5" : "card max-w-md space-y-3 p-5"}
    >
      {isAccount ? <h2 className="text-xl font-semibold text-[#0F172A]">Register</h2> : null}

      {!isAccount ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="block text-xs text-[#475569]">First Name</label>
            <input
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              className="input-field mt-1"
            />
          </div>
          <div>
            <label className="block text-xs text-[#475569]">Last Name</label>
            <input
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              className="input-field mt-1"
            />
          </div>
        </div>
      ) : null}

      <div>
        {isAccount ? (
          <RequiredLabel htmlFor="register-email">Email address</RequiredLabel>
        ) : (
          <label className="block text-xs text-[#475569]">Email</label>
        )}
        <input
          id="register-email"
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
          <RequiredLabel htmlFor="register-password">Password</RequiredLabel>
        ) : (
          <label className="block text-xs text-[#475569]">Password</label>
        )}
        <input
          id="register-password"
          required
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className={`input-field mt-2 ${isAccount ? "rounded-md" : "mt-1"}`}
        />
        {isAccount ? (
          <p className="mt-2 text-sm text-[#475569]">
            Choose a password to secure your research account.
          </p>
        ) : null}
      </div>

      {isAccount ? (
        <p className="text-sm leading-relaxed text-[#475569]">
          Your personal data will be used to support your experience throughout this website, to manage
          access to your account, and for other purposes described in our{" "}
          <Link href="/privacy" className="text-[#0F172A] underline underline-offset-2">
            privacy policy
          </Link>
          .
        </p>
      ) : null}

      <button
        disabled={loading}
        type="submit"
        className={`btn-primary disabled:opacity-60 ${isAccount ? "rounded-md px-8" : ""}`}
      >
        {loading ? "Creating account..." : isAccount ? "Register" : "Create Account"}
      </button>

      {isAccount ? <SocialAuthButtons returnUrl="/account" placement="below" /> : null}

      {status ? <p className="text-xs text-red-600">{status}</p> : null}
    </form>
  )
}
