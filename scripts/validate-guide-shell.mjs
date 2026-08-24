import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Guards the Phase 1 guarantee: every guide ships its shared shell in the
// delivered HTML, so nothing has to be inserted at runtime and the page does
// not jump on load. Fails loudly if a guide regresses to a runtime-only shell.

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const guidesDir = path.join(rootDir, 'guides');

const HEADER_START = '<!-- WCF_SHELL_HEADER_START -->';
const HEADER_END = '<!-- WCF_SHELL_HEADER_END -->';
const FOOTER_START = '<!-- WCF_SHELL_FOOTER_START -->';
const FOOTER_END = '<!-- WCF_SHELL_FOOTER_END -->';

const files = (await readdir(guidesDir)).filter((f) => f.endsWith('.html')).sort();
const failures = [];

for (const file of files) {
  const html = await readFile(path.join(guidesDir, file), 'utf8');
  const rel = `guides/${file}`;

  // Shell markers present and well-formed.
  for (const marker of [HEADER_START, HEADER_END, FOOTER_START, FOOTER_END]) {
    if (!html.includes(marker)) failures.push(`${rel} is missing ${marker}`);
  }

  // The header carries the data-wcf-shell marker layout.js uses to skip
  // runtime injection.
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

  // A static footer must expose the legal links (pagesense anchors off these,
  // and they are the site's primary footer navigation).
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
  console.error('Guide shell validation failed:');
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}

console.log('Guide shell validation passed:');
console.log(`- ${files.length} guides ship a static header/footer shell (header → main → footer)`);
console.log('- every guide carries <header data-wcf-shell>, flex body/main layout, and footer legal links');
console.log('- no guide depends on runtime shell insertion');
