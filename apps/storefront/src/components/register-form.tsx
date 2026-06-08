"use client"

import { FormEvent, useState } from "react"
import { useRouter } from "next/navigation"
import { FetchError } from "@medusajs/js-sdk"
import { sdk } from "@/lib/medusa-client"

export function RegisterForm() {
  const router = useRouter()
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [ruoAck, setRuoAck] = useState(false)
  const [status, setStatus] = useState("")
  const [loading, setLoading] = useState(false)

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!ruoAck) {
      setStatus("Please acknowledge research-use-only terms.")
      return
    }

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
      router.push("/account")
    } catch (error) {
      const fetchError = error as FetchError
      setStatus(fetchError.message || "Account created but profile setup failed.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-md space-y-3 rounded-lg border border-white/10 bg-[#0A0A10] p-5">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="block text-xs text-[#8A8AA0]">First Name</label>
          <input
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            className="mt-1 w-full rounded border border-white/20 bg-[#050508] px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-xs text-[#8A8AA0]">Last Name</label>
          <input
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            className="mt-1 w-full rounded border border-white/20 bg-[#050508] px-3 py-2"
          />
        </div>
      </div>
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
      <label className="flex items-start gap-2 text-xs text-[#8A8AA0]">
        <input
          checked={ruoAck}
          onChange={(event) => setRuoAck(event.target.checked)}
          type="checkbox"
          className="mt-1"
        />
        I acknowledge research-use-only terms and confirm I am not purchasing for human consumption.
      </label>
      <button
        disabled={loading}
        className="rounded bg-[#5EEAD4] px-4 py-2 text-sm font-medium text-[#050508] disabled:opacity-60"
      >
        {loading ? "Creating account..." : "Create Account"}
      </button>
      {status ? <p className="text-xs text-[#F87171]">{status}</p> : null}
    </form>
  )
}
