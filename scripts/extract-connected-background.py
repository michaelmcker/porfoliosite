#!/usr/bin/env python3
"""Remove only a near-uniform background connected to an image border."""

from __future__ import annotations

import argparse
from collections import deque
from pathlib import Path

from PIL import Image, ImageFilter


def color_distance(left: tuple[int, int, int], right: tuple[int, int, int]) -> int:
    return max(abs(left[index] - right[index]) for index in range(3))


def extract(input_path: Path, output_path: Path, tolerance: int, feather: float) -> None:
    source = Image.open(input_path).convert("RGBA")
    width, height = source.size
    pixels = source.load()
    border_samples = [
        pixels[0, 0][:3],
        pixels[width - 1, 0][:3],
        pixels[0, height - 1][:3],
        pixels[width - 1, height - 1][:3],
    ]
    key = tuple(sum(sample[channel] for sample in border_samples) // len(border_samples) for channel in range(3))

    background = Image.new("L", source.size, 0)
    background_pixels = background.load()
    queue: deque[tuple[int, int]] = deque()

    for x in range(width):
        queue.append((x, 0))
        queue.append((x, height - 1))
    for y in range(height):
        queue.append((0, y))
        queue.append((width - 1, y))

    while queue:
        x, y = queue.popleft()
        if background_pixels[x, y]:
            continue
        if color_distance(pixels[x, y][:3], key) > tolerance:
            continue
        background_pixels[x, y] = 255
        if x > 0:
            queue.append((x - 1, y))
        if x + 1 < width:
            queue.append((x + 1, y))
        if y > 0:
            queue.append((x, y - 1))
        if y + 1 < height:
            queue.append((x, y + 1))

    foreground_alpha = background.point(lambda value: 255 - value)
    if feather > 0:
        foreground_alpha = foreground_alpha.filter(ImageFilter.GaussianBlur(feather))
    source.putalpha(foreground_alpha)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    source.save(output_path)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("input", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--tolerance", type=int, default=26)
    parser.add_argument("--feather", type=float, default=0.7)
    args = parser.parse_args()
    extract(args.input, args.output, args.tolerance, args.feather)


if __name__ == "__main__":
    main()
