"""Composite curved label RGBA passes onto the vial plate using placement-config.json."""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
SCRIPT_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(SCRIPT_DIR))

from load_placement import get_vial, scale_box  # noqa: E402

DEFAULT_TMP = ROOT / "curved_labels_rgba"
DEFAULT_OUTPUT = ROOT / "final_product_shots_blender"
PRINT_BRIGHTNESS = 1.18
MIN_SHADE = 0.96
MAX_SHADE = 1.05
OPAQUE_ALPHA_THRESHOLD = 180
OPAQUE_ALPHA_VALUE = 252


def feather_alpha(rgba: Image.Image, radius: int) -> Image.Image:
    r, g, b, a = rgba.split()
    a_blurred = a.filter(ImageFilter.GaussianBlur(radius=radius))
    a_arr = np.array(a, dtype=np.float32)
    a_blur = np.array(a_blurred, dtype=np.float32)
    a_final = np.where(a_arr > 200, a_arr, a_blur)
    return Image.merge("RGBA", (r, g, b, Image.fromarray(a_final.astype(np.uint8))))


def crop_to_alpha_bounds(rgba: Image.Image, padding: int = 2) -> Image.Image:
    """Remove transparent render margins around the curved Blender label pass."""

    bbox = rgba.getchannel("A").getbbox()
    if not bbox:
        return rgba
    left, top, right, bottom = bbox
    left = max(0, left - padding)
    top = max(0, top - padding)
    right = min(rgba.width, right + padding)
    bottom = min(rgba.height, bottom + padding)
    return rgba.crop((left, top, right, bottom))


def apply_shading(label_rgba: Image.Image, plate: Image.Image, box: tuple) -> Image.Image:
    x, y, w, h = box
    patch = plate.crop((x, y, x + w, y + h)).convert("L")
    patch = patch.resize(label_rgba.size, Image.Resampling.LANCZOS)
    shade = np.array(patch, dtype=np.float32)
    mean = shade.mean()
    if mean > 0:
        shade = shade / mean
    shade = np.clip(shade, MIN_SHADE, MAX_SHADE)

    lab = np.array(label_rgba.convert("RGBA"), dtype=np.float32)
    rgb = lab[:, :, :3] / 255.0
    alpha = lab[:, :, 3:4] / 255.0
    rgb = np.clip(rgb * PRINT_BRIGHTNESS * shade[:, :, None], 0, 1)
    merged = np.concatenate([rgb * 255, alpha * 255], axis=2)
    return Image.fromarray(merged.astype(np.uint8), "RGBA")


def harden_edges(label_rgba: Image.Image) -> Image.Image:
    """Make the label a crisp, opaque printed sheet with a 1px antialiased edge.

    Feathering left the label body semi-transparent, so the darker glass showed
    through around the perimeter as a grey strip. A hard body with a thin AA edge
    meets the glass cleanly, matching real wrapped labels.
    """

    alpha = np.array(label_rgba.getchannel("A"), dtype=np.float32)
    solid = np.where(alpha >= 128, 255.0, 0.0)
    solid_img = Image.fromarray(solid.astype(np.uint8)).filter(
        ImageFilter.GaussianBlur(radius=0.6)
    )
    r, g, b, _ = label_rgba.split()
    return Image.merge("RGBA", (r, g, b, solid_img))


def make_drop_shadow(label_rgba: Image.Image, blur: int, opacity: int) -> Image.Image:
    """Soft silhouette shadow, offset by the caller so it grounds the label."""

    alpha = label_rgba.getchannel("A").filter(ImageFilter.GaussianBlur(radius=blur))
    alpha_arr = np.array(alpha, dtype=np.float32) * (opacity / 255)
    shadow_alpha = Image.fromarray(np.clip(alpha_arr, 0, 255).astype(np.uint8))
    shadow = Image.new("RGBA", label_rgba.size, (0, 0, 0, 0))
    shadow.putalpha(shadow_alpha)
    return shadow


def composite(label_rgba: Image.Image, plate: Image.Image, box: tuple, feather: int) -> Image.Image:
    _ = feather
    x, y, w, h = box
    label_rgba = crop_to_alpha_bounds(label_rgba)
    label = label_rgba.resize((w, h), Image.Resampling.LANCZOS)
    label = harden_edges(label)
    label = apply_shading(label, plate, box)

    out = plate.copy()
    shadow = make_drop_shadow(label, blur=5, opacity=26)
    out.paste(shadow, (x + 2, y + 4), shadow)
    out.paste(label, (x, y), label)
    return out


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--tmp", type=Path, default=DEFAULT_TMP)
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    parser.add_argument("--plate", type=Path, default=None, help="Override plate from placement-config.json")
    args = parser.parse_args()

    vial = get_vial()
    plate_path = args.plate or vial["plate"]
    if not plate_path.is_file():
        raise FileNotFoundError(plate_path)

    passes = sorted(args.tmp.glob("*.png"))
    if not passes:
        raise FileNotFoundError(f"No RGBA passes in {args.tmp}")

    plate = Image.open(plate_path).convert("RGB")
    native_size = vial["native_size"] if vial["native_size"][0] else plate.size
    box = scale_box(vial["label_box"], native_size, plate.size)
    print(f"Plate: {plate_path.name} ({plate.size[0]}x{plate.size[1]})  Label box: {box}")

    args.output.mkdir(parents=True, exist_ok=True)
    for i, path in enumerate(passes, 1):
        curved = Image.open(path).convert("RGBA")
        out = args.output / path.name
        composite(curved, plate, box, vial["feather_radius"]).save(out, format="PNG", optimize=True)
        print(f"[{i}/{len(passes)}] {path.name} -> {out}")

    print(f"Done -> {args.output}")


if __name__ == "__main__":
    main()
