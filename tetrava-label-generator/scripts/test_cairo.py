"""Quick CairoSVG availability check."""

from pathlib import Path

import cairosvg

svg = b'<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"><rect width="10" height="10" fill="red"/></svg>'
out = Path("output/_cairo_test.png")
out.parent.mkdir(exist_ok=True)
cairosvg.svg2png(bytestring=svg, write_to=str(out))
print(f"OK: {out}")
