import test from 'node:test';
import assert from 'node:assert/strict';
import { tools } from '../data/tools.mjs';
import { buildNavigationCategories } from '../scripts/category-catalog.mjs';

test('canonical navigation categories cover every catalogue tool exactly once', () => {
  const categories = buildNavigationCategories();

  assert.deepEqual(categories.map(({ id, label, shortLabel, hubPath, rgb }) => ({ id, label, shortLabel, hubPath, rgb })), [
    { id: 'pdf', label: 'PDF', shortLabel: 'PDF', hubPath: '/category/pdf-tools', rgb: '249, 115, 22' },
    { id: 'images', label: 'Images', shortLabel: 'Images', hubPath: '/category/image-tools', rgb: '16, 185, 129' },
    { id: 'data-office', label: 'Data & Office', shortLabel: 'Data', hubPath: '/category/convert-office', rgb: '99, 102, 241' },
    { id: 'developer', label: 'Developer', shortLabel: 'Developer', hubPath: '/category/developer-tools', rgb: '244, 63, 94' }
  ]);
  assert.deepEqual(categories.map(({ toolIds }) => toolIds.length), [13, 14, 5, 15]);

  const toolIds = categories.flatMap((category) => category.toolIds);
  const knownToolIds = new Set(tools.map((tool) => tool.id));
  const duplicateIds = [...new Set(toolIds.filter((id, index) => toolIds.indexOf(id) !== index))];
  const unknownIds = toolIds.filter((id) => !knownToolIds.has(id));
  const missingIds = [...knownToolIds].filter((id) => !toolIds.includes(id));

  assert.deepEqual(duplicateIds, [], 'navigation categories must not duplicate tool IDs');
  assert.deepEqual(unknownIds, [], 'navigation categories must not include unknown tool IDs');
  assert.deepEqual(missingIds, [], 'navigation categories must cover every catalogue tool ID');
  assert.equal(toolIds.length, 47);
  assert.equal(new Set(toolIds).size, 47);
  assert.ok(categories.find(({ id }) => id === 'images').toolIds.includes('images-pdf'));
  assert.ok(categories.find(({ id }) => id === 'data-office').toolIds.includes('office-pdf'));
});
