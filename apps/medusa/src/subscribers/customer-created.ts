import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { scheduleCustomerLifecycleEmails } from "../lib/customer-lifecycle-emails"

type CustomerCreatedEvent = {
  id: string
}

export default async function customerCreatedHandler({
  event: { data }
}: SubscriberArgs<CustomerCreatedEvent>) {
  const customerId = data?.id?.trim()
  if (!customerId) return

  const result = await scheduleCustomerLifecycleEmails({ customerId })
  if (!result.ok) {
    console.warn("[customer.created] lifecycle schedule failed:", result.reason)
  }
}

export const config: SubscriberConfig = {
  event: ["customer.created"]
}
