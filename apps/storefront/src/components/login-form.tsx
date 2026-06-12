"use client"

import { FormEvent, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { FetchError } from "@medusajs/js-sdk"
import { sdk } from "@/lib/medusa-client"

function safeReturnUrl(url: string) {
  if (!url.startsWith("/") || url.startsWith("//")) return "/account"
  return url
}

type Props = {
  returnUrl?: string
}

export function LoginForm({ returnUrl = "/account" }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("returnUrl") || returnUrl
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [status, setStatus] = useState("")
  const [loading, setLoading] = useState(false)

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
      router.push(safeReturnUrl(redirectTo))
    } catch (error) {
      const fetchError = error as FetchError
      setStatus(fetchError.message || "Unable to sign in. Check your credentials.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="card max-w-md space-y-3 p-5">
      <div>
        <label className="block text-xs text-[#475569]">Email</label>
        <input
          required
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="input-field mt-1"
        />
      </div>
      <div>
        <label className="block text-xs text-[#475569]">Password</label>
        <input
          required
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="input-field mt-1"
        />
      </div>
      <button disabled={loading} className="btn-primary disabled:opacity-60">
        {loading ? "Signing in..." : "Sign In"}
      </button>
      {status ? <p className="text-xs text-red-600">{status}</p> : null}
    </form>
  )
}
