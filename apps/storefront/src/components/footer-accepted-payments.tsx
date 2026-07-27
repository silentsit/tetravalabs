import type { ReactNode } from "react"
import { Lock } from "lucide-react"

type PaymentLogo = {
  id: string
  label: string
  pillClassName: string
  content: ReactNode
}

/** Card + crypto logos shown in the footer — keep in sync with /payment and checkout. */
const PAYMENT_LOGOS: PaymentLogo[] = [
  {
    id: "visa",
    label: "Visa",
    pillClassName: "w-[52px]",
    content: (
      // eslint-disable-next-line @next/next/no-img-element
      <img src="/payments/visa.svg" alt="" width={44} height={14} className="block h-3.5 w-auto" />
    )
  },
  {
    id: "mastercard",
    label: "Mastercard",
    pillClassName: "w-[52px]",
    content: (
      // eslint-disable-next-line @next/next/no-img-element
      <img src="/payments/mastercard.svg" alt="" width={32} height={20} className="block h-5 w-auto" />
    )
  },
  {
    id: "apple-pay",
    label: "Apple Pay",
    pillClassName: "w-[52px]",
    content: (
      // eslint-disable-next-line @next/next/no-img-element
      <img src="/payments/apple-pay.svg" alt="" width={42} height={18} className="block h-4 w-auto" />
    )
  },
  { id: "btc", label: "Bitcoin", pillClassName: "w-9", content: <BtcMark /> },
  { id: "eth", label: "Ethereum", pillClassName: "w-9", content: <EthMark /> },
  { id: "usdt", label: "Tether USDT", pillClassName: "w-9", content: <UsdtMark /> }
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
              className={`flex h-9 items-center justify-center rounded-md bg-white px-2 shadow-sm ${logo.pillClassName}`}
              title={logo.label}
            >
              <span className="sr-only">{logo.label}</span>
              {logo.content}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

function BtcMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
      <circle cx="12" cy="12" r="12" fill="#F7931A" />
      <path
        fill="#fff"
        d="M16.5 10.8c.2-1.5-1-2.3-2.7-2.8l.5-2.1-1.3-.3-.5 2.1c-.3-.1-.7-.2-1-.3l.5-2.1-1.3-.3-.5 2.1c-.3-.1-.5-.2-.8-.2l-1.8-.5-.4 1.5s1 .2 1 .3c.5.1.6.4.6.7l-.6 2.5c0 .1.1.1.2.1h-.2l-.9 3.5c-.1.2-.3.5-.8.4 0 0-1-.3-1-.3l-.7 1.6 1.7.4c.3.1.7.2 1 .3l-.6 2.2 1.3.3.5-2.1c.3.1.7.2 1 .3l-.5 2.1 1.3.3.6-2.2c2.1.4 3.7.2 4.4-1.7.5-1.5 0-2.4-1.1-3 0 0 .8-.2 1.4-.8.6-.6.8-1.5.6-2.5zm-2.5 3.6c-.4 1.5-3 .7-3.8.5l.7-2.7c.9.2 3.5.6 3.1 2.2zm.4-3.7c-.4 1.3-2.6.6-3.3.5l.6-2.5c.7.2 3 .5 2.7 2z"
      />
    </svg>
  )
}

function EthMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
      <circle cx="12" cy="12" r="12" fill="#627EEA" />
      <path fill="#fff" d="M12 4.5v5.2l4.4 2-4.4-7.2z" opacity=".6" />
      <path fill="#fff" d="M12 4.5 7.6 11.7 12 9.7V4.5z" />
      <path fill="#fff" d="M12 13.3v6.2l4.4-6.1-4.4 2.1z" opacity=".6" />
      <path fill="#fff" d="M12 19.5v-6.2l-4.4-2.6 4.4 8.8z" />
      <path fill="#fff" d="M12 12.5 16.4 11 12 9.7v2.8z" opacity=".2" />
      <path fill="#fff" d="M7.6 11 12 12.5V9.7L7.6 11z" opacity=".6" />
    </svg>
  )
}

function UsdtMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
      <circle cx="12" cy="12" r="12" fill="#26A17B" />
      <path
        fill="#fff"
        d="M13.3 12.8V12c2.4-.1 4.2-1 4.2-2.2 0-1.2-1.8-2.1-4.2-2.2V7h-2.6v.6c-2.4.1-4.2 1-4.2 2.2 0 1.1 1.6 2 3.8 2.2l.4.1v.8c-2.6.1-4.5 1-4.5 2.2 0 1.2 1.9 2.1 4.5 2.2V17h2.6v-.6c2.6-.1 4.5-1 4.5-2.2 0-1.2-1.9-2.1-4.5-2.2zm-.1-3.9c2.2-.1 3.8-.8 3.8-1.6 0-.8-1.6-1.5-3.8-1.6V8.9zm-2.6 0V8.9c-2.2.1-3.8.8-3.8 1.6 0 .8 1.6 1.5 3.8 1.6zm0 5.8v.7c-2.2-.1-3.8-.8-3.8-1.6 0-.8 1.6-1.5 3.8-1.6v.7c2.6.1 4.5.8 4.5 1.6 0 .8-1.9 1.5-4.5 1.6z"
      />
    </svg>
  )
}
