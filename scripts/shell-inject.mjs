import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Shared helper for baking the site shell (header, footer, mobile-menu drawer
// and search modal) into a page's delivered HTML, so the shell no longer has
// to be constructed at runtime by layout.js. Removing that runtime insertion
// is what stops pages from jumping on load.
//
// Single source of truth: the exact markup still lives in layout.js as the
// headerHtml / mobileMenuHtml / searchModalHtml / footerHtml template literals.
// Both the content-page baker (generate-static-shell.mjs) and the conversion
// page generator use this module, so there is only one copy of the markup.

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export const HEADER_START = '<!-- WCF_SHELL_HEADER_START -->';
export const HEADER_END = '<!-- WCF_SHELL_HEADER_END -->';
export const FOOTER_START = '<!-- WCF_SHELL_FOOTER_START -->';
export const FOOTER_END = '<!-- WCF_SHELL_FOOTER_END -->';

// Pull a `const <name> = ` ... ` ` template literal out of layout.js. The shell
// literals are pure static HTML (no backticks, no ${} interpolation), so a
// simple slice to the next backtick is exact.
function extractTemplate(layoutSource, name) {
  const anchor = `const ${name} = \``;
  const start = layoutSource.indexOf(anchor);
  if (start < 0) throw new Error(`shell-inject: could not find ${name} in layout.js`);
  const contentStart = start + anchor.length;
  const end = layoutSource.indexOf('`', contentStart);
  if (end < 0) throw new Error(`shell-inject: unterminated ${name} template in layout.js`);
  return layoutSource.slice(contentStart, end);
}

// Read the shell markup once from layout.js and return the ready-to-insert
// header block and footer block (overlays + footer, in the same body order
// layout.js produced at runtime: fixed overlays first, footer last so its
// mt-auto still pins it to the bottom).
export function loadShell() {
  const layoutSource = fs.readFileSync(path.join(rootDir, 'layout.js'), 'utf8');
  const headerHtml = extractTemplate(layoutSource, 'headerHtml');
  const mobileMenuHtml = extractTemplate(layoutSource, 'mobileMenuHtml');
  const searchModalHtml = extractTemplate(layoutSource, 'searchModalHtml');
  const footerHtml = extractTemplate(layoutSource, 'footerHtml');

  if (!headerHtml.includes('data-wcf-shell')) {
    throw new Error('shell-inject: layout.js header is missing the data-wcf-shell marker that layout.js relies on to skip runtime injection.');
  }

  return {
    headerHtml,
    footerHtml,
    mobileMenuHtml,
    searchModalHtml,
    headerBlock: `${HEADER_START}${headerHtml}${HEADER_END}`,
    footerBlock: `${FOOTER_START}${mobileMenuHtml}${searchModalHtml}${footerHtml}${FOOTER_END}`
  };
}

// Add class tokens to a `class="..."` attribute without disturbing existing
// ones or duplicating (idempotent across re-runs).
export function ensureClasses(html, tagMatcher, needed) {
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

// Bake the static shell into a full HTML document string (idempotent). Makes
// the body a full-height flex column and main grow so the static footer sits
// at the bottom, inserts the header right after <body> and the overlays +
// footer right before </body>.
export function applyStaticShell(html, shell = loadShell()) {
  let out = ensureClasses(html, /(<body\s+class=")([^"]*)(")/, ['min-h-screen', 'flex', 'flex-col']);
  out = ensureClasses(out, /(<main\s+class=")([^"]*)(")/, ['flex-grow']);

  out = replaceOrInsert(out, HEADER_START, HEADER_END, shell.headerBlock, (h, block) =>
    h.replace(/(<body\b[^>]*>)/, `$1\n    ${block}`)
  );
  out = replaceOrInsert(out, FOOTER_START, FOOTER_END, shell.footerBlock, (h, block) =>
    h.replace('</body>', `    ${block}\n</body>`)
  );

  if (!out.includes(HEADER_START) || !out.includes(FOOTER_START)) {
    throw new Error('shell-inject: failed to inject shell (no <body>/</body> anchor).');
  }
  return out;
}
