"use client"

import { FormEvent, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { FetchError } from "@medusajs/js-sdk"
import { sdk } from "@/lib/medusa-client"

export function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token") || ""
  const email = searchParams.get("email") || ""
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [status, setStatus] = useState("")
  const [loading, setLoading] = useState(false)

  const missingParams = useMemo(() => !token || !email, [email, token])

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()

    if (password.length < 8) {
      setStatus("Password must be at least 8 characters.")
      return
    }

    if (password !== confirmPassword) {
      setStatus("Passwords do not match.")
      return
    }

    setLoading(true)
    setStatus("")

    try {
      await sdk.auth.updateProvider("customer", "emailpass", { password }, token)
      setStatus("Password updated. Redirecting to login...")
      window.setTimeout(() => router.replace("/account"), 1500)
    } catch (error) {
      const fetchError = error as FetchError
      setStatus(
        fetchError.message ||
          "Unable to reset your password. The link may have expired — request a new one."
      )
    } finally {
      setLoading(false)
    }
  }

  if (missingParams) {
    return (
      <div className="card mx-auto max-w-md space-y-4 p-6 sm:p-8">
        <h1 className="font-serif text-2xl text-[#0F172A]">Invalid reset link</h1>
        <p className="text-sm text-[#475569]">
          This password reset link is incomplete or expired. Request a new link to continue.
        </p>
        <Link href="/account/forgot-password" className="btn-primary inline-block rounded-md px-6 py-3">
          Request new link
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="card mx-auto max-w-md space-y-5 p-6 sm:p-8">
      <div>
        <h1 className="font-serif text-2xl text-[#0F172A]">Choose a new password</h1>
        <p className="mt-2 text-sm text-[#475569]">
          Resetting password for <span className="font-medium text-[#0F172A]">{email}</span>.
        </p>
      </div>

      <div>
        <label htmlFor="reset-password" className="block text-sm text-[#0F172A]">
          New password <span className="text-red-600">*</span>
        </label>
        <input
          id="reset-password"
          required
          type="password"
          autoComplete="new-password"
          minLength={8}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="input-field mt-2 rounded-md"
        />
      </div>

      <div>
        <label htmlFor="reset-password-confirm" className="block text-sm text-[#0F172A]">
          Confirm password <span className="text-red-600">*</span>
        </label>
        <input
          id="reset-password-confirm"
          required
          type="password"
          autoComplete="new-password"
          minLength={8}
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          className="input-field mt-2 rounded-md"
        />
      </div>

      <button type="submit" className="btn-primary w-full rounded-md disabled:opacity-60" disabled={loading}>
        {loading ? "Updating..." : "Update password"}
      </button>

      {status ? <p className="text-sm text-[#475569]">{status}</p> : null}

      <p className="text-sm text-[#64748B]">
        Need a new link?{" "}
        <Link href="/account/forgot-password" className="text-[#0D9488] hover:underline">
          Request another reset
        </Link>
      </p>
    </form>
  )
}
