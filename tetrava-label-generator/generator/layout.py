"""Layout constants for the pharmaceutical label."""

from __future__ import annotations

from dataclasses import dataclass


CANVAS_SIZE = 1024
MARGIN = 58


@dataclass(frozen=True)
class LabelLayout:
    """Canvas regions and typography limits."""

    canvas_size: int = CANVAS_SIZE
    margin: int = MARGIN

    logo_origin: tuple[int, int] = (MARGIN, 48)
    product_box: tuple[int, int, int, int] = (MARGIN, 300, 690, 128)
    cas_box: tuple[int, int, int, int] = (MARGIN + 2, 438, 470, 68)
    badge_box: tuple[int, int, int, int] = (MARGIN, 608, 382, 142)
    purity_box: tuple[int, int, int, int] = (478, 612, 280, 138)
    footer_box: tuple[int, int, int, int] = (MARGIN, 848, 760, 120)

    product_max_width: int = 680
    cas_max_width: int = 480
    badge_text_max_width: int = 330

    molecule_clip: tuple[int, int, int, int] = (600, 0, 424, 920)
