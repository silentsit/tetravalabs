"""Object-oriented SVG label rendering engine."""

from __future__ import annotations

import csv
import re
from dataclasses import dataclass
from html import escape
from pathlib import Path

from generator.effects import build_effect_defs
from generator.layout import CANVAS_SIZE, LabelLayout
from generator.sections import (
    render_brand_header,
    render_cas_number,
    render_dosage_badge,
    render_footer,
    render_molecule,
    render_paper_background,
    render_product_title,
    render_purity_block,
    render_styles,
)
from generator.typography import estimate_text_width, fit_single_line_text, placement_for_box


SVG_NS = "http://www.w3.org/2000/svg"


@dataclass(frozen=True)
class LabelProduct:
    product_name: str
    cas_number: str
    concentration: str


@dataclass(frozen=True)
class LabelPaths:
    project_root: Path
    assets_dir: Path
    fonts_dir: Path
    output_dir: Path


class PharmaceuticalLabelRenderer:
    """Render the TetravaLabs pharmaceutical label as editable vector SVG."""

    def __init__(self, layout: LabelLayout | None = None) -> None:
        self.layout = layout or LabelLayout()

    def render(self, product: LabelProduct) -> str:
        normalized = normalize_product(product)
        regime = self._title_regime(normalized.product_name)
        placements = self._build_placements(normalized, regime)

        sections = [
            '<?xml version="1.0" encoding="UTF-8"?>',
            self._svg_open(normalized),
            build_effect_defs(),
            render_styles(),
            render_paper_background(self.layout),
            render_brand_header(self.layout),
        ]
        if regime != "full":
            sections.append(render_molecule(self.layout, compact=(regime == "compact")))
        sections.extend(
            [
                render_product_title(normalized.product_name, placements["product"]),
                render_cas_number(placements["cas"].fit.text, placements["cas"]),
                render_dosage_badge(self.layout, placements["concentration"].fit, placements["concentration"]),
                render_purity_block(self.layout),
                render_footer(self.layout),
                "</svg>",
            ]
        )
        return "\n".join(sections)

    def _title_regime(self, product_name: str) -> str:
        """Pick a layout regime based on how much room the title needs.

        - "short":   fits at full size in the base width (e.g. BPC-157). Original
                     layout and molecule are preserved exactly.
        - "compact": needs more room; widen the title and shift/shrink the
                     molecule while keeping a safe gap between them.
        - "full":    too long even then; drop the molecule and use the full
                     label width so the title never overlaps it.
        """

        return "full"

    def _build_placements(self, product: LabelProduct, regime: str = "short"):
        product_box = self.layout.product_box
        cas_box = self.layout.cas_box
        badge_box = self.layout.badge_box
        if regime == "full":
            product_max_width = self.layout.product_max_width_full
            product_min_font = self.layout.product_min_font_full
        elif regime == "compact":
            product_max_width = self.layout.product_max_width_wide
            product_min_font = 54
        else:
            product_max_width = self.layout.product_max_width
            product_min_font = 54
        product_fit = fit_single_line_text(product.product_name, product_max_width, 132, product_min_font)
        cas_display = f"CAS: {product.cas_number}" if product.cas_number else ""
        cas_fit = fit_single_line_text(cas_display, self.layout.cas_max_width, 50, 36)
        concentration_fit = fit_single_line_text(
            product.concentration,
            self.layout.badge_text_max_width,
            82,
            46,
        )
        return {
            "product": placement_for_box(
                product_fit,
                product_box[0],
                product_box[1],
                product_box[2],
                product_box[3],
            ),
            "cas": placement_for_box(
                cas_fit,
                cas_box[0],
                cas_box[1],
                cas_box[2],
                cas_box[3],
            ),
            "concentration": placement_for_box(
                concentration_fit,
                badge_box[0],
                badge_box[1],
                badge_box[2],
                badge_box[3],
                align="center",
                valign="center",
            ),
        }

    def _svg_open(self, product: LabelProduct) -> str:
        title = escape(f"TetravaLabs {product.product_name} pharmaceutical label")
        size = self.layout.canvas_size
        return (
            f'<svg xmlns="{SVG_NS}" width="{size}" height="{size}" viewBox="0 0 {size} {size}" '
            f'role="img" aria-labelledby="label_title label_description">\n'
            f"  <title id=\"label_title\">{title}</title>\n"
            '  <desc id="label_description">Vector pharmaceutical label with editable product name, '
            "CAS number, and concentration text fields.</desc>"
        )


def default_paths(project_root: Path | None = None) -> LabelPaths:
    root = project_root or Path(__file__).resolve().parents[1]
    assets_dir = root / "assets"
    return LabelPaths(
        project_root=root,
        assets_dir=assets_dir,
        fonts_dir=assets_dir / "fonts",
        output_dir=root / "output",
    )


def build_label_svg(product: LabelProduct, paths: LabelPaths | None = None) -> str:
    _ = paths
    return PharmaceuticalLabelRenderer().render(product)


def normalize_product(product: LabelProduct) -> LabelProduct:
    return LabelProduct(
        product_name=" ".join(product.product_name.strip().split()),
        cas_number=" ".join(product.cas_number.strip().split()),
        concentration=" ".join(product.concentration.strip().split()).upper(),
    )


def load_products(csv_path: Path) -> list[LabelProduct]:
    with csv_path.open(newline="", encoding="utf-8") as handle:
        reader = csv.DictReader(handle)
        products = [
            LabelProduct(
                product_name=row["product_name"],
                cas_number=row["cas_number"],
                concentration=row["concentration"],
            )
            for row in reader
        ]
    if not products:
        raise ValueError(f"No products found in {csv_path}")
    return products


def slugify_product(product: LabelProduct) -> str:
    parts = [product.product_name.strip()]
    concentration = product.concentration.strip()
    if concentration and concentration.lower() not in product.product_name.lower():
        parts.append(concentration)
    stem = "-".join(parts)
    stem = re.sub(r'[<>:"/\\|?*]', "-", stem)
    return stem or "label"


__all__ = [
    "CANVAS_SIZE",
    "LabelPaths",
    "LabelProduct",
    "LabelLayout",
    "PharmaceuticalLabelRenderer",
    "build_label_svg",
    "default_paths",
    "load_products",
    "normalize_product",
    "slugify_product",
]
