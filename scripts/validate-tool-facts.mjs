import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { tools as catalogueTools } from './catalogue.mjs';
import { toolFacts } from '../data/tool-facts.mjs';
import { factRowsFor } from './tool-facts-render.mjs';

// Tool fact blocks: every catalogue tool has an implementation-accurate fact
// entry; the block is present and visible on the static tool page; the runtime
// (SPA) block matches; and no unsupported privacy/performance superlatives are
// introduced.

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const failures = [];
const check = (cond, msg) => { if (!cond) failures.push(msg); };

const escapeHtml = (v) => String(v)
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;').replaceAll("'", '&#39;');

// Phrases that would over-claim beyond what the client-side implementation
// supports. The facts are meant to be plain and verifiable.
const FORBIDDEN = ['military-grade', 'bank-level', 'unhackable', '100% secure', 'completely secure', 'totally secure', 'totally private', 'end-to-end encrypted', 'fastest', 'unlimited', 'no limits'];

// --- Fact data is complete and clean ---------------------------------------
for (const tool of catalogueTools) {
  const f = toolFacts[tool.id];
  check(!!f, `tool "${tool.id}": missing a fact entry in data/tool-facts.mjs.`);
  if (!f) continue;
  for (const field of ['inputs', 'outputs', 'bestFor']) {
    check(typeof f[field] === 'string' && f[field].trim().length > 0, `tool "${tool.id}": fact "${field}" is empty.`);
  }
  if ('limitations' in f) {
    check(typeof f.limitations === 'string' && f.limitations.trim().length > 0, `tool "${tool.id}": "limitations" is present but empty.`);
  }
  const blob = [f.inputs, f.outputs, f.limitations || '', f.bestFor].join(' ').toLowerCase();
  for (const phrase of FORBIDDEN) {
    check(!blob.includes(phrase), `tool "${tool.id}": fact text contains an unsupported claim ("${phrase}").`);
  }
}

// No stray fact entries for tools that do not exist.
const catalogueIds = new Set(catalogueTools.map((t) => t.id));
for (const id of Object.keys(toolFacts)) {
  check(catalogueIds.has(id), `data/tool-facts.mjs has an entry for unknown tool "${id}".`);
}

// --- Static tool pages carry the visible, accessible block ------------------
for (const tool of catalogueTools) {
  const file = path.join(rootDir, 'tool-pages', `${tool.id}.html`);
  if (!existsSync(file)) { failures.push(`tool "${tool.id}": tool page missing.`); continue; }
  const html = await readFile(file, 'utf8');
  const where = `tool "${tool.id}"`;
  // The container is filled with the fact <section> (nested <div>s in the <dl>
  // make a scoped regex unreliable, so assert the container is filled and check
  // the rows against the page — the dt/dd markup is unique to the fact block).
  check(/<div id="toolFactBlock">\s*<section[^>]*aria-labelledby="toolFactsHeading"/.test(html),
    `${where}: fact block is missing or not filled on the static page.`);
  for (const [label, value] of factRowsFor(tool.id)) {
    check(html.includes(`>${escapeHtml(label)}</dt>`), `${where}: fact block is missing the "${label}" row.`);
    check(html.includes(`>${escapeHtml(value)}</dd>`), `${where}: fact block is missing the value for "${label}".`);
  }
}

// --- Runtime (SPA) fact blocks match ---------------------------------------
const runtime = await readFile(path.join(rootDir, 'js', 'catalogue.js'), 'utf8');
const payloadJson = runtime.slice(runtime.indexOf('{'), runtime.lastIndexOf('}') + 1);
let factBlocks = {};
try { factBlocks = JSON.parse(payloadJson).factBlocks || {}; }
catch { failures.push('js/catalogue.js: could not parse WCF_CATALOGUE payload.'); }
for (const tool of catalogueTools) {
  const rt = factBlocks[tool.id];
  check(!!rt, `runtime fact block for "${tool.id}" is missing.`);
  if (!rt) continue;
  for (const [, value] of factRowsFor(tool.id)) {
    check(rt.includes(`>${escapeHtml(value)}</dd>`), `runtime fact block for "${tool.id}" is missing a value ("${value}").`);
  }
}

if (failures.length) {
  console.error('Tool fact validation failed:');
  for (const f of failures) console.error(`- ${f}`);
  process.exit(1);
}

console.log('Tool fact validation passed:');
console.log(`- all ${catalogueTools.length} tools have implementation-accurate facts, visible on the static page and in the runtime, with no unsupported claims`);
