"use client"

import { useState, type FormEvent } from "react"

type Props = {
  productHandle: string
  productTitle: string
  variantId: string
  strengthLabel: string
}

export function StockNotifyForm({
  productHandle,
  productTitle,
  variantId,
  strengthLabel
}: Props) {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle")
  const [message, setMessage] = useState("")

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    setStatus("loading")
    setMessage("")

    try {
      const response = await fetch("/api/stock-notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          productHandle,
          productTitle,
          variantId,
          strengthLabel
        })
      })
      const data = (await response.json()) as { ok?: boolean; message?: string }
      if (!response.ok || !data.ok) {
        setStatus("error")
        setMessage(data.message || "Unable to save your request.")
        return
      }
      setStatus("ok")
      setMessage("We’ll email you when this strength is back in stock.")
      setEmail("")
    } catch {
      setStatus("error")
      setMessage("Unable to save your request.")
    }
  }

  return (
    <div className="card space-y-3 border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4">
      <div>
        <p className="font-serif text-base text-[color:var(--color-text)]">
          This option is out of stock
        </p>
        <p className="mt-1 text-sm text-[color:var(--color-text-secondary)]">
          Enter your email and we’ll notify you when {strengthLabel} is available again.
        </p>
      </div>
      <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          placeholder="Email address"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="input-field flex-1"
        />
        <button type="submit" className="btn-secondary" disabled={status === "loading"}>
          {status === "loading" ? "Saving…" : "Notify me when available"}
        </button>
      </form>
      {message ? (
        <p className="text-sm text-[color:var(--color-text-secondary)]" aria-live="polite">
          {message}
        </p>
      ) : null}
    </div>
  )
}
