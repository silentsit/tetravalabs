"""Parametric procedural molecule graphic."""

from __future__ import annotations

import random
from dataclasses import dataclass

from generator.geometry import Point, distance, regular_polygon


@dataclass(frozen=True)
class MoleculeNode:
    point: Point
    radius: float
    fill: str
    stippled: bool = False


@dataclass(frozen=True)
class MoleculeGraphic:
    nodes: tuple[MoleculeNode, ...]
    bonds: tuple[tuple[int, int], ...]


@dataclass(frozen=True)
class MoleculeConfig:
    """Controls the decorative molecule layout."""

    center: Point = Point(900, 470)
    nodes: int = 18
    branches: int = 5
    radius: float = 54
    seed: int = 42


class Molecule:
    """Build a stylized hex-ring molecule from parametric settings."""

    def __init__(self, config: MoleculeConfig | None = None, **overrides: object) -> None:
        base = config or MoleculeConfig()
        values = {
            "center": base.center,
            "nodes": base.nodes,
            "branches": base.branches,
            "radius": base.radius,
            "seed": base.seed,
        }
        values.update(overrides)
        self.config = MoleculeConfig(
            center=values["center"],
            nodes=int(values["nodes"]),
            branches=int(values["branches"]),
            radius=float(values["radius"]),
            seed=int(values["seed"]),
        )

    def build(self) -> MoleculeGraphic:
        rng = random.Random(self.config.seed)
        ring_count = max(3, self.config.branches)
        ring_specs = self._ring_specs(rng, ring_count)

        nodes: list[MoleculeNode] = []
        bonds: set[tuple[int, int]] = set()
        ring_indices: list[list[int]] = []

        for ring_index, (center, radius, rotation) in enumerate(ring_specs):
            vertices = regular_polygon(center, radius, 6, rotation)
            current_ring: list[int] = []
            for vertex_index, vertex in enumerate(vertices):
                if len(nodes) >= self.config.nodes:
                    break
                node_index = len(nodes)
                current_ring.append(node_index)
                nodes.append(
                    MoleculeNode(
                        point=vertex,
                        radius=10 + ((ring_index + vertex_index) % 4) * 2.5,
                        fill="url(#molecule_node_alt)"
                        if (ring_index + vertex_index + self.config.seed) % 3 == 0
                        else "url(#molecule_node_gradient)",
                        stippled=(ring_index + vertex_index) % 4 == 1,
                    )
                )
            if not current_ring:
                continue
            ring_indices.append(current_ring)
            for index in range(len(current_ring)):
                start = current_ring[index]
                end = current_ring[(index + 1) % len(current_ring)]
                bonds.add(tuple(sorted((start, end))))

        for left, right in zip(ring_indices, ring_indices[1:]):
            bridge_start = min(left, key=lambda index: nodes[index].point.y)
            bridge_end = min(right, key=lambda index: nodes[index].point.y)
            bonds.add(tuple(sorted((bridge_start, bridge_end))))

        bridge_distance = self.config.radius * 1.35
        for index, node in enumerate(nodes):
            if index % 5 != 0:
                continue
            for other_index, other in enumerate(nodes):
                if other_index <= index:
                    continue
                if distance(node.point, other.point) <= bridge_distance:
                    bonds.add(tuple(sorted((index, other_index))))

        return MoleculeGraphic(nodes=tuple(nodes), bonds=tuple(sorted(bonds)))

    def _ring_specs(self, rng: random.Random, ring_count: int) -> list[tuple[Point, float, float]]:
        specs: list[tuple[Point, float, float]] = []
        span = self.config.radius * (ring_count + 1.4)
        start_y = self.config.center.y - span / 2

        for index in range(ring_count):
            progress = index / max(ring_count - 1, 1)
            y = start_y + span * progress + rng.uniform(-8, 8)
            x = self.config.center.x + rng.uniform(-42, 42) + (progress - 0.5) * 24
            ring_radius = self.config.radius + rng.uniform(-6, 6)
            rotation = rng.uniform(-18, 18)
            specs.append((Point(x, y), ring_radius, rotation))
        return specs


DEFAULT_MOLECULE = Molecule(
    center=Point(900, 470),
    nodes=18,
    branches=5,
    radius=54,
    seed=42,
)


def build_molecule_graphic(config: MoleculeConfig | None = None) -> MoleculeGraphic:
    """Build the default decorative molecule graphic."""

    molecule = Molecule(config) if config else DEFAULT_MOLECULE
    return molecule.build()
