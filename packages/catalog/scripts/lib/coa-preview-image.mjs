import { createRequire } from "node:module"
import { pathToFileURL } from "node:url"

const require = createRequire(import.meta.url)
const PREVIEW_MAX_WIDTH = 480

let pdfjsModule = null

async function getPdfJs() {
  if (!pdfjsModule) {
    pdfjsModule = await import("pdfjs-dist/legacy/build/pdf.mjs")
    const workerPath = require.resolve("pdfjs-dist/legacy/build/pdf.worker.mjs")
    pdfjsModule.GlobalWorkerOptions.workerSrc = pathToFileURL(workerPath).href
  }
  return pdfjsModule
}

export function buildPreviewStorageKey(storageKey) {
  const normalized = storageKey.replace(/^\/+/, "")
  if (/\.(jpe?g|png|webp|gif)$/i.test(normalized)) return normalized
  if (/\.pdf$/i.test(normalized)) return normalized.replace(/\.pdf$/i, ".preview.jpg")
  return `${normalized}.preview.jpg`
}

export async function renderPdfPreviewJpeg(pdfBuffer, maxWidth = PREVIEW_MAX_WIDTH) {
  const { createCanvas } = await import("@napi-rs/canvas")
  const pdfjs = await getPdfJs()

  const pdf = await pdfjs.getDocument({
    data: new Uint8Array(pdfBuffer),
    disableAutoFetch: true,
    disableStream: true
  }).promise

  const page = await pdf.getPage(1)
  const baseViewport = page.getViewport({ scale: 1 })
  const scale = Math.min(Math.max(maxWidth / baseViewport.width, 0.25), 1.25)
  const viewport = page.getViewport({ scale })

  const canvas = createCanvas(Math.ceil(viewport.width), Math.ceil(viewport.height))
  const context = canvas.getContext("2d")

  await page.render({
    canvasContext: context,
    viewport,
    canvas
  }).promise

  return canvas.toBuffer("image/jpeg", 85)
}
