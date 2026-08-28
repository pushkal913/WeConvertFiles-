import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { chromium } from 'playwright';
import { startServer } from './serve.mjs';

if (!process.env.PLAYWRIGHT_BROWSERS_PATH && existsSync('/opt/pw-browsers')) {
  process.env.PLAYWRIGHT_BROWSERS_PATH = '/opt/pw-browsers';
}

async function dismissConsent(page) {
  const decline = page.locator('[data-consent-choice="denied"]');
  if (await decline.count() && await decline.isVisible()) await decline.click();
}

async function assertSharedPdfMenu(page, origin, path) {
  await page.goto(origin + path, { waitUntil: 'networkidle' });
  await dismissConsent(page);

  const trigger = page.locator('[data-nav-trigger="pdf"]');
  await trigger.focus();
  await page.keyboard.press('Enter');
  assert.equal(await trigger.getAttribute('aria-expanded'), 'true', `${path}: Enter opens the PDF menu`);
  assert.ok(await page.locator('#nav-pdf-menu').isVisible(), `${path}: PDF panel becomes visible`);
  await page.keyboard.press('Escape');
  assert.equal(await trigger.getAttribute('aria-expanded'), 'false', `${path}: Escape closes the PDF menu`);
  assert.equal(await page.evaluate(() => document.activeElement?.dataset.navTrigger), 'pdf', `${path}: Escape restores trigger focus`);
}

const server = await startServer();
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await context.newPage();
page.setDefaultTimeout(5_000);

try {
  await assertSharedPdfMenu(page, server.origin, '/');
  await assertSharedPdfMenu(page, server.origin, '/category/pdf-tools');

  await page.goto(server.origin + '/', { waitUntil: 'networkidle' });
  await dismissConsent(page);
  const pdfTrigger = page.locator('[data-nav-trigger="pdf"]');
  const imageTrigger = page.locator('[data-nav-trigger="images"]');
  await pdfTrigger.focus();
  await page.keyboard.press('Enter');
  await imageTrigger.focus();
  await page.keyboard.press('Enter');
  assert.equal(await pdfTrigger.getAttribute('aria-expanded'), 'false', 'opening Images closes PDF');
  assert.equal(await imageTrigger.getAttribute('aria-expanded'), 'true', 'only the selected menu remains open');

  await page.mouse.click(10, 880);
  assert.equal(await imageTrigger.getAttribute('aria-expanded'), 'false', 'outside pointer interaction closes the open menu');

  await pdfTrigger.focus();
  await page.keyboard.press('ArrowDown');
  assert.equal(await pdfTrigger.getAttribute('aria-expanded'), 'true', 'Arrow Down opens the focused menu');
  assert.equal(await page.evaluate(() => document.activeElement?.id), 'nav-pdf-menu-link-0', 'Arrow Down focuses the first PDF menu link');
  await page.keyboard.press('Escape');

  await pdfTrigger.evaluate((trigger) => trigger.click());
  assert.equal(await pdfTrigger.getAttribute('aria-expanded'), 'true', 'click opens a closed menu');
  await pdfTrigger.evaluate((trigger) => trigger.click());
  assert.equal(await pdfTrigger.getAttribute('aria-expanded'), 'false', 'a second click closes the open menu');

  await pdfTrigger.focus();
  await page.keyboard.press('Space');
  assert.equal(await pdfTrigger.getAttribute('aria-expanded'), 'true', 'Space opens the focused menu');
  await page.keyboard.press('Escape');

  await pdfTrigger.hover();
  assert.equal(await pdfTrigger.getAttribute('aria-expanded'), 'true', 'fine-pointer hover opens the menu');
  await page.mouse.move(10, 880);
  await page.waitForTimeout(140);
  assert.equal(await pdfTrigger.getAttribute('aria-expanded'), 'false', 'fine-pointer leave closes after the 120 ms delay');

  await pdfTrigger.hover();
  await page.mouse.move(10, 880);
  await page.waitForTimeout(40);
  await pdfTrigger.hover();
  await page.waitForTimeout(140);
  assert.equal(await pdfTrigger.getAttribute('aria-expanded'), 'true', 'pointer re-entry cancels the pending close');
  await page.keyboard.press('Escape');

  await pdfTrigger.hover();
  await page.mouse.move(10, 880);
  await page.waitForTimeout(40);
  await pdfTrigger.focus();
  await page.keyboard.press('Space');
  await page.waitForTimeout(140);
  assert.equal(await pdfTrigger.getAttribute('aria-expanded'), 'true', 'keyboard opening cancels a pending hover close');
  await page.keyboard.press('Escape');

  await pdfTrigger.hover();
  await page.mouse.move(10, 880);
  await page.waitForTimeout(40);
  await page.mouse.click(10, 880);
  await pdfTrigger.evaluate((trigger) => trigger.click());
  await page.waitForTimeout(140);
  assert.equal(await pdfTrigger.getAttribute('aria-expanded'), 'true', 'click opening cancels a pending hover close');
} finally {
  await context.close();
  await browser.close();
  await server.close();
}

console.log('Navigation browser checks passed.');
