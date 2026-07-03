"""Inline ui.html into code.js for Figma dev plugin."""
import json
from pathlib import Path

ROOT = Path(__file__).parent
html = (ROOT / "ui.html").read_text(encoding="utf-8")
main = (ROOT / "code-main.js").read_text(encoding="utf-8")

out = (
    "// Auto-built — run: python build-plugin.py\n"
    f"const PLUGIN_UI = {json.dumps(html)};\n"
    "figma.showUI(PLUGIN_UI, { width: 340, height: 520, themeColors: true });\n\n"
    + main
)

(ROOT / "code.js").write_text(out, encoding="utf-8")
print("Built", ROOT / "code.js")
