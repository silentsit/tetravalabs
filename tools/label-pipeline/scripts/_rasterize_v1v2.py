"""Rasterize Product Mockups/v1.svg and v2.svg to hi-res PNGs for wrap previews."""

from __future__ import annotations

import io
from pathlib import Path

import cairosvg
from PIL import Image

REPO = Path(__file__).resolve().parents[3]
MOCK = REPO / "Product Mockups"
PREVIEW = REPO / "tools" / "label-pipeline" / "_preview_input"
WIDTH = 3000


def main() -> None:
    PREVIEW.mkdir(parents=True, exist_ok=True)
    jobs = [
        ("v1.svg", "v1-template.png", "v1@2x.png"),
        ("v2.svg", "v2-template.png", "v2@2x.png"),
    ]
    for svg_name, preview_name, mock_name in jobs:
        svg = MOCK / svg_name
        png_bytes = cairosvg.svg2png(url=str(svg), output_width=WIDTH)
        im = Image.open(io.BytesIO(png_bytes)).convert("RGBA")
        im.save(MOCK / mock_name, "PNG")
        im.save(PREVIEW / preview_name, "PNG")
        print(f"{svg_name} -> {preview_name} / {mock_name}  {im.size}")


if __name__ == "__main__":
    main()
