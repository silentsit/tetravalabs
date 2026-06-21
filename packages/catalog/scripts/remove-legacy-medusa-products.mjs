/**
 * Delete Medusa products that are not in catalog.normalized.json (legacy consolidated SKUs).
 *
 * Usage:
 *   npm run catalog:remove-legacy -- --dry-run
 *   npm run catalog:remove-legacy
 */

import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import {
  formatAxiosError,
  getMedusaClient,
  loadMedusaEnv,
  requireMedusaCredentials,
  resolveAdminToken,
  syncTypesenseAfterChanges
} from "../lib/medusa-admin.mjs"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const workspaceRoot = path.resolve(__dirname, "..", "..", "..")
const normalizedPath = path.join(
  workspaceRoot,
  "packages",
  "catalog",
  "output",
  "catalog.normalized.json"
)

const dryRun = process.argv.includes("--dry-run")

const run = async () => {
  loadMedusaEnv()
  requireMedusaCredentials()

  const catalog = JSON.parse(await fs.readFile(normalizedPath, "utf8"))
  const catalogHandles = new Set(catalog.products.map((product) => product.handle))

  const token = await resolveAdminToken()
  const client = getMedusaClient(token)

  const all = []
  let offset = 0
  while (true) {
    const response = await client.get("/admin/products", {
      params: { limit: 100, offset, fields: "id,handle,title,status" }
    })
    const batch = response.data?.products || []
    all.push(...batch)
    if (batch.length < 100) break
    offset += 100
  }

  const legacy = all.filter((product) => !catalogHandles.has(product.handle))
  console.log(
    `Medusa products: ${all.length}. Catalog: ${catalogHandles.size}. Legacy to remove: ${legacy.length}.`
  )

  if (!legacy.length) {
    console.log("Nothing to remove.")
    return
  }

  if (dryRun) {
    for (const product of legacy) {
      console.log(`[dry-run] delete ${product.handle} (${product.id})`)
    }
    console.log(`Dry run complete. Would delete ${legacy.length} products.`)
    return
  }

  let deleted = 0
  let failed = 0
  for (const product of legacy) {
    try {
      await client.delete(`/admin/products/${product.id}`)
      deleted += 1
      console.log(`Deleted ${product.handle}`)
    } catch (error) {
      failed += 1
      console.error(`Failed ${product.handle}:`, formatAxiosError(error))
    }
  }

  console.log(`Legacy removal complete. Deleted ${deleted}, failed ${failed}.`)
  if (deleted > 0) {
    await syncTypesenseAfterChanges(deleted)
  }
}

run().catch((error) => {
  console.error("Legacy removal failed:", formatAxiosError(error))
  process.exit(1)
})
