"""Dev preview helper — composites capsule front/side passes to _preview_output."""

from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))

from composite_product_shots import composite_capsule  # noqa: E402
from load_placement import get_capsule, scale_box  # noqa: E402
from PIL import Image  # noqa: E402

TMP = ROOT / "curved_labels_capsule"
OUT = ROOT / "_preview_output"

# Prefer product SKUs; fall back to generic template names.
CANDIDATES = [
    ("BPC-157 (Capsules) 500mcg-capsule__front.png", "v3-capsule-front.png"),
    ("BPC-157 (Capsules) 500mcg-capsule__side.png", "v3-capsule-side.png"),
    ("Pinealon (Capsules)__front.png", "v3-pinealon-capsule-front.png"),
    ("Pinealon (Capsules)__side.png", "v3-pinealon-capsule-side.png"),
]


def main() -> None:
    cfg = get_capsule()
    plate = Image.open(cfg["plate"]).convert("RGB")
    native = cfg["native_size"] if cfg["native_size"][0] else plate.size
    box = scale_box(cfg["label_box"], native, plate.size)
    OUT.mkdir(parents=True, exist_ok=True)

    for src_name, out_name in CANDIDATES:
        src = TMP / src_name
        if not src.is_file():
            print(f"skip missing {src_name}")
            continue
        curved = Image.open(src).convert("RGBA")
        out = composite_capsule(curved, plate, box, cfg["feather_radius"])
        out.save(OUT / out_name, format="PNG", optimize=True)
        print(f"{out_name} <- {src_name}")


if __name__ == "__main__":
    main()
