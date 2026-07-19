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
  const canvasHostRef = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState<"loading" | "ready" | "failed">("loading")

  useEffect(() => {
    if (!canvasHostRef.current) return

    let cancelled = false

    async function renderPreview() {
      try {
        setStatus("loading")
        const canvasHost = canvasHostRef.current
        if (!canvasHost) return

        canvasHost.replaceChildren()
        await ensurePdfWorker()

        const response = await fetch(url, { credentials: "same-origin" })
        if (!response.ok) throw new Error(`HTTP ${response.status}`)

        const contentType = response.headers.get("content-type") || ""
        if (contentType.includes("application/json")) throw new Error("Expected PDF response")

        const data = await response.arrayBuffer()
        const pdfjs = await import("pdfjs-dist")
        const pdf = await pdfjs.getDocument({ data }).promise
        const page = await pdf.getPage(1)

        if (cancelled) return
        const renderHost = canvasHostRef.current
        if (!renderHost) return

        const width = renderHost.clientWidth || 280
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

        if (cancelled) return
        const readyHost = canvasHostRef.current
        if (!readyHost) return

        readyHost.replaceChildren(canvas)
        setStatus("ready")
      } catch {
        if (!cancelled) {
          canvasHostRef.current?.replaceChildren()
          setStatus("failed")
        }
      }
    }

    void renderPreview()

    return () => {
      cancelled = true
      canvasHostRef.current?.replaceChildren()
    }
  }, [url, scale, alt])

  return (
    <div
      className={`relative flex h-full w-full items-start justify-center overflow-hidden bg-white ${className}`}
    >
      <div ref={canvasHostRef} className="h-full w-full" />
      {status === "loading" ? (
        <div className="absolute inset-0 animate-pulse bg-[#E2E8F0]/50" aria-hidden="true" />
      ) : null}
      {status === "failed" ? (
        <div className="absolute inset-0 flex min-h-[120px] w-full flex-col items-center justify-center gap-1 bg-[#F8FAFC] text-[#64748B]">
          <FileText className="h-4 w-4" />
          <span className="text-[10px] font-medium uppercase tracking-wide">Preview unavailable</span>
        </div>
      ) : null}
    </div>
  )
}
