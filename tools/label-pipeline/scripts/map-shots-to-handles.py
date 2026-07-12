"""Map storefront product handles to rendered front/side shots for review.

Reads:
  - apps/storefront/src/lib/product-image-map.generated.json  (handle -> current v2 stem)
  - tools/label-pipeline/final_product_shots_blender/*.png     (available shots)

Writes:
  - tools/label-pipeline/data/shot-handle-map.json  (proposed mapping for review)
Prints a review table + any unmatched handles/shots.
"""

from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REPO = ROOT.parents[1]
GENERATED_MAP = REPO / "apps" / "storefront" / "src" / "lib" / "product-image-map.generated.json"
SHOTS_DIR = ROOT / "final_product_shots_blender"
OUT = ROOT / "data" / "shot-handle-map.json"

# Handles whose export_filename cannot be derived by normalization alone.
HANDLE_TO_EXPORT = {
    "cjc-1295-with-dac-5mg": "CJC-1295 + DAC 5mg",
    "cjc-1295-with-dac-10mg": "CJC-1295 + DAC 10mg",
    "cjc-1295-without-dac-5mg": "CJC-1295 [no DAC] 5mg",
    "cjc-1295-without-dac-10mg": "CJC-1295 [no DAC] 10mg",
    "cjc-1295-without-dac-ipamorelin-blend-10mg": "CJC-1295 [no DAC] + Ipamorelin 10mg",
    "cjc-1295-without-dac-sermorelin-ipamorelin-blend-5mg": "CJC-1295 [no DAC] + Ipamorelin + Sermorelin 5mg",
    "bpc-157-5mg-tb500-5mg-10mg": "BPC-157 + TB-500 10mg",
    "bpc-157-5mg-tb500-5mg-20mg": "BPC-157 + TB-500 20mg",
    "cu-50mg-tb500-10mg-bpc-157-10mg-kpv-10mg-80mg": "Cu + TB-500 + BPC-157 + KPV 80mg",
    "glow-bpc-157-tb500-ghk-cu-30mg": "Glow Blend 30mg",
    "glow-bpc-157-tb500-ghk-cu-85mg": "Glow Blend 85mg",
    "glow-tb500-10mg-bpc-157-10mg-ghk-cu-50mg-70mg": "Glow Blend 70mg",
    "bpc-157-capsules-100-count-500mcg": "BPC-157 (Capsules) 500mcg",
    "pinealon-capsules-100-count": "Pinealon (Capsules)",
}


def norm(s: str) -> str:
    return re.sub(r"[^a-z0-9]", "", s.lower())


def main() -> int:
    handle_map = json.loads(GENERATED_MAP.read_text(encoding="utf-8"))

    fronts = sorted(
        p for p in SHOTS_DIR.glob("*__front.png")
    )
    export_names = [p.name[: -len("__front.png")] for p in fronts]
    by_norm = {norm(name): name for name in export_names}

    rows = []
    proposed = {}
    unmatched_handles = []
    matched_exports = set()

    for handle in sorted(handle_map):
        current = handle_map[handle]
        current_stem = Path(current).name

        export = HANDLE_TO_EXPORT.get(handle)
        if export is None:
            export = by_norm.get(norm(handle))

        side_exists = export is not None and (SHOTS_DIR / f"{export}__side.png").is_file()
        front_exists = export is not None and (SHOTS_DIR / f"{export}__front.png").is_file()

        if export and front_exists:
            proposed[handle] = {
                "current": current,
                "front_shot": f"{export}__front.png",
                "side_shot": f"{export}__side.png" if side_exists else None,
                "target_stem": current_stem,
            }
            matched_exports.add(export)
            status = "OK" if side_exists else "front-only"
        else:
            unmatched_handles.append(handle)
            status = "NO SHOT (keep current)"

        rows.append((handle, current_stem, export or "-", status))

    unused_shots = sorted(set(export_names) - matched_exports)

    OUT.write_text(json.dumps(proposed, indent=2) + "\n", encoding="utf-8")

    print(f"{'HANDLE':<52} {'CURRENT FILE':<28} {'SHOT (export)':<38} STATUS")
    print("-" * 140)
    for handle, cur, export, status in rows:
        print(f"{handle:<52} {cur:<28} {export:<38} {status}")

    print(f"\nTotal handles: {len(handle_map)}")
    print(f"Matched with shots: {len(proposed)}")
    print(f"Handles with NO shot (keep current image): {len(unmatched_handles)}")
    for h in unmatched_handles:
        print(f"  - {h}")
    print(f"\nRendered shots not used by any handle: {len(unused_shots)}")
    for s in unused_shots:
        print(f"  ? {s}")
    print(f"\nWrote proposed mapping -> {OUT}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
