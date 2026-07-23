/**
 * One-off: send preview copies of lifecycle emails to a test inbox.
 * Usage: node --import tsx ./src/scripts/send-lifecycle-email-previews.ts
 * Or: npx ts-node --esm ./src/scripts/send-lifecycle-email-previews.ts
 */
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import {
  buildCheckoutAbandonFinalEmail,
  buildCheckoutUrl,
  buildCoaTrustEmail,
  buildReplenishmentEmail,
  buildStorefrontBlogUrl,
  buildStorefrontCoaLibraryUrl,
  buildStorefrontContactUrl,
  buildStorefrontOrdersUrl,
  buildStorefrontShopUrl,
  buildWelcomeEmail,
  buildWelcomeFollowupEmail,
  buildWinbackEmail
} from "../lib/order-email-templates"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const medusaRoot = path.resolve(__dirname, "..", "..")

function loadEnvFile(filePath: string) {
  if (!fs.existsSync(filePath)) return
  for (const line of fs.readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#")) continue
    const sep = trimmed.indexOf("=")
    if (sep === -1) continue
    const key = trimmed.slice(0, sep).trim()
    let value = trimmed.slice(sep + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    if (!(key in process.env)) process.env[key] = value
  }
}

loadEnvFile(path.join(medusaRoot, ".env"))

const TO = process.env.PREVIEW_EMAIL_TO || "tetravalabs@gmail.com"
const FROM = process.env.RESEND_FROM || "Tetrava Labs <orders@tetravalabs.com>"

const sampleItems = [
  {
    title: "BPC-157",
    variantTitle: "10mg",
    quantity: 1,
    unitPrice: 49.0,
    handle: "bpc-157"
  },
  {
    title: "TB-500",
    variantTitle: "10mg",
    quantity: 1,
    unitPrice: 55.0,
    handle: "tb-500"
  }
]

async function send(subject: string, html: string) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) throw new Error("RESEND_API_KEY not configured")

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: FROM,
      to: [TO],
      subject: `[PREVIEW] ${subject}`,
      html
    })
  })

  const body = await response.text()
  if (!response.ok) {
    return { ok: false as const, subject, reason: body }
  }
  return { ok: true as const, subject, body }
}

async function main() {
  const shopUrl = buildStorefrontShopUrl()
  const blogUrl = buildStorefrontBlogUrl()
  const contactUrl = buildStorefrontContactUrl()
  const ordersUrl = buildStorefrontOrdersUrl()
  const coaLibraryUrl = buildStorefrontCoaLibraryUrl()
  const checkoutUrl = buildCheckoutUrl()
  const firstName = "Alex"
  const orderLabel = "Order #1042"

  const emails = [
    {
      id: "W1",
      ...buildWelcomeEmail({ firstName, shopUrl, blogUrl, contactUrl })
    },
    {
      id: "W2",
      ...buildWelcomeFollowupEmail({ firstName, shopUrl, blogUrl, contactUrl })
    },
    {
      id: "WB1",
      ...buildWinbackEmail({ firstName, shopUrl, contactUrl })
    },
    {
      id: "R1",
      ...buildReplenishmentEmail({
        firstName,
        orderLabel,
        items: sampleItems,
        ordersUrl,
        shopUrl,
        contactUrl,
        step: 1
      })
    },
    {
      id: "R2",
      ...buildReplenishmentEmail({
        firstName,
        orderLabel,
        items: sampleItems,
        ordersUrl,
        shopUrl,
        contactUrl,
        step: 2
      })
    },
    {
      id: "R3",
      ...buildReplenishmentEmail({
        firstName,
        orderLabel,
        items: sampleItems,
        ordersUrl,
        shopUrl,
        contactUrl,
        step: 3
      })
    },
    {
      id: "P2",
      ...buildCoaTrustEmail({
        firstName,
        orderLabel,
        items: sampleItems,
        coaLibraryUrl,
        ordersUrl,
        contactUrl
      })
    },
    {
      id: "C1c",
      ...buildCheckoutAbandonFinalEmail({
        items: sampleItems,
        subtotal: 104,
        checkoutUrl,
        contactUrl
      })
    }
  ]

  console.log(`Sending ${emails.length} preview emails to ${TO}…`)

  for (const email of emails) {
    const result = await send(email.subject, email.html)
    if (result.ok) {
      console.log(`OK  ${email.id}: ${email.subject}`)
    } else {
      console.error(`FAIL ${email.id}: ${email.subject} — ${result.reason}`)
    }
    // polite spacing for Resend rate limits
    await new Promise((r) => setTimeout(r, 400))
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
