# TetravaLabs Label Template — Figma Plugin

Recreates the TetravaLabs label design as a Figma Component with 5 swappable text properties.

## What's Created

| Layer | Type | Property Name | Default Value |
|-------|------|--------------|---------------|
| Frame | Component (1062×1112) | — | — |
| Logo | Molecular hexagon group | — | TetravaLabs (vector) |
| Brand Text | Text | — | TetravaLabs |
| Product Name | Text | `#product_name` | RETATRUTIDE |
| CAS Number | Text | `#cas_number` | CAS: 2381089-83-2 |
| Concentration | Text | `#Concentration` | 20mg |
| Purity | Text | `purity` | Purity: >99.9% |
| Footer | Text | `footer` | FOR RESEARCH USE ONLY |
| Watermark | Hexagonal molecule graphic | — | (static) |
| Divider Lines | 2 lines | — | (static) |

## How to Install & Run

### Option A: Quick Run (Fastest)

1. Open **Figma Desktop** or **Figma in Browser**
2. Go to **Plugins → Development → Import plugin from manifest...**
3. Select the `manifest.json` file from this folder
4. Run the plugin: **Plugins → Development → TetravaLabs Label Template Generator**
5. Click **Generate Label Template**
6. Click **Choose CSV** → select `../labels-batch.csv` (130 SKUs)
7. Click **Batch Import CSV** — all label instances are created on canvas

**Do not** use Export/Import Variables or other token plugins for this workflow.

### Option B: Save for Reuse

1. Open **Figma Desktop** (required for saving)
2. Go to **Plugins → Development → New Plugin...**
3. Choose **"Link existing plugin"**
4. Select the `manifest.json` file
5. The plugin is now saved and can be run anytime from **Plugins → Development**

## Using the Component

Once generated, you can:

1. **Create instances**: Copy/paste the component, or drag from the Assets panel
2. **Swap text**: Select any instance and edit text properties in the right sidebar:
   - `#product_name` → e.g., "SEMGLUTIDE", "TIRZEPATIDE"
   - `#cas_number` → e.g., "CAS: 910463-68-2"
   - `#Concentration` → e.g., "5mg", "10mg"
   - `purity` → e.g., "Purity: >98%"
   - `footer` → e.g., "NOT FOR HUMAN CONSUMPTION"

3. **Swap the logo**: Replace the hexagon shape with your own logo image if needed
4. **Style overrides**: Change fonts, colors, sizes on instances without breaking the component

## File Structure

```
figma-plugin/
├── manifest.json     # Plugin configuration
├── code.js           # Main plugin code
└── README.md         # This file
```

## Requirements

- Figma Desktop or Browser
- The Inter font (auto-loaded by Figma)

## Swapping the Logo (Important)

The plugin generates a **vector approximation** of your molecular hexagon logo. To use the actual `logo.png`:

1. In Figma, drag your `logo.png` onto the canvas
2. Copy the image (`Ctrl/Cmd + C`)
3. Double-click the Component to enter edit mode
4. Delete the `logo-group` layer
5. Paste your logo image into the component
6. Position it at the top-left (around x: 72, y: 58)
7. Exit component edit mode

All instances will automatically inherit the new logo.

## Notes

- The watermark is a hexagonal molecular structure pattern — it's static but can be hidden or modified
- All text properties support empty strings if you need to hide any field
- The logo is grouped as `logo-group` so you can easily delete and replace it with an image