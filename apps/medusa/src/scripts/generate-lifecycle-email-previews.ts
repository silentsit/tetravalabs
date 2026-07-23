import fs from "node:fs"
import path from "node:path"
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

process.env.STOREFRONT_URL ||= "https://tetravalabs.com"

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

const firstName = "Alex"
const orderLabel = "Order #1042"
const shopUrl = buildStorefrontShopUrl()
const blogUrl = buildStorefrontBlogUrl()
const contactUrl = buildStorefrontContactUrl()
const ordersUrl = buildStorefrontOrdersUrl()
const coaLibraryUrl = buildStorefrontCoaLibraryUrl()
const checkoutUrl = buildCheckoutUrl()

const built = [
  buildWelcomeEmail({ firstName, shopUrl, blogUrl, contactUrl }),
  buildWelcomeFollowupEmail({ firstName, shopUrl, blogUrl, contactUrl }),
  buildWinbackEmail({ firstName, shopUrl, contactUrl }),
  buildReplenishmentEmail({
    firstName,
    orderLabel,
    items: sampleItems,
    ordersUrl,
    shopUrl,
    contactUrl,
    step: 1
  }),
  buildReplenishmentEmail({
    firstName,
    orderLabel,
    items: sampleItems,
    ordersUrl,
    shopUrl,
    contactUrl,
    step: 2
  }),
  buildReplenishmentEmail({
    firstName,
    orderLabel,
    items: sampleItems,
    ordersUrl,
    shopUrl,
    contactUrl,
    step: 3
  }),
  buildCoaTrustEmail({
    firstName,
    orderLabel,
    items: sampleItems,
    coaLibraryUrl,
    ordersUrl,
    contactUrl
  }),
  buildCheckoutAbandonFinalEmail({
    items: sampleItems,
    subtotal: 104,
    checkoutUrl,
    contactUrl
  })
]

const emails = built.map((email) => ({
  from: "Tetrava Labs <orders@tetravalabs.com>",
  to: ["tetravalabs@gmail.com"],
  subject: `[PREVIEW] ${email.subject}`,
  html: email.html,
  text: "Preview of Tetrava Labs lifecycle email. View in an HTML client for the full design."
}))

const out = path.resolve(process.cwd(), "tmp-lifecycle-previews.json")
fs.writeFileSync(out, JSON.stringify(emails))
console.log(`Wrote ${emails.length} emails to ${out}`)
