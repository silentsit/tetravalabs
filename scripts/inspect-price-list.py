import re
from pathlib import Path

import openpyxl

path = Path(r"c:\Users\user\Downloads\Price List USD.xlsx")
wb = openpyxl.load_workbook(path, read_only=True, data_only=True)
ws = wb["Tiered Price List"]
products = []
for row in ws.iter_rows(min_row=5, values_only=True):
    sku, category, name = (row[0] or ""), (row[1] or ""), (row[2] or "")
    if not name or not str(name).strip():
        continue
    products.append({"sku": str(sku).strip(), "category": str(category).strip(), "name": str(name).strip()})
wb.close()

print("count", len(products))
for p in products[:5]:
    print(p)
for p in products[-5:]:
    print(p)
