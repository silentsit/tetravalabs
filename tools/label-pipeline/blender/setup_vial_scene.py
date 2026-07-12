"""
True-cylinder vial label scene.

The flat label art is a full 360° wrap (width : height = circumference : height).
We build an actual cylinder, map the label around it with clean cylindrical UVs,
and render an orthographic front view with a transparent background. render_vial_labels.py
rotates the cylinder per "view" (front / side) so different parts of the wrap face the
camera. composite_vial_shots.py drops each render onto the photographic vial plate.

  blender --background --python setup_vial_scene.py
"""

from __future__ import annotations

import json
import math
from pathlib import Path

import bmesh
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

FIGMA_W = int(blender_cfg.get("figma_w", 3000))
FIGMA_H = int(blender_cfg.get("figma_h", 1200))
LABEL_AR = FIGMA_W / FIGMA_H  # circumference : height for a full wrap

LABEL_H = float(blender_cfg.get("label_h", 4.0))
CIRCUMFERENCE = LABEL_H * LABEL_AR
RADIUS = CIRCUMFERENCE / (2.0 * math.pi)

SEGMENTS = int(blender_cfg.get("segments", 192))
VISIBLE_W = 2.0 * RADIUS  # front diameter that shows in an ortho view

RENDER_X = int(blender_cfg.get("render_w", LABEL_W_PX * 2))
RENDER_Y = int(blender_cfg.get("render_h", LABEL_H_PX * 2))


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
    # Labels are fully opaque vinyl — ignore texture alpha so the back of the
    # cylinder never shows through. film_transparent handles off-silhouette.
    set_bsdf_input(bsdf, ["Roughness"], 0.5)
    set_bsdf_input(bsdf, ["Specular", "Specular IOR Level"], 0.08)
    links.new(bsdf.outputs["BSDF"], out.inputs["Surface"])
    return mat


def build_cylinder() -> bpy.types.Object:
    """Cylinder wall with continuous cylindrical UVs.

    u = 0 faces the camera (-Y). render_vial_labels.py rotates the object about Z
    to bring a chosen u (front_u) to the camera.
    """

    bm = bmesh.new()
    uv_layer = bm.loops.layers.uv.new("UVMap")

    top = LABEL_H / 2.0
    bot = -LABEL_H / 2.0
    ring_top: list = []
    ring_bot: list = []

    # +1 column so the seam has duplicate verts at u=0 and u=1 (clean UV wrap).
    for i in range(SEGMENTS + 1):
        u = i / SEGMENTS
        # u = 0 -> camera at -Y (angle -pi/2). Increasing u sweeps so text reads L->R.
        angle = -math.pi / 2.0 + u * 2.0 * math.pi
        x = RADIUS * math.cos(angle)
        y = RADIUS * math.sin(angle)
        ring_top.append((bm.verts.new((x, y, top)), u))
        ring_bot.append((bm.verts.new((x, y, bot)), u))

    bm.verts.ensure_lookup_table()

    for i in range(SEGMENTS):
        vt0, u0 = ring_top[i]
        vt1, u1 = ring_top[i + 1]
        vb1, _ = ring_bot[i + 1]
        vb0, _ = ring_bot[i]
        face = bm.faces.new((vb0, vb1, vt1, vt0))
        uvs = [(u0, 0.0), (u1, 0.0), (u1, 1.0), (u0, 1.0)]
        for loop, uv in zip(face.loops, uvs):
            loop[uv_layer].uv = uv

    for f in bm.faces:
        f.smooth = True

    mesh = bpy.data.meshes.new("LabelCylinderMesh")
    bm.to_mesh(mesh)
    bm.free()

    obj = bpy.data.objects.new("LabelCylinder", mesh)
    bpy.context.collection.objects.link(obj)
    return obj


def setup_scene() -> None:
    purge_orphans()
    scene = bpy.context.scene

    obj = build_cylinder()
    mat = make_label_material()
    obj.data.materials.append(mat)

    # ── Camera: orthographic, looking along +Y at the front of the cylinder ─────
    bpy.ops.object.camera_add(location=(0, -12, 0))
    cam = bpy.context.active_object
    cam.name = "Camera"
    cam.data.type = "ORTHO"
    cam.rotation_euler = (math.pi / 2.0, 0.0, 0.0)
    # Frame the label height with a hair of margin; sensor fits the taller axis.
    cam.data.ortho_scale = LABEL_H * 1.02
    scene.camera = cam

    # ── Lighting — soft, even, from camera side to keep the print legible ───────
    bpy.ops.object.light_add(type="AREA", location=(3, -6, 4))
    key = bpy.context.active_object
    key.name = "KeyLight"
    key.data.energy = 700
    key.data.size = 8
    key.rotation_euler = (math.radians(55), 0, math.radians(25))

    bpy.ops.object.light_add(type="AREA", location=(-4, -5, 2))
    fill = bpy.context.active_object
    fill.name = "FillLight"
    fill.data.energy = 300
    fill.data.size = 8

    bpy.ops.object.light_add(type="AREA", location=(0, -7, 0))
    front = bpy.context.active_object
    front.name = "FrontFill"
    front.data.energy = 250
    front.data.size = 10

    # ── Render settings ─────────────────────────────────────────────────────────
    scene.render.engine = "CYCLES"
    scene.cycles.samples = 96
    scene.cycles.use_denoising = True
    scene.render.resolution_x = RENDER_X
    scene.render.resolution_y = RENDER_Y
    scene.render.image_settings.file_format = "PNG"
    scene.render.image_settings.color_mode = "RGBA"
    scene.render.film_transparent = True

    if scene.world.node_tree:
        bg = scene.world.node_tree.nodes.get("Background")
        if bg:
            bg.inputs[0].default_value = (1, 1, 1, 0)
            bg.inputs[1].default_value = 0.0

    scene["label_box"] = LABEL_BOX
    scene["plate_path"] = str(PLATE)
    scene["render_x"] = RENDER_X
    scene["render_y"] = RENDER_Y

    OUT_BLEND.parent.mkdir(parents=True, exist_ok=True)
    bpy.ops.wm.save_as_mainfile(filepath=str(OUT_BLEND))
    print(f"Saved template: {OUT_BLEND}")
    print(f"  Cylinder: R={RADIUS:.3f}  H={LABEL_H:.3f}  circumference={CIRCUMFERENCE:.3f}")
    print(f"  Front view width (2R): {VISIBLE_W:.3f}  -> front aspect {VISIBLE_W/LABEL_H:.3f}")
    print(f"  Render:   {RENDER_X} × {RENDER_Y} px  (box aspect {LABEL_W_PX/LABEL_H_PX:.3f})")
    print(f"  Segments: {SEGMENTS}")


if __name__ == "__main__":
    setup_scene()
