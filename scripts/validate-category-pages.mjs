import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { tools as catalogueTools } from './catalogue.mjs';
import { nav } from '../data/tools.mjs';
import { categoryPages } from '../data/category-pages.mjs';
import { guideSlugForTool } from './guide-catalog.mjs';

// Category landing pages: prove each of the four topical hubs is a real page
// with a clean canonical, correct routing, sitemap entry and structured data —
// and that together the hubs assign every catalogue tool to exactly one
// intentional category (no orphans, no duplicates).

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const siteUrl = 'https://www.weconvertfiles.com';

const redirects = await readFile(path.join(rootDir, '_redirects'), 'utf8');
const sitemap = await readFile(path.join(rootDir, 'sitemap.xml'), 'utf8');
const navGroupByName = new Map(nav.groups.map((g) => [g.name, g]));

const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const count = (haystack, regex) => (haystack.match(regex) || []).length;

const assignment = new Map(); // toolId -> [category slugs]

for (const page of categoryPages) {
  const where = `category "${page.slug}"`;
  const url = `${siteUrl}/category/${page.slug}`;
  const filePath = path.join(rootDir, 'category', `${page.slug}.html`);

  check(existsSync(filePath), `${where}: generated page category/${page.slug}.html is missing.`);
  if (!existsSync(filePath)) continue;
  const html = await readFile(filePath, 'utf8');

  // Canonical + social metadata point at the clean category URL.
  check(count(html, /<link rel="canonical"/g) === 1, `${where}: expected exactly one canonical link.`);
  check(html.includes(`<link rel="canonical" href="${url}" />`), `${where}: canonical does not match ${url}.`);
  check(html.includes(`<meta property="og:url" content="${url}" />`), `${where}: og:url does not match ${url}.`);
  check(html.includes(`<h1`) && html.includes(page.h1), `${where}: missing H1 "${page.h1}".`);

  // Structured data present (CollectionPage, BreadcrumbList, ItemList, FAQPage).
  for (const type of ['CollectionPage', 'BreadcrumbList', 'ItemList', 'FAQPage']) {
    check(html.includes(`"@type": "${type}"`), `${where}: JSON-LD is missing ${type}.`);
  }
  check(page.faqs.length >= 2, `${where}: expected at least two FAQ entries for useful context.`);
  check(page.intro.length >= 2, `${where}: expected at least two intro paragraphs (avoid thin pages).`);

  // Routing: forced .html -> clean 301, clean URL served via pretty-URL.
  check(
    redirects.includes(`/category/${page.slug}.html    /category/${page.slug}    301!`),
    `${where}: _redirects is missing the forced ".html -> clean" rule.`
  );

  // Sitemap: clean URL present, .html absent.
  check(sitemap.includes(`<loc>${url}</loc>`), `${where}: clean URL missing from sitemap.`);
  check(!sitemap.includes(`<loc>${url}.html</loc>`), `${where}: .html URL must not appear in sitemap.`);

  // Membership resolves and each tool + its guide is linked.
  const group = navGroupByName.get(page.navGroup);
  check(!!group, `${where}: nav group "${page.navGroup}" does not exist.`);
  const toolIds = [...(group ? group.toolIds : []), ...(page.extraToolIds || [])];
  const catalogueIds = new Set(catalogueTools.map((t) => t.id));
  for (const id of toolIds) {
    check(catalogueIds.has(id), `${where}: references unknown tool "${id}".`);
    check(html.includes(`href="/${id}"`), `${where}: page does not link to tool /${id}.`);
    check(html.includes(`href="/guides/${guideSlugForTool(id)}"`), `${where}: page does not link to guide for /${id}.`);
    assignment.set(id, [...(assignment.get(id) || []), page.slug]);
  }

  // Links to the other three hubs (category-specific internal links).
  for (const other of categoryPages) {
    if (other.slug === page.slug) continue;
    check(html.includes(`href="/category/${other.slug}"`), `${where}: does not link to sibling hub /category/${other.slug}.`);
  }
}

// Coverage: every catalogue tool belongs to exactly one hub.
for (const tool of catalogueTools) {
  const homes = assignment.get(tool.id) || [];
  check(homes.length === 1, homes.length === 0
    ? `tool "${tool.id}" is not assigned to any category hub.`
    : `tool "${tool.id}" is assigned to multiple hubs: ${homes.join(', ')}.`);
}

if (failures.length) {
  console.error('Category page validation failed:');
  for (const f of failures) console.error(`- ${f}`);
  process.exit(1);
}

console.log('Category page validation passed:');
console.log(`- ${categoryPages.length} hubs with clean canonicals, forced .html redirects, sitemap entries and structured data`);
console.log(`- all ${catalogueTools.length} catalogue tools assigned to exactly one hub, each linked to its tool and guide`);
