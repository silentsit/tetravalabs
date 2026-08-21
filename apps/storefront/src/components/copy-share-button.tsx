"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"

type Props = {
  href: string
  url: string
  title: string
  network: string
  className: string
  children: ReactNode
}

/** Copy the article URL, then open a network that has no public share endpoint. */
export function CopyShareButton({ href, url, title, network, className, children }: Props) {
  const [copied, setCopied] = useState(false)
  const copiedTimer = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (copiedTimer.current) window.clearTimeout(copiedTimer.current)
    }
  }, [])

  function onClick() {
    // Open first so the click gesture is not lost after the clipboard await.
    window.open(href, "_blank", "noopener,noreferrer")
    const payload = `${title}\n${url}`
    if (!navigator.clipboard?.writeText) return
    void navigator.clipboard.writeText(payload).then(
      () => {
        setCopied(true)
        if (copiedTimer.current) window.clearTimeout(copiedTimer.current)
        copiedTimer.current = window.setTimeout(() => setCopied(false), 2000)
      },
      () => {
        setCopied(false)
      }
    )
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={className}
      aria-label={
        copied ? `Article link copied. ${network} opened.` : `Copy article link and open ${network}`
      }
    >
      {children}
      <span className="sr-only">{copied ? "Link copied" : network}</span>
    </button>
  )
}
