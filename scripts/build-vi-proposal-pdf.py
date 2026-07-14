#!/usr/bin/env python3
"""Rebuild the portfolio proposal through the real VI inventory and map pipeline."""

from pathlib import Path
import subprocess


VI_REPO = Path.home() / "VI Automation"
BUILDER = "scripts/build-portfolio-proposal-sample.ts"
OUTPUT = Path(__file__).resolve().parents[1] / "output/pdf/vertical-impression-local-proposal-sample.pdf"


def build() -> None:
    subprocess.run(
        ["npx", "tsx", BUILDER],
        cwd=VI_REPO,
        check=True,
    )
    if not OUTPUT.exists() or OUTPUT.stat().st_size == 0:
        raise RuntimeError(f"Proposal builder did not create {OUTPUT}")
    print(OUTPUT)


if __name__ == "__main__":
    build()
