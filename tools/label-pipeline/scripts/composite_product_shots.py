"""Composite curved Blender passes onto vial or capsule plates (batch entry point)."""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SCRIPT_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(SCRIPT_DIR))

from composite_vial_shots import (  # noqa: E402
    apply_shading,
    composite as composite_vial,
    crop_to_alpha_bounds,
    harden_edges,
    make_drop_shadow,
)
from labels_catalog import export_filename_set  # noqa: E402
from load_placement import get_capsule, get_nasal_spray, get_vial, scale_box  # noqa: E402
from routing import is_capsule, is_nasal_spray, load_manifest  # noqa: E402

DEFAULT_TMP = ROOT / "curved_labels_rgba"
DEFAULT_OUTPUT = ROOT / "final_product_shots_blender"


def cover_resize(img: Image.Image, w: int, h: int) -> Image.Image:
    """Fill (w, h) without distortion — center-crop overflow."""
    src_ar = img.width / img.height
    dst_ar = w / h
    if src_ar > dst_ar:
        new_h = h
        new_w = int(round(h * src_ar))
    else:
        new_w = w
        new_h = int(round(w / src_ar))
    img = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
    left = (new_w - w) // 2
    top = (new_h - h) // 2
    return img.crop((left, top, left + w, top + h))


def composite_capsule(
    label_rgba: Image.Image,
    plate: Image.Image,
    box: tuple[int, int, int, int],
    feather: int,
) -> Image.Image:
    x, y, w, h = box
    label = cover_resize(crop_to_alpha_bounds(label_rgba), w, h)
    label = harden_edges(label)
    label = apply_shading(label, plate, box)
    out = plate.copy()
    shadow = make_drop_shadow(label, blur=6, opacity=30)
    out.paste(shadow, (x + 2, y + 5), shadow)
    out.paste(label, (x, y), label)
    _ = feather
    return out


def stem_from_pass(path: Path) -> str:
    name = path.stem
    if "__" in name:
        return name.rsplit("__", 1)[0]
    return name


def main() -> int:
    parser = argparse.ArgumentParser(description="Composite Blender label passes onto product mockups")
    parser.add_argument("--tmp", type=Path, default=DEFAULT_TMP)
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    args = parser.parse_args()

    passes = sorted(p for p in args.tmp.glob("*.png") if stem_from_pass(p).lower() in export_filename_set())
    if not passes:
        print(f"No RGBA passes in {args.tmp} — export labels to figma_labels/ and re-run.")
        return 0

    manifest = load_manifest()
    vial_cfg = get_vial()
    capsule_cfg = get_capsule()
    nasal_cfg = get_nasal_spray()

    vial_plate = Image.open(vial_cfg["plate"]).convert("RGB")
    capsule_plate = Image.open(capsule_cfg["plate"]).convert("RGB")
    nasal_plate = Image.open(nasal_cfg["plate"]).convert("RGB")
    vial_native = vial_cfg["native_size"] if vial_cfg["native_size"][0] else vial_plate.size
    capsule_native = (
        capsule_cfg["native_size"] if capsule_cfg["native_size"][0] else capsule_plate.size
    )
    nasal_native = nasal_cfg["native_size"] if nasal_cfg["native_size"][0] else nasal_plate.size
    vial_box = scale_box(vial_cfg["label_box"], vial_native, vial_plate.size)
    capsule_box = scale_box(capsule_cfg["label_box"], capsule_native, capsule_plate.size)
    nasal_box = scale_box(nasal_cfg["label_box"], nasal_native, nasal_plate.size)

    print(f"Vial plate:        {vial_cfg['plate'].name}  box={vial_box}")
    print(f"Capsule plate:     {capsule_cfg['plate'].name}  box={capsule_box}")
    print(f"Nasal spray plate: {nasal_cfg['plate'].name}  box={nasal_box}")

    args.output.mkdir(parents=True, exist_ok=True)
    vial_count = capsule_count = nasal_count = 0

    for i, path in enumerate(passes, 1):
        stem = stem_from_pass(path)
        curved = Image.open(path).convert("RGBA")
        out = args.output / path.name

        if is_capsule(stem, manifest):
            composite_capsule(curved, capsule_plate, capsule_box, capsule_cfg["feather_radius"]).save(
                out, format="PNG", optimize=True
            )
            capsule_count += 1
            kind = "capsule"
        elif is_nasal_spray(stem, manifest):
            composite_capsule(curved, nasal_plate, nasal_box, nasal_cfg["feather_radius"]).save(
                out, format="PNG", optimize=True
            )
            nasal_count += 1
            kind = "nasal_spray"
        else:
            composite_vial(curved, vial_plate, vial_box, vial_cfg["feather_radius"]).save(
                out, format="PNG", optimize=True
            )
            vial_count += 1
            kind = "vial"

        print(f"[{i}/{len(passes)}] {path.name} ({kind}) -> {out.name}")

    print(
        f"Done: {vial_count} vial, {capsule_count} capsule, {nasal_count} nasal_spray -> {args.output}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
