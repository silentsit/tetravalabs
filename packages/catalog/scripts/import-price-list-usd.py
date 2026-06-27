#!/usr/bin/env python3
"""Import wide-format Price List USD workbook into product_catalog_usd.json."""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

import openpyxl

ROOT = Path(__file__).resolve().parents[3]
XLSX_DEFAULT = ROOT / "Price List USD 26_06_26.xlsx"
CATALOG_PATH = ROOT / "product_catalog_usd.json"
TIERED_PATH = ROOT / "packages" / "catalog" / "data" / "tiered-catalog.json"
REVAMP_PACK_PATH = ROOT / "revamp" / "app" / "src" / "data" / "pack-pricing.ts"

STOREFRONT_BY_SOURCE = {
    "Supplies & Reconstitution": "Lab Supplies",
    "GLP-1 / Incretin": "GLP-1 Research",
    "BPC-157 / TB500": "Growth Factors",
    "Blends": "Research Blends",
    "CJC / Ipamorelin / GHRP": "Growth Factors",
    "Growth Hormone Axis": "Growth Factors",
    "Mitochondrial / Metabolic Other": "Growth Factors",
    "Cosmetic / Copper / Tanning": "Growth Factors",
    "Longevity / Thymic / Neuropeptides": "Growth Factors",
    "Vitamins & Injectables": "Growth Factors",
    "Legacy Catalog": "Growth Factors",
}


def slugify(value: str) -> str:
    return re.sub(r"^-+|-+$", "", re.sub(r"[^a-z0-9]+", "-", value.lower()))


def normalize_key(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "", value.lower())


def parse_strength(full_name: str) -> tuple[str, str]:
    name = full_name.strip()
    match = re.search(
        r"(\d+(?:\.\d+)?\s*(?:mg|ml|iu|mcg)(?:\s*\([^)]+\))?(?:\s*count(?:\s*\([^)]+\))?)?)",
        name,
        re.I,
    )
    if not match:
        return name, "Standard"
    strength = match.group(1).strip()
    base = re.sub(r"\s+" + re.escape(strength) + r"$", "", name, flags=re.I).strip()
    return base, strength


def load_workbook_rows(xlsx_path: Path) -> list[dict]:
    wb = openpyxl.load_workbook(xlsx_path, data_only=True)
    ws = wb["Price List USD"]
    rows: list[dict] = []
    current_category = ""

    for row_idx in range(4, ws.max_row + 1):
        category_cell = ws.cell(row_idx, 2).value
        product_cell = ws.cell(row_idx, 3).value
        if category_cell and not product_cell:
            current_category = str(category_cell).strip()
            continue
        if not product_cell:
            continue

        product_name = str(product_cell).strip()
        rows.append(
            {
                "category": current_category,
                "product_name": product_name,
                "slug": slugify(product_name),
                "ref_price_usd": ws.cell(row_idx, 4).value,
                "pack_tiers": [
                    {
                        "tier": "5 vials",
                        "qty": 5,
                        "price_usd": round(float(ws.cell(row_idx, 5).value), 2),
                        "per_unit_usd": round(float(ws.cell(row_idx, 6).value), 2),
                        "savings_pct": round(float(ws.cell(row_idx, 7).value or 0), 4),
                    },
                    {
                        "tier": "10 vials",
                        "qty": 10,
                        "price_usd": round(float(ws.cell(row_idx, 8).value), 2),
                        "per_unit_usd": round(float(ws.cell(row_idx, 9).value), 2),
                        "savings_pct": round(float(ws.cell(row_idx, 10).value or 0), 4),
                    },
                    {
                        "tier": "20 vials",
                        "qty": 20,
                        "price_usd": round(float(ws.cell(row_idx, 11).value), 2),
                        "per_unit_usd": round(float(ws.cell(row_idx, 12).value), 2),
                        "savings_pct": round(float(ws.cell(row_idx, 13).value or 0), 4),
                    },
                ],
            }
        )
    return rows


def index_old_rows(old_rows: list[dict]) -> dict[str, dict]:
    indexed: dict[str, dict] = {}
    for row in old_rows:
        keys = {
            normalize_key(row["slug"]),
            normalize_key(f"{row['name']} {row['strength']}"),
            normalize_key(row["name"]),
        }
        for key in keys:
            indexed.setdefault(key, row)
    return indexed


def match_old_row(product_name: str, slug: str, indexed: dict[str, dict]) -> dict | None:
    candidates = [
        normalize_key(slug),
        normalize_key(product_name),
    ]
    base, strength = parse_strength(product_name)
    candidates.append(normalize_key(f"{base} {strength}"))
    candidates.append(normalize_key(base))

    for key in candidates:
        if key in indexed:
            return indexed[key]
    return None


def write_revamp_pack_pricing(flat_rows: list[dict]) -> None:
    lines = [
        "/** Auto-generated from Price List USD import. Do not edit manually. */",
        "export type PackTier = {",
        "  tier: string;",
        "  qty: number;",
        "  price: number;",
        "  perUnit: number;",
        "  savingsPct: number;",
        "};",
        "",
        "export const packPricingBySlug: Record<string, PackTier[]> = {",
    ]
    for row in flat_rows:
        tier_objects = []
        for tier in row["pack_tiers"]:
            tier_objects.append(
                "{ tier: "
                + json.dumps(tier["tier"])
                + f", qty: {tier['qty']}, price: {tier['price_usd']}, perUnit: {tier['per_unit_usd']}, savingsPct: {tier['savings_pct']} }}"
            )
        tiers = ",\n      ".join(tier_objects)
        lines.append(f"  {json.dumps(row['slug'])}: [\n      {tiers},\n    ],")
    lines.extend(
        [
            "};",
            "",
            "export function getPackTiers(slug: string): PackTier[] | undefined {",
            "  if (packPricingBySlug[slug]) return packPricingBySlug[slug]",
            "  const normalized = slug.toLowerCase().replace(/[^a-z0-9]/g, '');",
            "  for (const [catalogSlug, tiers] of Object.entries(packPricingBySlug)) {",
            "    if (catalogSlug.replace(/[^a-z0-9]/g, '') === normalized) return tiers",
            "  }",
            "  return undefined",
            "}",
            "",
            "export function getDefaultPackTier(slug: string): PackTier | undefined {",
            "  const tiers = getPackTiers(slug);",
            "  return tiers?.[0];",
            "}",
            "",
        ]
    )
    REVAMP_PACK_PATH.parent.mkdir(parents=True, exist_ok=True)
    REVAMP_PACK_PATH.write_text("\n".join(lines), encoding="utf-8")


def main() -> int:
    xlsx_path = Path(sys.argv[1]) if len(sys.argv) > 1 else XLSX_DEFAULT
    if not xlsx_path.exists():
        print(f"Missing workbook: {xlsx_path}", file=sys.stderr)
        return 1

    old_rows = json.loads(CATALOG_PATH.read_text(encoding="utf-8-sig"))
    indexed = index_old_rows(old_rows)
    imported = load_workbook_rows(xlsx_path)

    flat_rows: list[dict] = []
    tiered_products: list[dict] = []
    slug_changes: list[tuple[str, str]] = []
    new_products: list[str] = []

    for item in imported:
        old = match_old_row(item["product_name"], item["slug"], indexed)
        base_name, strength = parse_strength(item["product_name"])
        category = item["category"]
        storefront_category = STOREFRONT_BY_SOURCE.get(category, "Growth Factors")

        if old:
            base_name = old["name"]
            strength = old["strength"]
            category = old["category"]
            storefront_category = old.get("storefront_category") or storefront_category
            if old["slug"] != item["slug"]:
                slug_changes.append((old["slug"], item["slug"]))
        else:
            new_products.append(item["product_name"])

        flat_rows.append(
            {
                "category": category,
                "name": base_name,
                "strength": strength,
                "price_usd": item["pack_tiers"][0]["price_usd"],
                "slug": item["slug"],
                "storefront_category": storefront_category,
                "ref_price_usd": item["ref_price_usd"],
                "pack_tiers": item["pack_tiers"],
            }
        )
        tiered_products.append(
            {
                "category": category,
                "storefront_category": storefront_category,
                "name": item["product_name"],
                "slug": item["slug"],
                "pack_tiers": item["pack_tiers"],
            }
        )

    CATALOG_PATH.write_text(json.dumps(flat_rows, indent=2), encoding="utf-8")
    TIERED_PATH.parent.mkdir(parents=True, exist_ok=True)
    TIERED_PATH.write_text(
        json.dumps({"source": str(xlsx_path), "products": tiered_products}, indent=2),
        encoding="utf-8",
    )
    write_revamp_pack_pricing(flat_rows)

    print(f"Imported {len(flat_rows)} products from {xlsx_path}")
    print(f"Updated {CATALOG_PATH}")
    print(f"Wrote {TIERED_PATH}")
    if slug_changes:
        print(f"Slug updates ({len(slug_changes)}):")
        for old_slug, new_slug in slug_changes:
            print(f"  {old_slug} -> {new_slug}")
    if new_products:
        print(f"New products ({len(new_products)}): {', '.join(new_products)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
