import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { assertValidCatalogue, renderRuntimeCatalogue } from './catalogue.mjs';

// Generates js/catalogue.js — the runtime delivery of the tool catalogue's
// third-party library sources and per-tool dependencies (window.WCF_CATALOGUE),
// consumed by the app's dependency loader. Keeps dependency metadata in one
// place (data/tools.mjs) instead of hard-coded in app.js.

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
assertValidCatalogue();
const outPath = path.join(rootDir, 'js', 'catalogue.js');
writeFileSync(outPath, renderRuntimeCatalogue());
console.log('Generated js/catalogue.js from data/tools.mjs (runtime dependency catalogue).');
