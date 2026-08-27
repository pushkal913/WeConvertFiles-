import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseToolCatalogue, guideSlugForTool } from './guide-catalog.mjs';
import { contentDates, formatDate } from '../data/content-dates.mjs';

// Applies the centralized content dates (data/content-dates.mjs) to every guide:
//   - stamps the Article JSON-LD datePublished/dateModified, and
//   - injects a visible, accessible "Updated <date>" line.
// Both come from the one source, so structured and visible dates always agree
// (validate-content-dates.mjs enforces it). Idempotent.

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { tools } = parseToolCatalogue();

const START = '<!-- CONTENT_DATE_START -->';
const END = '<!-- CONTENT_DATE_END -->';

function stampSchemaDates(html, published, updated) {
  let done = false;
  const out = html.replace(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g, (full, inner) => {
    if (done || !/"@type":\s*"Article"/.test(inner)) return full;
    let next = inner;
    if (/"datePublished"\s*:/.test(next)) {
      next = next
        .replace(/"datePublished":\s*"[^"]*"/, `"datePublished": "${published}"`)
        .replace(/"dateModified":\s*"[^"]*"/, `"dateModified": "${updated}"`);
    } else {
      next = next.replace(/("@type":\s*"Article",)/, `$1 "datePublished": "${published}", "dateModified": "${updated}",`);
    }
    done = true;
    return full.replace(inner, next);
  });
  if (!done) throw new Error('no Article schema to stamp');
  return out;
}

function visibleBlock(updated) {
  return `${START}\n    <p class="mb-6 -mt-2 text-sm text-slate-500 dark:text-slate-400">Updated <time datetime="${updated}">${formatDate(updated)}</time></p>\n    ${END}`;
}

function injectVisible(html, updated) {
  const block = visibleBlock(updated);
  if (html.includes(START)) {
    const s = html.indexOf(START);
    const e = html.indexOf(END) + END.length;
    return html.slice(0, s) + block + html.slice(e);
  }
  // Prefer just after the breadcrumb block; fall back to after <main>.
  const bcEnd = html.indexOf('<!-- BREADCRUMB_END -->');
  if (bcEnd >= 0) {
    const at = bcEnd + '<!-- BREADCRUMB_END -->'.length;
    return `${html.slice(0, at)}\n    ${block}${html.slice(at)}`;
  }
  const main = html.match(/<main\b[^>]*>/);
  if (!main) throw new Error('no insertion point for visible date');
  const at = main.index + main[0].length;
  return `${html.slice(0, at)}\n    ${block}${html.slice(at)}`;
}

let updated = 0;
let missing = 0;
for (const tool of tools) {
  const slug = guideSlugForTool(tool.id);
  const dates = contentDates.guides[slug];
  if (!dates) throw new Error(`content-dates has no entry for guide "${slug}".`);
  const file = path.join(rootDir, 'guides', `${slug}.html`);
  if (!fs.existsSync(file)) { missing += 1; continue; }
  let html = fs.readFileSync(file, 'utf8');
  html = stampSchemaDates(html, dates.published, dates.updated);
  html = injectVisible(html, dates.updated);
  fs.writeFileSync(file, html);
  updated += 1;
}

console.log(`Applied content dates to ${updated} guides${missing ? ` (${missing} missing)` : ''}.`);
