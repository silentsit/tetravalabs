"""Command-line label generator."""

from __future__ import annotations

from pathlib import Path

import typer

from generator.render import configure_cairo_runtime, render_products_csv

app = typer.Typer(add_completion=False, help="Generate editable SVG labels and CairoSVG PNG exports.")


@app.callback(invoke_without_command=True)
def main(
    ctx: typer.Context,
    csv_path: Path = typer.Option(Path("products.csv"), "--csv", help="Product CSV path."),
    output_dir: Path = typer.Option(Path("output"), "--output", help="Output directory."),
) -> None:
    """Read products.csv and generate one SVG + PNG per row."""

    if ctx.invoked_subcommand is not None:
        return

    configure_cairo_runtime()
    rendered = render_products_csv(csv_path, output_dir)
    for svg_path, png_path in rendered:
        typer.echo(f"Wrote {svg_path} and {png_path}")


if __name__ == "__main__":
    app()


__all__ = ["app", "main"]
