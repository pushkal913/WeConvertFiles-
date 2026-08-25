import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { tools } from './catalogue.mjs';
import { guideSlugForTool } from './guide-catalog.mjs';

// Route / catalogue integrity: proves that for every catalogue tool the
// implementation module, generated tool page, public route, canonical URL,
// guide and sitemap entry all agree — and that no public route (rewrite or
// legacy redirect) points at a missing file or breaks a canonical route.
//
// This is the deployment gate: a broken tool addition (missing page, absent
// route, wrong canonical, dangling redirect) fails here with an actionable
// message before it ships.

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const siteUrl = 'https://www.weconvertfiles.com';

const redirectsSource = readFileSync(path.join(rootDir, '_redirects'), 'utf8');
const sitemap = readFileSync(path.join(rootDir, 'sitemap.xml'), 'utf8');

const failures = [];
const fail = (message) => failures.push(message);

// Parse `_redirects` (skip comments/blanks): `from  to  status`.
const rules = [];
for (const line of redirectsSource.split('\n')) {
  const t = line.trim();
  if (!t || t.startsWith('#')) continue;
  const parts = t.split(/\s+/);
  if (parts.length < 3) continue;
  rules.push({ from: parts[0], to: parts[1], status: parseInt(parts[2], 10) });
}
const rewrites = new Map(rules.filter((r) => r.status === 200).map((r) => [r.from, r.to]));

const fileExists = (urlPath) => {
  const clean = urlPath.split('?')[0].split('#')[0];
  const abs = path.resolve(rootDir, '.' + clean);
  return abs.startsWith(rootDir) && existsSync(abs) && !abs.endsWith(path.sep);
};

// Does a public URL path resolve to a real file, the way the host serves it:
// a direct file, a 200 rewrite target, a pretty-URL `.html`, or the root index.
function resolvesToFile(urlPath, seen = new Set()) {
  const clean = urlPath.split('?')[0].split('#')[0];
  if (seen.has(clean)) return false;
  seen.add(clean);
  if (clean === '/') return existsSync(path.join(rootDir, 'index.html'));
  if (fileExists(clean)) return true;
  if (rewrites.has(clean)) return resolvesToFile(rewrites.get(clean), seen);
  if (!path.extname(clean)) {
    if (fileExists(clean.replace(/\/$/, '') + '.html')) return true;
    if (fileExists(clean.replace(/\/$/, '') + '/index.html')) return true;
  }
  return false;
}

// ---- 1. Per-tool integrity ---------------------------------------------------

const canonicalRoutes = new Set();
for (const tool of tools) {
  const where = `tool "${tool.id}"`;
  const route = tool.route; // e.g. /bulk-resize
  canonicalRoutes.add(route);
  const toolPageRel = `tool-pages/${tool.id}.html`;

  // 1. implementation module exists
  if (!existsSync(path.join(rootDir, tool.module))) {
    fail(`${where}: implementation module "${tool.module}" does not exist.`);
  }
  // 2. generated tool page exists
  const hasPage = existsSync(path.join(rootDir, toolPageRel));
  if (!hasPage) fail(`${where}: generated page ${toolPageRel} is missing.`);
  // 3. public route present (200 rewrite to the tool page)
  if (rewrites.get(route) !== `/${toolPageRel}`) {
    fail(`${where}: _redirects is missing "${route}    /${toolPageRel}    200".`);
  }
  // 4. canonical matches the route
  if (hasPage) {
    const html = readFileSync(path.join(rootDir, toolPageRel), 'utf8');
    const expected = `<link rel="canonical" href="${siteUrl}${route}" />`;
    if (!html.includes(expected)) {
      fail(`${where}: canonical in ${toolPageRel} does not match ${siteUrl}${route}.`);
    }
  }
  // 5. guide exists
  const guideRel = `guides/${guideSlugForTool(tool.id)}.html`;
  if (!existsSync(path.join(rootDir, guideRel))) {
    fail(`${where}: guide ${guideRel} is missing (catalogue guide is ${tool.guide}).`);
  }
  // 6. sitemap includes the route and the guide
  if (!sitemap.includes(`<loc>${siteUrl}${route}</loc>`)) {
    fail(`${where}: route ${siteUrl}${route} is missing from sitemap.xml.`);
  }
  if (!sitemap.includes(`<loc>${siteUrl}/${guideRel}</loc>`)) {
    fail(`${where}: guide ${siteUrl}/${guideRel} is missing from sitemap.xml.`);
  }
}

// ---- 2. Route / redirect integrity ------------------------------------------

// Every rewrite and redirect target must resolve to a real file.
for (const rule of rules) {
  if (rule.status === 404) {
    if (!fileExists(rule.to)) fail(`redirect: 404 target "${rule.to}" does not exist.`);
    continue;
  }
  if (rule.from === '/*') continue;
  if (!resolvesToFile(rule.to)) {
    fail(`redirect: "${rule.from}" -> "${rule.to}" (${rule.status}) points at a target that does not resolve to a file.`);
  }
}

// Legacy 301s must not shadow a live canonical route (that would redirect the
// canonical URL away from itself).
for (const rule of rules) {
  if (rule.status === 301 && canonicalRoutes.has(rule.from)) {
    fail(`redirect: legacy 301 "${rule.from}" collides with a tool's canonical route — visiting the canonical would redirect away.`);
  }
}

// ---- Report -----------------------------------------------------------------

if (failures.length) {
  console.error(`Route/catalogue integrity validation failed:\n- ${failures.join('\n- ')}`);
  process.exit(1);
}

console.log('Route/catalogue integrity validation passed:');
console.log(`- ${tools.length} tools: implementation module, tool page, public route, canonical, guide and sitemap entry all agree`);
console.log(`- ${rules.filter((r) => r.status === 200).length} rewrites and ${rules.filter((r) => r.status === 301).length} legacy redirects resolve to real files`);
console.log('- no legacy redirect shadows a canonical tool route');
