"use client"

import { useEffect, useState } from "react"
import { ShoppingBag, Star, Users, X } from "lucide-react"

const notifications = [
  { name: "Dr. Martinez", location: "Boston, MA", product: "BPC-157 10mg", time: "2 min ago" },
  { name: "Research Lab 47", location: "San Diego, CA", product: "Semaglutide 5mg", time: "5 min ago" }
]

const reviews = [
  {
    name: "Dr. Sarah Chen",
    institution: "Stanford Research",
    rating: 5,
    text: "Exceptional purity consistency for our longitudinal studies."
  },
  {
    name: "Dr. Michael Torres",
    institution: "MIT Bioengineering",
    rating: 5,
    text: "Reliable cold-chain shipping and great scientific support."
  },
  {
    name: "Dr. Emily Watson",
    institution: "Oxford Molecular",
    rating: 5,
    text: "HPLC-MS verification gives us total confidence in our data."
  }
]

export function SocialProofToast() {
  const [current, setCurrent] = useState(0)
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    if (dismissed) return
    const t = setTimeout(() => setVisible(true), 4000)
    const cycle = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setCurrent((p) => (p + 1) % notifications.length)
        setVisible(true)
      }, 400)
    }, 8000)
    return () => {
      clearTimeout(t)
      clearInterval(cycle)
    }
  }, [dismissed])

  if (dismissed) return null
  const n = notifications[current]

  return (
    <div
      className={`fixed bottom-6 left-6 z-40 transition-all duration-500 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      }`}
    >
      <div className="flex max-w-sm items-start gap-3 rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-xl">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#CCFBF1]">
          <ShoppingBag className="h-5 w-5 text-[#0D9488]" />
        </div>
        <div className="flex-1">
          <p className="text-sm text-[#0F172A]">
            <span className="font-medium">{n.name}</span>{" "}
            <span className="text-[#94A3B8]">from {n.location}</span>
          </p>
          <p className="text-xs text-[#94A3B8]">
            Ordered {n.product} · {n.time}
          </p>
        </div>
        <button type="button" onClick={() => setDismissed(true)} className="text-[#CBD5E1] hover:text-[#0F172A]">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

export function SocialProofReviews() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
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

export function LiveVisitorCounter() {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-[#E2E8F0] bg-white px-4 py-2 shadow-sm">
      <span className="relative flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#059669] opacity-60" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#059669]" />
      </span>
      <Users className="h-4 w-4 text-[#94A3B8]" />
      <span className="text-xs text-[#94A3B8]">
        <span className="font-medium text-[#0F172A]">47</span> researchers online
      </span>
    </div>
  )
}
