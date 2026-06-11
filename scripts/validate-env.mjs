import fs from "node:fs/promises"
import path from "node:path"

const root = process.cwd()
const storefrontEnvPath = path.join(root, "apps", "storefront", ".env.local")
const medusaEnvPath = path.join(root, "apps", "medusa", ".env")

const required = {
  storefront: [
    "NEXT_PUBLIC_SITE_URL",
    "NEXT_PUBLIC_MEDUSA_URL",
    "NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY",
    "REVALIDATE_SECRET"
  ],
  medusa: ["DATABASE_URL", "JWT_SECRET", "COOKIE_SECRET", "STORE_CORS", "AUTH_CORS"]
}

const recommendedProduction = [
  { key: "BTCPAY_URL", file: "medusa", label: "BTCPay Server URL (crypto payments)" },
  { key: "BTCPAY_API_KEY", file: "medusa", label: "BTCPay API key" },
  { key: "BTCPAY_STORE_ID", file: "medusa", label: "BTCPay store ID" },
  { key: "PAYMENTO_API_KEY", file: "medusa", label: "Paymento API key (USDT, ETH, etc.)" },
  { key: "PAYMENTO_SECRET_KEY", file: "medusa", label: "Paymento secret key (IPN HMAC)" },
  { key: "STOREFRONT_URL", file: "medusa", label: "Public storefront URL for payment redirects" },
  { key: "NEXT_PUBLIC_SITE_URL", file: "storefront", label: "Canonical site URL" },
  { key: "RESEND_API_KEY", file: "storefront", label: "Resend API key (order confirmation emails)" },
  { key: "RESEND_FROM", file: "storefront", label: "Verified Resend sender address" },
  { key: "RESTRICTED_COUNTRIES", file: "storefront", label: "ISO country codes blocked at checkout" }
]

function parseEnv(content) {
  const entries = content
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => {
      const idx = line.indexOf("=")
      if (idx === -1) return [line, ""]
      return [line.slice(0, idx), line.slice(idx + 1)]
    })
  return Object.fromEntries(entries)
}

async function readEnv(filePath) {
  try {
    const content = await fs.readFile(filePath, "utf8")
    return parseEnv(content)
  } catch {
    return null
  }
}

async function checkFile(filePath, keys, label) {
  const env = await readEnv(filePath)
  if (!env) {
    console.log(`[${label}] file missing: ${filePath}`)
    return 1
  }

  const missing = keys.filter((key) => !env[key] || env[key] === "change-me")
  if (missing.length) {
    console.log(`[${label}] missing: ${missing.join(", ")}`)
    return 1
  }
  console.log(`[${label}] ok`)
  return 0
}

async function run() {
  let failed = 0
  failed += await checkFile(storefrontEnvPath, required.storefront, "storefront")
  failed += await checkFile(medusaEnvPath, required.medusa, "medusa")

  const storefront = (await readEnv(storefrontEnvPath)) || {}
  const medusa = (await readEnv(medusaEnvPath)) || {}
  const warnings = []

  for (const item of recommendedProduction) {
    const env = item.file === "medusa" ? medusa : storefront
    if (!env[item.key]) {
      warnings.push(`${item.key} — ${item.label}`)
    }
  }

  if (warnings.length > 0) {
    console.log("Recommended for production (optional):")
    for (const item of warnings) {
      console.log(`- ${item}`)
    }
  }

  if (failed > 0) process.exit(1)
  console.log("Environment validation passed.")
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
