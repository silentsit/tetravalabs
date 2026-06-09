"use client"

import { FormEvent, useState } from "react"

export default function ContactPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [status, setStatus] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setError("")
    setStatus("")

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, email, subject, message })
      })
      const json = await response.json()
      if (!response.ok || !json?.ok) {
        setError(json?.message || "Unable to send message.")
        return
      }
      setStatus(json.skipped ? "Message recorded locally (email not configured)." : "Message sent. We will reply soon.")
      setName("")
      setEmail("")
      setSubject("")
      setMessage("")
    } catch {
      setError("Could not reach contact API.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="mx-auto max-w-4xl space-y-8">
      <div>
        <p className="font-mono text-xs uppercase tracking-wider text-[#5EEAD4]">Contact</p>
        <h1 className="mt-4 font-serif text-4xl text-[#E8E8F0]">Contact Us</h1>
        <p className="mt-4 text-[#8A8AA0]">
          Reach our research support team about products, orders, COA documents, or compliance questions.
        </p>
      </div>
      <div className="grid gap-10 lg:grid-cols-[1fr_280px]">
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Your name"
              className="rounded-lg border border-white/[0.06] bg-[#0A0A10] px-4 py-3 text-sm text-[#E8E8F0] outline-none focus:border-[#5EEAD4]"
            />
            <input
              required
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email address"
              className="rounded-lg border border-white/[0.06] bg-[#0A0A10] px-4 py-3 text-sm text-[#E8E8F0] outline-none focus:border-[#5EEAD4]"
            />
          </div>
          <input
            required
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            placeholder="Subject"
            className="w-full rounded-lg border border-white/[0.06] bg-[#0A0A10] px-4 py-3 text-sm text-[#E8E8F0] outline-none focus:border-[#5EEAD4]"
          />
          <textarea
            required
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="How can we help?"
            rows={6}
            className="w-full resize-none rounded-lg border border-white/[0.06] bg-[#0A0A10] px-4 py-3 text-sm text-[#E8E8F0] outline-none focus:border-[#5EEAD4]"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-[#5EEAD4] px-6 py-2.5 text-sm font-medium text-[#050508] disabled:opacity-60"
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
          {error ? <p className="text-xs text-[#F87171]">{error}</p> : null}
          {status ? <p className="text-xs text-[#8A8AA0]">{status}</p> : null}
        </form>
        <aside className="space-y-4 text-sm text-[#8A8AA0]">
          <div className="rounded-lg border border-white/10 bg-[#0A0A10] p-4">
            <p className="text-[#E8E8F0]">Research Support</p>
            <p className="mt-2">Typical response within 1–2 business days.</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-[#0A0A10] p-4">
            <p className="text-[#E8E8F0]">Order Questions</p>
            <p className="mt-2">Include your order ID or display number for faster lookup.</p>
          </div>
        </aside>
      </div>
    </section>
  )
}
