"""Reusable SVG gradients, shadows, and filters."""

from __future__ import annotations

from dataclasses import dataclass, field


@dataclass(frozen=True)
class GradientStop:
    offset: str
    color: str
    opacity: float | None = None

    def to_svg(self) -> str:
        if self.opacity is None:
            return f'<stop offset="{self.offset}" stop-color="{self.color}"/>'
        return (
            f'<stop offset="{self.offset}" stop-color="{self.color}" '
            f'stop-opacity="{self.opacity:.3f}"/>'
        )


@dataclass(frozen=True)
class LinearGradientDef:
    id: str
    stops: tuple[GradientStop, ...]
    x1: str = "0"
    y1: str = "0"
    x2: str = "1"
    y2: str = "1"

    def to_svg(self) -> str:
        stop_markup = "\n      ".join(stop.to_svg() for stop in self.stops)
        return (
            f'    <linearGradient id="{self.id}" x1="{self.x1}" y1="{self.y1}" '
            f'x2="{self.x2}" y2="{self.y2}">\n      {stop_markup}\n    </linearGradient>'
        )


@dataclass(frozen=True)
class RadialGradientDef:
    id: str
    stops: tuple[GradientStop, ...]
    cx: str = "50%"
    cy: str = "50%"
    r: str = "50%"

    def to_svg(self) -> str:
        stop_markup = "\n      ".join(stop.to_svg() for stop in self.stops)
        return (
            f'    <radialGradient id="{self.id}" cx="{self.cx}" cy="{self.cy}" r="{self.r}">\n'
            f"      {stop_markup}\n    </radialGradient>"
        )


@dataclass(frozen=True)
class DropShadowFilter:
    id: str
    dx: float = 0
    dy: float = 4
    std_deviation: float = 4
    color: str = "#091827"
    opacity: float = 0.22

    def to_svg(self) -> str:
        return (
            f'    <filter id="{self.id}" x="-25%" y="-25%" width="150%" height="150%">\n'
            f'      <feDropShadow dx="{self.dx}" dy="{self.dy}" stdDeviation="{self.std_deviation}" '
            f'flood-color="{self.color}" flood-opacity="{self.opacity:.2f}"/>\n'
            f"    </filter>"
        )


@dataclass(frozen=True)
class SvgFilterDef:
    id: str
    markup: str

    def to_svg(self) -> str:
        return self.markup


@dataclass
class EffectLibrary:
    """Collection of reusable vector effect definitions."""

    gradients: list[LinearGradientDef | RadialGradientDef] = field(default_factory=list)
    filters: list[DropShadowFilter | SvgFilterDef] = field(default_factory=list)
    patterns: list[str] = field(default_factory=list)

    @classmethod
    def default(cls) -> EffectLibrary:
        library = cls()
        library.gradients.extend(
            [
                LinearGradientDef(
                    "background_gradient",
                    (
                        GradientStop("0%", "#ffffff"),
                        GradientStop("45%", "#ffffff"),
                        GradientStop("100%", "#fdfdfd"),
                    ),
                    x2="0.35",
                    y2="1",
                ),
                LinearGradientDef(
                    "brand_gradient",
                    (GradientStop("0%", "#2ea8a6"), GradientStop("100%", "#4a90e2")),
                    y2="0",
                ),
                RadialGradientDef(
                    "logo_inner_gradient",
                    (
                        GradientStop("0%", "#5fd4d2"),
                        GradientStop("55%", "#2a8fc4"),
                        GradientStop("100%", "#1a5f99"),
                    ),
                    cx="32%",
                    cy="28%",
                    r="72%",
                ),
                LinearGradientDef(
                    "blue_text_gradient",
                    (
                        GradientStop("0%", "#10507a"),
                        GradientStop("42%", "#043559"),
                        GradientStop("100%", "#00152b"),
                    ),
                    x2="0",
                    y2="1",
                ),
                LinearGradientDef(
                    "badge_gradient",
                    (
                        GradientStop("0%", "#003366"),
                        GradientStop("48%", "#005bb7"),
                        GradientStop("100%", "#003f82"),
                    ),
                    y2="0",
                ),
                LinearGradientDef(
                    "badge_gloss",
                    (
                        GradientStop("0%", "#ffffff", 0.34),
                        GradientStop("100%", "#ffffff", 0.0),
                    ),
                    x2="0",
                    y2="1",
                ),
                RadialGradientDef(
                    "molecule_node_gradient",
                    (
                        GradientStop("0%", "#8ee4f8"),
                        GradientStop("38%", "#2f8fc8"),
                        GradientStop("100%", "#042b65"),
                    ),
                    cx="30%",
                    cy="26%",
                    r="72%",
                ),
                RadialGradientDef(
                    "molecule_node_alt",
                    (
                        GradientStop("0%", "#b8ecff"),
                        GradientStop("42%", "#4aa3d5"),
                        GradientStop("100%", "#0a3f78"),
                    ),
                    cx="34%",
                    cy="30%",
                    r="68%",
                ),
            ]
        )
        library.filters.extend(
            [
                SvgFilterDef(
                    "paper_texture",
                    """    <filter id="paper_texture" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
      <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" seed="17" result="noise"/>
      <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0.96  0 0 0 0 0.96  0 0 0 0 0.95  0 0 0 0.045 0" result="grain"/>
      <feBlend in="SourceGraphic" in2="grain" mode="multiply"/>
    </filter>""",
                ),
                DropShadowFilter("product_shadow", dy=5, std_deviation=5, opacity=0.18),
                DropShadowFilter("soft_shadow", dy=8, std_deviation=8, opacity=0.24),
                DropShadowFilter("tight_shadow", dy=2, std_deviation=2.5, color="#061323", opacity=0.28),
                DropShadowFilter("molecule_shadow", dy=6, std_deviation=9, opacity=0.14),
                SvgFilterDef(
                    "badge_text_inset",
                    """    <filter id="badge_text_inset" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="1.5" stdDeviation="0.6" flood-color="#ffffff" flood-opacity="0.22"/>
      <feDropShadow dx="0" dy="3" stdDeviation="1.2" flood-color="#020b18" flood-opacity="0.55"/>
    </filter>""",
                ),
            ]
        )
        library.patterns.append(
            """    <pattern id="molecule_stipple" width="6" height="6" patternUnits="userSpaceOnUse">
      <circle cx="1.5" cy="1.5" r="0.9" fill="#ffffff" opacity="0.22"/>
      <circle cx="4.5" cy="4.5" r="0.7" fill="#ffffff" opacity="0.14"/>
    </pattern>"""
        )
        return library

    def build_defs(self) -> str:
        gradient_markup = "\n".join(gradient.to_svg() for gradient in self.gradients)
        filter_markup = "\n".join(filter_def.to_svg() for filter_def in self.filters)
        pattern_markup = "\n".join(self.patterns)
        return f"  <defs>\n{gradient_markup}\n{filter_markup}\n{pattern_markup}\n  </defs>"


def build_effect_defs() -> str:
    return EffectLibrary.default().build_defs()
