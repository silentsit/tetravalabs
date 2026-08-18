/**
 * Submit URLs to IndexNow (Bing, Yandex, etc.).
 *
 * Usage:
 *   node apps/storefront/scripts/submit-indexnow.mjs --top
 *   node apps/storefront/scripts/submit-indexnow.mjs --url https://tetravalabs.com/buy-bpc-157-online
 *   node apps/storefront/scripts/submit-indexnow.mjs --file urls.txt
 *   node apps/storefront/scripts/submit-indexnow.mjs --all-products
 *
 * Requires INDEXNOW_KEY (and optionally NEXT_PUBLIC_SITE_URL).
 * Key file must be live at {SITE}/{KEY}.txt
 */

import { readFileSync, existsSync } from "node:fs"
import { resolve, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const storefrontRoot = resolve(__dirname, "..")
const repoRoot = resolve(storefrontRoot, "../..")

const ENDPOINT = "https://api.indexnow.org/indexnow"

function loadEnvFile(path) {
  if (!existsSync(path)) return
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#")) continue
    const eq = trimmed.indexOf("=")
    if (eq < 1) continue
    const key = trimmed.slice(0, eq).trim()
    let val = trimmed.slice(eq + 1).trim()
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1)
    }
    if (!(key in process.env)) process.env[key] = val
  }
}

loadEnvFile(resolve(storefrontRoot, ".env.local"))
loadEnvFile(resolve(storefrontRoot, ".env"))
loadEnvFile(resolve(repoRoot, ".env"))

const SITE = (process.env.NEXT_PUBLIC_SITE_URL || "https://tetravalabs.com").replace(/\/$/, "")
const KEY = (process.env.INDEXNOW_KEY || "").trim()

function parseArgs(argv) {
  const out = { urls: [], top: false, allProducts: false, dryRun: false, file: null, help: false }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === "--top") out.top = true
    else if (a === "--all-products") out.allProducts = true
    else if (a === "--dry-run") out.dryRun = true
    else if (a === "--url" && argv[i + 1]) out.urls.push(argv[++i])
    else if (a === "--file" && argv[i + 1]) out.file = argv[++i]
    else if (a === "--help" || a === "-h") out.help = true
  }
  return out
}

function abs(pathOrUrl) {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl.replace(/\/$/, "") || pathOrUrl
  const path = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`
  return `${SITE}${path}`
}

function productSegments() {
  const aliasesPath = resolve(storefrontRoot, "src/lib/product-url-aliases.ts")
  const text = readFileSync(aliasesPath, "utf8")
  const m = text.match(/PRODUCT_URL_TO_HANDLE: Record<string, string> = \{([\s\S]*?)\n\}/)
  if (!m) throw new Error("Could not parse PRODUCT_URL_TO_HANDLE")
  return [...m[1].matchAll(/"([^"]+)":\s*"[^"]+"/g)].map((x) => x[1])
}

/** Revenue-priority paths from the Aug 2026 ranking (PDPs + hubs + COA). */
function topRevenuePaths() {
  const featuredAndHighAov = [
    "/buy-retatrutide-online",
    "/buy-tirzepatide-online",
    "/buy-semaglutide-online",
    "/buy-bpc-157-online",
    "/buy-tb-500-online",
    "/buy-ghk-cu-online",
    "/buy-hgh-191aa-online",
    "/buy-ipamorelin-online",
    "/buy-cagrilintide-semaglutide-online",
    "/cjc-1295-with-dac",
    "/buy-tesamorelin-online",
    "/klow-blend",
    "/buy-survodutide-online",
    "/glow-bpc-157-tb-500-ghk-cu",
    "/buy-mots-c-online",
    "/buy-ss-31-online",
    "/wolverine-bpc-157-tb-500-blend",
    "/buy-cagrilintide-online",
    "/buy-mazdutide-online",
    "/buy-nad-online",
    "/buy-igf-1-lr3-online",
    "/buy-foxo4-dri-online",
    "/cjc-1295-without-dac",
    "/buy-sermorelin-peptide",
    "/buy-sermorelin-online",
    "/buy-epithalon-online",
    "/buy-aod-9604-online",
    "/buy-bacteriostatic-water-online",
    "/buy-bpc-157-capsules-online",
  ]
  const hubs = [
    "/",
    "/shop",
    "/category/glp-1-research",
    "/category/tissue-repair",
    "/category/growth-hormone-axis",
    "/category/research-blends",
    "/coa-library",
    "/category/metabolic-mitochondrial",
    "/category/longevity-neuropeptides",
    "/category/lab-supplies",
    "/categories",
    "/faq",
    "/payment",
    "/shipping",
    "/about",
    "/contact",
    "/blog",
    "/ruo",
  ]
  const coa = [
    "/coa-library/bpc-157",
    "/coa-library/retatrutide",
    "/coa-library/tirzepatide",
    "/coa-library/semaglutide",
    "/coa-library/tb500",
    "/coa-library/ghk-cu",
    "/coa-library/hgh-191aa",
    "/coa-library/ss-31",
    "/coa-library/mots-c",
  ]
  const rest = productSegments().filter((seg) => !featuredAndHighAov.includes(`/${seg}`))
  return Array.from(
    new Set([...featuredAndHighAov, ...hubs, ...coa, ...rest.map((s) => `/${s}`)])
  ).slice(0, 100)
}

async function submit(urls, { dryRun }) {
  if (!KEY) {
    console.error("INDEXNOW_KEY is not set. Add it to apps/storefront/.env.local and Vercel.")
    process.exit(1)
  }
  const host = new URL(SITE).host.replace(/^www\./, "")
  const urlList = Array.from(new Set(urls.map(abs)))
  const body = {
    host,
    key: KEY,
    keyLocation: `${SITE}/${KEY}.txt`,
    urlList,
  }
  console.log(`Site: ${SITE}`)
  console.log(`Key file: ${body.keyLocation}`)
  console.log(`URLs: ${urlList.length}`)
  if (dryRun) {
    for (const u of urlList) console.log(`  ${u}`)
    console.log("(dry-run — nothing submitted)")
    return
  }
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(body),
  })
  const text = await res.text().catch(() => "")
  console.log(`HTTP ${res.status}${text ? ` — ${text.slice(0, 200)}` : ""}`)
  if (res.status !== 200 && res.status !== 202) process.exit(1)
  if (res.status === 202) {
    console.log(
      "Accepted — key validation pending. Confirm key file is publicly reachable, then re-run."
    )
  } else {
    console.log("Submitted successfully.")
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  if (args.help) {
    console.log(`Usage:
  node apps/storefront/scripts/submit-indexnow.mjs --top
  node apps/storefront/scripts/submit-indexnow.mjs --all-products
  node apps/storefront/scripts/submit-indexnow.mjs --url https://tetravalabs.com/buy-bpc-157-online
  node apps/storefront/scripts/submit-indexnow.mjs --file urls.txt
  node apps/storefront/scripts/submit-indexnow.mjs --top --dry-run`)
    return
  }

  let urls = [...args.urls]
  if (args.file) {
    const lines = readFileSync(resolve(args.file), "utf8")
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l && !l.startsWith("#"))
    urls.push(...lines)
  }
  if (args.top) urls.push(...topRevenuePaths().map(abs))
  if (args.allProducts) urls.push(...productSegments().map((s) => abs(`/${s}`)))

  if (!urls.length) {
    console.error("No URLs. Use --top, --all-products, --url, or --file.")
    process.exit(1)
  }

  await submit(urls, { dryRun: args.dryRun })
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
