"use client"

import { FormEvent, useState } from "react"
import { Breadcrumbs } from "@/components/breadcrumbs"

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
    <section className="page-container mx-auto max-w-4xl space-y-8 py-8">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Contact" }]} />
      <div>
        <span className="section-label">Contact</span>
        <h1 className="mt-4 font-serif text-4xl text-[#0F172A]">Contact us</h1>
        <p className="mt-4 text-[#475569]">
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
              className="input-field"
            />
            <input
              required
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email address"
              className="input-field"
            />
          </div>
          <input
            required
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            placeholder="Subject"
            className="input-field w-full"
          />
          <textarea
            required
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="How can we help?"
            rows={6}
            className="input-field w-full resize-none"
          />
          <button type="submit" disabled={loading} className="btn-primary disabled:opacity-60">
            {loading ? "Sending..." : "Send message"}
          </button>
          {error ? <p className="text-xs text-red-600">{error}</p> : null}
          {status ? <p className="text-xs text-[#475569]">{status}</p> : null}
        </form>
        <aside className="space-y-4 text-sm text-[#475569]">
          <div className="card p-4">
            <p className="font-medium text-[#0F172A]">Research support</p>
            <p className="mt-2">Typical response within 1–2 business days.</p>
          </div>
          <div className="card p-4">
            <p className="font-medium text-[#0F172A]">Order questions</p>
            <p className="mt-2">Include your order ID or display number for faster lookup.</p>
          </div>
        </aside>
      </div>
    </section>
  )
}
