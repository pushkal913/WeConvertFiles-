// test/jitter-regression.mjs
// Layout-shift / page-jitter regression test (Phase 4, Task 25).
//
// Phase 1 measured the shell-injection jitter; Phases 1-2 fixed it by baking the
// static shell into every delivered page (layout.js detects <header data-wcf-shell>
// and skips runtime injection). This turns that fix into an automatic guard,
// reusing the Phase 1 baseline methodology:
//
//   1. Deterministic pass (timing-independent): load each page once with
//      layout.js BLOCKED and once normally, and compare the top edge of
//      header/main/footer. If the static shell is intact the header is already
//      present when layout.js is blocked and nothing moves. If someone
//      reintroduces runtime shell injection, the header is absent when blocked,
//      then appears on the normal load and pushes content down -> a large shift.
//   2. Timeline pass: under a fixed CPU throttle, sample the same boxes at
//      ~100/500/1500ms after navigation and measure how far each moved, plus the
//      browser's own Cumulative Layout Shift.
//
// Only movement within the thresholds below (known/intentional) passes; anything
// larger fails and names the page + element. A compact diagnostic is written to
// test/baseline/jitter-regression.json. Runs against the local static server
// (test/serve.mjs); no production files are touched. Exits non-zero on failure.
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { startServer } from './serve.mjs';

if (!process.env.PLAYWRIGHT_BROWSERS_PATH) {
  const { existsSync } = await import('node:fs');
  if (existsSync('/opt/pw-browsers')) process.env.PLAYWRIGHT_BROWSERS_PATH = '/opt/pw-browsers';
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, 'baseline', 'jitter-regression.json');

const VIEWPORT = { width: 1280, height: 800 };
const SELECTORS = ['header', 'main', 'footer', 'h1'];
const GUARDED = ['header', 'main', 'footer']; // h1 is measured but not threshold-gated (tool H1 view-swaps)
const CPU_THROTTLE_RATE = 4;
const SAMPLE_TIMES_MS = [100, 500, 1500];

// Thresholds — allow only small/known movement. Current site measures 0 on all.
const SHIFT_PX = 2;      // deterministic blocked-vs-settled shift
const TIMELINE_PX = 2;   // movement across timeline samples
const CLS_MAX = 0.05;    // Cumulative Layout Shift (Google "good" is < 0.1)

// One page per shell type: inline-shell homepage, SPA-shell tool page, and
// baked-static-shell content pages (guide, convert, legal, about).
const TARGETS = [
  { label: 'Homepage', path: '/' },
  { label: 'Tool: Merge PDF', path: '/merge-pdf' },
  { label: 'Guide: Merge PDF', path: '/guides/merge-pdf' },
  { label: 'Convert: JPG to PDF', path: '/convert/jpg-to-pdf' },
  { label: 'Legal: Privacy', path: '/privacy' },
  { label: 'About', path: '/about' }
];

const failures = [];
const fail = (msg) => failures.push(msg);

const tops = (page) => page.evaluate((sels) => Object.fromEntries(sels.map((s) => {
  const el = document.querySelector(s);
  return [s, el ? Math.round(el.getBoundingClientRect().top * 100) / 100 : null];
})), SELECTORS);

async function deterministicPass(browser, origin, target) {
  // (a) layout.js blocked — the runtime shell never injects.
  const c1 = await browser.newContext({ viewport: VIEWPORT });
  const p1 = await c1.newPage();
  await p1.route('**/layout.js*', (r) => r.abort());
  await p1.goto(origin + target.path, { waitUntil: 'load' }).catch(() => {});
  await p1.waitForTimeout(200);
  const blocked = await tops(p1);
  const headerPresentBlocked = await p1.evaluate(() => !!document.querySelector('header'));
  await c1.close();

  // (b) normal, settled.
  const c2 = await browser.newContext({ viewport: VIEWPORT });
  const p2 = await c2.newPage();
  await p2.goto(origin + target.path, { waitUntil: 'load' }).catch(() => {});
  await p2.waitForLoadState('networkidle').catch(() => {});
  await p2.waitForTimeout(300);
  const settled = await tops(p2);
  await c2.close();

  const shift = {};
  for (const s of SELECTORS) {
    shift[s] = (blocked[s] != null && settled[s] != null)
      ? Math.round((settled[s] - blocked[s]) * 100) / 100 : null;
  }
  return { headerPresentBlocked, shift };
}

async function timelinePass(browser, origin, target) {
  const context = await browser.newContext({ viewport: VIEWPORT });
  const page = await context.newPage();
  await page.addInitScript(() => {
    window.__cls = 0;
    try {
      new PerformanceObserver((list) => {
        for (const e of list.getEntries()) if (!e.hadRecentInput) window.__cls += e.value;
      }).observe({ type: 'layout-shift', buffered: true });
    } catch (e) { /* not supported */ }
  });
  const client = await context.newCDPSession(page);
  await client.send('Emulation.setCPUThrottlingRate', { rate: CPU_THROTTLE_RATE });

  await page.goto(origin + target.path, { waitUntil: 'commit' });
  const t0 = Date.now();
  const samples = [];
  for (const ms of SAMPLE_TIMES_MS) {
    const wait = ms - (Date.now() - t0);
    if (wait > 0) await page.waitForTimeout(wait);
    samples.push(await tops(page));
  }
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.waitForTimeout(200);
  const cls = await page.evaluate(() => Math.round((window.__cls || 0) * 10000) / 10000);
  await context.close();

  // Max top movement per element across the samples.
  const move = {};
  for (const s of SELECTORS) {
    const vals = samples.map((r) => r[s]).filter((v) => v != null);
    move[s] = vals.length > 1 ? Math.round((Math.max(...vals) - Math.min(...vals)) * 100) / 100 : 0;
  }
  return { move, cls };
}

async function main() {
  const { origin, close } = await startServer({ port: 0 });
  const browser = await chromium.launch({ headless: true });
  const results = [];

  try {
    for (const target of TARGETS) {
      process.stdout.write(`• ${target.label} (${target.path}) … `);
      const det = await deterministicPass(browser, origin, target);
      const tl = await timelinePass(browser, origin, target);

      // The core guard: the header must already exist with layout.js blocked.
      if (!det.headerPresentBlocked) {
        fail(`${target.label} (${target.path}): header is NOT present when layout.js is blocked — runtime shell injection reintroduced (the Phase 1 jitter).`);
      }
      for (const el of GUARDED) {
        if (det.shift[el] != null && Math.abs(det.shift[el]) > SHIFT_PX) {
          fail(`${target.label} (${target.path}): <${el}> shifts ${det.shift[el]}px between shell-blocked and settled loads (> ${SHIFT_PX}px).`);
        }
        if (tl.move[el] > TIMELINE_PX) {
          fail(`${target.label} (${target.path}): <${el}> moves ${tl.move[el]}px across load (> ${TIMELINE_PX}px).`);
        }
      }
      if (tl.cls > CLS_MAX) {
        fail(`${target.label} (${target.path}): Cumulative Layout Shift ${tl.cls} (> ${CLS_MAX}).`);
      }

      results.push({ ...target, headerPresentBlocked: det.headerPresentBlocked, deterministicShift: det.shift, timelineMove: tl.move, cls: tl.cls });
      const bad = failures.some((f) => f.includes(target.path));
      console.log(bad ? 'FAIL' : `ok (shift main ${det.shift.main}px, CLS ${tl.cls})`);
    }
  } finally {
    await browser.close();
    await close();
  }

  await mkdir(path.dirname(OUT), { recursive: true });
  await writeFile(OUT, JSON.stringify({
    generatedAt: new Date().toISOString(),
    thresholds: { shiftPx: SHIFT_PX, timelinePx: TIMELINE_PX, clsMax: CLS_MAX, cpuThrottleRate: CPU_THROTTLE_RATE },
    results
  }, null, 2));

  if (failures.length) {
    console.error('\nJitter regression FAILED:');
    for (const f of failures) console.error(`- ${f}`);
    console.error(`\nDiagnostic: ${path.relative(process.cwd(), OUT)}`);
    process.exit(1);
  }
  console.log(`\nJitter regression passed: ${results.length} pages, no unexpected movement. Diagnostic: ${path.relative(process.cwd(), OUT)}`);
}

main().catch((err) => { console.error(err); process.exit(1); });
