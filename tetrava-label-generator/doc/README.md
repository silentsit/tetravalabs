# Tetrava Label Generator

Production-focused pharmaceutical label generator.

The SVG document is the master source. PNG files are generated exports only.

## Scope

- Generate square 1024 x 1024 pharmaceutical labels.
- Keep text editable as live SVG `<text>` elements.
- Support only these editable fields:
  - `product_name`
  - `cas_number`
  - `concentration`
- Draw all visual elements as vectors:
  - background
  - border
  - logo
  - badge
  - purity block
  - footer
  - molecule

## Non-Goals

- No AI image generation.
- No bitmap embedding.
- No text rasterization.
- No text-to-path conversion.
- No tracing of the reference image.

## Project Layout

```text
tetrava-label-generator/
  assets/
    fonts/
  doc/
    README.md
  generator/
    __init__.py
    effects.py
    label.py
    render.py
    molecule.py          # parametric Molecule(nodes, branches, radius, seed)
  output/
  effects.py
  label.py
  reference.png
  products.csv
  render.py
  requirements.txt
  typography.py
```

## Current Status

The generator now builds editable vector SVG labels and exports PNG files from
those SVG masters.

Required editable SVG text fields are emitted as:

- `<text id="product_name">`
- `<text id="cas_number">`
- `<text id="concentration">`

## Setup

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
```

## Usage

Render every row in `products.csv`:

```powershell
python render.py --csv products.csv --output output
```

Output files are named from `product_name`:

- `output/BPC-157.svg` and `output/BPC-157.png`
- `output/TB-500.svg` and `output/TB-500.png`

On Windows, CairoSVG requires the GTK runtime. The renderer auto-configures
`C:\Program Files\Gtk-Runtime\bin` when present.

## Fonts

Montserrat (`assets/fonts/Montserrat-Variable.ttf`, OFL) drives all typography.

- **SVG master** embeds a subset woff2 as a base64 `@font-face`, so labels render
  identically in browsers, Illustrator and Inkscape with no font install. Text
  stays live and editable.
- **PNG export** uses CairoSVG, which ignores `@font-face`, so the bundled font is
  registered for the current process only (GDI on Windows, fontconfig elsewhere)
  in `generator/fonts.py`. No permanent system font install is required.

Each row must include:

- `product_name`
- `cas_number`
- `concentration`

Long values are automatically scaled as single-line SVG text. Text is never
converted to paths.
