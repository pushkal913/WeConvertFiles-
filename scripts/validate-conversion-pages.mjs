import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const siteUrl = 'https://www.weconvertfiles.com';
const pages = [
  ['jpg-to-pdf', '/images-pdf'],
  ['png-to-pdf', '/images-pdf'],
  ['heic-to-jpg', '/heic-to-jpg'],
  ['word-to-pdf', '/office-pdf'],
  ['pdf-to-jpg', '/pdf-jpg']
];

const failures = [];
const titles = new Set();
const descriptions = new Set();

const count = (text, pattern) => (text.match(pattern) || []).length;
const check = (condition, message) => {
  if (!condition) failures.push(message);
};

for (const [slug, toolPath] of pages) {
  const filePath = path.join(rootDir, 'convert', `${slug}.html`);
  const html = await readFile(filePath, 'utf8');
  const canonical = `${siteUrl}/convert/${slug}`;

  check(count(html, /<title>/g) === 1, `${slug}: expected one title`);
  check(count(html, /<meta name="description"/g) === 1, `${slug}: expected one meta description`);
  check(count(html, /<link rel="canonical"/g) === 1, `${slug}: expected one canonical`);
  check(count(html, /<h1\b/g) === 1, `${slug}: expected one h1`);
  check(html.includes(`<link rel="canonical" href="${canonical}"`), `${slug}: canonical mismatch`);
  check(html.includes(`<meta property="og:url" content="${canonical}"`), `${slug}: og:url mismatch`);
  check(html.includes('<meta name="twitter:card" content="summary_large_image"'), `${slug}: missing Twitter card`);
  check(html.includes(`href="${toolPath}"`), `${slug}: missing converter link ${toolPath}`);
  check(html.includes(`href="/convert/`), `${slug}: missing related conversion link`);
  check(!html.includes('history.pushState'), `${slug}: page must not contain SPA routing logic`);

  const inlineScripts = [...html.matchAll(/<script(?![^>]*\bsrc=)(?![^>]*application\/ld\+json)[^>]*>([\s\S]*?)<\/script>/g)];
  for (const [, source] of inlineScripts) {
    try {
      Function(source);
    } catch (error) {
      failures.push(`${slug}: invalid inline JavaScript (${error.message})`);
    }
  }

  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  const description = html.match(/<meta name="description" content="([^"]+)"/)?.[1];
  check(Boolean(title) && !titles.has(title), `${slug}: duplicate or missing title`);
  check(Boolean(description) && !descriptions.has(description), `${slug}: duplicate or missing description`);
  check(Boolean(title) && title.length <= 60, `${slug}: title exceeds 60 characters`);
  check(Boolean(description) && description.length <= 160, `${slug}: description exceeds 160 characters`);
  if (title) titles.add(title);
  if (description) descriptions.add(description);

  const jsonText = html.match(/<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/)?.[1];
  check(Boolean(jsonText), `${slug}: missing JSON-LD`);
  if (jsonText) {
    try {
      const data = JSON.parse(jsonText);
      const graph = data['@graph'] || [];
      const faq = graph.find((item) => item['@type'] === 'FAQPage');
      const breadcrumb = graph.find((item) => item['@type'] === 'BreadcrumbList');
      const application = graph.find((item) => item['@type'] === 'SoftwareApplication');
      check(faq?.mainEntity?.length === 3, `${slug}: expected three FAQ entities`);
      check(breadcrumb?.itemListElement?.length === 2, `${slug}: invalid breadcrumb schema`);
      check(application?.offers?.price === '0', `${slug}: invalid application offer`);
      for (const entity of faq?.mainEntity || []) {
        check(html.includes(entity.name), `${slug}: FAQ question is not visible`);
        check(html.includes(entity.acceptedAnswer.text), `${slug}: FAQ answer is not visible`);
      }
    } catch (error) {
      failures.push(`${slug}: invalid JSON-LD (${error.message})`);
    }
  }
}

const redirects = await readFile(path.join(rootDir, '_redirects'), 'utf8');
const redirectSources = redirects
  .split(/\r?\n/)
  .map((line) => line.trim())
  .filter((line) => line && !line.startsWith('#'))
  .map((line) => line.split(/\s+/)[0]);
check(redirectSources.length === new Set(redirectSources).size, 'redirect file contains duplicate source rules');
for (const [slug] of pages) {
  check(redirects.includes(`/convert/${slug}.html    /convert/${slug}    301`), `${slug}: missing .html redirect`);
  check(redirects.includes(`/convert/${slug}    /convert/${slug}.html    200`), `${slug}: missing clean route rewrite`);
}
check(redirects.trimEnd().endsWith('/*    /404.html    404'), '404 catch-all must be the final redirect');

for (const toolPath of new Set(pages.map(([, pathName]) => pathName))) {
  check(redirects.includes(`${toolPath}    /index.html    200`), `existing tool route changed or missing: ${toolPath}`);
}

const sitemap = await readFile(path.join(rootDir, 'sitemap.xml'), 'utf8');
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
check(sitemapUrls.length === new Set(sitemapUrls).size, 'sitemap contains duplicate URLs');
check(sitemapUrls.length === 96, `expected 96 sitemap URLs, found ${sitemapUrls.length}`);
for (const [slug] of pages) {
  check(sitemapUrls.includes(`${siteUrl}/convert/${slug}`), `${slug}: missing from sitemap`);
}

const indexHtml = await readFile(path.join(rootDir, 'index.html'), 'utf8');
for (const [slug] of pages) {
  check(indexHtml.includes(`href="/convert/${slug}"`), `${slug}: missing homepage internal link`);
}

if (failures.length) {
  console.error(`Conversion page validation failed (${failures.length}):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Conversion page validation passed:');
console.log(`- ${pages.length} unique static pages`);
console.log('- valid FAQ, breadcrumb, and application JSON-LD');
console.log('- clean canonical routes and converter links');
console.log(`- ${sitemapUrls.length} unique sitemap URLs`);
console.log('- existing converter route mappings preserved');
