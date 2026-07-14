#!/usr/bin/env python3
"""Perspective-warp a screen recording into the approved three-quarter laptop."""

from __future__ import annotations

import argparse
import subprocess
from pathlib import Path

import cv2
import numpy as np


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


def build(frame_path: Path, matte_path: Path, video_path: Path, webm_path: Path, mp4_path: Path) -> None:
    frame = cv2.imread(str(frame_path), cv2.IMREAD_COLOR)
    matte = cv2.imread(str(matte_path), cv2.IMREAD_UNCHANGED)
    capture = cv2.VideoCapture(str(video_path))
    if frame is None or matte is None or not capture.isOpened():
        raise SystemExit("Unable to read the laptop frame, matte, or source video.")

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
    left, top, crop_width, crop_height = cv2.boundingRect(
        max(foreground_contours, key=cv2.contourArea)
    )
    padding = 12
    crop = (
        max(0, left - padding),
        max(0, top - padding),
        min(frame.shape[1], left + crop_width + padding),
        min(frame.shape[0], top + crop_height + padding),
    )

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

    source_width = int(capture.get(cv2.CAP_PROP_FRAME_WIDTH))
    source_height = int(capture.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fps = capture.get(cv2.CAP_PROP_FPS) or 25.0
    source = np.array(
        [[0, 0], [source_width - 1, 0], [source_width - 1, source_height - 1], [0, source_height - 1]],
        dtype=np.float32,
    )
    transform = cv2.getPerspectiveTransform(source, destination)

    screen_mask = np.zeros(frame.shape[:2], dtype=np.uint8)
    cv2.fillConvexPoly(screen_mask, destination.astype(np.int32), 255)
    screen_mask = cv2.dilate(screen_mask, np.ones((3, 3), np.uint8), iterations=2)
    screen_mask = cv2.bitwise_or(screen_mask, chroma)

    x1, y1, x2, y2 = crop
    output_width = x2 - x1
    output_height = y2 - y1
    output_width -= output_width % 2
    output_height -= output_height % 2
    x2 = x1 + output_width
    y2 = y1 + output_height

    if matte.shape[1] != output_width or matte.shape[0] != output_height:
        matte = cv2.resize(matte, (output_width, output_height), interpolation=cv2.INTER_AREA)
    alpha = matte[:, :, 3] if matte.shape[2] == 4 else np.full((output_height, output_width), 255, np.uint8)

    webm_path.parent.mkdir(parents=True, exist_ok=True)
    mp4_path.parent.mkdir(parents=True, exist_ok=True)
    webm = subprocess.Popen(
        [
            "/opt/homebrew/bin/ffmpeg", "-y", "-loglevel", "warning",
            "-f", "rawvideo", "-pix_fmt", "bgra", "-s", f"{output_width}x{output_height}",
            "-r", f"{fps:.6f}", "-i", "pipe:0", "-an", "-c:v", "libvpx-vp9",
            "-crf", "30", "-b:v", "0", "-pix_fmt", "yuva420p", "-auto-alt-ref", "0",
            str(webm_path),
        ],
        stdin=subprocess.PIPE,
    )
    mp4 = subprocess.Popen(
        [
            "/opt/homebrew/bin/ffmpeg", "-y", "-loglevel", "warning",
            "-f", "rawvideo", "-pix_fmt", "bgr24", "-s", f"{output_width}x{output_height}",
            "-r", f"{fps:.6f}", "-i", "pipe:0", "-an", "-c:v", "libx264",
            "-preset", "slow", "-crf", "21", "-pix_fmt", "yuv420p", "-movflags", "+faststart",
            str(mp4_path),
        ],
        stdin=subprocess.PIPE,
    )

    paper = np.empty((output_height, output_width, 3), dtype=np.uint8)
    paper[:] = (235, 240, 243)

    while True:
        ok, source_frame = capture.read()
        if not ok:
            break
        warped = cv2.warpPerspective(source_frame, transform, (frame.shape[1], frame.shape[0]))
        composite = np.where(screen_mask[..., None] > 0, warped, frame)
        cropped = composite[y1:y2, x1:x2]
        bgra = cv2.cvtColor(cropped, cv2.COLOR_BGR2BGRA)
        bgra[:, :, 3] = alpha
        opaque = np.where(alpha[..., None] > 0, cropped, paper)
        webm.stdin.write(bgra.tobytes())
        mp4.stdin.write(opaque.tobytes())

    capture.release()
    webm.stdin.close()
    mp4.stdin.close()
    if webm.wait() != 0 or mp4.wait() != 0:
        raise SystemExit("FFmpeg failed while encoding the laptop video.")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--frame", type=Path, required=True)
    parser.add_argument("--matte", type=Path, required=True)
    parser.add_argument("--video", type=Path, required=True)
    parser.add_argument("--webm", type=Path, required=True)
    parser.add_argument("--mp4", type=Path, required=True)
    args = parser.parse_args()
    build(args.frame, args.matte, args.video, args.webm, args.mp4)


if __name__ == "__main__":
    main()
