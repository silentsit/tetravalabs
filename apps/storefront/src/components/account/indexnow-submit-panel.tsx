"use client"

import { useEffect, useState } from "react"
import { readAuthToken } from "@/lib/medusa-auth"

const LAST_RUN_KEY = "tetrava.indexnow.lastRun"

type IndexNowStatus = {
  configured: boolean
  searchConsoleConfigured?: boolean
  urlCount: number
}

type LastRun = {
  at: string
  submitted: number
}

type IndexNowSubmitResult = {
  ok: boolean
  skipped?: boolean
  status?: number
  submitted: number
  urlCount?: number
  submittedAt?: string
  message?: string
}

function authHeaders(): HeadersInit {
  const token = readAuthToken()
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  }
}

function readLastRun(): LastRun | null {
  try {
    const raw = localStorage.getItem(LAST_RUN_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as LastRun
    if (!parsed.at) return null
    return parsed
  } catch {
    return null
  }
}

function writeLastRun(run: LastRun) {
  localStorage.setItem(LAST_RUN_KEY, JSON.stringify(run))
}

function formatRun(at: string) {
  try {
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short"
    }).format(new Date(at))
  } catch {
    return at
  }
}

export function IndexNowSubmitPanel() {
  const [status, setStatus] = useState<IndexNowStatus | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<IndexNowSubmitResult | null>(null)
  const [lastRun, setLastRun] = useState<LastRun | null>(null)

  useEffect(() => {
    setLastRun(readLastRun())
    let cancelled = false
    void (async () => {
      try {
        const response = await fetch("/api/admin/indexnow", {
          headers: authHeaders(),
          cache: "no-store"
        })
        const data = (await response.json()) as IndexNowStatus & { message?: string }
        if (cancelled) return
        if (!response.ok) {
          setLoadError(data.message || "Could not load indexing status.")
          return
        }
        setStatus({
          configured: data.configured,
          searchConsoleConfigured: data.searchConsoleConfigured,
          urlCount: data.urlCount
        })
      } catch {
        if (!cancelled) setLoadError("Could not load indexing status.")
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const onSubmit = async () => {
    setSubmitting(true)
    setResult(null)
    try {
      const response = await fetch("/api/admin/indexnow", {
        method: "POST",
        headers: authHeaders()
      })
      const data = (await response.json()) as IndexNowSubmitResult
      setResult(data)
      if (data.ok) {
        const run = { at: data.submittedAt || new Date().toISOString(), submitted: data.submitted }
        writeLastRun(run)
        setLastRun(run)
      }
    } catch {
      setResult({ ok: false, submitted: 0, message: "Submit failed. Try again." })
    } finally {
      setSubmitting(false)
    }
  }

  if (loadError) {
    return <p className="text-sm text-[#475569]">{loadError}</p>
  }

  if (!status) {
    return <p className="text-sm text-[#475569]">Loading sitemap URLs...</p>
  }

  return (
    <div className="card space-y-5 p-6">
      <p className="text-sm leading-relaxed text-[#475569]">
        Ping IndexNow with every public sitemap URL: pages, products, categories, and Research Hub
        posts. Bing, Yandex, and Google&apos;s IndexNow endpoint pick this up. It is not Google
        Search Console URL Inspection, and it does not force an immediate recrawl.
      </p>
      <p className="font-mono text-sm text-[#0F172A]">
        {status.urlCount} URL{status.urlCount === 1 ? "" : "s"} ready
      </p>
      {lastRun ? (
        <p className="text-sm text-[#475569]">
          Last run on this browser: {formatRun(lastRun.at)} ({lastRun.submitted} URL
          {lastRun.submitted === 1 ? "" : "s"})
        </p>
      ) : (
        <p className="text-sm text-[#475569]">No submit from this browser yet.</p>
      )}
      {!status.configured ? (
        <p className="text-sm text-[#D97706]">INDEXNOW_KEY is not set on this deployment.</p>
      ) : null}
      {status.searchConsoleConfigured ? (
        <p className="text-sm text-[#475569]">Search Console sitemap ping is also enabled.</p>
      ) : null}
      <button
        type="button"
        onClick={() => void onSubmit()}
        disabled={submitting || !status.configured}
        className="btn-primary min-h-11 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Submitting..." : "Submit all URLs to search engines"}
      </button>
      {result ? (
        <p className={`text-sm ${result.ok ? "text-[#0D9488]" : "text-[#B91C1C]"}`}>
          {result.ok
            ? `Submitted ${result.submitted} URL${result.submitted === 1 ? "" : "s"}${
                result.status ? ` (HTTP ${result.status})` : ""
              }.`
            : result.message || "IndexNow rejected the request."}
        </p>
      ) : null}
    </div>
  )
}
