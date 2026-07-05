# Label pipeline (Figma → Blender → product shots)

## Quick start

```powershell
cd tools\label-pipeline
# Drop Figma label JPGs into figma_labels\
powershell -File scripts\run-blender-batch.ps1
```

## Label placement (do this first)

Auto-detection is unreliable. **Mark the label area manually:**

1. Open `scripts/mark-label-area.html` in your browser
2. Load `Product Mockups/seashell-nice.png` (or the cropped plate)
3. Drag a rectangle over the **blank white label** (inside the embossed lines)
4. Optionally load a test label JPG to preview placement live
5. Click **Download placement-config.json** → save to `assets/placement-config.json`
6. Preview:

```powershell
python tools/label-pipeline/scripts/preview_placement.py --label output/retatrutide-20mg.jpg
```

7. When placement looks right, run the Blender batch.

Outputs: `final_product_shots_blender\`

## Layout

| Path | Purpose |
|------|---------|
| `scripts/mark-label-area.html` | **Manual label box tool** (browser) |
| `assets/placement-config.json` | Saved coordinates — pipeline reads this |
| `scripts/preview_placement.py` | Flat placement preview before Blender batch |
| `figma-plugin/` | Figma template generator + CSV batch import |
| `blender/` | Curved label render + plate composite |
| `scripts/` | Helper scripts and `run-blender-batch.ps1` |
| `data/labels-batch.csv` | Google Sheet export for Figma |

Mockup sources: `Product Mockups/seashell-nice.png`, `Product Mockups/pill_bottle_clear.jpg`

## Flat labels (no 3D)

```powershell
python scripts/generate-pharma-labels.py --csv scripts/labels.csv --logo apps/storefront/public/brand/logo.png
```
