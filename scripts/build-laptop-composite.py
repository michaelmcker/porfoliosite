#!/usr/bin/env python3
"""Composite a replaceable screenshot into the approved three-quarter laptop."""

from __future__ import annotations

import argparse
from pathlib import Path

import cv2
import numpy as np
from PIL import Image, ImageDraw


def order_quad(points: np.ndarray) -> np.ndarray:
    points = points.astype(np.float32)
    sums = points.sum(axis=1)
    differences = np.diff(points, axis=1).reshape(-1)
    return np.array(
        [
            points[np.argmin(sums)],
            points[np.argmin(differences)],
            points[np.argmax(sums)],
            points[np.argmax(differences)],
        ],
        dtype=np.float32,
    )


def composite(frame_path: Path, screenshot_path: Path, output_path: Path) -> None:
    frame = cv2.imread(str(frame_path), cv2.IMREAD_COLOR)
    screenshot = cv2.imread(str(screenshot_path), cv2.IMREAD_COLOR)
    if frame is None or screenshot is None:
        raise SystemExit("Unable to read the frame or screenshot image.")

    corner_color = np.median(
        np.array([frame[0, 0], frame[0, -1], frame[-1, 0], frame[-1, -1]]), axis=0
    )
    foreground = (
        np.linalg.norm(frame.astype(np.float32) - corner_color.astype(np.float32), axis=2) > 18
    ).astype(np.uint8) * 255
    foreground = cv2.morphologyEx(foreground, cv2.MORPH_CLOSE, np.ones((9, 9), np.uint8))
    foreground_contours, _ = cv2.findContours(
        foreground, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE
    )
    foreground_bounds = cv2.boundingRect(max(foreground_contours, key=cv2.contourArea))

    blue, green, red = cv2.split(frame)
    chroma = (
        (green > 100)
        & ((green.astype(np.int16) - red.astype(np.int16)) > 40)
        & ((green.astype(np.int16) - blue.astype(np.int16)) > 40)
    ).astype(np.uint8) * 255

    contours, _ = cv2.findContours(chroma, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    contour = max(contours, key=cv2.contourArea)
    polygon = cv2.approxPolyDP(contour, 0.01 * cv2.arcLength(contour, True), True)
    if len(polygon) != 4:
        raise SystemExit("The chroma screen did not resolve to four corners.")

    destination = order_quad(polygon.reshape(4, 2))
    source_height, source_width = screenshot.shape[:2]
    source = np.array(
        [[0, 0], [source_width - 1, 0], [source_width - 1, source_height - 1], [0, source_height - 1]],
        dtype=np.float32,
    )
    transform = cv2.getPerspectiveTransform(source, destination)
    warped = cv2.warpPerspective(screenshot, transform, (frame.shape[1], frame.shape[0]))

    screen_mask = np.zeros(frame.shape[:2], dtype=np.uint8)
    cv2.fillConvexPoly(screen_mask, destination.astype(np.int32), 255)
    screen_mask = cv2.dilate(screen_mask, np.ones((3, 3), np.uint8), iterations=2)
    screen_mask = cv2.bitwise_or(screen_mask, chroma)
    composite_image = np.where(screen_mask[..., None] > 0, warped, frame)

    rgba = Image.fromarray(cv2.cvtColor(composite_image, cv2.COLOR_BGR2RGBA))
    width, height = rgba.size
    for seed in [(0, 0), (width - 1, 0), (0, height - 1), (width - 1, height - 1)]:
        pixel = rgba.getpixel(seed)
        if pixel[3]:
            ImageDraw.floodfill(rgba, seed, (pixel[0], pixel[1], pixel[2], 0), thresh=34)

    left, top, crop_width, crop_height = foreground_bounds
    padding = 12
    rgba = rgba.crop(
        (
            max(0, left - padding),
            max(0, top - padding),
            min(width, left + crop_width + padding),
            min(height, top + crop_height + padding),
        )
    )

    output_path.parent.mkdir(parents=True, exist_ok=True)
    rgba.save(output_path, optimize=True)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--frame", type=Path, required=True)
    parser.add_argument("--screenshot", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    composite(args.frame, args.screenshot, args.output)


if __name__ == "__main__":
    main()
