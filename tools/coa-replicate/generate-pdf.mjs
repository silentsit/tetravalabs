/**
 * Render COA HTML to PDF via Puppeteer.
 * Usage: node tools/coa-replicate/generate-pdf.mjs [htmlPath] [pdfPath]
 */

import path from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"
import puppeteer from "puppeteer"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const htmlPath = path.resolve(__dirname, process.argv[2] || "COA_VIP_10mg.html")
const pdfPath = path.resolve(
  __dirname,
  process.argv[3] || "../../coas/files/COA_VIP_10mg.pdf"
)

const browser = await puppeteer.launch({ headless: true })
const page = await browser.newPage()
await page.goto(pathToFileURL(htmlPath).href, { waitUntil: "networkidle0" })
await page.pdf({
  path: pdfPath,
  format: "Letter",
  printBackground: true,
  margin: { top: "0.45in", right: "0.55in", bottom: "0.45in", left: "0.55in" }
})
await browser.close()
console.log(`Wrote ${pdfPath}`)
