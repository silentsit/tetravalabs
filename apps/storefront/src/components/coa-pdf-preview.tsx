"use client"

import { useEffect, useRef, useState } from "react"
import { FileText } from "lucide-react"

type Props = {
  url: string
  alt: string
  /** Optional render scale override; otherwise fit to card width */
  scale?: number
  className?: string
}

let workerReady: Promise<void> | null = null

function ensurePdfWorker() {
  if (!workerReady) {
    workerReady = (async () => {
      const pdfjs = await import("pdfjs-dist")
      if (!pdfjs.GlobalWorkerOptions.workerSrc) {
        pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs"
      }
    })()
  }
  return workerReady
}

export function CoaPdfPreview({ url, alt, scale, className = "" }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState<"loading" | "ready" | "failed">("loading")

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let cancelled = false

    async function renderPreview() {
      try {
        setStatus("loading")
        await ensurePdfWorker()

        const response = await fetch(url, { credentials: "same-origin" })
        if (!response.ok) throw new Error(`HTTP ${response.status}`)

        const contentType = response.headers.get("content-type") || ""
        if (contentType.includes("application/json")) throw new Error("Expected PDF response")

        const data = await response.arrayBuffer()
        const pdfjs = await import("pdfjs-dist")
        const pdf = await pdfjs.getDocument({ data }).promise
        const page = await pdf.getPage(1)

        if (cancelled || !containerRef.current) return

        const width = containerRef.current.clientWidth || 280
        const baseViewport = page.getViewport({ scale: 1 })
        const renderScale = scale ?? Math.max(width / baseViewport.width, 0.5)
        const viewport = page.getViewport({ scale: renderScale })

        const canvas = window.document.createElement("canvas")
        canvas.width = viewport.width
        canvas.height = viewport.height
        canvas.setAttribute("role", "img")
        canvas.setAttribute("aria-label", alt)
        canvas.className = "mx-auto block max-h-full w-full object-contain object-top"

        const context = canvas.getContext("2d")
        if (!context) throw new Error("Canvas unavailable")

        await page.render({ canvasContext: context, viewport }).promise

        if (cancelled || !containerRef.current) return

        containerRef.current.replaceChildren(canvas)
        setStatus("ready")
      } catch {
        if (!cancelled) setStatus("failed")
      }
    }

    void renderPreview()

    return () => {
      cancelled = true
    }
  }, [url, scale, alt])

  return (
    <div
      ref={containerRef}
      className={`relative flex h-full w-full items-start justify-center overflow-hidden bg-white ${className}`}
    >
      {status === "loading" ? (
        <div className="absolute inset-0 animate-pulse bg-[#E2E8F0]/50" aria-hidden="true" />
      ) : null}
      {status === "failed" ? (
        <div className="flex h-full min-h-[180px] w-full flex-col items-center justify-center gap-1 bg-[#F8FAFC] text-[#64748B]">
          <FileText className="h-5 w-5" />
          <span className="text-[10px] font-medium uppercase tracking-wide">Preview unavailable</span>
        </div>
      ) : null}
    </div>
  )
}
