// test/web-vitals.mjs
// Core Web Vitals measurement for WeConvertFiles (Phase 4, Task 26).
//
// Measures LCP, CLS and INP for representative pages on desktop and mobile, for
// cold (empty cache) and warm (repeat visit) loads, using Google's web-vitals
// library injected into the page. These are LAB measurements against the local
// static server (test/serve.mjs) under fixed conditions — reproducible and
// comparable between commits, not field data. It does NOT assert pass/fail
// targets: targets should be set only after reviewing this baseline.
//
// Output: a committed baseline (test/baseline/WEB-VITALS.md) and a per-run JSON
// (test/baseline/web-vitals.json, git-ignored). Median of N runs per config.
import { chromium } from 'playwright';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { startServer } from './serve.mjs';

if (!process.env.PLAYWRIGHT_BROWSERS_PATH) {
  const { existsSync } = await import('node:fs');
  if (existsSync('/opt/pw-browsers')) process.env.PLAYWRIGHT_BROWSERS_PATH = '/opt/pw-browsers';
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_JSON = path.join(__dirname, 'baseline', 'web-vitals.json');
const OUT_MD = path.join(__dirname, 'baseline', 'WEB-VITALS.md');
const WV_SRC = await readFile(path.join(__dirname, '..', 'node_modules', 'web-vitals', 'dist', 'web-vitals.iife.js'), 'utf8');

const RUNS = 3;
const VIEWPORTS = [
  { name: 'desktop', width: 1280, height: 800, cpu: 1 },
  { name: 'mobile', width: 390, height: 844, cpu: 4, isMobile: true } // 4x CPU ~ mid-tier phone
];
const PAGES = [
  { label: 'Homepage', path: '/' },
  { label: 'Tool (Merge PDF)', path: '/merge-pdf' },
  { label: 'Guide (Merge PDF)', path: '/guides/merge-pdf' },
  { label: 'Conversion (JPG to PDF)', path: '/convert/jpg-to-pdf' },
  { label: 'Legal (Privacy)', path: '/privacy' }
];

// Register web-vitals collectors before any page script runs; reportAllChanges
// so we can read the running values without waiting for page unload.
const INIT = `${WV_SRC};
window.__vitals = {};
webVitals.onLCP((m) => { window.__vitals.LCP = m.value; }, { reportAllChanges: true });
webVitals.onCLS((m) => { window.__vitals.CLS = m.value; }, { reportAllChanges: true });
webVitals.onINP((m) => { window.__vitals.INP = m.value; }, { reportAllChanges: true });`;

const median = (xs) => {
  const v = xs.filter((x) => x != null).sort((a, b) => a - b);
  if (!v.length) return null;
  const mid = Math.floor(v.length / 2);
  return v.length % 2 ? v[mid] : (v[mid - 1] + v[mid]) / 2;
};
const round = (x, d = 0) => (x == null ? null : Math.round(x * 10 ** d) / 10 ** d);

async function measureOnce(browser, origin, def, vp, warm) {
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    isMobile: !!vp.isMobile,
    hasTouch: !!vp.isMobile
  });
  const page = await context.newPage();
  if (vp.cpu > 1) {
    const client = await context.newCDPSession(page);
    await client.send('Emulation.setCPUThrottlingRate', { rate: vp.cpu });
  }
  await page.addInitScript(INIT);

  if (warm) {
    // Prime the HTTP cache, then measure the repeat visit (addInitScript re-runs
    // on the reload, so window.__vitals reflects the warm load).
    await page.goto(origin + def.path, { waitUntil: 'load' }).catch(() => {});
    await page.waitForLoadState('networkidle').catch(() => {});
    await page.reload({ waitUntil: 'load' }).catch(() => {});
  } else {
    await page.goto(origin + def.path, { waitUntil: 'load' }).catch(() => {});
  }
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.waitForTimeout(500);

  // Generate real interactions so INP has something to measure (non-navigating).
  const toggle = vp.isMobile ? '#mobileDarkModeToggle' : '#darkModeToggle';
  for (let i = 0; i < 3; i++) {
    await page.locator(toggle).click({ timeout: 2000 }).catch(() => {});
    await page.waitForTimeout(120);
  }
  await page.waitForTimeout(400);

  const v = await page.evaluate(() => window.__vitals || {});
  await context.close();
  return { LCP: v.LCP ?? null, CLS: v.CLS ?? null, INP: v.INP ?? null };
}

async function main() {
  const { origin, close } = await startServer({ port: 0 });
  const browser = await chromium.launch({ headless: true });
  const results = [];

  try {
    for (const def of PAGES) {
      for (const vp of VIEWPORTS) {
        for (const warm of [false, true]) {
          const runs = [];
          for (let i = 0; i < RUNS; i++) runs.push(await measureOnce(browser, origin, def, vp, warm));
          const agg = {
            page: def.label,
            path: def.path,
            device: vp.name,
            load: warm ? 'warm' : 'cold',
            runs: RUNS,
            LCP_ms: round(median(runs.map((r) => r.LCP))),
            CLS: round(median(runs.map((r) => r.CLS)), 4),
            INP_ms: round(median(runs.map((r) => r.INP)))
          };
          results.push(agg);
          console.log(`• ${def.label} [${vp.name}/${agg.load}] LCP=${agg.LCP_ms}ms CLS=${agg.CLS} INP=${agg.INP_ms ?? 'n/a'}ms`);
        }
      }
    }
  } finally {
    await browser.close();
    await close();
  }

  let playwrightVersion = 'unknown';
  try { playwrightVersion = JSON.parse(await readFile(path.join(__dirname, '..', 'node_modules', 'playwright', 'package.json'), 'utf8')).version; } catch {}
  let wvVersion = 'unknown';
  try { wvVersion = JSON.parse(await readFile(path.join(__dirname, '..', 'node_modules', 'web-vitals', 'package.json'), 'utf8')).version; } catch {}

  const report = { generatedAt: new Date().toISOString(), env: { playwrightVersion, webVitalsVersion: wvVersion, runsPerConfig: RUNS, note: 'Lab measurements vs the local static server under fixed conditions (mobile at 4x CPU throttle). Not field data. Targets not yet set.' }, results };

  await mkdir(path.dirname(OUT_JSON), { recursive: true });
  await writeFile(OUT_JSON, JSON.stringify(report, null, 2));
  await writeFile(OUT_MD, renderMarkdown(report));
  console.log(`\nWrote baseline to ${path.relative(process.cwd(), OUT_MD)} (and web-vitals.json).`);
}

function renderMarkdown(report) {
  const L = [];
  L.push('# WeConvertFiles — Core Web Vitals baseline');
  L.push('');
  L.push(`Generated: ${report.generatedAt}`);
  L.push('');
  L.push('Reproduce:');
  L.push('');
  L.push('```');
  L.push('npm run measure:vitals');
  L.push('```');
  L.push('');
  L.push('## Method');
  L.push('');
  L.push(`- Metrics: **LCP**, **CLS**, **INP**, collected with Google's web-vitals ${report.env.webVitalsVersion} injected into the page.`);
  L.push(`- Browser: Chromium via Playwright ${report.env.playwrightVersion}, headless, against the local static server (\`test/serve.mjs\`).`);
  L.push('- Desktop 1280×800 (no CPU throttle); mobile 390×844 at **4× CPU throttle** (~mid-tier phone).');
  L.push('- **Cold** = empty-cache first visit; **warm** = repeat visit with assets cached.');
  L.push(`- INP is exercised with three non-navigating interactions (dark-mode toggle) per load. Median of ${report.env.runsPerConfig} runs per configuration.`);
  L.push('- These are **lab** numbers under fixed conditions — reproducible and comparable between commits, **not** field data.');
  L.push('');
  L.push('> Targets are intentionally **not** set here. Establish project targets only after reviewing this measured baseline (and, ideally, real field/CrUX data). The columns below are measurements, not commitments.');
  L.push('');
  L.push('## Results (median)');
  L.push('');
  L.push('| Page | Device | Load | LCP (ms) | CLS | INP (ms) |');
  L.push('| --- | --- | --- | ---: | ---: | ---: |');
  for (const r of report.results) {
    L.push(`| ${r.page} | ${r.device} | ${r.load} | ${r.LCP_ms ?? 'n/a'} | ${r.CLS ?? 'n/a'} | ${r.INP_ms ?? 'n/a'} |`);
  }
  L.push('');
  L.push('For reference only, Google\'s "good" field thresholds are LCP ≤ 2500 ms, CLS ≤ 0.1, INP ≤ 200 ms. Lab numbers here are not directly comparable to field data but are useful for commit-to-commit comparison.');
  L.push('');
  return L.join('\n');
}

main().catch((err) => { console.error(err); process.exit(1); });
