import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const files = ['index.html', 'layout.js'];
const expectedLinks = [
  ['/category/image-tools', 'Image'],
  ['/category/pdf-tools', 'PDF'],
  ['/category/convert-office', 'Data & Office'],
  ['/category/developer-tools', 'Developers']
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
  const nav = source.match(/<nav\b[^>]*aria-label="Main navigation"[^>]*>([\s\S]*?)<\/nav>/)?.[1];
  if (!nav) {
    failures.push(`${rel}: desktop main navigation was not found.`);
    continue;
  }

  for (const [href, label] of expectedLinks) {
    const link = [...nav.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)]
      .find((match) => match[1] === href);
    if (!link) {
      failures.push(`${rel}: missing category link ${href}.`);
    } else if (visibleText(link[2]) !== label) {
      failures.push(`${rel}: ${href} must be labelled "${label}", found "${visibleText(link[2])}".`);
    }
  }

  for (const removed of ['Standalone: Unlock PDF', 'Standalone: Sign PDF']) {
    if (nav.includes(removed)) failures.push(`${rel}: still contains ${removed}.`);
  }

  // These high-value actions must remain inside the PDF dropdown.
  for (const href of ['/decrypt-pdf', '/sign-pdf']) {
    if (!nav.includes(`href="${href}"`)) failures.push(`${rel}: PDF dropdown lost ${href}.`);
  }
}

if (failures.length) {
  console.error('Primary navigation validation failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Primary navigation validation passed:');
console.log('- four category labels link directly to their existing hubs');
console.log('- standalone Sign PDF and Unlock PDF links are removed');
console.log('- Sign PDF and Unlock PDF remain available in the PDF dropdown');
