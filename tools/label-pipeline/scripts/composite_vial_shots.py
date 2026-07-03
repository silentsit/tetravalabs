"""Composite curved label RGBA passes onto seashell 1000×1500 plate."""

from __future__ import annotations

import argparse
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_TMP = ROOT / "curved_labels_rgba"
DEFAULT_OUTPUT = ROOT / "final_product_shots_blender"
DEFAULT_PLATE = ROOT / "assets" / "seashell-vial-1000x1500.png"
LABEL_BOX = (292, 572, 416, 392)


def apply_shading(label_rgba: Image.Image, plate: Image.Image, box: tuple[int, int, int, int]) -> Image.Image:
    x, y, w, h = box
    patch = plate.crop((x, y, x + w, y + h)).convert("L")
    patch = patch.resize(label_rgba.size, Image.Resampling.LANCZOS)
    shade = np.array(patch, dtype=np.float32)
    shade = shade / (shade.mean() + 1e-6)
    shade = np.clip(shade, 0.75, 1.12)

    lab = np.array(label_rgba.convert("RGBA"), dtype=np.float32)
    rgb = lab[:, :, :3] / 255.0
    alpha = lab[:, :, 3:4] / 255.0
    rgb = np.clip(rgb * shade[:, :, None], 0, 1)
    merged = np.concatenate([rgb * 255, alpha * 255], axis=2)
    return Image.fromarray(merged.astype(np.uint8), "RGBA")


def composite(label_rgba: Image.Image, plate: Image.Image, box: tuple[int, int, int, int]) -> Image.Image:
    x, y, w, h = box
    label = label_rgba.resize((w, h), Image.Resampling.LANCZOS)
    label = apply_shading(label, plate, box)
    out = plate.copy()
    out.paste(label, (x, y), label)
    return out


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--tmp", type=Path, default=DEFAULT_TMP)
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    parser.add_argument("--plate", type=Path, default=DEFAULT_PLATE)
    args = parser.parse_args()

    if not args.plate.is_file():
        raise FileNotFoundError(args.plate)
    passes = sorted(args.tmp.glob("*.png"))
    if not passes:
        raise FileNotFoundError(f"No RGBA passes in {args.tmp}")

    plate = Image.open(args.plate).convert("RGB")
    box = LABEL_BOX
    if plate.size != (1000, 1500):
        sx, sy = plate.size[0] / 1000, plate.size[1] / 1500
        box = (int(box[0] * sx), int(box[1] * sy), int(box[2] * sx), int(box[3] * sy))

    args.output.mkdir(parents=True, exist_ok=True)
    for i, path in enumerate(passes, 1):
        curved = Image.open(path).convert("RGBA")
        out = args.output / path.name
        composite(curved, plate, box).save(out, format="PNG", optimize=True)
        print(f"[{i}/{len(passes)}] {path.name} -> {out}")

    print(f"Done -> {args.output}")


if __name__ == "__main__":
    main()
