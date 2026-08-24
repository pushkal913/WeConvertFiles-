import { tools, categories, libraries } from '../data/tools.mjs';
import { guideSlugForTool } from './guide-catalog.mjs';

// Load-and-validate entry point for the authoritative tool catalogue
// (data/tools.mjs). Build scripts import the data from here and call
// assertValidCatalogue() so a malformed catalogue fails the build with a clear
// message instead of silently emitting broken pages.
//
// These are structural/self-consistency checks on the catalogue alone. The
// cross-check that app.js and layout.js still match the catalogue lives in
// validate-catalogue.mjs.

export { tools, categories, libraries };

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
    if (tool.id && tool.guide !== `/guides/${guideSlugForTool(tool.id)}.html`) {
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
