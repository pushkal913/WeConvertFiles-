// Reusable breadcrumb component. A single trail definition drives both the
// visible, accessible breadcrumb and the matching BreadcrumbList JSON-LD, so the
// two can never drift (Task 17 acceptance: visible + schema share one hierarchy).
//
// A trail is an ordered array of crumbs: [{ name, href }, ...]. `href` is a
// site-relative path ('/', '/category/pdf-tools', '/merge-pdf'). The last crumb
// is the current page — rendered as text with aria-current, but still given its
// canonical URL in the JSON-LD.

export const SITE_URL = 'https://www.weconvertfiles.com';

const escapeHtml = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#39;');

const absolute = (href) => {
  if (/^https?:\/\//.test(href)) return href;
  return `${SITE_URL}${href.startsWith('/') ? '' : '/'}${href}`;
};

// Visible breadcrumb. An ordered list conveys the hierarchy to screen readers;
// separators are decorative (aria-hidden); the current page carries
// aria-current="page". flex-wrap keeps it compact and legible on small screens.
export function breadcrumbNav(trail, { indent = '    ' } = {}) {
  if (!Array.isArray(trail) || trail.length < 2) {
    throw new Error('breadcrumbNav: a trail needs at least two crumbs.');
  }
  const items = trail.map((crumb, index) => {
    const isLast = index === trail.length - 1;
    const sep = index > 0
      ? `${indent}  <li aria-hidden="true" class="select-none text-slate-300 dark:text-slate-600">/</li>\n`
      : '';
    const inner = isLast
      ? `<span aria-current="page" class="font-medium text-slate-700 dark:text-slate-300">${escapeHtml(crumb.name)}</span>`
      : `<a class="rounded hover:text-[#1a73e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]" href="${escapeHtml(crumb.href)}">${escapeHtml(crumb.name)}</a>`;
    return `${sep}${indent}  <li class="min-w-0 max-w-[60vw] truncate">${inner}</li>`;
  }).join('\n');
  return `${indent}<nav aria-label="Breadcrumb" class="mb-6">
${indent}  <ol class="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-500 dark:text-slate-400">
${items}
${indent}  </ol>
${indent}</nav>`;
}

// Matching BreadcrumbList JSON-LD object (absolute item URLs).
export function breadcrumbListJsonLd(trail) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: absolute(crumb.href)
    }))
  };
}

// Standalone JSON-LD <script> string (for pages that add a separate block).
export function breadcrumbJsonLdScript(trail, { indent = '  ' } = {}) {
  const data = { '@context': 'https://schema.org', ...breadcrumbListJsonLd(trail) };
  const json = JSON.stringify(data, null, 2).replaceAll('<', '\\u003c');
  return `${indent}<script type="application/ld+json">\n${json}\n${indent}</script>`;
}
