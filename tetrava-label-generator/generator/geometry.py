"""Shared geometry helpers."""

from __future__ import annotations

import math
from dataclasses import dataclass


@dataclass(frozen=True)
class Point:
    x: float
    y: float


def distance(first: Point, second: Point) -> float:
    return math.hypot(first.x - second.x, first.y - second.y)


def regular_polygon(
    center: Point,
    radius: float,
    sides: int,
    rotation_degrees: float = 0,
) -> list[Point]:
    return [
        Point(
            center.x + radius * math.cos(math.radians(rotation_degrees + (360 / sides) * index)),
            center.y + radius * math.sin(math.radians(rotation_degrees + (360 / sides) * index)),
        )
        for index in range(sides)
    ]


def points_attr(points: list[Point]) -> str:
    return " ".join(f"{point.x:.1f},{point.y:.1f}" for point in points)
