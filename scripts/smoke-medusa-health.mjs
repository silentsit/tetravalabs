/**
 * Lightweight production Medusa health check (no checkout / payment side effects).
 *
 * Usage:
 *   SMOKE_MEDUSA_URL=https://tetrava-medusa-i44n.onrender.com node scripts/smoke-medusa-health.mjs
 *   SMOKE_MEDUSA_PUBLISHABLE_KEY=pk_... node scripts/smoke-medusa-health.mjs
 */

const medusaUrl = (
  process.env.SMOKE_MEDUSA_URL || "https://tetrava-medusa-i44n.onrender.com"
).replace(/\/$/, "")

const publishableKey = process.env.SMOKE_MEDUSA_PUBLISHABLE_KEY?.trim() || ""
const maxAttempts = Number(process.env.SMOKE_MEDUSA_RETRIES || 6)
const retryDelayMs = Number(process.env.SMOKE_MEDUSA_RETRY_DELAY_MS || 20_000)

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function fetchStatus(url, headers = {}) {
  const response = await fetch(url, { method: "GET", headers })
  return { ok: response.ok, status: response.status }
}

async function waitForHealth() {
  const url = `${medusaUrl}/health`

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const { ok, status } = await fetchStatus(url)
      if (ok) {
        console.log(`[ok] Medusa health -> ${status} (attempt ${attempt}/${maxAttempts})`)
        return true
      }
      console.log(
        `[retry] Medusa health -> ${status} (attempt ${attempt}/${maxAttempts})`
      )
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      console.log(
        `[retry] Medusa health -> ${message} (attempt ${attempt}/${maxAttempts})`
      )
    }

    if (attempt < maxAttempts) {
      await sleep(retryDelayMs)
    }
  }

  console.error(`[fail] Medusa health did not return 200 after ${maxAttempts} attempts`)
  return false
}

async function checkStoreProducts() {
  if (!publishableKey) {
    console.log("[skip] Medusa store products (no SMOKE_MEDUSA_PUBLISHABLE_KEY)")
    return true
  }

  const url = `${medusaUrl}/store/products?limit=1`
  try {
    const { ok, status } = await fetchStatus(url, {
      "x-publishable-api-key": publishableKey
    })
    if (!ok) {
      console.error(`[fail] Medusa store products -> ${status}`)
      return false
    }
    console.log(`[ok] Medusa store products -> ${status}`)
    return true
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error(`[fail] Medusa store products -> ${message}`)
    return false
  }
}

async function run() {
  console.log(`Medusa health smoke against ${medusaUrl}`)

  const healthOk = await waitForHealth()
  const productsOk = healthOk ? await checkStoreProducts() : false

  if (!healthOk || !productsOk) {
    process.exit(1)
  }

  console.log("Medusa health smoke completed successfully.")
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
