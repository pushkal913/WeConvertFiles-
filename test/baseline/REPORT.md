# WeConvertFiles — Page Jitter Baseline

Generated: 2026-08-24T18:49:43.235Z

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
| Homepage (static shell — control) (`/`) | no | 0px | 0 | yes | 0 | 0 |
| Guide: Bulk Resize (`/guides/bulk-resize.html`) | no | 0px | 0 | no (unused) | 0 | 0 |
| Legal: Privacy Policy (`/privacy`) | no | 0px | 0.0068 | no (unused) | 0 | 0 |
| About page (`/about`) | no | 0px | 0.0041 | no (unused) | 0 | 0 |
| Convert page: HEIC to JPG (`/convert/heic-to-jpg`) | no | 0px | 0.0041 | no (unused) | 0 | 0 |
| Tool page: Bulk Image Resizer (`/bulk-resize`) | no | 0px | 0.041 | yes | 0 | 0 |

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
- Nav timing (throttled): FP=116ms, FCP=240ms, DCL=649ms, load=650ms
- Timeline samples (main top, px):
    - ~100ms (actual 102ms): main.top=121.75, header present → screenshots/home-100ms.png
    - ~500ms (actual 782ms): main.top=121.75, header present → screenshots/home-500ms.png
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
- Observed CLS (throttled timeline): 0
- Nav timing (throttled): FP=292ms, FCP=292ms, DCL=325ms, load=392ms
- Timeline samples (main top, px):
    - ~100ms (actual 100ms): main.top=86.75, header present → screenshots/guide-bulk-resize-100ms.png
    - ~500ms (actual 501ms): main.top=86.75, header present → screenshots/guide-bulk-resize-500ms.png
    - ~1500ms (actual 1501ms): main.top=86.75, header present → screenshots/guide-bulk-resize-1500ms.png
- Main top delta first→last sample: 0px

### Legal: Privacy Policy — `/privacy`

- Runtime header injected by layout.js: **no**
- Shell-injection content shift (post − pre, px):
    - headerTopShiftPx: 0
    - mainTopShiftPx: 0
    - footerTopShiftPx: 0
    - h1TopShiftPx: 0
- Before/after (deterministic) screenshots: `screenshots/privacy-shell-blocked.png` → `screenshots/privacy-shell-settled.png`
- Observed CLS (throttled timeline): 0.0068
- Layout-shift entries: 0.0068@309ms
- Nav timing (throttled): FP=144ms, FCP=144ms, DCL=300ms, load=394ms
- Timeline samples (main top, px):
    - ~100ms (actual 101ms): main.top=86.75, header present → screenshots/privacy-100ms.png
    - ~500ms (actual 518ms): main.top=86.75, header present → screenshots/privacy-500ms.png
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
- Layout-shift entries: 0.0041@313ms
- Nav timing (throttled): FP=180ms, FCP=180ms, DCL=306ms, load=385ms
- Timeline samples (main top, px):
    - ~100ms (actual 100ms): main.top=86.75, header present → screenshots/about-100ms.png
    - ~500ms (actual 500ms): main.top=86.75, header present → screenshots/about-500ms.png
    - ~1500ms (actual 1501ms): main.top=86.75, header present → screenshots/about-1500ms.png
- Main top delta first→last sample: 0px

### Convert page: HEIC to JPG — `/convert/heic-to-jpg`

- Runtime header injected by layout.js: **no**
- Shell-injection content shift (post − pre, px):
    - headerTopShiftPx: 0
    - mainTopShiftPx: 0
    - footerTopShiftPx: 0
    - h1TopShiftPx: 0
- Before/after (deterministic) screenshots: `screenshots/convert-heic-shell-blocked.png` → `screenshots/convert-heic-shell-settled.png`
- Observed CLS (throttled timeline): 0.0041
- Layout-shift entries: 0.0041@345ms
- Nav timing (throttled): FP=180ms, FCP=180ms, DCL=340ms, load=427ms
- Timeline samples (main top, px):
    - ~100ms (actual 100ms): main.top=86.75, header present → screenshots/convert-heic-100ms.png
    - ~500ms (actual 516ms): main.top=86.75, header present → screenshots/convert-heic-500ms.png
    - ~1500ms (actual 1500ms): main.top=86.75, header present → screenshots/convert-heic-1500ms.png
- Main top delta first→last sample: 0px

### Tool page: Bulk Image Resizer — `/bulk-resize`

- Runtime header injected by layout.js: **no**
- Shell-injection content shift (post − pre, px):
    - headerTopShiftPx: 0
    - mainTopShiftPx: 0
    - footerTopShiftPx: 0
    - h1TopShiftPx: 0
- Before/after (deterministic) screenshots: `screenshots/tool-bulk-resize-shell-blocked.png` → `screenshots/tool-bulk-resize-shell-settled.png`
- Observed CLS (throttled timeline): 0.041
- Layout-shift entries: 0.0041@260ms, 0.0369@500ms
- Nav timing (throttled): FP=112ms, FCP=228ms, DCL=557ms, load=557ms
- Timeline samples (main top, px):
    - ~100ms (actual 100ms): main.top=121.75, header present → screenshots/tool-bulk-resize-100ms.png
    - ~500ms (actual 639ms): main.top=121.75, header present → screenshots/tool-bulk-resize-500ms.png
    - ~1500ms (actual 1500ms): main.top=121.75, header present → screenshots/tool-bulk-resize-1500ms.png
- Main top delta first→last sample: 0px

## Notes for later phases

- The jitter originates in `layout.js`, which prepends a sticky `<header>` to `<body>` via `insertAdjacentHTML("afterbegin", …)` after `DOMContentLoaded`, and appends the footer. Pages that ship an inline shell (the homepage) show no such jump; pages that rely on runtime injection do.
- Re-run this harness after each change and compare `test/baseline/report.json` to confirm the content jump trends to 0 without regressing CLS, console errors, or failed requests.
