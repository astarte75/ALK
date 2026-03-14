---
phase: 1
slug: foundation
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-14
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Playwright (e2e smoke tests — infrastructure requirements need browser verification) |
| **Config file** | none — Wave 0 installs |
| **Quick run command** | `npx tsc --noEmit` |
| **Full suite command** | `npx playwright test` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx tsc --noEmit`
- **After every plan wave:** Run `npx playwright test`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 01-01-01 | 01 | 1 | FOUND-01 | e2e smoke | `npx playwright test tests/smoke.spec.ts` | ❌ W0 | ⬜ pending |
| 01-01-02 | 01 | 1 | FOUND-02 | e2e smoke | `npx playwright test tests/smoke.spec.ts` | ❌ W0 | ⬜ pending |
| 01-02-01 | 02 | 1 | FOUND-03 | e2e smoke | `npx playwright test tests/theme.spec.ts` | ❌ W0 | ⬜ pending |
| 01-03-01 | 03 | 1 | FOUND-05 | e2e smoke | `npx playwright test tests/i18n.spec.ts` | ❌ W0 | ⬜ pending |
| 01-04-01 | 04 | 2 | FOUND-06 | e2e visual | `npx playwright test tests/responsive.spec.ts` | ❌ W0 | ⬜ pending |
| 01-05-01 | 05 | 2 | FOUND-07 | e2e smoke | `npx playwright test tests/deploy.spec.ts` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `playwright.config.ts` — Playwright configuration
- [ ] `tests/smoke.spec.ts` — SSR rendering + hydration (FOUND-01, FOUND-02)
- [ ] `tests/theme.spec.ts` — Dark theme CSS custom properties (FOUND-03)
- [ ] `tests/i18n.spec.ts` — Locale routing IT/EN (FOUND-05)
- [ ] `tests/responsive.spec.ts` — Viewport 320px–2560px (FOUND-06)
- [ ] `tests/deploy.spec.ts` — Production URL returns 200 (FOUND-07)

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| No FOUC on dark theme | FOUND-03 | Visual perception of flash timing | Hard refresh (Cmd+Shift+R) on deployed URL — no white flash before dark background |
| Font rendering quality | FOUND-03 | Subjective visual quality | Check Plus Jakarta Sans headings and Inter body text render correctly on Chrome/Safari |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
