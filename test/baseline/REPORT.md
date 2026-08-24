# WeConvertFiles — Page Jitter Baseline

Generated: 2026-08-24T17:47:35.717Z

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
| Homepage (static shell — control) (`/`) | no | 0px | 0.0088 | 0 | 0 |
| Guide: Bulk Resize (`/guides/bulk-resize.html`) | no | 0px | 0 | 0 | 0 |
| Legal: Privacy Policy (`/privacy`) | no | 0px | 0 | 0 | 0 |
| About page (`/about`) | no | 0px | 0.0022 | 0 | 0 |
| Convert page: HEIC to JPG (`/convert/heic-to-jpg`) | no | 0px | 0.0041 | 0 | 0 |
| Tool page: Bulk Image Resizer (`/bulk-resize`) | no | 0px | 0.0227 | 0 | 0 |

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
- Observed CLS (throttled timeline): 0.0088
- Layout-shift entries: 0.0047@589ms, 0.0041@761ms
- Nav timing (throttled): FP=260ms, FCP=440ms, DCL=1451ms, load=1452ms
- Timeline samples (main top, px):
    - ~100ms (actual 109ms): main.top=n/a, no header yet → screenshots/home-100ms.png
    - ~500ms (actual 1778ms): main.top=121.75, header present → screenshots/home-500ms.png
    - ~1500ms (actual 1927ms): main.top=121.75, header present → screenshots/home-1500ms.png
- Main top delta first→last sample: n/apx

### Guide: Bulk Resize — `/guides/bulk-resize.html`

- Runtime header injected by layout.js: **no**
- Shell-injection content shift (post − pre, px):
    - headerTopShiftPx: 0
    - mainTopShiftPx: 0
    - footerTopShiftPx: 0
    - h1TopShiftPx: 0
- Before/after (deterministic) screenshots: `screenshots/guide-bulk-resize-shell-blocked.png` → `screenshots/guide-bulk-resize-shell-settled.png`
- Observed CLS (throttled timeline): 0
- Nav timing (throttled): FP=120ms, FCP=220ms, DCL=393ms, load=496ms
- Timeline samples (main top, px):
    - ~100ms (actual 101ms): main.top=86.75, header present → screenshots/guide-bulk-resize-100ms.png
    - ~500ms (actual 588ms): main.top=86.75, header present → screenshots/guide-bulk-resize-500ms.png
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
- Observed CLS (throttled timeline): 0
- Nav timing (throttled): FP=188ms, FCP=188ms, DCL=336ms, load=439ms
- Timeline samples (main top, px):
    - ~100ms (actual 100ms): main.top=86.75, header present → screenshots/privacy-100ms.png
    - ~500ms (actual 523ms): main.top=86.75, header present → screenshots/privacy-500ms.png
    - ~1500ms (actual 1501ms): main.top=86.75, header present → screenshots/privacy-1500ms.png
- Main top delta first→last sample: 0px

### About page — `/about`

- Runtime header injected by layout.js: **no**
- Shell-injection content shift (post − pre, px):
    - headerTopShiftPx: 0
    - mainTopShiftPx: 0
    - footerTopShiftPx: 0
    - h1TopShiftPx: 0
- Before/after (deterministic) screenshots: `screenshots/about-shell-blocked.png` → `screenshots/about-shell-settled.png`
- Observed CLS (throttled timeline): 0.0022
- Layout-shift entries: 0.0022@344ms
- Nav timing (throttled): FP=180ms, FCP=180ms, DCL=294ms, load=400ms
- Timeline samples (main top, px):
    - ~100ms (actual 101ms): main.top=86.75, header present → screenshots/about-100ms.png
    - ~500ms (actual 501ms): main.top=86.75, header present → screenshots/about-500ms.png
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
- Layout-shift entries: 0.0041@312ms
- Nav timing (throttled): FP=80ms, FCP=168ms, DCL=306ms, load=405ms
- Timeline samples (main top, px):
    - ~100ms (actual 100ms): main.top=86.75, header present → screenshots/convert-heic-100ms.png
    - ~500ms (actual 501ms): main.top=86.75, header present → screenshots/convert-heic-500ms.png
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
- Observed CLS (throttled timeline): 0.0227
- Layout-shift entries: 0.0041@223ms, 0.0186@509ms
- Nav timing (throttled): FP=188ms, FCP=188ms, DCL=543ms, load=543ms
- Timeline samples (main top, px):
    - ~100ms (actual 99ms): main.top=121.75, header present → screenshots/tool-bulk-resize-100ms.png
    - ~500ms (actual 653ms): main.top=121.75, header present → screenshots/tool-bulk-resize-500ms.png
    - ~1500ms (actual 1501ms): main.top=121.75, header present → screenshots/tool-bulk-resize-1500ms.png
- Main top delta first→last sample: 0px

## Notes for later phases

- The jitter originates in `layout.js`, which prepends a sticky `<header>` to `<body>` via `insertAdjacentHTML("afterbegin", …)` after `DOMContentLoaded`, and appends the footer. Pages that ship an inline shell (the homepage) show no such jump; pages that rely on runtime injection do.
- Re-run this harness after each change and compare `test/baseline/report.json` to confirm the content jump trends to 0 without regressing CLS, console errors, or failed requests.
