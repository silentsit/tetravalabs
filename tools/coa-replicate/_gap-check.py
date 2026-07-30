# -*- coding: utf-8 -*-
"""Compare Peptide Sequence Sheet vs catalog COA files/manifest."""
from __future__ import annotations

import json
import re
from pathlib import Path

import openpyxl

SHEET = Path(r"c:\Users\user\Downloads\Peptide Sequence Sheet NEW.xlsx")
ROOT = Path(r"c:\Users\user\Downloads\Tetravalabs")
MANIFEST = ROOT / "coas/manifest.json"
FILES_DIR = ROOT / "coas/files"
OUT = ROOT / "tools/coa-replicate/_gap-report.json"


def norm(s: str) -> str:
    s = (s or "").lower().strip()
    s = (
        s.replace("β", "b")
        .replace("α", "a")
        .replace("µ", "u")
        .replace("μ", "u")
        .replace("⁺", "")
        .replace("+", "-plus")
    )
    s = re.sub(r"[^a-z0-9]+", "-", s)
    return s.strip("-")


def load_sheet():
    wb = openpyxl.load_workbook(SHEET, data_only=True)
    ws = wb.active
    rows = list(ws.iter_rows(values_only=True))
    products = []
    for r in rows[1:]:
        if not r or not r[0]:
            continue
        products.append(
            {
                "product_name": str(r[0]).strip() if r[0] else "",
                "sub_name": str(r[1]).strip() if r[1] else "",
                "cas_number": str(r[2]).strip() if r[2] else "",
                "formula": str(r[3]).strip() if r[3] else "",
                "concentration": str(r[4]).strip() if r[4] else "",
                "vial_size": str(r[5]).strip() if r[5] else "",
                "color_code": str(r[6]).strip() if r[6] else "",
            }
        )
    return products


# Manual aliases: sheet name stem -> tokens found in COA filenames / variant handles
NAME_ALIASES = {
    "tb-500": ["tb500", "tb-500", "thymosin-beta-4", "thymosin-beta-4-tb-500"],
    "tb500": ["tb500", "tb-500", "thymosin-beta-4"],
    "bpc-157": ["bpc-157", "bpc157"],
    "nad": ["nad", "nad-plus"],
    "nad-plus": ["nad", "nad-plus"],
    "ghk-cu": ["ghk-cu"],
    "glutathione": ["glutathione", "reduced-glutathione"],
    "bacteriostatic-water": ["bacteriostatic-water", "reconstitution-solution"],
    "cerebrolysin": ["cerebrolysin", "cerebroprotein-hydrolysate"],
    "retatrutide": ["retatrutide", "glp-2-tr"],
    "tirzepatide": ["tirzepatide", "glp-3-rt"],
    "5-amino-1mq": ["5-amino-1mq"],
    "hgh-191aa": ["hgh-191aa", "hgh", "somatropin"],
    "hgh-fragment-176-191": ["hgh-fragment-176-191", "aod-9604", "fragment-176-191"],
    "selank": ["selank", "n-acetyl-selank"],
    "semax": ["semax", "n-acetyl-semax"],
    "epithalon": ["epithalon", "epitalon", "n-acetyl-epitalon"],
    "vip": ["vip"],
    "ss-31": ["ss-31", "elamipretide"],
    "ll-37": ["ll-37"],
    "mots-c": ["mots-c"],
    "kpv": ["kpv"],
    "dsip": ["dsip"],
    "aod-9604": ["aod-9604"],
    "adipotide": ["adipotide"],
    "cagrilintide": ["cagrilintide"],
    "sermorelin": ["sermorelin"],
    "tesamorelin": ["tesamorelin"],
    "thymalin": ["thymalin"],
    "pinealon": ["pinealon"],
    "kisspeptin-10": ["kisspeptin-10", "kisspeptin"],
    "melanotan-1": ["melanotan-1", "mt-1"],
    "melanotan-2": ["melanotan-2", "mt-2"],
    "l-carnitine": ["l-carnitine"],
    "ipamorelin": ["ipamorelin"],
    "cjc-1295": ["cjc-1295"],
    "semaglutide": ["semaglutide"],
    "aicar": ["aicar"],
}


def conc_variants(conc: str) -> list[str]:
    c = norm(conc)
    out = {c}
    out.add(c.replace("mcg", "ug"))
    out.add(c.replace("ug", "mcg"))
    # 10mg vs 10-mg
    m = re.match(r"^(\d+(?:\.\d+)?)(mg|mcg|ug|ml|iu)$", c)
    if m:
        out.add(f"{m.group(1)}-{m.group(2)}")
        out.add(f"{m.group(1)}{m.group(2)}")
    return [x for x in out if x]


def build_coa_index(manifest, files):
    """List of {kind, key, variant_handle, local_file, compound, strength}."""
    entries = []
    for e in manifest:
        if e.get("document_type") != "coa":
            continue
        vh = e.get("variant_handle") or ""
        meta = e.get("metadata") or {}
        local = e.get("local_file")
        entries.append(
            {
                "kind": "manifest_wired" if local else "manifest_no_file",
                "variant_handle": vh,
                "local_file": local,
                "compound": meta.get("compound") or "",
                "strength": meta.get("variant") or "",
                "keys": {
                    norm(vh),
                    norm(f"{meta.get('compound', '')}-{meta.get('variant', '')}"),
                    norm((local or "").replace(".pdf", "").replace("COA_", "")),
                },
            }
        )
    for f in files:
        base = f[:-4] if f.lower().endswith(".pdf") else f
        base = re.sub(r"^COA_", "", base)
        base_clean = re.sub(r"_(Injectable|Tablet)$", "", base, flags=re.I)
        entries.append(
            {
                "kind": "file",
                "variant_handle": "",
                "local_file": f,
                "compound": "",
                "strength": "",
                "keys": {norm(base), norm(base_clean)},
            }
        )
    return entries


def name_stems(product_name: str) -> list[str]:
    n = norm(product_name)
    stems = [n]
    # strip trailing form words
    stems.append(re.sub(r"-(nasal-spray|capsules?|tablet|injectable|spray)$", "", n))
    if n in NAME_ALIASES:
        stems.extend(NAME_ALIASES[n])
    # partial alias lookup
    for k, vals in NAME_ALIASES.items():
        if k in n or n in k:
            stems.extend(vals)
    return list(dict.fromkeys(s for s in stems if s))


def is_blend_name(name: str) -> bool:
    n = name.lower()
    return "+" in n or "blend" in n or " plus " in n


def is_blend_key(key: str) -> bool:
    return "plus" in key or "blend" in key or key.count("-") >= 5 and any(
        x in key for x in ("bpc", "tb", "kpv", "cjc", "ipa", "sema", "selank")
    ) and ("plus" in key or "tb-500" in key and "bpc" in key)


def match_product(p, index):
    stems = name_stems(p["product_name"])
    concs = conc_variants(p["concentration"])
    product_is_blend = is_blend_name(p["product_name"])
    form = norm(p["product_name"])
    wants_nasal = "nasal" in form or "spray" in form
    wants_capsule = "capsule" in form or "tablet" in form

    candidates = []
    for entry in index:
        for key in entry["keys"]:
            if not key:
                continue
            key_is_blend = (
                "plus" in key
                or "blend" in key
                or ("bpc-157" in key and "tb" in key)
                or ("tesamorelin" in key and "ipamorelin" in key)
                or ("semax" in key and "selank" in key)
            )
            # Blends must not steal single-compound COAs, and vice versa
            if product_is_blend and not key_is_blend:
                continue
            if not product_is_blend and key_is_blend:
                # allow only if product is explicitly selank/semax and key is combo — still skip
                continue

            stem_hit = any(s and len(s) >= 3 and s in key for s in stems)
            if not stem_hit:
                continue

            # Form constraints
            if wants_nasal and "nasal" not in key and "spray" not in key:
                # no dedicated nasal COA in library — treat as no match
                continue
            if wants_capsule and "tablet" not in key and "capsule" not in key:
                continue

            conc_hit = any(c and c in key for c in concs) if concs else True
            score = 0
            if conc_hit:
                score += 10
            if entry["kind"] == "manifest_wired":
                score += 5
            elif entry["kind"] == "file":
                score += 3
            for s in stems:
                for c in concs:
                    if key == f"{s}-{c}" or (key.endswith(f"-{c}") and s in key):
                        score += 8
            candidates.append((score, entry, key))

    if not candidates:
        return None

    candidates.sort(key=lambda x: -x[0])
    best_score, best, key = candidates[0]
    if best_score < 10:
        # require concentration match for a usable hit
        return None

    return {
        "match_kind": best["kind"],
        "matched_key": key,
        "variant_handle": best.get("variant_handle") or "",
        "local_file": best.get("local_file") or "",
        "score": best_score,
    }


def main():
    products = load_sheet()
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    files = sorted(p.name for p in FILES_DIR.glob("*.pdf"))
    index = build_coa_index(manifest, files)

    coa_rows = [e for e in manifest if e.get("document_type") == "coa"]
    wired = [e for e in coa_rows if e.get("local_file")]

    with_coa = []
    without = []
    for p in products:
        m = match_product(p, index)
        row = {**p, "match": m}
        if m and (m["match_kind"] in ("manifest_wired", "file") or m.get("local_file")):
            # treat manifest_no_file as WITHOUT a usable COA PDF
            if m["match_kind"] == "manifest_no_file" and not m.get("local_file"):
                without.append(row)
            else:
                with_coa.append(row)
        else:
            without.append(row)

    report = {
        "sheet_products": len(products),
        "manifest_coa_rows": len(coa_rows),
        "manifest_with_local_file": len(wired),
        "pdf_files_on_disk": len(files),
        "sheet_with_coa": len(with_coa),
        "sheet_without_coa": len(without),
        "with_coa": [
            {
                "product_name": r["product_name"],
                "concentration": r["concentration"],
                "cas_number": r["cas_number"],
                "match": r["match"],
            }
            for r in with_coa
        ],
        "without_coa": [
            {
                "product_name": r["product_name"],
                "concentration": r["concentration"],
                "cas_number": r["cas_number"],
                "formula": r["formula"],
                "sub_name": r["sub_name"],
            }
            for r in without
        ],
        "pdf_files": files,
    }
    OUT.write_text(json.dumps(report, indent=2, ensure_ascii=False), encoding="utf-8")

    print(f"Sheet products: {len(products)}")
    print(f"Manifest COA with PDF: {len(wired)} / {len(coa_rows)}")
    print(f"PDF files on disk: {len(files)}")
    print(f"Sheet WITH COA: {len(with_coa)}")
    print(f"Sheet WITHOUT COA: {len(without)}")
    print()
    print("=== PRODUCTS WITHOUT COA ===")
    for w in without:
        print(f"- {w['product_name']} ({w['concentration']}) CAS {w['cas_number']}")


if __name__ == "__main__":
    main()
