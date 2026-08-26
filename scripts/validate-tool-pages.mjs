import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const siteUrl = 'https://www.weconvertfiles.com';
const appSource = await readFile(path.join(rootDir, 'app.js'), 'utf8');
const redirects = await readFile(path.join(rootDir, '_redirects'), 'utf8');
const sitemap = await readFile(path.join(rootDir, 'sitemap.xml'), 'utf8');
const toolsBlockStart = appSource.indexOf('const tools = [');
const toolsBlockEnd = appSource.indexOf('\n];', toolsBlockStart);
const toolsBlock = appSource.slice(toolsBlockStart, toolsBlockEnd);
const tools = [...toolsBlock.matchAll(/\{\s*id: '([^']+)',\s*title: '([^']+)',/g)].map((match) => ({ id: match[1], title: match[2] }));

const check = (condition, message) => {
  if (!condition) throw new Error(message);
};

check(tools.length === 47, `expected 47 tools, found ${tools.length}`);
check(new Set(tools.map((tool) => tool.id)).size === tools.length, 'tool IDs must be unique');

for (const tool of tools) {
  const html = await readFile(path.join(rootDir, 'tool-pages', `${tool.id}.html`), 'utf8');
  const canonical = `${siteUrl}/${tool.id}`;
  check(html.includes(`<html lang="en" data-tool-id="${tool.id}" data-initial-view="tool">`), `${tool.id}: missing static route data`);
  check(html.includes(`<link rel="canonical" href="${canonical}" />`), `${tool.id}: canonical mismatch`);
  check(html.includes(`<meta property="og:url" content="${canonical}" />`), `${tool.id}: OpenGraph URL mismatch`);
  check(html.includes(`<h1 id="workspaceTitle"`), `${tool.id}: missing tool H1`);
  check(!html.includes('<h1 id="workspaceTitle" class="mt-1 text-2xl font-semibold tracking-tight text-slate-950 dark:text-slate-100 sm:text-3xl"></h1>'), `${tool.id}: empty tool H1`);
  check(html.includes('<script src="/js/catalogue.js?v=20260824-1"></script>'), `${tool.id}: missing runtime catalogue script`);
  check(html.includes('<script src="/app.js?v=20260824-4"></script>'), `${tool.id}: missing shared app script`);
  check(html.indexOf('/js/catalogue.js') < html.indexOf('/app.js'), `${tool.id}: catalogue.js must load before app.js`);
  check(redirects.includes(`/${tool.id}    /tool-pages/${tool.id}.html    200`), `${tool.id}: route does not use generated page`);
  check(sitemap.includes(`<loc>${canonical}</loc>`), `${tool.id}: canonical missing from sitemap`);
}

console.log('Tool page validation passed:');
console.log(`- ${tools.length} tool routes have server-rendered metadata and headings`);
console.log('- clean canonicals, social metadata, shared app loading, rewrites, and sitemap entries agree');
