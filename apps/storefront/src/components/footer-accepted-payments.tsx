import { Lock } from "lucide-react"

/** Card + crypto logos shown in the footer — keep in sync with /payment and checkout. */
const PAYMENT_LOGOS = [
  { id: "visa", label: "Visa", width: 44, content: <VisaMark /> },
  { id: "mastercard", label: "Mastercard", width: 36, content: <MastercardMark /> },
  { id: "apple-pay", label: "Apple Pay", width: 44, content: <ApplePayMark /> },
  { id: "btc", label: "Bitcoin", width: 24, content: <BtcMark /> },
  { id: "eth", label: "Ethereum", width: 24, content: <EthMark /> },
  { id: "usdt", label: "Tether USDT", width: 24, content: <UsdtMark /> }
] as const

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
              className="flex h-9 items-center justify-center rounded-md bg-white px-2.5 shadow-sm"
              style={{ minWidth: logo.width + 16 }}
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

function VisaMark() {
  return (
    <svg viewBox="0 0 48 16" className="h-4 w-auto" aria-hidden>
      <path
        fill="#1434CB"
        d="M19.3 15.5h-3.2L17.5 4.5h3.2L19.3 15.5zm11.8-7.4c0-2.8-3.9-3-3.9-4.2 0-.4.4-.8 1.2-.9.4-.1 1.5-.1 2.7.5l.5-2.3c-.7-.2-1.5-.5-2.6-.5-2.7 0-4.6 1.4-4.6 3.5 0 1.5 1.3 2.4 2.3 2.9 1 .5 1.4.8 1.4 1.3 0 .7-.8 1-1.6 1-1.3 0-2.1-.3-3.2-1.1l-.5 2.4c1.1.5 2.1.7 3.5.7 2.9 0 4.8-1.4 4.8-3.6zm7.2 7.4h3l2.8-11h-2.8l-1.8 4.6-1.9-4.6h-2.9l3.6 11zm13.2-11-2.2 11h-2.7l2.2-11h2.7zm4.2 0 2.6 7.5.6-3c.5-2.5 2-4.5 3.7-5.7h-3.2l-2.1 11h2.7l1.3-7.5zM8.8 4.5L6 13.8 5.7 11 4.5 4.5H1.2L0 15.5h3.2l1.4-7.3L5.8 15.5h2.1l4.3-11H8.8z"
      />
    </svg>
  )
}

function MastercardMark() {
  return (
    <svg viewBox="0 0 36 22" className="h-5 w-auto" aria-hidden>
      <circle cx="13" cy="11" r="9" fill="#EB001B" />
      <circle cx="23" cy="11" r="9" fill="#F79E1B" />
      <path
        fill="#FF5F00"
        d="M18 5.2a9 9 0 0 0-3.4 11.6A9 9 0 0 0 18 16.8a9 9 0 0 0 3.4-11.6A9 9 0 0 0 18 5.2z"
      />
    </svg>
  )
}

function ApplePayMark() {
  return (
    <svg viewBox="0 0 48 20" className="h-4 w-auto" aria-hidden>
      <path
        fill="#000"
        d="M8.4 3.3c-.5.6-1.3 1.1-2.1 1-.1-.8.3-1.7.8-2.2.5-.6 1.4-1 2.1-1 .1.9-.2 1.7-.8 2.2zm.8 1.3c-1.2-.1-2.2.7-2.8.7-.6 0-1.5-.7-2.5-.7-1.3 0-2.5.8-3.2 2-1.4 2.4-.4 6 1 8 .7 1 1.5 2.1 2.6 2.1 1 0 1.4-.7 2.6-.7 1.2 0 1.5.7 2.6.7 1.1 0 1.8-1 2.5-2 .8-1.1 1.1-2.2 1.1-2.3-.1 0-2.2-.8-2.2-3.3 0-2.1 1.7-3.1 1.8-3.2-1-.7-2.3-1.2-3.6-1.2z"
      />
      <path
        fill="#000"
        d="M20.2 6.1V17h1.8v-3.6h2.5c2.3 0 3.9-1.6 3.9-3.8S26.8 6.1 24.5 6.1h-4.3zm1.8 1.5h2.1c1.6 0 2.5.9 2.5 2.3s-.9 2.3-2.5 2.3h-2.1V7.6zm9.8 9.7c1.3 0 2.5-.7 3-1.8h.1V17h1.7v-6.7h-1.6v1.6h-.1c-.6-1-1.7-1.7-3-1.7-2.4 0-4.1 2-4.1 4.5s1.7 4.5 4.1 4.5zm.3-1.5c-1.6 0-2.7-1.3-2.7-3s1.1-3 2.7-3 2.7 1.3 2.7 3-1.1 3-2.7 3zm5.9 5.7h1.8V6.1h-1.8V17zm3.2-9.2c0-.9.7-1.6 1.7-1.6.9 0 1.6.7 1.6 1.6 0 .9-.7 1.6-1.6 1.6-1 0-1.7-.7-1.7-1.6zm6.8 9.2c1.8 0 2.8-.9 3.4-2.3l-1.6-.7c-.4.9-1.1 1.5-1.9 1.5-1.3 0-2.2-1.1-2.2-2.7 0-1.6.9-2.7 2.2-2.7.8 0 1.5.6 1.9 1.5l1.6-.7c-.6-1.4-1.6-2.3-3.4-2.3-2.3 0-3.9 1.8-3.9 4.2 0 2.4 1.6 4.2 3.9 4.2z"
      />
    </svg>
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
