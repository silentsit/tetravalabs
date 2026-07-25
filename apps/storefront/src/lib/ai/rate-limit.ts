type Bucket = { count: number; resetAt: number }

const buckets = new Map<string, Bucket>()

/** Simple in-memory IP rate limit (per serverless instance). */
export function allowChatRequest(ip: string, limit = 20, windowMs = 60_000): boolean {
  const key = ip || "unknown"
  const now = Date.now()
  const current = buckets.get(key)
  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }
  if (current.count >= limit) return false
  current.count += 1
  return true
}
