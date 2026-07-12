"""Generate flat wrap labels (3000×1200) from labels-batch.csv using v1/v2 layout.

Keeps logo + honeycomb chrome from the current Figma templates; redraws variable fields.
"""

from __future__ import annotations

import argparse
import csv
import re
import sys
import unicodedata
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
CSV_PATH = ROOT / "data" / "labels-batch.csv"
OUT = ROOT / "figma_labels"
PREVIEW = ROOT / "_preview_input"

W, H = 3000, 1200
FONT_DIR = Path.home() / "AppData/Local/Microsoft/Windows/Fonts"
RED = (220, 38, 38)
BLACK = (0, 0, 0)
WHITE = (255, 255, 255)

FRONT_CX = 1050
FOOTER_H = 110
TOP_CHROME_H = 250  # honeycomb + logo from template


def font(name: str, size: int) -> ImageFont.FreeTypeFont:
    path = FONT_DIR / name
    if not path.is_file():
        path = Path(r"C:\Windows\Fonts\arialbd.ttf" if "Bold" in name or "Black" in name else r"C:\Windows\Fonts\arial.ttf")
    return ImageFont.truetype(str(path), size)


def load_fonts() -> dict[str, ImageFont.ImageFont]:
    return {
        "title": font("Inter_28pt-Bold.ttf", 110),
        "title_sm": font("Inter_28pt-Bold.ttf", 78),
        "sub": font("Inter_24pt-Medium.ttf", 42),
        "badge": font("Inter_28pt-Bold.ttf", 72),
        "body": font("Inter_18pt-SemiBold.ttf", 34),
        "body_reg": font("Inter_18pt-Regular.ttf", 30),
        "side": font("Inter_18pt-Regular.ttf", 28),
        "side_b": font("Inter_18pt-Bold.ttf", 28),
        "footer": font("Inter_18pt-SemiBold.ttf", 26),
    }


def ascii_formula(text: str) -> str:
    out: list[str] = []
    for ch in text:
        name = unicodedata.name(ch, "")
        if "SUBSCRIPT" in name:
            digit = name.split()[-1]
            mapping = {
                "ZERO": "0", "ONE": "1", "TWO": "2", "THREE": "3", "FOUR": "4",
                "FIVE": "5", "SIX": "6", "SEVEN": "7", "EIGHT": "8", "NINE": "9",
            }
            out.append(mapping.get(digit, ch))
        else:
            out.append(ch)
    return "".join(out)


def concentration_label(raw: str, *, capsule: bool = False) -> str:
    s = (raw or "").strip()
    if not s or s.upper() == "N/A":
        return "N/A"
    s = s.upper().replace(" ", "")
    if capsule:
        s = re.sub(r"/CAPSULE(S)?$", "", s)
    return s


def display_product_name(product: str, *, capsule: bool = False) -> str:
    name = product.strip()
    if capsule:
        name = re.sub(r"\s*\(capsules\)\s*", " ", name, flags=re.IGNORECASE).strip()
    return name if len(name) > 22 else name.upper()


def text_size(draw: ImageDraw.ImageDraw, text: str, fnt: ImageFont.ImageFont) -> tuple[int, int]:
    box = draw.textbbox((0, 0), text, font=fnt)
    return box[2] - box[0], box[3] - box[1]


def fit_title(draw: ImageDraw.ImageDraw, text: str, fonts: dict, max_w: int) -> ImageFont.ImageFont:
    for key in ("title", "title_sm"):
        fnt = fonts[key]
        tw, _ = text_size(draw, text, fnt)
        if tw <= max_w:
            return fnt
    size = 70
    while size >= 36:
        fnt = font("Inter_28pt-Bold.ttf", size)
        tw, _ = text_size(draw, text, fnt)
        if tw <= max_w:
            return fnt
        size -= 4
    return font("Inter_28pt-Bold.ttf", 36)


def draw_centered(
    draw: ImageDraw.ImageDraw,
    text: str,
    y: int,
    fnt: ImageFont.ImageFont,
    fill=BLACK,
    cx: int = FRONT_CX,
) -> int:
    tw, th = text_size(draw, text, fnt)
    draw.text((cx - tw // 2, y), text, font=fnt, fill=fill)
    return y + th


def draw_formula_colored(draw: ImageDraw.ImageDraw, text: str, x: int, y: int, fnt: ImageFont.ImageFont) -> int:
    plain = ascii_formula(text)
    cursor = x
    for ch in plain:
        color = RED if ch.isdigit() else BLACK
        draw.text((cursor, y), ch, font=fnt, fill=color)
        cw, _ = text_size(draw, ch, fnt)
        cursor += max(cw, 1)
    _, th = text_size(draw, plain or " ", fnt)
    return th


def make_base(template: Image.Image) -> Image.Image:
    """White wrap canvas with template honeycomb+logo on top."""
    base = Image.new("RGBA", (W, H), WHITE + (255,))
    tmpl = template.convert("RGBA").resize((W, H), Image.Resampling.LANCZOS)
    top = tmpl.crop((0, 0, W, TOP_CHROME_H))
    base.paste(top, (0, 0))
    return base


def render_label(
    row: dict,
    fonts: dict,
    templates: dict[str, Image.Image],
    *,
    capsule: bool = False,
) -> Image.Image:
    kind = (row.get("label_template") or "main").strip().lower()
    if capsule:
        tmpl = templates["capsule"]
    elif kind == "flower":
        tmpl = templates["flower"]
    else:
        tmpl = templates["main"]

    img = make_base(tmpl)
    draw = ImageDraw.Draw(img)

    product = (row.get("#product_name") or "").strip()
    sub = (row.get("#sub_name") or "").strip()
    cas = (row.get("#cas_number") or "").strip()
    formula = (row.get("#formula") or "").strip()
    conc = concentration_label(row.get("#concentration") or "", capsule=capsule)

    y = 300
    title = display_product_name(product, capsule=capsule)
    title_fnt = fit_title(draw, title, fonts, max_w=1200)
    y = draw_centered(draw, title, y, title_fnt) + 16
    tw, _ = text_size(draw, title, title_fnt)
    draw.rectangle([FRONT_CX - tw // 2, y, FRONT_CX + tw // 2, y + 8], fill=BLACK)
    y += 26

    if capsule:
        # V3: quantity line under the title (e.g. 100 CAPSULES)
        qty = (row.get("#capsule_count") or row.get("capsule_count") or "100 CAPSULES").strip()
        if qty.upper() == "N/A" or not qty:
            qty = "100 CAPSULES"
        if "CAPSULE" not in qty.upper():
            qty = f"{qty} CAPSULES"
        y = draw_centered(draw, qty.upper(), y, fonts["sub"]) + 22
    elif kind == "flower" and sub:
        y = draw_centered(draw, sub, y, fonts["sub"]) + 22
    else:
        y += 8

    bf = fonts["badge"]
    tw, th = text_size(draw, conc, bf)
    bw, bh = max(420, tw + 80), 120
    if tw > 520:
        bf = font("Inter_28pt-Bold.ttf", 48)
        tw, th = text_size(draw, conc, bf)
        bw, bh = tw + 70, 100
    bx0 = FRONT_CX - bw // 2
    draw.rounded_rectangle([bx0, y, bx0 + bw, y + bh], radius=18, fill=BLACK)
    draw.text((FRONT_CX - tw // 2, y + (bh - th) // 2 - 4), conc, font=bf, fill=WHITE)
    y += bh + 34

    draw_centered(draw, "HPLC VERIFIED: ≥ 99% PURITY", y, fonts["body"])
    y += 46
    draw_centered(draw, "RESEARCH GRADE • LAB TESTED", y, fonts["body_reg"])

    side_items: list[tuple[str, str]] = []
    if formula:
        side_items.append((formula.split("|")[0].strip(), "formula"))
    if cas:
        cas_txt = cas if cas.upper().startswith("CAS") else f"CAS: {cas}"
        side_items.append((cas_txt, "side_b"))
    side_items.extend(
        [
            ("Storage Instructions:", "side_b"),
            ("Store at 2°C - 8°C (Refrigerated)", "side"),
            ("Protect from direct light", "side"),
            ("Keep out of reach of children", "side_b"),
        ]
    )

    strip_w, strip_h = 1100, 560
    strip = Image.new("RGBA", (strip_w, strip_h), (255, 255, 255, 0))
    sd = ImageDraw.Draw(strip)
    sy = 8
    for text, style in side_items:
        if style == "formula":
            th = draw_formula_colored(sd, text, 8, sy, fonts["side_b"])
        else:
            fnt = fonts["side"] if style == "side" else fonts["side_b"]
            sd.text((8, sy), text, font=fnt, fill=BLACK)
            _, th = text_size(sd, text, fnt)
        sy += th + 14

    rotated = strip.rotate(90, expand=True, fillcolor=(255, 255, 255, 0))
    rx = 2680 - rotated.width // 2
    ry = max(TOP_CHROME_H + 20, (H - FOOTER_H - rotated.height) // 2)
    img.alpha_composite(rotated, (max(0, rx), ry))

    draw.rectangle([0, H - FOOTER_H, W, H], fill=BLACK)
    footer = "DIETARY SUPPLEMENT" if capsule else "FOR RESEARCH USE ONLY • NOT FOR HUMAN CONSUMPTION"
    tw, th = text_size(draw, footer, fonts["footer"])
    draw.text(((W - tw) // 2, H - FOOTER_H + (FOOTER_H - th) // 2 - 2), footer, font=fonts["footer"], fill=WHITE)

    return img.convert("RGB")


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--vials-only", action="store_true", help="Skip capsule SKUs")
    parser.add_argument("--capsules-only", action="store_true", help="Only capsule SKUs")
    parser.add_argument("--keep-existing", action="store_true", help="Do not wipe figma_labels first")
    args = parser.parse_args()

    sys.path.insert(0, str(Path(__file__).resolve().parent))
    from routing import is_capsule, load_manifest  # noqa: E402

    templates = {
        "main": Image.open(PREVIEW / "v1-template.png").convert("RGBA"),
        "flower": Image.open(PREVIEW / "v2-template.png").convert("RGBA"),
        "capsule": Image.open(PREVIEW / "v3-template.png").convert("RGBA"),
    }
    fonts = load_fonts()
    OUT.mkdir(parents=True, exist_ok=True)
    if not args.keep_existing:
        for old in OUT.glob("*"):
            if old.is_file() and old.name.upper() not in {"V3.SVG", "V3@2X.PNG", "V3.PNG"}:
                # Keep source V3 exports; remove generated product PNGs
                if old.suffix.lower() in {".png", ".jpg", ".jpeg"} and not old.stem.upper().startswith("V3"):
                    old.unlink()

    manifest = load_manifest()
    rows = list(csv.DictReader(CSV_PATH.open(encoding="utf-8")))
    ok = skipped = 0
    for row in rows:
        export_name = (row.get("export_filename") or "").strip()
        if not export_name:
            continue
        capsule = is_capsule(export_name, manifest)
        if args.vials_only and capsule:
            skipped += 1
            continue
        if args.capsules_only and not capsule:
            skipped += 1
            continue
        img = render_label(row, fonts, templates, capsule=capsule)
        img.save(OUT / f"{export_name}.png", "PNG", optimize=True)
        ok += 1
        if ok % 20 == 0:
            print(f"[{ok}] generated")

    print(f"Wrote {ok} labels -> {OUT}  (skipped {skipped})")
    return 0 if ok else 1


if __name__ == "__main__":
    raise SystemExit(main())
