#!/usr/bin/env python3
from __future__ import annotations

import argparse
import re
import sys
from dataclasses import dataclass
from pathlib import Path


TAG_RE = re.compile(r"\\tag\s*\{\s*([0-9]+(?:\.[0-9]+)?[a-z]?)\s*\}")
EQ_EXTRACT_RE = re.compile(r"([0-9]+(?:\.[0-9]+)?[a-z]?)")


@dataclass(frozen=True)
class Match:
    path: Path
    line_no: int
    line: str


def default_book_root() -> Path:
    repo_root = Path(__file__).resolve().parents[2]
    return repo_root / "Book" / "An Introduction to Statistical Mechanics and Thermodynamics" / "md"


def parse_eq(raw: str) -> str:
    raw = raw.strip()
    m = EQ_EXTRACT_RE.search(raw)
    if not m:
        raise ValueError(f"无法解析公式编号：{raw!r}")
    return m.group(1)


def iter_markdown_files(book_root: Path) -> list[Path]:
    if not book_root.exists():
        raise FileNotFoundError(f"book_root 不存在：{book_root}")
    if not book_root.is_dir():
        raise NotADirectoryError(f"book_root 不是目录：{book_root}")
    return sorted([p for p in book_root.glob("*.md") if p.is_file()])


def find_eq(eq: str, book_root: Path) -> list[Match]:
    eq_norm = eq.strip()
    hits: list[Match] = []
    for p in iter_markdown_files(book_root):
        try:
            text = p.read_text(encoding="utf-8", errors="ignore")
        except OSError:
            continue

        for i, line in enumerate(text.splitlines(), start=1):
            for m in TAG_RE.finditer(line):
                if m.group(1) == eq_norm:
                    hits.append(Match(path=p, line_no=i, line=line.rstrip("\n")))
                    break
    return hits


def format_match(m: Match, book_root: Path) -> str:
    rel = m.path.relative_to(book_root)
    preview = m.line.strip()
    if len(preview) > 160:
        preview = preview[:157] + "..."
    return f"{rel}:{m.line_no}  {preview}"


def main(argv: list[str]) -> int:
    parser = argparse.ArgumentParser(description="在 MinerU 扫描版 Swendsen Markdown 中定位公式编号（\\tag {...}）。")
    parser.add_argument("eq", help="公式编号，例如 19.53")
    parser.add_argument("--book-root", type=Path, default=default_book_root(), help="Swendsen 章节 md 目录")
    parser.add_argument("--context", type=int, default=0, help="输出匹配行前后各 N 行（默认 0）")
    args = parser.parse_args(argv)

    try:
        eq = parse_eq(args.eq)
    except ValueError as e:
        print(str(e), file=sys.stderr)
        return 2

    hits = find_eq(eq, args.book_root)
    if not hits:
        print(f"未找到公式：{eq}（在 {args.book_root}）", file=sys.stderr)
        return 1

    for h in hits:
        print(format_match(h, args.book_root))
        if args.context <= 0:
            continue

        try:
            lines = h.path.read_text(encoding="utf-8", errors="ignore").splitlines()
        except OSError:
            continue

        start = max(1, h.line_no - args.context)
        end = min(len(lines), h.line_no + args.context)
        for ln in range(start, end + 1):
            prefix = ">" if ln == h.line_no else " "
            print(f"{prefix} {ln:>6}  {lines[ln - 1]}")
        print()

    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))

