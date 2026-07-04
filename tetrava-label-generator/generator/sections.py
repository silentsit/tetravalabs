"""Individual SVG section renderers."""

from __future__ import annotations

from html import escape

from generator.geometry import Point, points_attr, regular_polygon
from generator.layout import LabelLayout
from generator.molecule import build_molecule_graphic
from generator.typography import FONT_FAMILY, TextFit, TextPlacement, fit_attrs, placement_attrs


def render_styles() -> str:
    return f"""  <style>
    .brand {{ font-family: {FONT_FAMILY}; font-weight: 800; }}
    .heavy {{ font-family: {FONT_FAMILY}; font-weight: 900; }}
    .medium {{ font-family: {FONT_FAMILY}; font-weight: 700; }}
    .regular {{ font-family: {FONT_FAMILY}; font-weight: 500; }}
    .badge-dose {{
      text-anchor: middle;
      dominant-baseline: middle;
      alignment-baseline: middle;
    }}
  </style>"""


def render_paper_background(layout: LabelLayout) -> str:
    size = layout.canvas_size
    return f"""  <g id="paper_background">
    <rect x="0" y="0" width="{size}" height="{size}" fill="#f7f7f7"/>
    <rect x="0" y="0" width="{size}" height="{size}" fill="url(#background_gradient)" filter="url(#paper_texture)"/>
    <rect x="1" y="1" width="{size - 2}" height="{size - 2}" fill="none" stroke="#d1d1d1" stroke-width="2"/>
    <circle cx="150" cy="820" r="250" fill="#ffffff" opacity="0.16"/>
    <circle cx="870" cy="190" r="205" fill="#e8f4fb" opacity="0.34"/>
  </g>"""


def render_brand_header(layout: LabelLayout) -> str:
    x, y = layout.logo_origin
    center = Point(x + 52, y + 52)
    outer = regular_polygon(center, 54, 6, -90)
    inner = regular_polygon(center, 30, 6, -90)
    return f"""  <g id="brand_header">
    <g id="tetrava_logo" filter="url(#tight_shadow)">
      <polygon points="{points_attr(outer)}" fill="none" stroke="url(#brand_gradient)" stroke-width="9" stroke-linejoin="round"/>
      <polygon points="{points_attr(inner)}" fill="url(#logo_inner_gradient)" stroke="#1f7ea8" stroke-width="2"/>
      <polygon points="{points_attr(regular_polygon(center, 18, 6, -90))}" fill="#ffffff" opacity="0.18"/>
      <path d="M {center.x - 16:.1f} {center.y - 24:.1f} Q {center.x:.1f} {center.y - 30:.1f} {center.x + 16:.1f} {center.y - 24:.1f}" fill="none" stroke="#ffffff" stroke-width="3" opacity="0.35" stroke-linecap="round"/>
    </g>
    <text x="{x + 133}" y="{y + 82}" class="brand" font-size="86" letter-spacing="-3">
      <tspan fill="#050505">Tetrava</tspan><tspan fill="#4a90e2">Labs</tspan>
    </text>
  </g>"""


def render_product_title(product_name: str, placement: TextPlacement) -> str:
    return f"""  <g id="product_title">
    <text id="product_name" class="heavy" font-size="{placement.fit.font_size:.0f}" {placement_attrs(placement)}
      fill="url(#blue_text_gradient)" stroke="#002845" stroke-width="2.2" paint-order="stroke fill" filter="url(#product_shadow)">{escape(product_name)}</text>
  </g>"""


def render_cas_number(cas_number: str, placement: TextPlacement) -> str:
    return f"""  <g id="cas_block">
    <text id="cas_number" class="regular" font-size="{placement.fit.font_size:.0f}" {placement_attrs(placement)}
      fill="#1a365d" letter-spacing="1.2">{escape(cas_number)}</text>
  </g>"""


def render_dosage_badge(layout: LabelLayout, fit: TextFit, placement: TextPlacement) -> str:
    x, y, width, height = layout.badge_box
    center_x = x + (width / 2)
    center_y = y + (height / 2)
    fit_markup = fit_attrs(fit)
    fit_attr_str = f" {fit_markup}" if fit_markup else ""
    return f"""  <g id="dosage_badge" filter="url(#soft_shadow)">
    <rect x="{x}" y="{y}" width="{width}" height="{height}" rx="22" fill="url(#badge_gradient)" stroke="#03284d" stroke-width="3.5"/>
    <rect x="{x + 8}" y="{y + 8}" width="{width - 16}" height="{height * 0.34:.1f}" rx="16" fill="url(#badge_gloss)"/>
    <rect x="{x + 5}" y="{y + 5}" width="{width - 10}" height="{height - 10}" rx="18" fill="none" stroke="#2f95cf" stroke-width="1.2" opacity="0.45"/>
    <text id="concentration" class="heavy badge-dose" font-size="{fit.font_size:.0f}" x="{center_x:.1f}" y="{center_y:.1f}" text-anchor="middle" dominant-baseline="middle" alignment-baseline="middle"{fit_attr_str}
      fill="#bdc3c7" filter="url(#badge_text_inset)" letter-spacing="-1">{escape(fit.text)}</text>
  </g>"""


def render_purity_block(layout: LabelLayout) -> str:
    _, badge_y, _, badge_h = layout.badge_box
    separator_x = layout.purity_box[0]
    text_x = separator_x + 44
    center_y = badge_y + (badge_h / 2)
    return f"""  <g id="purity_block">
    <line x1="{separator_x}" y1="{badge_y + 8}" x2="{separator_x}" y2="{badge_y + badge_h - 8}" stroke="#b0b0b0" stroke-width="2.5"/>
    <text x="{text_x}" y="{center_y - 12}" class="heavy" font-size="43" fill="#333333">PURITY &gt;99%</text>
    <text x="{text_x}" y="{center_y + 34}" class="regular" font-size="35" fill="#7f8c8d">LAB VERIFIED</text>
  </g>"""


def render_footer(layout: LabelLayout) -> str:
    x, y, _, _ = layout.footer_box
    rule_y = y - 18
    return f"""  <g id="footer">
    <line x1="{layout.margin}" y1="{rule_y}" x2="{layout.canvas_size - layout.margin}" y2="{rule_y}" stroke="#d5d5d5" stroke-width="2"/>
    <g id="flask_icon" transform="translate({x} {y})" fill="none" stroke="#343434" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M24 0 H58"/>
      <path d="M33 0 V31 L6 88 C1 98 8 108 20 108 H62 C74 108 81 98 76 88 L49 31 V0"/>
      <path d="M22 78 C31 72 42 85 54 77 C60 73 66 74 72 78"/>
      <circle cx="34" cy="86" r="3.5" fill="#343434" stroke="none"/>
      <circle cx="51" cy="92" r="3.5" fill="#343434" stroke="none"/>
      <circle cx="45" cy="72" r="3.5" fill="#343434" stroke="none"/>
    </g>
    <text x="{x + 84}" y="{y + 30}" class="heavy" font-size="37" fill="#333333" letter-spacing="1.2">RESEARCH PURPOSES ONLY</text>
    <text x="{x + 84}" y="{y + 76}" class="regular" font-size="37" fill="#333333">NOT FOR HUMAN USE</text>
  </g>"""


def render_molecule(layout: LabelLayout) -> str:
    clip_x, clip_y, clip_w, clip_h = layout.molecule_clip
    graphic = build_molecule_graphic()
    bond_lines = "\n".join(
        f'      <line x1="{graphic.nodes[start].point.x:.1f}" y1="{graphic.nodes[start].point.y:.1f}" '
        f'x2="{graphic.nodes[end].point.x:.1f}" y2="{graphic.nodes[end].point.y:.1f}"/>'
        for start, end in graphic.bonds
    )
    node_lines: list[str] = []
    for node in graphic.nodes:
        node_lines.append(
            f'      <circle cx="{node.point.x:.1f}" cy="{node.point.y:.1f}" r="{node.radius:.1f}" '
            f'fill="{node.fill}" stroke="#07345f" stroke-width="2"/>'
        )
        if node.stippled:
            node_lines.append(
                f'      <circle cx="{node.point.x:.1f}" cy="{node.point.y:.1f}" r="{node.radius * 0.72:.1f}" '
                f'fill="url(#molecule_stipple)" opacity="0.55"/>'
            )
    return f"""  <clipPath id="molecule_clip">
    <rect x="{clip_x}" y="{clip_y}" width="{clip_w}" height="{clip_h}"/>
  </clipPath>
  <g id="molecule_graphic" filter="url(#molecule_shadow)">
    <g clip-path="url(#molecule_clip)">
      <g id="molecule_bonds" stroke="#1a6394" stroke-width="5.5" stroke-linecap="round" opacity="0.95">
{bond_lines}
      </g>
      <g id="molecule_nodes">
{chr(10).join(node_lines)}
      </g>
    </g>
  </g>"""
