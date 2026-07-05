"""Crop the seashell-nice.png mockup tight around the vial + shadow.

The source mockup has generous white margins (top/bottom/sides) which leaves
too much dead space in the final product shot. This crops to a small,
consistent padding around the detected vial silhouette and shadow, without
touching the original file in Product Mockups/.

Run once whenever Product Mockups/seashell-nice.png changes:

    python tools/label-pipeline/scripts/crop_plate.py
"""

from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image

REPO_ROOT = Path(__file__).resolve().parents[3]
SRC = REPO_ROOT / "Product Mockups" / "seashell-nice.png"
DEST = Path(__file__).resolve().parents[1] / "assets" / "seashell-nice-cropped.png"

# Padding relative to the detected vial+shadow bounding box.
PAD_X_RATIO = 0.06
PAD_TOP_RATIO = 0.06
PAD_BOTTOM_RATIO = 0.03

# Luminance below this is considered "content" (vial glass, cap, or shadow)
# rather than the pure-white background.
CONTENT_LUM_THRESHOLD = 253


def detect_content_bbox(im: Image.Image) -> tuple[int, int, int, int]:
    arr = np.array(im.convert("RGB"), dtype=np.float32)
    lum = arr.mean(axis=2)
    mask = lum < CONTENT_LUM_THRESHOLD
    ys, xs = np.where(mask)
    if len(xs) == 0:
        raise ValueError("No content detected — check CONTENT_LUM_THRESHOLD")
    return int(xs.min()), int(ys.min()), int(xs.max()), int(ys.max())


def crop_plate(src: Path = SRC, dest: Path = DEST) -> tuple[int, int]:
    im = Image.open(src).convert("RGB")
    w, h = im.size
    x0c, y0c, x1c, y1c = detect_content_bbox(im)

    pad_x = int((x1c - x0c) * PAD_X_RATIO)
    pad_top = int((y1c - y0c) * PAD_TOP_RATIO)
    pad_bottom = int((y1c - y0c) * PAD_BOTTOM_RATIO)

    x0 = max(0, x0c - pad_x)
    x1 = min(w - 1, x1c + pad_x)
    y0 = max(0, y0c - pad_top)
    y1 = min(h - 1, y1c + pad_bottom)

    cropped = im.crop((x0, y0, x1 + 1, y1 + 1))
    dest.parent.mkdir(parents=True, exist_ok=True)
    cropped.save(dest, format="PNG", optimize=True)
    print(f"Content bbox: ({x0c},{y0c})-({x1c},{y1c})")
    print(f"Cropped {src.name} -> {dest} ({cropped.size[0]}x{cropped.size[1]})")
    return cropped.size


if __name__ == "__main__":
    crop_plate()
