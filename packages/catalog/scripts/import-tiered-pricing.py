#!/usr/bin/env python3
"""Import tiered 5/10/20 pack pricing from Excel into catalog JSON."""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

import pandas as pd

ROOT = Path(__file__).resolve().parents[3]
XLSX_DEFAULT = Path.home() / "Downloads" / "Tiered_Pricing_5_10_20_Vials.xlsx"
CATALOG_PATH = ROOT / "product_catalog_usd.json"
TIERED_PATH = ROOT / "packages" / "catalog" / "data" / "tiered-catalog.json"


def slugify(value: str) -> str:
    return re.sub(r"^-+|-+$", "", re.sub(r"[^a-z0-9]+", "-", value.lower()))


def parse_strength(name: str) -> tuple[str, str]:
    match = re.search(r"(\d+\s*(?:mg|ml|iu|mcg|count(?:\s*\([^)]+\))?)[^\s]*)", name, re.I)
    if not match:
        return name.strip(), "Standard"
    strength = match.group(1).strip()
    base_name = re.sub(r"\s+" + re.escape(strength) + r"$", "", name, flags=re.I).strip()
    return base_name, strength


def match_slug(pname: str, old_rows: list[dict]) -> tuple[str, str | None, str | None]:
    normalized = pname.strip().lower()
    for row in old_rows:
        combined = f"{row['name']} {row['strength']}".strip().lower()
        if combined == normalized or row["name"].strip().lower() == normalized:
            return (
                row["slug"],
                row["category"],
                row.get("storefront_category"),
            )
    return slugify(pname), None, None


def normalize_tier_label(qty: int) -> str:
    if qty == 1:
        return "1 vial"
    return f"{qty} vials"


def load_tiers(xlsx_path: Path) -> pd.DataFrame:
    df = pd.read_excel(xlsx_path, sheet_name="Tiered Pricing 5-10-20", header=3)
    df.columns = [
        "category",
        "product_name",
        "tier_raw",
        "qty",
        "total_price",
        "per_vial",
        "savings",
        "status",
    ]
    df = df.dropna(subset=["product_name", "qty"])
    df["qty"] = df["qty"].astype(int)
    df = df[df["status"].astype(str).str.upper().eq("ACTIVE")].copy()
    df = df[df["qty"].isin([5, 10, 20])].copy()
    df["tier"] = df["qty"].map(normalize_tier_label)
    return df


def main() -> int:
    xlsx_path = Path(sys.argv[1]) if len(sys.argv) > 1 else XLSX_DEFAULT
    if not xlsx_path.exists():
        print(f"Missing pricing workbook: {xlsx_path}", file=sys.stderr)
        return 1

    old_rows = json.loads(CATALOG_PATH.read_text(encoding="utf-8"))
    df = load_tiers(xlsx_path)

    tiered_products: list[dict] = []
    flat_rows: list[dict] = []
    unmatched: list[str] = []

    for (pname, category), group in df.groupby(["product_name", "category"]):
        slug, src_category, storefront_category = match_slug(str(pname), old_rows)
        if src_category is None:
            unmatched.append(str(pname))

        pack_tiers = []
        for _, row in group.sort_values("qty", key=lambda series: series.astype(int)).iterrows():
            pack_tiers.append(
                {
                    "tier": str(row["tier"]).strip(),
                    "qty": int(row["qty"]),
                    "price_usd": round(float(row["total_price"]), 2),
                    "per_unit_usd": round(float(row["per_vial"]), 2),
                    "savings_pct": round(float(row["savings"]) if pd.notna(row["savings"]) else 0, 4),
                }
            )

        tiered_products.append(
            {
                "category": (src_category or category).strip(),
                "storefront_category": storefront_category,
                "name": str(pname).strip(),
                "slug": slug,
                "pack_tiers": pack_tiers,
            }
        )

        base_name, strength = parse_strength(str(pname))
        if src_category is not None:
            for row in old_rows:
                if row["slug"] == slug:
                    base_name = row["name"]
                    strength = row["strength"]
                    break
        flat_rows.append(
            {
                "category": (src_category or category).strip(),
                "name": base_name,
                "strength": strength,
                "price_usd": pack_tiers[0]["price_usd"],
                "slug": slug,
                "storefront_category": storefront_category,
                "pack_tiers": pack_tiers,
            }
        )

    TIERED_PATH.parent.mkdir(parents=True, exist_ok=True)
    TIERED_PATH.write_text(
        json.dumps({"source": str(xlsx_path), "products": tiered_products}, indent=2),
        encoding="utf-8",
    )
    CATALOG_PATH.write_text(json.dumps(flat_rows, indent=2), encoding="utf-8")

    pack_pricing_ts = ROOT / "revamp" / "app" / "src" / "data" / "pack-pricing.ts"
    lines = [
        "/** Auto-generated from tiered pricing import. Do not edit manually. */",
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
        for t in row["pack_tiers"]:
            tier_objects.append(
                "{ tier: "
                + json.dumps(t["tier"])
                + f", qty: {t['qty']}, price: {t['price_usd']}, perUnit: {t['per_unit_usd']}, savingsPct: {t['savings_pct']} }}"
            )
        tiers = ",\n      ".join(tier_objects)
        lines.append(f"  {json.dumps(row['slug'])}: [\n      {tiers},\n    ],")
    lines.append("};")
    lines.append("")
    lines.append("export function getPackTiers(slug: string): PackTier[] | undefined {")
    lines.append("  if (packPricingBySlug[slug]) return packPricingBySlug[slug]")
    lines.append("  const normalized = slug.toLowerCase().replace(/[^a-z0-9]/g, '');")
    lines.append("  for (const [catalogSlug, tiers] of Object.entries(packPricingBySlug)) {")
    lines.append("    if (catalogSlug.replace(/[^a-z0-9]/g, '') === normalized) return tiers;")
    lines.append("  }")
    lines.append("  return undefined;")
    lines.append("}")
    lines.append("")
    lines.append("export function getDefaultPackTier(slug: string): PackTier | undefined {")
    lines.append("  const tiers = getPackTiers(slug);")
    lines.append("  return tiers?.[0];")
    lines.append("}")
    lines.append("")
    pack_pricing_ts.parent.mkdir(parents=True, exist_ok=True)
    pack_pricing_ts.write_text("\n".join(lines), encoding="utf-8")

    print(f"Imported {len(tiered_products)} products from {xlsx_path}")
    print(f"Updated {CATALOG_PATH}")
    print(f"Wrote {TIERED_PATH}")
    if unmatched:
        print(f"Unmatched slug mappings ({len(unmatched)}): {', '.join(unmatched[:10])}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
