"""Render curved label RGBA passes (Blender only — no Pillow)."""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

import bpy

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_INPUT = ROOT / "figma_labels"
DEFAULT_TMP = ROOT / "curved_labels_rgba"
PILL_PATTERN = re.compile(r"capsules", re.IGNORECASE)


def parse_args() -> argparse.Namespace:
    raw = sys.argv
    argv = raw[raw.index("--") + 1 :] if "--" in raw else []
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", type=Path, default=DEFAULT_INPUT)
    parser.add_argument("--tmp", type=Path, default=DEFAULT_TMP)
    parser.add_argument("--limit", type=int, default=0)
    parser.add_argument("--only", type=str, default="")
    return parser.parse_args(argv)


def find_label_material() -> bpy.types.Material:
    mat = bpy.data.materials.get("LabelMaterial")
    if not mat:
        raise RuntimeError("LabelMaterial missing — run setup_vial_scene.py")
    return mat


def set_label_texture(mat: bpy.types.Material, image_path: Path) -> None:
    image_path = image_path.resolve()
    name = f"Label__{image_path.stem}"
    if name in bpy.data.images:
        bpy.data.images.remove(bpy.data.images[name])
    image = bpy.data.images.load(str(image_path))
    image.name = name
    image.colorspace_settings.name = "sRGB"
    for node in mat.node_tree.nodes:
        if node.type == "TEX_IMAGE":
            node.image = image
            return
    raise RuntimeError("No Image Texture node")


def main() -> None:
    args = parse_args()
    args.input = args.input.resolve()
    args.tmp = args.tmp.resolve()

    if not args.input.is_dir():
        raise FileNotFoundError(f"Input missing: {args.input}")

    mat = find_label_material()
    labels = (
        sorted(args.input.glob("*.jpg"))
        + sorted(args.input.glob("*.jpeg"))
        + sorted(args.input.glob("*.png"))
    )
    labels = [p for p in labels if not PILL_PATTERN.search(p.stem)]

    if args.only:
        key = args.only.lower()
        labels = [p for p in labels if p.stem.lower() == key or key in p.stem.lower()]
    if args.limit > 0:
        labels = labels[: args.limit]

    if not labels:
        print(f"No vial labels in {args.input}")
        return

    args.tmp.mkdir(parents=True, exist_ok=True)
    scene = bpy.context.scene
    print(f"Rendering {len(labels)} curved label(s) -> {args.tmp}")

    for i, label_path in enumerate(labels, 1):
        set_label_texture(mat, label_path)
        out = args.tmp / f"{label_path.stem}.png"
        scene.render.filepath = str(out)
        bpy.ops.render.render(write_still=True)
        print(f"[{i}/{len(labels)}] {label_path.name} -> {out.name}")

    print("Done. Run composite_vial_shots.py next.")


if __name__ == "__main__":
    main()
