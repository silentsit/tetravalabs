"""
Photo-plate vial scene: curved label mesh for alpha renders.

Background plate (seashell photo) is composited in Python after render.

  blender --background --python setup_vial_scene.py
"""

from __future__ import annotations

import math
from pathlib import Path

import bpy
from mathutils import Vector

ROOT = Path(__file__).resolve().parents[1]
OUT_BLEND = ROOT / "assets" / "vial_template.blend"
PLATE = ROOT / "assets" / "seashell-vial-1000x1500.png"

# Label target on 1000×1500 seashell plate (x, y, w, h)
LABEL_BOX = (292, 572, 416, 392)


def purge_orphans() -> None:
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete()
    for block in (bpy.data.meshes, bpy.data.materials, bpy.data.images, bpy.data.cameras):
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
    set_bsdf_input(bsdf, ["Roughness"], 0.45)
    links.new(bsdf.outputs["BSDF"], out.inputs["Surface"])

    mat.blend_method = "BLEND"
    return mat


def setup_scene() -> None:
    purge_orphans()
    scene = bpy.context.scene

    label_w, label_h = 4.16, 3.92  # scene units ~= label box aspect
    bpy.ops.mesh.primitive_plane_add(size=1, location=(0, 0, 0))
    plane = bpy.context.active_object
    plane.name = "LabelMesh"
    plane.scale = (label_w / 2, label_h / 2, 1)
    bpy.ops.object.transform_apply(scale=True)

    bpy.ops.object.mode_set(mode="EDIT")
    bpy.ops.mesh.subdivide(number_cuts=48)
    bpy.ops.object.mode_set(mode="OBJECT")

    bend = plane.modifiers.new(name="Bend", type="SIMPLE_DEFORM")
    bend.deform_method = "BEND"
    bend.deform_axis = "X"
    bend.angle = math.radians(42)

    mat = make_label_material()
    plane.data.materials.append(mat)

    # Camera — ortho, frames curved label
    bpy.ops.object.camera_add(location=(0, -10, 0))
    cam = bpy.context.active_object
    cam.name = "Camera"
    cam.data.type = "ORTHO"
    cam.data.ortho_scale = label_h * 1.35
    cam.rotation_euler = (math.radians(90), 0, 0)
    scene.camera = cam

    # Soft lights
    bpy.ops.object.light_add(type="AREA", location=(2, -3, 3))
    key = bpy.context.active_object
    key.data.energy = 280
    key.data.size = 4

    bpy.ops.object.light_add(type="AREA", location=(-2, -3, 1))
    fill = bpy.context.active_object
    fill.data.energy = 120
    fill.data.size = 3

    scene.render.engine = "CYCLES"
    scene.cycles.samples = 48
    scene.cycles.use_denoising = True
    scene.render.resolution_x = 832  # 2× label width for quality
    scene.render.resolution_y = 784
    scene.render.image_settings.file_format = "PNG"
    scene.render.image_settings.color_mode = "RGBA"
    scene.render.film_transparent = True

    scene.world.color = (1, 1, 1)
    if scene.world.node_tree:
        bg = scene.world.node_tree.nodes.get("Background")
        if bg:
            bg.inputs[0].default_value = (1, 1, 1, 0)

    # Store plate metadata on scene
    scene["label_box"] = LABEL_BOX
    scene["plate_path"] = str(PLATE)

    OUT_BLEND.parent.mkdir(parents=True, exist_ok=True)
    bpy.ops.wm.save_as_mainfile(filepath=str(OUT_BLEND))
    print(f"Saved template: {OUT_BLEND}")


if __name__ == "__main__":
    setup_scene()
