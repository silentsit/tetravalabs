# Label pipeline (Figma → Blender → product shots)

## Quick start

```powershell
cd tools\label-pipeline
# Drop Figma label JPGs into figma_labels\
powershell -File scripts\run-blender-batch.ps1
```

Outputs: `final_product_shots_blender\` (1000×1500 PNG)

## Layout

| Path | Purpose |
|------|---------|
| `figma-plugin/` | Figma template generator + CSV batch import |
| `blender/` | Curved label render + seashell plate composite |
| `scripts/` | Helper scripts and `run-blender-batch.ps1` |
| `assets/seashell-vial-1000x1500.png` | 2:3 vial background plate |
| `data/labels-batch.csv` | Google Sheet export for Figma |

Mockup sources (repo root): `Product Mockups/seashell.jpeg`, `Product Mockups/pill_bottle_clear.jpg`

## Flat labels (no 3D)

```powershell
python scripts/generate-pharma-labels.py --csv scripts/labels.csv --logo apps/storefront/public/brand/logo.png
```
