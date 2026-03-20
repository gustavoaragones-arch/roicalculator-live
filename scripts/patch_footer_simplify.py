#!/usr/bin/env python3
"""Minimal footer + trust-block moved from footer into main content (first article)."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

FOOTER_INNER = """    <div class="footer-inner">
      <p>© 2026 Albor Digital LLC</p>
      <nav class="footer-links" aria-label="Footer navigation">
        <a href="/terms.html">Terms</a>
        <a href="/privacy.html">Privacy</a>
        <a href="/methodology.html">Methodology</a>
        <a href="/about.html">About</a>
        <a href="/contact.html">Contact</a>
        <a href="/sitemap.html">Sitemap</a>
      </nav>
      <p class="disclaimer">
        Educational use only. Not financial advice.
      </p>
      <p class="no-tracking">
        No cookies. No tracking.
      </p>
    </div>"""

TRUST_SNIPPET = """      <section class="trust-block">
        <p><strong>About this tool:</strong> This calculator is part of a suite of financial tools developed by Albor Digital LLC, an independent digital product studio. It is designed for educational and analytical purposes only.</p>
      </section>
"""

# Pages where trust block in main is redundant or wrong UX
SKIP_TRUST = frozenset({"contact.html"})


def main() -> None:
    footer_re = re.compile(
        r'<div class="footer-inner">[\s\S]*?</div>\s*(?=\s*</footer>)',
        re.MULTILINE,
    )
    for path in sorted(ROOT.rglob("*.html")):
        rel = str(path.relative_to(ROOT)).replace("\\", "/")
        if rel.startswith("partials/"):
            continue
        text = path.read_text(encoding="utf-8")
        orig = text

        m = footer_re.search(text)
        if not m:
            print("skip footer (no match):", rel)
            continue
        text = text[: m.start()] + FOOTER_INNER + text[m.end() :]

        # Trust block: only in main, once; skip contact
        if rel not in SKIP_TRUST:
            main_part = text.split("<footer", 1)[0]
            if (
                'class="trust-block"' not in main_part
                and '<article class="content-section">' in main_part
            ):
                marker = '<article class="content-section">'
                pos = text.find(marker)
                if pos != -1:
                    ins = pos + len(marker)
                    # avoid double insert
                    chunk = text[ins : ins + 400]
                    if "trust-block" not in chunk:
                        text = text[:ins] + "\n" + TRUST_SNIPPET + text[ins:]

        if text != orig:
            path.write_text(text, encoding="utf-8")
            print("updated", rel)

    # partials/footer.html — same inner (no trust inject)
    pf = ROOT / "partials" / "footer.html"
    if pf.exists():
        t = pf.read_text(encoding="utf-8")
        m = footer_re.search(t)
        if m:
            nt = t[: m.start()] + FOOTER_INNER + t[m.end() :]
            if nt != t:
                pf.write_text(nt, encoding="utf-8")
                print("updated partials/footer.html")


if __name__ == "__main__":
    main()
