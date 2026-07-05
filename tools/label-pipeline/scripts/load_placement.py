"""Load label placement from assets/placement-config.json (single source of truth)."""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REPO_ROOT = ROOT.parent.parent
CONFIG_PATH = ROOT / "assets" / "placement-config.json"


def load_config() -> dict:
    if not CONFIG_PATH.is_file():
        raise FileNotFoundError(
            f"Missing {CONFIG_PATH}. Mark the label area first:\n"
            f"  Open tools/label-pipeline/scripts/mark-label-area.html in your browser"
        )
    return json.loads(CONFIG_PATH.read_text(encoding="utf-8"))


def save_config(data: dict) -> None:
    CONFIG_PATH.parent.mkdir(parents=True, exist_ok=True)
    CONFIG_PATH.write_text(json.dumps(data, indent=2) + "\n", encoding="utf-8")


def resolve_path(relative: str) -> Path:
    p = Path(relative)
    if p.is_file():
        return p.resolve()
    for base in (ROOT, REPO_ROOT):
        candidate = (base / relative).resolve()
        if candidate.is_file():
            return candidate
    raise FileNotFoundError(f"Plate not found: {relative}")


def get_vial() -> dict:
    cfg = load_config()
    vial = cfg.get("vial")
    if not vial:
        raise KeyError("placement-config.json missing 'vial' section")
    box = vial.get("label_box")
    if not box or len(box) != 4:
        raise ValueError(
            "vial.label_box is not set. Mark the area in mark-label-area.html first."
        )
    plate = resolve_path(vial["plate"])
    native = tuple(vial.get("native_size") or (0, 0))
    blender = vial.get("blender") or {}
    return {
        "plate": plate,
        "label_box": tuple(int(v) for v in box),
        "native_size": native,
        "blender": blender,
        "feather_radius": int(vial.get("feather_radius", 4)),
    }


def scale_box(box: tuple[int, int, int, int], native_size: tuple[int, int], plate_size: tuple[int, int]) -> tuple[int, int, int, int]:
    if not native_size[0] or not native_size[1]:
        return box
    if plate_size == native_size:
        return box
    sx = plate_size[0] / native_size[0]
    sy = plate_size[1] / native_size[1]
    x, y, w, h = box
    return (int(x * sx), int(y * sy), int(w * sx), int(h * sy))
