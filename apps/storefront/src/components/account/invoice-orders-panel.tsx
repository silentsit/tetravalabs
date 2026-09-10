"use client"

import { useCallback, useEffect, useState } from "react"
import { readAuthToken } from "@/lib/medusa-auth"

type InvoiceRow = {
  order_id: string
  email: string
  display_id: number | null
  first_name: string | null
  last_name: string | null
  payment_method_title: string
  status: string
  amount_usd: number
  currency: string
  internal_note: string
  paid_at: string | null
  created_at: string
}

function authHeaders(): HeadersInit {
  const token = readAuthToken()
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  }
}

function money(amount: number, currency: string) {
  return `${amount.toFixed(2)} ${currency}`
}

export function InvoiceOrdersPanel() {
  const [status, setStatus] = useState("on_hold")
  const [rows, setRows] = useState<InvoiceRow[]>([])
  const [loadError, setLoadError] = useState<string | null>(null)
  const [marking, setMarking] = useState<string | null>(null)

  const load = useCallback(async (filter: string) => {
    setLoadError(null)
    try {
      const response = await fetch(`/api/admin/invoices?status=${encodeURIComponent(filter)}`, {
        headers: authHeaders(),
        cache: "no-store"
      })
      const data = (await response.json()) as { ok?: boolean; items?: InvoiceRow[]; message?: string }
      if (!response.ok || !data.ok) {
        setLoadError(data.message || "Unable to load invoice orders.")
        setRows([])
        return
      }
      setRows(Array.isArray(data.items) ? data.items : [])
    } catch {
      setLoadError("Unable to load invoice orders.")
      setRows([])
    }
  }, [])

  useEffect(() => {
    void load(status)
  }, [load, status])

  const markPaid = async (orderId: string) => {
    setMarking(orderId)
    setLoadError(null)
    try {
      const response = await fetch("/api/admin/invoices", {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ order_id: orderId })
      })
      const data = (await response.json()) as { ok?: boolean; message?: string }
      if (!response.ok || !data.ok) {
        setLoadError(data.message || "Unable to mark payment received.")
        return
      }
      await load(status)
    } catch {
      setLoadError("Unable to mark payment received.")
    } finally {
      setMarking(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <label className="text-sm text-[#475569]" htmlFor="invoice-status-filter">
          Filter
        </label>
        <select
          id="invoice-status-filter"
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className="input-field max-w-xs text-sm"
        >
          <option value="on_hold">Awaiting invoice payment</option>
          <option value="processing">Processing</option>
          <option value="all">All invoice orders</option>
        </select>
      </div>

      {loadError ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {loadError}
        </p>
      ) : null}

      {!rows.length && !loadError ? (
        <p className="text-sm text-[#475569]">No invoice orders in this filter.</p>
      ) : (
        <ul className="space-y-3">
          {rows.map((row) => {
            const name = [row.first_name, row.last_name].filter(Boolean).join(" ")
            return (
              <li key={row.order_id} className="card space-y-3 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-[#0F172A]">
                      {row.display_id ? `Order #${row.display_id}` : row.order_id}
                    </p>
                    <p className="mt-1 text-sm text-[#475569]">
                      {name || "Customer"} · {row.email}
                    </p>
                    <p className="mt-1 text-xs text-[#64748B]">
                      {row.payment_method_title} · {row.internal_note}
                    </p>
                  </div>
                  <p className="tabular-nums text-sm font-medium text-[#0F172A]">
                    {money(row.amount_usd, row.currency)}
                  </p>
                </div>
                {row.status === "on_hold" ? (
                  <button
                    type="button"
                    className="btn-primary px-4 py-2 text-sm disabled:opacity-60"
                    disabled={marking === row.order_id}
                    onClick={() => void markPaid(row.order_id)}
                  >
                    {marking === row.order_id ? "Updating…" : "Mark payment received"}
                  </button>
                ) : (
                  <p className="text-xs text-[#64748B]">
                    Status: {row.status}
                    {row.paid_at ? ` · paid ${new Date(row.paid_at).toLocaleString()}` : ""}
                  </p>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
