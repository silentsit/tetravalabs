import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { processDueOrderEmails } from "../../../../lib/order-email-schedule"

/**
 * POST /hooks/order-emails/process
 * Processes due unpaid payment reminders/follow-ups and 72h tracking SLA emails.
 * Requires x-order-email-cron-secret header (Render cron or manual ops).
 */
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const secret = req.headers["x-order-email-cron-secret"]
  const expected = process.env.ORDER_EMAIL_CRON_SECRET

  if (!expected || secret !== expected) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  const summary = await processDueOrderEmails()
  return res.json({ ok: true, ...summary })
}
