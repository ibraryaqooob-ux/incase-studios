#!/usr/bin/env python3
"""
Generate lightweight 700px JPEG thumbnails in assets/thumbs/ for all poster images
referenced in js/catalog-data.js, keeping the original 300 DPI master files in assets/
intact for the 3D viewer, Retina canvas, and zoom.
"""

import os
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CATALOG_PATH = ROOT / "js" / "catalog-data.js"
THUMBS_DIR = ROOT / "assets" / "thumbs"


def main():
    THUMBS_DIR.mkdir(parents=True, exist_ok=True)
    text = CATALOG_PATH.read_text(encoding="utf-8")

    # Collect all image and triptychImages paths
    images = set(re.findall(r'"image":\s*"([^"]+)"', text))
    for block in re.findall(r'"triptychImages":\s*\[([^\]]+)\]', text):
        images.update(re.findall(r'"([^"]+)"', block))

    total_src_bytes = 0
    total_thumb_bytes = 0
    generated = 0

    for rel_path in sorted(images):
        src = ROOT / rel_path
        if not src.exists():
            print(f"SKIP (missing): {rel_path}")
            continue

        out_path = THUMBS_DIR / f"{src.stem}.jpg"
        total_src_bytes += src.stat().st_size

        # Regenerate if missing or older than source
        if not out_path.exists() or out_path.stat().st_mtime < src.stat().st_mtime:
            subprocess.run(
                [
                    "sips",
                    "-Z", "700",
                    "-s", "format", "jpeg",
                    "-s", "formatOptions", "85",
                    str(src),
                    "--out", str(out_path),
                ],
                check=True,
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL,
            )
            generated += 1

        total_thumb_bytes += out_path.stat().st_size

    src_mb = total_src_bytes / (1024 * 1024)
    thumb_mb = total_thumb_bytes / (1024 * 1024)
    print(f"Processed {len(images)} unique images ({generated} newly generated).")
    print(f"Source total: {src_mb:.2f} MB -> Thumbnails total: {thumb_mb:.2f} MB")


if __name__ == "__main__":
    main()
