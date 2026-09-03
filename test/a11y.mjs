// Browser-level accessibility regression checks for WeConvertFiles.
//
// This suite audits representative static routes with axe-core and exercises
// the keyboard paths that are easy to regress in the shared shell.
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { chromium } from 'playwright';
import { startServer } from './serve.mjs';

const require = createRequire(import.meta.url);
const axeSource = await readFile(require.resolve('axe-core/axe.min.js'), 'utf8');

if (!process.env.PLAYWRIGHT_BROWSERS_PATH && existsSync('/opt/pw-browsers')) {
  process.env.PLAYWRIGHT_BROWSERS_PATH = '/opt/pw-browsers';
}

const TARGETS = [
  { name: 'homepage', path: '/' },
  { name: 'tool page', path: '/merge-pdf' },
  { name: 'conversion page', path: '/convert/jpg-to-pdf' },
  { name: 'category page', path: '/category/pdf-tools' },
  { name: 'guide page', path: '/guides/bulk-resize.html' },
  { name: 'accessibility statement', path: '/accessibility' }
];

const BLOCKING_IMPACTS = new Set(['critical', 'serious']);

// Keep this empty unless a finding is an intentional, reviewed exception.
// Every exception must identify an exact axe rule + target and be documented
// with its rationale and review condition in test/README.md.
const KNOWN_EXCEPTIONS = [];

function formatViolation(violation) {
  const nodes = violation.nodes.map((node) => node.target.join(' ')).join(', ');
  return `${violation.id} (${violation.impact || 'unknown'}): ${violation.help} [${nodes}]`;
}

async function dismissConsent(page) {
  const decline = page.locator('[data-consent-choice="denied"]');
  if (await decline.count() && await decline.isVisible()) await decline.click();
}

async function auditWithAxe(page, origin, target) {
  await page.goto(origin + target.path, { waitUntil: 'networkidle' });
  // Reveal below-the-fold content so axe audits the settled page rather than
  // the temporary scroll-animation state.
  await page.evaluate(() => document.documentElement.classList.remove('wcf-anim'));
  await page.addScriptTag({ content: axeSource });

  const results = await page.evaluate(async () => window.axe.run(document, {
    resultTypes: ['violations', 'incomplete']
  }));
  await dismissConsent(page);

  const blocking = results.violations.filter((violation) => BLOCKING_IMPACTS.has(violation.impact));
  const unexpected = blocking.flatMap((violation) => {
    const exceptionTargets = new Set(
      KNOWN_EXCEPTIONS
        .filter((exception) => exception.rule === violation.id)
        .map((exception) => exception.target)
    );
    const nodes = violation.nodes.filter((node) => !exceptionTargets.has(node.target.join(' ')));
    return nodes.length ? [{ ...violation, nodes }] : [];
  });

  console.log(`axe ${target.name}: ${results.violations.length} violation(s), ${results.incomplete.length} incomplete check(s)`);
  for (const violation of results.violations) console.log(`  ${formatViolation(violation)}`);
  for (const incomplete of results.incomplete) console.log(`  manual review: ${formatViolation(incomplete)}`);
  return unexpected.map(formatViolation);
}

async function checkStructure(page, origin, target) {
  await page.goto(origin + target.path, { waitUntil: 'networkidle' });
  await dismissConsent(page);
  const result = await page.evaluate(() => {
    const visible = (element) => {
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
    };
    const headings = [...document.querySelectorAll('h1, h2, h3, h4, h5, h6')]
      .filter(visible)
      .map((heading) => Number(heading.tagName.slice(1)));
    const unnamed = [...document.querySelectorAll('a, button, [role="button"]')]
      .filter(visible)
      .filter((element) => {
        const labelledBy = element.getAttribute('aria-labelledby');
        const referenced = labelledBy
          ? labelledBy.split(/\s+/).map((id) => document.getElementById(id)?.textContent || '').join(' ')
          : '';
        return !(element.getAttribute('aria-label') || referenced || element.textContent || element.querySelector('img[alt]'))?.trim();
      })
      .map((element) => `${element.tagName.toLowerCase()}#${element.id || '(no-id)'}`);
    const landmarkHeaders = [...document.querySelectorAll('header')]
      .filter((element) => !element.closest('article, aside, main, nav, section'));
    const landmarkFooters = [...document.querySelectorAll('footer')]
      .filter((element) => !element.closest('article, aside, main, nav, section'));
    const landmarks = {
      header: landmarkHeaders.length,
      main: document.querySelectorAll('main').length,
      footer: landmarkFooters.length
    };
    const headingProblems = [];
    if (headings[0] !== 1) headingProblems.push('first visible heading is not h1');
    if (headings.filter((level) => level === 1).length !== 1) headingProblems.push('expected exactly one visible h1');
    for (let index = 1; index < headings.length; index += 1) {
      if (headings[index] - headings[index - 1] > 1) {
        headingProblems.push(`heading jumps from h${headings[index - 1]} to h${headings[index]}`);
      }
    }
    return { landmarks, unnamed, headingProblems };
  });

  const errors = [];
  if (result.landmarks.main !== 1) errors.push(`expected one main landmark, found ${result.landmarks.main}`);
  if (result.landmarks.header !== 1) errors.push(`expected one header landmark, found ${result.landmarks.header}`);
  if (result.landmarks.footer !== 1) errors.push(`expected one footer landmark, found ${result.landmarks.footer}`);
  if (result.unnamed.length) errors.push(`unnamed controls: ${result.unnamed.join(', ')}`);
  errors.push(...result.headingProblems);
  return errors;
}

async function checkKeyboardAndFocus(page, origin) {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(origin + '/merge-pdf', { waitUntil: 'networkidle' });
  await dismissConsent(page);

  const focusErrors = [];
  await page.evaluate(() => document.activeElement?.blur());
  const focusableCount = await page.evaluate(() => {
    const selector = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), summary, [tabindex]:not([tabindex="-1"])';
    return [...document.querySelectorAll(selector)].filter((element) => {
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
    }).length;
  });
  for (let index = 0; index < focusableCount; index += 1) {
    await page.keyboard.press('Tab');
    await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    const state = await page.evaluate(() => {
      const element = document.activeElement;
      const focusable = 'a, button, input, select, textarea, summary, [tabindex]:not([tabindex="-1"])';
      if (!element || element === document.body || !element.matches(focusable)) return null;
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      const hasOutline = style.outlineStyle !== 'none'
        && parseFloat(style.outlineWidth) > 0
        && style.outlineColor !== 'rgba(0, 0, 0, 0)';
      const hasFocusRing = style.boxShadow !== 'none'
        && /0px 0px 0px (?:[1-9]\d*|0\.\d+)px/.test(style.boxShadow);
      return {
        selector: `${element.tagName.toLowerCase()}#${element.id || '(no-id)'}`,
        visible: rect.width > 0 && rect.height > 0,
        focusVisible: element.matches(':focus-visible'),
        hasIndicator: hasOutline || hasFocusRing
      };
    });
    if (state?.visible && (!state.focusVisible || !state.hasIndicator)) focusErrors.push(state.selector);
  }

  const menuButton = page.locator('#mobileMenuButton');
  await menuButton.focus();
  await page.keyboard.press('Enter');
  await page.waitForFunction(() => document.activeElement?.id === 'closeMobileMenu');
  const menuState = await page.evaluate(() => ({
    open: !document.getElementById('mobileMenuDrawer')?.classList.contains('hidden'),
    dialogRole: document.querySelector('#mobileMenuDrawer [role="dialog"]')?.getAttribute('role') || '',
    expanded: document.getElementById('mobileMenuButton')?.getAttribute('aria-expanded') || '',
    backgroundInert: document.querySelector('main')?.closest('[inert]') !== null,
    focusInside: document.querySelector('#mobileMenuDrawer [role="dialog"]')?.contains(document.activeElement) === true,
    toolLinks: document.querySelectorAll('#mobileToolsList a').length,
    closeButtonName: document.getElementById('closeMobileMenu')?.getAttribute('aria-label')
      || document.getElementById('closeMobileMenu')?.textContent?.trim()
      || ''
  }));
  const menuFocusWrapped = await page.evaluate(() => {
    const dialog = document.querySelector('#mobileMenuDrawer [role="dialog"]');
    const selector = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), summary, [tabindex]:not([tabindex="-1"])';
    const focusable = [...dialog.querySelectorAll(selector)].filter((element) => {
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
    });
    focusable.at(-1)?.focus();
    return focusable[0]?.id || '';
  }).then(async (firstId) => {
    await page.keyboard.press('Tab');
    return page.evaluate((expected) => document.activeElement?.id === expected, firstId);
  });
  await page.keyboard.press('Escape');
  const closedWithEscape = await page.locator('#mobileMenuDrawer').evaluate((element) => element.classList.contains('hidden'));
  const focusReturnedToMenu = await page.evaluate(() => document.activeElement?.id === 'mobileMenuButton');
  const menuCollapsed = await menuButton.getAttribute('aria-expanded') === 'false';
  const menuBackgroundRestored = await page.evaluate(() => document.querySelector('main')?.closest('[inert]') === null);

  await menuButton.focus();
  await page.keyboard.press('Enter');
  await page.locator('#closeMobileMenu').focus();
  await page.keyboard.press('Enter');
  const closed = await page.locator('#mobileMenuDrawer').evaluate((element) => element.classList.contains('hidden'));

  const accordion = page.locator('details summary:visible').first();
  let accordionOpened = false;
  if (await accordion.count()) {
    await accordion.press('Enter');
    accordionOpened = await accordion.evaluate((element) => element.parentElement?.hasAttribute('open') === true);
  }

  const searchButton = page.locator('#mobileSearchButton');
  await searchButton.focus();
  await page.keyboard.press('Enter');
  await page.waitForFunction(() => document.activeElement?.id === 'searchInput');
  const searchState = await page.evaluate(() => ({
    open: !document.getElementById('searchModal')?.classList.contains('hidden'),
    dialogRole: document.querySelector('#searchModal [role="dialog"]')?.getAttribute('role') || '',
    expanded: document.getElementById('mobileSearchButton')?.getAttribute('aria-expanded') || '',
    backgroundInert: document.querySelector('main')?.closest('[inert]') !== null,
    focusInside: document.querySelector('#searchModal [role="dialog"]')?.contains(document.activeElement) === true,
    inputName: document.getElementById('searchInput')?.getAttribute('aria-label') || ''
  }));
  const searchFocusWrapped = await page.evaluate(() => {
    const dialog = document.querySelector('#searchModal [role="dialog"]');
    const selector = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), summary, [tabindex]:not([tabindex="-1"])';
    const focusable = [...dialog.querySelectorAll(selector)].filter((element) => {
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
    });
    focusable.at(-1)?.focus();
    return focusable[0]?.id || '';
  }).then(async (firstId) => {
    await page.keyboard.press('Tab');
    return page.evaluate((expected) => document.activeElement?.id === expected, firstId);
  });
  await page.keyboard.press('Escape');
  const searchClosed = await page.locator('#searchModal').evaluate((element) => element.classList.contains('hidden'));
  const searchFocusReturned = await page.evaluate(() => document.activeElement?.id === 'mobileSearchButton');
  const searchCollapsed = await searchButton.getAttribute('aria-expanded') === 'false';
  const searchBackgroundRestored = await page.evaluate(() => document.querySelector('main')?.closest('[inert]') === null);

  const cookieSettings = page.locator('[data-cookie-settings]').first();
  await cookieSettings.focus();
  await page.keyboard.press('Enter');
  await page.waitForFunction(() => document.querySelector('#wcf-consent-banner [data-consent-close]') === document.activeElement);
  await page.keyboard.press('Escape');
  const cookieSettingsClosed = await page.locator('#wcf-consent-banner').count() === 0;
  const cookieFocusReturned = await cookieSettings.evaluate((element) => document.activeElement === element);

  const errors = [...focusErrors.map((selector) => `focus indicator missing for ${selector}`)];
  if (!menuState.open || menuState.dialogRole !== 'dialog' || menuState.expanded !== 'true'
    || !menuState.backgroundInert || !menuState.focusInside || menuState.toolLinks === 0) {
    errors.push('mobile menu is missing keyboard/semantic affordances');
  }
  if (!menuState.closeButtonName) errors.push('mobile menu close button has no accessible name');
  if (!menuFocusWrapped) errors.push('mobile menu did not contain Tab focus');
  if (!closedWithEscape || !focusReturnedToMenu || !menuCollapsed || !menuBackgroundRestored) errors.push('mobile menu did not close with Escape and return focus');
  if (!closed) errors.push('mobile menu did not close with Enter');
  if (!accordionOpened) errors.push('accordion did not open with Enter');
  if (!searchState.open || searchState.dialogRole !== 'dialog' || searchState.expanded !== 'true'
    || !searchState.backgroundInert || !searchState.focusInside || !searchState.inputName) {
    errors.push('search dialog is missing keyboard/semantic affordances');
  }
  if (!searchFocusWrapped) errors.push('search dialog did not contain Tab focus');
  if (!searchClosed || !searchFocusReturned || !searchCollapsed || !searchBackgroundRestored) errors.push('search dialog did not close with Escape and return focus');
  if (!cookieSettingsClosed || !cookieFocusReturned) errors.push('cookie settings did not close with Escape and return focus');
  return errors;
}

async function checkConsentGate(browser, origin) {
  const context = await browser.newContext();
  const page = await context.newPage();
  let analyticsRequests = 0;
  await page.route('**/cdn-in.pagesense.io/**', async (route) => {
    analyticsRequests += 1;
    await route.abort();
  });

  const errors = [];
  try {
    await page.goto(origin + '/privacy', { waitUntil: 'networkidle' });
    if (analyticsRequests !== 0) errors.push('analytics loaded before consent');

    await page.locator('[data-consent-choice="denied"]').click();
    await page.waitForTimeout(100);
    if (analyticsRequests !== 0) errors.push('analytics loaded after consent was declined');

    await page.locator('[data-cookie-settings]').first().click();
    await page.locator('[data-consent-choice="granted"]').click();
    await page.waitForFunction(() => [...document.scripts].some((script) => script.src.includes('cdn-in.pagesense.io')));
    if (analyticsRequests !== 1) errors.push(`expected one analytics request after consent, found ${analyticsRequests}`);
  } finally {
    await context.close();
  }
  return errors;
}

const server = await startServer();
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await context.newPage();
const failures = [];

try {
  for (const target of TARGETS) {
    failures.push(...(await auditWithAxe(page, server.origin, target)).map((message) => `${target.name}: ${message}`));
    failures.push(...(await checkStructure(page, server.origin, target)).map((message) => `${target.name}: ${message}`));
  }
  failures.push(...(await checkKeyboardAndFocus(page, server.origin)).map((message) => `keyboard: ${message}`));
  failures.push(...(await checkConsentGate(browser, server.origin)).map((message) => `privacy: ${message}`));
} finally {
  await context.close();
  await browser.close();
  await server.close();
}

if (failures.length) {
  console.error(`\nAccessibility regression checks failed (${failures.length}):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log('\nAccessibility regression checks passed.');
}
