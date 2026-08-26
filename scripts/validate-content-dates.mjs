import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseToolCatalogue, guideSlugForTool } from './guide-catalog.mjs';
import { contentDates, formatDate } from '../data/content-dates.mjs';

// Content dates: one source (data/content-dates.mjs) controls every date. This
// fails the build if a guide's Article schema date, its visible "Updated" date,
// or its sitemap <lastmod> disagree with the source — or if a date is malformed
// or updated precedes published.

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const siteUrl = 'https://www.weconvertfiles.com';
const { tools } = parseToolCatalogue();

const failures = [];
const check = (cond, msg) => { if (!cond) failures.push(msg); };
const isIso = (s) => /^\d{4}-\d{2}-\d{2}$/.test(s);

// Sitemap loc -> lastmod map.
const sitemap = await readFile(path.join(rootDir, 'sitemap.xml'), 'utf8');
const lastmodByLoc = new Map();
for (const m of sitemap.matchAll(/<loc>([^<]+)<\/loc>\s*<lastmod>([^<]+)<\/lastmod>/g)) {
  lastmodByLoc.set(m[1], m[2]);
}

// Every guide in the catalogue has a source entry; dates are well-formed.
for (const [slug, d] of Object.entries(contentDates.guides)) {
  check(d && isIso(d.published), `content-dates guide "${slug}": published is not YYYY-MM-DD.`);
  check(d && isIso(d.updated), `content-dates guide "${slug}": updated is not YYYY-MM-DD.`);
  if (d && isIso(d.published) && isIso(d.updated)) {
    check(d.updated >= d.published, `content-dates guide "${slug}": updated (${d.updated}) precedes published (${d.published}).`);
  }
}
check(isIso(contentDates.site.published) && isIso(contentDates.site.updated), 'content-dates site: dates are not YYYY-MM-DD.');

for (const tool of tools) {
  const slug = guideSlugForTool(tool.id);
  const where = `guide "${slug}"`;
  const src = contentDates.guides[slug];
  check(!!src, `${where}: no entry in data/content-dates.mjs.`);
  if (!src) continue;

  const file = path.join(rootDir, 'guides', `${slug}.html`);
  if (!existsSync(file)) { failures.push(`${where}: guide file missing.`); continue; }
  const html = await readFile(file, 'utf8');

  // Structured (Article JSON-LD) dates.
  const pub = (html.match(/"datePublished":\s*"([^"]*)"/) || [])[1];
  const mod = (html.match(/"dateModified":\s*"([^"]*)"/) || [])[1];
  check(pub === src.published, `${where}: Article datePublished "${pub}" != source "${src.published}".`);
  check(mod === src.updated, `${where}: Article dateModified "${mod}" != source "${src.updated}".`);

  // Visible date (<time datetime> + human label) must match the source updated.
  const t = html.match(/<time datetime="([^"]*)">([^<]*)<\/time>/);
  check(!!t, `${where}: no visible <time> "Updated" date.`);
  if (t) {
    check(t[1] === src.updated, `${where}: visible datetime "${t[1]}" != source updated "${src.updated}".`);
    check(t[2] === formatDate(src.updated), `${where}: visible date label "${t[2]}" != "${formatDate(src.updated)}".`);
  }

  // Sitemap lastmod for the guide's clean URL.
  const loc = `${siteUrl}/guides/${slug}`;
  check(lastmodByLoc.get(loc) === src.updated, `${where}: sitemap lastmod "${lastmodByLoc.get(loc)}" != source updated "${src.updated}".`);
}

// Non-guide sitemap URLs use site.updated (stable, not git-derived).
for (const [loc, lastmod] of lastmodByLoc) {
  if (loc.includes('/guides/')) continue;
  check(lastmod === contentDates.site.updated, `sitemap ${loc}: lastmod "${lastmod}" != site.updated "${contentDates.site.updated}".`);
}

if (failures.length) {
  console.error('Content-date validation failed:');
  for (const f of failures) console.error(`- ${f}`);
  process.exit(1);
}

console.log('Content-date validation passed:');
console.log(`- ${tools.length} guides: Article schema, visible date and sitemap lastmod all match data/content-dates.mjs`);
console.log('- non-guide sitemap lastmods use site.updated; all dates are stable and well-formed');
