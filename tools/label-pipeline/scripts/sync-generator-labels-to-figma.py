"""Copy flat label PNGs into figma_labels/ — one file per labels-batch.csv row.

Replaces the folder contents so only export_filename PNGs remain (no duplicates).
"""

from __future__ import annotations

import argparse
import csv
import re
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REPO = ROOT.parents[1]
CSV_PATH = ROOT / "data" / "labels-batch.csv"
GENERATOR = REPO / "tetrava-label-generator" / "output"
OUT = ROOT / "figma_labels"


def norm(s: str) -> str:
    s = s.lower().strip()
    return re.sub(r"[^a-z0-9]+", "", s)


def main() -> int:
    parser = argparse.ArgumentParser(description="Sync figma_labels/ from generator output using labels-batch.csv")
    parser.add_argument("--csv", type=Path, default=CSV_PATH)
    parser.add_argument("--generator", type=Path, default=GENERATOR)
    parser.add_argument("--output", type=Path, default=OUT)
    args = parser.parse_args()

    if not args.generator.is_dir():
        print(f"Missing generator output: {args.generator}")
        return 1

    pngs = {norm(p.stem): p for p in args.generator.glob("*.png")}
    args.output.mkdir(parents=True, exist_ok=True)

    # Remove anything not named exactly like a CSV export_filename.
    allowed_names: set[str] = set()
    with args.csv.open(newline="", encoding="utf-8") as handle:
        for row in csv.DictReader(handle):
            name = (row.get("export_filename") or "").strip()
            if name:
                allowed_names.add(f"{name}.png")

    removed = 0
    for path in args.output.glob("*"):
        if path.is_file() and path.name not in allowed_names:
            path.unlink()
            removed += 1

    linked = missing = 0
    with args.csv.open(newline="", encoding="utf-8") as handle:
        for row in csv.DictReader(handle):
            export_name = (row.get("export_filename") or "").strip()
            if not export_name:
                continue
            dest = args.output / f"{export_name}.png"
            if dest.is_file():
                linked += 1
                continue
            key = norm(export_name)
            src = pngs.get(key)
            if not src:
                product = (row.get("#product_name") or "").strip()
                conc = (row.get("#concentration") or "").strip()
                alt = norm(f"{product}{conc}") if conc and conc.upper() != "N/A" else norm(product)
                src = pngs.get(alt)
            if not src:
                missing += 1
                continue
            shutil.copy2(src, dest)
            linked += 1

    print(f"figma_labels/: {linked} SKU file(s), {missing} missing PNG, {removed} stray file(s) removed")
    return 0 if linked else 1


if __name__ == "__main__":
    raise SystemExit(main())
