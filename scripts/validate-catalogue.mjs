import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { tools, categories, libraries, catalogueProblems } from './catalogue.mjs';

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
console.log(`- every dependency resolves to one of ${Object.keys(libraries).length} known libraries`);
console.log('- catalogue matches app.js runtime config (tools, categories, dependencies, libraries) — no drift');
console.log('- tool ids are in parity with layout.js');
