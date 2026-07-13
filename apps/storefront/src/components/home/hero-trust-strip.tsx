import { FileCheck, FlaskConical, Lock, Snowflake } from "lucide-react"

const items = [
  {
    icon: Snowflake,
    title: "Cold-Chain Shipping",
    subtitle: "Thermal-protected worldwide"
  },
  {
    icon: FlaskConical,
    title: "Independent Testing",
    subtitle: "HPLC-MS verified ≥99%"
  },
  {
    icon: FileCheck,
    title: "Lot-Linked COAs",
    subtitle: "Certificate with every batch"
  },
  {
    icon: Lock,
    title: "100% Secure",
    subtitle: "Safe & discreet checkout"
  }
] as const

export function HeroTrustStrip() {
  return (
    <section className="bg-[#0D9488]" aria-label="Trust highlights">
      <div className="page-container">
        <div className="grid grid-cols-2 gap-y-5 py-5 sm:py-6 lg:grid-cols-4 lg:gap-0 lg:py-5">
          {items.map((item, index) => (
            <div
              key={item.title}
              className={`flex items-center gap-3 px-2 sm:px-4 lg:justify-center lg:px-6 ${
                index > 0 ? "lg:border-l lg:border-white/25" : ""
              }`}
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/15 text-white">
                <item.icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
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
