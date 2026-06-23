import { defineMiddlewares, authenticate } from "@medusajs/framework/http"

export default defineMiddlewares({
  routes: [
    {
      method: ["GET"],
      matcher: "/store/reviews",
      middlewares: [
        authenticate("customer", ["session", "bearer"], { allowUnauthenticated: true })
      ]
    },
    {
      method: ["POST"],
      matcher: "/store/reviews",
      middlewares: [authenticate("customer", ["session", "bearer"])]
    },
    {
      method: ["DELETE"],
      matcher: "/store/reviews/:id",
      middlewares: [authenticate("customer", ["session", "bearer"])]
    },
    {
      method: ["POST"],
      matcher: "/store/auth/oauth-complete",
      middlewares: [authenticate("customer", ["session", "bearer"])]
    },
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
