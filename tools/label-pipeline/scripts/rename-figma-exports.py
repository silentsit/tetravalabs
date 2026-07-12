"""Rename Figma bulk exports to labels-batch.csv export_filename values."""

from __future__ import annotations

import csv
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CSV_PATH = ROOT / "data" / "labels-batch.csv"
FIGMA_DIR = ROOT / "figma_labels"

EXPORT_PATTERN = re.compile(
    r"^(main|flower|capsule)\s[-\u2013\u2014]\s*(.+?)\s[-\u2013\u2014]\s*(.+)\.png$",
    re.IGNORECASE,
)


def main() -> int:
    rows = list(csv.DictReader(CSV_PATH.open(encoding="utf-8")))
    lookup = {
        (row["#product_name"].strip().lower(), row["#concentration"].strip().lower()): row[
            "export_filename"
        ].strip()
        for row in rows
        if row.get("export_filename")
    }

    renamed = skipped = missing = 0
    for path in sorted(FIGMA_DIR.glob("*.png")):
        if path.name.startswith("#"):
            continue

        match = EXPORT_PATTERN.match(path.name)
        if not match:
            print(f"skip (unknown name): {path.name}")
            skipped += 1
            continue

        product = match.group(2).strip()
        dose = match.group(3).strip()
        export_name = lookup.get((product.lower(), dose.lower()))
        if not export_name:
            print(f"skip (not in CSV): {path.name}")
            skipped += 1
            continue

        target = FIGMA_DIR / f"{export_name}.png"
        if target.exists() and target.resolve() != path.resolve():
            print(f"skip (target exists): {path.name} -> {target.name}")
            skipped += 1
            continue

        if path.name != target.name:
            path.rename(target)
            print(f"renamed: {path.name} -> {target.name}")
            renamed += 1

    expected = {row["export_filename"].strip() + ".png" for row in rows if row.get("export_filename")}
    have = {p.name for p in FIGMA_DIR.glob("*.png") if not p.name.startswith("#")}
    for name in sorted(expected - have):
        print(f"missing: {name}")
        missing += 1

    print(f"Done: {renamed} renamed, {skipped} skipped, {missing} missing from CSV")
    return 0 if not missing else 1


if __name__ == "__main__":
    raise SystemExit(main())
