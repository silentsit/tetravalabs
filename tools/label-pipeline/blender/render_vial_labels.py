"""Render curved label RGBA passes for each configured view (Blender only)."""

from __future__ import annotations

import argparse
import csv
import json
import math
import re
import sys
from pathlib import Path

import bpy

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_INPUT = ROOT / "figma_labels"
DEFAULT_TMP = ROOT / "curved_labels_rgba"
CONFIG_PATH = ROOT / "assets" / "placement-config.json"
DEFAULT_CSV = ROOT / "data" / "labels-batch.csv"
MANIFEST_PATH = ROOT / "data" / "labels-manifest.csv"
CAPSULE_PATTERN = re.compile(r"capsules", re.IGNORECASE)


def parse_args() -> argparse.Namespace:
    raw = sys.argv
    argv = raw[raw.index("--") + 1 :] if "--" in raw else []
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", type=Path, default=DEFAULT_INPUT)
    parser.add_argument("--tmp", type=Path, default=DEFAULT_TMP)
    parser.add_argument("--csv", type=Path, default=DEFAULT_CSV, help="Product list (export_filename column)")
    parser.add_argument(
        "--no-product-list",
        action="store_true",
        help="Skip CSV filter (for template/preview renders only)",
    )
    parser.add_argument("--limit", type=int, default=0)
    parser.add_argument("--only", type=str, default="")
    return parser.parse_args(argv)


def load_allowed_stems(csv_path: Path) -> set[str]:
    if not csv_path.is_file():
        raise FileNotFoundError(f"Product list missing: {csv_path}")
    allowed: set[str] = set()
    with csv_path.open(newline="", encoding="utf-8") as handle:
        for row in csv.DictReader(handle):
            name = (row.get("export_filename") or "").strip()
            if name:
                allowed.add(name.lower())
    return allowed


def load_config() -> dict:
    return json.loads(CONFIG_PATH.read_text(encoding="utf-8"))


def load_manifest() -> dict[str, str]:
    if not MANIFEST_PATH.is_file():
        return {}
    mapping: dict[str, str] = {}
    with MANIFEST_PATH.open(newline="", encoding="utf-8") as handle:
        for row in csv.DictReader(handle):
            name = (row.get("export_filename") or "").strip()
            mockup = (row.get("mockup") or "").strip().lower()
            if name and mockup:
                mapping[name.lower()] = mockup
    return mapping


def is_capsule(stem: str, manifest: dict[str, str]) -> bool:
    key = stem.lower()
    mockup = manifest.get(key)
    if mockup == "capsule":
        return True
    if mockup == "vial":
        return False
    return bool(CAPSULE_PATTERN.search(stem))


def load_views(kind: str = "vial") -> list[dict]:
    cfg = load_config()
    section = cfg.get(kind) or {}
    views = (section.get("blender") or {}).get("views")
    if not views:
        views = (cfg.get("vial", {}).get("blender", {}) or {}).get("views")
    if not views:
        views = [{"name": "front", "front_u": 0.5}]
    return views


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
    cyl = bpy.data.objects.get("LabelCylinder")
    if not cyl:
        raise RuntimeError("LabelCylinder missing — run setup_vial_scene.py")

    manifest = load_manifest()
    vial_views = load_views("vial")
    capsule_views = load_views("capsule")
    all_files = (
        sorted(args.input.glob("*.jpg"))
        + sorted(args.input.glob("*.jpeg"))
        + sorted(args.input.glob("*.png"))
    )

    if args.no_product_list:
        labels = all_files
        print("Product-list filter OFF (preview/template mode)")
    else:
        allowed = load_allowed_stems(args.csv.resolve())
        labels = [p for p in all_files if p.stem.lower() in allowed]
        missing_skus = len(allowed) - len({p.stem.lower() for p in labels})
        print(f"Product list: {args.csv.name} ({len(allowed)} SKUs)")
        if missing_skus:
            print(f"Note: {missing_skus} CSV SKU(s) have no matching file in {args.input.name}/ yet.")

    if args.only:
        key = args.only.lower()
        labels = [p for p in labels if p.stem.lower() == key or key in p.stem.lower()]
    if args.limit > 0:
        labels = labels[: args.limit]

    if not labels:
        print(f"No labels to render in {args.input}")
        return

    args.tmp.mkdir(parents=True, exist_ok=True)
    scene = bpy.context.scene
    total = sum(
        len(capsule_views if is_capsule(label_path.stem, manifest) else vial_views)
        for label_path in labels
    )
    print(f"Rendering {len(labels)} label(s) -> {args.tmp}")
    print(f"Vial views: {vial_views}")
    print(f"Capsule views: {capsule_views}")

    n = 0
    for label_path in labels:
        set_label_texture(mat, label_path)
        kind = "capsule" if is_capsule(label_path.stem, manifest) else "vial"
        views = capsule_views if kind == "capsule" else vial_views
        for view in views:
            n += 1
            front_u = float(view.get("front_u", 0.5))
            # u = 0 faces the camera; rotate to bring front_u to the front.
            cyl.rotation_euler = (0.0, 0.0, -front_u * 2.0 * math.pi)
            out = args.tmp / f"{label_path.stem}__{view['name']}.png"
            scene.render.filepath = str(out)
            bpy.ops.render.render(write_still=True)
            print(f"[{n}/{total}] {label_path.name} [{kind}/{view['name']}] u={front_u} -> {out.name}")

    print("Done. Run composite_vial_shots.py next.")


if __name__ == "__main__":
    main()
