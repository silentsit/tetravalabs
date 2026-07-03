# Blender vial label pipeline

The old Pillow 2D paste looked flat. This pipeline:
1. **Blender** — bends the label in 3D (cylindrical curve)
2. **Python** — composites it onto your **seashell photo plate** (1000×1500)

## Files

| File | Purpose |
|------|---------|
| `assets/seashell-vial-1000x1500.png` | Blank vial on 2:3 white canvas |
| `assets/vial_template.blend` | Curved label scene (auto-built) |
| `figma_labels/` | Flat label JPGs from Figma |
| `curved_labels_rgba/` | Intermediate bent labels (temp) |
| `final_product_shots_blender/` | Final 1000×1500 PNGs |

## One-command batch (vials)

```powershell
cd c:\Users\user\Downloads\Kimi_Figma
powershell -File scripts\run-blender-batch.ps1
```

## Test one label first

```powershell
powershell -File scripts\run-blender-batch.ps1 -Only IPAMORELIN -Limit 1
```

Output: `final_product_shots_blender\IPAMORELIN-1.png`

## Manual steps

```powershell
# 1. Build scene (once)
& "C:\Program Files\Blender Foundation\Blender 5.1\blender.exe" --background --python blender\setup_vial_scene.py

# 2. Render curved labels
& "C:\Program Files\Blender Foundation\Blender 5.1\blender.exe" --background assets\vial_template.blend --python blender\render_vial_labels.py -- --input figma_labels

# 3. Composite onto seashell plate
python scripts\composite_vial_shots.py
```

## Routing

| Filename contains | Base |
|-------------------|------|
| `capsules` | Pill bottle (not built yet) |
| Everything else | Seashell vial plate |

Capsule SKUs: `BPC-157 (CAPSULES)`, `Pinealon (Capsules)` — pill Blender scene TBD.

## Deprecated

`scripts/batch-composite-products.py` — flat Pillow overlay; do not use for vials.
