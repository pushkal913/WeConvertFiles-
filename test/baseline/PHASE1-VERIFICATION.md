# Phase 1 — Stability & Jitter: verification

Re-ran the same browser regression harness (`npm run baseline:jitter`) from
Task 1, on the same pages and viewport (1280×800, Chromium via Playwright, the
timeline pass under 6× CPU throttle). This compares the measured **before**
(the Task 1 baseline, commit `eb966e8`) against the **after** (end of Phase 1).

All figures are measured by the browser — nothing is estimated.

## Headline result

The page-shell jitter is gone. The `<main>` top edge is now deterministically
stable: the shell-injection pass (load with `layout.js` blocked vs. settled)
reports a **0px** content shift on every page, and `main.top` holds at the same
value across the 100 / 500 / 1500 ms samples.

## Before → after

| Page | Content jump (main top) | Runtime header injected? | motion.js | Console errors |
| --- | --- | --- | --- | --- |
| `/` homepage (control) | 0px → 0px | no → no | yes → yes (used) | 0 → 0 |
| `/guides/bulk-resize.html` | **+86.75px → 0px** | yes → **no** | yes → **no (unused)** | 0 → 0 |
| `/privacy` | **+86.75px → 0px** | yes → **no** | yes → **no (unused)** | 0 → 0 |
| `/about` | **+86.75px → 0px** | yes → **no** | yes → **no (unused)** | 0 → 0 |
| `/convert/heic-to-jpg` | (not in v1 set) → **0px** | → **no** | → **no (unused)** | → 0 |
| `/bulk-resize` tool page | 0px → 0px | no → no | yes → yes (used) | 0 → 0 |

- **Content jump**: downward shift of `<main>` between the shell-blocked and
  settled loads — i.e. how far content moves when the runtime header appears.
  Every content page went from **+86.75px to 0px**.
- **Runtime header injected**: whether `layout.js` builds the header at runtime.
  Guides, legal and convert pages now ship the shell statically, so it is `no`.
- **motion.js**: guides/legal/convert no longer load the scroll/drag runtime
  they had nothing to use (Task 4); the homepage and tool pages still load it
  because they have reveals / an upload zone.

## Console / network

Zero console errors and zero failed requests on all six pages, across every run.

## Remaining movement (identified & explained)

The shell jitter (the Phase 1 target) is 0 everywhere. The only residual motion
is small, intentional, and unrelated to the shell:

- **Homepage** — a below-the-fold Cumulative Layout Shift of ~0.004–0.008 in
  some runs, 0 in others. Source: the intentional `.reveal` scroll-in sections
  and late-arriving below-the-fold content. `main.top` never moves.
- **Tool page** (`/bulk-resize`) — a CLS of ~0.02–0.037 in some runs, 0 in
  others. Source: `app.js` rendering the interactive tool UI inside `<main>`
  after load. `main.top` (the shell) never moves.

Both are **well within Google's "good" CLS (< 0.1)**, both **pre-date Phase 1**
(the Task 1 baseline already showed non-zero CLS here), and both **vary run to
run** under CPU throttling — measuring these three times gave, for the tool
page, `0.037`, `0`, `0.027`, and for the homepage `0.004`, `0.008`, `0`. That
variance confirms they are timing-dependent app/animation rendering, not a fixed
regression and not shell movement. Phase 1 did not change the homepage reveal
system or the tool's own rendering, so these are expected and left as-is.

## Repository validation

`npm run validate` passes all six validators, including the three regression
guards added during Phase 1:

- static shell present on guides, legal and conversion pages (no runtime shell);
- no `@media (prefers-color-scheme)` styling rule (theme follows `.dark`);
- no global `scroll-behavior: smooth` in shared CSS.

## Reproduce

```
npm run baseline:jitter   # regenerates report.json, REPORT.md, screenshots
npm run validate          # repository validation
```
