import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { guideHrefForTool, guideSlugForTool, parseToolCatalogue } from './guide-catalog.mjs';
import { relatedToolIds } from './related.mjs';

// Adds a contextual "Related guides" section to every guide, cross-linking the
// other guides in the same category (filled to three from the wider catalogue).
// These are unique in-content links — the kind crawlers weight, unlike the
// repeated homepage accordion. Idempotent via HTML markers.

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { tools } = parseToolCatalogue();

// Tool descriptions (for the card copy) come from the authoritative catalogue.
const descById = new Map(tools.map((t) => [t.id, t.description]));
const titleById = new Map(tools.map((t) => [t.id, t.title]));

const START = '<!-- RELATED_GUIDES_START -->';
const END = '<!-- RELATED_GUIDES_END -->';

const escapeHtml = (v) => String(v)
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

const shorten = (s, n = 96) => {
  const t = String(s).trim();
  return t.length <= n ? t : `${t.slice(0, n - 1).replace(/\s+\S*$/, '')}…`;
};

// Genuinely relevant related guides: the shared related-tool ranking (same
// category, then same hub — never unrelated), capped at three.
function relatedIdsFor(toolId) {
  return relatedToolIds(toolId, 3);
}

const cardClass = 'rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-[#1e293b] p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#1a73e8]';

function sectionFor(toolId) {
  const cards = relatedIdsFor(toolId).map((id) => {
    const href = guideHrefForTool(id);
    const title = escapeHtml(titleById.get(id) || id);
    const desc = escapeHtml(shorten(descById.get(id) || ''));
    return `        <a class="${cardClass}" href="${href}"><h3 class="font-bold text-[#1a73e8]">${title} Guide</h3><p class="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">${desc}</p></a>`;
  }).join('\n');
  return `${START}\n      <h2 class="text-2xl font-bold mt-10 mb-4 text-slate-900 dark:text-slate-100">Related guides</h2>\n      <section class="grid gap-4 md:grid-cols-3">\n${cards}\n      </section>\n      ${END}`;
}

let updated = 0;
let missing = 0;
for (const tool of tools) {
  const file = path.join(rootDir, 'guides', `${guideSlugForTool(tool.id)}.html`);
  if (!fs.existsSync(file)) { missing += 1; continue; }
  let html = fs.readFileSync(file, 'utf8');
  const block = sectionFor(tool.id);

  if (html.includes(START)) {
    // Idempotent: replace the existing block in place.
    const s = html.indexOf(START);
    const e = html.indexOf(END, s) + END.length;
    html = html.slice(0, s) + block + html.slice(e);
  } else {
    // Insert at the best available anchor. Guides use two templates, so fall
    // back through them; every guide has </main>.
    const h2 = html.indexOf('>Related tools</h2>');
    if (h2 >= 0) {
      const secEnd = html.indexOf('</section>', h2) + '</section>'.length;
      html = `${html.slice(0, secEnd)}\n\n      ${block}${html.slice(secEnd)}`;
    } else if (html.includes('</article>')) {
      html = html.replace('</article>', `  ${block}\n    </article>`);
    } else if (html.includes('</main>')) {
      html = html.replace('</main>', `    ${block}\n  </main>`);
    }
  }
  if (!html.includes(START)) {
    throw new Error(`Could not inject "Related guides" into ${guideSlugForTool(tool.id)}.html — no known insertion point.`);
  }
  fs.writeFileSync(file, html);
  updated += 1;
}

console.log(`Injected "Related guides" into ${updated} guides${missing ? ` (${missing} guide files missing)` : ''}.`);
