# COAs (canonical)

**This is the only folder for Certificate of Analysis PDFs.**

| Path | Purpose |
|---|---|
| `coas/files/` | Active lot PDFs wired in the manifest (synced to R2) |
| `coas/files/_unwired/` | PDFs on hand but not in the live catalog yet |
| `coas/manifest.json` | Index used by `coa:sync-r2` / Medusa |

Generation tooling lives in `tools/coa-replicate/` (datasets + templates only — it writes PDFs here).

Supplier drop folder (outside repo): `Downloads/COA for Morgan/` — ingest with `node packages/catalog/scripts/ingest-morgan-coas.mjs`.
