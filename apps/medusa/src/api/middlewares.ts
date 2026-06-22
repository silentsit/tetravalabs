import { defineMiddlewares } from "@medusajs/framework/http"

export default defineMiddlewares({
  routes: [
    {
      method: ["POST"],
      matcher: "/webhooks/payments/paymento",
      bodyParser: { preserveRawBody: true }
    },
    {
      method: ["POST"],
      matcher: "/webhooks/payments/btcpay",
      bodyParser: { preserveRawBody: true }
    },
    {
      method: ["POST"],
      matcher: "/webhooks/payments/peptidepay",
      bodyParser: { preserveRawBody: true }
    }
  ]
})
