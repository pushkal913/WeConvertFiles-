import { toolFacts } from '../data/tool-facts.mjs';

// Renders the compact, accessible "Tool facts" block for a tool. One renderer is
// shared by the static tool-page generator and the runtime catalogue (SPA), so
// the baked and client-swapped blocks are identical. The three universal facts
// are true for every tool (processing is client-side, nothing is uploaded, no
// account); the rest come from data/tool-facts.mjs.

const escapeHtml = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#39;');

export function factRowsFor(toolId) {
  const f = toolFacts[toolId];
  if (!f) throw new Error(`tool-facts: no fact entry for "${toolId}".`);
  const rows = [
    ['Processing', 'In your browser'],
    ['Uploads', 'None — nothing is sent to a server'],
    ['Account', 'Not required'],
    ['Input', f.inputs],
    ['Output', f.outputs]
  ];
  if (f.limitations) rows.push(['Good to know', f.limitations]);
  rows.push(['Best for', f.bestFor]);
  return rows;
}

export function renderFactBlock(toolId, { indent = '' } = {}) {
  const rows = factRowsFor(toolId).map(([label, value]) => `${indent}    <div class="min-w-0">
${indent}      <dt class="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">${escapeHtml(label)}</dt>
${indent}      <dd class="mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200">${escapeHtml(value)}</dd>
${indent}    </div>`).join('\n');
  return `${indent}<section class="rounded-[28px] border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-[#1e293b] p-6 shadow-material" aria-labelledby="toolFactsHeading">
${indent}  <h2 id="toolFactsHeading" class="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Tool facts</h2>
${indent}  <dl class="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2">
${rows}
${indent}  </dl>
${indent}</section>`;
}
