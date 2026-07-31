import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const siteUrl = 'https://www.weconvertfiles.com';
const redirectedHost = ['https://', 'weconvertfiles.com'].join('');
const failures = [];

function check(condition, message) {
  if (!condition) failures.push(message);
}

async function collectFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.name === '.git') continue;
    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...await collectFiles(entryPath));
    } else if (/\.(?:html|js|mjs|xml|txt)$/.test(entry.name)) {
      files.push(entryPath);
    }
  }

  return files;
}

const files = await collectFiles(rootDir);
for (const file of files) {
  const contents = await readFile(file, 'utf8');
  check(
    !contents.includes(redirectedHost),
    `${path.relative(rootDir, file)} still contains the redirected non-www host`,
  );
}

const sitemap = await readFile(path.join(rootDir, 'sitemap.xml'), 'utf8');
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
check(sitemapUrls.length === 106, `expected 106 sitemap URLs, found ${sitemapUrls.length}`);
check(sitemapUrls.length === new Set(sitemapUrls).size, 'sitemap contains duplicate URLs');

for (const url of sitemapUrls) {
  check(url === siteUrl || url.startsWith(`${siteUrl}/`), `sitemap URL uses the wrong host: ${url}`);
  check(!url.endsWith('/index.html'), `sitemap contains an index.html URL: ${url}`);
}

const informationPages = ['about', 'contact', 'privacy', 'terms'];
for (const page of informationPages) {
  const html = await readFile(path.join(rootDir, `${page}.html`), 'utf8');
  const canonical = `${siteUrl}/${page}`;
  check(
    html.includes(`<link rel="canonical" href="${canonical}"`),
    `${page}.html: canonical does not match its clean public URL`,
  );
  check(
    html.includes(`<meta property="og:url" content="${canonical}"`),
    `${page}.html: og:url does not match its clean public URL`,
  );
  check(sitemapUrls.includes(canonical), `${page}: clean canonical URL is missing from sitemap`);
  check(!sitemapUrls.includes(`${canonical}.html`), `${page}: redirected .html URL remains in sitemap`);
}

const indexHtml = await readFile(path.join(rootDir, 'index.html'), 'utf8');
check(
  indexHtml.includes(`<link rel="canonical" href="${siteUrl}/"`),
  'index.html: homepage canonical is not the www URL',
);
check(
  indexHtml.includes(`canonicalUrl = \`${siteUrl}/\${tool.id}\``),
  'index.html: dynamic tool canonical does not use the www URL',
);

const robots = await readFile(path.join(rootDir, 'robots.txt'), 'utf8');
check(
  robots.includes(`Sitemap: ${siteUrl}/sitemap.xml`),
  'robots.txt does not reference the canonical www sitemap',
);

if (failures.length) {
  console.error('Canonical URL validation failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Canonical URL validation passed.');
console.log(`- ${sitemapUrls.length} unique sitemap URLs use ${siteUrl}`);
console.log('- canonical, OpenGraph, robots, and information-page paths agree');
