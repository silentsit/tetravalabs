import { FileCheck, ShieldCheck, Snowflake } from "lucide-react"

export function ProductTrustStrip() {
  const items = [
    { icon: ShieldCheck, label: "HPLC Verified" },
    { icon: Snowflake, label: "Cold Ship" },
    { icon: FileCheck, label: "COA Included" }
  ]

  return (
    <div className="flex flex-wrap gap-4">
      {items.map((item) => (
        <span key={item.label} className="flex items-center gap-1.5 text-xs text-[#475569]">
          <item.icon className="h-4 w-4 text-[#0D9488]" aria-hidden />
          {item.label}
        </span>
      ))}
    </div>
  )
}
