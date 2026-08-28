# WeConvertFiles test harness

Browser-level tooling for the optimisation work. Nothing here changes
production behaviour — the harness only serves the existing files over a local
static server and observes them in a real browser.

## Smoke coverage (Phase 4, Task 23)

Headless browser smoke tests for representative pages and the primary
navigation journeys. Runs against the same local static server, exits non-zero
on any failure, and needs no network — CI-friendly.

```
npm run test:smoke
npm test          # smoke + jitter + accessibility regression suites
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

## Core Web Vitals baseline (Phase 4)

Measures **LCP, CLS and INP** for representative pages, on desktop and mobile,
for cold (empty-cache) and warm (repeat-visit) loads, using Google's
`web-vitals` library injected into the page.

```
npm run measure:vitals
```

Desktop runs at 1280×800 with no CPU throttle; mobile at 390×844 under a 4× CPU
throttle (~mid-tier phone). INP is exercised with a few non-navigating
interactions per load, and each configuration is the median of several runs.
These are **lab** numbers against the local static server — reproducible and
comparable between commits, **not** field data.

Output: `test/baseline/WEB-VITALS.md` (the committed, diffable baseline) and
`test/baseline/web-vitals.json` (git-ignored per-run data). This is a
measurement tool — it does **not** assert pass/fail targets; project targets
should be set only after reviewing the baseline (and real field/CrUX data).

## Accessibility regression checks (Phase 4, Task 26)

Run the accessibility suite with:

```
npm run test:a11y
```

The suite serves the static site locally, audits the homepage plus representative
tool, conversion, category, guide, and accessibility-statement pages with `axe-core`, and fails
on `critical` or `serious` findings (including supported color-contrast rules).
It also checks visible keyboard focus, Enter/Escape behavior and focus return
for the mobile menu and search dialog, keyboard accordion activation,
accessible names, landmarks, and heading order. Because the cookie-settings
dialog is part of that keyboard path, the suite also confirms that PageSense
stays blocked after a decline and is requested only after explicit consent.

Scroll-reveal is disabled only inside the audit so below-the-fold content is
tested in its settled, visible state. Axe checks that need human judgment are
printed as `manual review` entries in the test output rather than hidden.

There are currently no known axe exceptions. If a deliberate exception is
needed, add an exact rule/target pair to `KNOWN_EXCEPTIONS` in `test/a11y.mjs`
and document the selector, rationale, owner, and review condition here. Broad
rule-level exclusions are not allowed.

## Route and link crawler (Phase 4, Task 27)

Run the crawler and its fixture tests with:

```
npm run test:links
```

The Node-only gate reads `sitemap.xml`, every generated HTML file, and
`_redirects`, then serves the repository with the local Netlify-compatible
harness. It requires every sitemap canonical to return a direct HTTP 200,
checks internal link status codes and fragments, verifies 301/302 rules really
redirect with the declared status and location, rejects redirect chains, and
fails links that still point to legacy redirect sources. External, `mailto:`,
`tel:`, `javascript:`, and `data:` links are outside this internal-route check.

Failures are aggregated and name the source file plus the broken route,
fragment, redirect, or preferred canonical target. CI runs this gate before
installing Playwright so route regressions fail quickly.

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
  ~100/500/1500 ms after `DOMContentLoaded` and records the browser's buffered
  Cumulative Layout Shift across the full navigation lifecycle.

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
