# WeConvertFiles — Page Jitter Baseline

Generated: 2026-08-24T18:02:58.166Z

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

| Page | Runtime header injected? | Content jump (main top) | Observed CLS | motion.js loaded | Console errors | Failed requests |
| --- | --- | --- | --- | --- | --- | --- |
| Homepage (static shell — control) (`/`) | no | 0px | 0.0041 | yes | 0 | 0 |
| Guide: Bulk Resize (`/guides/bulk-resize.html`) | no | 0px | 0.0041 | no (unused) | 0 | 0 |
| Legal: Privacy Policy (`/privacy`) | no | 0px | 0.059 | no (unused) | 0 | 0 |
| About page (`/about`) | no | 0px | 0.0041 | no (unused) | 0 | 0 |
| Convert page: HEIC to JPG (`/convert/heic-to-jpg`) | no | 0px | 0.0061 | no (unused) | 0 | 0 |
| Tool page: Bulk Image Resizer (`/bulk-resize`) | no | 0px | 0.0369 | yes | 0 | 0 |

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
- Observed CLS (throttled timeline): 0.0041
- Layout-shift entries: 0.0041@364ms
- Nav timing (throttled): FP=144ms, FCP=284ms, DCL=890ms, load=891ms
- Timeline samples (main top, px):
    - ~100ms (actual 101ms): main.top=121.75, header present → screenshots/home-100ms.png
    - ~500ms (actual 1082ms): main.top=121.75, header present → screenshots/home-500ms.png
    - ~1500ms (actual 1500ms): main.top=121.75, header present → screenshots/home-1500ms.png
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
- Layout-shift entries: 0.0041@410ms
- Nav timing (throttled): FP=184ms, FCP=184ms, DCL=343ms, load=434ms
- Timeline samples (main top, px):
    - ~100ms (actual 100ms): main.top=86.75, header present → screenshots/guide-bulk-resize-100ms.png
    - ~500ms (actual 577ms): main.top=86.75, header present → screenshots/guide-bulk-resize-500ms.png
    - ~1500ms (actual 1500ms): main.top=86.75, header present → screenshots/guide-bulk-resize-1500ms.png
- Main top delta first→last sample: 0px

### Legal: Privacy Policy — `/privacy`

- Runtime header injected by layout.js: **no**
- Shell-injection content shift (post − pre, px):
    - headerTopShiftPx: 0
    - mainTopShiftPx: 0
    - footerTopShiftPx: 0
    - h1TopShiftPx: 0
- Before/after (deterministic) screenshots: `screenshots/privacy-shell-blocked.png` → `screenshots/privacy-shell-settled.png`
- Observed CLS (throttled timeline): 0.059
- Layout-shift entries: 0.059@346ms
- Nav timing (throttled): FP=212ms, FCP=212ms, DCL=336ms, load=420ms
- Timeline samples (main top, px):
    - ~100ms (actual 102ms): main.top=86.75, header present → screenshots/privacy-100ms.png
    - ~500ms (actual 537ms): main.top=86.75, header present → screenshots/privacy-500ms.png
    - ~1500ms (actual 1500ms): main.top=86.75, header present → screenshots/privacy-1500ms.png
- Main top delta first→last sample: 0px

### About page — `/about`

- Runtime header injected by layout.js: **no**
- Shell-injection content shift (post − pre, px):
    - headerTopShiftPx: 0
    - mainTopShiftPx: 0
    - footerTopShiftPx: 0
    - h1TopShiftPx: 0
- Before/after (deterministic) screenshots: `screenshots/about-shell-blocked.png` → `screenshots/about-shell-settled.png`
- Observed CLS (throttled timeline): 0.0041
- Layout-shift entries: 0.0041@287ms
- Nav timing (throttled): FP=168ms, FCP=168ms, DCL=286ms, load=355ms
- Timeline samples (main top, px):
    - ~100ms (actual 100ms): main.top=86.75, header present → screenshots/about-100ms.png
    - ~500ms (actual 501ms): main.top=86.75, header present → screenshots/about-500ms.png
    - ~1500ms (actual 1502ms): main.top=86.75, header present → screenshots/about-1500ms.png
- Main top delta first→last sample: 0px

### Convert page: HEIC to JPG — `/convert/heic-to-jpg`

- Runtime header injected by layout.js: **no**
- Shell-injection content shift (post − pre, px):
    - headerTopShiftPx: 0
    - mainTopShiftPx: 0
    - footerTopShiftPx: 0
    - h1TopShiftPx: 0
- Before/after (deterministic) screenshots: `screenshots/convert-heic-shell-blocked.png` → `screenshots/convert-heic-shell-settled.png`
- Observed CLS (throttled timeline): 0.0061
- Layout-shift entries: 0.0061@332ms
- Nav timing (throttled): FP=184ms, FCP=184ms, DCL=326ms, load=415ms
- Timeline samples (main top, px):
    - ~100ms (actual 100ms): main.top=86.75, header present → screenshots/convert-heic-100ms.png
    - ~500ms (actual 515ms): main.top=86.75, header present → screenshots/convert-heic-500ms.png
    - ~1500ms (actual 1502ms): main.top=86.75, header present → screenshots/convert-heic-1500ms.png
- Main top delta first→last sample: 0px

### Tool page: Bulk Image Resizer — `/bulk-resize`

- Runtime header injected by layout.js: **no**
- Shell-injection content shift (post − pre, px):
    - headerTopShiftPx: 0
    - mainTopShiftPx: 0
    - footerTopShiftPx: 0
    - h1TopShiftPx: 0
- Before/after (deterministic) screenshots: `screenshots/tool-bulk-resize-shell-blocked.png` → `screenshots/tool-bulk-resize-shell-settled.png`
- Observed CLS (throttled timeline): 0.0369
- Layout-shift entries: 0.0369@464ms
- Nav timing (throttled): FP=204ms, FCP=204ms, DCL=498ms, load=498ms
- Timeline samples (main top, px):
    - ~100ms (actual 100ms): main.top=121.75, header present → screenshots/tool-bulk-resize-100ms.png
    - ~500ms (actual 597ms): main.top=121.75, header present → screenshots/tool-bulk-resize-500ms.png
    - ~1500ms (actual 1500ms): main.top=121.75, header present → screenshots/tool-bulk-resize-1500ms.png
- Main top delta first→last sample: 0px

## Notes for later phases

- The jitter originates in `layout.js`, which prepends a sticky `<header>` to `<body>` via `insertAdjacentHTML("afterbegin", …)` after `DOMContentLoaded`, and appends the footer. Pages that ship an inline shell (the homepage) show no such jump; pages that rely on runtime injection do.
- Re-run this harness after each change and compare `test/baseline/report.json` to confirm the content jump trends to 0 without regressing CLS, console errors, or failed requests.
