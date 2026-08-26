import { readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { tools as catalogueTools } from './catalogue.mjs';
import { categoryPages } from '../data/category-pages.mjs';
import { guideSlugForTool } from './guide-catalog.mjs';
import { relatedToolIds } from './related.mjs';

// Internal-linking integrity (Task 20):
//   - No important page (tool, guide, category hub) is orphaned — each is linked
//     from at least one OTHER page using its canonical route.
//   - Related-tool links on a tool page are genuinely relevant (same category or
//     hub) and use canonical routes.

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const failures = [];
const check = (cond, msg) => { if (!cond) failures.push(msg); };

// Load every deliverable HTML page with its repo-relative path.
async function loadPages() {
  const pages = new Map(); // relPath -> html
  const add = async (rel) => { if (existsSync(path.join(rootDir, rel))) pages.set(rel, await readFile(path.join(rootDir, rel), 'utf8')); };
  await add('index.html');
  for (const dir of ['tool-pages', 'guides', 'category', 'convert']) {
    const abs = path.join(rootDir, dir);
    if (!existsSync(abs)) continue;
    for (const f of (await readdir(abs)).filter((n) => n.endsWith('.html'))) await add(`${dir}/${f}`);
  }
  return pages;
}

const pages = await loadPages();
const hrefsIn = (html) => new Set([...html.matchAll(/href="(\/[^"#]*)"/g)].map((m) => m[1]));
const pageHrefs = new Map([...pages].map(([rel, html]) => [rel, hrefsIn(html)]));

// A page's own file, so self-links don't count as "linked from elsewhere".
const ownFileFor = {
  tool: (id) => `tool-pages/${id}.html`,
  guide: (slug) => `guides/${slug}.html`,
  category: (slug) => `category/${slug}.html`
};

function linkedFromElsewhere(route, ownRel) {
  for (const [rel, hrefs] of pageHrefs) {
    if (rel === ownRel) continue;
    if (hrefs.has(route)) return true;
  }
  return false;
}

// --- Orphan checks ----------------------------------------------------------
for (const tool of catalogueTools) {
  check(linkedFromElsewhere(`/${tool.id}`, ownFileFor.tool(tool.id)), `tool "${tool.id}" is orphaned: no other page links /${tool.id}.`);
  const slug = guideSlugForTool(tool.id);
  check(linkedFromElsewhere(`/guides/${slug}`, ownFileFor.guide(slug)), `guide "${slug}" is orphaned: no other page links /guides/${slug}.`);
}
for (const c of categoryPages) {
  check(linkedFromElsewhere(`/category/${c.slug}`, ownFileFor.category(c.slug)), `category "${c.slug}" is orphaned: no other page links /category/${c.slug}.`);
}

// --- Related-tool relevance + canonical routes ------------------------------
const toolIds = new Set(catalogueTools.map((t) => t.id));
for (const tool of catalogueTools) {
  const rel = `tool-pages/${tool.id}.html`;
  const html = pages.get(rel);
  if (!html) { failures.push(`tool "${tool.id}": page missing.`); continue; }
  const gridMatch = html.match(/<div id="relatedToolsGrid"[^>]*>([\s\S]*?)<\/div>/);
  const grid = gridMatch ? gridMatch[1] : '';
  const linkedIds = [...grid.matchAll(/href="\/([a-z0-9-]+)"/g)].map((m) => m[1]);
  const allowed = new Set(relatedToolIds(tool.id));
  for (const id of linkedIds) {
    check(toolIds.has(id), `tool "${tool.id}": related link /${id} is not a canonical tool route.`);
    check(allowed.has(id), `tool "${tool.id}": related tool /${id} is not a relevant (same category/hub) alternative.`);
  }
  check(linkedIds.length > 0, `tool "${tool.id}": has no related tools.`);
  // Contextual link to its own guide is present and canonical.
  check(html.includes(`href="/guides/${guideSlugForTool(tool.id)}"`), `tool "${tool.id}": missing a contextual link to its guide.`);
}

if (failures.length) {
  console.error('Internal-link validation failed:');
  for (const f of failures) console.error(`- ${f}`);
  process.exit(1);
}

console.log('Internal-link validation passed:');
console.log(`- ${catalogueTools.length} tools, ${catalogueTools.length} guides and ${categoryPages.length} category hubs are all linked from elsewhere (no orphans)`);
console.log('- related-tool links are relevant (same category/hub) and use canonical routes; each tool links to its guide');
