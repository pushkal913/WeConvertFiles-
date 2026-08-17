export const GUIDE_SLUG_OVERRIDES = Object.freeze({
  'images-pdf': 'images-to-pdf',
  'pdf-images': 'pdf-to-images',
  'pdf-jpg': 'pdf-to-jpg'
});

function requiredBlock(source, startText, endText) {
  const start = source.indexOf(startText);
  const end = source.indexOf(endText, start);
  if (start < 0 || end < 0) {
    throw new Error(`Could not find catalogue block: ${startText}`);
  }
  return source.slice(start, end);
}

export function parseToolCatalogue(appSource) {
  const toolsBlock = requiredBlock(appSource, 'const tools = [', '\n];');
  const tools = [...toolsBlock.matchAll(/\{\s*id: '([^']+)',\s*title: '([^']+)',/g)]
    .map((match) => ({ id: match[1], title: match[2] }));

  const categoriesStart = appSource.indexOf('const toolCategories = [');
  const categoriesBlock = requiredBlock(appSource.slice(categoriesStart), 'const toolCategories = [', '\n];');
  const categories = [...categoriesBlock.matchAll(/\{\s*id: '([^']+)',\s*title: '([^']+)',(?:\s*rgb: '([^']+)',)?[\s\S]*?tools: \[([^\]]+)\]\s*\n\s*\}/g)]
    .map((match) => ({
      id: match[1],
      title: match[2],
      rgb: match[3] || '37, 99, 235',
      toolIds: [...match[4].matchAll(/'([^']+)'/g)].map((toolMatch) => toolMatch[1])
    }));

  if (!tools.length || !categories.length) {
    throw new Error('Tool catalogue parsing returned no tools or categories.');
  }

  return { tools, categories };
}

export function guideSlugForTool(toolId) {
  return GUIDE_SLUG_OVERRIDES[toolId] || toolId;
}

export function guideHrefForTool(toolId) {
  return `/guides/${guideSlugForTool(toolId)}.html`;
}
