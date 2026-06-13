#!/usr/bin/env node
/**
 * Runs sanity:seed when SANITY_PROJECT_ID + SANITY_API_WRITE_TOKEN are set.
 * Safe no-op otherwise (exit 0).
 */
import { spawnSync } from "node:child_process"
import path from "node:path"
import { fileURLToPath } from "node:url"
import dotenv from "dotenv"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
dotenv.config({ path: path.join(root, "apps", "storefront", ".env.local") })

const projectId = process.env.SANITY_PROJECT_ID
const token = process.env.SANITY_API_WRITE_TOKEN

if (!projectId || !token) {
  console.log("Sanity seed skipped — set SANITY_PROJECT_ID and SANITY_API_WRITE_TOKEN in apps/storefront/.env.local")
  process.exit(0)
}

const result = spawnSync("node", ["scripts/sanity-seed.mjs"], {
  cwd: root,
  stdio: "inherit",
  env: process.env
})

process.exit(result.status ?? 1)
