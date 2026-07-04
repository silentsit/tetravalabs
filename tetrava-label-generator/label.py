"""Public label API entry point."""

from generator.label import (
    CANVAS_SIZE,
    LabelPaths,
    LabelProduct,
    PharmaceuticalLabelRenderer,
    build_label_svg,
    default_paths,
    load_products,
    normalize_product,
    slugify_product,
)
from generator.layout import LabelLayout

__all__ = [
    "CANVAS_SIZE",
    "LabelLayout",
    "LabelPaths",
    "LabelProduct",
    "PharmaceuticalLabelRenderer",
    "build_label_svg",
    "default_paths",
    "load_products",
    "normalize_product",
    "slugify_product",
]
