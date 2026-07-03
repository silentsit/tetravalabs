import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const v2Dir = path.join(root, "public/products/v2")
const handles = JSON.parse(
  fs.readFileSync(path.join(root, "src/lib/catalog-handles.generated.json"), "utf8")
)
const files = fs.readdirSync(v2Dir)
const pngs = new Set(files.filter((f) => f.endsWith(".png")))
const svgs = new Set(files.filter((f) => f.endsWith(".svg")))

function stems(handle) {
  const out = new Set([handle])
  const n = handle
    .replace(/^ghrp-2-acetate-/i, "ghrp2-")
    .replace(/^ghrp-6-acetate-/i, "ghrp6-")
    .replace(/^hexarelin-acetate-/i, "hexarelin-")
    .replace(/^oxytocin-acetate-/i, "oxytocin-")
    .replace(/^hcg-(\d+)-iu$/i, "hcg-$1iu")
    .replace(/^hmg-(\d+)-iu$/i, "hmg-75iu")
    .replace(/^igf-1-lr3-0-1mg$/i, "igf-1-lr3-0.1mg")
    .replace(/^kisspeptin-10-/i, "kisspeptin-")
    .replace(/^melanotan-1-/i, "melanotan-i-")
    .replace(/^melanotan-2-/i, "melanotan-ii-")
    .replace(/^l-carnitine-600mg-10ml$/i, "l-carnitine-600mg")
    .replace(/^pinealon-capsules-100-count$/i, "pinealon-capsules")
    .replace(/-plus-/g, "-")
    .replace(/^nad-plus-/i, "nad-")
  out.add(n)
  out.add(handle.replace(/aod-9604/g, "aod9604"))
  out.add(handle.replace(/bpc-157/g, "bpc157"))
  out.add(handle.replace(/cjc-1295-with-dac/i, "cjc-1295"))
  out.add(handle.replace(/cjc-1295-without-dac/i, "cjc-1295-no-dac"))
  out.add(handle.replace(/cjc-1295-with-dac/g, "cjc1295-dac"))
  out.add(handle.replace(/cjc-1295-with-dac/g, "cjc1295"))
  out.add(handle.replace(/cjc-1295-ipamorelin-blend/i, "cjc1295-ipa-blend"))
  out.add(handle.replace(/cjc-1295-sermorelin-ipamorelin-blend/i, "cjc-serm-ipa-blend"))
  out.add(handle.replace(/^bacteriostatic-water-10ml$/i, "bac-water-10ml"))
  out.add(handle.replace(/^hgh-191aa-10-iu$/i, "hgh-10iu"))
  out.add(handle.replace(/^hgh-191aa-12-iu$/i, "hgh-191aa-12iu"))
  out.add(handle.replace(/^hgh-191aa-15-iu$/i, "hgh-191aa-15iu"))
  out.add(handle.replace(/^hgh-191aa-24-iu$/i, "hgh-191aa-24iu"))
  out.add(handle.replace(/^hgh-191aa-36-iu$/i, "hgh-191aa-36iu"))
  out.add(handle.replace(/bpc-157-5mg-tb500-5mg-10mg/i, "bpc-tb500-blend-10mg"))
  out.add(handle.replace(/bpc-157-5mg-tb500-5mg-20mg/i, "bpc-tb500-blend-20mg"))
  out.add(handle.replace(/glow-tb500.*70mg/i, "glow-enhanced-70mg"))
  out.add(handle.replace(/cu-50mg-tb500.*80mg/i, "copper-repair-80mg"))
  out.add(handle.replace(/cagrilintide-semaglutide/i, "cagrilintide-semaglutide"))
  out.add(handle.replace(/bpc-157-capsules-100ct/i, "bpc-157-capsules-500mcg"))
  out.add(handle.replace(/bpc-157-capsules-100ct/i, "bpc157-capsules"))
  out.add(handle.replace(/acetic-acid-water-3ml/i, "acetic-acid-3ml"))
  out.add(handle.replace(/benzyl-alcohol-3ml/i, "acetic-acid-3ml"))
  out.add(handle.replace(/benzyl-alcohol-10ml/i, "bacteriostatic-water-10ml"))
  out.add(handle.replace(/bacteriostatic-water-3ml/i, "bacteriostatic-water-10ml"))
  out.add(handle.replace(/dsip-15mg/i, "dsip-15mg"))
  out.add(handle.replace(/vip-10mg/i, "selank-10mg"))
  out.add(handle.replace(/retatrutide-100mg/i, "retatrutide-100mg"))
  out.add(handle.replace(/tirzepatide-50mg/i, "tirzepatide-50mg"))
  return [...out]
}

function pick(stemList) {
  for (const stem of stemList) {
    if (pngs.has(`${stem}.png`)) return `${stem}.png`
  }
  for (const stem of stemList) {
    if (svgs.has(`${stem}.svg`)) return `${stem}.svg`
  }
  return null
}

const missing = []
const svgFallback = []
const mapped = {}
for (const handle of handles) {
  const stemList = stems(handle)
  let file = null
  for (const stem of stemList) {
    if (pngs.has(`${stem}.png`)) {
      file = `${stem}.png`
      break
    }
  }
  if (!file) {
    for (const stem of stemList) {
      if (svgs.has(`${stem}.svg`)) {
        file = `${stem}.svg`
        break
      }
    }
  }
  if (!file) missing.push(handle)
  else {
    mapped[handle] = file
    if (file.endsWith(".svg")) svgFallback.push(`${handle} -> ${file}`)
  }
}
console.log("png mapped", Object.values(mapped).filter((f) => f.endsWith(".png")).length)
console.log("svg fallback", svgFallback.length)
if (svgFallback.length) console.log(svgFallback.join("\n"))
console.log("missing", missing.length, missing)
