/**
 * Run Medusa bootstrap + catalog import against a remote Render instance.
 *
 * Usage:
 *   MEDUSA_ADMIN_URL=https://your-medusa.onrender.com npm run bootstrap:remote
 *   MEDUSA_ADMIN_URL=https://your-medusa.onrender.com npm run bootstrap:remote -- --run
 */

import { execSync } from "node:child_process"

const medusaUrl = (process.env.MEDUSA_ADMIN_URL || "").replace(/\/$/, "")

if (!medusaUrl || medusaUrl.includes("localhost")) {
  console.error("Set MEDUSA_ADMIN_URL to your deployed Medusa URL before running remote bootstrap.")
  process.exit(1)
}

console.log(`Remote bootstrap target: ${medusaUrl}`)
console.log(
  "Ensure MEDUSA_ADMIN_EMAIL, MEDUSA_ADMIN_PASSWORD (or MEDUSA_ADMIN_TOKEN) are set in apps/medusa/.env\n"
)

const steps = [
  { name: "Bootstrap store (region, shipping, API key)", command: "npm run medusa:bootstrap" },
  { name: "Import catalog", command: "npm run catalog:import" },
  { name: "Index Typesense (optional)", command: "npm run typesense:index" }
]

for (const step of steps) {
  console.log(`→ ${step.name}`)
  console.log(`  ${step.command}`)
}

console.log("\nRun the commands above manually, or execute with --run to run them automatically.")

if (process.argv.includes("--run")) {
  for (const step of steps) {
    console.log(`\nRunning: ${step.command}`)
    execSync(step.command, {
      stdio: "inherit",
      env: { ...process.env, MEDUSA_ADMIN_URL: medusaUrl }
    })
  }
  console.log("\nRemote bootstrap complete.")
}
