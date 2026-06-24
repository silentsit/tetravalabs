"use client"

import { useEffect, useState } from "react"
import { ArrowUp } from "lucide-react"

export function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let frame = 0
    const onScroll = () => {
      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(() => setVisible(window.scrollY > 400))
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener("scroll", onScroll)
    }
  }, [])

  if (!visible) return null

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-24 right-4 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-[#E2E8F0] bg-white text-[#0D9488] shadow-lg transition-colors hover:bg-[#F8FAFC] sm:bottom-6 sm:right-6"
      aria-label="Scroll to top"
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  )
}
