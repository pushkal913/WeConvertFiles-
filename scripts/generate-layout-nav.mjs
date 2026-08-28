import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { tools, nav } from '../data/tools.mjs';
import { buildNavigationCategories } from './category-catalog.mjs';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const layoutPath = path.join(rootDir, 'layout.js');
const indexPath = path.join(rootDir, 'index.html');
const TOOLS_START = '  // WCF_NAV_TOOLS_START — generated from data/tools.mjs (npm run generate:layout-nav); do not edit by hand.';
const TOOLS_END = '  // WCF_NAV_TOOLS_END';
const GROUPS_START = '  // WCF_NAV_GROUPS_START — generated from category-catalog.mjs (npm run generate:layout-nav); do not edit by hand.';
const GROUPS_END = '  // WCF_NAV_GROUPS_END';
const DESKTOP_START = '        <!-- WCF_NAV_DESKTOP_START — generated from category-catalog.mjs (npm run generate:layout-nav); do not edit by hand. -->';
const DESKTOP_END = '        <!-- WCF_NAV_DESKTOP_END -->';
const titleFor = (id) => nav.overrides[id]?.title || tools.find((tool) => tool.id === id)?.title;
const categories = buildNavigationCategories();

const toolsBlock = `  const tools = [\n${tools.map((tool) => `      { id: '${tool.id}', title: ${JSON.stringify(titleFor(tool.id))}, kicker: ${JSON.stringify(nav.overrides[tool.id]?.kicker || tool.kicker)} }`).join(',\n')}\n    ];`;
const groupsBlock = `  const categories = [\n${categories.map((category) => `    { id: ${JSON.stringify(category.id)}, name: ${JSON.stringify(category.label)}, hubPath: ${JSON.stringify(category.hubPath)}, ids: [${category.toolIds.map((id) => `'${id}'`).join(', ')}] }`).join(',\n')}\n  ];`;

function renderMenu(category) {
  const links = category.toolIds.map((id, index) => {
    const title = titleFor(id);
    if (!title) throw new Error(`Unknown navigation tool: ${id}`);
    return `            <a class="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-[#1a73e8] dark:hover:text-white transition-colors whitespace-nowrap" href="/${id}">${title}</a>`;
  }).join('\n');
  return `          <div class="wcf-nav-menu relative py-3" data-nav-menu="${category.id}">
            <button id="nav-${category.id}-trigger" data-nav-trigger="${category.id}" aria-controls="nav-${category.id}-menu" aria-expanded="false" type="button" class="inline-flex items-center gap-1 whitespace-nowrap text-slate-700 transition-colors hover:text-[#1967d2] hover:dark:text-[#1a73e8] dark:text-slate-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1a73e8]">
              <svg class="h-[21px] w-[21px]" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">${category.icon}</svg>
              <span>${category.label}</span><svg class="h-[15px] w-[15px] text-slate-400" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </button>
            <div id="nav-${category.id}-menu" data-nav-panel="${category.id}" hidden class="absolute left-1/2 top-full z-30 grid w-[480px] -translate-x-1/2 grid-cols-2 gap-1 rounded-2xl border border-slate-200 bg-white p-2 shadow-lift dark:border-slate-700/60 dark:bg-[#1e293b]">
              <a id="nav-${category.id}-menu-link-0" class="col-span-2 flex items-center rounded-xl px-3 py-2 text-sm font-bold text-[#1a73e8] hover:bg-blue-50 dark:hover:bg-slate-800/60" href="${category.hubPath}">View all ${category.label} tools</a>
${links}
            </div>
          </div>`;
}

const desktopBlock = `        <nav class="hidden lg:flex items-center justify-center gap-3.5 xl:gap-5.5 text-[13.5px] xl:text-[14.5px] font-semibold text-slate-700 dark:text-slate-200 flex-grow min-w-0" aria-label="Main navigation">
${categories.map(renderMenu).join('\n')}
        </nav>`;

function inject(source, startMarker, endMarker, block, findFrom, findTo) {
  const wrapped = `${startMarker}\n${block}\n${endMarker}`;
  if (source.includes(startMarker)) {
    const start = source.indexOf(startMarker);
    let end = source.indexOf(endMarker, start) + endMarker.length;
    while (source.slice(end).startsWith(`\n${endMarker}`)) end += endMarker.length + 1;
    return source.slice(0, start) + wrapped + source.slice(end);
  }
  const start = source.indexOf(findFrom);
  const end = source.indexOf(findTo, start);
  if (start < 0 || end < 0) throw new Error(`generate-layout-nav: missing ${findFrom}`);
  return source.slice(0, start) + wrapped + source.slice(end + findTo.length);
}

let layout = readFileSync(layoutPath, 'utf8');
layout = inject(layout, TOOLS_START, TOOLS_END, toolsBlock, '  const tools = [', '\n    ];');
layout = inject(layout, GROUPS_START, GROUPS_END, groupsBlock, '  const categories = [', '\n  ];');
layout = inject(layout, DESKTOP_START, DESKTOP_END, desktopBlock, '        <!-- Desktop Nav (Centered on desktop, hidden on mobile) -->', '        </nav>');
writeFileSync(layoutPath, layout);
let index = readFileSync(indexPath, 'utf8');
index = inject(index, DESKTOP_START, DESKTOP_END, desktopBlock, '        <!-- Desktop Nav & Utilities (Centered on desktop, hidden on mobile) -->', '        </nav>');
writeFileSync(indexPath, index);
console.log(`Generated layout navigation from the catalogue: ${tools.length} search tools, ${categories.length} desktop and mobile groups.`);
