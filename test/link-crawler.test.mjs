import assert from 'node:assert/strict';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import test from 'node:test';

const testDir = path.dirname(fileURLToPath(import.meta.url));
const crawlerPath = path.join(testDir, 'link-crawler.mjs');

async function withSite(files, callback) {
  const root = await mkdtemp(path.join(tmpdir(), 'wcf-link-crawler-'));
  try {
    for (const [relativePath, content] of Object.entries(files)) {
      const absolutePath = path.join(root, relativePath);
      await mkdir(path.dirname(absolutePath), { recursive: true });
      await writeFile(absolutePath, content, 'utf8');
    }
    await callback(root);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}

function runCrawler(root) {
  return spawnSync(process.execPath, [crawlerPath, '--root', root], {
    encoding: 'utf8'
  });
}

test('accepts canonical pages whose internal route and fragment resolve directly', async () => {
  await withSite({
    'sitemap.xml': `<?xml version="1.0"?><urlset>
      <url><loc>https://www.weconvertfiles.com/</loc></url>
      <url><loc>https://www.weconvertfiles.com/about</loc></url>
    </urlset>`,
    '_redirects': '/* /404.html 404\n',
    'index.html': '<!doctype html><link rel="canonical" href="https://www.weconvertfiles.com/"><a href="/about#details">About</a>',
    'about.html': '<!doctype html><link rel="canonical" href="https://www.weconvertfiles.com/about"><h1 id="details">About</h1>',
    '404.html': '<!doctype html><h1>Not found</h1>'
  }, async (root) => {
    const result = runCrawler(root);
    assert.equal(result.status, 0, result.stderr || result.stdout);
  });
});

test('checks links found in generated HTML even when the source page is not in the sitemap', async () => {
  await withSite({
    'sitemap.xml': '<?xml version="1.0"?><urlset><url><loc>https://www.weconvertfiles.com/</loc></url></urlset>',
    '_redirects': '/* /404.html 404\n',
    'index.html': '<!doctype html><link rel="canonical" href="https://www.weconvertfiles.com/"><h1>Home</h1>',
    'draft.html': '<!doctype html><a href="/missing">Broken generated link</a>',
    '404.html': '<!doctype html><h1>Not found</h1>'
  }, async (root) => {
    const result = runCrawler(root);
    assert.equal(result.status, 1, result.stdout);
    assert.match(result.stderr, /draft\.html: \/missing returned HTTP 404/);
  });
});

test('rejects links to legacy redirect sources when a direct canonical link is available', async () => {
  await withSite({
    'sitemap.xml': `<?xml version="1.0"?><urlset>
      <url><loc>https://www.weconvertfiles.com/</loc></url>
      <url><loc>https://www.weconvertfiles.com/about</loc></url>
    </urlset>`,
    '_redirects': '/legacy /about 301\n/* /404.html 404\n',
    'index.html': '<!doctype html><link rel="canonical" href="https://www.weconvertfiles.com/"><a href="/legacy">About</a>',
    'about.html': '<!doctype html><link rel="canonical" href="https://www.weconvertfiles.com/about"><h1>About</h1>',
    '404.html': '<!doctype html><h1>Not found</h1>'
  }, async (root) => {
    const result = runCrawler(root);
    assert.equal(result.status, 1, result.stdout);
    assert.match(result.stderr, /index\.html: legacy link \/legacy should point directly to \/about/);
  });
});

test('rejects redirect chains instead of accepting multiple legacy hops', async () => {
  await withSite({
    'sitemap.xml': `<?xml version="1.0"?><urlset>
      <url><loc>https://www.weconvertfiles.com/</loc></url>
      <url><loc>https://www.weconvertfiles.com/about</loc></url>
    </urlset>`,
    '_redirects': '/old /middle 301\n/middle /about 301\n/* /404.html 404\n',
    'index.html': '<!doctype html><link rel="canonical" href="https://www.weconvertfiles.com/"><h1>Home</h1>',
    'about.html': '<!doctype html><link rel="canonical" href="https://www.weconvertfiles.com/about"><h1>About</h1>',
    '404.html': '<!doctype html><h1>Not found</h1>'
  }, async (root) => {
    const result = runCrawler(root);
    assert.equal(result.status, 1, result.stdout);
    assert.match(result.stderr, /redirect chain: \/old -> \/middle -> \/about/);
  });
});

test('verifies redirect rules are effective when a legacy static file also exists', async () => {
  await withSite({
    'sitemap.xml': '<?xml version="1.0"?><urlset><url><loc>https://www.weconvertfiles.com/</loc></url></urlset>',
    '_redirects': '/legacy.html / 301\n/* /404.html 404\n',
    'index.html': '<!doctype html><link rel="canonical" href="https://www.weconvertfiles.com/"><h1>Home</h1>',
    'legacy.html': '<!doctype html><h1>Legacy duplicate</h1>',
    '404.html': '<!doctype html><h1>Not found</h1>'
  }, async (root) => {
    const result = runCrawler(root);
    assert.equal(result.status, 1, result.stdout);
    assert.match(result.stderr, /redirect \/legacy\.html -> \/ returned HTTP 200 instead of 301/);
  });
});

test('rejects internal fragments that do not match an id or named anchor', async () => {
  await withSite({
    'sitemap.xml': `<?xml version="1.0"?><urlset>
      <url><loc>https://www.weconvertfiles.com/</loc></url>
      <url><loc>https://www.weconvertfiles.com/about</loc></url>
    </urlset>`,
    '_redirects': '/* /404.html 404\n',
    'index.html': '<!doctype html><link rel="canonical" href="https://www.weconvertfiles.com/"><a href="/about#missing">Details</a>',
    'about.html': '<!doctype html><link rel="canonical" href="https://www.weconvertfiles.com/about"><h1 id="present">About</h1>',
    '404.html': '<!doctype html><h1>Not found</h1>'
  }, async (root) => {
    const result = runCrawler(root);
    assert.equal(result.status, 1, result.stdout);
    assert.match(result.stderr, /index\.html: \/about#missing has no matching anchor/);
  });
});
