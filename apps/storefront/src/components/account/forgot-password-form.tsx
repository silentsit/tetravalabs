"use client"

import { FormEvent, useState } from "react"
import Link from "next/link"
import { FetchError } from "@medusajs/js-sdk"
import { sdk } from "@/lib/medusa-client"

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState("")
  const [loading, setLoading] = useState(false)

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setStatus("")

    try {
      await sdk.auth.resetPassword("customer", "emailpass", { identifier: email.trim() })
      setStatus(
        "If an account exists for that email, you will receive a password reset link shortly."
      )
      setEmail("")
    } catch (error) {
      const fetchError = error as FetchError
      setStatus(
        fetchError.message ||
          "Unable to request a password reset right now. Try again or contact support."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="card mx-auto max-w-md space-y-5 p-6 sm:p-8">
      <div>
        <h1 className="font-serif text-2xl text-[#0F172A]">Forgot password</h1>
        <p className="mt-2 text-sm text-[#475569]">
          Enter your account email and we will send a secure link to reset your password.
        </p>
      </div>

      <div>
        <label htmlFor="forgot-email" className="block text-sm text-[#0F172A]">
          Email address <span className="text-red-600">*</span>
        </label>
        <input
          id="forgot-email"
          required
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="input-field mt-2 rounded-md"
        />
      </div>

      <button type="submit" className="btn-primary w-full rounded-md disabled:opacity-60" disabled={loading}>
        {loading ? "Sending..." : "Email reset link"}
      </button>

      {status ? <p className="text-sm text-[#475569]">{status}</p> : null}

      <p className="text-sm text-[#64748B]">
        Remember your password?{" "}
        <Link href="/account" className="text-[#0D9488] hover:underline">
          Back to login
        </Link>
      </p>
    </form>
  )
}
