import { execSync } from "node:child_process"

// Admin is off by default when NODE_ENV=production unless ENABLE_MEDUSA_ADMIN=true.
// Force it during Render builds so /app assets exist even before blueprint env sync.
process.env.ENABLE_MEDUSA_ADMIN = "true"

const maxAttempts = 3
const retryDelaySeconds = 15
// Render sets NODE_ENV=production during build, which skips devDependencies.
// patch-package (root postinstall) and the admin-bundler patch are required for medusa build.
const installCmd =
  "corepack enable && npm ci --workspace=@tetrava/medusa --workspace=@tetrava/catalog --include-workspace-root --include=dev"

function sleep(seconds) {
  execSync(`sleep ${seconds}`)
}

for (let attempt = 1; attempt <= maxAttempts; attempt++) {
  try {
    console.log(`[render-build] npm ci attempt ${attempt}/${maxAttempts}`)
    execSync(installCmd, { stdio: "inherit" })
    break
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    if (attempt >= maxAttempts) {
      console.error(`[render-build] npm ci failed after ${maxAttempts} attempts`)
      throw error
    }
    console.warn(`[render-build] npm ci failed (${message}), retrying in ${retryDelaySeconds}s...`)
    sleep(retryDelaySeconds)
  }
}

console.log("[render-build] building @tetrava/medusa")
// Medusa build only bundles assets; Redis is required at runtime, not during compile.
process.env.USE_REDIS = "false"
execSync("npm run build --workspace=@tetrava/medusa", { stdio: "inherit" })
console.log("[render-build] done")
