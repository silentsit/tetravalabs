"""Route label SKUs to vial vs capsule mockups via labels-manifest.csv."""

from __future__ import annotations

import csv
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_MANIFEST = ROOT / "data" / "labels-manifest.csv"
CAPSULE_PATTERN = re.compile(r"capsules", re.IGNORECASE)


def load_manifest(path: Path = DEFAULT_MANIFEST) -> dict[str, str]:
    if not path.is_file():
        return {}
    mapping: dict[str, str] = {}
    with path.open(newline="", encoding="utf-8") as handle:
        reader = csv.DictReader(handle)
        for row in reader:
            name = (row.get("export_filename") or "").strip()
            mockup = (row.get("mockup") or "").strip().lower()
            if name and mockup:
                mapping[name.lower()] = mockup
    return mapping


def is_capsule(stem: str, manifest: dict[str, str] | None = None) -> bool:
    manifest = manifest if manifest is not None else load_manifest()
    key = stem.lower()
    mockup = manifest.get(key)
    if mockup == "capsule":
        return True
    if mockup == "vial":
        return False
    return bool(CAPSULE_PATTERN.search(stem))
