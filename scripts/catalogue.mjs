import { tools, categories, libraries, nav } from '../data/tools.mjs';
import { buildToolHubMap } from './category-catalog.mjs';
import { breadcrumbNav } from './breadcrumbs.mjs';
import { renderFactBlock } from './tool-facts-render.mjs';
import { relatedToolIds } from './related.mjs';
import { guideSlugForTool } from './guide-catalog.mjs';

// Load-and-validate entry point for the authoritative tool catalogue
// (data/tools.mjs). Build scripts import the data from here and call
// assertValidCatalogue() so a malformed catalogue fails the build with a clear
// message instead of silently emitting broken pages.
//
// These are structural/self-consistency checks on the catalogue alone. The
// cross-check that app.js and layout.js still match the catalogue lives in
// validate-catalogue.mjs.

export { tools, categories, libraries, nav };

// Render the runtime dependency data (js/catalogue.js) from the catalogue: the
// library CDN sources/css and the per-tool dependency lists, exposed to the
// classic-script app as window.WCF_CATALOGUE. The library ready-checks are
// detection code and stay in app.js. Deterministic — generator and validator
// both use this so the file can't drift from data/tools.mjs.
export function renderRuntimeCatalogue() {
  const dependencies = {};
  for (const tool of tools) {
    if (Array.isArray(tool.dependencies) && tool.dependencies.length) {
      dependencies[tool.id] = tool.dependencies;
    }
  }
  // Pre-rendered Home > category hub > tool breadcrumb per tool, from the same
  // component the static pages use, so the SPA can keep the visible breadcrumb
  // correct after a client-side tool switch without duplicating the markup.
  const hubMap = buildToolHubMap();
  const breadcrumbs = {};
  for (const tool of tools) {
    const hub = hubMap.get(tool.id);
    if (!hub) continue;
    const trail = [
      { name: 'Home', href: '/' },
      { name: hub.h1, href: `/category/${hub.slug}` },
      { name: tool.title, href: `/${tool.id}` }
    ];
    breadcrumbs[tool.id] = breadcrumbNav(trail, { indent: '' }).trim();
  }
  // Pre-rendered "Tool facts" block per tool, so the SPA keeps it correct after
  // a client-side tool switch (same renderer the static pages use).
  const factBlocks = {};
  for (const tool of tools) {
    factBlocks[tool.id] = renderFactBlock(tool.id).trim();
  }
  // Per-tool internal links: genuinely relevant related tools (same category,
  // then same hub — never unrelated) plus a direct link to the tool's guide.
  // Baked static pages and the SPA read the same map, so they never diverge.
  const related = {};
  for (const tool of tools) {
    related[tool.id] = {
      guide: `/guides/${guideSlugForTool(tool.id)}`,
      tools: relatedToolIds(tool.id)
    };
  }
  const payload = { libraries, dependencies, breadcrumbs, factBlocks, related };
  return `/* GENERATED FILE — do not edit.
   Source: data/tools.mjs via scripts/generate-catalogue-runtime.mjs
   (npm run generate:catalogue-runtime). Delivers the tool catalogue's library
   sources, per-tool dependencies, breadcrumbs and fact blocks to the runtime app. */
window.WCF_CATALOGUE = ${JSON.stringify(payload, null, 2)};
`;
}

const REQUIRED_STRING_FIELDS = ['id', 'title', 'description', 'kicker', 'badge', 'category', 'route', 'guide', 'module'];

// Returns an array of human-readable problems; empty means the catalogue is valid.
export function catalogueProblems() {
  const problems = [];

  if (!Array.isArray(tools) || tools.length === 0) {
    return ['catalogue has no tools'];
  }

  const ids = tools.map((t) => t.id);
  const duplicateIds = [...new Set(ids.filter((id, i) => ids.indexOf(id) !== i))];
  if (duplicateIds.length) problems.push(`duplicate tool ids: ${duplicateIds.join(', ')}`);

  const categoryIds = new Set(categories.map((c) => c.id));
  const libraryNames = new Set(Object.keys(libraries));

  for (const tool of tools) {
    const where = `tool "${tool.id || '(no id)'}"`;
    for (const field of REQUIRED_STRING_FIELDS) {
      if (typeof tool[field] !== 'string' || tool[field].length === 0) {
        problems.push(`${where} is missing required field "${field}"`);
      }
    }
    if (!tool.icon || typeof tool.icon.bg !== 'string' || typeof tool.icon.color !== 'string') {
      problems.push(`${where} is missing icon.bg / icon.color`);
    }
    if (tool.id && tool.route !== `/${tool.id}`) {
      problems.push(`${where} route "${tool.route}" should be "/${tool.id}"`);
    }
    if (tool.id && tool.guide !== `/guides/${guideSlugForTool(tool.id)}`) {
      problems.push(`${where} guide "${tool.guide}" does not match its slug rule`);
    }
    if (!categoryIds.has(tool.category)) {
      problems.push(`${where} references unknown category "${tool.category}"`);
    }
    if (!Array.isArray(tool.dependencies)) {
      problems.push(`${where} dependencies must be an array`);
    } else {
      for (const dep of tool.dependencies) {
        if (!libraryNames.has(dep)) problems.push(`${where} depends on unknown library "${dep}"`);
      }
    }
  }

  // Categories must cover every tool id exactly once and agree with each tool's
  // own `category` field.
  const idsFromCategories = categories.flatMap((c) => c.toolIds);
  const dupMembership = [...new Set(idsFromCategories.filter((id, i) => idsFromCategories.indexOf(id) !== i))];
  if (dupMembership.length) problems.push(`tool ids listed in more than one category: ${dupMembership.join(', ')}`);
  if (idsFromCategories.length !== tools.length) {
    problems.push(`categories list ${idsFromCategories.length} tool ids, expected ${tools.length}`);
  }
  for (const category of categories) {
    for (const id of category.toolIds) {
      const tool = tools.find((t) => t.id === id);
      if (!tool) problems.push(`category "${category.id}" lists unknown tool "${id}"`);
      else if (tool.category !== category.id) {
        problems.push(`tool "${id}" has category "${tool.category}" but is listed under "${category.id}"`);
      }
    }
  }

  return problems;
}

// Throws with a clear, aggregated message if the catalogue is structurally invalid.
export function assertValidCatalogue() {
  const problems = catalogueProblems();
  if (problems.length) {
    throw new Error(`Invalid tool catalogue (data/tools.mjs):\n- ${problems.join('\n- ')}`);
  }
}
