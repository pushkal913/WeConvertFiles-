import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const expectedCategories = [
  ['pdf', 'PDF', '/category/pdf-tools'],
  ['images', 'Images', '/category/image-tools'],
  ['data-office', 'Data & Office', '/category/convert-office'],
  ['developer', 'Developer', '/category/developer-tools']
];

function readProjectFile(relativePath) {
  return readFileSync(path.join(rootDir, relativePath), 'utf8');
}

function generatedMenuIds(source) {
  return [...source.matchAll(/data-nav-menu="([^"]+)"/g)].map((match) => match[1]);
}

function validateShell(source, file) {
  const menuIds = generatedMenuIds(source);
  assert.deepEqual(menuIds, expectedCategories.map(([id]) => id), `${file} must contain exactly four generated navigation menus in canonical order`);

  for (const [id, label, hubPath] of expectedCategories) {
    const triggerId = `nav-${id}-trigger`;
    const panelId = `nav-${id}-menu`;
    assert.match(source, new RegExp(`<button[^>]*id="${triggerId}"[^>]*data-nav-trigger="${id}"[^>]*aria-controls="${panelId}"[^>]*aria-expanded="false"`, 's'), `${file} must expose the ${label} trigger state`);
    assert.match(source, new RegExp(`<div[^>]*id="${panelId}"[^>]*data-nav-panel="${id}"[^>]*hidden`, 's'), `${file} must expose the ${label} panel state`);
    assert.match(source, new RegExp(`<a[^>]*href="${hubPath}"[^>]*>View all ${label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')} tools</a>`), `${file} must link to the ${label} hub`);
  }

  const desktopNav = source.match(/<nav class="hidden lg:flex[\s\S]*?<\/nav>/)?.[0] || '';
  const primaryOnly = desktopNav.replace(/<div id="nav-[^"]+-menu"[\s\S]*?<\/div>\s*<\/div>/g, '');
  assert.ok(desktopNav, `${file} must retain a desktop primary navigation region`);
  assert.doesNotMatch(primaryOnly, /<a[^>]+href="\/(?:decrypt-pdf|sign-pdf)"/, `${file} must not retain standalone Unlock PDF or Sign PDF primary links`);
}

validateShell(readProjectFile('layout.js'), 'layout.js');
validateShell(readProjectFile('index.html'), 'index.html');

console.log('Navigation structural validation passed.');
