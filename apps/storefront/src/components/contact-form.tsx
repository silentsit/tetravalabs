"use client"

import { FormEvent, useState } from "react"

export function ContactForm() {
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
  )
}
