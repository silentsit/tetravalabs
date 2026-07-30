# COA Mass-Generation Pipeline

Hybrid Novagen-style COA generation for Tetrava Labs research products.

## Canonical storage

All COA PDFs and the sync manifest live in **`coas/`** at the repo root:

- `coas/files/` — active PDFs
- `coas/files/_unwired/` — not yet catalog-wired
- `coas/manifest.json` — Medusa / R2 sync index

Do not keep a second copy under `packages/catalog` or elsewhere in the repo.

## Rules

- **Forms:** Everything is an **Injectable Research Vial**, except:
  - Selank Nasal Spray
  - Semax Nasal Spray
  - BPC-157 500 mcg (capsules)
  - Pinealon (Capsules)
- **CAS:** Always take from `Peptide Sequence Sheet NEW.xlsx` (exported to `tools/coa-replicate/_sheet-products.json`).
- **Chemical name:** Use `tools/coa-replicate/chemical-names.json` (researched names). Update that file when adding compounds.
- **Source tag:**
  - `foxit` — transcribed from a Foxit Excel/HTML export of a real Morgan PDF
  - `generated` — synthetic but realistic; never claim it is lab-exported
  - `morgan` — original supplier PDF; never overwrite via batch-render
- **Signature / logo:** use `tools/coa-replicate/assets/signature.jpg` and `novagen-logo.jpg` (not SVG fakes)
- Do **not** use LlamaParse for this workflow.

## Dataset schema

Canonical record: [`tools/coa-replicate/datasets/schema.json`](../tools/coa-replicate/datasets/schema.json)

Required analytical rows (peptides):

1. Identification (LC-MS) — Conforms  
2. Purity (HPLC) — ≥98.0%, result 98.5–99.7%  
3. Peptide Content — 95.0–105.0%  
4. Appearance — matches form  
5. Water Content — ≤3.0% (Karl Fischer)  
6. Heavy Metals — ≤10 ppm  
7. Endotoxin — &lt;10 EU/mg (LAL)

HPLC: one dominant peak; `purity_area_percent` matches purity result; retention time unique per SKU.

Batch pattern: `{CODE}{STRENGTH}{YYMMDD}` (e.g. `SEMA5MG260601`).  
PDF name: `COA_{Compound}_{Strength}.pdf` (Morgan style).

## Agent workflow

```bash
# 1) Refresh gap list vs peptide sheet
python tools/coa-replicate/_gap-check.py
node tools/coa-replicate/list-coa-gaps.mjs

# 2) Real Morgan PDFs → Foxit Excel → dataset
#    Export in Foxit: Convert → To MS Office → Excel
#    Save under tools/coa-replicate/reference/foxit/
node tools/coa-replicate/import-foxit-excel.mjs path/to/export.xlsx --variant bpc-157-10mg

# 3) Fill missing SKUs with tagged synthetics
node tools/coa-replicate/synthesize-coa.mjs --all-missing

# 4) Render PDFs into coas/files/
node tools/coa-replicate/batch-render.mjs --only missing

# 5) Wire manifest local_file + metadata.source
node tools/coa-replicate/wire-generated-coas.mjs

# 6) When ready to publish
node packages/catalog/scripts/sync-coa-r2.mjs
```

## Preview

Open `tools/coa-replicate/coa-generator.html` (dev UI) or  
`tools/coa-replicate/coa-template.html?dataset=semaglutide-5mg` via a local static server.
