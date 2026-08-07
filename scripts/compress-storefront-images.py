"""Compress storefront public images to WebP. Keeps max side, quality 82."""
from __future__ import annotations

import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "apps" / "storefront" / "public"
QUALITY = 82
MAX_SIDE = 1600


def compress_to_webp(src: Path, dest: Path | None = None, max_side: int = MAX_SIDE) -> tuple[int, int]:
    dest = dest or src.with_suffix(".webp")
    before = src.stat().st_size
    with Image.open(src) as im:
        if im.mode in ("P", "RGBA", "LA"):
            im = im.convert("RGBA")
        elif im.mode != "RGB":
            im = im.convert("RGB")

        w, h = im.size
        scale = min(1.0, max_side / max(w, h))
        if scale < 1.0:
            im = im.resize((int(w * scale), int(h * scale)), Image.Resampling.LANCZOS)

        dest.parent.mkdir(parents=True, exist_ok=True)
        save_kwargs = {"quality": QUALITY, "method": 6}
        if im.mode == "RGBA":
            im.save(dest, "WEBP", **save_kwargs)
        else:
            im.save(dest, "WEBP", **save_kwargs)

    after = dest.stat().st_size
    return before, after


def batch(paths: list[Path], delete_src: bool = True) -> None:
    total_before = 0
    total_after = 0
    n = 0
    for src in paths:
        if not src.is_file():
            continue
        try:
            before, after = compress_to_webp(src)
        except Exception as exc:  # noqa: BLE001
            print(f"FAIL {src}: {exc}")
            continue
        total_before += before
        total_after += after
        n += 1
        if delete_src and src.suffix.lower() != ".webp":
            src.unlink(missing_ok=True)
        if n % 25 == 0:
            print(f"… {n} files")
    print(
        f"Done {n} files: {total_before/1e6:.1f} MB -> {total_after/1e6:.1f} MB "
        f"({(1 - total_after / total_before) * 100:.0f}% smaller)"
        if total_before
        else "Nothing to do"
    )


def main() -> None:
    mode = sys.argv[1] if len(sys.argv) > 1 else "overview"

    if mode == "overview":
        paths = sorted((PUBLIC / "images" / "overview").glob("*.png"))
        print(f"Overview PNGs: {len(paths)}")
        batch(paths, delete_src=True)
    elif mode == "products-heavy":
        products = PUBLIC / "products"
        paths = [
            p
            for p in products.rglob("*.png")
            if p.is_file() and p.stat().st_size >= 400_000
        ]
        print(f"Heavy product PNGs (>=400KB): {len(paths)}")
        batch(paths, delete_src=True)
    elif mode == "brand-unused":
        names = ["8_1.png", "4_1.png", "6_1.png", "3_1.png", "8.png", "4.png"]
        archive = ROOT / "apps" / "storefront" / "_image-archive" / "brand-unused"
        archive.mkdir(parents=True, exist_ok=True)
        for name in names:
            src = PUBLIC / "brand" / name
            if src.is_file():
                dest = archive / name
                size_kb = src.stat().st_size // 1024
                dest.write_bytes(src.read_bytes())
                src.unlink()
                print(f"Archived {name} ({size_kb} KB)")
    else:
        raise SystemExit(f"Unknown mode: {mode}")


if __name__ == "__main__":
    main()
