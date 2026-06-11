import type { MedusaRequest } from "@medusajs/framework/http"

export function getWebhookRawBody(req: MedusaRequest): string {
  const raw = (req as MedusaRequest & { rawBody?: Buffer | string }).rawBody
  if (Buffer.isBuffer(raw)) return raw.toString("utf8")
  if (typeof raw === "string" && raw.length) return raw
  if (typeof req.body === "string") return req.body
  return JSON.stringify(req.body ?? {})
}

export function getHeaderValue(
  headers: Record<string, unknown>,
  name: string
): string | undefined {
  const target = name.toLowerCase()
  for (const [key, value] of Object.entries(headers)) {
    if (key.toLowerCase() !== target) continue
    if (typeof value === "string" && value.trim()) return value.trim()
    if (Array.isArray(value) && typeof value[0] === "string" && value[0].trim()) {
      return value[0].trim()
    }
  }
  return undefined
}
