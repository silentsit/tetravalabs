import { FileCheck, FlaskConical, Package, Snowflake } from "lucide-react"

const items = [
  { icon: "flask", label: "HPLC-MS Verified" },
  { icon: "file", label: "Lot-Linked COAs" },
  { icon: "snow", label: "Cold-Chain Shipping" },
  { icon: "package", label: "Discreet Packaging" }
] as const

function TrustIcon({ type }: { type: (typeof items)[number]["icon"] }) {
  const className = "h-3.5 w-3.5 shrink-0 text-[#0D9488]"
  switch (type) {
    case "flask":
      return <FlaskConical className={className} strokeWidth={2} />
    case "file":
      return <FileCheck className={className} strokeWidth={2} />
    case "snow":
      return <Snowflake className={className} strokeWidth={2} />
    case "package":
      return <Package className={className} strokeWidth={2} />
  }
}

export function TrustBar() {
  return (
    <div className="border-b border-[#E2E8F0] bg-[#F1F5F9]">
      <div className="page-container">
        <div className="flex items-center gap-5 overflow-x-auto py-2.5 [-ms-overflow-style:none] [scrollbar-width:none] sm:justify-center sm:gap-10 [&::-webkit-scrollbar]:hidden">
          {items.map((item) => (
            <div key={item.label} className="flex shrink-0 items-center gap-1.5">
              <TrustIcon type={item.icon} />
              <span className="whitespace-nowrap text-[11px] font-medium text-[#475569] sm:text-xs">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
