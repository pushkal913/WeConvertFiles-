import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { startServer } from './serve.mjs';

const defaultRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const rootFlag = process.argv.indexOf('--root');
const root = rootFlag >= 0 && process.argv[rootFlag + 1]
  ? path.resolve(process.argv[rootFlag + 1])
  : defaultRoot;
const failures = [];

function sitemapPaths(xml) {
  return [...xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)].map((match) => {
    const url = new URL(match[1]);
    return `${url.pathname}${url.search}`;
  });
}

function redirectRules(raw) {
  return raw.split(/\r?\n/).flatMap((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return [];
    const [from, to, statusText = '301'] = trimmed.split(/\s+/);
    const status = Number.parseInt(statusText, 10);
    return from && to ? [{ from, to, status }] : [];
  });
}

function anchorHrefs(html) {
  return [...html.matchAll(/<a\b[^>]*\bhref\s*=\s*(["'])(.*?)\1/gi)].map((match) => match[2]);
}

function hasFragment(html, fragment) {
  const decoded = decodeURIComponent(fragment);
  const escaped = decoded.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`\\b(?:id|name)\\s*=\\s*(["'])${escaped}\\1`, 'i').test(html);
}

async function generatedHtmlFiles(directory, relative = '') {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.git') continue;
    const childRelative = relative ? `${relative}/${entry.name}` : entry.name;
    const childAbsolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await generatedHtmlFiles(childAbsolute, childRelative));
    else if (entry.isFile() && entry.name.endsWith('.html')) files.push(childRelative);
  }
  return files;
}

function sourceBasePath(html, relativePath) {
  const canonical = html.match(/<link\b(?=[^>]*\brel\s*=\s*(["'])canonical\1)[^>]*\bhref\s*=\s*(["'])(.*?)\2/i);
  if (canonical) return new URL(canonical[3]).pathname;
  const normalized = relativePath.replaceAll('\\', '/');
  return normalized === 'index.html' ? '/' : `/${normalized}`;
}

function internalTarget(href, sourcePath) {
  if (/^(?:mailto|tel|javascript|data):/i.test(href)) return null;
  const url = new URL(href, `https://www.weconvertfiles.com${sourcePath}`);
  if (!['www.weconvertfiles.com', 'weconvertfiles.com'].includes(url.hostname)) return null;
  return url;
}

const server = await startServer({ root });
try {
  const sitemap = await readFile(path.join(root, 'sitemap.xml'), 'utf8');
  const redirects = redirectRules(await readFile(path.join(root, '_redirects'), 'utf8'));
  const legacyRedirects = new Map(
    redirects.filter((rule) => [301, 302].includes(rule.status) && !rule.from.includes('*'))
      .map((rule) => [rule.from, rule.to])
  );
  for (const source of legacyRedirects.keys()) {
    const chain = [source];
    const seen = new Set(chain);
    let current = source;
    while (legacyRedirects.has(current)) {
      const next = new URL(legacyRedirects.get(current), 'https://www.weconvertfiles.com').pathname;
      chain.push(next);
      if (seen.has(next)) {
        failures.push(`redirect loop: ${chain.join(' -> ')}`);
        break;
      }
      seen.add(next);
      current = next;
    }
    if (chain.length > 2 && chain.at(-1) !== source) failures.push(`redirect chain: ${chain.join(' -> ')}`);
  }
  const canonicalPaths = sitemapPaths(sitemap);
  const pages = new Map();
  const generatedPages = new Map();

  async function loadDirect(pathname, label) {
    const response = await fetch(server.origin + pathname, { redirect: 'manual' });
    if (response.status !== 200) {
      failures.push(`${label}: ${pathname} returned HTTP ${response.status}`);
      return '';
    }
    const html = await response.text();
    pages.set(pathname, html);
    return html;
  }

  for (const rule of redirects.filter((candidate) => [301, 302].includes(candidate.status) && !candidate.from.includes('*'))) {
    const response = await fetch(server.origin + rule.from, { redirect: 'manual' });
    if (response.status !== rule.status) {
      failures.push(`redirect ${rule.from} -> ${rule.to} returned HTTP ${response.status} instead of ${rule.status}`);
    } else if (response.headers.get('location') !== rule.to) {
      failures.push(`redirect ${rule.from} returned Location ${response.headers.get('location') || '(missing)'} instead of ${rule.to}`);
    }
  }

  for (const pathname of canonicalPaths) await loadDirect(pathname, 'canonical');

  for (const relativePath of await generatedHtmlFiles(root)) {
    const html = await readFile(path.join(root, relativePath), 'utf8');
    generatedPages.set(relativePath, { html, basePath: sourceBasePath(html, relativePath) });
  }

  for (const [sourceLabel, { html, basePath }] of generatedPages) {
    for (const href of anchorHrefs(html)) {
      const target = internalTarget(href, basePath);
      if (!target) continue;
      const targetPath = `${target.pathname}${target.search}`;
      if (legacyRedirects.has(target.pathname)) {
        failures.push(`${sourceLabel}: legacy link ${target.pathname} should point directly to ${legacyRedirects.get(target.pathname)}`);
        continue;
      }
      const targetHtml = pages.get(targetPath) || await loadDirect(targetPath, sourceLabel);
      if (target.hash && targetHtml && !hasFragment(targetHtml, target.hash.slice(1))) {
        failures.push(`${sourceLabel}: ${targetPath}${target.hash} has no matching anchor`);
      }
    }
  }

  if (failures.length) {
    console.error('Route/link crawl failed:');
    for (const failure of failures) console.error(`- ${failure}`);
    process.exitCode = 1;
  } else {
    console.log(`Route/link crawl passed: ${canonicalPaths.length} canonical pages.`);
  }
} finally {
  await server.close();
}
