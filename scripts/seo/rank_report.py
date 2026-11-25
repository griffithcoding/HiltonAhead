#!/usr/bin/env python3
"""
Weekly Google ranking snapshot + report for hiltonahead.com.

Input: a DataForSEO Labs `ranked_keywords/live` response saved as JSON
(request: target=hiltonahead.com, location_code=2840, language_code=en,
filters=[ranked_serp_element.serp_item.rank_absolute <= 100], limit=1000).
Either the bare result object (has "items") or the full API envelope
(has "tasks") is accepted.

Usage:
  python3 scripts/seo/rank_report.py <response.json> [--date YYYY-MM-DD]

Writes docs/seo/rank-tracking/<date>.tsv (volume, rank, keyword, url) and
prints a Markdown report comparing it with the most recent earlier
snapshot: totals, the tracked targets in targets.tsv, biggest movers and
new/lost page-1 keywords. Standard library only.
"""
from __future__ import annotations

import csv
import datetime as dt
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
TRACK_DIR = ROOT / "docs" / "seo" / "rank-tracking"
TARGETS = TRACK_DIR / "targets.tsv"


def load_items(path: Path) -> list[dict]:
    data = json.loads(path.read_text())
    if isinstance(data, list):  # MCP text-wrapper: [{"type":"text","text":"{...}"}]
        data = json.loads(data[0]["text"])
    if "tasks" in data:
        data = data["tasks"][0]["result"][0]
    return data.get("items") or []


def to_rows(items: list[dict]) -> dict[str, tuple[int, int, str]]:
    """keyword -> (volume, best rank, url). Keeps the best rank per keyword."""
    rows: dict[str, tuple[int, int, str]] = {}
    for it in items:
        kd = it["keyword_data"]
        se = it["ranked_serp_element"]["serp_item"]
        kw = kd["keyword"].strip().lower()
        vol = (kd.get("keyword_info") or {}).get("search_volume") or 0
        rank = se.get("rank_absolute") or 999
        url = se.get("relative_url") or se.get("url") or ""
        if kw not in rows or rank < rows[kw][1]:
            rows[kw] = (vol, rank, url)
    return rows


def write_snapshot(rows: dict, out: Path) -> None:
    with out.open("w", newline="") as f:
        w = csv.writer(f, delimiter="\t")
        w.writerow(["volume", "rank", "keyword", "url"])
        for kw, (vol, rank, url) in sorted(rows.items(), key=lambda r: (-r[1][0], r[1][1])):
            w.writerow([vol, rank, kw, url])


def read_snapshot(path: Path) -> dict[str, tuple[int, int, str]]:
    with path.open() as f:
        r = csv.DictReader(f, delimiter="\t")
        return {row["keyword"]: (int(row["volume"]), int(row["rank"]), row["url"]) for row in r}


def fmt_rank(r: int | None) -> str:
    return "—" if r is None else f"#{r}"


def delta(old: int | None, new: int | None) -> str:
    if old is None and new is None:
        return ""
    if old is None:
        return "new"
    if new is None:
        return "lost"
    d = old - new  # positive = moved up
    return "=" if d == 0 else (f"▲{d}" if d > 0 else f"▼{-d}")


def main(argv: list[str]) -> int:
    if len(argv) < 2:
        print(__doc__)
        return 2
    date = dt.date.today().isoformat()
    if "--date" in argv:
        date = argv[argv.index("--date") + 1]
    rows = to_rows(load_items(Path(argv[1])))
    if not rows:
        print("No ranked keywords in input — check the API response.", file=sys.stderr)
        return 1

    TRACK_DIR.mkdir(parents=True, exist_ok=True)
    out = TRACK_DIR / f"{date}.tsv"
    write_snapshot(rows, out)

    prior = sorted(p for p in TRACK_DIR.glob("????-??-??.tsv") if p.stem < date)
    prev = read_snapshot(prior[-1]) if prior else {}
    prev_label = prior[-1].stem if prior else "none"

    def count(rs, n):
        return sum(1 for _, r, _ in rs.values() if r <= n)

    print(f"## Hilton Ahead rankings — {date} (vs {prev_label})\n")
    print("| Metric | Previous | Now |\n|---|---|---|")
    for label, n in (("Keywords in top 3", 3), ("Keywords on page 1 (top 10)", 10),
                     ("Keywords in top 20", 20), ("Keywords in top 100", 100)):
        print(f"| {label} | {count(prev, n) if prev else '—'} | {count(rows, n)} |")

    if TARGETS.exists():
        print("\n### Tracked targets\n")
        print("| Keyword | Target page | Previous | Now | Change | Ranking URL |\n|---|---|---|---|---|---|")
        with TARGETS.open() as f:
            for t in csv.DictReader(f, delimiter="\t"):
                kw = t["keyword"].strip().lower()
                o = prev.get(kw, (0, None, ""))[1]
                n = rows.get(kw, (0, None, ""))[1]
                url = rows.get(kw, (0, None, ""))[2]
                flag = "" if not url or url == t["page"] else " ⚠ other page"
                change = delta(o, n) if prev else "baseline"
                print(f"| {kw} | {t['page']} | {fmt_rank(o)} | {fmt_rank(n)} | {change} | {url or '—'}{flag} |")

    if prev:
        moves = []
        for kw, (vol, r, url) in rows.items():
            if kw in prev:
                moves.append((prev[kw][1] - r, vol, kw, prev[kw][1], r, url))
        moves.sort(key=lambda m: (-m[0] * max(m[1], 10)))
        print("\n### Biggest climbers (volume-weighted)\n")
        for d, vol, kw, o, n, url in [m for m in moves if m[0] > 0][:10]:
            print(f"- **{kw}** ({vol}/mo): #{o} → #{n} on {url}")
        print("\n### Biggest drops\n")
        for d, vol, kw, o, n, url in sorted([m for m in moves if m[0] < 0], key=lambda m: m[0] * max(m[1], 10))[:10]:
            print(f"- **{kw}** ({vol}/mo): #{o} → #{n} on {url}")
        new_p1 = sorted((kw for kw, (_, r, _) in rows.items() if r <= 10 and prev.get(kw, (0, 999, ""))[1] > 10),
                        key=lambda k: -rows[k][0])
        lost_p1 = sorted((kw for kw, (_, r, _) in prev.items() if r <= 10 and rows.get(kw, (0, 999, ""))[1] > 10),
                         key=lambda k: -prev[k][0])
        print("\n### New on page 1: " + (", ".join(f"{k} (#{rows[k][1]})" for k in new_p1[:15]) or "none"))
        print("### Fell off page 1: " + (", ".join(lost_p1[:15]) or "none"))

    print(f"\nSnapshot written: {out.relative_to(ROOT)} ({len(rows)} keywords)")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
