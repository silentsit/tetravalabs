import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export const COA_REPLICATE_ROOT = path.resolve(__dirname, "..")
export const WORKSPACE_ROOT = path.resolve(COA_REPLICATE_ROOT, "..", "..")
export const DATASETS_DIR = path.join(COA_REPLICATE_ROOT, "datasets")
export const TEMPLATE_HTML = path.join(COA_REPLICATE_ROOT, "coa-template.html")
export const MANIFEST_PATH = path.join(WORKSPACE_ROOT, "coas", "manifest.json")
export const COA_FILES_DIR = path.join(WORKSPACE_ROOT, "coas", "files")
export const ENRICHMENT_PATH = path.join(
  WORKSPACE_ROOT,
  "packages",
  "catalog",
  "data",
  "product-enrichment.json"
)
export const SHEET_PRODUCTS_PATH = path.join(COA_REPLICATE_ROOT, "_sheet-products.json")
export const GAP_REPORT_PATH = path.join(COA_REPLICATE_ROOT, "_gap-report.json")
export const CHEMICAL_NAMES_PATH = path.join(COA_REPLICATE_ROOT, "chemical-names.json")
