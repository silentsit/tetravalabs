import { loadDeployEnv } from "./load-env.mjs"

const steps = [
  "Deploy Medusa on Render (render.yaml) with Neon DATABASE_URL and Upstash REDIS_URL",
  "Set STORE_CORS, AUTH_CORS, ADMIN_CORS to your Vercel domain(s)",
  "Run db:migrate + db:lab-schema (Render preDeployCommand handles this on deploy)",
  "Bootstrap admin: npm --prefix apps/medusa run bootstrap:admin",
  "Bootstrap store: npm run medusa:bootstrap (region, shipping, publishable key)",
  "Import catalog: npm run catalog:import",
  "Copy NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY into Vercel env",
  "Set Vercel NEXT_PUBLIC_MEDUSA_URL to Render Medusa URL",
  "Configure BTCPAY_URL, BTCPAY_API_KEY, BTCPAY_STORE_ID on Render",
  "Point BTCPay webhook to https://<medusa>/webhooks/payments/btcpay",
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
  console.log(`  STOREFRONT_URL: ${medusa.STOREFRONT_URL || storefront.NEXT_PUBLIC_SITE_URL || "(not set)"}`)
  console.log("\nFull env mapping: npm run deploy:env")
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
