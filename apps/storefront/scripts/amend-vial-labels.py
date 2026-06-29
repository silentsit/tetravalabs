"""
Redraw vial label typography on photorealistic product mockups.
Detects the label patch, clears old text, and renders clean centered type.
"""

from __future__ import annotations

import re
import shutil
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
ASSETS = Path(
    r"C:\Users\user\.cursor\projects\c-Users-user-Downloads-Tetravalabs\assets"
)
OUT_DIR = ROOT / "public" / "products" / "v2"

FONT_BOLD = Path(r"C:\Windows\Fonts\segoeuib.ttf")
FONT_REG = Path(r"C:\Windows\Fonts\segoeui.ttf")
FONT_SEMI = Path(r"C:\Windows\Fonts\arialbd.ttf")

TEXT = "#1E293B"
MUTED = "#64748B"
STROKE = "#334155"

PRODUCTS = [
    {"match": "ss31-25mg", "out": "ss-31-25mg.png", "lines": ["SS-31"], "strength": "25MG"},
    {"match": "ss31-10mg", "out": "ss-31-10mg.png", "lines": ["SS-31"], "strength": "10MG"},
    {"match": "ss31-50mg", "out": "ss-31-50mg.png", "lines": ["SS-31"], "strength": "50MG"},
    {"match": "oxytocin-5mg", "out": "oxytocin-5mg.png", "lines": ["Oxytocin"], "strength": "5MG"},
    {"match": "oxytocin-10mg", "out": "oxytocin-10mg.png", "lines": ["Oxytocin"], "strength": "10MG"},
    {"match": "oxytocin-2mg", "out": "oxytocin-2mg.png", "lines": ["Oxytocin"], "strength": "2MG"},
    {"match": "nad-plus-1000mg", "out": "nad-1000mg.png", "lines": ["NAD+"], "strength": "1000MG"},
    {"match": "nad-plus-100mg", "out": "nad-100mg.png", "lines": ["NAD+"], "strength": "100MG"},
    {"match": "nad-plus-500mg", "out": "nad-500mg.png", "lines": ["NAD+"], "strength": "500MG"},
    {
        "match": "blend-bpc-tb",
        "out": "bpc-tb500-blend-10mg.png",
        "lines": ["BPC-157", "+", "TB-500"],
        "strength": "10MG",
    },
    {
        "match": "blend-cjc-serm-ipa",
        "out": "cjc-serm-ipa-blend-5mg.png",
        "lines": ["CJC-1295", "Sermorelin + IPA"],
        "strength": "5MG",
    },
    {
        "match": "cjc1295-dac-5mg",
        "out": "cjc1295-dac-5mg.png",
        "lines": ["CJC-1295", "with DAC"],
        "strength": "5MG",
    },
    {"match": "ll37-5mg", "out": "ll-37-5mg.png", "lines": ["LL-37"], "strength": "5MG"},
    {"match": "foxo4-dri-10mg", "out": "foxo4-dri-10mg.png", "lines": ["FOXO4-DRI"], "strength": "10MG"},
    {"match": "glutathione-1500mg", "out": "glutathione-1500mg.png", "lines": ["Glutathione"], "strength": "1500MG"},
    {"match": "pinealon-10mg", "out": "pinealon-10mg.png", "lines": ["Pinealon"], "strength": "10MG"},
    {"match": "humanin-10mg", "out": "humanin-10mg.png", "lines": ["Humanin"], "strength": "10MG"},
    {"match": "adamax-10mg", "out": "adamax-10mg.png", "lines": ["Adamax"], "strength": "10MG"},
    {"match": "dihexa-10mg", "out": "dihexa-10mg.png", "lines": ["Dihexa"], "strength": "10MG"},
    {"match": "cerebrolysin-10mg", "out": "cerebrolysin-10mg.png", "lines": ["Cerebrolysin"], "strength": "10MG"},
    {"match": "retatrutide-20mg", "out": "retatrutide-20mg.png", "lines": ["Retatrutide"], "strength": "20MG", "copy_only": True},
    {"match": "mazdutide-10mg", "out": "mazdutide-10mg.png", "lines": ["Mazdutide"], "strength": "10MG", "copy_only": True},
    {"match": "aod9604-10mg", "out": "aod9604-10mg.png", "lines": ["AOD-9604"], "strength": "10MG", "copy_only": True},
    {"match": "kisspeptin-5mg", "out": "kisspeptin-10-5mg.png", "lines": ["Kisspeptin-10"], "strength": "5MG"},
]


def find_source(product: dict) -> Path | None:
    src = find_asset(product["match"])
    if src is not None:
        return src
    out_path = OUT_DIR / product["out"]
    if out_path.exists():
        return out_path
    return None


def find_reference_asset(match: str) -> Path | None:
    pattern = re.compile(re.escape(match), re.I)
    matches = [
        path
        for path in ASSETS.iterdir()
        if path.suffix.lower() == ".png" and pattern.search(path.name)
    ]
    if not matches:
        return None
    preferred = [path for path in matches if "empty-window_images" in path.name]
    pool = preferred or matches
    return max(pool, key=lambda path: path.stat().st_mtime)


def find_asset(match: str) -> Path | None:
    pattern = re.compile(re.escape(match), re.I)
    matches = [
        path
        for path in ASSETS.iterdir()
        if path.suffix.lower() == ".png" and pattern.search(path.name)
    ]
    if not matches:
        return None
    if len(matches) == 1:
        return matches[0]
    # Prefer the largest source mockup when several uploads share the same slug.
    return max(matches, key=lambda path: path.stat().st_size)


def clear_label_interior(
    img: Image.Image,
    x0: int,
    y0: int,
    x1: int,
    y1: int,
    fill: tuple[int, int, int],
) -> None:
    for _ in range(4):
        erase_label_text(img, x0, y0, x1, y1, fill)


def load_font(path: Path, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(str(path), size)


def text_width(font: ImageFont.FreeTypeFont, text: str) -> float:
    return font.getlength(text)


def erase_label_text(
    img: Image.Image,
    x0: int,
    y0: int,
    x1: int,
    y1: int,
    fill: tuple[int, int, int],
) -> None:
    px = img.load()
    for y in range(y0, y1 + 1):
        for x in range(x0, x1 + 1):
            r, g, b = px[x, y]
            avg = (r + g + b) / 3
            chroma = max(r, g, b) - min(r, g, b)
            drift = max(abs(r - fill[0]), abs(g - fill[1]), abs(b - fill[2]))
            if avg < 248 or chroma > 10 or drift > 14:
                px[x, y] = fill


def detect_label_box(img: Image.Image) -> tuple[int, int, int, int, tuple[int, int, int]]:
    w, h = img.size
    px = img.load()
    cx = w // 2
    y_min = int(h * 0.38)
    y_max = int(h * 0.68)

    gray_rows: list[int] = []
    for y in range(y_min, y_max):
        avg = sum(px[cx, y]) / 3
        if 220 <= avg <= 244:
            gray_rows.append(y)
    if not gray_rows:
        return int(w * 0.30), int(h * 0.40), int(w * 0.70), int(h * 0.58), (237, 237, 237)

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

    max_height = int(h * 0.24)
    if y1 - y0 + 1 > max_height:
        y1 = y0 + max_height - 1

    # Include disclaimer band below the main label face.
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
        return int(w * 0.30), y0, int(w * 0.70), y1, (237, 237, 237)

    x0, x1 = cols[0], cols[-1]
    x0 = max(0, x0 - 4)
    x1 = min(w - 1, x1 + 4)

    samples = [
        px[x, y]
        for x in range(x0 + 2, x1 - 1, max(1, (x1 - x0) // 6))
        for y in range(y0 + 2, y1 - 1, max(1, (y1 - y0) // 6))
        if min(px[x, y]) > 200
    ]
    fill = (
        tuple(sum(c[i] for c in samples) // len(samples) for i in range(3))
        if samples
        else (237, 237, 237)
    )
    return x0, y0, x1, y1, fill


def fit_name_font(
    lines: list[str],
    max_width: float,
    max_height: float,
) -> tuple[ImageFont.FreeTypeFont, ImageFont.FreeTypeFont, ImageFont.FreeTypeFont, list[int]]:
    for size in range(68, 16, -2):
        bold = load_font(FONT_BOLD, size)
        regular = load_font(FONT_REG, max(14, size - 10))
        sub = load_font(FONT_REG, max(16, size - 14))
        line_heights: list[int] = []
        total = 0
        fits = True
        for line in lines:
            if line == "+":
                font = regular
            elif line.startswith("with ") or " + " in line:
                font = sub
            else:
                font = bold
            if text_width(font, line) > max_width:
                fits = False
                break
            if line == "+":
                lh = int(size * 0.55)
            elif line.startswith("with ") or " + " in line:
                lh = int(size * 0.72)
            else:
                lh = int(size * 1.0)
            line_heights.append(lh)
            total += lh
        if fits and total <= max_height:
            return bold, regular, sub, line_heights
    bold = load_font(FONT_BOLD, 18)
    regular = load_font(FONT_REG, 14)
    sub = load_font(FONT_REG, 14)
    return bold, regular, sub, [22] * len(lines)


def pick_font(line: str, bold, regular, sub) -> ImageFont.FreeTypeFont:
    if line == "+":
        return regular
    if line.startswith("with ") or " + " in line:
        return sub
    return bold


def draw_label(img: Image.Image, lines: list[str], strength: str) -> None:
    x0, y0, x1, y1, fill = detect_label_box(img)
    w, h = img.size
    cx = (x0 + x1) // 2
    draw = ImageDraw.Draw(img)
    clear_label_interior(img, x0, y0, x1, y1, fill)

    pad_x = int((x1 - x0) * 0.08)
    pad_y = int((y1 - y0) * 0.08)
    inner_w = (x1 - x0) - pad_x * 2
    inner_h = (y1 - y0) - pad_y * 2

    bold, regular, sub, line_heights = fit_name_font(lines, inner_w, int(inner_h * 0.46))
    name_zone_ratio = 0.36 if len(lines) > 1 else 0.30
    name_zone_h = int(inner_h * name_zone_ratio)
    name_block_h = sum(line_heights)
    y = y0 + pad_y + max(0, (name_zone_h - name_block_h) // 2)

    for line, lh in zip(lines, line_heights):
        font = pick_font(line, bold, regular, sub)
        color = MUTED if line == "+" else TEXT
        tw = text_width(font, line)
        draw.text((cx - tw / 2, y), line, font=font, fill=color)
        y += lh

    # Match reference mockups: clear gap between name block and strength pill.
    strength_size = max(18, int(w * 0.042))
    for size in range(strength_size, 14, -2):
        strength_font = load_font(FONT_SEMI, size)
        if text_width(strength_font, strength) <= inner_w * 0.78:
            break

    sw = text_width(strength_font, strength)
    pill_pad_x = int(size * 0.5)
    pill_pad_y = int(size * 0.25)
    pill_w = int(sw + pill_pad_x * 2)
    pill_h = int(size + pill_pad_y * 2)

    disc_size = max(10, int(w * 0.022))
    disc_font = load_font(FONT_REG, disc_size)
    disc = "For Research Use Only"
    disc_y = y1 - pad_y - disc_size

    min_pill_y = y0 + pad_y + int(inner_h * 0.56)
    min_gap_y = y + max(16, int(inner_h * 0.22))
    max_pill_y = disc_y - pill_h - max(10, int(inner_h * 0.06))
    pill_y0 = min(max(min_pill_y, min_gap_y), max_pill_y)

    pill_x0 = cx - pill_w // 2
    draw.rounded_rectangle(
        [pill_x0, pill_y0, pill_x0 + pill_w, pill_y0 + pill_h],
        radius=pill_h // 2,
        outline=STROKE,
        width=max(2, int(w / 340)),
    )
    draw.text(
        (cx - sw / 2, pill_y0 + pill_pad_y * 0.5),
        strength,
        font=strength_font,
        fill=STROKE,
    )

    dw = text_width(disc_font, disc)
    draw.text(
        (cx - dw / 2, disc_y),
        disc,
        font=disc_font,
        fill=MUTED,
    )


def process(product: dict) -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    out_path = OUT_DIR / product["out"]

    if product.get("copy_only"):
        src = find_reference_asset(product["match"])
        if src is None:
            print(f"SKIP missing reference asset: {product['match']}")
            return
        shutil.copy2(src, out_path)
        print(f"Copied {out_path.name} from {src.name}")
        return

    src = find_source(product)
    if src is None:
        print(f"SKIP missing asset: {product['match']}")
        return

    img = Image.open(src).convert("RGB")
    draw_label(img, product["lines"], product["strength"])

    out_path = OUT_DIR / product["out"]
    img.save(out_path, format="PNG", optimize=True)
    print(f"Wrote {out_path.name} ({img.size[0]}x{img.size[1]})")


def main() -> None:
    for product in PRODUCTS:
        process(product)


if __name__ == "__main__":
    main()
