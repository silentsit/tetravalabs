"""Font management: bundled font loading and self-contained @font-face embedding.

Two independent concerns are handled here:

1. PNG export via CairoSVG uses the platform font backend (GDI on Windows,
   fontconfig elsewhere) and ignores SVG ``@font-face``. ``load_bundled_fonts``
   makes the bundled Montserrat discoverable to that backend for the current
   process only, without a permanent system install.

2. The SVG master must render correctly in browsers, Illustrator and Inkscape
   without Montserrat installed. ``font_face_css`` embeds a subset woff2 as a
   base64 ``@font-face`` so the document is self-contained while text stays live.
"""

from __future__ import annotations

import base64
import functools
import string
import sys
from io import BytesIO
from pathlib import Path


FONT_FAMILY_NAME = "Montserrat"
FONT_FILE_NAME = "Montserrat-Variable.ttf"

# Glyphs any catalog label can realistically use (names, CAS numbers, dosages).
_SUBSET_CHARS = (
    string.ascii_letters
    + string.digits
    + " -_.,:;/()[]+%>°µ±#&"
)


def _fonts_dir() -> Path:
    return Path(__file__).resolve().parents[1] / "assets" / "fonts"


def font_path() -> Path:
    return _fonts_dir() / FONT_FILE_NAME


@functools.lru_cache(maxsize=1)
def load_bundled_fonts() -> bool:
    """Register the bundled font with the OS font backend for this process.

    Returns True when the font was registered (or is already available). The
    call is cached so repeated renders register only once.
    """

    path = font_path()
    if not path.exists():
        return False

    if sys.platform == "win32":
        return _load_windows_private_font(path)
    return _load_fontconfig(path)


def _load_windows_private_font(path: Path) -> bool:
    import ctypes

    fr_private = 0x10
    added = ctypes.windll.gdi32.AddFontResourceExW(str(path), fr_private, 0)
    return bool(added)


def _load_fontconfig(path: Path) -> bool:
    """Best-effort registration for fontconfig-based backends (Linux/macOS)."""

    import os

    conf_dir = _fonts_dir().parent / "fontconfig"
    conf_dir.mkdir(parents=True, exist_ok=True)
    conf_file = conf_dir / "fonts.conf"
    conf_file.write_text(
        "<?xml version=\"1.0\"?>\n"
        "<!DOCTYPE fontconfig SYSTEM \"fonts.dtd\">\n"
        "<fontconfig>\n"
        f"  <dir>{path.parent.as_posix()}</dir>\n"
        f"  <cachedir>{(conf_dir / 'cache').as_posix()}</cachedir>\n"
        "</fontconfig>\n",
        encoding="utf-8",
    )
    os.environ.setdefault("FONTCONFIG_FILE", str(conf_file))
    return True


@functools.lru_cache(maxsize=1)
def _subset_woff2_base64() -> str | None:
    """Return a base64 woff2 subset of the bundled font, or None if unavailable."""

    path = font_path()
    if not path.exists():
        return None

    try:
        from fontTools import subset
        from fontTools.ttLib import TTFont
    except ImportError:
        return None

    options = subset.Options()
    options.flavor = "woff2"
    options.desubroutinize = False
    options.layout_features = ["*"]
    options.name_IDs = ["*"]
    options.notdef_outline = True

    font = TTFont(str(path))
    subsetter = subset.Subsetter(options=options)
    subsetter.populate(text=_SUBSET_CHARS)
    subsetter.subset(font)

    buffer = BytesIO()
    font.save(buffer)
    return base64.b64encode(buffer.getvalue()).decode("ascii")


@functools.lru_cache(maxsize=1)
def font_face_css() -> str:
    """Return an ``@font-face`` block embedding the subset font, or "" if missing.

    The embed keeps the SVG self-contained for browsers and vector editors while
    leaving every ``<text>`` element live and editable.
    """

    encoded = _subset_woff2_base64()
    if not encoded:
        return ""

    return (
        f"    @font-face {{\n"
        f"      font-family: '{FONT_FAMILY_NAME}';\n"
        f"      font-style: normal;\n"
        f"      font-weight: 100 900;\n"
        f"      src: url('data:font/woff2;base64,{encoded}') format('woff2');\n"
        f"    }}\n"
    )
