"use client"

import Link from "next/link"
import { formatClientError } from "@/lib/format-client-error"

type Props = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function CheckoutError({ error, reset }: Props) {
  const message = formatClientError(
    error,
    "Checkout could not load. Refresh the page and try again."
  )

  return (
    <section className="page-container py-16">
      <div className="card mx-auto max-w-lg space-y-4 p-6 sm:p-8">
        <h1 className="font-serif text-2xl text-[#0F172A]">Checkout unavailable</h1>
        <p className="text-sm leading-relaxed text-[#475569]">{message}</p>
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={() => reset()} className="btn-primary">
            Try again
          </button>
          <Link href="/cart" className="btn-secondary">
            Back to cart
          </Link>
        </div>
      </div>
    </section>
  )
}
