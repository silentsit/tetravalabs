import { ShieldCheck, Snowflake, FileCheck, Lock } from "lucide-react"

export function TrustBadgesRow() {
  const badges = [
    { icon: ShieldCheck, label: "HPLC Verified", desc: "Independent lab testing" },
    { icon: Snowflake, label: "Cold-Chain", desc: "Thermal-protected shipping" },
    { icon: FileCheck, label: "COA Included", desc: "Certificate of Analysis" },
    { icon: Lock, label: "Secure & Discreet", desc: "Plain packaging" }
  ]

  return (
    <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
      {badges.map((badge) => (
        <div key={badge.label} className="flex flex-col items-center text-center">
          <badge.icon className="mb-3 h-8 w-8 text-[#0D9488]" strokeWidth={1.5} />
          <span className="text-sm font-medium text-[#0F172A]">{badge.label}</span>
          <span className="mt-1 text-xs text-[#94A3B8]">{badge.desc}</span>
        </div>
      ))}
    </div>
  )
}
