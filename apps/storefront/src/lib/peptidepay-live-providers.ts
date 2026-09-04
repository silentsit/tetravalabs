import { PEPTIDEPAY_ONRAMP_IDS, type PeptidepayOnrampId } from "@/lib/peptidepay-onramps"

const PROVIDERS_URL = "https://peptide-pay.com/api/v1/providers"
const CACHE_MS = 5 * 60 * 1000

export type PeptidepayLiveOnrampStatus = {
  id: PeptidepayOnrampId
  status: string
  live: boolean
}

type Cached = {
  at: number
  statuses: PeptidepayLiveOnrampStatus[]
}

let cache: Cached | null = null

function isOnrampId(value: string): value is PeptidepayOnrampId {
  return (PEPTIDEPAY_ONRAMP_IDS as readonly string[]).includes(value)
}

export function peptidepayOnrampIsLive(status: string | undefined): boolean {
  return (status || "").trim().toLowerCase() === "active"
}

export async function loadPeptidepayLiveOnrampStatuses(): Promise<PeptidepayLiveOnrampStatus[]> {
  if (cache && Date.now() - cache.at < CACHE_MS) {
    return cache.statuses
  }

  try {
    const response = await fetch(PROVIDERS_URL, {
      cache: "no-store",
      signal: AbortSignal.timeout(8000)
    })
    if (!response.ok) return cache?.statuses || []

    const data = (await response.json()) as {
      providers?: Array<{ id?: string; status?: string }>
    }
    const statuses = (data.providers || [])
      .filter((row): row is { id: PeptidepayOnrampId; status: string } =>
        Boolean(row.id && isOnrampId(row.id) && typeof row.status === "string")
      )
      .map((row) => ({
        id: row.id,
        status: row.status.trim().toLowerCase(),
        live: peptidepayOnrampIsLive(row.status)
      }))

    cache = { at: Date.now(), statuses }
    return statuses
  } catch {
    return cache?.statuses || []
  }
}

export function peptidepayLiveIdSet(statuses: PeptidepayLiveOnrampStatus[]): Set<PeptidepayOnrampId> | null {
  if (!statuses.length) return null
  return new Set(statuses.filter((row) => row.live).map((row) => row.id))
}
