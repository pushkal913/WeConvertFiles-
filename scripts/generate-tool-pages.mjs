import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputDir = path.join(rootDir, 'tool-pages');
const siteUrl = 'https://www.weconvertfiles.com';
const shell = await readFile(path.join(rootDir, 'index.html'), 'utf8');
const appSource = await readFile(path.join(rootDir, 'app.js'), 'utf8');
const toolsBlockStart = appSource.indexOf('const tools = [');
const toolsBlockEnd = appSource.indexOf('\n];', toolsBlockStart);

if (toolsBlockStart === -1 || toolsBlockEnd === -1) {
  throw new Error('Could not locate the tools catalog in app.js.');
}

const toolsBlock = appSource.slice(toolsBlockStart, toolsBlockEnd);
const toolPattern = /\{\s*id: '([^']+)',\s*title: '([^']+)',[\s\S]*?kicker: '([^']+)',\s*badge: '([^']+)',[\s\S]*?description: '((?:\\'|[^'])*)',/g;
const tools = [...toolsBlock.matchAll(toolPattern)].map((match) => ({
  id: match[1],
  title: match[2],
  kicker: match[3],
  badge: match[4],
  description: match[5].replaceAll("\\'", "'")
}));

if (tools.length !== 47) {
  throw new Error(`Expected 47 tools in app.js, found ${tools.length}.`);
}

// Parse the category -> tools mapping so related-tool links stay in sync with app.js.
const categoryBlockStart = appSource.indexOf('const toolCategories = [');
const categoryBlockEnd = appSource.indexOf('\n];', categoryBlockStart);
if (categoryBlockStart === -1 || categoryBlockEnd === -1) {
  throw new Error('Could not locate the toolCategories catalog in app.js.');
}
const categoryBlock = appSource.slice(categoryBlockStart, categoryBlockEnd);
const categoryToolLists = [...categoryBlock.matchAll(/tools:\s*\[([^\]]*)\]/g)]
  .map((match) => match[1].split(',').map((id) => id.trim().replace(/^'|'$/g, '')).filter(Boolean));

const titleById = new Map(tools.map((tool) => [tool.id, tool.title]));
const allToolIds = tools.map((tool) => tool.id);

// Same-category siblings first, then top up to six for broad interconnection.
const getRelatedIds = (toolId) => {
  const category = categoryToolLists.find((list) => list.includes(toolId)) || [];
  const siblings = category.filter((id) => id !== toolId);
  const others = allToolIds.filter((id) => id !== toolId && !siblings.includes(id));
  return [...siblings, ...others].slice(0, 6);
};

const escapeHtml = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#39;');

const replaceMeta = (html, selectorPattern, replacement, label) => {
  const next = html.replace(selectorPattern, replacement);
  if (next === html) throw new Error(`Could not replace ${label}.`);
  return next;
};

const renderToolPage = (tool) => {
  const url = `${siteUrl}/${tool.id}`;
  const title = `${tool.title} Online - Private & Free | WeConvertFiles`;
  const description = `${tool.description} Free and private in your browser—file contents are not uploaded for conversion.`;
  const structuredData = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: tool.title,
    url,
    description: tool.description,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    isAccessibleForFree: true,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    }
  }, null, 2).replaceAll('<', '\\u003c');

  let html = shell;
  html = replaceMeta(html, '<html lang="en">', `<html lang="en" data-tool-id="${tool.id}" data-initial-view="tool">`, 'html tool attributes');
  html = replaceMeta(html, /<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(title)}</title>`, 'title');
  html = replaceMeta(html, /<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${escapeHtml(description)}" />`, 'description');
  html = replaceMeta(html, /<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${url}" />`, 'canonical');
  html = replaceMeta(html, /<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${escapeHtml(title)}" />`, 'OpenGraph title');
  html = replaceMeta(html, /<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${escapeHtml(description)}" />`, 'OpenGraph description');
  html = replaceMeta(html, /<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${url}" />`, 'OpenGraph URL');
  html = replaceMeta(html, /<meta name="twitter:title" content="[^"]*" \/>/, `<meta name="twitter:title" content="${escapeHtml(title)}" />`, 'Twitter title');
  html = replaceMeta(html, /<meta name="twitter:description" content="[^"]*" \/>/, `<meta name="twitter:description" content="${escapeHtml(description)}" />`, 'Twitter description');
  html = replaceMeta(
    html,
    /<script type="application\/ld\+json">[\s\S]*?<\/script>/,
    `<script type="application/ld+json">\n${structuredData}\n  </script>`,
    'structured data'
  );
  html = replaceMeta(html, /<p id="workspaceKicker"([^>]*)><\/p>/, `<p id="workspaceKicker"$1>${escapeHtml(tool.kicker)}</p>`, 'workspace kicker');
  html = replaceMeta(html, /<h1 id="workspaceTitle"([^>]*)><\/h1>/, `<h1 id="workspaceTitle"$1>${escapeHtml(tool.title)}</h1>`, 'workspace title');
  html = replaceMeta(html, /<p id="workspaceDescription"([^>]*)><\/p>/, `<p id="workspaceDescription"$1>${escapeHtml(tool.description)}</p>`, 'workspace description');
  html = replaceMeta(html, /<span id="workspaceBadge"([^>]*)><\/span>/, `<span id="workspaceBadge"$1>${escapeHtml(tool.badge)}</span>`, 'workspace badge');
  html = replaceMeta(html, /<h2 id="seoHowToTitle"([^>]*)><\/h2>/, `<h2 id="seoHowToTitle"$1>How ${escapeHtml(tool.title)} works</h2>`, 'SEO heading');
  html = replaceMeta(
    html,
    /<div id="seoHowToContent"([^>]*)><\/div>/,
    `<div id="seoHowToContent"$1><p>${escapeHtml(tool.description)} The supported processing runs locally in your browser.</p></div>`,
    'SEO summary'
  );
  const relatedTabs = getRelatedIds(tool.id)
    .map((id) => `<a class="related-tab" href="/${id}"><span class="related-tab-dot"></span>${escapeHtml(titleById.get(id) || id)}</a>`)
    .join('\n                  ');
  html = replaceMeta(
    html,
    /<div id="relatedToolsGrid"([^>]*)><\/div>/,
    `<div id="relatedToolsGrid"$1>\n                  ${relatedTabs}\n                </div>`,
    'related tools'
  );
  return html;
};

await mkdir(outputDir, { recursive: true });
for (const tool of tools) {
  await writeFile(path.join(outputDir, `${tool.id}.html`), renderToolPage(tool), 'utf8');
}

const redirectsPath = path.join(rootDir, '_redirects');
let redirects = await readFile(redirectsPath, 'utf8');
for (const tool of tools) {
  const routePattern = new RegExp(`^/${tool.id}\\s+/index\\.html\\s+200$`, 'm');
  const generatedPattern = new RegExp(`^/${tool.id}\\s+/tool-pages/${tool.id}\\.html\\s+200$`, 'm');
  if (routePattern.test(redirects)) {
    redirects = redirects.replace(routePattern, `/${tool.id}    /tool-pages/${tool.id}.html    200`);
  } else if (!generatedPattern.test(redirects)) {
    throw new Error(`Missing rewrite for /${tool.id}.`);
  }
}
await writeFile(redirectsPath, redirects, 'utf8');

console.log(`Generated ${tools.length} server-rendered tool pages in ${outputDir}.`);
