import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const source = path.join(appRoot, "src", "lib", "database-url.cjs")
const targetDir = path.join(appRoot, ".medusa", "server", "src", "lib")
const target = path.join(targetDir, "database-url.cjs")

if (!fs.existsSync(source)) {
  console.error("[copy-database-url] missing source:", source)
  process.exit(1)
}

if (!fs.existsSync(path.join(appRoot, ".medusa", "server"))) {
  console.log("[copy-database-url] no production build output yet; skipped")
  process.exit(0)
}

fs.mkdirSync(targetDir, { recursive: true })
fs.copyFileSync(source, target)
console.log("[copy-database-url] copied to", target)
