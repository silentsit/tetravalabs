"""
Batch-generate minimalist 2D pharmaceutical labels with Pillow.

Usage:
    python scripts/generate-pharma-labels.py
    python scripts/generate-pharma-labels.py --csv products.csv --logo path/to/logo.png
"""

from __future__ import annotations

import argparse
import csv
import re
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

# ── Canvas & layout constants ────────────────────────────────────────────────
WIDTH, HEIGHT = 1062, 1112
MARGIN = 60
LOGO_TARGET_HEIGHT = 60
TOP_LINE_Y = 180
PRODUCT_NAME_Y = 350
CAS_Y = 520
HIGHLIGHT_Y = 650
BOTTOM_LINE_Y = 780
FOOTER_Y = 850
LINE_WIDTH = 2
BLACK = (0, 0, 0)
WHITE = (255, 255, 255)

# ── Mock product data (replace with CSV via --csv) ─────────────────────────
PRODUCTS: list[dict[str, str]] = [
    {
        "product_name": "Retatrutide",
        "cas_number": "2381089-83-2",
        "dosage": "20mg",
    },
    {
        "product_name": "Semaglutide",
        "cas_number": "910463-68-2",
        "dosage": "5mg",
    },
    {
        "product_name": "BPC-157",
        "cas_number": "137525-51-0",
        "dosage": "10mg",
    },
]

PURITY_TEXT = "Purity: >99.9%"
FOOTER_TEXT = "FOR RESEARCH USE ONLY"


def resolve_font_paths() -> tuple[Path, Path]:
    """Return (regular, bold) sans-serif font paths, cross-platform."""
    candidates = [
        (Path(r"C:\Windows\Fonts\arial.ttf"), Path(r"C:\Windows\Fonts\arialbd.ttf")),
        (Path(r"C:\Windows\Fonts\segoeui.ttf"), Path(r"C:\Windows\Fonts\segoeuib.ttf")),
        (Path("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"),
         Path("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf")),
        (Path("/System/Library/Fonts/Supplemental/Arial.ttf"),
         Path("/System/Library/Fonts/Supplemental/Arial Bold.ttf")),
        (Path("/Library/Fonts/Arial.ttf"), Path("/Library/Fonts/Arial Bold.ttf")),
    ]
    for regular, bold in candidates:
        if regular.is_file() and bold.is_file():
            return regular, bold
    raise FileNotFoundError(
        "No sans-serif font pair found. Install Arial or DejaVu Sans, "
        "or pass --font-regular / --font-bold."
    )


def load_font(path: Path, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(str(path), size)


def text_width(font: ImageFont.FreeTypeFont, text: str) -> float:
    return font.getlength(text)


def text_height(font: ImageFont.FreeTypeFont, text: str) -> int:
    bbox = font.getbbox(text)
    return bbox[3] - bbox[1]


def center_x(font: ImageFont.FreeTypeFont, text: str, canvas_width: int) -> float:
    return (canvas_width - text_width(font, text)) / 2


def left_x(padding: int) -> float:
    return padding


def right_x(font: ImageFont.FreeTypeFont, text: str, canvas_width: int, padding: int) -> float:
    return canvas_width - padding - text_width(font, text)


def baseline_y(anchor_y: int, font: ImageFont.FreeTypeFont, text: str) -> float:
    """Place text so its visual vertical center sits near anchor_y."""
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


def resize_logo(logo: Image.Image, target_height: int) -> Image.Image:
    ratio = target_height / logo.height
    new_width = max(1, round(logo.width * ratio))
    return logo.resize((new_width, target_height), Image.Resampling.LANCZOS)


def draw_horizontal_line(draw: ImageDraw.ImageDraw, y: int) -> None:
    draw.line([(0, y), (WIDTH, y)], fill=BLACK, width=LINE_WIDTH)


def render_label(
    product: dict[str, str],
    logo: Image.Image,
    font_regular: Path,
    font_bold: Path,
) -> Image.Image:
    canvas = Image.new("RGB", (WIDTH, HEIGHT), WHITE)
    draw = ImageDraw.Draw(canvas)

    # Logo overlay (top-left, 60px margin)
    canvas.paste(logo, (MARGIN, MARGIN), logo if logo.mode == "RGBA" else None)

    # Top separator
    draw_horizontal_line(draw, TOP_LINE_Y)

    # Product title — massive bold caps, centered, auto-scaled to fit
    product_name = product["product_name"].upper()
    max_title_width = WIDTH - MARGIN * 2
    title_font = fit_font(product_name, font_bold, max_title_width, start_size=96, min_size=36)
    draw.text(
        (center_x(title_font, product_name, WIDTH), baseline_y(PRODUCT_NAME_Y, title_font, product_name)),
        product_name,
        font=title_font,
        fill=BLACK,
    )

    # CAS number — smaller regular, centered
    cas_text = f"CAS: {product['cas_number']}"
    cas_font = fit_font(cas_text, font_regular, max_title_width, start_size=36, min_size=22)
    draw.text(
        (center_x(cas_font, cas_text, WIDTH), baseline_y(CAS_Y, cas_font, cas_text)),
        cas_text,
        font=cas_font,
        fill=BLACK,
    )

    # Highlight row — dosage left, purity right, same baseline
    dosage = product["dosage"]
    highlight_font = fit_font(dosage, font_bold, max_title_width // 2, start_size=42, min_size=24)
    purity_font = fit_font(PURITY_TEXT, font_regular, max_title_width // 2, start_size=36, min_size=22)
    row_y = baseline_y(HIGHLIGHT_Y, highlight_font, dosage)
    draw.text((left_x(MARGIN), row_y), dosage, font=highlight_font, fill=BLACK)
    draw.text(
        (right_x(purity_font, PURITY_TEXT, WIDTH, MARGIN), row_y),
        PURITY_TEXT,
        font=purity_font,
        fill=BLACK,
    )

    # Bottom separator
    draw_horizontal_line(draw, BOTTOM_LINE_Y)

    # Regulatory footer — bold caps, centered
    footer_font = fit_font(FOOTER_TEXT, font_bold, max_title_width, start_size=40, min_size=24)
    draw.text(
        (center_x(footer_font, FOOTER_TEXT, WIDTH), baseline_y(FOOTER_Y, footer_font, FOOTER_TEXT)),
        FOOTER_TEXT,
        font=footer_font,
        fill=BLACK,
    )

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
            rows.append({key: row[key].strip() for key in required})
    return rows


def resolve_logo_path(explicit: Path | None, script_dir: Path) -> Path:
    candidates = [
        explicit,
        script_dir / "logo.png",
        script_dir.parent / "apps" / "storefront" / "public" / "brand" / "logo.png",
    ]
    for path in candidates:
        if path is not None and path.is_file():
            return path
    raise FileNotFoundError(
        "logo.png not found. Place it beside the script or pass --logo."
    )


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Generate minimalist pharmaceutical labels.")
    parser.add_argument("--csv", type=Path, help="CSV with product_name, cas_number, dosage columns")
    parser.add_argument("--logo", type=Path, help="Path to logo.png")
    parser.add_argument("--output", type=Path, default=Path("output"), help="Output directory (default: output)")
    parser.add_argument("--font-regular", type=Path, help="Regular sans-serif .ttf path")
    parser.add_argument("--font-bold", type=Path, help="Bold sans-serif .ttf path")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    script_dir = Path(__file__).resolve().parent

    try:
        if args.font_regular and args.font_bold:
            font_regular, font_bold = args.font_regular, args.font_bold
        else:
            font_regular, font_bold = resolve_font_paths()

        logo_path = resolve_logo_path(args.logo, script_dir)
        logo_raw = Image.open(logo_path).convert("RGBA")
        logo = resize_logo(logo_raw, LOGO_TARGET_HEIGHT)

        products = load_products(args.csv)
        out_dir = args.output
        out_dir.mkdir(parents=True, exist_ok=True)

        for product in products:
            label = render_label(product, logo, font_regular, font_bold)
            filename = f"{slugify(product['product_name'])}.jpg"
            out_path = out_dir / filename
            label.save(out_path, format="JPEG", quality=95, subsampling=0, optimize=True)
            print(f"Wrote {out_path}")

        print(f"Done — {len(products)} label(s) saved to {out_dir.resolve()}")
        return 0

    except (FileNotFoundError, ValueError) as exc:
        print(f"Error: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
