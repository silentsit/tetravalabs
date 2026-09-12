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
      matcher: "/store/checkout/bind-customer",
      middlewares: [
        authenticate("customer", ["session", "bearer"], { allowUnauthenticated: true })
      ]
    },
    {
      method: ["POST"],
      matcher: "/store/checkout/sync-orders",
      middlewares: [authenticate("customer", ["session", "bearer"])]
    },
    {
      method: ["GET"],
      matcher: "/store/admin/invoices",
      middlewares: [authenticate("customer", ["session", "bearer"])]
    },
    {
      method: ["POST"],
      matcher: "/store/admin/invoices/mark-paid",
      middlewares: [authenticate("customer", ["session", "bearer"])]
    },
    {
      method: ["GET", "POST"],
      matcher: "/webhooks/payments/cardtousdt",
      // Settlement fields live on the query string. CardToUSDT POST retry is empty
      // application/x-www-form-urlencoded, but default express.json() would 400 before
      // our handler if a proxy rewrote Content-Type to application/json.
      bodyParser: false
    },
    {
      method: ["POST"],
      matcher: "/webhooks/payments/paymento",
      bodyParser: { preserveRawBody: true }
    }
  ]
})
