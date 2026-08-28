// test/serve.mjs
// Minimal static file server for the WeConvertFiles baseline harness.
//
// It mimics the parts of the Netlify hosting contract that matter for
// rendering a page locally, so the browser sees the same URLs and page
// shells it would in production:
//   * `_redirects` rules are parsed and applied (200 rewrites, 301/302
//     redirects, and the trailing 404 catch-all).
//   * Extensionless "pretty" URLs fall back to `<path>.html` (Netlify's
//     default asset resolution, e.g. /about -> about.html).
//   * A bare directory resolves to its index.html.
//
// This changes no production behaviour: it only reads the existing files
// and the existing `_redirects` file to serve them over HTTP for tests.
import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
};

// Parse `_redirects` into an ordered list of rules. Each non-comment line is
// `from  to  status`. We only need exact-path matches for the baseline URLs,
// so wildcard rules other than the final catch-all are kept but matched
// literally (the harness never depends on them).
async function loadRedirects(root) {
  let raw = '';
  try {
    raw = await readFile(path.join(root, '_redirects'), 'utf8');
  } catch {
    return [];
  }
  const rules = [];
  for (const line of raw.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const parts = trimmed.split(/\s+/);
    if (parts.length < 2) continue;
    const [from, to, statusRaw] = parts;
    const status = parseInt(statusRaw, 10) || 301;
    // Netlify's force flag (`!`): the rule wins even when a static file exists
    // at the requested path (e.g. `301!` on /guides/foo.html despite the file).
    const force = /!\s*$/.test(statusRaw);
    rules.push({ from, to, status, force });
  }
  return rules;
}

function contentType(filePath) {
  return MIME[path.extname(filePath).toLowerCase()] || 'application/octet-stream';
}

async function tryFile(root, relPath) {
  // Resolve a URL path to an on-disk file inside the configured root, guarding traversal.
  const clean = decodeURIComponent(relPath.split('?')[0]);
  const abs = path.resolve(root, '.' + clean);
  if (abs !== root && !abs.startsWith(root + path.sep)) return null;
  try {
    const s = await stat(abs);
    if (s.isFile()) return abs;
    if (s.isDirectory()) {
      const idx = path.join(abs, 'index.html');
      const si = await stat(idx).catch(() => null);
      if (si && si.isFile()) return idx;
    }
  } catch {
    /* not found */
  }
  return null;
}

export async function startServer({ port = 0, root = ROOT } = {}) {
  const resolvedRoot = path.resolve(root);
  const rules = await loadRedirects(resolvedRoot);
  const exact = new Map();
  let catchAll = null;
  for (const r of rules) {
    if (r.from === '/*') { catchAll = r; continue; }
    if (!exact.has(r.from)) exact.set(r.from, r);
  }

  const server = http.createServer(async (req, res) => {
    const urlPath = (req.url || '/').split('?')[0];
    const rule = exact.get(urlPath);
    let file = null;
    let statusCode = 200;

    // 0. A forced rule (`!`) wins over a static file at the same path.
    if (rule && rule.force) {
      if (rule.status === 200) {
        file = await tryFile(resolvedRoot, rule.to);
      } else {
        res.writeHead(rule.status, { Location: rule.to });
        res.end();
        return;
      }
    }

    // 1. Direct file hit (assets, .html requested explicitly, etc).
    if (!file) file = await tryFile(resolvedRoot, urlPath);

    // 2. Apply a non-forced exact `_redirects` rule (yields to a real file).
    if (!file && rule && !rule.force) {
      if (rule.status === 200) {
        file = await tryFile(resolvedRoot, rule.to);
      } else {
        res.writeHead(rule.status, { Location: rule.to });
        res.end();
        return;
      }
    }

    // 3. Pretty-URL fallback: /about -> about.html.
    if (!file && !path.extname(urlPath)) {
      file = await tryFile(resolvedRoot, urlPath.replace(/\/$/, '') + '.html');
    }

    // 4. Catch-all 404 page.
    if (!file) {
      statusCode = 404;
      file = await tryFile(resolvedRoot, (catchAll && catchAll.to) || '/404.html');
      if (!file) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
        return;
      }
    }

    res.writeHead(statusCode, { 'Content-Type': contentType(file) });
    createReadStream(file).pipe(res);
  });

  await new Promise((resolve) => server.listen(port, '127.0.0.1', resolve));
  const actualPort = server.address().port;
  const origin = `http://127.0.0.1:${actualPort}`;
  return {
    origin,
    port: actualPort,
    close: () => new Promise((resolve) => server.close(resolve))
  };
}

// Allow running standalone: `node test/serve.mjs [port]`
if (import.meta.url === `file://${process.argv[1]}`) {
  const port = parseInt(process.argv[2], 10) || 8787;
  startServer({ port }).then(({ origin }) => {
    console.log(`Serving WeConvertFiles at ${origin}`);
  });
}
