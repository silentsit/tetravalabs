# Blender vial label pipeline

True-cylinder wrap with front + side views, composited onto photographic plates.

## Files

| File | Purpose |
|------|---------|
| `assets/placement-config.json` | Vial + capsule label boxes and Blender settings |
| `assets/vial_template.blend` | Cylinder label scene (auto-built) |
| `figma_labels/` | Flat label PNGs from Figma |
| `curved_labels_rgba/` | Intermediate bent labels (temp) |
| `final_product_shots_blender/` | Final product PNGs (`__front` / `__side`) |

## One-command batch

```powershell
tools/label-pipeline/scripts/run-blender-batch.ps1
```

Test one SKU:

```powershell
tools/label-pipeline/scripts/run-blender-batch.ps1 -Only "BPC-157 10mg"
```

## Routing (compositing)

| Manifest `mockup` / filename | Plate |
|------------------------------|-------|
| `capsule` or `*capsules*` | `Product Mockups/chatgpt-capsule-bottle.png` |
| `vial` (default) | `Product Mockups/Untitled Project.png` |

Compositing: `scripts/composite_product_shots.py`
