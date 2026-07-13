"""Copy Blender front/side shots into storefront public/products/v2/.

Reads shot-handle-map.json (from map-shots-to-handles.py).

For each matched handle:
  - front_shot → public/products/v2/{target_stem}          (primary card/PDP image)
  - side_shot  → public/products/v2/{stem}-side.png        (gallery second image)

Also writes apps/storefront/src/lib/product-gallery-images.generated.json
  handle → [frontUrl, sideUrl?] for PDP gallery.
"""

from __future__ import annotations

import json
import shutil
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REPO = ROOT.parents[1]
MAP_PATH = ROOT / "data" / "shot-handle-map.json"
SHOTS_DIR = ROOT / "final_product_shots_blender"
V2_DIR = REPO / "apps" / "storefront" / "public" / "products" / "v2"
GALLERY_MAP = REPO / "apps" / "storefront" / "src" / "lib" / "product-gallery-images.generated.json"
V2_URL = "/products/v2"


def side_filename(target_stem: str) -> str:
    return f"{Path(target_stem).stem}-side.png"


def copy_with_retry(src: Path, dest: Path, attempts: int = 5) -> None:
    last_err: Exception | None = None
    for i in range(attempts):
        try:
            shutil.copy2(src, dest)
            return
        except OSError as exc:
            last_err = exc
            time.sleep(0.35 * (i + 1))
    raise last_err  # type: ignore[misc]


def main() -> int:
    mapping = json.loads(MAP_PATH.read_text(encoding="utf-8"))
    V2_DIR.mkdir(parents=True, exist_ok=True)

    gallery: dict[str, list[str]] = {}
    copied_front = copied_side = missing = 0

    for handle, row in sorted(mapping.items()):
        front_name = row.get("front_shot")
        side_name_src = row.get("side_shot")
        target_stem = row.get("target_stem")
        if not front_name or not target_stem:
            print(f"skip {handle}: incomplete mapping")
            missing += 1
            continue

        front_src = SHOTS_DIR / front_name
        if not front_src.is_file():
            print(f"missing front: {front_name} ({handle})")
            missing += 1
            continue

        front_dest = V2_DIR / target_stem
        copy_with_retry(front_src, front_dest)
        copied_front += 1
        urls = [f"{V2_URL}/{target_stem}"]

        if side_name_src:
            side_src = SHOTS_DIR / side_name_src
            if side_src.is_file():
                side_dest_name = side_filename(target_stem)
                copy_with_retry(side_src, V2_DIR / side_dest_name)
                copied_side += 1
                urls.append(f"{V2_URL}/{side_dest_name}")
            else:
                print(f"missing side: {side_name_src} ({handle})")
                missing += 1

        gallery[handle] = urls

    GALLERY_MAP.write_text(json.dumps(gallery, indent=2) + "\n", encoding="utf-8")
    print(f"Done: {copied_front} front, {copied_side} side -> {V2_DIR}")
    print(f"Gallery map: {len(gallery)} handles -> {GALLERY_MAP}")
    print(f"Missing: {missing}")
    return 0 if missing == 0 else 1


if __name__ == "__main__":
    raise SystemExit(main())
