/**
 * One-shot production data setup:
 * 1. Ensure admin credentials in apps/medusa/.env
 * 2. Create admin user in Neon (local medusa exec → production DATABASE_URL)
 * 3. Bootstrap region, shipping, publishable API key on Render Medusa
 * 4. Import catalog
 * 5. Print Vercel env vars to set
 *
 * Usage:
 *   npm run production:setup
 *   npm run production:setup:run
 *   PowerShell: $env:PRODUCTION_SETUP_RUN="true"; npm run production:setup
 */

import { execSync } from "node:child_process"
import crypto from "node:crypto"
import fs from "node:fs/promises"
import path from "node:path"
import { loadDeployEnv } from "./load-env.mjs"

const PRODUCTION_MEDUSA_URL =
  (process.env.MEDUSA_ADMIN_URL || "https://tetrava-medusa.onrender.com").replace(/\/$/, "")
const PRODUCTION_STOREFRONT_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.PRODUCTION_STOREFRONT_URL ||
  "https://tetravalabs.com"
).replace(/\/$/, "")

const shouldRun =
  process.argv.includes("--run") || process.env.PRODUCTION_SETUP_RUN === "true"

const medusaEnvPath = path.join(process.cwd(), "apps", "medusa", ".env")
const storefrontEnvPath = path.join(process.cwd(), "apps", "storefront", ".env.local")

const parseEnv = (content) => {
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

const serializeEnv = (entries) =>
  Object.entries(entries)
    .map(([key, value]) => `${key}=${value}`)
    .join("\n")

const upsertEnvValue = (content, key, value) => {
  const lines = content.split("\n")
  let found = false
  const next = lines.map((line) => {
    if (line.startsWith(`${key}=`)) {
      found = true
      return `${key}=${value}`
    }
    return line
  })
  if (!found) {
    next.push(`${key}=${value}`)
  }
  return next.join("\n").replace(/\n+$/, "") + "\n"
}

const ensureMedusaEnv = async () => {
  let content = ""
  try {
    content = await fs.readFile(medusaEnvPath, "utf8")
  } catch {
    content = ""
  }

  const current = parseEnv(content)
  const email = process.env.MEDUSA_ADMIN_EMAIL || current.MEDUSA_ADMIN_EMAIL || "admin@tetravalabs.com"
  const password =
    process.env.MEDUSA_ADMIN_PASSWORD ||
    current.MEDUSA_ADMIN_PASSWORD ||
    crypto.randomBytes(18).toString("base64url")

  content = upsertEnvValue(content, "MEDUSA_ADMIN_URL", PRODUCTION_MEDUSA_URL)
  content = upsertEnvValue(content, "MEDUSA_ADMIN_EMAIL", email)
  content = upsertEnvValue(content, "MEDUSA_ADMIN_PASSWORD", password)

  await fs.writeFile(medusaEnvPath, content, "utf8")

  if (!current.DATABASE_URL) {
    console.error("DATABASE_URL is missing in apps/medusa/.env (Neon connection required for bootstrap:admin).")
    process.exit(1)
  }

  return { email, password, createdPassword: !current.MEDUSA_ADMIN_PASSWORD && !process.env.MEDUSA_ADMIN_PASSWORD }
}

const runCommand = (command, env = {}) => {
  console.log(`\n→ ${command}`)
  execSync(command, {
    stdio: "inherit",
    env: { ...process.env, MEDUSA_ADMIN_URL: PRODUCTION_MEDUSA_URL, ...env }
  })
}

const printVercelInstructions = (publishableKey) => {
  console.log("\n--- Vercel production env ---")
  console.log(`NEXT_PUBLIC_MEDUSA_URL=${PRODUCTION_MEDUSA_URL}`)
  console.log(`NEXT_PUBLIC_SITE_URL=${PRODUCTION_STOREFRONT_URL}`)
  if (publishableKey) {
    console.log(`NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=${publishableKey}`)
  } else {
    console.log("NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=<from bootstrap output above>")
  }
  console.log("\nSet via Vercel dashboard or:")
  console.log(`  vercel env add NEXT_PUBLIC_MEDUSA_URL production`)
  console.log(`  vercel env add NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY production`)
  console.log("\nThen redeploy storefront and run:")
  console.log(
    `  SMOKE_STOREFRONT_URL=${PRODUCTION_STOREFRONT_URL} SMOKE_MEDUSA_URL=${PRODUCTION_MEDUSA_URL} npm run smoke:production`
  )
}

async function main() {
  const { email, password, createdPassword } = await ensureMedusaEnv()
  const { storefront } = await loadDeployEnv()

  console.log("Tetrava production data setup\n")
  console.log(`Medusa URL: ${PRODUCTION_MEDUSA_URL}`)
  console.log(`Storefront URL: ${PRODUCTION_STOREFRONT_URL}`)
  console.log(`Admin email: ${email}`)
  if (createdPassword) {
    console.log(`Generated admin password (saved to apps/medusa/.env): ${password}`)
  } else {
    console.log("Using existing MEDUSA_ADMIN_PASSWORD from env file.")
  }

  const steps = [
    { name: "Normalize catalog", command: "npm run catalog:normalize" },
    {
      name: "Create admin user in production DB (Neon)",
      command: "npm --prefix apps/medusa run bootstrap:admin",
      note: "Safe to re-run only if admin does not exist yet."
    },
    {
      name: "Bootstrap store on Render (region, shipping, API key)",
      command: "npm --prefix apps/medusa run bootstrap:store:rotate"
    },
    { name: "Import catalog to Render Medusa", command: "npm run catalog:import" }
  ]

  console.log("\nSteps:")
  steps.forEach((step, index) => {
    console.log(`${index + 1}. ${step.name}`)
    console.log(`   ${step.command}`)
    if (step.note) console.log(`   (${step.note})`)
  })

  if (!shouldRun) {
    console.log("\nDry run only. Re-run with --run to execute:")
    console.log("  npm run production:setup:run")
    console.log('  PowerShell: $env:PRODUCTION_SETUP_RUN="true"; npm run production:setup')
    printVercelInstructions(storefront.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY)
    return
  }

  try {
    runCommand("npm run production:verify")
  } catch {
    console.log(
      "\n[warn] production:verify failed — Render DATABASE_URL may not match apps/medusa/.env."
    )
    console.log("Continuing bootstrap anyway. Fix Render DATABASE_URL if remote steps fail.\n")
  }

  for (const step of steps) {
    console.log(`\n=== ${step.name} ===`)
    try {
      runCommand(step.command)
    } catch (error) {
      if (step.command.includes("bootstrap:admin")) {
        console.log("[warn] bootstrap:admin failed — admin may already exist. Continuing.")
      } else {
        throw error
      }
    }
  }

  console.log("\n=== Production data setup complete ===")
  printVercelInstructions()
}

main().catch((error) => {
  console.error(error?.message || error)
  process.exit(1)
})
