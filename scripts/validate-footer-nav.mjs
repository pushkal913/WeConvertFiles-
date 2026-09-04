import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const generatedDirs = ['tool-pages', 'category', 'convert', 'guides'];
const generatedFiles = (await Promise.all(generatedDirs.map(async (dir) =>
  (await readdir(path.join(rootDir, dir)))
    .filter((name) => name.endsWith('.html'))
    .map((name) => `${dir}/${name}`)
))).flat();
const files = [
  'index.html',
  'layout.js',
  'about.html',
  'accessibility.html',
  'contact.html',
  'privacy.html',
  'terms.html',
  ...generatedFiles
];
const expectedLinks = [
  ['/category/pdf-tools', 'PDF'],
  ['/category/image-tools', 'Image'],
  ['/category/convert-office', 'Data & Office'],
  ['/category/developer-tools', 'Developers'],
  ['/merge-pdf', 'Merge PDF'],
  ['/compress-pdf', 'Compress PDF'],
  ['/', 'All Tools'],
  ['/#guides', 'Tool Guides'],
  ['/#how-it-works', 'How It Works'],
  ['/about', 'About'],
  ['/contact', 'Contact'],
  ['/privacy', 'Privacy'],
  ['/terms', 'Terms'],
  ['/accessibility', 'Accessibility']
];
const failures = [];

const visibleText = (html) => html
  .replace(/<svg\b[\s\S]*?<\/svg>/g, '')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&amp;/g, '&')
  .replace(/\s+/g, ' ')
  .trim();

for (const rel of files) {
  const source = await readFile(path.join(rootDir, rel), 'utf8');
  const footer = source.match(/<footer\b[\s\S]*?<\/footer>/)?.[0];
  if (!footer) {
    failures.push(`${rel}: footer was not found.`);
    continue;
  }

  const nav = footer.match(/<nav\b[^>]*aria-label="Footer navigation"[^>]*>([\s\S]*?)<\/nav>/)?.[1];
  if (!nav) {
    failures.push(`${rel}: labelled footer navigation was not found.`);
    continue;
  }

  for (const heading of ['Tools', 'Resources', 'Company']) {
    if (!new RegExp(`<h2\\b[^>]*>${heading}<\\/h2>`).test(nav)) {
      failures.push(`${rel}: missing ${heading} footer heading.`);
    }
  }

  const links = [...nav.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)]
    .map((match) => ({ href: match[1], label: visibleText(match[2]) }));

  for (const [href, label] of expectedLinks) {
    const matches = links.filter((link) => link.href === href);
    if (matches.length !== 1) {
      failures.push(`${rel}: expected one canonical ${href} link, found ${matches.length}.`);
    } else if (matches[0].label !== label) {
      failures.push(`${rel}: ${href} must be labelled "${label}", found "${matches[0].label}".`);
    }
  }

  const duplicateHrefs = [...new Set(links.map((link) => link.href)
    .filter((href, index, hrefs) => hrefs.indexOf(href) !== index))];
  if (duplicateHrefs.length) failures.push(`${rel}: redundant footer links: ${duplicateHrefs.join(', ')}.`);
  if (footer.includes('Our Mission &amp; Support') || footer.includes('Our Mission & Support')) {
    failures.push(`${rel}: legacy mission card is still present.`);
  }
  if (!footer.includes('TechKnoGeeks')) failures.push(`${rel}: TechKnoGeeks attribution is missing.`);
  if (!nav.includes('data-footer-company-links')) {
    failures.push(`${rel}: Company link container is missing the cookie-control hook.`);
  }
}

const homepage = await readFile(path.join(rootDir, 'index.html'), 'utf8');
for (const id of ['guides', 'how-it-works']) {
  if (!new RegExp(`<section\\b[^>]*id="${id}"`).test(homepage)) {
    failures.push(`index.html: missing #${id} resource destination.`);
  }
}

if (failures.length) {
  console.error('Footer navigation validation failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Footer navigation validation passed:');
console.log('- Tools, Resources, and Company links are canonical and unique');
console.log('- homepage resource anchors and cookie-control hook are present');
console.log('- legacy mission card is removed and attribution is retained');
