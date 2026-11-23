"""Independent, deterministic content and arithmetic checks for DATA DETECTIVE."""
from __future__ import annotations

import json
import math
import re
from html.parser import HTMLParser
from pathlib import Path
from statistics import mean, median

ROOT = Path(__file__).resolve().parents[1]


class Document(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.slides: list[str] = []
        self.ids: set[str] = set()
        self.links: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        a = dict(attrs)
        if a.get("id"):
            self.ids.add(a["id"])
        if tag == "section" and "slide" in (a.get("class") or "").split():
            self.slides.append(a.get("id") or "")
        if tag == "a" and a.get("href"):
            self.links.append(a["href"])


def run() -> dict[str, bool]:
    html = (ROOT / "site/index.html").read_text(encoding="utf-8")
    lab_html = (ROOT / "site/lab.html").read_text(encoding="utf-8")
    js = (ROOT / "site/app.js").read_text(encoding="utf-8")
    outline = (ROOT / "outline.md").read_text(encoding="utf-8")
    index = (ROOT / "wiki/index.md").read_text(encoding="utf-8")
    deck, lab = Document(), Document()
    deck.feed(html)
    lab.feed(lab_html)
    salary = [40, 45, 50, 55, 400]
    ice, drowning = [40, 50, 65, 80], [2, 3, 5, 6]
    mx, my = mean(ice), mean(drowning)
    correlation = sum((x - mx) * (y - my) for x, y in zip(ice, drowning)) / math.sqrt(
        sum((x - mx) ** 2 for x in ice) * sum((y - my) ** 2 for y in drowning)
    )
    rates = [(19, 20), (80, 100), (2, 10), (1, 10), (21, 30), (81, 110)]
    ids = set(re.findall(r"EVID-\d\d-\d\d", html + js))
    question_block = js.split("const questions=[", 1)[1].split("\n];", 1)[0]
    cards = list((ROOT / "cards").glob("EVID-*.md"))
    sources = (ROOT / "sources.md").read_text(encoding="utf-8")
    return {
        "fourteen_slides": deck.slides == [f"slide-{i:02d}" for i in range(1, 15)],
        "outline_approved": "狀態：使用者已確認" in outline,
        "five_cases": all(f"CASE 0{i}" in html and f"CASE-0{i}" in index for i in range(1, 6)),
        "ten_questions": question_block.count('"EVID-') == 10,
        "five_cross_case_questions": sum(len(re.findall(r"EVID-\d\d-\d\d", line)) > 1 for line in question_block.splitlines()) == 5,
        "evidence_targets": all(e in lab.ids and (ROOT / "cards" / f"{e}.md").exists() for e in ids),
        "card_trace_chain": all(
            all(re.search(pattern, text) for pattern in [r"SRC-0[1-7]", r"STAT-0[1-5]-0[1-2]", r"SLIDE-\d\d", r"TEST-\d\d-\d\d"])
            and all(s in sources for s in re.findall(r"SRC-0[1-7]", text))
            for text in (p.read_text(encoding="utf-8") for p in cards)
        ),
        "no_unapproved_source": "SRC-08" not in html + lab_html + js,
        "local_storage_and_reset": "localStorage.getItem" in js and "localStorage.setItem" in js and 'querySelector("#reset")' in js,
        "score_rules": all(s in js for s in ["score>=90", "score>=70", "score>=60", "state.bestScore", "state.lastScore"]),
        "growth_rate": round((100 - 95) / 95 * 100, 2) == 5.26,
        "mean_and_median": mean(salary) == 118 and median(salary) == 50,
        "case_04_correlation": round(correlation, 2) == 0.99,
        "case_05_totals": rates[0][0] + rates[2][0] == rates[4][0] and rates[0][1] + rates[2][1] == rates[4][1] and rates[1][0] + rates[3][0] == rates[5][0] and rates[1][1] + rates[3][1] == rates[5][1],
        "simpson_reversal": rates[0][0] / rates[0][1] > rates[1][0] / rates[1][1] and rates[2][0] / rates[2][1] > rates[3][0] / rates[3][1] and rates[4][0] / rates[4][1] < rates[5][0] / rates[5][1],
        "relative_local_links": all(not h.startswith("/") for h in deck.links if not h.startswith(("http:", "https:", "#"))),
    }


if __name__ == "__main__":
    result = run()
    print(json.dumps(result, ensure_ascii=False, indent=2))
    raise SystemExit(0 if all(result.values()) else 1)
