// test/smoke.mjs
// Headless Playwright smoke coverage for WeConvertFiles (Phase 4, Task 23).
//
// Loads representative pages across desktop and mobile viewports and asserts
// each renders (HTTP ok, non-empty <title>, a <main>), with no unexpected
// console/page errors or failed same-origin requests. Then walks the primary
// navigation journeys (homepage -> tool, tool -> category hub, category -> tool,
// guide -> tool) to confirm internal routes work.
//
// Runs against the local static server (test/serve.mjs), which mirrors the
// Netlify _redirects, so it needs no network and exits non-zero on any failure
// (CI-friendly). No production files are touched.
import { chromium } from 'playwright';
import { startServer } from './serve.mjs';

// Honour a pre-installed Chromium (managed envs set PLAYWRIGHT_BROWSERS_PATH).
if (!process.env.PLAYWRIGHT_BROWSERS_PATH) {
  const { existsSync } = await import('node:fs');
  if (existsSync('/opt/pw-browsers')) process.env.PLAYWRIGHT_BROWSERS_PATH = '/opt/pw-browsers';
}

const VIEWPORTS = [
  { name: 'desktop', width: 1280, height: 800 },
  { name: 'mobile', width: 390, height: 844, isMobile: true, hasTouch: true }
];

// One representative page per important type.
const PAGES = [
  { label: 'Homepage', path: '/' },
  { label: 'PDF tool (Merge PDF)', path: '/merge-pdf' },
  { label: 'Image tool (Image Cropper)', path: '/image-cropper' },
  { label: 'Developer tool (JSON Formatter)', path: '/json-formatter' },
  { label: 'Conversion page (JPG to PDF)', path: '/convert/jpg-to-pdf' },
  { label: 'Guide (Merge PDF)', path: '/guides/merge-pdf' },
  { label: 'Legal (Privacy)', path: '/privacy' }
];

// Third-party hosts may be blocked/absent in CI; a failed request to one of
// these is not a site defect. Same-origin failures always fail the smoke test.
const ALLOW_FAILED = [/fonts\.googleapis/, /fonts\.gstatic/, /cloudflare/, /jsdelivr/, /cdnjs/, /unpkg/, /zoho/, /pagesense/, /googletagmanager/, /google-analytics/];

let passed = 0;
const failures = [];
const pass = () => { passed += 1; };
const fail = (msg) => { failures.push(msg); };

function watch(page, sameOrigin) {
  const errors = [];
  const failedReqs = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  page.on('requestfailed', (r) => {
    const url = r.url();
    if (url.startsWith(sameOrigin) && !ALLOW_FAILED.some((re) => re.test(url))) {
      failedReqs.push(`${url} (${r.failure() && r.failure().errorText})`);
    }
  });
  return { errors, failedReqs };
}

async function checkPage(browser, origin, def, vp) {
  const label = `${def.label} [${vp.name}]`;
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    isMobile: !!vp.isMobile,
    hasTouch: !!vp.hasTouch
  });
  const page = await context.newPage();
  const seen = watch(page, origin);
  let resp = null;
  try {
    resp = await page.goto(origin + def.path, { waitUntil: 'networkidle', timeout: 20000 });
  } catch (e) {
    fail(`${label}: navigation failed — ${e.message}`);
    await context.close();
    return;
  }
  await page.waitForTimeout(300);

  if (resp && resp.status() < 400) pass(); else fail(`${label}: HTTP ${resp && resp.status()}`);
  const title = (await page.title()).trim();
  if (title) pass(); else fail(`${label}: empty <title>`);
  if (await page.locator('main').count() > 0) pass(); else fail(`${label}: no <main> element`);
  // Mobile: page must not scroll horizontally beyond a tiny rounding margin.
  if (vp.isMobile) {
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    if (overflow <= 4) pass(); else fail(`${label}: horizontal overflow of ${overflow}px`);
  }
  if (seen.errors.length === 0) pass(); else fail(`${label}: console error(s) — ${seen.errors.join(' | ')}`);
  if (seen.failedReqs.length === 0) pass(); else fail(`${label}: failed request(s) — ${seen.failedReqs.join(' | ')}`);

  await context.close();
}

async function journey(browser, origin, name, steps) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  const seen = watch(page, origin);
  try {
    await steps(page);
    if (seen.errors.length === 0) pass(); else fail(`journey "${name}": console error(s) — ${seen.errors.join(' | ')}`);
  } catch (e) {
    fail(`journey "${name}": ${e.message}`);
  } finally {
    await context.close();
  }
}

async function expectPath(page, expected, name) {
  await page.waitForTimeout(400);
  const got = new URL(page.url()).pathname;
  if (got === expected) pass(); else fail(`journey "${name}": expected path ${expected}, got ${got}`);
}

async function main() {
  const { origin, close } = await startServer({ port: 0 });
  const browser = await chromium.launch({ headless: true });

  try {
    for (const def of PAGES) {
      for (const vp of VIEWPORTS) {
        process.stdout.write(`• ${def.label} [${vp.name}] … `);
        const before = failures.length;
        await checkPage(browser, origin, def, vp);
        console.log(failures.length === before ? 'ok' : 'FAIL');
      }
    }

    // Primary navigation journeys.
    await journey(browser, origin, 'homepage -> tool', async (page) => {
      await page.goto(origin + '/', { waitUntil: 'networkidle' });
      // Dashboard tool cards are app.js-rendered <button data-tool-id> (the
      // visible entry point; the same-id <a> lives in a collapsed nav menu).
      await page.locator('button[data-tool-id="merge-pdf"]').first().click();
      await expectPath(page, '/merge-pdf', 'homepage -> tool');
      if (await page.locator('#workspaceView').isVisible()) pass(); else fail('journey "homepage -> tool": workspace not visible');
    });

    await journey(browser, origin, 'tool -> category hub', async (page) => {
      await page.goto(origin + '/merge-pdf', { waitUntil: 'networkidle' });
      await page.locator('nav[aria-label="Breadcrumb"] a').nth(1).click();
      await expectPath(page, '/category/pdf-tools', 'tool -> category hub');
    });

    await journey(browser, origin, 'category -> tool', async (page) => {
      await page.goto(origin + '/category/pdf-tools', { waitUntil: 'networkidle' });
      await page.locator('main a', { hasText: 'Open tool' }).first().click();
      await page.waitForTimeout(400);
      const p = new URL(page.url()).pathname;
      if (/^\/[a-z0-9-]+$/.test(p) && p !== '/category') pass(); else fail(`journey "category -> tool": landed on ${p}`);
    });

    await journey(browser, origin, 'guide -> tool', async (page) => {
      await page.goto(origin + '/guides/merge-pdf', { waitUntil: 'networkidle' });
      const toolBreadcrumb = page.locator('nav[aria-label="Breadcrumb"] a[href="/merge-pdf"]').first();
      await toolBreadcrumb.focus();
      await page.keyboard.press('Enter');
      await expectPath(page, '/merge-pdf', 'guide -> tool');
    });
  } finally {
    await browser.close();
    await close();
  }

  const total = passed + failures.length;
  console.log(`\nSmoke: ${passed}/${total} checks passed.`);
  if (failures.length) {
    console.error('\nFailures:');
    for (const f of failures) console.error(`- ${f}`);
    process.exit(1);
  }
  console.log('All smoke checks passed.');
}

main().catch((err) => { console.error(err); process.exit(1); });
