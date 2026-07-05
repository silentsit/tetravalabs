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

    # Default (short-name) molecule — matches the original BPC-157 layout.
    molecule_clip: tuple[int, int, int, int] = (600, 0, 424, 920)
    molecule_center: tuple[int, int] = (900, 470)
    molecule_radius: float = 54
    molecule_nodes: int = 18

    # Long-name regime: widen the title and shift/shrink the molecule to fit.
    product_max_width_wide: int = 732
    molecule_clip_compact: tuple[int, int, int, int] = (792, 0, 232, 920)
    molecule_center_compact: tuple[int, int] = (930, 470)
    molecule_radius_compact: float = 38
    molecule_nodes_compact: int = 14

    # Very-long names: drop the molecule and use the full label width.
    product_max_width_full: int = 908
    product_min_font_full: int = 42
