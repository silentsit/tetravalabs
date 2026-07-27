import { Lock } from "lucide-react"

type PaymentLogo = {
  id: string
  label: string
  src: string
  /** Card wordmarks vs square crypto marks need different pill sizing. */
  variant: "card" | "crypto"
}

/** Card + crypto logos shown in the footer — keep in sync with /payment and checkout. */
const PAYMENT_LOGOS: PaymentLogo[] = [
  { id: "visa", label: "Visa", src: "/payments/visa.svg", variant: "card" },
  { id: "mastercard", label: "Mastercard", src: "/payments/mastercard.svg", variant: "card" },
  { id: "apple-pay", label: "Apple Pay", src: "/payments/apple-pay.svg", variant: "card" },
  { id: "btc", label: "Bitcoin", src: "/payments/btc.svg", variant: "crypto" },
  { id: "eth", label: "Ethereum", src: "/payments/eth.svg", variant: "crypto" },
  { id: "usdt", label: "Tether USDT", src: "/payments/usdt.svg", variant: "crypto" }
]

export function FooterAcceptedPayments() {
  return (
    <div className="mt-8">
      <div className="flex items-center gap-2">
        <Lock className="h-4 w-4 shrink-0 text-[#FBBF24]" aria-hidden />
        <p className="text-sm font-semibold text-white">Accepted Secure Payments</p>
      </div>
      <p className="mt-1 text-xs leading-relaxed text-[#64748B]">
        Protected by SSL encryption &amp; trusted payment providers
      </p>
      <ul className="mt-4 flex flex-wrap items-center gap-2" aria-label="Accepted payment methods">
        {PAYMENT_LOGOS.map((logo) => (
          <li key={logo.id}>
            <div
              className={
                logo.variant === "card"
                  ? "flex h-9 items-center justify-center rounded-md bg-white px-2.5 shadow-sm"
                  : "flex h-9 w-9 items-center justify-center rounded-md bg-white shadow-sm"
              }
              title={logo.label}
            >
              <span className="sr-only">{logo.label}</span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logo.src}
                alt=""
                width={logo.variant === "card" ? 48 : 20}
                height={logo.variant === "card" ? 16 : 20}
                className={
                  logo.variant === "card"
                    ? "block h-4 w-auto max-w-[48px] object-contain"
                    : "block h-5 w-5 object-contain"
                }
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
