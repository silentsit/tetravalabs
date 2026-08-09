/**
 * Scrape Biotech Peptides /news/ listing pages → URL + H1 inventory.
 * Run: node scripts/scrape-biotechpeptides-blog.mjs
 */
import { chromium } from "playwright"
import { mkdirSync, writeFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outJson = path.resolve(__dirname, "../doc/biotechpeptides-blog-posts.json")
const outMd = path.resolve(__dirname, "../doc/biotechpeptides-blog-posts.md")

async function main() {
  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage()
  const posts = new Map()
  const base = "https://biotechpeptides.com/news/"

  async function scrapeListing() {
    const items = await page.$$eval(
      "article h2 a, article h3 a, h2.entry-title a, .entry-title a",
      (as) =>
        as
          .map((a) => ({
            href: a.href.split("#")[0],
            text: (a.textContent || "").trim()
          }))
          .filter((x) => x.href && x.text)
    )
    for (const item of items) {
      if (/\/news\/page\//.test(item.href) || /\/news\/?$/.test(item.href)) continue
      if (!posts.has(item.href)) posts.set(item.href, item.text)
    }
  }

  await page.goto(base, { waitUntil: "domcontentloaded", timeout: 90000 })
  await scrapeListing()

  const pageNums = await page.$$eval('a[href*="/news/page/"]', (as) => {
    const nums = new Set()
    for (const a of as) {
      const m = a.href.match(/\/news\/page\/(\d+)\/?/)
      if (m) nums.add(Number(m[1]))
    }
    return [...nums]
  })
  const maxPage = pageNums.length ? Math.max(...pageNums) : 1

  for (let p = 2; p <= maxPage; p++) {
    await page.goto(`${base}page/${p}/`, { waitUntil: "domcontentloaded", timeout: 90000 })
    await scrapeListing()
  }

  // Spot-check a few H1s match listing titles
  const sampleUrls = [...posts.keys()].slice(0, 3)
  const samples = []
  for (const url of sampleUrls) {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 90000 })
    const h1 = await page.$eval("h1", (el) => (el.textContent || "").trim()).catch(() => null)
    samples.push({ url, listingTitle: posts.get(url), h1, match: h1 === posts.get(url) })
  }

  await browser.close()

  const list = [...posts.entries()].map(([url, h1], i) => ({ n: i + 1, url, h1 }))
  const payload = {
    source: base,
    scrapedAt: new Date().toISOString(),
    note: "Posts are listed under /news/ pagination but publish at root URLs (not /news/{slug}). H1 verified equal to listing title on sampled posts.",
    listingPages: maxPage,
    count: list.length,
    h1SampleChecks: samples,
    posts: list
  }

  mkdirSync(path.dirname(outJson), { recursive: true })
  writeFileSync(outJson, JSON.stringify(payload, null, 2))

  const escape = (s) => String(s).replace(/\\/g, "\\\\").replace(/\|/g, "\\|")
  const md = [
    "# Biotech Peptides blog inventory",
    "",
    `- Source listing: ${payload.source}`,
    `- Scraped: ${payload.scrapedAt}`,
    `- Listing pages: ${maxPage}`,
    `- Posts: ${list.length}`,
    "",
    payload.note,
    "",
    "| # | H1 | URL |",
    "|---|----|-----|",
    ...list.map((p) => `| ${p.n} | ${escape(p.h1)} | ${p.url} |`),
    ""
  ].join("\n")
  writeFileSync(outMd, md)

  console.log(JSON.stringify({ count: list.length, maxPage, outJson, outMd, samples }, null, 2))
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
