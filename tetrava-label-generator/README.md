# Tetrava Label Generator

Production pharmaceutical label generator. SVG is the master source; PNG is export only.

## Quick start

```powershell
python -m pip install -r requirements.txt
python render.py --csv products.csv --output output
```

## Outputs

```text
output/BPC-157.svg
output/BPC-157.png
output/TB-500.svg
output/TB-500.png
```

## Reference

Visual target: `reference.png` in this folder.

Full documentation: [doc/README.md](doc/README.md)

## Architecture

```text
tetrava-label-generator/
  reference.png
  products.csv
  render.py              # CLI entry point
  label.py               # public API
  typography.py          # font fitting
  effects.py             # gradients, shadows, filters
  generator/
    label.py             # orchestrator
    sections.py          # SVG section renderers
    molecule.py          # parametric Molecule component
    layout.py            # composition constants
    geometry.py          # vector math helpers
  output/
```

## Editable fields

Only these change per product:

- `product_name`
- `cas_number`
- `concentration`

All other design elements are fixed vector graphics.
