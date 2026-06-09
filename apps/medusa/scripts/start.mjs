import { execSync } from "node:child_process"
import { existsSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const serverDir = path.join(appRoot, ".medusa", "server")
const useProductionBuild =
  process.env.NODE_ENV === "production" &&
  existsSync(path.join(serverDir, "src", "api"))

const cwd = useProductionBuild ? serverDir : appRoot
const medusaCli = path.join(
  appRoot,
  "..",
  "..",
  "node_modules",
  "@medusajs",
  "cli",
  "dist",
  "index.js"
)

console.log(`[medusa] starting from ${cwd}`)
execSync(`node "${medusaCli}" start`, {
  stdio: "inherit",
  cwd,
  env: process.env
})
