/**
 * Build VIP 10mg COA HTML/PDF from LlamaParse-parsed Morgan reference COA.
 * Usage: node build-vip-from-llamaparse.mjs
 */

import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { spawn } from "node:child_process"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const refDir = path.join(__dirname, "reference/llamaparse")
const assetsDir = path.join(__dirname, "assets")
const htmlPath = path.join(__dirname, "COA_VIP_10mg.html")
const pdfPath = path.resolve(
  __dirname,
  "../../coas/files/COA_VIP_10mg.pdf"
)

const VIP = {
  productName: "VIP 10 mg (Injectable Research Vial)",
  chemicalName: "Vasoactive Intestinal Peptide (VIP)",
  cas: "37221-79-7",
  batch: "VIP100601",
  mfgDate: "2026-06-01",
  expiryDate: "2028-06-01",
  netContent: "10 mg per vial",
  storage: "Store at 2–8°C, protected from light and moisture",
  appearance: "White to off-white lyophilized powder",
  formula: "C<sub>147</sub>H<sub>237</sub>N<sub>43</sub>O<sub>43</sub>S / 3326.81 g/mol",
  purity: "99.46%",
  peptideContent: "99.3%",
  water: "0.9%",
  testDate: "2026-06-15"
}

async function ensureAssets() {
  await fs.mkdir(assetsDir, { recursive: true })
  const metaPath = path.join(refDir, "metadata.json")
  const meta = JSON.parse(await fs.readFile(metaPath, "utf8"))
  const images = meta.images?.images ?? []

  const map = {
    "page_1_image_1_v2.jpg": "novagen-logo.jpg",
    "page_2_chart_1_v2.jpg": "hplc-chart.jpg",
    "page_2_image_1_v2.jpg": "signature.jpg"
  }

  for (const image of images) {
    const destName = map[image.filename]
    if (!destName) continue
    const dest = path.join(assetsDir, destName)
    try {
      await fs.access(dest)
      continue
    } catch {
      // download
    }
    const res = await fetch(image.presigned_url)
    if (!res.ok) throw new Error(`Failed to download ${image.filename}`)
    await fs.writeFile(dest, Buffer.from(await res.arrayBuffer()))
    console.log(`Saved ${destName}`)
  }

  // PNG fallbacks if JPG download failed
  for (const [src, dest] of [
    ["novagen-logo.jpg", "novagen-logo.png"],
    ["hplc-chart.jpg", "hplc-chart.png"],
    ["signature.jpg", "signature.png"]
  ]) {
    const jpg = path.join(assetsDir, src)
    const png = path.join(assetsDir, dest)
    try {
      await fs.access(jpg)
      await fs.copyFile(jpg, png)
    } catch {
      // keep existing png assets
    }
  }
}

function productTable() {
  const rows = [
    ["Product Name", VIP.productName],
    ["Chemical Name", VIP.chemicalName],
    ["CAS Number", VIP.cas],
    ["Batch / Lot Number", VIP.batch],
    ["Manufacturing Date", VIP.mfgDate],
    ["Retest / Expiry Date", VIP.expiryDate],
    ["Net Content", VIP.netContent],
    ["Storage Conditions", VIP.storage],
    ["Appearance", VIP.appearance],
    ["Molecular Formula / MW", VIP.formula]
  ]
  return rows
    .map(
      ([label, value]) =>
        `<tr><th>${label}</th><td>${value}</td></tr>`
    )
    .join("\n    ")
}

function resultsTable() {
  const rows = [
    ["Identification", "Conforms", "Conforms", "LC-MS"],
    ["Purity (HPLC)", "≥98.0%", VIP.purity, "HPLC"],
    ["Peptide Content", "95.0–105.0%", VIP.peptideContent, "HPLC"],
    ["Appearance", VIP.appearance, "Conforms", "Visual"],
    ["Water Content", "≤3.0%", VIP.water, "Karl Fischer"],
    ["Heavy Metals", "≤10 ppm", "&lt;10 ppm", "ICP-MS"],
    ["Endotoxin", "&lt;10 EU/mg", "&lt;10 EU/mg", "LAL Test"]
  ]
  return rows
    .map(
      ([item, spec, result, method]) =>
        `<tr><td>${item}</td><td>${spec}</td><td>${result}</td><td>${method}</td></tr>`
    )
    .join("\n      ")
}

async function buildHtml() {
  const logo = "assets/novagen-logo.jpg"
  const chart = "assets/hplc-chart.jpg"
  const signature = "assets/signature.jpg"

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>COA VIP 10mg</title>
  <style>
    @page { size: letter; margin: 0.55in 0.65in; }
    * { box-sizing: border-box; }
    body {
      font-family: "Segoe UI", Arial, sans-serif;
      color: #111827;
      font-size: 11px;
      line-height: 1.35;
      margin: 0;
    }
    .logo { width: 280px; margin-bottom: 10px; }
    .lab-line {
      text-align: center;
      font-size: 10px;
      color: #374151;
      margin: 8px 0 14px;
    }
    h1 {
      text-align: center;
      font-size: 18px;
      letter-spacing: 0.4px;
      margin: 0 0 14px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 14px;
    }
    th, td {
      border: 1px solid #cbd5e1;
      padding: 6px 8px;
      vertical-align: top;
    }
    th {
      width: 28%;
      background: #f8fafc;
      text-align: left;
      font-weight: 600;
    }
    h2 {
      font-size: 13px;
      margin: 10px 0 8px;
    }
    .chart {
      width: 100%;
      max-height: 260px;
      object-fit: contain;
      border: 1px solid #e2e8f0;
      margin: 8px 0 12px;
    }
    .disclaimer {
      font-style: italic;
      color: #475569;
      margin: 10px 0 14px;
    }
    .signature {
      width: 180px;
      margin-top: 4px;
    }
    .footer-table th { width: 22%; }
    .results-table th { width: auto; background: #f8fafc; }
  </style>
</head>
<body>
  <img class="logo" src="${logo}" alt="Novagen Analytical Labs" />
  <div class="lab-line">Independent Research Testing Center 875 Innovation Drive, Cambridge, MA 02139, USA</div>
  <h1>CERTIFICATE OF ANALYSIS (COA)</h1>

  <table>
    ${productTable()}
  </table>

  <h2>Analytical Results</h2>
  <table class="results-table">
    <thead>
      <tr>
        <th>Test Item</th>
        <th>Specification</th>
        <th>Result</th>
        <th>Method</th>
      </tr>
    </thead>
    <tbody>
      ${resultsTable()}
    </tbody>
  </table>

  <h2>HPLC Chromatogram</h2>
  <img class="chart" src="${chart}" alt="HPLC chromatogram" />

  <p class="disclaimer">For laboratory research use only. Not for human consumption.</p>

  <table class="footer-table">
    <tr><th>Tester Name</th><td>Dr. Michael Carter</td></tr>
    <tr><th>Signature</th><td><img class="signature" src="${signature}" alt="Signature" /></td></tr>
    <tr><th>Test Date</th><td>${VIP.testDate}</td></tr>
  </table>
</body>
</html>
`

  await fs.writeFile(htmlPath, html, "utf8")
  console.log(`Wrote ${htmlPath}`)
}

function runPdf() {
  return new Promise((resolve, reject) => {
    const child = spawn("node", ["generate-pdf.mjs", htmlPath, pdfPath], {
      cwd: __dirname,
      stdio: "inherit"
    })
    child.on("exit", (code) =>
      code === 0 ? resolve() : reject(new Error(`generate-pdf exited ${code}`))
    )
  })
}

await ensureAssets()
await buildHtml()
await runPdf()
console.log(`Done: ${pdfPath}`)
