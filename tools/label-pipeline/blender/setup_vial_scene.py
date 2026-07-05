"""
Photo-plate vial scene: curved label mesh for alpha renders.

Background plate (seashell photo) is composited in Python after render.

  blender --background --python setup_vial_scene.py
"""

from __future__ import annotations

import json
import math
from pathlib import Path

import bpy

ROOT = Path(__file__).resolve().parents[1]
REPO_ROOT = ROOT.parent.parent
OUT_BLEND = ROOT / "assets" / "vial_template.blend"
CONFIG_PATH = ROOT / "assets" / "placement-config.json"


def load_vial_config() -> dict:
    if not CONFIG_PATH.is_file():
        raise FileNotFoundError(
            f"Missing {CONFIG_PATH}. Mark the label area in scripts/mark-label-area.html first."
        )
    cfg = json.loads(CONFIG_PATH.read_text(encoding="utf-8"))
    vial = cfg.get("vial")
    if not vial or not vial.get("label_box"):
        raise ValueError("placement-config.json: set vial.label_box via mark-label-area.html")
    return vial


def resolve_plate(relative: str) -> Path:
    p = Path(relative)
    if p.is_file():
        return p.resolve()
    for base in (ROOT, REPO_ROOT):
        candidate = (base / relative).resolve()
        if candidate.is_file():
            return candidate
    raise FileNotFoundError(f"Plate not found: {relative}")


vial_cfg = load_vial_config()
blender_cfg = vial_cfg.get("blender") or {}
PLATE = resolve_plate(vial_cfg["plate"])
LABEL_BOX = tuple(int(v) for v in vial_cfg["label_box"])
LABEL_W_PX, LABEL_H_PX = LABEL_BOX[2], LABEL_BOX[3]

FIGMA_W = int(blender_cfg.get("figma_w", 1062))
FIGMA_H = int(blender_cfg.get("figma_h", 1112))
label_h = float(blender_cfg.get("label_h", 4.0))
label_w = float(blender_cfg.get("label_w", label_h * (FIGMA_W / FIGMA_H)))

RENDER_X = int(blender_cfg.get("render_w", LABEL_W_PX * 2))
RENDER_Y = int(blender_cfg.get("render_h", LABEL_H_PX * 2))
BEND_DEGREES = float(blender_cfg.get("bend_angle_deg", 50))


def purge_orphans() -> None:
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete()
    for block in (bpy.data.meshes, bpy.data.materials, bpy.data.images, bpy.data.cameras, bpy.data.lights):
        for item in list(block):
            if item.users == 0:
                block.remove(item)


def set_bsdf_input(bsdf, names: list[str], value) -> None:
    for name in names:
        if name in bsdf.inputs:
            bsdf.inputs[name].default_value = value
            return


def make_label_material() -> bpy.types.Material:
    mat = bpy.data.materials.new(name="LabelMaterial")
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    nodes.clear()

    out = nodes.new("ShaderNodeOutputMaterial")
    bsdf = nodes.new("ShaderNodeBsdfPrincipled")
    tex = nodes.new("ShaderNodeTexImage")
    tex.label = "LabelTexture"
    tex.location = (-500, 200)
    tex.extension = "CLIP"

    links.new(tex.outputs["Color"], bsdf.inputs["Base Color"])
    links.new(tex.outputs["Alpha"], bsdf.inputs["Alpha"])
    set_bsdf_input(bsdf, ["Roughness"], 0.55)
    set_bsdf_input(bsdf, ["Specular", "Specular IOR Level"], 0.08)
    links.new(bsdf.outputs["BSDF"], out.inputs["Surface"])

    mat.blend_method = "BLEND"
    if hasattr(mat, "surface_render_method"):
        mat.surface_render_method = "BLENDED"
    return mat


def setup_scene() -> None:
    purge_orphans()
    scene = bpy.context.scene

    # ── Label mesh ────────────────────────────────────────────────────────────
    bpy.ops.mesh.primitive_plane_add(size=1, location=(0, 0, 0))
    plane = bpy.context.active_object
    plane.name = "LabelMesh"
    plane.scale = (label_w / 2, label_h / 2, 1)
    bpy.ops.object.transform_apply(scale=True)

    # Dense subdivide for smooth cylindrical curvature
    bpy.ops.object.mode_set(mode="EDIT")
    bpy.ops.mesh.subdivide(number_cuts=64)
    bpy.ops.object.mode_set(mode="OBJECT")

    # Bend along X → simulates wrapping around a vertical cylinder
    bend = plane.modifiers.new(name="Bend", type="SIMPLE_DEFORM")
    bend.deform_method = "BEND"
    bend.deform_axis = "X"
    bend.angle = math.radians(BEND_DEGREES)

    mat = make_label_material()
    plane.data.materials.append(mat)

    # ── Camera ────────────────────────────────────────────────────────────────
    # Plane lies in XY (normal +Z). Camera on +Z axis looks straight at the label.
    bpy.ops.object.camera_add(location=(0, 0, 12))
    cam = bpy.context.active_object
    cam.name = "Camera"
    cam.data.type = "ORTHO"
    cam.data.ortho_scale = label_h * 1.35
    cam.rotation_euler = (0, 0, 0)
    scene.camera = cam

    # ── Lighting ──────────────────────────────────────────────────────────────
    bpy.ops.object.light_add(type="AREA", location=(2, -2, 8))
    key = bpy.context.active_object
    key.name = "KeyLight"
    key.data.energy = 320
    key.data.size = 5

    bpy.ops.object.light_add(type="AREA", location=(-2, 2, 6))
    fill = bpy.context.active_object
    fill.name = "FillLight"
    fill.data.energy = 160
    fill.data.size = 4

    bpy.ops.object.light_add(type="AREA", location=(0, -3, 8))
    rim = bpy.context.active_object
    rim.name = "RimLight"
    rim.data.energy = 80
    rim.data.size = 6

    # ── Render settings ───────────────────────────────────────────────────────
    scene.render.engine = "CYCLES"
    scene.cycles.samples = 64         # up from 48 for cleaner label edges
    scene.cycles.use_denoising = True
    scene.render.resolution_x = RENDER_X   # 568 px — exact 2× composite box
    scene.render.resolution_y = RENDER_Y   # 762 px — exact 2× composite box
    scene.render.image_settings.file_format = "PNG"
    scene.render.image_settings.color_mode = "RGBA"
    scene.render.film_transparent = True

    # Neutral white world — no colour cast on the label
    if scene.world.node_tree:
        bg = scene.world.node_tree.nodes.get("Background")
        if bg:
            bg.inputs[0].default_value = (1, 1, 1, 0)
            bg.inputs[1].default_value = 0.0   # world strength 0 → pure transparent

    # Store metadata so composite_vial_shots.py can read box coords from the blend
    scene["label_box"] = LABEL_BOX
    scene["plate_path"] = str(PLATE)
    scene["render_x"] = RENDER_X
    scene["render_y"] = RENDER_Y

    OUT_BLEND.parent.mkdir(parents=True, exist_ok=True)
    bpy.ops.wm.save_as_mainfile(filepath=str(OUT_BLEND))
    print(f"Saved template: {OUT_BLEND}")
    print(f"  Mesh:   {label_w:.3f} × {label_h:.3f} scene units  (aspect {label_w/label_h:.3f})")
    print(f"  Render: {RENDER_X} × {RENDER_Y} px  (aspect {RENDER_X/RENDER_Y:.3f})")
    print(f"  Box:    {LABEL_W_PX} × {LABEL_H_PX} px  (aspect {LABEL_W_PX/LABEL_H_PX:.3f})")
    print(f"  Bend:   {BEND_DEGREES}°")


if __name__ == "__main__":
    setup_scene()
