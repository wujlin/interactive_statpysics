#!/usr/bin/env python3
"""
Create a new knowledge-base card from templates.

Usage:
    python scripts/new_card.py concept "化学势 Chemical potential"
    python scripts/new_card.py derivation "巨正则配分函数的导出"
    python scripts/new_card.py method "Gibbs sampling"
    python scripts/new_card.py mapping "Logit选择 ↔ Boltzmann分布"
"""

from __future__ import annotations

import sys
from pathlib import Path


TEMPLATE_MAP = {
    "concept": Path("kb/concepts/_template.md"),
    "derivation": Path("kb/derivations/_template.md"),
    "method": Path("kb/methods/_template.md"),
    "mapping": Path("kb/urban-mapping/_template.md"),
}

DEST_DIR = {
    "concept": Path("kb/concepts"),
    "derivation": Path("kb/derivations"),
    "method": Path("kb/methods"),
    "mapping": Path("kb/urban-mapping"),
}


def slugify(name: str) -> str:
    # Keep it simple: use the title as filename (Obsidian friendly)
    bad = ['/', '\\', ':', '*', '?', '"', '<', '>', '|']
    for ch in bad:
        name = name.replace(ch, " ")
    name = " ".join(name.split()).strip()
    if not name:
        raise ValueError("Empty title")
    return name + ".md"


def main(argv: list[str]) -> int:
    if len(argv) < 3:
        print(__doc__.strip())
        return 2
    kind = argv[1].lower().strip()
    title = " ".join(argv[2:]).strip()

    if kind not in TEMPLATE_MAP:
        print(f"Unknown kind: {kind}. Choose from {list(TEMPLATE_MAP)}")
        return 2

    template_path = TEMPLATE_MAP[kind]
    if not template_path.exists():
        print(f"Template not found: {template_path}")
        return 1

    dest_dir = DEST_DIR[kind]
    dest_dir.mkdir(parents=True, exist_ok=True)

    filename = slugify(title)
    dest_path = dest_dir / filename
    if dest_path.exists():
        print(f"File already exists: {dest_path}")
        return 1

    text = template_path.read_text(encoding="utf-8")
    text = text.replace("<概念名>", title).replace("<推导标题>", title).replace("<方法/算法名>", title)
    text = text.replace("<统计物理概念> → <城市问题>", title)

    dest_path.write_text(text, encoding="utf-8")
    print(f"Created: {dest_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
