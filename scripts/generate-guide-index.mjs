import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { guideHrefForTool, parseToolCatalogue } from './guide-catalog.mjs';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const appSource = fs.readFileSync(path.join(rootDir, 'app.js'), 'utf8');
const indexPath = path.join(rootDir, 'index.html');
let indexSource = fs.readFileSync(indexPath, 'utf8');
const { tools, categories } = parseToolCatalogue(appSource);
const toolById = new Map(tools.map((tool) => [tool.id, tool]));

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

const desktopLinkClass = 'rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-slate-50 dark:bg-slate-900/60 p-4 text-sm font-semibold text-slate-800 dark:text-slate-200 transition hover:border-[#1a73e8] hover:bg-[#f5f9ff] dark:hover:bg-[#1a73e8]/10';
const mobileLinkClass = 'wcf-guide-link flex items-center justify-center text-center p-3 rounded-xl border border-slate-100 dark:border-slate-700/60 bg-slate-50/50 dark:bg-slate-900/40 text-xs font-semibold text-slate-700 dark:text-slate-300 active:bg-slate-100 dark:active:bg-slate-800 transition';

const orderedTools = categories.flatMap((category) => category.toolIds.map((id) => {
  const tool = toolById.get(id);
  if (!tool) throw new Error(`Guide category ${category.id} references unknown tool ${id}.`);
  return tool;
}));

const renderGroups = (innerGridClass, openFirst) => categories.map((category, index) => {
  const links = category.toolIds.map((id) => {
    const tool = toolById.get(id);
    if (!tool) throw new Error(`Guide category ${category.id} references unknown tool ${id}.`);
    return `                    <a class="${mobileLinkClass}" href="${guideHrefForTool(tool.id)}">${escapeHtml(tool.title)}</a>`;
  }).join('\n');
  const openAttr = openFirst && index === 0 ? ' open' : '';

  return `                <details${openAttr} style="--c:rgb(${category.rgb})" class="wcf-acc group border border-slate-200 dark:border-slate-700/60 bg-slate-50 dark:bg-slate-900/60 rounded-2xl overflow-hidden">
                  <summary class="flex items-center justify-between p-4 cursor-pointer select-none font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/40 transition-colors list-none [&::-webkit-details-marker]:hidden">
                    <span class="flex items-center gap-2">
                      <span class="wcf-badge grid h-6 min-w-6 place-items-center rounded-full bg-blue-100 px-1.5 text-xs font-bold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">${category.toolIds.length}</span>
                      ${escapeHtml(category.title)} Guides
                    </span>
                    <svg class="h-4 w-4 text-slate-400 transition-transform duration-200 group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" /></svg>
                  </summary>
                  <div class="p-3 bg-white dark:bg-[#1e293b] border-t border-slate-200/60 dark:border-slate-700/60 grid ${innerGridClass} gap-2">
${links}
                  </div>
                </details>`;
}).join('\n');

// Both views use the same collapsed accordions with a 2-column inner link grid.
// Desktop lays the tabs out three-per-row (3x2); mobile stacks them full width.
const desktopGroups = renderGroups('grid-cols-2', false);
const mobileGroups = renderGroups('grid-cols-2', false);

const generatedBlock = `              <!-- GENERATED_GUIDE_GRIDS_START -->
              <div data-guide-view="desktop" class="mt-5 hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-3">
${desktopGroups}
              </div>

              <div data-guide-view="mobile" class="mt-5 block md:hidden space-y-3">
${mobileGroups}
              </div>
              <!-- GENERATED_GUIDE_GRIDS_END -->`;

const generatedStart = '              <!-- GENERATED_GUIDE_GRIDS_START -->';
const generatedEnd = '              <!-- GENERATED_GUIDE_GRIDS_END -->';
const legacyStart = '              <!-- Desktop/Tablet Grid View (Hidden on mobile) -->';
const sectionTail = '            </section>\n          </div>\n\n          <aside';

if (indexSource.includes(generatedStart)) {
  const start = indexSource.indexOf(generatedStart);
  const end = indexSource.indexOf(generatedEnd, start) + generatedEnd.length;
  indexSource = `${indexSource.slice(0, start)}${generatedBlock}${indexSource.slice(end)}`;
} else {
  const start = indexSource.indexOf(legacyStart);
  const end = indexSource.indexOf(sectionTail, start);
  if (start < 0 || end < 0) throw new Error('Could not find the existing guide grids in index.html.');
  indexSource = `${indexSource.slice(0, start)}${generatedBlock}\n${indexSource.slice(end)}`;
}

indexSource = indexSource
  .replace(/\b\d+\+? free browser-based tools/g, `${tools.length} free browser-based tools`)
  .replace(/\b\d+\+? free local tools/g, `${tools.length} free local tools`)
  .replace(/data-tool-count="\d+"/g, `data-tool-count="${tools.length}"`)
  .replace(/(data-guide-count="\d+">)\d+/g, `$1${tools.length}`);

fs.writeFileSync(indexPath, indexSource);
console.log(`Generated matching desktop and mobile guide grids for ${tools.length} tools.`);
