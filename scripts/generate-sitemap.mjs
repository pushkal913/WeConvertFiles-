import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

// Adds a <lastmod> to every <url> in sitemap.xml, derived from the last git
// commit date of the file that serves that URL. Freshness/priority signal for
// crawlers. Idempotent: re-running refreshes the dates in place.

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sitemapPath = path.join(rootDir, 'sitemap.xml');
const today = new Date().toISOString().slice(0, 10);

// Map a sitemap path (e.g. "/pdf-to-word", "/guides/x.html", "/convert/x") to
// the source file that renders it.
function fileForPath(urlPath) {
  const p = urlPath.replace(/^\//, '');
  if (p === '') return 'index.html';
  if (p.startsWith('convert/')) return `${p}.html`;
  if (p.startsWith('guides/')) return `${p}.html`; // clean loc; file keeps .html
  const candidates = [`tool-pages/${p}.html`, `${p}.html`, p];
  return candidates.find((c) => fs.existsSync(path.join(rootDir, c))) || null;
}

function lastModForFile(file) {
  if (!file) return today;
  try {
    const out = execSync(`git log -1 --format=%cs -- "${file}"`, { cwd: rootDir })
      .toString().trim();
    return out || today;
  } catch {
    return today;
  }
}

let sitemap = fs.readFileSync(sitemapPath, 'utf8');
let updated = 0;

// For each <loc>…</loc> (optionally already followed by a <lastmod>), rewrite so
// the loc is followed by a fresh <lastmod>.
sitemap = sitemap.replace(
  /<loc>(https:\/\/www\.weconvertfiles\.com([^<]*))<\/loc>(\s*<lastmod>[^<]*<\/lastmod>)?/g,
  (_match, fullUrl, urlPath) => {
    const date = lastModForFile(fileForPath(urlPath));
    updated += 1;
    return `<loc>${fullUrl}</loc>\n    <lastmod>${date}</lastmod>`;
  }
);

fs.writeFileSync(sitemapPath, sitemap);
console.log(`Stamped <lastmod> on ${updated} sitemap URLs.`);
