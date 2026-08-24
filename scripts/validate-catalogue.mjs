import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { tools, categories, libraries } from '../data/tools.mjs';
import { guideSlugForTool } from './guide-catalog.mjs';

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

const REQUIRED_STRING_FIELDS = ['id', 'title', 'description', 'kicker', 'badge', 'category', 'route', 'guide', 'module'];

// ---- 1. Structural integrity -------------------------------------------------

assert(tools.length === 47, `Expected 47 tools in the catalogue, found ${tools.length}.`);

const ids = tools.map((t) => t.id);
const duplicateIds = [...new Set(ids.filter((id, i) => ids.indexOf(id) !== i))];
assert(duplicateIds.length === 0, `Duplicate tool ids in catalogue: ${duplicateIds.join(', ')}`);

const categoryIds = new Set(categories.map((c) => c.id));
const libraryNames = new Set(Object.keys(libraries));

for (const tool of tools) {
  const where = `tool "${tool.id || '(no id)'}"`;
  for (const field of REQUIRED_STRING_FIELDS) {
    assert(typeof tool[field] === 'string' && tool[field].length > 0, `${where} is missing required field "${field}"`);
  }
  assert(tool.icon && typeof tool.icon.bg === 'string' && typeof tool.icon.color === 'string', `${where} is missing icon.bg / icon.color`);
  assert(tool.route === `/${tool.id}`, `${where} route "${tool.route}" should be "/${tool.id}"`);
  assert(tool.guide === `/guides/${guideSlugForTool(tool.id)}.html`, `${where} guide "${tool.guide}" does not match its slug rule`);
  assert(categoryIds.has(tool.category), `${where} references unknown category "${tool.category}"`);
  assert(Array.isArray(tool.dependencies), `${where} dependencies must be an array`);
  for (const dep of tool.dependencies || []) {
    assert(libraryNames.has(dep), `${where} depends on unknown library "${dep}"`);
  }
}

// Categories cover exactly the 47 tool ids, once each, and agree with each
// tool's own `category` field.
const idsFromCategories = categories.flatMap((c) => c.toolIds);
const dupCatMembership = [...new Set(idsFromCategories.filter((id, i) => idsFromCategories.indexOf(id) !== i))];
assert(dupCatMembership.length === 0, `Tool ids listed in more than one category: ${dupCatMembership.join(', ')}`);
assert(idsFromCategories.length === 47, `Categories list ${idsFromCategories.length} tool ids, expected 47.`);
for (const category of categories) {
  for (const id of category.toolIds) {
    const tool = tools.find((t) => t.id === id);
    assert(tool, `Category "${category.id}" lists unknown tool "${id}"`);
    if (tool) assert(tool.category === category.id, `Tool "${id}" has category "${tool.category}" but is listed under "${category.id}"`);
  }
}

// ---- 2. No drift vs app.js (runtime config) ---------------------------------

const appTools = pickLiteral(appSource, 'const tools = ', '\n];');
const appCategories = pickLiteral(appSource, 'const toolCategories = ', '\n];');
const appDeps = pickLiteral(appSource, 'const toolLibraryDependencies = ', '\n});');
const appLibraries = pickLiteral(appSource, 'const converterLibraries = ', '\n});');

const appToolById = new Map(appTools.map((t) => [t.id, t]));
for (const tool of tools) {
  const a = appToolById.get(tool.id);
  if (!a) { failures.push(`Catalogue tool "${tool.id}" is not present in app.js`); continue; }
  for (const [field, appField] of [['title', 'title'], ['description', 'description'], ['kicker', 'kicker'], ['badge', 'badge']]) {
    assert(tool[field] === a[appField], `Tool "${tool.id}" ${field} differs from app.js ("${tool[field]}" vs "${a[appField]}")`);
  }
  assert(tool.icon.bg === a.iconBg, `Tool "${tool.id}" icon.bg differs from app.js iconBg`);
  assert(tool.icon.color === a.iconColor, `Tool "${tool.id}" icon.color differs from app.js iconColor`);
  const appToolDeps = appDeps[tool.id] || [];
  assert(JSON.stringify(tool.dependencies) === JSON.stringify(appToolDeps), `Tool "${tool.id}" dependencies differ from app.js (${JSON.stringify(tool.dependencies)} vs ${JSON.stringify(appToolDeps)})`);
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

for (const [name, lib] of Object.entries(libraries)) {
  const a = appLibraries[name];
  assert(a, `Catalogue library "${name}" is not present in app.js converterLibraries`);
  if (a) {
    assert(lib.src === a.src, `Library "${name}" src differs from app.js`);
    assert((lib.css || null) === (a.css || null), `Library "${name}" css differs from app.js`);
  }
}

// ---- 3. Tool-id parity vs layout.js (display values legitimately differ) -----

const layoutTools = pickLiteral(layoutSource, 'const tools = ', '\n    ];');
const layoutIds = new Set(layoutTools.map((t) => t.id));
for (const tool of tools) assert(layoutIds.has(tool.id), `Tool "${tool.id}" is missing from layout.js`);
for (const id of layoutIds) assert(tools.find((t) => t.id === id), `layout.js tool "${id}" is missing from the catalogue`);

// ---- Report -----------------------------------------------------------------

if (failures.length) {
  console.error(`Tool catalogue validation failed:\n- ${failures.join('\n- ')}`);
  process.exit(1);
}

console.log('Tool catalogue validation passed:');
console.log(`- ${tools.length} tools, unique ids, all required fields present`);
console.log(`- ${categories.length} categories cover all 47 tools once; routes and guide URLs derive correctly`);
console.log(`- every dependency resolves to one of ${libraryNames.size} known libraries`);
console.log('- catalogue matches app.js runtime config (tools, categories, dependencies, libraries) — no drift');
console.log('- tool ids are in parity with layout.js');
