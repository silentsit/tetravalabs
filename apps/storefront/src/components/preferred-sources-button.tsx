"use client"

import { useEffect } from "react"
import { siteConfig } from "@/lib/seo"

type PreferredSourceClient = {
  init: (options: { theme?: "light" | "dark"; lang?: string }) => void
  addPreferredSource: () => void
}

type PreferredSourceWindow = Window & {
  PREFERRED_SOURCE?: Array<(client: PreferredSourceClient) => void>
}

let preferredSourceClient: PreferredSourceClient | null = null
let scriptQueued = false

function preferredSourceQuery() {
  try {
    return new URL(siteConfig.url).hostname.replace(/^www\./, "")
  } catch {
    return "tetravalabs.com"
  }
}

function loadPreferredSourcesLibrary() {
  if (typeof window === "undefined" || scriptQueued) return
  scriptQueued = true

  const w = window as PreferredSourceWindow
  w.PREFERRED_SOURCE = w.PREFERRED_SOURCE || []
  w.PREFERRED_SOURCE.push((client) => {
    client.init({ theme: "light", lang: "en" })
    preferredSourceClient = client
  })

  if (document.querySelector("script[data-tetrava-preferred-sources]")) return

  const script = document.createElement("script")
  script.src = "https://news.google.com/swg/js/v1/publisher.js"
  script.async = true
  script.setAttribute("preferred-sources-control", "manual")
  script.dataset.tetravaPreferredSources = "1"
  document.head.appendChild(script)
}

function GoogleGMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" aria-hidden>
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.82-.07-1.64-.23-2.43H12v4.6h6.46a5.52 5.52 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.55-5.17 3.55-8.8z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.07 7.95-2.93l-3.88-3c-1.08.73-2.47 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.27v3.09A12 12 0 0 0 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.27A7.21 7.21 0 0 1 4.89 12c0-.79.14-1.56.38-2.27V6.64H1.27A12 12 0 0 0 0 12c0 1.94.46 3.77 1.27 5.36l4-3.09z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.76 0 3.34.61 4.58 1.8l3.43-3.43C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.69 1.27 6.64l4 3.09C6.22 6.86 8.87 4.75 12 4.75z"
      />
    </svg>
  )
}

type Props = {
  className?: string
}

export function PreferredSourcesButton({ className = "" }: Props) {
  useEffect(() => {
    loadPreferredSourcesLibrary()
  }, [])

  const onClick = () => {
    if (preferredSourceClient) {
      preferredSourceClient.addPreferredSource()
      return
    }
    const href = `https://www.google.com/preferences/source?q=${encodeURIComponent(preferredSourceQuery())}`
    window.open(href, "_blank", "noopener,noreferrer")
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`google-pref-btn ${className}`.trim()}
      aria-label="Add Tetrava Labs as a Google Preferred Source"
    >
      <span className="google-pref-btn__inner">
        <GoogleGMark />
        <span>Preferred</span>
      </span>
    </button>
  )
}
