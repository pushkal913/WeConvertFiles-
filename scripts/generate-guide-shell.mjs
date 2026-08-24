import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Bakes the shared site shell (header, footer, mobile-menu drawer and search
// modal) into every guide page's delivered HTML, so the shell no longer has to
// be constructed at runtime by layout.js. Removing that runtime insertion is
// what stops guide pages from jumping on load.
//
// Single source of truth: the exact markup still lives in layout.js as the
// headerHtml / mobileMenuHtml / searchModalHtml / footerHtml template literals.
// This script extracts those literals verbatim and injects them between HTML
// markers, the same idempotent pattern the other generators use. layout.js
// detects the baked shell (via data-wcf-shell on the header) and skips its own
// injection, while still wiring up the interactions.
//
// Re-run this whenever the shell markup in layout.js changes.

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const layoutSource = fs.readFileSync(path.join(rootDir, 'layout.js'), 'utf8');
const guidesDir = path.join(rootDir, 'guides');

const HEADER_START = '<!-- WCF_SHELL_HEADER_START -->';
const HEADER_END = '<!-- WCF_SHELL_HEADER_END -->';
const FOOTER_START = '<!-- WCF_SHELL_FOOTER_START -->';
const FOOTER_END = '<!-- WCF_SHELL_FOOTER_END -->';

// Pull a `const <name> = ` ... ` ` template literal out of layout.js. The shell
// literals are pure static HTML (no backticks, no ${} interpolation), so a
// simple slice to the next backtick is exact.
function extractTemplate(name) {
  const anchor = `const ${name} = \``;
  const start = layoutSource.indexOf(anchor);
  if (start < 0) throw new Error(`generate-guide-shell: could not find ${name} in layout.js`);
  const contentStart = start + anchor.length;
  const end = layoutSource.indexOf('`', contentStart);
  if (end < 0) throw new Error(`generate-guide-shell: unterminated ${name} template in layout.js`);
  return layoutSource.slice(contentStart, end);
}

const headerHtml = extractTemplate('headerHtml');
const mobileMenuHtml = extractTemplate('mobileMenuHtml');
const searchModalHtml = extractTemplate('searchModalHtml');
const footerHtml = extractTemplate('footerHtml');

if (!headerHtml.includes('data-wcf-shell')) {
  throw new Error('generate-guide-shell: layout.js header is missing the data-wcf-shell marker layout.js relies on to skip runtime injection.');
}

const headerBlock = `${HEADER_START}${headerHtml}${HEADER_END}`;
// Body order matches what layout.js produced at runtime: the fixed overlays
// then the footer last, so the footer's mt-auto still pins it to the bottom.
const footerBlock = `${FOOTER_START}${mobileMenuHtml}${searchModalHtml}${footerHtml}${FOOTER_END}`;

// Add class tokens to a `class="..."` attribute without disturbing existing
// ones or duplicating (idempotent across re-runs).
function ensureClasses(html, tagMatcher, needed) {
  return html.replace(tagMatcher, (full, before, classes, after) => {
    const have = classes.split(/\s+/).filter(Boolean);
    const set = new Set(have);
    const additions = needed.filter((c) => !set.has(c));
    if (!additions.length) return full;
    return `${before}${[...have, ...additions].join(' ')}${after}`;
  });
}

function replaceOrInsert(html, startMarker, endMarker, block, insert) {
  if (html.includes(startMarker)) {
    const s = html.indexOf(startMarker);
    const e = html.indexOf(endMarker, s) + endMarker.length;
    return html.slice(0, s) + block + html.slice(e);
  }
  return insert(html, block);
}

const files = fs.readdirSync(guidesDir).filter((f) => f.endsWith('.html'));
let updated = 0;

for (const file of files) {
  const filePath = path.join(guidesDir, file);
  let html = fs.readFileSync(filePath, 'utf8');

  // 1. Body becomes a full-height flex column so a static footer sits at the
  //    bottom (previously added by layout.js at runtime).
  html = ensureClasses(
    html,
    /(<body\s+class=")([^"]*)(")/,
    ['min-h-screen', 'flex', 'flex-col']
  );

  // 2. Main grows to fill, keeping the footer pinned.
  html = ensureClasses(
    html,
    /(<main\s+class=")([^"]*)(")/,
    ['flex-grow']
  );

  // 3. Header immediately after <body> (afterbegin).
  html = replaceOrInsert(html, HEADER_START, HEADER_END, headerBlock, (h, block) =>
    h.replace(/(<body\b[^>]*>)/, `$1\n    ${block}`)
  );

  // 4. Overlays + footer immediately before </body> (beforeend).
  html = replaceOrInsert(html, FOOTER_START, FOOTER_END, footerBlock, (h, block) =>
    h.replace('</body>', `    ${block}\n</body>`)
  );

  if (!html.includes(HEADER_START) || !html.includes(FOOTER_START)) {
    throw new Error(`generate-guide-shell: failed to inject shell into ${file} (no <body>/</body> anchor).`);
  }

  fs.writeFileSync(filePath, html);
  updated += 1;
}

console.log(`Baked the static shell (header + footer + overlays) into ${updated} guide pages.`);
