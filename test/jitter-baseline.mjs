// test/jitter-baseline.mjs
// Browser-level baseline for WeConvertFiles page jitter.
//
// WHAT THIS MEASURES (measured only — nothing here is estimated):
//
//   1. Timeline pass: loads each page with a fixed CPU throttle so the
//      deferred page-shell script (layout.js) lands the way it does on a
//      mid-tier device, then samples viewport screenshots + element bounding
//      boxes at ~100ms / ~500ms / ~1500ms after the response commits. It
//      records the browser's own Layout Shift entries (the same signal that
//      feeds Cumulative Layout Shift), console errors, and failed requests.
//
//   2. Shell-injection pass (deterministic, timing-independent): loads each
//      page once with layout.js blocked (the shell never injects) and once
//      normally (shell settled), and reports the difference in the top edge
//      of <main> / <h1>. That delta is exactly how far the visible content
//      jumps when the runtime header is prepended to <body>.
//
// It writes screenshots + report.json + REPORT.md under test/baseline/.
//
// No production files are modified. The harness only loads the site over a
// local static server (test/serve.mjs) and observes it.
import { chromium } from 'playwright';
import { mkdir, writeFile, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { startServer } from './serve.mjs';

// Some managed environments ship a pre-installed Chromium in a fixed location
// (Playwright reads PLAYWRIGHT_BROWSERS_PATH). Honour it when present so the
// harness does not try to download a browser; otherwise Playwright falls back
// to its own default install (`npx playwright install chromium`).
if (!process.env.PLAYWRIGHT_BROWSERS_PATH) {
  const { existsSync } = await import('node:fs');
  if (existsSync('/opt/pw-browsers')) process.env.PLAYWRIGHT_BROWSERS_PATH = '/opt/pw-browsers';
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, 'baseline');
const SHOT_DIR = path.join(OUT_DIR, 'screenshots');

// CPU throttle applied during the timeline pass. Deferred scripts run after
// first paint on real mid-tier hardware; a fixed multiplier makes that
// reproducible in a fast headless environment. Recorded in the report.
const CPU_THROTTLE_RATE = 6;
const VIEWPORT = { width: 1280, height: 800 };
const SAMPLE_TIMES_MS = [100, 500, 1500];
const SELECTORS = ['header', 'main', 'footer', 'h1'];

const TARGETS = [
  { slug: 'home', path: '/', label: 'Homepage (static shell — control)' },
  { slug: 'guide-bulk-resize', path: '/guides/bulk-resize.html', label: 'Guide: Bulk Resize' },
  { slug: 'privacy', path: '/privacy', label: 'Legal: Privacy Policy' },
  { slug: 'about', path: '/about', label: 'About page' },
  { slug: 'tool-bulk-resize', path: '/bulk-resize', label: 'Tool page: Bulk Image Resizer' }
];

const rectScript = (selectors) => {
  return selectors.reduce((acc, sel) => {
    const el = document.querySelector(sel);
    if (el) {
      const r = el.getBoundingClientRect();
      acc[sel] = {
        top: Math.round(r.top * 100) / 100,
        left: Math.round(r.left * 100) / 100,
        width: Math.round(r.width * 100) / 100,
        height: Math.round(r.height * 100) / 100
      };
    } else {
      acc[sel] = null;
    }
    return acc;
  }, {});
};

// Installed before any page script runs: accumulate Layout Shift entries.
function clsInitScript() {
  window.__wcf = { cls: 0, shifts: [] };
  try {
    const po = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.hadRecentInput) continue;
        window.__wcf.cls += entry.value;
        window.__wcf.shifts.push({
          value: Math.round(entry.value * 10000) / 10000,
          startTime: Math.round(entry.startTime)
        });
      }
    });
    po.observe({ type: 'layout-shift', buffered: true });
  } catch (e) {
    window.__wcf.error = String(e);
  }
}

async function collectRects(page) {
  return page.evaluate(rectScript, SELECTORS);
}

async function timelinePass(browser, origin, target) {
  const context = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: 1 });
  const page = await context.newPage();
  await page.addInitScript(clsInitScript);

  const consoleErrors = [];
  const failedRequests = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', (err) => consoleErrors.push('pageerror: ' + err.message));
  page.on('requestfailed', (req) => {
    failedRequests.push({ url: req.url(), reason: req.failure() && req.failure().errorText });
  });

  // Throttle CPU so the deferred shell injection lands after first paint.
  const client = await context.newCDPSession(page);
  await client.send('Emulation.setCPUThrottlingRate', { rate: CPU_THROTTLE_RATE });

  const samples = [];
  await page.goto(origin + target.path, { waitUntil: 'commit' });
  const t0 = Date.now();

  for (const targetMs of SAMPLE_TIMES_MS) {
    const wait = targetMs - (Date.now() - t0);
    if (wait > 0) await page.waitForTimeout(wait);
    const elapsed = Date.now() - t0;
    const rects = await collectRects(page);
    const shotPath = path.join(SHOT_DIR, `${target.slug}-${targetMs}ms.png`);
    await page.screenshot({ path: shotPath, fullPage: false });
    samples.push({ targetMs, actualMs: elapsed, rects, screenshot: path.relative(OUT_DIR, shotPath) });
  }

  // Let everything settle, then read the browser's own layout-shift signal.
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.waitForTimeout(300);
  const cls = await page.evaluate(() => window.__wcf || { cls: null, shifts: [] });
  const navTiming = await page.evaluate(() => {
    const paints = {};
    for (const p of performance.getEntriesByType('paint')) paints[p.name] = Math.round(p.startTime);
    const nav = performance.getEntriesByType('navigation')[0] || {};
    return {
      firstPaint: paints['first-paint'] ?? null,
      firstContentfulPaint: paints['first-contentful-paint'] ?? null,
      domContentLoaded: nav.domContentLoadedEventEnd ? Math.round(nav.domContentLoadedEventEnd) : null,
      loadEvent: nav.loadEventEnd ? Math.round(nav.loadEventEnd) : null
    };
  });

  // Movement summary: how far <main> and <h1> tops moved between the first
  // and last sample.
  const first = samples[0].rects;
  const last = samples[samples.length - 1].rects;
  const movement = {};
  for (const sel of SELECTORS) {
    if (first[sel] && last[sel]) {
      movement[sel + 'TopDeltaPx'] = Math.round((last[sel].top - first[sel].top) * 100) / 100;
    }
  }

  await context.close();
  return {
    cls: Math.round(cls.cls * 10000) / 10000,
    layoutShifts: cls.shifts,
    navTiming,
    samples,
    movementFirstToLast: movement,
    consoleErrors,
    failedRequests
  };
}

async function shellInjectionPass(browser, origin, target) {
  // (a) Block layout.js: the runtime shell never injects -> pre-injection layout.
  const ctxNoShell = await browser.newContext({ viewport: VIEWPORT });
  const pageNoShell = await ctxNoShell.newPage();
  await pageNoShell.route('**/layout.js*', (route) => route.abort());
  await pageNoShell.goto(origin + target.path, { waitUntil: 'load' }).catch(() => {});
  await pageNoShell.waitForTimeout(200);
  const preRects = await collectRects(pageNoShell);
  const preHasHeader = await pageNoShell.evaluate(() => !!document.querySelector('header'));
  const preShot = path.join(SHOT_DIR, `${target.slug}-shell-blocked.png`);
  await pageNoShell.screenshot({ path: preShot, fullPage: false });
  await ctxNoShell.close();

  // (b) Normal load: shell settles -> post-injection layout.
  const ctxShell = await browser.newContext({ viewport: VIEWPORT });
  const pageShell = await ctxShell.newPage();
  await pageShell.goto(origin + target.path, { waitUntil: 'load' }).catch(() => {});
  await pageShell.waitForLoadState('networkidle').catch(() => {});
  await pageShell.waitForTimeout(300);
  const postRects = await collectRects(pageShell);
  const postHasHeader = await pageShell.evaluate(() => !!document.querySelector('header'));
  const postShot = path.join(SHOT_DIR, `${target.slug}-shell-settled.png`);
  await pageShell.screenshot({ path: postShot, fullPage: false });
  await ctxShell.close();

  const shift = {};
  for (const sel of SELECTORS) {
    if (preRects[sel] && postRects[sel]) {
      shift[sel + 'TopShiftPx'] = Math.round((postRects[sel].top - preRects[sel].top) * 100) / 100;
    }
  }

  return {
    headerInjectedAtRuntime: !preHasHeader && postHasHeader,
    preInjection: preRects,
    postInjection: postRects,
    contentShiftPx: shift,
    screenshots: {
      shellBlocked: path.relative(OUT_DIR, preShot),
      shellSettled: path.relative(OUT_DIR, postShot)
    }
  };
}

function renderMarkdown(report) {
  const lines = [];
  lines.push('# WeConvertFiles — Page Jitter Baseline');
  lines.push('');
  lines.push(`Generated: ${report.generatedAt}`);
  lines.push('');
  lines.push('Reproduce with a single command:');
  lines.push('');
  lines.push('```');
  lines.push('npm run baseline:jitter');
  lines.push('```');
  lines.push('');
  lines.push('## How this was measured');
  lines.push('');
  lines.push(`- Browser: Chromium via Playwright ${report.env.playwrightVersion}, headless.`);
  lines.push(`- Viewport: ${report.env.viewport.width}×${report.env.viewport.height}, deviceScaleFactor 1.`);
  lines.push(`- Timeline pass CPU throttle: ${report.env.cpuThrottleRate}× (CDP Emulation.setCPUThrottlingRate), so the deferred shell script lands after first paint the way it does on mid-tier hardware.`);
  lines.push(`- Samples taken at ~${SAMPLE_TIMES_MS.join(', ')} ms after the navigation response commits.`);
  lines.push('- "Shell-injection pass" is timing-independent: it compares the page with `layout.js` blocked (shell never injects) against a normal settled load. The difference is exactly how far content jumps when the runtime header is prepended.');
  lines.push('- All numbers below are measured by the browser. Nothing is estimated.');
  lines.push('');
  lines.push('## Summary');
  lines.push('');
  lines.push('| Page | Runtime header injected? | Content jump (main top) | Observed CLS | Console errors | Failed requests |');
  lines.push('| --- | --- | --- | --- | --- | --- |');
  for (const r of report.results) {
    const jump = r.shellInjection.contentShiftPx.mainTopShiftPx;
    const jumpStr = jump === undefined ? 'n/a' : `${jump > 0 ? '+' : ''}${jump}px`;
    lines.push(
      `| ${r.label} (\`${r.path}\`) | ${r.shellInjection.headerInjectedAtRuntime ? 'yes' : 'no'} | ${jumpStr} | ${r.timeline.cls} | ${r.timeline.consoleErrors.length} | ${r.timeline.failedRequests.length} |`
    );
  }
  lines.push('');
  lines.push('> "Content jump (main top)" is the downward shift of the `<main>` element between the shell-blocked and settled loads. A positive value means content visibly moves down when the runtime header appears — the jitter.');
  lines.push('');
  lines.push('## Per-page detail');
  lines.push('');
  for (const r of report.results) {
    lines.push(`### ${r.label} — \`${r.path}\``);
    lines.push('');
    lines.push(`- Runtime header injected by layout.js: **${r.shellInjection.headerInjectedAtRuntime ? 'yes' : 'no'}**`);
    lines.push('- Shell-injection content shift (post − pre, px):');
    for (const [k, v] of Object.entries(r.shellInjection.contentShiftPx)) {
      lines.push(`    - ${k}: ${v > 0 ? '+' : ''}${v}`);
    }
    lines.push(`- Before/after (deterministic) screenshots: \`${r.shellInjection.screenshots.shellBlocked}\` → \`${r.shellInjection.screenshots.shellSettled}\``);
    lines.push(`- Observed CLS (throttled timeline): ${r.timeline.cls}`);
    if (r.timeline.layoutShifts.length) {
      const list = r.timeline.layoutShifts.map((s) => `${s.value}@${s.startTime}ms`).join(', ');
      lines.push(`- Layout-shift entries: ${list}`);
    }
    lines.push(`- Nav timing (throttled): FP=${r.timeline.navTiming.firstPaint}ms, FCP=${r.timeline.navTiming.firstContentfulPaint}ms, DCL=${r.timeline.navTiming.domContentLoaded}ms, load=${r.timeline.navTiming.loadEvent}ms`);
    lines.push('- Timeline samples (main top, px):');
    for (const s of r.timeline.samples) {
      const mt = s.rects.main ? s.rects.main.top : 'n/a';
      const hdr = s.rects.header ? 'header present' : 'no header yet';
      lines.push(`    - ~${s.targetMs}ms (actual ${s.actualMs}ms): main.top=${mt}, ${hdr} → ${s.screenshot}`);
    }
    lines.push(`- Main top delta first→last sample: ${r.timeline.movementFirstToLast.mainTopDeltaPx ?? 'n/a'}px`);
    if (r.timeline.consoleErrors.length) {
      lines.push('- Console errors:');
      for (const e of r.timeline.consoleErrors) lines.push(`    - ${e}`);
    }
    if (r.timeline.failedRequests.length) {
      lines.push('- Failed requests:');
      for (const f of r.timeline.failedRequests) lines.push(`    - ${f.url} (${f.reason})`);
    }
    lines.push('');
  }
  lines.push('## Notes for later phases');
  lines.push('');
  lines.push('- The jitter originates in `layout.js`, which prepends a sticky `<header>` to `<body>` via `insertAdjacentHTML("afterbegin", …)` after `DOMContentLoaded`, and appends the footer. Pages that ship an inline shell (the homepage) show no such jump; pages that rely on runtime injection do.');
  lines.push('- Re-run this harness after each change and compare `test/baseline/report.json` to confirm the content jump trends to 0 without regressing CLS, console errors, or failed requests.');
  lines.push('');
  return lines.join('\n');
}

async function main() {
  await rm(OUT_DIR, { recursive: true, force: true });
  await mkdir(SHOT_DIR, { recursive: true });

  const { origin, close } = await startServer({ port: 0 });
  const browser = await chromium.launch({ headless: true });
  const results = [];

  try {
    for (const target of TARGETS) {
      process.stdout.write(`• ${target.label} (${target.path}) … `);
      const timeline = await timelinePass(browser, origin, target);
      const shellInjection = await shellInjectionPass(browser, origin, target);
      results.push({ ...target, timeline, shellInjection });
      const jump = shellInjection.contentShiftPx.mainTopShiftPx;
      console.log(`main jump ${jump === undefined ? 'n/a' : (jump > 0 ? '+' : '') + jump + 'px'}, CLS ${timeline.cls}`);
    }
  } finally {
    await browser.close();
    await close();
  }

  let playwrightVersion = 'unknown';
  try {
    const pkgUrl = new URL('../node_modules/playwright/package.json', import.meta.url);
    playwrightVersion = JSON.parse(await (await import('node:fs/promises')).readFile(pkgUrl, 'utf8')).version;
  } catch { /* leave as unknown */ }

  const report = {
    generatedAt: new Date().toISOString(),
    env: {
      playwrightVersion,
      cpuThrottleRate: CPU_THROTTLE_RATE,
      viewport: VIEWPORT,
      sampleTimesMs: SAMPLE_TIMES_MS
    },
    results
  };

  await writeFile(path.join(OUT_DIR, 'report.json'), JSON.stringify(report, null, 2));
  await writeFile(path.join(OUT_DIR, 'REPORT.md'), renderMarkdown(report));
  console.log(`\nBaseline written to ${path.relative(process.cwd(), OUT_DIR)}/REPORT.md`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
