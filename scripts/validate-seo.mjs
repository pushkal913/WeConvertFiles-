import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { tools as catalogueTools } from './catalogue.mjs';
import { categoryPages } from '../data/category-pages.mjs';
import { guideSlugForTool } from './guide-catalog.mjs';

// SEO/GEO output validation (Task 21). One place that fails CI on an SEO
// regression across every indexed page: unique title/description, correct
// canonical, exactly one primary H1 where intended, parseable JSON-LD with
// valid schema URLs, no broken internal links, no accidental noindex, and a
// sitemap that matches the canonical URLs. Every failure names the exact file.

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const siteUrl = 'https://www.weconvertfiles.com';
const failures = [];
const check = (cond, msg) => { if (!cond) failures.push(msg); };

// ---- Inventory of indexed pages -------------------------------------------
const infoPages = ['about', 'contact', 'privacy', 'terms', 'accessibility'];
const convertSlugs = ['heic-to-jpg', 'jpg-to-pdf', 'pdf-to-jpg', 'png-to-pdf', 'word-to-pdf'];

const pages = [{ rel: 'index.html', route: '/', shell: true }];
for (const t of catalogueTools) pages.push({ rel: `tool-pages/${t.id}.html`, route: `/${t.id}`, shell: true });
for (const t of catalogueTools) { const s = guideSlugForTool(t.id); pages.push({ rel: `guides/${s}.html`, route: `/guides/${s}` }); }
for (const c of categoryPages) pages.push({ rel: `category/${c.slug}.html`, route: `/category/${c.slug}` });
for (const s of convertSlugs) pages.push({ rel: `convert/${s}.html`, route: `/convert/${s}` });
for (const p of infoPages) pages.push({ rel: `${p}.html`, route: `/${p}` });

const canonicalFor = (route) => (route === '/' ? `${siteUrl}/` : `${siteUrl}${route}`);

// ---- Valid link targets (canonical routes + legacy redirect sources) -------
const redirectsSrc = await readFile(path.join(rootDir, '_redirects'), 'utf8');
const validTargets = new Set(pages.map((p) => p.route));
validTargets.add('/');
for (const line of redirectsSrc.split('\n')) {
  const t = line.trim();
  if (!t || t.startsWith('#')) continue;
  const from = t.split(/\s+/)[0];
  if (from && from !== '/*') validTargets.add(from.replace(/!$/, ''));
}
const targetResolves = (route) => {
  if (validTargets.has(route)) return true;
  // Direct file or pretty-URL .html fallback.
  const clean = route.replace(/^\//, '');
  return existsSync(path.join(rootDir, clean)) || existsSync(path.join(rootDir, `${clean}.html`));
};

// ---- Load pages ------------------------------------------------------------
const html = new Map();
for (const p of pages) {
  if (!existsSync(path.join(rootDir, p.rel))) { failures.push(`${p.rel}: indexed page is missing.`); continue; }
  html.set(p.rel, await readFile(path.join(rootDir, p.rel), 'utf8'));
}

const titles = new Map();
const descriptions = new Map();

for (const p of pages) {
  const doc = html.get(p.rel);
  if (!doc) continue;
  const where = p.rel;
  const canonical = canonicalFor(p.route);

  // 1. Title — exactly one, non-empty, tracked for uniqueness.
  const titleMatches = [...doc.matchAll(/<title>([\s\S]*?)<\/title>/g)];
  check(titleMatches.length === 1, `${where}: expected exactly one <title>, found ${titleMatches.length}.`);
  const title = titleMatches[0] ? titleMatches[0][1].trim() : '';
  check(title.length > 0, `${where}: <title> is empty.`);
  if (title) { if (titles.has(title)) failures.push(`${where}: duplicate <title> (also in ${titles.get(title)}).`); else titles.set(title, where); }

  // 2. Meta description — exactly one, non-empty, tracked for uniqueness.
  const descMatches = [...doc.matchAll(/<meta name="description" content="([^"]*)"/g)];
  check(descMatches.length === 1, `${where}: expected exactly one meta description, found ${descMatches.length}.`);
  const desc = descMatches[0] ? descMatches[0][1].trim() : '';
  check(desc.length > 0, `${where}: meta description is empty.`);
  if (desc) { if (descriptions.has(desc)) failures.push(`${where}: duplicate meta description (also in ${descriptions.get(desc)}).`); else descriptions.set(desc, where); }

  // 3. Canonical — exactly one, matches the page's route.
  const canonMatches = [...doc.matchAll(/<link rel="canonical" href="([^"]*)"/g)];
  check(canonMatches.length === 1, `${where}: expected exactly one canonical link, found ${canonMatches.length}.`);
  if (canonMatches[0]) check(canonMatches[0][1] === canonical, `${where}: canonical "${canonMatches[0][1]}" != expected "${canonical}".`);
  const ogUrl = (doc.match(/<meta property="og:url" content="([^"]*)"/) || [])[1];
  check(ogUrl === canonical, `${where}: og:url "${ogUrl}" != canonical "${canonical}".`);

  // 4. Exactly one primary H1. SPA-shell pages (dashboard + workspace views)
  //    legitimately ship two H1s, one hidden per view; content pages ship one.
  const h1s = [...doc.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g)];
  if (p.shell) {
    check(h1s.length === 2, `${where}: SPA shell expected 2 H1s (hero + workspace), found ${h1s.length}.`);
    const ws = doc.match(/<h1 id="workspaceTitle"[^>]*>([\s\S]*?)<\/h1>/);
    check(!!ws, `${where}: missing #workspaceTitle H1.`);
    const isToolView = /<html[^>]*data-initial-view="tool"/.test(doc);
    if (isToolView) check(ws && ws[1].trim().length > 0, `${where}: #workspaceTitle (primary H1) is empty.`);
  } else {
    check(h1s.length === 1, `${where}: expected exactly one H1, found ${h1s.length}.`);
    if (h1s.length === 1) check(h1s[0][1].replace(/<[^>]+>/g, '').trim().length > 0, `${where}: the H1 is empty.`);
  }

  // 5. No accidental noindex.
  check(!/content="[^"]*noindex/i.test(doc), `${where}: contains a noindex robots directive.`);

  // 6. JSON-LD parses, and its URLs are canonical www routes that resolve.
  for (const s of doc.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    let data;
    try { data = JSON.parse(s[1]); }
    catch (e) { failures.push(`${where}: JSON-LD does not parse (${e.message}).`); continue; }
    for (const url of collectSchemaUrls(data)) {
      check(url.startsWith(`${siteUrl}/`) || url === siteUrl, `${where}: schema URL uses wrong host: ${url}`);
      // Strip a JSON-LD node-id fragment (e.g. #webpage) — resolve the base page.
      const route = (url.replace(siteUrl, '').split('#')[0]) || '/';
      check(targetResolves(route), `${where}: schema URL does not resolve to a page: ${url}`);
    }
  }

  // 7. Internal links resolve (broken-link detection). Skip assets, anchors,
  //    query-only and non-path links.
  for (const m of doc.matchAll(/href="(\/[^"]*)"/g)) {
    const raw = m[1];
    if (raw.startsWith('/assets/') || raw.startsWith('/#') || raw.endsWith('.js') || raw.endsWith('.css') || raw.endsWith('.xml') || raw.endsWith('.png') || raw.endsWith('.svg') || raw.endsWith('.ico') || raw.endsWith('.webmanifest')) continue;
    const route = raw.split('#')[0].split('?')[0];
    if (route === '') continue;
    check(targetResolves(route), `${where}: broken internal link ${raw}`);
  }
}

// URL-bearing fields in a JSON-LD graph (item, url, @id, mainEntityOfPage).
function collectSchemaUrls(node, out = []) {
  if (Array.isArray(node)) { for (const n of node) collectSchemaUrls(n, out); return out; }
  if (node && typeof node === 'object') {
    for (const [k, v] of Object.entries(node)) {
      if ((k === 'item' || k === 'url' || k === '@id') && typeof v === 'string' && v.startsWith('http')) out.push(v);
      else if (k === 'mainEntityOfPage') { if (typeof v === 'string' && v.startsWith('http')) out.push(v); else collectSchemaUrls(v, out); }
      else if (typeof v === 'object') collectSchemaUrls(v, out);
    }
  }
  return out;
}

// ---- Sitemap URLs match the canonical URLs exactly -------------------------
const sitemap = await readFile(path.join(rootDir, 'sitemap.xml'), 'utf8');
const sitemapLocs = new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]));
const indexedCanonicals = new Set(pages.map((p) => canonicalFor(p.route)));
for (const loc of sitemapLocs) check(indexedCanonicals.has(loc), `sitemap: <loc> ${loc} does not match any indexed page's canonical URL.`);
for (const c of indexedCanonicals) check(sitemapLocs.has(c), `sitemap: indexed canonical ${c} is missing from sitemap.xml.`);

if (failures.length) {
  console.error('SEO validation failed:');
  for (const f of failures) console.error(`- ${f}`);
  process.exit(1);
}

console.log('SEO validation passed:');
console.log(`- ${pages.length} indexed pages: unique title/description, correct canonical + og:url, primary H1, no noindex`);
console.log('- all JSON-LD parses; schema + internal links resolve to canonical routes; sitemap matches canonicals');
