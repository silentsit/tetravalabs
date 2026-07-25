"use client"

import { useCallback, useEffect, useState } from "react"
import { RefreshCw, RotateCcw } from "lucide-react"
import { AccountEmptyNotice } from "@/components/account/account-empty-notice"
import {
  fetchAccountRestocks,
  mutateAccountRestock,
  type AccountRestock
} from "@/lib/lab-restock-api"
import { LAB_RESTOCK_CADENCES, LAB_RESTOCK_COPY } from "@/lib/lab-restock"
import { getProductHref } from "@/lib/compound-product"
import Link from "next/link"

function statusLabel(status: string) {
  switch (status) {
    case "active":
      return "Active"
    case "paused":
      return "Paused"
    case "cancelled":
      return "Cancelled"
    case "past_due":
      return "Payment due"
    case "pending":
      return "Awaiting first payment"
    default:
      return status
  }
}

function statusClass(status: string) {
  switch (status) {
    case "active":
      return "bg-[#CCFBF1] text-[#0F766E]"
    case "paused":
      return "bg-amber-50 text-amber-800"
    case "past_due":
      return "bg-red-50 text-red-700"
    case "cancelled":
      return "bg-slate-100 text-slate-600"
    default:
      return "bg-slate-100 text-slate-700"
  }
}

export function AccountRestocksPanel() {
  const [restocks, setRestocks] = useState<AccountRestock[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [busyId, setBusyId] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const rows = await fetchAccountRestocks()
      setRestocks(rows)
    } catch {
      setError("Could not load Peptide Refills.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const runAction = async (
    id: string,
    action: "pause" | "resume" | "cancel" | "skip" | "set_cadence" | "pay_now",
    cadenceDays?: number
  ) => {
    setBusyId(id)
    setError("")
    const result = await mutateAccountRestock(id, action, cadenceDays)
    if (!result.ok) {
      setError(result.message || "Action failed")
    } else if (result.payment_url) {
      window.location.href = result.payment_url
      return
    }
    await load()
    setBusyId(null)
  }

  if (loading) {
    return <p className="text-sm text-[#64748B]">Loading restocks…</p>
  }

  if (!restocks.length) {
    return (
      <AccountEmptyNotice
        icon={RotateCcw}
        message="No Peptide Refills yet. Choose Peptide Refill on a product page to schedule automatic shipments."
        actionLabel="Browse catalog"
        actionHref="/shop"
      />
    )
  }

  return (
    <div className="space-y-4">
      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <ul className="space-y-4">
        {restocks.map((row) => {
          const busy = busyId === row.id
          const manageable = row.status === "active" || row.status === "paused" || row.status === "past_due"
          return (
            <li key={row.id} className="card space-y-3 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <Link
                    href={getProductHref(row.handle)}
                    className="font-medium text-[#0F172A] hover:text-[#0D9488]"
                  >
                    {row.title}
                  </Link>
                  {row.variantTitle ? (
                    <p className="mt-0.5 text-xs text-[#94A3B8]">{row.variantTitle}</p>
                  ) : null}
                  <p className="mt-1 text-sm text-[#475569]">
                    Qty {row.quantity} · ${row.unitPriceUsd.toFixed(2)} each · every{" "}
                    {row.cadenceDays} days
                  </p>
                  {row.nextBillingAt ? (
                    <p className="mt-1 text-xs text-[#64748B]">
                      Next refill:{" "}
                      {new Date(row.nextBillingAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric"
                      })}
                    </p>
                  ) : null}
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass(row.status)}`}
                >
                  {statusLabel(row.status)}
                </span>
              </div>

              {manageable || row.status === "past_due" ? (
                <div className="flex flex-wrap items-center gap-2 border-t border-[#E2E8F0] pt-3">
                  {row.status === "past_due" ? (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => void runAction(row.id, "pay_now")}
                      className="btn-primary px-3 py-1.5 text-xs"
                    >
                      Pay refill now
                    </button>
                  ) : null}
                  {row.status === "paused" ? (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => void runAction(row.id, "resume")}
                      className="btn-primary px-3 py-1.5 text-xs"
                    >
                      Resume
                    </button>
                  ) : row.status === "active" || row.status === "past_due" ? (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => void runAction(row.id, "pause")}
                      className="btn-secondary px-3 py-1.5 text-xs"
                    >
                      Pause
                    </button>
                  ) : null}
                  <button
                    type="button"
                    disabled={busy || row.status === "paused"}
                    onClick={() => void runAction(row.id, "skip")}
                    className="btn-secondary px-3 py-1.5 text-xs"
                  >
                    Skip next
                  </button>
                  <label className="flex items-center gap-1.5 text-xs text-[#475569]">
                    Cadence
                    <select
                      disabled={busy}
                      value={row.cadenceDays}
                      onChange={(event) => {
                        const days = Number(event.target.value)
                        if (LAB_RESTOCK_CADENCES.includes(days as (typeof LAB_RESTOCK_CADENCES)[number])) {
                          void runAction(row.id, "set_cadence", days)
                        }
                      }}
                      className="rounded border border-[#E2E8F0] bg-white px-2 py-1 text-xs"
                    >
                      {LAB_RESTOCK_CADENCES.map((days) => (
                        <option key={days} value={days}>
                          {days} days
                        </option>
                      ))}
                    </select>
                  </label>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => {
                      if (window.confirm("Cancel this Peptide Refill? You can start a new one anytime.")) {
                        void runAction(row.id, "cancel")
                      }
                    }}
                    className="ml-auto text-xs text-red-600 hover:text-red-700"
                  >
                    Cancel
                  </button>
                </div>
              ) : null}
            </li>
          )
        })}
      </ul>

      <button
        type="button"
        onClick={() => void load()}
        className="inline-flex items-center gap-2 text-xs text-[#64748B] hover:text-[#0D9488]"
      >
        <RefreshCw className="h-3.5 w-3.5" aria-hidden />
        Refresh
      </button>

      <p className="text-xs text-[#94A3B8]">{LAB_RESTOCK_COPY.ruoNote}</p>
    </div>
  )
}
