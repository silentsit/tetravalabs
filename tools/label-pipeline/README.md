# Label pipeline (Figma → product shots)

## Quick start

```powershell
# 1) Export product list from Excel
python tools/label-pipeline/scripts/export-figma-labels-csv.py

# 2) In Figma: Plugins → Development → TetravaLabs Label Template Generator
#    Choose data/labels-batch.csv → Batch Import CSV

# 3) Export each label instance as PNG into figma_labels/ (use export_filename)

# 4) Blender batch — cylindrical wrap + vial/capsule composite (front + side)
tools/label-pipeline/scripts/run-blender-batch.ps1
```

Outputs: `final_product_shots_blender/` as `{export_filename}__front.png` and `{export_filename}__side.png`.

## Templates

| Component | When used | Swappable fields |
|-----------|-----------|------------------|
| **LABEL-MAIN** | All products without a sub-name | `#product_name`, `#cas_number`, `#formula`, `#concentration` |
| **LABEL-FLOWER** | Products with `#sub_name` (e.g. Glow Blend) | `#product_name`, `#sub_name`, `#concentration` |

Formula digits are coloured **red** automatically on LABEL-MAIN imports.

## Mockup routing

| Product type | Base image |
|--------------|------------|
| Vials (default) | `Product Mockups/Untitled Project.png` |
| Capsules | `Product Mockups/chatgpt-capsule-bottle.png` |
| Nasal sprays | `Product Mockups/nasal-spray-chatgpt.png` |

Routing is driven by `data/labels-manifest.csv` (export_filename → `mockup` column).

## Layout

| Path | Purpose |
|------|---------|
| `figma-plugin/` | Batch import plugin (LABEL-MAIN + LABEL-FLOWER) |
| `data/labels-batch.csv` | Figma import file |
| `data/labels-manifest.csv` | Mockup routing for compositor |
| `assets/placement-config.json` | Label box + Blender settings (vial + capsule) |
| `figma_labels/` | Flat label PNG exports from Figma |
| `scripts/run-blender-batch.ps1` | Full batch: Blender wrap → composite |
| `scripts/composite_product_shots.py` | Route vial vs capsule compositing |
| `final_product_shots_blender/` | Output PNGs |

## Figma component setup

Before batch import, ensure text layers are bound as component properties:

- LABEL-MAIN: `#product_name`, `#cas_number`, `#formula`, `#concentration`
- LABEL-FLOWER: `#product_name`, `#sub_name`, `#concentration`

Rebuild plugin after code changes:

```powershell
python tools/label-pipeline/figma-plugin/build-plugin.py
```
