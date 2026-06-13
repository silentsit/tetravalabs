import { loadDeployEnv } from "./load-env.mjs"

const steps = [
  "Deploy Medusa on Render (render.yaml) with Neon DATABASE_URL and Upstash REDIS_URL",
  "Set STORE_CORS, AUTH_CORS, ADMIN_CORS to your Vercel domain(s)",
  "Run db:migrate + db:lab-schema (Render preDeployCommand handles this on deploy)",
  "Verify Render DATABASE_URL matches apps/medusa/.env Neon host: npm run production:verify",
  "Bootstrap admin: npm --prefix apps/medusa run bootstrap:admin",
  "Bootstrap store: npm run medusa:bootstrap (region, shipping, publishable key)",
  "Import catalog: npm run catalog:import",
  "Copy NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY into Vercel env",
  "Set Vercel NEXT_PUBLIC_MEDUSA_URL to Render Medusa URL",
  "BTCPay setup guide: npm run btcpay:setup (then add vars on Render and redeploy Medusa)",
  "Point BTCPay webhook to https://<medusa>/webhooks/payments/btcpay",
  "Paymento setup guide: npm run paymento:setup (PAYMENTO_API_KEY + PAYMENTO_SECRET_KEY on Render)",
  "Point Paymento IPN to https://<medusa>/webhooks/payments/paymento",
  "Checkout smoke test: npm run smoke:checkout",
  "Full launch gate: npm run launch:verify",
  "Run: SMOKE_STOREFRONT_URL=... SMOKE_MEDUSA_URL=... npm run smoke:production",
  "Remote bootstrap: MEDUSA_ADMIN_URL=https://<medusa> npm run bootstrap:remote -- --run"
]

async function run() {
  const { storefront, medusa } = await loadDeployEnv()

  console.log("Tetrava production checklist\n")
  steps.forEach((step, index) => {
    console.log(`${index + 1}. ${step}`)
  })

  console.log("\nLocal env snapshot:")
  console.log(`  NEXT_PUBLIC_MEDUSA_URL: ${storefront.NEXT_PUBLIC_MEDUSA_URL || medusa.MEDUSA_ADMIN_URL || "(not set)"}`)
  console.log(
    `  NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY: ${storefront.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY ? "set" : "missing"}`
  )
  console.log(`  DATABASE_URL: ${medusa.DATABASE_URL ? "set" : "missing"}`)
  console.log(`  BTCPAY_URL: ${medusa.BTCPAY_URL || medusa.CRYPTO_API_URL || "(not set)"}`)
  console.log(`  PAYMENTO_API_KEY: ${medusa.PAYMENTO_API_KEY ? "set" : "(not set)"}`)
  console.log(`  STOREFRONT_URL: ${medusa.STOREFRONT_URL || storefront.NEXT_PUBLIC_SITE_URL || "(not set)"}`)
  console.log("\nFull env mapping: npm run deploy:env")
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
