"""Place product mockups on a standard 2:3 portrait white canvas."""

from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image, ImageFilter

# 2:3 portrait — matches common e-commerce / Figma product frames
CANVAS_W = 1200
CANVAS_H = 1800
BG = (255, 255, 255)
MAX_HEIGHT_RATIO = 0.82  # product height vs canvas (padding like pill-bottle mockup)


def trim_near_white(im: Image.Image, threshold: int = 248) -> Image.Image:
    """Crop excess white margins while keeping soft shadows."""
    rgb = im.convert("RGB")
    w, h = rgb.size
    pixels = rgb.load()

    def row_has_content(y: int) -> bool:
        for x in range(w):
            r, g, b = pixels[x, y]
            if r < threshold or g < threshold or b < threshold:
                return True
        return False

    def col_has_content(x: int, top: int, bottom: int) -> bool:
        for y in range(top, bottom + 1):
            r, g, b = pixels[x, y]
            if r < threshold or g < threshold or b < threshold:
                return True
        return False

    top = next((y for y in range(h) if row_has_content(y)), 0)
    bottom = next((y for y in range(h - 1, -1, -1) if row_has_content(y)), h - 1)
    left = next((x for x in range(w) if col_has_content(x, top, bottom)), 0)
    right = next((x for x in range(w - 1, -1, -1) if col_has_content(x, top, bottom)), w - 1)

    pad = max(8, int(min(w, h) * 0.02))
    left = max(0, left - pad)
    top = max(0, top - pad)
    right = min(w - 1, right + pad)
    bottom = min(h - 1, bottom + pad)
    return rgb.crop((left, top, right + 1, bottom + 1))


def add_soft_shadow(im: Image.Image) -> Image.Image:
    """Light floor shadow under product."""
    w, h = im.size
    shadow = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    from PIL import ImageDraw

    draw = ImageDraw.Draw(shadow)
    sw, sh = int(w * 0.55), max(12, int(h * 0.025))
    sx = (w - sw) // 2
    sy = h - max(8, int(h * 0.04))
    draw.ellipse((sx, sy, sx + sw, sy + sh), fill=(0, 0, 0, 38))
    shadow = shadow.filter(ImageFilter.GaussianBlur(radius=max(6, sw // 18)))
    out = Image.new("RGBA", (w, h), (255, 255, 255, 255))
    out.alpha_composite(shadow)
    out.alpha_composite(im.convert("RGBA"))
    return out.convert("RGB")


def place_on_portrait(
    source: Path,
    dest: Path,
    *,
    canvas_w: int = CANVAS_W,
    canvas_h: int = CANVAS_H,
    shadow: bool = True,
) -> None:
    im = Image.open(source).convert("RGB")
    im = trim_near_white(im)

    max_h = int(canvas_h * MAX_HEIGHT_RATIO)
    scale = min(max_h / im.height, canvas_w * 0.88 / im.width)
    new_w = max(1, int(im.width * scale))
    new_h = max(1, int(im.height * scale))
    im = im.resize((new_w, new_h), Image.Resampling.LANCZOS)

    if shadow:
        im = add_soft_shadow(im)

    canvas = Image.new("RGB", (canvas_w, canvas_h), BG)
    x = (canvas_w - im.width) // 2
    # Slightly lower than dead-center (matches pill-bottle hero framing)
    y = int((canvas_h - im.height) * 0.52)
    canvas.paste(im, (x, y))
    dest.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(dest, format="PNG", optimize=True)
    print(f"Wrote {dest} ({canvas_w}x{canvas_h}) from {source.name}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Place mockup on 2:3 portrait canvas")
    parser.add_argument("source", type=Path, help="Input product image")
    parser.add_argument(
        "-o",
        "--output",
        type=Path,
        help="Output PNG path (default: same folder, -2x3-portrait suffix)",
    )
    parser.add_argument("--width", type=int, default=CANVAS_W, help="Canvas width (2:3 portrait)")
    parser.add_argument("--height", type=int, default=CANVAS_H, help="Canvas height")
    args = parser.parse_args()

    out = args.output or args.source.with_name(
        args.source.stem + "-2x3-portrait.png"
    )
    place_on_portrait(args.source, out, canvas_w=args.width, canvas_h=args.height)


if __name__ == "__main__":
    main()
