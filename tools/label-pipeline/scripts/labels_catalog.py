"""Load allowed label export filenames from labels-batch.csv."""

from __future__ import annotations

import csv
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_CSV = ROOT / "data" / "labels-batch.csv"


def load_export_filenames(csv_path: Path = DEFAULT_CSV) -> list[str]:
    if not csv_path.is_file():
        raise FileNotFoundError(f"Missing product list: {csv_path}")
    names: list[str] = []
    with csv_path.open(newline="", encoding="utf-8") as handle:
        for row in csv.DictReader(handle):
            name = (row.get("export_filename") or "").strip()
            if name:
                names.append(name)
    return names


def export_filename_set(csv_path: Path = DEFAULT_CSV) -> set[str]:
    return {name.lower() for name in load_export_filenames(csv_path)}
