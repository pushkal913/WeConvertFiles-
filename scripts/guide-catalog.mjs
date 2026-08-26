import { tools as catalogueTools, categories as catalogueCategories } from '../data/tools.mjs';

// Guide slug overrides: a few tool ids map to a differently-named guide file
// (the tool route keeps the short id, the guide uses the fuller name). This is a
// stable transformation rule; the catalogue's `guide` field is derived from it
// and validate-catalogue.mjs enforces they agree.
export const GUIDE_SLUG_OVERRIDES = Object.freeze({
  'images-pdf': 'images-to-pdf',
  'pdf-images': 'pdf-to-images',
  'pdf-jpg': 'pdf-to-jpg'
});

// Tool identity + category grouping the guide generators need, sourced from the
// authoritative catalogue (data/tools.mjs) rather than parsed out of app.js.
export function parseToolCatalogue() {
  const tools = catalogueTools.map((tool) => ({
    id: tool.id,
    title: tool.title,
    description: tool.description
  }));
  const categories = catalogueCategories.map((category) => ({
    id: category.id,
    title: category.title,
    rgb: category.rgb,
    toolIds: category.toolIds
  }));

  if (!tools.length || !categories.length) {
    throw new Error('Tool catalogue is empty.');
  }

  return { tools, categories };
}

export function guideSlugForTool(toolId) {
  return GUIDE_SLUG_OVERRIDES[toolId] || toolId;
}

export function guideHrefForTool(toolId) {
  // Clean canonical guide URL. Netlify serves guides/<slug>.html at this path
  // via a 200 rewrite; the .html variant 301s here (see _redirects).
  return `/guides/${guideSlugForTool(toolId)}`;
}
