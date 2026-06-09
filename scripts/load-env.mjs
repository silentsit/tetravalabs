import fs from "node:fs/promises"
import path from "node:path"

export function parseEnv(content) {
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

export async function loadEnvFile(relativePath) {
  const filePath = path.join(process.cwd(), relativePath)
  try {
    const content = await fs.readFile(filePath, "utf8")
    return parseEnv(content)
  } catch {
    return {}
  }
}

export async function loadDeployEnv() {
  const storefront = await loadEnvFile(path.join("apps", "storefront", ".env.local"))
  const medusa = await loadEnvFile(path.join("apps", "medusa", ".env"))
  return { storefront, medusa }
}
