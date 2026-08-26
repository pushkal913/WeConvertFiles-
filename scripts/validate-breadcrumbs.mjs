import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { tools as catalogueTools } from './catalogue.mjs';
import { categoryPages } from '../data/category-pages.mjs';
import { guideSlugForTool } from './guide-catalog.mjs';

// Breadcrumbs: for tool, guide and category pages, prove the visible breadcrumb
// and the BreadcrumbList JSON-LD describe the same hierarchy, and that every
// crumb URL is a real site route (no invalid URLs). Also checks the runtime SPA
// breadcrumb (window.WCF_CATALOGUE.breadcrumbs) matches the static tool page.

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const siteUrl = 'https://www.weconvertfiles.com';

const failures = [];
const check = (cond, msg) => { if (!cond) failures.push(msg); };

const decode = (s) => String(s)
  .replaceAll('&amp;', '&').replaceAll('&lt;', '<').replaceAll('&gt;', '>')
  .replaceAll('&quot;', '"').replaceAll('&#39;', "'").trim();

// Valid crumb targets: home, the four category hubs, every tool route, every guide.
const validPaths = new Set(['/']);
for (const c of categoryPages) validPaths.add(`/category/${c.slug}`);
for (const t of catalogueTools) {
  validPaths.add(`/${t.id}`);
  validPaths.add(`/guides/${guideSlugForTool(t.id)}`);
}
const toAbs = (href) => (/^https?:\/\//.test(href) ? href : `${siteUrl}${href}`);
const toPath = (url) => url.replace(siteUrl, '') || '/';

function parseVisible(html) {
  const nav = (html.match(/<nav aria-label="Breadcrumb"[\s\S]*?<\/nav>/) || [])[0];
  if (!nav) return null;
  const crumbs = [];
  const liRe = /<li(?![^>]*aria-hidden)[^>]*>([\s\S]*?)<\/li>/g;
  let m;
  while ((m = liRe.exec(nav))) {
    const a = m[1].match(/<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/);
    if (a) { crumbs.push({ name: decode(a[2]), href: a[1], current: false }); continue; }
    const span = m[1].match(/<span[^>]*aria-current="page"[^>]*>([\s\S]*?)<\/span>/);
    if (span) crumbs.push({ name: decode(span[1]), href: null, current: true });
  }
  return crumbs;
}

function parseSchema(html) {
  for (const s of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    let data;
    try { data = JSON.parse(s[1]); } catch { continue; }
    const graph = data['@graph'] || [data];
    for (const node of graph) {
      if (node && node['@type'] === 'BreadcrumbList') {
        return [...node.itemListElement]
          .sort((a, b) => a.position - b.position)
          .map((li) => ({ name: li.name, item: li.item }));
      }
    }
  }
  return null;
}

// Assert a page's visible breadcrumb and schema agree and use valid URLs.
function checkPage(where, html, expectedLastPath) {
  const visible = parseVisible(html);
  const schema = parseSchema(html);
  check(!!visible, `${where}: no visible breadcrumb <nav aria-label="Breadcrumb">.`);
  check(!!schema, `${where}: no BreadcrumbList JSON-LD.`);
  if (!visible || !schema) return;

  check(visible.length === schema.length, `${where}: visible has ${visible.length} crumbs, schema has ${schema.length}.`);
  check(visible.length >= 2, `${where}: breadcrumb needs at least two crumbs.`);

  const n = Math.min(visible.length, schema.length);
  for (let i = 0; i < n; i++) {
    check(visible[i].name === schema[i].name,
      `${where}: crumb ${i + 1} name differs (visible "${visible[i].name}" vs schema "${schema[i].name}").`);
    // Non-current visible crumbs are links; their href must match the schema item.
    if (!visible[i].current) {
      check(toAbs(visible[i].href) === schema[i].item,
        `${where}: crumb ${i + 1} href "${visible[i].href}" != schema item "${schema[i].item}".`);
    }
    check(validPaths.has(toPath(schema[i].item)),
      `${where}: crumb ${i + 1} points at an invalid URL "${schema[i].item}".`);
  }
  // Last crumb is the page itself.
  const last = schema[schema.length - 1];
  check(last && toPath(last.item) === expectedLastPath,
    `${where}: final crumb "${last && last.item}" is not the page's own URL (${siteUrl}${expectedLastPath}).`);
  check(visible[visible.length - 1] && visible[visible.length - 1].current,
    `${where}: final visible crumb must be the current page (aria-current="page").`);
}

// --- Tool pages -------------------------------------------------------------
for (const tool of catalogueTools) {
  const file = path.join(rootDir, 'tool-pages', `${tool.id}.html`);
  if (!existsSync(file)) { failures.push(`tool "${tool.id}": tool page missing.`); continue; }
  checkPage(`tool "${tool.id}"`, await readFile(file, 'utf8'), `/${tool.id}`);
}

// --- Guide pages ------------------------------------------------------------
for (const tool of catalogueTools) {
  const slug = guideSlugForTool(tool.id);
  const file = path.join(rootDir, 'guides', `${slug}.html`);
  if (!existsSync(file)) { failures.push(`guide "${slug}": guide file missing.`); continue; }
  checkPage(`guide "${slug}"`, await readFile(file, 'utf8'), `/guides/${slug}`);
}

// --- Category pages ---------------------------------------------------------
for (const c of categoryPages) {
  const file = path.join(rootDir, 'category', `${c.slug}.html`);
  if (!existsSync(file)) { failures.push(`category "${c.slug}": page missing.`); continue; }
  checkPage(`category "${c.slug}"`, await readFile(file, 'utf8'), `/category/${c.slug}`);
}

// --- Runtime SPA breadcrumb matches the static tool page --------------------
const runtime = await readFile(path.join(rootDir, 'js', 'catalogue.js'), 'utf8');
const payloadJson = runtime.slice(runtime.indexOf('{'), runtime.lastIndexOf('}') + 1);
let runtimeBreadcrumbs = {};
try { runtimeBreadcrumbs = (JSON.parse(payloadJson).breadcrumbs) || {}; }
catch { failures.push('js/catalogue.js: could not parse WCF_CATALOGUE payload.'); }
for (const tool of catalogueTools) {
  const html = runtimeBreadcrumbs[tool.id];
  check(!!html, `runtime breadcrumb for "${tool.id}" is missing.`);
  if (!html) continue;
  const runtimeCrumbs = parseVisible(html);
  const staticCrumbs = parseVisible(await readFile(path.join(rootDir, 'tool-pages', `${tool.id}.html`), 'utf8'));
  check(runtimeCrumbs && staticCrumbs && JSON.stringify(runtimeCrumbs.map((c) => c.name)) === JSON.stringify(staticCrumbs.map((c) => c.name)),
    `runtime breadcrumb for "${tool.id}" does not match its static tool page.`);
}

if (failures.length) {
  console.error('Breadcrumb validation failed:');
  for (const f of failures) console.error(`- ${f}`);
  process.exit(1);
}

console.log('Breadcrumb validation passed:');
console.log(`- ${catalogueTools.length} tool pages, ${catalogueTools.length} guides and ${categoryPages.length} category pages: visible breadcrumb and BreadcrumbList schema agree, all crumb URLs valid`);
console.log('- runtime SPA breadcrumbs match their static tool pages');
