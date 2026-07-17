const items = [
  {
    id: "shipping",
    title: "Cold-Chain Shipping",
    subtitle: "Thermal-protected worldwide",
    icon: "truck"
  },
  {
    id: "support",
    title: "24/7 Support",
    subtitle: "Chat & Email",
    icon: "phone"
  },
  {
    id: "testing",
    title: "Independent Testing",
    subtitle: "HPLC-MS verified ≥99%",
    icon: "flask"
  },
  {
    id: "secure",
    title: "100% Secure",
    subtitle: "Safe & secure checkout",
    icon: "shield"
  }
] as const

function TrustIcon({ type }: { type: (typeof items)[number]["icon"] }) {
  if (type === "truck") {
    return (
      <svg
        className="trust-ico trust-ico-truck"
        viewBox="0 0 48 48"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <g className="trust-trail" strokeWidth="2">
          <line x1="2" y1="22" x2="8" y2="22" />
          <line x1="1" y1="28" x2="6" y2="28" />
        </g>
        <g className="trust-truck-body">
          <path d="M8 16h16v14H8z" />
          <path d="M24 21h6l4 4v5H24z" />
          <g className="trust-wheel">
            <circle cx="15" cy="33" r="3" />
            <line x1="15" y1="33" x2="15" y2="30.4" />
          </g>
          <g className="trust-wheel">
            <circle cx="29" cy="33" r="3" />
            <line x1="29" y1="33" x2="29" y2="30.4" />
          </g>
        </g>
      </svg>
    )
  }

  if (type === "phone") {
    return (
      <svg
        className="trust-ico trust-ico-phone"
        viewBox="0 0 48 48"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <circle className="trust-p-ring" cx="24" cy="26" r="11" strokeWidth="2" />
        <text
          className="trust-p-24"
          x="24"
          y="13"
          textAnchor="middle"
          fontSize="9"
          fontWeight="800"
          fill="currentColor"
          stroke="none"
        >
          24
        </text>
        <g className="trust-p-phone">
          <path d="M31 29.5v3a2 2 0 0 1-2.2 2 17 17 0 0 1-7.4-2.6 16.6 16.6 0 0 1-5.1-5.1A17 17 0 0 1 13.7 19.5 2 2 0 0 1 15.7 17.3h2.6a2 2 0 0 1 2 1.7c.1.7.3 1.4.5 2.1a2 2 0 0 1-.45 2.05L19 26.4a13 13 0 0 0 5 5l1.45-1.4a2 2 0 0 1 2.05-.45c.7.2 1.4.4 2.1.5a2 2 0 0 1 1.7 2z" />
        </g>
      </svg>
    )
  }

  if (type === "flask") {
    return (
      <svg
        className="trust-ico trust-ico-flask"
        viewBox="0 -2.5 48 48"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <g className="trust-f-smoke" strokeWidth="1.5">
          <path className="trust-f-s1" d="M22 5.5c-1.3-1.5 1.1-2.5-.2-4.2" />
          <path className="trust-f-s2" d="M26 5.5c1.3-1.5-1.1-2.5.2-4.2" />
        </g>
        <g className="trust-f-float">
          <path d="M19 7h10" />
          <path d="M21 7v9l-6.8 15.4A3 3 0 0 0 17 36h14a3 3 0 0 0 2.8-4.6L27 16V7" />
          <path d="M16.5 25.5h15" />
          <circle className="trust-f-b1" cx="22" cy="29.5" r="1.5" fill="currentColor" stroke="none" />
          <circle className="trust-f-b2" cx="27" cy="31" r="1.2" fill="currentColor" stroke="none" />
        </g>
      </svg>
    )
  }

  return (
    <svg
      className="trust-ico trust-ico-shield"
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <g className="trust-s-shield">
        <path d="M24 8l12 5v9c0 8-5.2 14.4-12 16-6.8-1.6-12-8-12-16v-9l12-5z" />
        <path className="trust-s-check" d="M18.5 24.5l4 4 7.5-8" />
      </g>
    </svg>
  )
}

export function HeroTrustStrip() {
  return (
    <section className="hero-trust-strip relative z-10 bg-[#0D9488]" aria-label="Trust highlights">
      <div className="page-container">
        <div className="grid grid-cols-2 gap-y-5 py-5 sm:py-6 lg:grid-cols-4 lg:gap-0 lg:py-5">
          {items.map((item, index) => (
            <div
              key={item.id}
              className={`flex items-center gap-3 px-2 sm:px-4 lg:justify-center lg:px-6 ${
                index > 0 ? "lg:border-l lg:border-white/25" : ""
              }`}
            >
              <span className="hero-trust-tbox">
                <TrustIcon type={item.icon} />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold leading-tight text-white">{item.title}</p>
                <p className="mt-0.5 text-xs leading-snug text-white/80">{item.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
