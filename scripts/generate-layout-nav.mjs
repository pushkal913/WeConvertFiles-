import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { tools, nav } from '../data/tools.mjs';

// Generates layout.js's header-search `tools` list and mobile-menu `categories`
// from the tool catalogue (data/tools.mjs) so they aren't a hand-maintained
// duplicate. Navigation shows only id/title/kicker; nav.overrides preserves the
// intentionally-different navigation labels, nav.groups is the curated mobile
// taxonomy. Idempotent via markers.

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const layoutPath = path.join(rootDir, 'layout.js');
let src = readFileSync(layoutPath, 'utf8');

const TOOLS_START = '  // WCF_NAV_TOOLS_START — generated from data/tools.mjs (npm run generate:layout-nav); do not edit by hand.';
const TOOLS_END = '  // WCF_NAV_TOOLS_END';
const GROUPS_START = '  // WCF_NAV_GROUPS_START — generated from data/tools.mjs (npm run generate:layout-nav); do not edit by hand.';
const GROUPS_END = '  // WCF_NAV_GROUPS_END';

const label = (id, field) => (nav.overrides[id] && nav.overrides[id][field]) || null;

const toolsBlock = '  const tools = [\n' + tools.map((t) => {
  const title = label(t.id, 'title') || t.title;
  const kicker = label(t.id, 'kicker') || t.kicker;
  return `      { id: '${t.id}', title: ${JSON.stringify(title)}, kicker: ${JSON.stringify(kicker)} }`;
}).join(',\n') + '\n    ];';

const groupsBlock = '  const categories = [\n' + nav.groups.map((g) => {
  const ids = g.toolIds.map((id) => `'${id}'`).join(', ');
  return `    { name: ${JSON.stringify(g.name)}, ids: [${ids}] }`;
}).join(',\n') + '\n  ];';

function inject(source, startMarker, endMarker, block, findFrom, findTo) {
  const wrapped = `${startMarker}\n${block}\n${endMarker}`;
  if (source.includes(startMarker)) {
    const s = source.indexOf(startMarker);
    const e = source.indexOf(endMarker, s) + endMarker.length;
    return source.slice(0, s) + wrapped + source.slice(e);
  }
  const s = source.indexOf(findFrom);
  if (s < 0) throw new Error(`generate-layout-nav: could not find ${findFrom}`);
  const e = source.indexOf(findTo, s) + findTo.length;
  return source.slice(0, s) + wrapped + source.slice(e);
}

src = inject(src, TOOLS_START, TOOLS_END, toolsBlock, '  const tools = [', '\n    ];');
src = inject(src, GROUPS_START, GROUPS_END, groupsBlock, '  const categories = [', '\n  ];');

writeFileSync(layoutPath, src);
console.log(`Generated layout.js navigation from the catalogue: ${tools.length} search tools, ${nav.groups.length} mobile groups.`);
