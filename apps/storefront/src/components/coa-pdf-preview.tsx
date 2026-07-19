"use client"

import { useEffect, useRef, useState } from "react"
import { FileText } from "lucide-react"

type Props = {
  url: string
  alt: string
  /** Optional render scale override; otherwise fit to card width */
  scale?: number
  className?: string
  /** Defer fetch/render until the preview enters (or nears) the viewport */
  lazy?: boolean
}

let workerReady: Promise<void> | null = null

export function warmCoaPdfWorker() {
  return ensurePdfWorker()
}

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

const PREVIEW_CACHE_MAX = 64
const previewCache = new Map<string, HTMLCanvasElement>()

function getCachedPreview(url: string) {
  const cached = previewCache.get(url)
  if (!cached) return null
  previewCache.delete(url)
  previewCache.set(url, cached)
  return cached
}

function setCachedPreview(url: string, canvas: HTMLCanvasElement) {
  if (previewCache.has(url)) previewCache.delete(url)
  previewCache.set(url, canvas)
  while (previewCache.size > PREVIEW_CACHE_MAX) {
    const oldest = previewCache.keys().next().value
    if (oldest) previewCache.delete(oldest)
  }
}

const MAX_CONCURRENT_RENDERS = 3
let activeRenders = 0
const renderQueue: Array<() => void> = []

function enqueuePreviewRender<T>(task: () => Promise<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    const run = () => {
      activeRenders += 1
      task()
        .then(resolve, reject)
        .finally(() => {
          activeRenders -= 1
          const next = renderQueue.shift()
          if (next) next()
        })
    }

    if (activeRenders < MAX_CONCURRENT_RENDERS) run()
    else renderQueue.push(run)
  })
}

function cloneCanvas(source: HTMLCanvasElement) {
  const copy = window.document.createElement("canvas")
  copy.width = source.width
  copy.height = source.height
  const ctx = copy.getContext("2d")
  if (!ctx) return source
  ctx.drawImage(source, 0, 0)
  copy.setAttribute("role", "img")
  copy.className = source.className
  const label = source.getAttribute("aria-label")
  if (label) copy.setAttribute("aria-label", label)
  return copy
}

export function CoaPdfPreview({ url, alt, scale, className = "", lazy = true }: Props) {
  const rootRef = useRef<HTMLDivElement>(null)
  const canvasHostRef = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "failed">("idle")
  const [shouldRender, setShouldRender] = useState(!lazy)

  useEffect(() => {
    if (!lazy) {
      setShouldRender(true)
      return
    }

    const root = rootRef.current
    if (!root) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setShouldRender(true)
          observer.disconnect()
        }
      },
      { rootMargin: "240px" }
    )

    observer.observe(root)
    return () => observer.disconnect()
  }, [lazy, url])

  useEffect(() => {
    if (!shouldRender || !canvasHostRef.current) return

    let cancelled = false

    async function renderPreview() {
      const canvasHost = canvasHostRef.current
      if (!canvasHost) return

      const cached = getCachedPreview(url)
      if (cached) {
        canvasHost.replaceChildren(cloneCanvas(cached))
        setStatus("ready")
        return
      }

      try {
        setStatus("loading")
        canvasHost.replaceChildren()

        await enqueuePreviewRender(async () => {
          if (cancelled) return

          await ensurePdfWorker()

          const response = await fetch(url, { credentials: "same-origin" })
          if (!response.ok) throw new Error(`HTTP ${response.status}`)

          const contentType = response.headers.get("content-type") || ""
          if (contentType.includes("application/json")) throw new Error("Expected PDF response")

          const data = await response.arrayBuffer()
          if (cancelled) return

          const pdfjs = await import("pdfjs-dist")
          const pdf = await pdfjs.getDocument({ data }).promise
          const page = await pdf.getPage(1)

          if (cancelled) return
          const renderHost = canvasHostRef.current
          if (!renderHost) return

          const width = renderHost.clientWidth || 280
          const baseViewport = page.getViewport({ scale: 1 })
          const renderScale = scale ?? Math.max(Math.min(width / baseViewport.width, 1), 0.35)
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

          setCachedPreview(url, canvas)
          readyHost.replaceChildren(cloneCanvas(canvas))
          setStatus("ready")
        })
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
  }, [shouldRender, url, scale, alt])

  const showLoading = status === "idle" || status === "loading"

  return (
    <div
      ref={rootRef}
      className={`relative flex h-full w-full items-start justify-center overflow-hidden bg-white ${className}`}
    >
      <div ref={canvasHostRef} className="h-full w-full" />
      {showLoading ? (
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
