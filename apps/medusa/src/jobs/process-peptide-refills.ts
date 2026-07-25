import type { MedusaContainer } from "@medusajs/framework/types"
import {
  processDueLabRestocks,
  processPeptideRefillDunning
} from "../lib/lab-restock-processor"

/**
 * Daily Peptide Refill billing + dunning.
 * Prefer Render cron → POST /hooks/order-emails/process in production;
 * this job is a Medusa-native backup when the worker process stays up.
 */
export default async function processPeptideRefillsJob(container: MedusaContainer) {
  const logger = container.resolve("logger")

  const renewals = await processDueLabRestocks()
  const dunning = await processPeptideRefillDunning()

  logger.info(
    `[peptide-refill] renewals scanned=${renewals.scanned} created=${renewals.renewal_orders_created} reused=${renewals.reused_sessions} emails=${renewals.emails_sent} failed=${renewals.failed}`
  )
  logger.info(
    `[peptide-refill] dunning scanned=${dunning.scanned} reminder=${dunning.reminder_sent} final=${dunning.final_sent} paused=${dunning.paused} failed=${dunning.failed}`
  )
}

export const config = {
  name: "process-peptide-refills",
  schedule: "0 2 * * *"
}
