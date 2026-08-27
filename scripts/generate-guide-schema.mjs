import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { contentDates } from '../data/content-dates.mjs';

/*
 * Article + FAQPage JSON-LD generator for guide pages.
 *
 * Some guide pages ship a rich, hand-written @graph (Article + FAQPage). The
 * rest carry only page metadata and an on-page FAQ, with no structured data.
 * This script gives those pages a best-practice Article + FAQPage @graph so
 * search and answer engines can attribute authorship, freshness, and Q&A.
 *
 * What it does per guide, in <guides>/*.html:
 *   - Skip guides that already have a hand-written Article schema (leave the
 *     20 fuller guides untouched — detected by an Article schema that is NOT
 *     one of ours).
 *   - Build an Article from the <title>, meta description, canonical URL, and
 *     the file's git history (datePublished = first commit, dateModified =
 *     last commit).
 *   - Build a FAQPage from the on-page "Frequently Asked Questions" section so
 *     the structured Q&A stays in lockstep with what visitors actually read.
 *   - Inject/replace a single <script ... data-guide-schema> before </head>.
 *
 * Idempotent: re-running replaces our own block in place (refreshing dates)
 * and never touches hand-written schema.
 */

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const guidesDir = path.join(rootDir, 'guides');
const today = new Date().toISOString().slice(0, 10);

const SITE = 'https://www.weconvertfiles.com';
const ORG = {
  '@type': 'Organization',
  name: 'WeConvertFiles',
  url: `${SITE}/`,
  logo: {
    '@type': 'ImageObject',
    url: `${SITE}/assets/favicon.png`,
  },
};
const OG_IMAGE = `${SITE}/assets/og-image.png`;

const START = '  <!-- GUIDE_SCHEMA_START -->';
const END = '  <!-- GUIDE_SCHEMA_END -->';

// Minimal HTML-entity decoder for the handful of entities that appear in guide
// copy. Runs before values go into JSON so the JSON carries real characters.
function decodeEntities(value) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&#x27;/gi, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

// Collapse tags/whitespace inside an extracted fragment down to clean text.
function textOf(fragment) {
  return decodeEntities(fragment.replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();
}

function firstMatch(html, regex) {
  const m = html.match(regex);
  return m ? m[1] : null;
}

// Content dates come from the single source (data/content-dates.mjs), not git,
// so they are stable across builds. `relHref` is the guide file name (slug.html).
function datesFor(relHref) {
  const slug = relHref.replace(/\.html$/, '');
  const entry = contentDates.guides[slug];
  return entry || { published: today, updated: today };
}

// Pull the Q&A pairs out of the on-page FAQ section. We scope to the markup
// after the "Frequently Asked Questions" heading so unrelated h3/p elsewhere on
// the page can never leak in.
function extractFaq(html) {
  const anchor = html.indexOf('Frequently Asked Questions');
  if (anchor < 0) return [];
  const sectionStart = html.indexOf('<section', anchor);
  if (sectionStart < 0) return [];
  const sectionEnd = html.indexOf('</section>', sectionStart);
  const section = html.slice(sectionStart, sectionEnd < 0 ? undefined : sectionEnd);

  const pairs = [];
  const re = /<h3[^>]*>([\s\S]*?)<\/h3>\s*<p[^>]*>([\s\S]*?)<\/p>/g;
  let m;
  while ((m = re.exec(section)) !== null) {
    const question = textOf(m[1]);
    const answer = textOf(m[2]);
    if (question && answer) pairs.push({ question, answer });
  }
  return pairs;
}

function buildGraph(html, file, relHref) {
  const rawTitle = firstMatch(html, /<title>([^<]*)<\/title>/);
  const h1 = firstMatch(html, /<h1[^>]*>([\s\S]*?)<\/h1>/);
  const description = firstMatch(html, /<meta name="description" content="([^"]*)"/);
  const canonical = firstMatch(html, /<link rel="canonical" href="([^"]*)"/) || `${SITE}/guides/${relHref}`;

  // Headline: the page title minus the brand suffix, falling back to the H1.
  let headline = rawTitle ? decodeEntities(rawTitle).replace(/\s*[-—|]\s*WeConvertFiles\s*$/, '').trim() : null;
  if (!headline && h1) headline = textOf(h1);
  if (!headline) throw new Error(`No headline source in ${relHref}`);

  const article = {
    '@type': 'Article',
    headline,
    description: description ? decodeEntities(description) : headline,
    image: OG_IMAGE,
    datePublished: datesFor(relHref).published,
    dateModified: datesFor(relHref).updated,
    author: ORG,
    publisher: ORG,
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
    inLanguage: 'en',
  };

  const graph = [article];

  const faq = extractFaq(html);
  if (faq.length) {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: faq.map(({ question, answer }) => ({
        '@type': 'Question',
        name: question,
        acceptedAnswer: { '@type': 'Answer', text: answer },
      })),
    });
  }

  return { '@context': 'https://schema.org', '@graph': graph };
}

function renderBlock(graph) {
  const json = JSON.stringify(graph, null, 2)
    .split('\n')
    .map((line) => (line ? `  ${line}` : line))
    .join('\n');
  return `${START}\n  <script type="application/ld+json" data-guide-schema>\n${json}\n  </script>\n${END}\n`;
}

const files = fs.readdirSync(guidesDir).filter((f) => f.endsWith('.html'));
let injected = 0;
let skipped = 0;
let faqPages = 0;

for (const name of files) {
  const file = path.join('guides', name);
  const fullPath = path.join(guidesDir, name);
  let html = fs.readFileSync(fullPath, 'utf8');

  const hasOurBlock = html.includes('data-guide-schema');
  const hasArticle = /"@type":\s*"Article"/.test(html);

  // Leave hand-written Article schema alone.
  if (hasArticle && !hasOurBlock) {
    skipped += 1;
    continue;
  }

  const graph = buildGraph(html, file, name);
  if (graph['@graph'].some((n) => n['@type'] === 'FAQPage')) faqPages += 1;
  const block = renderBlock(graph);

  if (hasOurBlock) {
    const start = html.indexOf(START);
    const end = html.indexOf(END) + END.length;
    // swallow the trailing newline we wrote after END, if present
    const after = html[end] === '\n' ? end + 1 : end;
    html = `${html.slice(0, start)}${block}${html.slice(after)}`;
  } else {
    const headClose = html.indexOf('</head>');
    if (headClose < 0) throw new Error(`No </head> in ${name}`);
    html = `${html.slice(0, headClose)}${block}${html.slice(headClose)}`;
  }

  fs.writeFileSync(fullPath, html);
  injected += 1;
}

console.log(
  `Guide schema: injected/updated ${injected} guides (${faqPages} with FAQPage), left ${skipped} hand-written guides untouched.`,
);
