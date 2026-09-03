"use client"

import { useEffect } from "react"

export function CheckoutHandoffShell({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    document.body.dataset.checkoutHandoff = "true"
    return () => {
      delete document.body.dataset.checkoutHandoff
    }
  }, [])

  return <div className="checkout-handoff-shell min-h-[calc(100dvh-1px)]">{children}</div>
}
