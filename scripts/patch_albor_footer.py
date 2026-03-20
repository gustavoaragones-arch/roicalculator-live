#!/usr/bin/env python3
"""Replace site footers with Albor Digital LLC trust footer."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

FOOTER_LONG = """    <div class="footer-inner">
      <section class="trust-block">
        <p><strong>About this tool:</strong> This calculator is part of a suite of financial tools developed by Albor Digital LLC, an independent digital product studio. It is designed for educational and analytical purposes only.</p>
      </section>
      <p class="no-tracking">No cookies. No tracking. Just calculations.</p>
      <nav class="footer-links" aria-label="Footer navigation">
        <a href="/terms.html">Terms</a>
        <a href="/privacy.html">Privacy</a>
        <a href="/methodology.html">Methodology</a>
        <a href="/about.html">About</a>
        <a href="/contact.html">Contact</a>
        <a href="/sitemap.html">Sitemap</a>
        <a href="/site-structure.html">Site structure</a>
      </nav>
      <p>© 2026 Albor Digital LLC. All rights reserved.</p>
      <p>ROI Calculator is an independent financial utility tool operated by Albor Digital LLC, a digital product studio based in the United States and Canada.</p>
      <p>For informational and educational purposes only. Not financial, investment, tax, or professional advice.</p>
    </div>"""

OLD_LONG = """    <div class="footer-inner">
      <p class="disclaimer">This site provides educational content and calculators for informational purposes only. It is not financial, investment, or tax advice. Consult a qualified professional for decisions affecting your finances.</p>
      <p class="trust-signal">Calculations run locally in your browser. We do not store or track your financial data. See our <a href="/methodology.html">methodology</a> for formula details.</p>
      <p class="privacy-statement">Privacy-first: We do not collect, store, or share personal data. No cookies. No tracking.</p>
      <nav class="footer-links" aria-label="Footer navigation">
        <a href="/terms.html">Terms</a>
        <a href="/privacy.html">Privacy</a>
        <a href="/methodology.html">Methodology</a>
        <a href="/about.html">About</a>
        <a href="/sitemap.html">Sitemap</a>
        <a href="/site-structure.html">Site structure</a>
      </nav>
      <p class="copyright">&copy; 2025 roicalculator.live. All rights reserved.</p>
    </div>"""

OLD_404 = """    <div class="footer-inner">
      <p class="disclaimer">This site provides educational content and calculators for informational purposes only. It is not financial, investment, or tax advice.</p>
      <nav class="footer-links" aria-label="Footer navigation">
        <a href="/terms.html">Terms</a>
        <a href="/privacy.html">Privacy</a>
        <a href="/methodology.html">Methodology</a>
        <a href="/about.html">About</a>
        <a href="/sitemap.html">Sitemap</a>
        <a href="/site-structure.html">Site structure</a>
      </nav>
      <p class="copyright">&copy; 2025 roicalculator.live. All rights reserved.</p>
    </div>"""

OLD_PARTIAL = """  <div class="footer-inner">
    <p class="disclaimer">This site provides educational content and calculators for informational purposes only. It is not financial, investment, or tax advice. Consult a qualified professional for decisions affecting your finances.</p>
    <p class="privacy-statement">Privacy-first: We do not collect, store, or share personal data. No cookies. No tracking.</p>
    <nav class="footer-links" aria-label="Footer navigation">
      <a href="/terms.html">Terms</a>
      <a href="/privacy.html">Privacy</a>
      <a href="/methodology.html">Methodology</a>
      <a href="/about.html">About</a>
    </nav>
    <p class="copyright">&copy; 2025 roicalculator.live. All rights reserved.</p>
  </div>"""

PARTIAL_NEW = """  <div class="footer-inner">
    <section class="trust-block">
      <p><strong>About this tool:</strong> This calculator is part of a suite of financial tools developed by Albor Digital LLC, an independent digital product studio. It is designed for educational and analytical purposes only.</p>
    </section>
    <p class="no-tracking">No cookies. No tracking. Just calculations.</p>
    <nav class="footer-links" aria-label="Footer navigation">
      <a href="/terms.html">Terms</a>
      <a href="/privacy.html">Privacy</a>
      <a href="/methodology.html">Methodology</a>
      <a href="/about.html">About</a>
      <a href="/contact.html">Contact</a>
    </nav>
    <p>© 2026 Albor Digital LLC. All rights reserved.</p>
    <p>ROI Calculator is an independent financial utility tool operated by Albor Digital LLC, a digital product studio based in the United States and Canada.</p>
    <p>For informational and educational purposes only. Not financial, investment, tax, or professional advice.</p>
  </div>"""


def main() -> None:
    for path in sorted(ROOT.rglob("*.html")):
        if "partials" in path.parts:
            continue
        text = path.read_text(encoding="utf-8")
        orig = text
        if OLD_LONG in text:
            text = text.replace(OLD_LONG, FOOTER_LONG)
        elif OLD_404 in text:
            text = text.replace(OLD_404, FOOTER_LONG)
        if text != orig:
            path.write_text(text, encoding="utf-8")
            print("footer:", path.relative_to(ROOT))

    p = ROOT / "partials" / "footer.html"
    if p.exists():
        t = p.read_text(encoding="utf-8")
        if OLD_PARTIAL in t:
            t = t.replace(OLD_PARTIAL, PARTIAL_NEW)
            p.write_text(t, encoding="utf-8")
            print("footer: partials/footer.html")


if __name__ == "__main__":
    main()
