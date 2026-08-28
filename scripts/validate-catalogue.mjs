import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { tools, categories, libraries, nav, catalogueProblems, renderRuntimeCatalogue } from './catalogue.mjs';
import { buildNavigationCategories } from './category-catalog.mjs';

// Validates the authoritative tool catalogue (data/tools.mjs):
//   1. Structural integrity — 47 tools, no duplicate ids, required fields,
//      routes/guides derived correctly, valid categories and dependencies.
//   2. No drift — the runtime tool config still embedded in app.js (and the tool
//      ids in layout.js) must match the catalogue, so the catalogue stays the
//      single source of truth until runtime is migrated to consume it directly.

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const appSource = readFileSync(path.join(rootDir, 'app.js'), 'utf8');
const layoutSource = readFileSync(path.join(rootDir, 'layout.js'), 'utf8');

// Evaluate one `const <name> = <literal>;` block from a trusted local build file.
// These are our own source files (never user input); this is the exact way to
// read their data without a fragile regex over nested object literals.
function pickLiteral(src, decl, closeToken) {
  const start = src.indexOf(decl);
  if (start < 0) throw new Error(`validate-catalogue: could not find "${decl}"`);
  const from = start + decl.length;
  const end = src.indexOf(closeToken, from);
  if (end < 0) throw new Error(`validate-catalogue: no "${closeToken}" after "${decl}"`);
  const literal = src.slice(from, end + closeToken.length).trim().replace(/;$/, '');
  // eslint-disable-next-line no-new-func
  return new Function(`return (${literal})`)();
}

const failures = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };

// ---- 1. Structural integrity (shared with the generators) -------------------

failures.push(...catalogueProblems());
assert(tools.length === 47, `Expected 47 tools in the catalogue, found ${tools.length}.`);

// ---- 2. No drift vs app.js (runtime config) ---------------------------------

const appTools = pickLiteral(appSource, 'const tools = ', '\n];');
const appCategories = pickLiteral(appSource, 'const toolCategories = ', '\n];');

const appToolById = new Map(appTools.map((t) => [t.id, t]));
for (const tool of tools) {
  const a = appToolById.get(tool.id);
  if (!a) { failures.push(`Catalogue tool "${tool.id}" is not present in app.js`); continue; }
  for (const [field, appField] of [['title', 'title'], ['description', 'description'], ['kicker', 'kicker'], ['badge', 'badge']]) {
    assert(tool[field] === a[appField], `Tool "${tool.id}" ${field} differs from app.js ("${tool[field]}" vs "${a[appField]}")`);
  }
  assert(tool.icon.bg === a.iconBg, `Tool "${tool.id}" icon.bg differs from app.js iconBg`);
  assert(tool.icon.color === a.iconColor, `Tool "${tool.id}" icon.color differs from app.js iconColor`);
}
for (const a of appTools) {
  assert(tools.find((t) => t.id === a.id), `app.js tool "${a.id}" is missing from the catalogue`);
}

const appCategoryById = new Map(appCategories.map((c) => [c.id, c]));
for (const category of categories) {
  const a = appCategoryById.get(category.id);
  if (!a) { failures.push(`Catalogue category "${category.id}" is not present in app.js`); continue; }
  assert(category.title === a.title, `Category "${category.id}" title differs from app.js`);
  assert(category.rgb === a.rgb, `Category "${category.id}" rgb differs from app.js`);
  assert(JSON.stringify(category.toolIds) === JSON.stringify(a.tools), `Category "${category.id}" tool list differs from app.js`);
}
assert(appCategories.length === categories.length, `app.js has ${appCategories.length} categories, catalogue has ${categories.length}`);

// Dependency metadata now lives only in the catalogue and is delivered to the
// runtime as js/catalogue.js. Check that generated file is in sync, and that
// app.js keeps a ready-check for exactly the catalogue's libraries.
const runtimePath = path.join(rootDir, 'js', 'catalogue.js');
const runtimeOnDisk = existsSync(runtimePath) ? readFileSync(runtimePath, 'utf8') : '';
assert(runtimeOnDisk === renderRuntimeCatalogue(), 'js/catalogue.js is out of date — run `npm run generate:catalogue-runtime`.');

const readyMatch = appSource.match(/const libraryReadyChecks = \{([\s\S]*?)\n\};/);
const readyNames = readyMatch ? [...readyMatch[1].matchAll(/^\s{2}([a-z0-9]+):/gm)].map((m) => m[1]) : [];
const libraryNames = Object.keys(libraries);
assert(
  JSON.stringify([...readyNames].sort()) === JSON.stringify([...libraryNames].sort()),
  `app.js libraryReadyChecks ${JSON.stringify(readyNames)} does not match catalogue libraries ${JSON.stringify(libraryNames)}`
);

// Tools split into js/tools/<id>.js: the catalogue `module` field, the module
// file on disk and app.js's runtime MODULE_TOOLS set must all agree.
const moduleTools = tools.filter((t) => t.module.startsWith('js/tools/'));
for (const tool of moduleTools) {
  assert(tool.module === `js/tools/${tool.id}.js`, `Tool "${tool.id}" module should be js/tools/${tool.id}.js`);
  assert(existsSync(path.join(rootDir, tool.module)), `Tool "${tool.id}" module file ${tool.module} is missing`);
}
const moduleSetMatch = appSource.match(/const MODULE_TOOLS = new Set\(\[([^\]]*)\]\)/);
const runtimeModuleTools = moduleSetMatch ? [...moduleSetMatch[1].matchAll(/'([^']+)'/g)].map((m) => m[1]) : [];
const catalogueModuleIds = moduleTools.map((t) => t.id);
assert(
  JSON.stringify([...runtimeModuleTools].sort()) === JSON.stringify([...catalogueModuleIds].sort()),
  `app.js MODULE_TOOLS ${JSON.stringify(runtimeModuleTools)} does not match catalogue module tools ${JSON.stringify(catalogueModuleIds)}`
);

// ---- 3. Tool-id parity vs layout.js (display values legitimately differ) -----

const layoutTools = pickLiteral(layoutSource, 'const tools = ', '\n    ];');
const layoutIds = new Set(layoutTools.map((t) => t.id));
for (const tool of tools) assert(layoutIds.has(tool.id), `Tool "${tool.id}" is missing from layout.js`);
for (const id of layoutIds) assert(tools.find((t) => t.id === id), `layout.js tool "${id}" is missing from the catalogue`);

// ---- 4. Navigation is catalogue-driven --------------------------------------

const toolIdSet = new Set(tools.map((t) => t.id));
for (const id of Object.keys(nav.overrides)) {
  assert(toolIdSet.has(id), `nav.overrides references unknown tool "${id}"`);
}
for (const group of nav.groups) {
  assert(typeof group.name === 'string' && group.name.length > 0, 'a nav group is missing a name');
  for (const id of group.toolIds) assert(toolIdSet.has(id), `nav group "${group.name}" references unknown tool "${id}"`);
}
// layout.js's search list is generated from the catalogue (markers present and
// tool ids in catalogue order), and its mobile groups mirror nav.groups.
assert(
  layoutSource.includes('WCF_NAV_TOOLS_START') && layoutSource.includes('WCF_NAV_GROUPS_START') && layoutSource.includes('WCF_NAV_DESKTOP_START'),
  'layout.js navigation is not generated from the catalogue (missing markers) — run `npm run generate:layout-nav`.'
);
assert(
  JSON.stringify(layoutTools.map((t) => t.id)) === JSON.stringify(tools.map((t) => t.id)),
  'layout.js search tools are out of sync with the catalogue — run `npm run generate:layout-nav`.'
);
const layoutGroups = pickLiteral(layoutSource, 'const categories = ', '\n  ];');
assert(
  JSON.stringify(layoutGroups.map((g) => ({ id: g.id, name: g.name, hubPath: g.hubPath, ids: g.ids }))) ===
    JSON.stringify(buildNavigationCategories().map((g) => ({ id: g.id, name: g.label, hubPath: g.hubPath, ids: g.toolIds }))),
  'layout.js mobile groups are out of sync with canonical navigation categories — run `npm run generate:layout-nav`.'
);

// No stale tool links: every single-segment nav href in the curated header /
// footer of layout.js and index.html resolves to a catalogue route or a known
// static page.
const STATIC_PAGES = new Set(['/about', '/contact', '/privacy', '/terms', '/accessibility']);
const catalogueRoutes = new Set(tools.map((t) => t.route));
const indexSource = readFileSync(path.join(rootDir, 'index.html'), 'utf8');
for (const [file, source] of [['layout.js', layoutSource], ['index.html', indexSource]]) {
  const hrefs = [...new Set([...source.matchAll(/href="(\/[a-z0-9-]+)"/g)].map((m) => m[1]))];
  for (const href of hrefs) {
    assert(catalogueRoutes.has(href) || STATIC_PAGES.has(href), `${file} has a stale nav link "${href}" (not a catalogue route or known page)`);
  }
}

// ---- Report -----------------------------------------------------------------

if (failures.length) {
  console.error(`Tool catalogue validation failed:\n- ${failures.join('\n- ')}`);
  process.exit(1);
}

console.log('Tool catalogue validation passed:');
console.log(`- ${tools.length} tools, unique ids, all required fields present`);
console.log(`- ${categories.length} categories cover all 47 tools once; routes and guide URLs derive correctly`);
console.log(`- every dependency resolves to one of ${Object.keys(libraries).length} known libraries`);
console.log('- catalogue matches app.js runtime config (tools, categories, dependencies, libraries) — no drift');
console.log('- tool ids are in parity with layout.js');
