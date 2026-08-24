# WeConvertFiles — Page Jitter Baseline

Generated: 2026-08-24T16:50:55.249Z

Reproduce with a single command:

```
npm run baseline:jitter
```

## How this was measured

- Browser: Chromium via Playwright 1.56.1, headless.
- Viewport: 1280×800, deviceScaleFactor 1.
- Timeline pass CPU throttle: 6× (CDP Emulation.setCPUThrottlingRate), so the deferred shell script lands after first paint the way it does on mid-tier hardware.
- Samples taken at ~100, 500, 1500 ms after the navigation response commits.
- "Shell-injection pass" is timing-independent: it compares the page with `layout.js` blocked (shell never injects) against a normal settled load. The difference is exactly how far content jumps when the runtime header is prepended.
- All numbers below are measured by the browser. Nothing is estimated.

## Summary

| Page | Runtime header injected? | Content jump (main top) | Observed CLS | Console errors | Failed requests |
| --- | --- | --- | --- | --- | --- |
| Homepage (static shell — control) (`/`) | no | 0px | 0 | 0 | 0 |
| Guide: Bulk Resize (`/guides/bulk-resize.html`) | no | 0px | 0.0041 | 0 | 0 |
| Legal: Privacy Policy (`/privacy`) | yes | +86.75px | 0 | 0 | 0 |
| About page (`/about`) | yes | +86.75px | 0 | 0 | 0 |
| Tool page: Bulk Image Resizer (`/bulk-resize`) | no | 0px | 0.0011 | 0 | 0 |

> "Content jump (main top)" is the downward shift of the `<main>` element between the shell-blocked and settled loads. A positive value means content visibly moves down when the runtime header appears — the jitter.

## Per-page detail

### Homepage (static shell — control) — `/`

- Runtime header injected by layout.js: **no**
- Shell-injection content shift (post − pre, px):
    - headerTopShiftPx: 0
    - mainTopShiftPx: 0
    - footerTopShiftPx: 0
    - h1TopShiftPx: 0
- Before/after (deterministic) screenshots: `screenshots/home-shell-blocked.png` → `screenshots/home-shell-settled.png`
- Observed CLS (throttled timeline): 0
- Nav timing (throttled): FP=140ms, FCP=472ms, DCL=854ms, load=854ms
- Timeline samples (main top, px):
    - ~100ms (actual 100ms): main.top=121.75, header present → screenshots/home-100ms.png
    - ~500ms (actual 1005ms): main.top=121.75, header present → screenshots/home-500ms.png
    - ~1500ms (actual 1501ms): main.top=121.75, header present → screenshots/home-1500ms.png
- Main top delta first→last sample: 0px

### Guide: Bulk Resize — `/guides/bulk-resize.html`

- Runtime header injected by layout.js: **no**
- Shell-injection content shift (post − pre, px):
    - headerTopShiftPx: 0
    - mainTopShiftPx: 0
    - footerTopShiftPx: 0
    - h1TopShiftPx: 0
- Before/after (deterministic) screenshots: `screenshots/guide-bulk-resize-shell-blocked.png` → `screenshots/guide-bulk-resize-shell-settled.png`
- Observed CLS (throttled timeline): 0.0041
- Layout-shift entries: 0.0041@323ms
- Nav timing (throttled): FP=84ms, FCP=180ms, DCL=399ms, load=531ms
- Timeline samples (main top, px):
    - ~100ms (actual 100ms): main.top=86.75, header present → screenshots/guide-bulk-resize-100ms.png
    - ~500ms (actual 608ms): main.top=86.75, header present → screenshots/guide-bulk-resize-500ms.png
    - ~1500ms (actual 1502ms): main.top=86.75, header present → screenshots/guide-bulk-resize-1500ms.png
- Main top delta first→last sample: 0px

### Legal: Privacy Policy — `/privacy`

- Runtime header injected by layout.js: **yes**
- Shell-injection content shift (post − pre, px):
    - mainTopShiftPx: +86.75
    - h1TopShiftPx: +86.75
- Before/after (deterministic) screenshots: `screenshots/privacy-shell-blocked.png` → `screenshots/privacy-shell-settled.png`
- Observed CLS (throttled timeline): 0
- Nav timing (throttled): FP=484ms, FCP=484ms, DCL=257ms, load=483ms
- Timeline samples (main top, px):
    - ~100ms (actual 101ms): main.top=86.75, header present → screenshots/privacy-100ms.png
    - ~500ms (actual 545ms): main.top=86.75, header present → screenshots/privacy-500ms.png
    - ~1500ms (actual 1501ms): main.top=86.75, header present → screenshots/privacy-1500ms.png
- Main top delta first→last sample: 0px

### About page — `/about`

- Runtime header injected by layout.js: **yes**
- Shell-injection content shift (post − pre, px):
    - mainTopShiftPx: +86.75
    - h1TopShiftPx: +86.75
- Before/after (deterministic) screenshots: `screenshots/about-shell-blocked.png` → `screenshots/about-shell-settled.png`
- Observed CLS (throttled timeline): 0
- Nav timing (throttled): FP=432ms, FCP=432ms, DCL=208ms, load=430ms
- Timeline samples (main top, px):
    - ~100ms (actual 100ms): main.top=86.75, header present → screenshots/about-100ms.png
    - ~500ms (actual 505ms): main.top=86.75, header present → screenshots/about-500ms.png
    - ~1500ms (actual 1500ms): main.top=86.75, header present → screenshots/about-1500ms.png
- Main top delta first→last sample: 0px

### Tool page: Bulk Image Resizer — `/bulk-resize`

- Runtime header injected by layout.js: **no**
- Shell-injection content shift (post − pre, px):
    - headerTopShiftPx: 0
    - mainTopShiftPx: 0
    - footerTopShiftPx: 0
    - h1TopShiftPx: 0
- Before/after (deterministic) screenshots: `screenshots/tool-bulk-resize-shell-blocked.png` → `screenshots/tool-bulk-resize-shell-settled.png`
- Observed CLS (throttled timeline): 0.0011
- Layout-shift entries: 0.0011@556ms
- Nav timing (throttled): FP=120ms, FCP=296ms, DCL=638ms, load=639ms
- Timeline samples (main top, px):
    - ~100ms (actual 101ms): main.top=121.75, header present → screenshots/tool-bulk-resize-100ms.png
    - ~500ms (actual 737ms): main.top=121.75, header present → screenshots/tool-bulk-resize-500ms.png
    - ~1500ms (actual 1501ms): main.top=121.75, header present → screenshots/tool-bulk-resize-1500ms.png
- Main top delta first→last sample: 0px

## Notes for later phases

- The jitter originates in `layout.js`, which prepends a sticky `<header>` to `<body>` via `insertAdjacentHTML("afterbegin", …)` after `DOMContentLoaded`, and appends the footer. Pages that ship an inline shell (the homepage) show no such jump; pages that rely on runtime injection do.
- Re-run this harness after each change and compare `test/baseline/report.json` to confirm the content jump trends to 0 without regressing CLS, console errors, or failed requests.
