"""
Export label rows from catalog.normalized.json to a CSV for generate-pharma-labels.py.

Writes:
  scripts/labels.csv              — one row per SKU (130 rows), ready for label generation
  scripts/cas-gaps-to-research.csv — unique compound names still missing a CAS number

Usage:
    python scripts/export-labels-csv.py
"""

from __future__ import annotations

import csv
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CATALOG = ROOT / "packages" / "catalog" / "output" / "catalog.normalized.json"
ENRICHMENT = ROOT / "packages" / "catalog" / "data" / "product-enrichment.json"
CAS_MAP = Path(__file__).resolve().parent / "cas-by-product-name.json"
OUT_CSV = Path(__file__).resolve().parent / "labels.csv"
GAPS_CSV = Path(__file__).resolve().parent / "cas-gaps-to-research.csv"


def split_title(title: str, strength: str) -> str:
    if strength and title.lower().endswith(strength.lower()):
        return title[: -len(strength)].strip()
    cleaned = re.sub(r"\s+\d+(\.\d+)?\s*(mg|mcg|g|ml|iu|units?)\b", "", title, flags=re.I)
    return cleaned.strip() or title


def enrichment_lookup(enrichment: dict[str, dict], name: str) -> str | None:
    if name in enrichment and enrichment[name].get("cas_number"):
        return enrichment[name]["cas_number"]
    lower = name.lower()
    for key, value in enrichment.items():
        if key.lower() == lower and value.get("cas_number"):
            return value["cas_number"]
    return None


def load_cas_map() -> dict[str, str]:
    if not CAS_MAP.is_file():
        return {}
    data = json.loads(CAS_MAP.read_text(encoding="utf-8"))
    return {key: value for key, value in data.items() if not key.startswith("_")}


def main() -> None:
    catalog = json.loads(CATALOG.read_text(encoding="utf-8"))
    enrichment = json.loads(ENRICHMENT.read_text(encoding="utf-8"))
    cas_map = load_cas_map()

    rows: list[dict[str, str]] = []
    gaps: dict[str, list[str]] = {}

    for product in catalog["products"]:
        strength = product["metadata"].get("strength") or ""
        product_name = split_title(product["title"], strength)
        cas = (
            product["metadata"].get("cas_number")
            or cas_map.get(product_name)
            or enrichment_lookup(enrichment, product_name)
            or ""
        )

        row = {
            "sku": product["id"],
            "product_name": product_name,
            "cas_number": cas,
            "dosage": strength,
        }
        rows.append(row)

        if not cas:
            gaps.setdefault(product_name, []).append(product["id"])

    rows.sort(key=lambda r: r["sku"])

    OUT_CSV.parent.mkdir(parents=True, exist_ok=True)
    with OUT_CSV.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(
            handle,
            fieldnames=["sku", "product_name", "cas_number", "dosage"],
        )
        writer.writeheader()
        writer.writerows(rows)

    with GAPS_CSV.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=["product_name", "sku_count", "example_skus"])
        writer.writeheader()
        for name in sorted(gaps):
            skus = gaps[name]
            writer.writerow(
                {
                    "product_name": name,
                    "sku_count": len(skus),
                    "example_skus": "; ".join(skus[:3]),
                }
            )

    filled = sum(1 for r in rows if r["cas_number"])
    missing = len(rows) - filled
    print(f"Wrote {OUT_CSV} ({len(rows)} rows, {filled} with CAS, {missing} still missing)")
    print(f"Wrote {GAPS_CSV} ({len(gaps)} unique names to research)")


if __name__ == "__main__":
    main()
