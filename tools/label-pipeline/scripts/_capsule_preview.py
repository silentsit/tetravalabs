"""Capsule-bottle preview: fill the marked label area with the wrapped label.

Front + side views, plus a 3/4 "hero" attempt. Reuses vial compositor helpers.
"""

import sys
from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))

from composite_vial_shots import (  # noqa: E402
    apply_shading,
    crop_to_alpha_bounds,
    harden_edges,
    make_drop_shadow,
)

REPO_ROOT = ROOT.parents[1]
PLATE = REPO_ROOT / "Product Mockups" / "chatgpt-capsule-bottle.png"
TMP = ROOT / "curved_labels_rgba"
OUT = ROOT / "_preview_output"

# Actual white label bounds on the 1254×1254 plate (measured from the render).
LABEL_AREA = (378, 399, 499, 610)


def cover_resize(img: Image.Image, w: int, h: int) -> Image.Image:
    """object-fit: cover — fill (w,h), center-crop the small overflow (no distortion)."""
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


def draw_box() -> None:
    im = Image.open(PLATE).convert("RGB")
    d = ImageDraw.Draw(im)
    x, y, w, h = LABEL_AREA
    d.rectangle([x, y, x + w, y + h], outline=(255, 0, 0), width=4)
    OUT.mkdir(parents=True, exist_ok=True)
    im.save(OUT / "_capsule_box_check.png")
    print("box check ->", LABEL_AREA)


def compose(render_name: str, out_name: str) -> None:
    plate = Image.open(PLATE).convert("RGB")
    x, y, w, h = LABEL_AREA
    curved = crop_to_alpha_bounds(Image.open(TMP / render_name).convert("RGBA"))
    label = cover_resize(curved, w, h)
    label = harden_edges(label)
    label = apply_shading(label, plate, (x, y, w, h))
    out = plate.copy()
    shadow = make_drop_shadow(label, blur=6, opacity=30)
    out.paste(shadow, (x + 2, y + 5), shadow)
    out.paste(label, (x, y), label)
    out.save(OUT / out_name, format="PNG", optimize=True)
    print(f"{out_name} <- {render_name}")


def sample() -> None:
    import numpy as np
    im = Image.open(PLATE).convert("RGB")
    w, h = im.size
    a = np.array(im).astype(float)
    lum = a.mean(axis=2)
    cx = w // 2
    print("plate", w, h, "corner lum", round(lum[3, 3], 1))
    for y in range(0, h, 30):
        print(y, round(lum[y, cx], 1))


def detect() -> None:
    import numpy as np
    im = Image.open(PLATE).convert("RGB")
    w, h = im.size
    a = np.array(im).astype(float)
    lum = a.mean(axis=2)
    sat = a.max(axis=2) - a.min(axis=2)
    # Label is a soft, uniform off-white (~205-232) with low saturation; the pure
    # background is ~254 and the pills/glass are darker/tinted, so this isolates it.
    white = (lum > 200) & (lum < 236) & (sat < 10)
    # Center column band vertical extent (label is a long uninterrupted run)
    cx0, cx1 = int(w * 0.45), int(w * 0.55)
    colcov = white[:, cx0:cx1].mean(axis=1)
    rows = np.where(colcov > 0.9)[0]
    # group contiguous
    groups = []
    cur = [rows[0]]
    for r in rows[1:]:
        if r - cur[-1] <= 5:
            cur.append(r)
        else:
            groups.append(cur); cur = [r]
    groups.append(cur)
    g = max(groups, key=len)
    y0, y1 = g[0], g[-1]
    # Horizontal extent: at each row in the band, the label (incl. curved,
    # slightly darker edges) is lum 175-240 & low sat. Take robust min/max.
    wide = (lum > 175) & (lum < 242) & (sat < 16)
    lefts, rights = [], []
    for y in range(y0, y1 + 1):
        xs = np.where(wide[y])[0]
        xs = xs[(xs > int(w * 0.1)) & (xs < int(w * 0.9))]
        if len(xs) > 50:
            lefts.append(xs.min()); rights.append(xs.max())
    x0 = int(np.median(lefts)); x1 = int(np.median(rights))
    print("plate", w, h)
    print("LABEL_AREA =", (x0, int(y0), x1 - x0 + 1, int(y1 - y0 + 1)))


if __name__ == "__main__":
    if "--sample" in sys.argv:
        sample()
    elif "--detect" in sys.argv:
        detect()
    elif "--box" in sys.argv:
        draw_box()
    else:
        for rn, on in [
            ("v1-template__front.png", "v1-capsule-front.png"),
            ("v1-template__side.png", "v1-capsule-side.png"),
            ("v2-template__front.png", "v2-capsule-front.png"),
            ("v2-template__side.png", "v2-capsule-side.png"),
        ]:
            if (TMP / rn).is_file():
                compose(rn, on)
