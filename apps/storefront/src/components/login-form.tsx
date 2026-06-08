"use client"

import { FormEvent, useState } from "react"
import { useRouter } from "next/navigation"
import { FetchError } from "@medusajs/js-sdk"
import { sdk } from "@/lib/medusa-client"

export function LoginForm() {
  const router = useRouter()
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
      router.push("/account")
    } catch (error) {
      const fetchError = error as FetchError
      setStatus(fetchError.message || "Unable to sign in. Check your credentials.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-md space-y-3 rounded-lg border border-white/10 bg-[#0A0A10] p-5">
      <div>
        <label className="block text-xs text-[#8A8AA0]">Email</label>
        <input
          required
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="mt-1 w-full rounded border border-white/20 bg-[#050508] px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-xs text-[#8A8AA0]">Password</label>
        <input
          required
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-1 w-full rounded border border-white/20 bg-[#050508] px-3 py-2"
        />
      </div>
      <button
        disabled={loading}
        className="rounded bg-[#5EEAD4] px-4 py-2 text-sm font-medium text-[#050508] disabled:opacity-60"
      >
        {loading ? "Signing in..." : "Sign In"}
      </button>
      {status ? <p className="text-xs text-[#F87171]">{status}</p> : null}
    </form>
  )
}
