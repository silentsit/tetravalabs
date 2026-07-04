"""SVG and PNG rendering entry points."""

from __future__ import annotations

import os
import sys
from pathlib import Path

from generator.label import LabelProduct, build_label_svg, default_paths, load_products, slugify_product

CANVAS_SIZE = 1024
GTK_RUNTIME_DIRS = (
    Path(r"C:\Program Files\Gtk-Runtime\bin"),
    Path(r"C:\Program Files (x86)\Gtk-Runtime\bin"),
)


def configure_cairo_runtime() -> None:
    """Ensure native Cairo libraries are discoverable on Windows."""

    if sys.platform != "win32":
        return

    for runtime_dir in GTK_RUNTIME_DIRS:
        if not runtime_dir.exists():
            continue
        runtime = str(runtime_dir)
        if runtime not in os.environ.get("PATH", ""):
            os.environ["PATH"] = runtime + os.pathsep + os.environ.get("PATH", "")
        if hasattr(os, "add_dll_directory"):
            os.add_dll_directory(runtime)
        return


def write_svg(svg_markup: str, output_path: Path) -> Path:
    """Persist SVG markup to disk."""

    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(svg_markup, encoding="utf-8")
    return output_path


def export_png(svg_path: Path, png_path: Path) -> Path:
    """Export a PNG from an SVG source using CairoSVG."""

    configure_cairo_runtime()
    import cairosvg

    png_path.parent.mkdir(parents=True, exist_ok=True)
    cairosvg.svg2png(
        url=str(svg_path),
        write_to=str(png_path),
        output_width=CANVAS_SIZE,
        output_height=CANVAS_SIZE,
    )
    return png_path


def render_product(product: LabelProduct, output_dir: Path | None = None) -> tuple[Path, Path]:
    """Render one product to SVG and PNG files."""

    paths = default_paths()
    target_dir = output_dir or paths.output_dir
    stem = slugify_product(product)
    svg_path = target_dir / f"{stem}.svg"
    png_path = target_dir / f"{stem}.png"
    write_svg(build_label_svg(product, paths), svg_path)
    export_png(svg_path, png_path)
    return svg_path, png_path


def render_products_csv(csv_path: Path, output_dir: Path | None = None) -> list[tuple[Path, Path]]:
    """Render every product listed in a CSV file."""

    return [render_product(product, output_dir) for product in load_products(csv_path)]
