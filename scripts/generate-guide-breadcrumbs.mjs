import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseToolCatalogue, guideSlugForTool } from './guide-catalog.mjs';
import { buildToolHubMap } from './category-catalog.mjs';
import { breadcrumbNav, breadcrumbJsonLdScript } from './breadcrumbs.mjs';

// Injects an accessible breadcrumb and a matching BreadcrumbList JSON-LD into
// every guide, both built from one trail so they cannot drift. Hierarchy:
// Home > category hub > tool > (this guide). Idempotent via HTML markers.

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { tools } = parseToolCatalogue();
const hubMap = buildToolHubMap();

const START = '<!-- BREADCRUMB_START -->';
const END = '<!-- BREADCRUMB_END -->';

function trailFor(tool) {
  const hub = hubMap.get(tool.id);
  if (!hub) throw new Error(`guide "${tool.id}": no category hub for breadcrumb.`);
  const slug = guideSlugForTool(tool.id);
  return [
    { name: 'Home', href: '/' },
    { name: hub.h1, href: `/category/${hub.slug}` },
    { name: tool.title, href: `/${tool.id}` },
    { name: 'Guide', href: `/guides/${slug}` }
  ];
}

function blockFor(tool) {
  const trail = trailFor(tool);
  return `${START}\n${breadcrumbNav(trail, { indent: '    ' })}\n${breadcrumbJsonLdScript(trail, { indent: '    ' })}\n    ${END}`;
}

let updated = 0;
let missing = 0;
for (const tool of tools) {
  const file = path.join(rootDir, 'guides', `${guideSlugForTool(tool.id)}.html`);
  if (!fs.existsSync(file)) { missing += 1; continue; }
  let html = fs.readFileSync(file, 'utf8');
  const block = blockFor(tool);

  if (html.includes(START)) {
    const s = html.indexOf(START);
    const e = html.indexOf(END, s) + END.length;
    html = html.slice(0, s) + block + html.slice(e);
  } else {
    // Insert right after the <main> opening tag (before the article header).
    const match = html.match(/<main\b[^>]*>/);
    if (!match) throw new Error(`Could not find <main> to inject breadcrumb into ${guideSlugForTool(tool.id)}.html.`);
    const at = match.index + match[0].length;
    html = `${html.slice(0, at)}\n    ${block}${html.slice(at)}`;
  }
  if (!html.includes(START)) {
    throw new Error(`Could not inject breadcrumb into ${guideSlugForTool(tool.id)}.html.`);
  }
  fs.writeFileSync(file, html);
  updated += 1;
}

console.log(`Injected breadcrumbs into ${updated} guides${missing ? ` (${missing} guide files missing)` : ''}.`);
