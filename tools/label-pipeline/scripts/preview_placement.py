"""Flat placement preview — checks label BOX position only (no fake curve).

Run after marking the area in mark-label-area.html:

    python tools/label-pipeline/scripts/preview_placement.py
    python tools/label-pipeline/scripts/preview_placement.py --label output/adipotide-5mg.jpg
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

from PIL import Image

SCRIPT_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(SCRIPT_DIR))

from composite_vial_shots import apply_shading, composite, feather_alpha  # noqa: E402
from load_placement import get_vial, scale_box  # noqa: E402

REPO_ROOT = Path(__file__).resolve().parents[3]
DEFAULT_LABEL = Path(__file__).resolve().parents[1] / "figma_labels" / "BPC-157-10mg.png"
OUT_DIR = Path(__file__).resolve().parents[1] / "assets"


def main() -> None:
    parser = argparse.ArgumentParser(description="Preview label placement (flat — position check only)")
    parser.add_argument("--label", type=Path, default=DEFAULT_LABEL, help="Flat label JPG/PNG to test")
    parser.add_argument("-o", "--output", type=Path, help="Output PNG path")
    args = parser.parse_args()

    vial = get_vial()
    plate_path = vial["plate"]
    box_native = vial["label_box"]
    native_size = vial["native_size"]
    feather = vial["feather_radius"]

    if not args.label.is_file():
        raise FileNotFoundError(f"Label not found: {args.label}")

    plate = Image.open(plate_path).convert("RGB")
    if not native_size[0]:
        native_size = plate.size
    box = scale_box(box_native, native_size, plate.size)

    label = Image.open(args.label).convert("RGBA")
    x, y, w, h = box
    label = label.resize((w, h), Image.Resampling.LANCZOS)
    label = feather_alpha(label, feather)
    label = apply_shading(label, plate, box)

    out_img = plate.copy()
    out_img.paste(label, (x, y), label)

    out_path = args.output or OUT_DIR / f"preview_{args.label.stem}.png"
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_img.save(out_path, format="PNG", optimize=True)
    print(f"Plate:     {plate_path.name} ({plate.size[0]}x{plate.size[1]})")
    print(f"Label box: {box}  (native {box_native})")
    print(f"Saved:     {out_path}")
    print("Note: This is a FLAT position check. Run run-blender-batch.ps1 for curved Blender wrap.")


if __name__ == "__main__":
    main()
