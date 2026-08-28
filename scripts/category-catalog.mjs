import { nav } from '../data/tools.mjs';
import { categoryPages } from '../data/category-pages.mjs';
import { guideSlugForTool } from './guide-catalog.mjs';

// Shared derivation of the "which hub does a tool belong to" relationship used
// by the category pages, breadcrumbs and the runtime catalogue. Membership is
// sourced from nav.groups (the header taxonomy) plus each hub's extraToolIds, so
// there is a single source of truth. validate-category-pages proves the mapping
// covers every catalogue tool exactly once.

const navGroupByName = new Map(nav.groups.map((group) => [group.name, group]));

const navigationCategoryOrder = ['pdf-tools', 'image-tools', 'convert-office', 'developer-tools'];

export function buildNavigationCategories() {
  return navigationCategoryOrder.map((slug) => {
    const category = categoryPages.find((page) => page.slug === slug);
    const group = navGroupByName.get(category.navGroup);
    const toolIds = [...(group?.toolIds || []), ...(category.extraToolIds || [])];
    return {
      ...category.navigation,
      hubPath: `/category/${category.slug}`,
      toolIds
    };
  });
}

// toolId -> { slug, h1 } of the category hub that owns it.
export function buildToolHubMap() {
  const map = new Map();
  for (const category of categoryPages) {
    const group = navGroupByName.get(category.navGroup);
    const ids = [...(group ? group.toolIds : []), ...(category.extraToolIds || [])];
    for (const id of ids) {
      map.set(id, { slug: category.slug, h1: category.h1 });
    }
  }
  return map;
}

// guideSlug -> toolId (reverse of guideSlugForTool), so a guide file can find
// its owning tool and hub.
export function buildGuideToolMap(toolIds) {
  const map = new Map();
  for (const id of toolIds) map.set(guideSlugForTool(id), id);
  return map;
}
