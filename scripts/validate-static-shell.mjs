import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { HEADER_START, HEADER_END, FOOTER_START, FOOTER_END } from './shell-inject.mjs';

// Guards the Phase 1 guarantee: every page that used to build its shell at
// runtime now ships that shell in the delivered HTML, so nothing has to be
// inserted after load and the page does not jump. Covers the guide pages, the
// legal/info pages and the generated conversion pages. Fails loudly if any of
// them regresses to a runtime-only shell.

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const guideFiles = (await readdir(path.join(rootDir, 'guides')))
  .filter((f) => f.endsWith('.html'))
  .map((f) => `guides/${f}`);
const legalFiles = ['about.html', 'privacy.html', 'terms.html', 'contact.html', 'accessibility.html'];
const convertFiles = (await readdir(path.join(rootDir, 'convert')))
  .filter((f) => f.endsWith('.html'))
  .map((f) => `convert/${f}`);

const files = [...guideFiles, ...legalFiles, ...convertFiles].sort();
const failures = [];

for (const rel of files) {
  const html = await readFile(path.join(rootDir, rel), 'utf8');

  for (const marker of [HEADER_START, HEADER_END, FOOTER_START, FOOTER_END]) {
    if (!html.includes(marker)) failures.push(`${rel} is missing ${marker}`);
  }

  if (!html.includes('<header data-wcf-shell')) {
    failures.push(`${rel} has no static <header data-wcf-shell>`);
  }

  // Header must precede <main>, footer must follow it.
  const headerIdx = html.indexOf(HEADER_START);
  const mainIdx = html.indexOf('<main');
  const footerIdx = html.indexOf(FOOTER_START);
  if (headerIdx < 0 || mainIdx < 0 || footerIdx < 0 || !(headerIdx < mainIdx && mainIdx < footerIdx)) {
    failures.push(`${rel} shell is out of order (expected header → main → footer)`);
  }

  // The static footer exposes the primary legal links (pagesense also anchors
  // off these).
  for (const href of ['/privacy', '/terms', '/about']) {
    if (!html.includes(`href="${href}"`)) {
      failures.push(`${rel} static footer is missing the ${href} link`);
    }
  }

  // Body is a full-height flex column and main grows, so the footer sits at the
  // bottom without any runtime class mutation.
  const bodyTag = html.match(/<body\s+class="([^"]*)"/);
  if (!bodyTag || !['min-h-screen', 'flex', 'flex-col'].every((c) => bodyTag[1].split(/\s+/).includes(c))) {
    failures.push(`${rel} <body> is missing the min-h-screen/flex/flex-col layout classes`);
  }
  const mainTag = html.match(/<main\s+class="([^"]*)"/);
  if (!mainTag || !mainTag[1].split(/\s+/).includes('flex-grow')) {
    failures.push(`${rel} <main> is missing flex-grow`);
  }
}

if (failures.length) {
  console.error('Static shell validation failed:');
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}

console.log('Static shell validation passed:');
console.log(`- ${guideFiles.length} guides + ${legalFiles.length} legal/info pages + ${convertFiles.length} conversion pages ship a static header → main → footer shell`);
console.log('- every page carries <header data-wcf-shell>, flex body/main layout, and footer legal links');
console.log('- no page depends on runtime shell insertion');
