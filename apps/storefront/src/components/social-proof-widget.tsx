"use client"

import { useEffect, useState } from "react"
import { ShoppingBag, Users, X } from "lucide-react"

const notifications = [
  { name: "Dr. Martinez", location: "Boston, MA", product: "BPC-157 10mg", time: "12 min ago" },
  { name: "Apex Biotech", location: "San Diego, CA", product: "Semaglutide 5mg", time: "18 min ago" },
  { name: "Jordan K.", location: "Austin, TX", product: "TB-500 10mg", time: "24 min ago" },
  { name: "Northline Research", location: "Denver, CO", product: "CJC-1295 5mg", time: "31 min ago" },
  { name: "Priya S.", location: "Seattle, WA", product: "GHK-Cu 100mg", time: "38 min ago" },
  { name: "Helix Core Lab", location: "Chicago, IL", product: "Tirzepatide 5mg", time: "45 min ago" },
  { name: "Marcus T.", location: "Atlanta, GA", product: "Ipamorelin 5mg", time: "52 min ago" },
  { name: "Dr. Sarah Chen", location: "Palo Alto, CA", product: "BPC-157 / TB-500 Blend", time: "1 hr ago" },
  { name: "BioNova Group", location: "Phoenix, AZ", product: "Retatrutide 5mg", time: "1 hr ago" },
  { name: "Elena R.", location: "Miami, FL", product: "Bacteriostatic Water 10ml", time: "2 hr ago" },
  { name: "Dr. Rebecca Park", location: "Nashville, TN", product: "Selank 10mg", time: "8 min ago" },
  { name: "Thomas H.", location: "Portland, OR", product: "Epithalon 10mg", time: "15 min ago" },
  { name: "Amanda W.", location: "Raleigh, NC", product: "BPC-157 Capsules", time: "22 min ago" },
  { name: "David Okoro", location: "Houston, TX", product: "MOTS-c 10mg", time: "29 min ago" },
  { name: "Rachel M.", location: "Minneapolis, MN", product: "Selank 10mg", time: "36 min ago" }
]

function randomToastIntervalMs() {
  return 5 * 60 * 1000 + Math.floor(Math.random() * 5 * 60 * 1000)
}

export function SocialProofToast() {
  const [current, setCurrent] = useState(0)
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    if (dismissed) return

    let cancelled = false
    let timeoutId: number
    let hideTimeoutId: number

    const showNext = () => {
      if (cancelled) return
      setVisible(true)
      timeoutId = window.setTimeout(() => {
        if (cancelled) return
        setVisible(false)
        hideTimeoutId = window.setTimeout(() => {
          if (cancelled) return
          setCurrent((p) => (p + 1) % notifications.length)
          showNext()
        }, 500)
      }, randomToastIntervalMs())
    }

    timeoutId = window.setTimeout(showNext, randomToastIntervalMs())

    return () => {
      cancelled = true
      window.clearTimeout(timeoutId)
      window.clearTimeout(hideTimeoutId)
    }
  }, [dismissed])

  if (dismissed) return null
  const n = notifications[current]

  return (
    <div
      className={`pointer-events-none fixed bottom-24 left-4 z-40 w-[min(20rem,calc(100vw-5.75rem))] transition-all duration-500 sm:bottom-6 sm:left-6 sm:w-full sm:max-w-sm ${
        visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      }`}
    >
      <div className="pointer-events-auto flex items-start gap-3 rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-xl">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#CCFBF1]">
          <ShoppingBag className="h-5 w-5 text-[#0D9488]" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm text-[#0F172A]">
            <span className="font-medium">{n.name}</span>{" "}
            <span className="text-[#94A3B8]">from {n.location}</span>
          </p>
          <p className="truncate text-xs text-[#94A3B8]">
            Ordered {n.product} · {n.time}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="shrink-0 text-[#CBD5E1] hover:text-[#0F172A]"
          aria-label="Dismiss notification"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

function randomResearchersOnline() {
  return Math.floor(Math.random() * 36) + 15
}

const INITIAL_RESEARCHERS_ONLINE = 32

export function LiveVisitorCounter() {
  const [count, setCount] = useState(INITIAL_RESEARCHERS_ONLINE)

  useEffect(() => {
    setCount(randomResearchersOnline())

    let cancelled = false
    let timeoutId: number

    const tick = () => {
      if (cancelled) return
      setCount((prev) => {
        let next = randomResearchersOnline()
        while (next === prev) {
          next = randomResearchersOnline()
        }
        return next
      })
      const delayMs = 10_000 + Math.floor(Math.random() * 15_000)
      timeoutId = window.setTimeout(tick, delayMs)
    }

    timeoutId = window.setTimeout(tick, 12_000)

    return () => {
      cancelled = true
      window.clearTimeout(timeoutId)
    }
  }, [])

  return (
    <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-[#E2E8F0] bg-white px-4 py-2 shadow-sm">
      <span className="relative flex h-2.5 w-2.5 shrink-0">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#059669] opacity-60" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#059669]" />
      </span>
      <Users className="h-4 w-4 shrink-0 text-[#94A3B8]" />
      <span className="text-xs text-[#94A3B8]">
        <span className="inline-block min-w-[2ch] text-center font-medium tabular-nums text-[#0F172A]">
          {count}
        </span>{" "}
        researchers online
      </span>
    </div>
  )
}
