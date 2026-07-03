"""
Batch-generate minimalist 2D pharmaceutical labels with Pillow.

Layout matches Product Mockups/kimi_label.jpg and retatrutide_label.svg.

Usage:
    python scripts/generate-pharma-labels.py --csv scripts/labels.csv --logo apps/storefront/public/brand/logo.png
"""

from __future__ import annotations

import argparse
import csv
import re
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

# Reference: Product Mockups/kimi_label.jpg — two rules, centered title,
# left-aligned CAS/dosage, right-aligned purity, molecule watermark.
WIDTH, HEIGHT = 1062, 1112
MARGIN = 60
LOGO_TARGET_HEIGHT = 60
TOP_LINE_Y = 180
PRODUCT_Y = 350
CAS_Y = 455
HIGHLIGHT_Y = 530
BOTTOM_LINE_Y = 780
FOOTER_Y = 850
TEXT_X = MARGIN
TEXT_X2 = WIDTH - MARGIN
LINE_WIDTH = 2

BLACK = (10, 10, 10)
WATERMARK = (230, 230, 230)
WHITE = (255, 255, 255)

PRODUCTS: list[dict[str, str]] = [
    {"sku": "retatrutide-20mg", "product_name": "Retatrutide", "cas_number": "2381089-83-2", "dosage": "20mg"},
    {"sku": "semaglutide-5mg", "product_name": "Semaglutide", "cas_number": "910463-68-2", "dosage": "5mg"},
    {"sku": "bpc-157-10mg", "product_name": "BPC-157", "cas_number": "137525-51-0", "dosage": "10mg"},
]

PURITY_TEXT = "Purity: >99.9%"
FOOTER_TEXT = "FOR RESEARCH USE ONLY"

# Molecule watermark geometry from retatrutide_label.svg (800×800 viewBox).
MOLECULE_LINES: list[tuple[tuple[float, float], tuple[float, float]]] = [
    ((150, 420), (230, 370)),
    ((230, 370), (310, 420)),
    ((310, 420), (310, 500)),
    ((310, 500), (230, 550)),
    ((230, 550), (150, 500)),
    ((150, 500), (150, 420)),
    ((310, 420), (390, 370)),
    ((390, 370), (470, 420)),
    ((470, 420), (470, 500)),
    ((470, 500), (550, 550)),
    ((550, 550), (630, 500)),
    ((630, 500), (630, 420)),
    ((630, 420), (700, 380)),
    ((470, 420), (550, 380)),
]
MOLECULE_NODES: list[tuple[float, float]] = [
    (150, 420),
    (230, 370),
    (310, 420),
    (310, 500),
    (230, 550),
    (150, 500),
    (390, 370),
    (470, 420),
    (470, 500),
    (550, 550),
    (630, 500),
    (630, 420),
    (700, 380),
    (550, 380),
]


def script_dir() -> Path:
    return Path(__file__).resolve().parent


def resolve_font_paths() -> tuple[Path, Path, Path]:
    """Return (regular, medium, extra_bold) Inter paths, with system fallbacks."""
    inter = script_dir() / "Inter Font" / "static"
    inter_triplet = (
        inter / "Inter_24pt-Regular.ttf",
        inter / "Inter_24pt-Medium.ttf",
        inter / "Inter_24pt-ExtraBold.ttf",
    )
    if all(path.is_file() for path in inter_triplet):
        return inter_triplet

    candidates = [
        (
            Path(r"C:\Windows\Fonts\arial.ttf"),
            Path(r"C:\Windows\Fonts\arial.ttf"),
            Path(r"C:\Windows\Fonts\arialbd.ttf"),
        ),
        (
            Path("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"),
            Path("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"),
            Path("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"),
        ),
    ]
    for regular, medium, bold in candidates:
        if regular.is_file() and bold.is_file():
            medium_path = medium if medium.is_file() else regular
            return regular, medium_path, bold
    raise FileNotFoundError("No usable sans-serif fonts found.")


def load_font(path: Path, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(str(path), size)


def text_width(font: ImageFont.FreeTypeFont, text: str) -> float:
    return font.getlength(text)


def center_on_x(font: ImageFont.FreeTypeFont, text: str, anchor_x: float) -> float:
    return anchor_x - text_width(font, text) / 2


def canvas_center_x(font: ImageFont.FreeTypeFont, text: str) -> float:
    return (WIDTH - text_width(font, text)) / 2


def baseline_y(anchor_y: int, font: ImageFont.FreeTypeFont, text: str) -> float:
    bbox = font.getbbox(text)
    text_h = bbox[3] - bbox[1]
    return anchor_y - text_h / 2 - bbox[1]


def slugify(name: str) -> str:
    slug = re.sub(r"[^\w\s-]", "", name.lower())
    slug = re.sub(r"[\s_]+", "-", slug).strip("-")
    return slug or "label"


def fit_font(
    text: str,
    font_path: Path,
    max_width: float,
    start_size: int,
    min_size: int,
) -> ImageFont.FreeTypeFont:
    for size in range(start_size, min_size - 1, -2):
        font = load_font(font_path, size)
        if text_width(font, text) <= max_width:
            return font
    return load_font(font_path, min_size)


def scale_point(x: float, y: float) -> tuple[float, float]:
    sx = WIDTH / 800
    sy = HEIGHT / 800
    return x * sx, y * sy


def draw_rule(draw: ImageDraw.ImageDraw, y: int) -> None:
    draw.line([(0, y), (WIDTH, y)], fill=BLACK, width=LINE_WIDTH)


def draw_molecule_watermark(draw: ImageDraw.ImageDraw) -> None:
    stroke = 3
    node_r = 4
    for (x0, y0), (x1, y1) in MOLECULE_LINES:
        draw.line([scale_point(x0, y0), scale_point(x1, y1)], fill=WATERMARK, width=stroke)
    for x, y in MOLECULE_NODES:
        px, py = scale_point(x, y)
        draw.ellipse(
            (px - node_r, py - node_r, px + node_r, py + node_r),
            fill=WATERMARK,
        )


def resize_logo(logo: Image.Image, target_height: int) -> Image.Image:
    ratio = target_height / logo.height
    new_width = max(1, round(logo.width * ratio))
    return logo.resize((new_width, target_height), Image.Resampling.LANCZOS)


def draw_spaced_text(
    draw: ImageDraw.ImageDraw,
    text: str,
    font: ImageFont.FreeTypeFont,
    anchor_x: float,
    y: float,
    fill: tuple[int, int, int],
    tracking: float,
) -> None:
    if tracking <= 0:
        draw.text((center_on_x(font, text, anchor_x), y), text, font=font, fill=fill)
        return
    total = sum(font.getlength(ch) + tracking for ch in text) - tracking
    x = anchor_x - total / 2
    for ch in text:
        draw.text((x, y), ch, font=font, fill=fill)
        x += font.getlength(ch) + tracking


def render_label(
    product: dict[str, str],
    logo: Image.Image,
    font_regular: Path,
    font_medium: Path,
    font_bold: Path,
) -> Image.Image:
    canvas = Image.new("RGB", (WIDTH, HEIGHT), WHITE)
    draw = ImageDraw.Draw(canvas)

    draw_molecule_watermark(draw)

    canvas.paste(logo, (MARGIN, MARGIN), logo if logo.mode == "RGBA" else None)
    draw_rule(draw, TOP_LINE_Y)

    product_name = product["product_name"].upper()
    max_inner = TEXT_X2 - TEXT_X

    title_font = fit_font(product_name, font_bold, max_inner, start_size=96, min_size=36)
    draw.text(
        (canvas_center_x(title_font, product_name), baseline_y(PRODUCT_Y, title_font, product_name)),
        product_name,
        font=title_font,
        fill=BLACK,
    )

    cas_text = f"CAS: {product['cas_number']}"
    cas_font = fit_font(cas_text, font_bold, max_inner, start_size=32, min_size=22)
    draw.text(
        (TEXT_X, baseline_y(CAS_Y, cas_font, cas_text)),
        cas_text,
        font=cas_font,
        fill=BLACK,
    )

    dosage = product["dosage"]
    highlight_font = fit_font(dosage, font_bold, max_inner // 2, start_size=44, min_size=26)
    purity_font = fit_font(PURITY_TEXT, font_bold, max_inner // 2, start_size=44, min_size=26)
    row_y = baseline_y(HIGHLIGHT_Y, highlight_font, dosage)
    draw.text((TEXT_X, row_y), dosage, font=highlight_font, fill=BLACK)
    draw.text(
        (TEXT_X2 - text_width(purity_font, PURITY_TEXT), baseline_y(HIGHLIGHT_Y, purity_font, PURITY_TEXT)),
        PURITY_TEXT,
        font=purity_font,
        fill=BLACK,
    )

    draw_rule(draw, BOTTOM_LINE_Y)

    footer_font = fit_font(FOOTER_TEXT, font_bold, max_inner, start_size=36, min_size=24)
    footer_y = baseline_y(FOOTER_Y, footer_font, FOOTER_TEXT)
    draw_spaced_text(draw, FOOTER_TEXT, footer_font, WIDTH / 2, footer_y, BLACK, tracking=2)

    return canvas


def load_products(csv_path: Path | None) -> list[dict[str, str]]:
    if csv_path is None:
        return PRODUCTS

    rows: list[dict[str, str]] = []
    with csv_path.open(newline="", encoding="utf-8-sig") as handle:
        reader = csv.DictReader(handle)
        required = {"product_name", "cas_number", "dosage"}
        if not reader.fieldnames or not required.issubset(set(reader.fieldnames)):
            raise ValueError(f"CSV must contain columns: {', '.join(sorted(required))}")
        for row in reader:
            item = {key: row[key].strip() for key in required}
            if "sku" in row and row["sku"].strip():
                item["sku"] = row["sku"].strip()
            rows.append(item)
    return rows


def resolve_logo_path(explicit: Path | None) -> Path:
    root = script_dir().parent
    candidates = [
        explicit,
        script_dir() / "logo.png",
        root / "apps" / "storefront" / "public" / "brand" / "logo.png",
    ]
    for path in candidates:
        if path is not None and path.is_file():
            return path
    raise FileNotFoundError("logo.png not found. Place it beside the script or pass --logo.")


def output_filename(product: dict[str, str]) -> str:
    if product.get("sku"):
        return f"{slugify(product['sku'])}.jpg"
    return f"{slugify(product['product_name'])}.jpg"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Generate pharmaceutical labels (kimi_label layout).")
    parser.add_argument("--csv", type=Path, help="CSV with product_name, cas_number, dosage (+ optional sku)")
    parser.add_argument("--logo", type=Path, help="Path to logo.png")
    parser.add_argument("--output", type=Path, default=Path("output"), help="Output directory (default: output)")
    parser.add_argument("--font-regular", type=Path, help="Regular .ttf path")
    parser.add_argument("--font-medium", type=Path, help="Medium .ttf path (CAS line)")
    parser.add_argument("--font-bold", type=Path, help="Extra-bold .ttf path")
    return parser.parse_args()


def main() -> int:
    args = parse_args()

    try:
        if args.font_regular and args.font_bold:
            font_regular = args.font_regular
            font_medium = args.font_medium or args.font_regular
            font_bold = args.font_bold
        else:
            font_regular, font_medium, font_bold = resolve_font_paths()

        logo_raw = Image.open(resolve_logo_path(args.logo)).convert("RGBA")
        logo = resize_logo(logo_raw, LOGO_TARGET_HEIGHT)

        products = load_products(args.csv)
        out_dir = args.output
        out_dir.mkdir(parents=True, exist_ok=True)

        for product in products:
            label = render_label(product, logo, font_regular, font_medium, font_bold)
            out_path = out_dir / output_filename(product)
            label.save(out_path, format="JPEG", quality=95, subsampling=0, optimize=True)
            print(f"Wrote {out_path}")

        print(f"Done — {len(products)} label(s) saved to {out_dir.resolve()}")
        return 0

    except (FileNotFoundError, ValueError) as exc:
        print(f"Error: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
