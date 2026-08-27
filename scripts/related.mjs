import { tools, categories, nav } from '../data/tools.mjs';
import { categoryPages } from '../data/category-pages.mjs';
import { buildToolHubMap } from './category-catalog.mjs';

// Single source for "related tools" — genuinely relevant alternatives only.
// A tool's related list is its catalogue-category siblings first, then the rest
// of its navigation hub. It never falls back to unrelated tools in another hub,
// so a small category no longer pads its related list with random tools.

const catByTool = new Map();
for (const c of categories) for (const id of c.toolIds) catByTool.set(id, c);

const hubOf = buildToolHubMap(); // toolId -> { slug, h1 }
const navByName = new Map(nav.groups.map((g) => [g.name, g]));
const hubTools = new Map(); // hub slug -> ordered tool ids
for (const cp of categoryPages) {
  const group = navByName.get(cp.navGroup);
  hubTools.set(cp.slug, [...(group ? group.toolIds : []), ...(cp.extraToolIds || [])]);
}

const validId = new Set(tools.map((t) => t.id));

export function relatedToolIds(toolId, limit = 6) {
  const cat = catByTool.get(toolId);
  const catSiblings = cat ? cat.toolIds.filter((id) => id !== toolId) : [];
  const hub = hubOf.get(toolId);
  const hubSiblings = hub
    ? (hubTools.get(hub.slug) || []).filter((id) => id !== toolId && !catSiblings.includes(id))
    : [];
  return [...catSiblings, ...hubSiblings].filter((id) => validId.has(id)).slice(0, limit);
}
