import { AlertTriangle } from "lucide-react"

export function ComplianceNotice() {
  return (
    <div className="rounded-xl border border-[#FDE68A] bg-[#FEF3C7] p-6">
      <div className="mb-3 flex items-center gap-2">
        <AlertTriangle className="h-5 w-5 text-[#D97706]" />
        <h3 className="font-medium text-[#D97706]">Research Use Only Disclaimer</h3>
      </div>
      <p className="text-sm leading-relaxed text-[#D97706]/70">
        All products are intended for laboratory research purposes only. Not approved for human
        consumption, diagnostic use, or therapeutic applications. By purchasing, you confirm you are a
        qualified research professional.
      </p>
    </div>
  )
}
