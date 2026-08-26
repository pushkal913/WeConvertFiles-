import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { contentDates } from '../data/content-dates.mjs';

// Sets a <lastmod> on every <url> in sitemap.xml from the centralized content
// dates (data/content-dates.mjs) rather than git history, so lastmod is stable
// across builds/clones and changes only when a content date is deliberately
// bumped. Guides use their own updated date; every other page uses site.updated.
// Idempotent: re-running refreshes the dates in place.

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sitemapPath = path.join(rootDir, 'sitemap.xml');

function lastModForUrl(urlPath) {
  const p = urlPath.replace(/^\//, '');
  if (p.startsWith('guides/')) {
    const slug = p.slice('guides/'.length);
    const entry = contentDates.guides[slug];
    return entry ? entry.updated : contentDates.site.updated;
  }
  return contentDates.site.updated;
}

let sitemap = fs.readFileSync(sitemapPath, 'utf8');
let updated = 0;

sitemap = sitemap.replace(
  /<loc>(https:\/\/www\.weconvertfiles\.com([^<]*))<\/loc>(\s*<lastmod>[^<]*<\/lastmod>)?/g,
  (_match, fullUrl, urlPath) => {
    updated += 1;
    return `<loc>${fullUrl}</loc>\n    <lastmod>${lastModForUrl(urlPath)}</lastmod>`;
  }
);

fs.writeFileSync(sitemapPath, sitemap);
console.log(`Stamped <lastmod> on ${updated} sitemap URLs from content-dates.`);
