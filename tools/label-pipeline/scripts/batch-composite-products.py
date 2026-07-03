"""
Batch-wrap 2D label JPGs onto vial or pill-bottle mockups.

Capsule SKUs (filename contains "capsules") -> pill_bottle_clear.jpg
All other SKUs -> seashell.jpeg

Usage:
    python scripts/batch-composite-products.py
    python scripts/batch-composite-products.py --input figma_labels --output final_product_shots
"""

from __future__ import annotations

import argparse
import gc
import re
import sys
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
REPO_ROOT = ROOT.parents[1]
DEFAULT_VIAL = REPO_ROOT / "Product Mockups" / "seashell.jpeg"
DEFAULT_PILL = REPO_ROOT / "Product Mockups" / "pill_bottle_clear.jpg"
DEFAULT_INPUT = ROOT / "figma_labels"
DEFAULT_OUTPUT = ROOT / "final_product_shots"

# Fallback regions (x, y, w, h) if auto-detect fails — tuned for default base files
VIAL_BOX = (222, 548, 366, 380)   # seashell.jpeg 810×1440
PILL_BOX = (236, 449, 392, 356)   # pill_bottle_clear.jpg 864×1184

WARP_STRENGTH = 0.16
PILL_ROUTE_PATTERN = re.compile(r"capsules", re.IGNORECASE)


def detect_label_box(img: Image.Image) -> tuple[int, int, int, int]:
    """Find blank label patch on mockup (adapted from amend-vial-labels)."""
    w, h = img.size
    px = img.load()
    cx = w // 2
    y_min = int(h * 0.38)
    y_max = int(h * 0.72)

    gray_rows: list[int] = []
    for y in range(y_min, y_max):
        avg = sum(px[cx, y]) / 3
        if 220 <= avg <= 248:
            gray_rows.append(y)

    if not gray_rows:
        return 0, 0, 0, 0

    blocks: list[list[int]] = []
    current = [gray_rows[0]]
    for y in gray_rows[1:]:
        if y - current[-1] <= 12:
            current.append(y)
        else:
            blocks.append(current)
            current = [y]
    blocks.append(current)

    merged = [blocks[0]]
    for block in blocks[1:]:
        if block[0] - merged[-1][-1] <= 20:
            merged[-1].extend(block)
        else:
            merged.append(block)

    body_blocks = [b for b in merged if b[0] >= y_min and len(b) >= 20]
    label_rows = max(body_blocks or merged, key=len)
    y0, y1 = label_rows[0], label_rows[-1]

    max_height = int(h * 0.28)
    if y1 - y0 + 1 > max_height:
        y1 = y0 + max_height - 1

    for extra in range(1, int(h * 0.06)):
        y = y1 + extra
        if y >= y_max:
            break
        avg = sum(px[cx, y]) / 3
        if 200 <= avg <= 250:
            y1 = y
        elif avg < 200:
            y1 = y

    cols: list[int] = []
    for x in range(int(w * 0.15), int(w * 0.85)):
        hits = sum(1 for y in range(y0, y1 + 1) if 200 <= sum(px[x, y]) / 3 <= 250)
        if hits / (y1 - y0 + 1) > 0.55:
            cols.append(x)

    if not cols:
        return 0, 0, 0, 0

    x0, x1 = cols[0], cols[-1]
    x0 = max(0, x0 - 4)
    x1 = min(w - 1, x1 + 4)
    return x0, y0, x1 - x0 + 1, y1 - y0 + 1


def resolve_box(base: Image.Image, fallback: tuple[int, int, int, int]) -> tuple[int, int, int, int]:
    x, y, w, h = detect_label_box(base)
    if w <= 0 or h <= 0:
        return fallback
    # Reject detections that cover most of the canvas (2:3 white exports)
    if w > base.width * 0.62:
        return fallback
    return x, y, w, h


def cylindrical_warp(label: Image.Image, strength: float = WARP_STRENGTH) -> Image.Image:
    """Compress label edges inward to mimic a cylindrical wrap."""
    src = np.array(label.convert("RGB"), dtype=np.float32)
    h, w = src.shape[:2]
    out = np.zeros_like(src)
    xs = np.arange(w, dtype=np.float32)
    t = (xs / max(w - 1, 1)) * 2.0 - 1.0
    src_x = (w - 1) * 0.5 + (xs - (w - 1) * 0.5) * (1.0 - strength * (t * t))

    for y in range(h):
        row = src[y]
        for x in range(w):
            sx = float(src_x[x])
            x0 = int(sx)
            x1 = min(x0 + 1, w - 1)
            f = sx - x0
            out[y, x] = row[x0] * (1.0 - f) + row[x1] * f

    return Image.fromarray(np.clip(out, 0, 255).astype(np.uint8))


def apply_shading(
    label: Image.Image,
    base: Image.Image,
    box: tuple[int, int, int, int],
) -> Image.Image:
    """Multiply label by luminosity of the base label area."""
    x, y, w, h = box
    patch = base.crop((x, y, x + w, y + h)).convert("L")
    patch = patch.resize(label.size, Image.Resampling.LANCZOS)
    shade = np.array(patch, dtype=np.float32)
    shade = shade / (shade.mean() + 1e-6)
    shade = np.clip(shade, 0.72, 1.12)

    lab = np.array(label.convert("RGB"), dtype=np.float32) / 255.0
    shaded = np.clip(lab * shade[:, :, None], 0.0, 1.0)
    return Image.fromarray((shaded * 255).astype(np.uint8))


def composite_label(
    base_path: Path,
    label_path: Path,
    out_path: Path,
    box: tuple[int, int, int, int] | None,
    *,
    warp: float = WARP_STRENGTH,
) -> None:
    base = Image.open(base_path).convert("RGB")
    label = Image.open(label_path).convert("RGB")

    fallback = VIAL_BOX if "seashell" in base_path.name.lower() or "vial" in base_path.name.lower() else PILL_BOX
    x, y, w, h = box if box else resolve_box(base, fallback)

    label = label.resize((w, h), Image.Resampling.LANCZOS)
    label = cylindrical_warp(label, strength=warp)
    label = apply_shading(label, base, (x, y, w, h))

    canvas = base.copy()
    canvas.paste(label, (x, y))

    out_path.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(out_path, format="PNG", optimize=True)

    base.close()
    label.close()
    canvas.close()
    gc.collect()


def route_base(name: str, vial_path: Path, pill_path: Path) -> tuple[Path, str]:
    if PILL_ROUTE_PATTERN.search(name):
        return pill_path, "Pill Bottle"
    return vial_path, "Vial"


def main() -> int:
    parser = argparse.ArgumentParser(description="Batch composite labels onto vial or pill mockups")
    parser.add_argument("--input", type=Path, default=DEFAULT_INPUT, help="Folder of label JPGs")
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT, help="Output PNG folder")
    parser.add_argument("--vial", type=Path, default=DEFAULT_VIAL, help="Vial base image")
    parser.add_argument("--pill", type=Path, default=DEFAULT_PILL, help="Pill bottle base image")
    parser.add_argument("--warp", type=float, default=WARP_STRENGTH, help="Cylindrical warp strength")
    args = parser.parse_args()

    if not args.vial.is_file():
        print(f"Missing vial base: {args.vial}", file=sys.stderr)
        return 1
    if not args.pill.is_file():
        print(f"Missing pill base: {args.pill}", file=sys.stderr)
        return 1
    if not args.input.is_dir():
        args.input.mkdir(parents=True, exist_ok=True)
        print(f"Created empty input folder: {args.input}")
        print("Drop Figma label JPG exports here, then re-run.")
        return 0

    labels = sorted(args.input.glob("*.jpg")) + sorted(args.input.glob("*.jpeg"))
    if not labels:
        print(f"No JPG files in {args.input}")
        return 0

    args.output.mkdir(parents=True, exist_ok=True)

    vial_box = resolve_box(Image.open(args.vial), VIAL_BOX)
    pill_box = resolve_box(Image.open(args.pill), PILL_BOX)
    print(f"Vial label region:  X={vial_box[0]} Y={vial_box[1]} W={vial_box[2]} H={vial_box[3]}")
    print(f"Pill label region:  X={pill_box[0]} Y={pill_box[1]} W={pill_box[2]} H={pill_box[3]}")
    print(f"Processing {len(labels)} label(s)...\n")

    pill_count = vial_count = 0
    for label_path in labels:
        base_path, kind = route_base(label_path.stem, args.vial, args.pill)
        box = pill_box if kind == "Pill Bottle" else vial_box
        out_path = args.output / f"{label_path.stem}.png"

        composite_label(base_path, label_path, out_path, box, warp=args.warp)
        if kind == "Pill Bottle":
            pill_count += 1
        else:
            vial_count += 1
        print(f"Routed {label_path.name} -> {kind} -> {out_path.name}")

    print(f"\nDone: {vial_count} vial, {pill_count} pill bottle -> {args.output}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
