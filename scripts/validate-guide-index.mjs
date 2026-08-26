import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { guideHrefForTool, guideSlugForTool, parseToolCatalogue } from './guide-catalog.mjs';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const indexSource = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
const sitemapSource = fs.readFileSync(path.join(rootDir, 'sitemap.xml'), 'utf8');
const redirectsSource = fs.readFileSync(path.join(rootDir, '_redirects'), 'utf8');
const { tools, categories } = parseToolCatalogue();

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function duplicates(values) {
  return [...new Set(values.filter((value, index) => values.indexOf(value) !== index))];
}

function guideLinksForView(view) {
  const startMarker = `<div data-guide-view="${view}"`;
  const endMarker = view === 'desktop'
    ? '<div data-guide-view="mobile"'
    : '<!-- GENERATED_GUIDE_GRIDS_END -->';
  const start = indexSource.indexOf(startMarker);
  const end = indexSource.indexOf(endMarker, start + startMarker.length);
  assert(start >= 0 && end > start, `Could not find generated ${view} guide grid.`);
  const block = indexSource.slice(start, end);
  return [...block.matchAll(/href="(\/guides\/[a-z0-9-]+)"/g)].map((linkMatch) => linkMatch[1]);
}

const toolIds = tools.map((tool) => tool.id);
const categoryToolIds = categories.flatMap((category) => category.toolIds);
assert(duplicates(toolIds).length === 0, `Duplicate tool IDs: ${duplicates(toolIds).join(', ')}`);
assert(duplicates(categoryToolIds).length === 0, `Tools repeated in grid categories: ${duplicates(categoryToolIds).join(', ')}`);
assert(toolIds.length === categoryToolIds.length, `Tool catalogue has ${toolIds.length} entries but grid categories reference ${categoryToolIds.length}.`);
assert(toolIds.every((id) => categoryToolIds.includes(id)), 'At least one tool is missing from the tool grid categories.');

const expectedGuideHrefs = tools.map((tool) => guideHrefForTool(tool.id)).sort();
assert(duplicates(expectedGuideHrefs).length === 0, `Multiple tools share a primary guide: ${duplicates(expectedGuideHrefs).join(', ')}`);

const actualGuideHrefs = fs.readdirSync(path.join(rootDir, 'guides'))
  .filter((file) => file.endsWith('.html'))
  .map((file) => `/guides/${file.replace(/\.html$/, '')}`) // clean canonical URL, not the .html file path
  .sort();
assert(JSON.stringify(actualGuideHrefs) === JSON.stringify(expectedGuideHrefs), `Primary guide files do not match the ${tools.length}-tool catalogue.`);

for (const view of ['desktop', 'mobile']) {
  const links = guideLinksForView(view).sort();
  assert(links.length === tools.length, `${view} guide grid has ${links.length} links; expected ${tools.length}.`);
  assert(duplicates(links).length === 0, `${view} guide grid contains duplicate links.`);
  assert(JSON.stringify(links) === JSON.stringify(expectedGuideHrefs), `${view} guide grid does not match primary guide files.`);
}

const sitemapGuideHrefs = [...sitemapSource.matchAll(/<loc>https:\/\/www\.weconvertfiles\.com(\/guides\/[a-z0-9-]+)<\/loc>/g)]
  .map((match) => match[1])
  .sort();
assert(JSON.stringify(sitemapGuideHrefs) === JSON.stringify(expectedGuideHrefs), 'Sitemap guide URLs do not match primary guide files.');

for (const [oldGuide, conversionPage] of [['jpg-to-pdf', 'jpg-to-pdf'], ['png-to-pdf', 'png-to-pdf']]) {
  assert(!fs.existsSync(path.join(rootDir, 'guides', `${oldGuide}.html`)), `${oldGuide}.html should be consolidated.`);
  assert(redirectsSource.includes(`/guides/${oldGuide}    /convert/${conversionPage}    301`), `Missing clean redirect for ${oldGuide}.`);
  assert(redirectsSource.includes(`/guides/${oldGuide}.html    /convert/${conversionPage}    301`), `Missing .html redirect for ${oldGuide}.`);
}

assert(indexSource.includes(`data-tool-count="${tools.length}"`), 'Visible tool count is not synchronized.');
assert(indexSource.includes(`data-guide-count="${tools.length}">${tools.length}</span>`), 'Visible guide count is not synchronized or has invalid markup.');
assert(!indexSource.includes('45+ free'), 'Outdated 45+ tool wording remains in index.html.');

console.log('Guide parity validation passed:');
console.log(`- ${tools.length} unique tools, tool-grid entries, primary guides, desktop links, mobile links, and sitemap guide URLs`);
console.log(`- ${Object.keys(Object.fromEntries(tools.map((tool) => [guideSlugForTool(tool.id), tool.id]))).length} unique primary guide slugs`);
console.log('- redundant JPG and PNG guide URLs permanently redirect to their stronger conversion pages');
