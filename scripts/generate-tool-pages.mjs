import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { tools as catalogueTools, assertValidCatalogue } from './catalogue.mjs';
import { breadcrumbNav, breadcrumbListJsonLd } from './breadcrumbs.mjs';
import { buildToolHubMap } from './category-catalog.mjs';
import { renderFactBlock } from './tool-facts-render.mjs';
import { relatedToolIds } from './related.mjs';
import { guideSlugForTool } from './guide-catalog.mjs';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputDir = path.join(rootDir, 'tool-pages');
const siteUrl = 'https://www.weconvertfiles.com';
const shell = await readFile(path.join(rootDir, 'index.html'), 'utf8');

// Tool metadata comes from the authoritative catalogue (data/tools.mjs). Fail
// the build with a clear message if the catalogue is structurally invalid,
// rather than emitting broken pages.
assertValidCatalogue();

const tools = catalogueTools.map((tool) => ({
  id: tool.id,
  title: tool.title,
  kicker: tool.kicker,
  badge: tool.badge,
  description: tool.description
}));

const titleById = new Map(tools.map((tool) => [tool.id, tool.title]));
const toolHubMap = buildToolHubMap();

// Home > category hub > tool. Every tool belongs to exactly one hub
// (validate-category-pages enforces coverage), so the middle crumb is always
// a real category route.
const breadcrumbTrail = (tool) => {
  const hub = toolHubMap.get(tool.id);
  if (!hub) throw new Error(`tool "${tool.id}" has no category hub for its breadcrumb.`);
  return [
    { name: 'Home', href: '/' },
    { name: hub.h1, href: `/category/${hub.slug}` },
    { name: tool.title, href: `/${tool.id}` }
  ];
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
  const trail = breadcrumbTrail(tool);
  const structuredData = JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
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
      },
      breadcrumbListJsonLd(trail)
    ]
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
  html = replaceMeta(
    html,
    /<div id="toolBreadcrumb"><\/div>/,
    `<div id="toolBreadcrumb">\n${breadcrumbNav(trail, { indent: '          ' })}\n        </div>`,
    'tool breadcrumb'
  );
  html = replaceMeta(
    html,
    /<div id="toolFactBlock"><\/div>/,
    `<div id="toolFactBlock">\n${renderFactBlock(tool.id, { indent: '              ' })}\n            </div>`,
    'tool fact block'
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
  const relatedTabs = relatedToolIds(tool.id)
    .map((id) => `<a class="related-tab" href="/${id}"><span class="related-tab-dot"></span>${escapeHtml(titleById.get(id) || id)}</a>`)
    .join('\n                  ');
  html = replaceMeta(
    html,
    /<div id="relatedToolsGrid"([^>]*)><\/div>/,
    `<div id="relatedToolsGrid"$1>\n                  ${relatedTabs}\n                </div>`,
    'related tools'
  );
  // Contextual link to this tool's own in-depth guide (canonical guide route).
  const guideHref = `/guides/${guideSlugForTool(tool.id)}`;
  html = replaceMeta(
    html,
    /<p id="toolGuideLink"([^>]*)><\/p>/,
    `<p id="toolGuideLink"$1><a class="font-semibold text-[#1a73e8] hover:underline" href="${guideHref}">Read the ${escapeHtml(tool.title)} guide <span aria-hidden="true">→</span></a></p>`,
    'tool guide link'
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
