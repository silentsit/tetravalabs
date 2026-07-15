"""Copy transparent product mockups into hero folder, preserving alpha."""

from __future__ import annotations

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = ROOT / "Product Mockups"
OUT_DIR = ROOT / "apps" / "storefront" / "public" / "products" / "v2" / "hero"

MAPPING = {
    "Selank Nasal Spray 10mg__front_naked.png": "selank-nasal-spray-10mg.png",
    "BPC-157 (Capsules) 500mcg__front-naked.png": "bpc-157-capsules.png",
    "Retatrutide 20mg__front-naked.png": "retatrutide-20mg.png",
}


def save_rgba(src: Path, dest: Path) -> None:
    image = Image.open(src).convert("RGBA")
    # Re-save to guarantee RGBA PNG with alpha (no palette flattening).
    image.save(dest, format="PNG", optimize=True)
    corner = image.getpixel((0, 0))
    transparent = sum(1 for px in image.get_flattened_data() if px[3] == 0)
    total = image.size[0] * image.size[1]
    print(
        f"{dest.name}: {image.size[0]}x{image.size[1]} RGBA, "
        f"corner={corner}, transparent={transparent}/{total} ({100 * transparent / total:.1f}%)"
    )


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for src_name, dest_name in MAPPING.items():
        src = SOURCE_DIR / src_name
        if not src.exists():
            raise FileNotFoundError(f"Missing source image: {src}")
        save_rgba(src, OUT_DIR / dest_name)
    print("Done.")


if __name__ == "__main__":
    main()
