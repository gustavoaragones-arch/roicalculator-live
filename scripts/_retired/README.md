# Retired scripts

This directory is the repository's scripts-archive/deprecation convention,
established during Phase 1 remediation (see `reports/audits/AUDIT-05-ARCHITECTURE.md`
and `reports/audits/MASTER-DIAGNOSTIC.md`).

**Rule: nothing in this directory is part of any build, generation, or CI
path.** Each file has been edited to raise/throw immediately if invoked, in
addition to living outside `scripts/` proper, so it cannot run even by
accident or direct invocation.

Files here are kept for historical traceability only — do not restore them to
`scripts/` or remove their execution guards without first re-reading the audit
finding that led to their retirement.

| File | Why it was retired |
|---|---|
| `aeo_phase11.py` | Confirmed source of the site-wide generic-boilerplate contamination documented in Audit 02 (42/31/30/51-page duplication, including `404.html`, `privacy.html`, `terms.html`, `sitemap.html`). Its only idempotency guard was "does `.ai-answer-block` already exist" — it would silently reinject any manually-removed content, and it never excluded `templates/` from its walk. See `AUDIT-05-ARCHITECTURE.md` §5.1. |
| `patch-phase176.mjs` | Did a blind, content-unaware regex overwrite of every page's `<header>` block and an exact-string footer swap, from a private hardcoded copy of the markup rather than a shared source. Superseded by `scripts/sync-site-chrome.mjs` + `scripts/site-chrome.mjs`. See `AUDIT-05-ARCHITECTURE.md` §5.2. |
| `patch_albor_footer.py` | Exact-string footer migration whose target markup no longer exists anywhere in the repository (at least one further footer revision has shipped since). Already a functional no-op; retired explicitly rather than left ambiguous. See `AUDIT-05-ARCHITECTURE.md` §5.5. |
| `patch_footer_simplify.py` | Same as above — exact-string target markup no longer exists. See `AUDIT-05-ARCHITECTURE.md` §5.5. |

## Convention going forward

When a script's approach is superseded by a newer mechanism:

1. `git mv` it into `scripts/_retired/`.
2. Add a docstring/comment block explaining what it did, why it was retired,
   and what replaced it.
3. Add a hard guard (`raise SystemExit(...)` in Python, `throw new Error(...)`
   in Node) immediately before its old `main()` invocation so it cannot
   execute even if run directly.
4. Add a row to the table above.

Do not delete retired scripts outright unless they contain nothing of
historical or diagnostic value — the point of this directory is traceability,
not just deactivation.
