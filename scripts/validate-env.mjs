import fs from "node:fs/promises"
import path from "node:path"

const root = process.cwd()
const storefrontEnv = path.join(root, "apps", "storefront", ".env.local")
const medusaEnv = path.join(root, "apps", "medusa", ".env")

const required = {
  storefront: [
    "NEXT_PUBLIC_SITE_URL",
    "NEXT_PUBLIC_MEDUSA_URL",
    "NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY",
    "REVALIDATE_SECRET"
  ],
  medusa: ["DATABASE_URL", "JWT_SECRET", "COOKIE_SECRET", "STORE_CORS", "AUTH_CORS"]
}

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

async function checkFile(filePath, keys, label) {
  try {
    const content = await fs.readFile(filePath, "utf8")
    const env = parseEnv(content)
    const missing = keys.filter((key) => !env[key] || env[key] === "change-me")
    if (missing.length) {
      console.log(`[${label}] missing: ${missing.join(", ")}`)
      return 1
    }
    console.log(`[${label}] ok`)
    return 0
  } catch {
    console.log(`[${label}] file missing: ${filePath}`)
    return 1
  }
}

async function run() {
  let failed = 0
  failed += await checkFile(storefrontEnv, required.storefront, "storefront")
  failed += await checkFile(medusaEnv, required.medusa, "medusa")
  if (failed > 0) process.exit(1)
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
