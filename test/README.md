# WeConvertFiles test harness

Browser-level tooling for the optimisation work. Nothing here changes
production behaviour — the harness only serves the existing files over a local
static server and observes them in a real browser.

## Smoke coverage (Phase 4, Task 23)

Headless browser smoke tests for representative pages and the primary
navigation journeys. Runs against the same local static server, exits non-zero
on any failure, and needs no network — CI-friendly.

```
npm test          # alias for the smoke suite
npm run test:smoke
```

It loads one page of each important type — homepage, a PDF tool (`/merge-pdf`),
an image tool (`/image-cropper`), a developer tool (`/json-formatter`), a
conversion page (`/convert/jpg-to-pdf`), a guide (`/guides/merge-pdf`) and a
legal page (`/privacy`) — across **desktop and mobile** viewports, and asserts
each one: responds HTTP ok, has a non-empty `<title>` and a `<main>`, does not
scroll horizontally on mobile, and produces **no unexpected console/page errors
or same-origin failed requests** (third-party hosts that CI may block are
allow-listed). It then walks the primary navigation journeys — homepage → tool,
tool → category hub, category → tool, guide → tool — to confirm internal routes
work. Any failure prints the exact page/journey and reason.

## Jitter / layout-shift regression test (Phase 4, Task 25)

Turns the Phase 1 jitter measurement into an automatic guard. Runs headlessly,
exits non-zero on regression, and is part of `npm test`.

```
npm run test:jitter
```

For a page of each shell type (homepage, tool, guide, convert, legal, about) it
reuses the Phase 1 methodology:

- **Deterministic pass** — loads the page once with `layout.js` blocked and once
  normally, and compares the top edge of `<header>` / `<main>` / `<footer>`.
  Because the shell is baked static, the header is already present with
  `layout.js` blocked and nothing moves. If someone reintroduces runtime shell
  injection, the header is absent when blocked and then pushes content down on
  the normal load — a large shift the test rejects.
- **Timeline pass** — under a fixed CPU throttle, samples the same boxes at
  ~100/500/1500 ms and records the browser's Cumulative Layout Shift.

Only movement within the thresholds (header/main/footer ≤ 2px, CLS ≤ 0.05)
passes; anything larger fails and names the page and element. A compact
diagnostic is written to `test/baseline/jitter-regression.json` (git-ignored,
regenerated each run).

## Jitter baseline (Phase 1, Task 1)

Establishes a reproducible, measured baseline for the page-shell jitter so
later changes can be compared against it.

```
npm run baseline:jitter
```

That single command:

1. Starts a local static server (`test/serve.mjs`) that mirrors the parts of
   the Netlify hosting contract that affect rendering — it applies the
   `_redirects` rules (200 rewrites, 301/302 redirects, the 404 catch-all) and
   Netlify's pretty-URL fallback (`/about` → `about.html`).
2. Loads representative pages in headless Chromium (Playwright):
   `/` (static-shell control), `/guides/bulk-resize.html`, `/privacy`,
   `/about`, `/convert/heic-to-jpg` (a conversion page), and `/bulk-resize`
   (a tool page).
3. Writes results to `test/baseline/`:
   - `REPORT.md` — human-readable summary.
   - `report.json` — full measured data (bounding boxes, layout-shift entries,
     nav timing, console errors, failed requests).
   - `screenshots/` — viewport captures.

### What it measures

- **Shell-injection pass (deterministic, timing-independent).** Loads each page
  once with `layout.js` blocked (the runtime shell never injects) and once
  normally (shell settled), then reports how far the top edge of `<main>` /
  `<h1>` moves. That delta is exactly the jump a visitor sees when the runtime
  header is prepended to `<body>`. The `*-shell-blocked.png` / `*-shell-settled.png`
  screenshot pair shows it visually.
- **Timeline pass.** Loads each page under a fixed CPU throttle
  (CDP `Emulation.setCPUThrottlingRate`, so the deferred shell script lands the
  way it does on a mid-tier device) and samples screenshots + bounding boxes at
  ~100 / 500 / 1500 ms, plus the browser's own Cumulative Layout Shift signal,
  console errors, and failed requests.

All figures in the report are measured by the browser — none are estimated.

### Requirements

- Node 18+.
- Chromium for Playwright. In managed environments that ship one at
  `/opt/pw-browsers`, the harness picks it up automatically. On a normal
  machine run `npx playwright install chromium` once first.

### Artifacts in git

`test/baseline/REPORT.md` and `test/baseline/report.json` are committed as the
reference baseline. `test/baseline/screenshots/` is regenerated on every run and
is intentionally git-ignored — run the command to produce the images locally.
