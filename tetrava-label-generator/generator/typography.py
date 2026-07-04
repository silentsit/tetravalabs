"""Typography helpers for editable SVG text."""

from __future__ import annotations

from dataclasses import dataclass


PRIMARY_FONT_STACK = ("Montserrat", "Archivo Black", "Arial", "sans-serif")
FONT_FAMILY = ", ".join(PRIMARY_FONT_STACK)


@dataclass(frozen=True)
class TextFit:
    """Calculated font size for a single editable SVG text field."""

    text: str
    font_size: float
    max_width: float
    estimated_width: float
    text_length: float | None = None


@dataclass(frozen=True)
class TextPlacement:
    """Positioned single-line text with stable vertical alignment."""

    fit: TextFit
    x: float
    y: float
    text_anchor: str = "start"
    dominant_baseline: str = "alphabetic"


def fit_single_line_text(
    text: str,
    max_width: float,
    initial_font_size: float,
    min_font_size: float,
) -> TextFit:
    """Shrink font size until the text fits on one line."""

    normalized = " ".join(text.strip().split())
    font_size = initial_font_size

    while font_size > min_font_size:
        width = estimate_text_width(normalized, font_size)
        if width <= max_width:
            return TextFit(normalized, font_size, max_width, width)
        font_size -= 1

    font_size = min_font_size
    width = estimate_text_width(normalized, font_size)
    text_length = max_width if width > max_width else None
    return TextFit(normalized, font_size, max_width, width, text_length)


def estimate_text_width(text: str, font_size: float) -> float:
    """Estimate display width for heavy geometric sans text."""

    units = 0.0
    for char in text:
        if char == " ":
            units += 0.36
        elif char in "ilI.,'":
            units += 0.34
        elif char in "MW@":
            units += 0.95
        elif char.isdigit():
            units += 0.62
        elif char.isupper():
            units += 0.72
        elif char in "-_/":
            units += 0.38
        else:
            units += 0.58
    return units * font_size


def vertical_center_y(box_top: float, box_height: float) -> float:
    """Return the y coordinate for vertically centered single-line text."""

    return box_top + (box_height / 2)


def left_baseline_y(
    box_top: float,
    box_height: float,
    font_size: float,
    offset_ratio: float = 0.72,
) -> float:
    """Return a stable alphabetic baseline inside a text block."""

    return box_top + (box_height * offset_ratio) + (font_size * 0.08)


def placement_for_box(
    fit: TextFit,
    box_x: float,
    box_top: float,
    box_width: float,
    box_height: float,
    *,
    align: str = "left",
    valign: str = "alphabetic",
) -> TextPlacement:
    """Create a single-line text placement that stays inside a box."""

    if align == "center":
        x = box_x + (box_width / 2)
        text_anchor = "middle"
    else:
        x = box_x
        text_anchor = "start"

    if valign == "center":
        y = vertical_center_y(box_top, box_height)
        dominant_baseline = "central"
    else:
        y = left_baseline_y(box_top, box_height, fit.font_size)
        dominant_baseline = "alphabetic"

    return TextPlacement(
        fit=fit,
        x=x,
        y=y,
        text_anchor=text_anchor,
        dominant_baseline=dominant_baseline,
    )


def fit_attrs(fit: TextFit) -> str:
    """Return SVG attributes that prevent overflow at minimum font size."""

    if fit.text_length is None:
        return ""
    return f'textLength="{fit.text_length:.0f}" lengthAdjust="spacingAndGlyphs"'


def placement_attrs(placement: TextPlacement) -> str:
    """Return SVG positioning attributes for a text placement."""

    attrs = [
        f'x="{placement.x:.1f}"',
        f'y="{placement.y:.1f}"',
        f'text-anchor="{placement.text_anchor}"',
        f'dominant-baseline="{placement.dominant_baseline}"',
    ]
    fit_markup = fit_attrs(placement.fit)
    if fit_markup:
        attrs.append(fit_markup)
    return " ".join(attrs)
