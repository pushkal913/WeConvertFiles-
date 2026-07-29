import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputDir = path.join(rootDir, 'convert');
const siteUrl = 'https://www.weconvertfiles.com';
const socialImage = `${siteUrl}/assets/logo.png`;

const pages = [
  {
    slug: 'jpg-to-pdf',
    title: 'JPG to PDF Online - Free & Private | WeConvertFiles',
    description: 'Convert JPG images to one PDF online for free. Reorder multiple photos and process everything privately inside your browser.',
    h1: 'Convert JPG to PDF Online',
    eyebrow: 'JPG to PDF converter',
    lead: 'Turn one or more JPG photos, scans, or receipts into a single PDF without uploading the files to a server.',
    toolPath: '/images-pdf',
    cta: 'Convert JPG to PDF',
    input: 'JPG and JPEG images',
    output: 'One A4 PDF',
    summary: 'The converter places each JPG on its own A4 page, scales it proportionally inside the page margins, and preserves the order shown in the upload list. You can drag files into the order you want before creating the PDF.',
    useCases: [
      'Combine photographed receipts or notes into one document.',
      'Turn several phone-camera scans into a PDF for an upload form.',
      'Arrange product photos or reference images in a fixed sequence.'
    ],
    steps: [
      ['Open the converter', 'Use the button above to open the existing Images to PDF tool.'],
      ['Add and arrange JPG files', 'Choose one or more JPG images, then drag the selected items into the required page order.'],
      ['Create the PDF', 'Select Convert Now and download the generated images.pdf file.']
    ],
    formatNote: 'The current converter creates portrait A4 pages and fits each JPG within a margin without stretching its aspect ratio. Very wide or tall images are reduced to fit the page.',
    faqs: [
      ['Can I combine multiple JPG files into one PDF?', 'Yes. Add multiple JPG or JPEG files, arrange them in the upload list, and the converter will place one image on each PDF page.'],
      ['Can I change the order of the PDF pages?', 'Yes. Drag the selected images before conversion. Their displayed order becomes the page order in the finished PDF.'],
      ['Are my JPG files uploaded?', 'No. The supported conversion runs in your browser, so the selected images are processed on your device rather than uploaded to a conversion server.']
    ],
    related: [
      ['PNG to PDF', '/convert/png-to-pdf'],
      ['PDF to JPG', '/convert/pdf-to-jpg'],
      ['All PDF tools', '/']
    ]
  },
  {
    slug: 'png-to-pdf',
    title: 'PNG to PDF Online - Free & Private | WeConvertFiles',
    description: 'Convert one or more PNG images to a PDF online. Arrange the pages and process the files privately in your browser.',
    h1: 'Convert PNG to PDF Online',
    eyebrow: 'PNG to PDF converter',
    lead: 'Combine PNG screenshots, designs, diagrams, or document scans into a single PDF directly in your browser.',
    toolPath: '/images-pdf',
    cta: 'Convert PNG to PDF',
    input: 'PNG images',
    output: 'One A4 PDF',
    summary: 'Each selected PNG becomes one page in the output PDF. The converter keeps the image proportions, centers it on an A4 page, and follows the order you set in the file list.',
    useCases: [
      'Package multiple screenshots into one easy-to-share document.',
      'Combine exported diagrams or interface mockups into a PDF.',
      'Turn transparent PNG document scans into ordered PDF pages.'
    ],
    steps: [
      ['Open the converter', 'Use the button above to open the existing Images to PDF tool.'],
      ['Choose PNG files', 'Add one or more PNG images and reorder the selected items if needed.'],
      ['Download the PDF', 'Select Convert Now to create and download the PDF.']
    ],
    formatNote: 'PNG files can contain transparent areas. The PDF page itself is white, so transparent pixels may appear white in the downloaded document. Images are scaled to fit portrait A4 pages.',
    faqs: [
      ['Can I put several PNG images in one PDF?', 'Yes. The converter accepts multiple PNG files and creates one PDF page for every selected image.'],
      ['Will the PNG images be stretched?', 'No. Each image is scaled proportionally to fit inside the A4 page margins, preserving its original aspect ratio.'],
      ['Does PNG to PDF conversion happen on a server?', 'No. The supported tool creates the PDF inside your browser, and the selected PNG files are not uploaded to a remote conversion service.']
    ],
    related: [
      ['JPG to PDF', '/convert/jpg-to-pdf'],
      ['PDF to JPG', '/convert/pdf-to-jpg'],
      ['All image tools', '/']
    ]
  },
  {
    slug: 'heic-to-jpg',
    title: 'HEIC to JPG Online - Free & Private | WeConvertFiles',
    description: 'Convert Apple HEIC photos to JPG online for free. Choose JPEG quality, batch-convert files, and keep processing in your browser.',
    h1: 'Convert HEIC to JPG Online',
    eyebrow: 'HEIC to JPG converter',
    lead: 'Make iPhone and Apple HEIC photos easier to open and share by converting them to standard JPG images on your device.',
    toolPath: '/heic-to-jpg',
    cta: 'Convert HEIC to JPG',
    input: 'One or more HEIC photos',
    output: 'JPG files or a ZIP',
    summary: 'The HEIC converter decodes selected photos in the browser, lets you choose JPEG output quality, and downloads the result as a JPG. When several files are processed together, the JPG files are packaged in a ZIP archive.',
    useCases: [
      'Open iPhone photos in apps that do not support HEIC.',
      'Prepare HEIC images for websites, forms, or email attachments.',
      'Batch-convert several Apple photos into a familiar format.'
    ],
    steps: [
      ['Open the HEIC tool', 'Use the button above to open the existing HEIC to JPG / PNG converter.'],
      ['Choose JPG settings', 'Add one or more HEIC files, keep JPEG selected, and adjust the JPEG quality slider if needed.'],
      ['Convert and download', 'Run the conversion and download one JPG or a ZIP containing the batch.']
    ],
    formatNote: 'JPEG uses lossy compression and does not support transparency. For graphics that need transparency, the same tool also offers PNG output. Output quality can be adjusted from 10% to 100%, with 90% selected by default.',
    faqs: [
      ['Can I convert several HEIC files at once?', 'Yes. Select multiple HEIC photos and the converter will package the resulting JPG files in one ZIP download.'],
      ['Can I control JPG quality?', 'Yes. The tool includes a JPEG quality slider from 10% to 100% and uses 90% as the default.'],
      ['Are HEIC photos uploaded during conversion?', 'No. HEIC decoding and JPG creation run in your browser, so the supported workflow does not upload your photos to a conversion server.']
    ],
    related: [
      ['JPG to PDF', '/convert/jpg-to-pdf'],
      ['PNG to PDF', '/convert/png-to-pdf'],
      ['All image tools', '/']
    ]
  },
  {
    slug: 'word-to-pdf',
    title: 'Word to PDF Online - Free & Private | WeConvertFiles',
    description: 'Convert a DOCX Word document to PDF in your browser. Free, private client-side conversion with no file upload to a server.',
    h1: 'Convert Word to PDF Online',
    eyebrow: 'DOCX to PDF converter',
    lead: 'Create a PDF from a modern Word DOCX file using client-side document parsing and browser-based PDF rendering.',
    toolPath: '/office-pdf',
    cta: 'Convert Word to PDF',
    input: 'One DOCX document',
    output: 'One letter-size PDF',
    summary: 'The converter reads DOCX content with Mammoth.js, turns supported document elements into HTML, and creates a PDF snapshot in the browser. This approach is useful for straightforward documents that do not depend on advanced Microsoft Word layout features.',
    useCases: [
      'Create a shareable PDF from a simple report or letter.',
      'Export text-focused DOCX documents without sending them to a conversion server.',
      'Prepare a basic PDF copy for review or archiving.'
    ],
    steps: [
      ['Open the Office converter', 'Use the button above to open the existing Word / Excel to PDF tool.'],
      ['Choose a DOCX file', 'Select one modern Microsoft Word .docx document from your device.'],
      ['Generate the PDF', 'Run the conversion and download a PDF using the original file name.']
    ],
    formatNote: 'Complex Word features can render differently because the browser is not Microsoft Word. Custom fonts, SmartArt, advanced tables, charts, headers, footers, page breaks, and tightly controlled layouts may not be reproduced exactly. The current tool accepts DOCX, not the older DOC format.',
    faqs: [
      ['Does the converter support old .doc files?', 'No. The current Word conversion accepts modern .docx documents. Convert an older .doc file to DOCX in Word or another office application first.'],
      ['Will the PDF look exactly like Microsoft Word?', 'Not always. Text and common document elements are converted, but complex formatting can change because the file is rendered through browser HTML rather than the Microsoft Word engine.'],
      ['Is my Word document uploaded?', 'No. The supported DOCX parsing and PDF generation happen in your browser, so the document is not sent to a remote conversion server.']
    ],
    related: [
      ['JPG to PDF', '/convert/jpg-to-pdf'],
      ['PDF to JPG', '/convert/pdf-to-jpg'],
      ['All Office tools', '/']
    ]
  },
  {
    slug: 'pdf-to-jpg',
    title: 'PDF to JPG Online - Free & Private | WeConvertFiles',
    description: 'Convert every PDF page to a high-quality JPG online. Download the images in one ZIP while processing the PDF in your browser.',
    h1: 'Convert PDF to JPG Online',
    eyebrow: 'PDF to JPG converter',
    lead: 'Turn every page of a PDF into a separate JPG image and download the complete set in one ZIP archive.',
    toolPath: '/pdf-jpg',
    cta: 'Convert PDF to JPG',
    input: 'One PDF document',
    output: 'JPG pages in a ZIP',
    summary: 'The converter uses PDF.js to render each page onto a browser canvas at a higher working scale, exports the page as a JPEG image, and packages all pages into one ZIP file.',
    useCases: [
      'Create image previews of PDF pages for sharing or publishing.',
      'Prepare individual pages for systems that accept JPG but not PDF.',
      'Extract a visual copy of every page from a document or scan.'
    ],
    steps: [
      ['Open the PDF tool', 'Use the button above to open the existing PDF to JPG converter.'],
      ['Choose one PDF', 'Select the PDF whose pages you want to render as images.'],
      ['Download the ZIP', 'Run the conversion and download the ZIP containing page-1.jpg, page-2.jpg, and the remaining pages.']
    ],
    formatNote: 'Every PDF page is rendered as a complete JPG image at the tool’s fixed high-quality setting. The converter does not extract original embedded images separately. Password-protected PDFs must be unlocked before conversion.',
    faqs: [
      ['Does the converter create one JPG for every PDF page?', 'Yes. Each page is rendered as a separate JPG and all generated images are included in one ZIP archive.'],
      ['Can I choose individual pages?', 'The current PDF to JPG tool converts every page. Use a PDF page extraction tool first if you only need a selected range.'],
      ['Is my PDF uploaded to a server?', 'No. PDF rendering, JPG creation, and ZIP packaging occur inside your browser for the supported conversion workflow.']
    ],
    related: [
      ['JPG to PDF', '/convert/jpg-to-pdf'],
      ['PNG to PDF', '/convert/png-to-pdf'],
      ['All PDF tools', '/']
    ]
  }
];

const escapeHtml = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#39;');

const jsonLd = (page) => {
  const url = `${siteUrl}/convert/${page.slug}`;
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: page.title,
        description: page.description,
        inLanguage: 'en'
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: `${siteUrl}/`
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: page.h1,
            item: url
          }
        ]
      },
      {
        '@type': 'SoftwareApplication',
        name: page.h1,
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'Any',
        url,
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD'
        }
      },
      {
        '@type': 'FAQPage',
        mainEntity: page.faqs.map(([question, answer]) => ({
          '@type': 'Question',
          name: question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: answer
          }
        }))
      }
    ]
  }, null, 2).replaceAll('<', '\\u003c');
};

const renderSteps = (steps) => steps.map(([title, text], index) => `
          <li class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700/60 dark:bg-[#1e293b]">
            <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-sm font-bold text-[#1a73e8] dark:bg-blue-950/40 dark:text-blue-400">${index + 1}</span>
            <h3 class="mt-3 font-bold text-slate-900 dark:text-slate-100">${escapeHtml(title)}</h3>
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

const renderPage = (page) => {
  const url = `${siteUrl}/convert/${page.slug}`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
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
${jsonLd(page)}
  </script>
  <link rel="stylesheet" href="/assets/styles.css?v=20260729-4" />
  <script>
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    }
  </script>
  <script src="../layout.js" defer></script>
  <link rel="icon" type="image/svg+xml" href="/assets/favicon.svg?v=3" />
  <link rel="icon" type="image/png" href="/assets/favicon.png?v=3" />
  <link rel="apple-touch-icon" href="/assets/favicon.png?v=3" />
</head>
<body class="bg-[#f8fafd] text-slate-900 antialiased transition-colors duration-200 dark:bg-[#0b0f19] dark:text-slate-100">
  <main class="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
    <nav class="mb-6 text-sm text-slate-500 dark:text-slate-400" aria-label="Breadcrumb">
      <a class="font-semibold hover:text-[#1a73e8]" href="/">Home</a>
      <span class="mx-2" aria-hidden="true">/</span>
      <span aria-current="page">${escapeHtml(page.h1)}</span>
    </nav>

    <article>
      <header class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700/60 dark:bg-[#1e293b] sm:p-10">
        <p class="text-xs font-bold uppercase tracking-[0.16em] text-[#1a73e8]">${escapeHtml(page.eyebrow)}</p>
        <h1 class="mt-3 text-3xl font-semibold tracking-tight text-slate-950 dark:text-slate-100 sm:text-5xl">${escapeHtml(page.h1)}</h1>
        <p class="mt-5 max-w-3xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">${escapeHtml(page.lead)}</p>

        <div class="mt-6 flex flex-wrap gap-3 text-sm">
          <span class="rounded-full bg-emerald-50 px-3 py-1.5 font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">100% browser-based</span>
          <span class="rounded-full bg-blue-50 px-3 py-1.5 font-semibold text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">No server upload</span>
          <span class="rounded-full bg-slate-100 px-3 py-1.5 font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">Free to use</span>
        </div>

        <a class="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-[#1a73e8] px-7 py-3 text-sm font-bold text-white shadow-md transition hover:bg-[#1967d2]" href="${page.toolPath}" aria-label="${escapeHtml(page.cta)} in the WeConvertFiles tool">
          ${escapeHtml(page.cta)}
          <span class="ml-2" aria-hidden="true">→</span>
        </a>
        <p class="mt-3 text-xs text-slate-500 dark:text-slate-400">The button opens the existing tested converter.</p>
      </header>

      <section class="mt-8 grid gap-4 sm:grid-cols-2" aria-label="Conversion details">
        <div class="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700/60 dark:bg-[#1e293b]">
          <p class="text-xs font-bold uppercase tracking-wider text-slate-400">Input</p>
          <p class="mt-2 font-semibold text-slate-900 dark:text-slate-100">${escapeHtml(page.input)}</p>
        </div>
        <div class="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700/60 dark:bg-[#1e293b]">
          <p class="text-xs font-bold uppercase tracking-wider text-slate-400">Output</p>
          <p class="mt-2 font-semibold text-slate-900 dark:text-slate-100">${escapeHtml(page.output)}</p>
        </div>
      </section>

      <section class="mt-10">
        <h2 class="text-2xl font-bold tracking-tight text-slate-950 dark:text-slate-100">How this conversion works</h2>
        <p class="mt-4 max-w-4xl leading-7 text-slate-600 dark:text-slate-400">${escapeHtml(page.summary)}</p>
        <ol class="mt-6 grid gap-4 md:grid-cols-3">
${renderSteps(page.steps)}
        </ol>
      </section>

      <section class="mt-10 grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
        <div class="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-700/60 dark:bg-[#1e293b] sm:p-8">
          <h2 class="text-xl font-bold text-slate-950 dark:text-slate-100">Common uses</h2>
          <ul class="mt-4 space-y-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
${page.useCases.map((item) => `            <li class="flex gap-3"><span class="font-bold text-emerald-600" aria-hidden="true">✓</span><span>${escapeHtml(item)}</span></li>`).join('\n')}
          </ul>
        </div>
        <aside class="rounded-3xl border border-blue-100 bg-blue-50/70 p-6 dark:border-blue-900/50 dark:bg-blue-950/20 sm:p-8">
          <h2 class="text-xl font-bold text-slate-950 dark:text-slate-100">Format note</h2>
          <p class="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-400">${escapeHtml(page.formatNote)}</p>
        </aside>
      </section>

      <section class="mt-10">
        <h2 class="text-2xl font-bold tracking-tight text-slate-950 dark:text-slate-100">Privacy-first processing</h2>
        <p class="mt-4 max-w-4xl leading-7 text-slate-600 dark:text-slate-400">The supported conversion runs locally in your browser. Your selected files stay on your device during the conversion instead of being uploaded to a remote file-processing server. Closing or refreshing the tab clears the current in-page selection.</p>
      </section>

      <section class="mt-10">
        <h2 class="text-2xl font-bold tracking-tight text-slate-950 dark:text-slate-100">Frequently asked questions</h2>
        <div class="mt-5 rounded-3xl border border-slate-200 bg-white px-6 dark:border-slate-700/60 dark:bg-[#1e293b] sm:px-8">
${renderFaqs(page.faqs)}
        </div>
      </section>

      <section class="mt-10">
        <h2 class="text-xl font-bold text-slate-950 dark:text-slate-100">Related conversions</h2>
        <div class="mt-4 flex flex-wrap gap-3">
${page.related.map(([label, href]) => `          <a class="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-[#1a73e8] hover:text-[#1a73e8] dark:border-slate-700/60 dark:bg-[#1e293b] dark:text-slate-300" href="${href}">${escapeHtml(label)}</a>`).join('\n')}
        </div>
      </section>
    </article>
  </main>
</body>
</html>
`;
};

await mkdir(outputDir, { recursive: true });

for (const page of pages) {
  await writeFile(path.join(outputDir, `${page.slug}.html`), renderPage(page), 'utf8');
}

console.log(`Generated ${pages.length} conversion pages in ${outputDir}`);
