import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { sendPasswordResetEmail } from "../lib/resend"

type PasswordResetEvent = {
  entity_id: string
  actor_type: string
  token: string
  metadata?: Record<string, unknown>
}

export default async function authPasswordResetHandler({
  event: { data }
}: SubscriberArgs<PasswordResetEvent>) {
  if (!data?.entity_id || !data?.token) return

  if (data.actor_type !== "customer") {
    return
  }

  const storefront = (process.env.STOREFRONT_URL || "https://tetravalabs.com").replace(/\/$/, "")
  const params = new URLSearchParams({
    token: data.token,
    email: data.entity_id
  })
  const resetUrl = `${storefront}/account/reset-password?${params.toString()}`

  const result = await sendPasswordResetEmail({
    email: data.entity_id,
    resetUrl
  })

  if (!result.sent) {
    console.warn("[auth.password_reset] Failed to send reset email:", result.reason)
  }
}

export const config: SubscriberConfig = {
  event: ["auth.password_reset"]
}
