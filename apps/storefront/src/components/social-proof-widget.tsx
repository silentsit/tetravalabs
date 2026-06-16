"use client"

import { useEffect, useState } from "react"
import { ShoppingBag, Star, Users, X } from "lucide-react"

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
  { name: "Elena R.", location: "Miami, FL", product: "Bacteriostatic Water 10ml", time: "2 hr ago" }
]

const reviews = [
  {
    name: "Dr. Sarah Chen",
    institution: "Stanford Research",
    rating: 5,
    text: "Exceptional purity consistency for our longitudinal studies."
  },
  {
    name: "Michael Torres",
    institution: "MIT Bioengineering",
    rating: 5,
    text: "Reliable cold-chain shipping and great scientific support."
  },
  {
    name: "Emily Watson",
    institution: "Oxford Molecular",
    rating: 5,
    text: "HPLC-MS verification gives us total confidence in our data."
  },
  {
    name: "Helix Core Lab",
    institution: "Independent CRO",
    rating: 5,
    text: "Batch-level COAs are easy to pull from the library before each run."
  },
  {
    name: "James Okonkwo",
    institution: "Cambridge Analytical",
    rating: 5,
    text: "Consistent batch documentation makes our QC workflow straightforward."
  },
  {
    name: "NovaPeptide Group",
    institution: "Contract research",
    rating: 5,
    text: "Fast fulfillment and responsive support on compound specifications."
  }
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
      className={`fixed bottom-4 left-4 right-4 z-40 transition-all duration-500 sm:bottom-6 sm:left-6 sm:right-auto sm:max-w-sm ${
        visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      }`}
    >
      <div className="flex items-start gap-3 rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-xl">
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

export function SocialProofReviews() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {reviews.map((review) => (
        <div key={review.name} className="rounded-xl border border-[#E2E8F0] bg-white p-6">
          <div className="mb-3 flex gap-0.5">
            {Array.from({ length: review.rating }).map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-[#F59E0B] text-[#F59E0B]" />
            ))}
          </div>
          <p className="mb-4 text-sm italic leading-relaxed text-[#0F172A]">&ldquo;{review.text}&rdquo;</p>
          <p className="text-sm font-medium text-[#0F172A]">{review.name}</p>
          <p className="text-xs text-[#94A3B8]">{review.institution}</p>
        </div>
      ))}
    </div>
  )
}

function randomResearchersOnline() {
  return Math.floor(Math.random() * 36) + 15
}

export function LiveVisitorCounter() {
  const [count, setCount] = useState(randomResearchersOnline)

  useEffect(() => {
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
        <span className="font-medium text-[#0F172A]">{count}</span> researchers online
      </span>
    </div>
  )
}
