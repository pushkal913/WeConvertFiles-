import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { loadShell } from './shell-inject.mjs';
import { tools as catalogueTools, assertValidCatalogue } from './catalogue.mjs';
import { nav } from '../data/tools.mjs';
import { categoryPages } from '../data/category-pages.mjs';
import { guideSlugForTool } from './guide-catalog.mjs';
import { breadcrumbNav, breadcrumbListJsonLd } from './breadcrumbs.mjs';

const breadcrumbTrail = (page) => [
  { name: 'Home', href: '/' },
  { name: page.h1, href: `/category/${page.slug}` }
];

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputDir = path.join(rootDir, 'category');
const siteUrl = 'https://www.weconvertfiles.com';
const socialImage = `${siteUrl}/assets/og-image.png`;

// The shared site shell (header/footer/overlays) is emitted directly into each
// generated page so it ships static — layout.js detects <header data-wcf-shell>
// and skips runtime injection, so the page does not jump on load.
assertValidCatalogue();
const shell = loadShell();

const toolById = new Map(catalogueTools.map((tool) => [tool.id, tool]));
const navGroupByName = new Map(nav.groups.map((group) => [group.name, group]));

// Resolve a hub's tools: catalogue-ordered nav-group members plus any extras
// that belong on the hub but are kept out of the compact mobile drawer.
function toolsForCategory(category) {
  const group = navGroupByName.get(category.navGroup);
  if (!group) throw new Error(`category "${category.slug}": no nav group named "${category.navGroup}".`);
  const ids = [...group.toolIds, ...(category.extraToolIds || [])];
  const seen = new Set();
  return ids.filter((id) => {
    if (seen.has(id)) return false;
    seen.add(id);
    if (!toolById.has(id)) throw new Error(`category "${category.slug}": unknown tool id "${id}".`);
    return true;
  }).map((id) => toolById.get(id));
}

const escapeHtml = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#39;');

const jsonLd = (page, tools) => {
  const url = `${siteUrl}/category/${page.slug}`;
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${url}#webpage`,
        url,
        name: page.title,
        description: page.description,
        inLanguage: 'en'
      },
      breadcrumbListJsonLd(breadcrumbTrail(page)),
      {
        '@type': 'ItemList',
        name: page.h1,
        numberOfItems: tools.length,
        itemListElement: tools.map((tool, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          url: `${siteUrl}/${tool.id}`,
          name: tool.title
        }))
      },
      {
        '@type': 'FAQPage',
        mainEntity: page.faqs.map(([question, answer]) => ({
          '@type': 'Question',
          name: question,
          acceptedAnswer: { '@type': 'Answer', text: answer }
        }))
      }
    ]
  }, null, 2).replaceAll('<', '\\u003c');
};

const renderToolCard = (tool) => {
  const guideHref = `/guides/${guideSlugForTool(tool.id)}`;
  return `
          <li class="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-[#1a73e8] dark:border-slate-700/60 dark:bg-[#1e293b]">
            <a class="font-bold text-slate-900 hover:text-[#1a73e8] dark:text-slate-100" href="/${tool.id}">${escapeHtml(tool.title)}</a>
            <p class="mt-2 flex-grow text-sm leading-6 text-slate-600 dark:text-slate-400">${escapeHtml(tool.description)}</p>
            <div class="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-semibold">
              <a class="text-[#1a73e8] hover:underline" href="/${tool.id}">Open tool <span aria-hidden="true">→</span></a>
              <a class="text-slate-500 hover:text-[#1a73e8] dark:text-slate-400" href="${guideHref}">Read the guide</a>
            </div>
          </li>`;
};

const renderWorkflows = (workflows) => workflows.map(([title, text]) => `
          <li class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700/60 dark:bg-[#1e293b]">
            <h3 class="font-bold text-slate-900 dark:text-slate-100">${escapeHtml(title)}</h3>
            <p class="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">${escapeHtml(text)}</p>
          </li>`).join('');

const renderFaqs = (faqs) => faqs.map(([question, answer]) => `
          <details class="group border-b border-slate-100 py-5 last:border-b-0 dark:border-slate-700/60">
            <summary class="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-slate-900 dark:text-slate-100">
              ${escapeHtml(question)}
              <span class="text-[#1a73e8] transition group-open:rotate-45" aria-hidden="true">+</span>
            </summary>
            <p class="mt-3 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400">${escapeHtml(answer)}</p>
          </details>`).join('');

const renderOtherHubs = (current) => categoryPages
  .filter((c) => c.slug !== current.slug)
  .map((c) => `          <a class="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-[#1a73e8] hover:text-[#1a73e8] dark:border-slate-700/60 dark:bg-[#1e293b] dark:text-slate-300" href="/category/${c.slug}">${escapeHtml(c.h1)}</a>`)
  .join('\n');

const renderPage = (page, tools) => {
  const url = `${siteUrl}/category/${page.slug}`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <script id="pagesenseCode" src="/pagesense.js" defer></script>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(page.title)}</title>
  <meta name="description" content="${escapeHtml(page.description)}" />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="${url}" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="WeConvertFiles" />
  <meta property="og:title" content="${escapeHtml(page.title)}" />
  <meta property="og:description" content="${escapeHtml(page.description)}" />
  <meta property="og:url" content="${url}" />
  <meta property="og:image" content="${socialImage}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(page.title)}" />
  <meta name="twitter:description" content="${escapeHtml(page.description)}" />
  <meta name="twitter:image" content="${socialImage}" />
  <script type="application/ld+json">
${jsonLd(page, tools)}
  </script>
  <link rel="stylesheet" href="/assets/styles.css?v=20260729-4" />
  <script>
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    }
  </script>
  <script src="../layout.js" defer></script>
  <link rel="icon" type="image/svg+xml" href="/assets/favicon.svg?v=5" />
  <link rel="icon" type="image/png" href="/assets/favicon.png?v=5" />
  <link rel="apple-touch-icon" href="/assets/favicon.png?v=5" />
</head>
<body class="bg-[#f8fafd] text-slate-900 antialiased transition-colors duration-200 dark:bg-[#0b0f19] dark:text-slate-100 min-h-screen flex flex-col">
    ${shell.headerBlock}
  <main class="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 flex-grow">
${breadcrumbNav(breadcrumbTrail(page))}

    <article>
      <header class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700/60 dark:bg-[#1e293b] sm:p-10">
        <p class="text-xs font-bold uppercase tracking-[0.16em] text-[#1a73e8]">${escapeHtml(page.eyebrow)}</p>
        <h1 class="mt-3 text-3xl font-semibold tracking-tight text-slate-950 dark:text-slate-100 sm:text-5xl">${escapeHtml(page.h1)}</h1>
        <p class="mt-5 max-w-3xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">${escapeHtml(page.lead)}</p>
        <div class="mt-6 flex flex-wrap gap-3 text-sm">
          <span class="rounded-full bg-emerald-50 px-3 py-1.5 font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">100% browser-based</span>
          <span class="rounded-full bg-blue-50 px-3 py-1.5 font-semibold text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">No server upload</span>
          <span class="rounded-full bg-slate-100 px-3 py-1.5 font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">${tools.length} free tools</span>
        </div>
      </header>

      <section class="mt-8 space-y-4 max-w-4xl leading-7 text-slate-600 dark:text-slate-300">
${page.intro.map((p) => `        <p>${escapeHtml(p)}</p>`).join('\n')}
      </section>

      <section class="mt-10">
        <h2 class="text-2xl font-bold tracking-tight text-slate-950 dark:text-slate-100">What you can do here</h2>
        <ul class="mt-6 grid gap-4 md:grid-cols-3">
${renderWorkflows(page.workflows)}
        </ul>
      </section>

      <section class="mt-10">
        <h2 class="text-2xl font-bold tracking-tight text-slate-950 dark:text-slate-100">${escapeHtml(page.h1)} in this hub</h2>
        <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">${tools.length} tools — each opens instantly and processes files on your device. Every tool has an in-depth guide.</p>
        <ul class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
${tools.map(renderToolCard).join('')}
        </ul>
      </section>

      <section class="mt-10">
        <h2 class="text-2xl font-bold tracking-tight text-slate-950 dark:text-slate-100">Frequently asked questions</h2>
        <div class="mt-5 rounded-3xl border border-slate-200 bg-white px-6 dark:border-slate-700/60 dark:bg-[#1e293b] sm:px-8">
${renderFaqs(page.faqs)}
        </div>
      </section>

      <section class="mt-10">
        <h2 class="text-xl font-bold text-slate-950 dark:text-slate-100">Explore other categories</h2>
        <div class="mt-4 flex flex-wrap gap-3">
${renderOtherHubs(page)}
        </div>
      </section>
    </article>
  </main>
    ${shell.footerBlock}
</body>
</html>
`;
};

await mkdir(outputDir, { recursive: true });
let count = 0;
for (const page of categoryPages) {
  const tools = toolsForCategory(page);
  await writeFile(path.join(outputDir, `${page.slug}.html`), renderPage(page, tools), 'utf8');
  count += 1;
}

console.log(`Generated ${count} category landing pages in ${outputDir}`);
