"use client"

import { useEffect, useRef, useState } from "react"
import { FileText } from "lucide-react"

type Props = {
  url: string
  alt: string
  /** Render scale — lower for thumbnails, higher for main view */
  scale?: number
  className?: string
}

let workerConfigured = false

async function configurePdfWorker() {
  if (workerConfigured) return
  const pdfjs = await import("pdfjs-dist")
  const worker = await import("pdfjs-dist/build/pdf.worker.min.mjs?url")
  pdfjs.GlobalWorkerOptions.workerSrc = worker.default
  workerConfigured = true
}

export function CoaPdfPreview({ url, alt, scale = 0.35, className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function render() {
      try {
        await configurePdfWorker()
        const pdfjs = await import("pdfjs-dist")
        const pdf = await pdfjs.getDocument(url).promise
        const page = await pdf.getPage(1)
        const viewport = page.getViewport({ scale })
        const canvas = canvasRef.current
        if (!canvas || cancelled) return

        const context = canvas.getContext("2d")
        if (!context) return

        canvas.width = viewport.width
        canvas.height = viewport.height

        await page.render({ canvasContext: context, viewport }).promise
      } catch {
        if (!cancelled) setFailed(true)
      }
    }

    setFailed(false)
    void render()

    return () => {
      cancelled = true
    }
  }, [url, scale])

  if (failed) {
    return (
      <div className={`flex h-full flex-col items-center justify-center gap-1 bg-[#F8FAFC] text-[#64748B] ${className || ""}`}>
        <FileText className="h-5 w-5" />
        <span className="text-[10px] font-medium uppercase tracking-wide">COA</span>
      </div>
    )
  }

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label={alt}
      className={`h-full w-full bg-white object-contain ${className || ""}`}
    />
  )
}
