import { Lock } from "lucide-react"

type PaymentLogo = {
  id: string
  label: string
  src: string
  width: number
  height: number
}

/** Card + crypto logos shown in the footer — keep in sync with /payment and checkout. */
const PAYMENT_LOGOS: PaymentLogo[] = [
  { id: "visa", label: "Visa", src: "/payments/visa.png", width: 48, height: 30 },
  { id: "mastercard", label: "Mastercard", src: "/payments/mastercard.svg", width: 28, height: 18 },
  { id: "apple-pay", label: "Apple Pay", src: "/payments/apple-pay.png", width: 44, height: 18 },
  { id: "btc", label: "Bitcoin", src: "/payments/btc.svg", width: 22, height: 22 },
  { id: "eth", label: "Ethereum", src: "/payments/eth.svg", width: 22, height: 22 },
  { id: "usdt", label: "Tether USDT", src: "/payments/usdt.svg", width: 22, height: 22 }
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
      <ul className="mt-4 flex flex-wrap items-center gap-x-3.5 gap-y-2" aria-label="Accepted payment methods">
        {PAYMENT_LOGOS.map((logo) => (
          <li key={logo.id} title={logo.label} className="flex items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logo.src}
              alt={logo.label}
              width={logo.width}
              height={logo.height}
              className="block shrink-0 object-contain"
              style={{ width: logo.width, height: logo.height }}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}
