import Link from "next/link"
import type { LucideIcon } from "lucide-react"

type Props = {
  icon: LucideIcon
  message: string
  actionLabel: string
  actionHref?: string
  onAction?: () => void
}

export function AccountEmptyNotice({ icon: Icon, message, actionLabel, actionHref, onAction }: Props) {
  const actionClass = "btn-primary shrink-0 px-5 py-2.5 text-sm"

  return (
    <div className="flex flex-col gap-4 rounded-xl bg-[#F1F5F9] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
      <div className="flex items-start gap-3 text-sm text-[#475569]">
        <Icon className="mt-0.5 h-5 w-5 shrink-0 text-[#64748B]" aria-hidden />
        <p>{message}</p>
      </div>
      {onAction ? (
        <button type="button" onClick={onAction} className={actionClass}>
          {actionLabel}
        </button>
      ) : (
        <Link href={actionHref || "/shop"} className={actionClass}>
          {actionLabel}
        </Link>
      )}
    </div>
  )
}
