const fs = require('fs');
const path = require('path');

function createGuide(id, title, desc, features, openLink, faq) {
  const content = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  
  <title>${title} Guide - WeConvertFiles</title>
  <meta name="description" content="${desc}" />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="https://www.weconvertfiles.com/guides/${id}.html" />
  <meta property="og:type" content="article" />
  <meta property="og:site_name" content="WeConvertFiles" />
  <meta property="og:title" content="${title} Guide - WeConvertFiles" />
  <meta property="og:description" content="${desc}" />
  <meta property="og:url" content="https://www.weconvertfiles.com/guides/${id}.html" />
  <meta property="og:image" content="https://www.weconvertfiles.com/assets/logo.png" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title} Guide - WeConvertFiles" />
  <meta name="twitter:description" content="${desc}" />
  <meta name="twitter:image" content="https://www.weconvertfiles.com/assets/logo.png" />
  <link rel="stylesheet" href="/assets/styles.css?v=20260729-4" />
  <script>
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  </script>
  <script src="../layout.js" defer></script>
  <link rel="icon" type="image/svg+xml" href="/assets/favicon.svg?v=3" />
  <link rel="icon" type="image/png" href="/assets/favicon.png?v=3" />
  <link rel="apple-touch-icon" href="/assets/favicon.png?v=3" />
</head>
<body class="bg-[#f8fafd] dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 antialiased transition-colors duration-200">
  <main class="mx-auto max-w-4xl px-4 py-10">
    <div class="flex items-center justify-between mb-8">
      <a class="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-[#1e293b] px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 shadow-sm transition hover:bg-slate-50 dark:hover:bg-slate-800/80" href="/">
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
        Back to Home
      </a>
      <span class="text-xs font-semibold text-slate-500 dark:text-slate-400">WeConvertFiles Guide</span>
    </div>

    <section class="rounded-3xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-[#1e293b] p-6 shadow-sm sm:p-8">
      <div class="flex items-center gap-3">
        <h1 class="text-3xl font-semibold tracking-tight sm:text-4xl text-slate-950 dark:text-slate-100">${title}</h1>
        <span class="rounded-full bg-blue-50 dark:bg-blue-950/30 px-2.5 py-0.5 text-[10px] font-semibold text-[#1a73e8] dark:text-blue-400 border border-blue-200/50 dark:border-blue-900/50">100% Client-Side</span>
      </div>
      <p class="mt-4 leading-relaxed text-slate-600 dark:text-slate-400">${desc} The entire processing executes locally in sandboxed javascript memory, protecting user data from external storage leaks.</p>
      <a class="mt-6 inline-flex items-center gap-2 rounded-full bg-[#1a73e8] hover:bg-[#1967d2] px-6 py-3 text-sm font-bold text-white shadow-md transition duration-200" href="/${id}">
        Open ${openLink}
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
      </a>
    </section>

    <h2 class="text-xl font-bold mt-10 mb-4 text-slate-900 dark:text-slate-100">How It Works</h2>
    <section class="grid gap-4 md:grid-cols-3">
      <div class="rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-[#1e293b] p-5 shadow-sm">
        <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950 text-sm font-bold text-[#1a73e8] dark:text-blue-400">1</span>
        <h3 class="font-bold text-slate-900 dark:text-slate-200 mt-3">${features[0].title}</h3>
        <p class="mt-2 text-xs leading-5 text-slate-600 dark:text-slate-400">${features[0].desc}</p>
      </div>
      <div class="rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-[#1e293b] p-5 shadow-sm">
        <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950 text-sm font-bold text-indigo-600 dark:text-indigo-400">2</span>
        <h3 class="font-bold text-slate-900 dark:text-slate-200 mt-3">${features[1].title}</h3>
        <p class="mt-2 text-xs leading-5 text-slate-600 dark:text-slate-400">${features[1].desc}</p>
      </div>
      <div class="rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-[#1e293b] p-5 shadow-sm">
        <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950 text-sm font-bold text-emerald-600 dark:text-emerald-400">3</span>
        <h3 class="font-bold text-slate-900 dark:text-slate-200 mt-3">${features[2].title}</h3>
        <p class="mt-2 text-xs leading-5 text-slate-600 dark:text-slate-400">${features[2].desc}</p>
      </div>
    </section>

    <h2 class="text-xl font-bold mt-10 mb-4 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
    <section class="rounded-3xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-[#1e293b] p-6 shadow-sm space-y-5">
      <div>
        <h3 class="font-bold text-sm text-slate-900 dark:text-slate-200">${faq.q}</h3>
        <p class="mt-2 text-xs leading-5 text-slate-600 dark:text-slate-400">${faq.a}</p>
      </div>
    </section>
  </main>
</body>
</html>`;

  fs.writeFileSync(path.join(__dirname, '../guides', id + '.html'), content);
}

createGuide(
  'json-yaml',
  'JSON ↔ YAML Converter',
  'Convert JSON to YAML and YAML to JSON locally in your browser with real-time validation and formatting.',
  [
    { title: 'Input Data', desc: 'Paste your raw JSON or YAML text block directly inside the input area.' },
    { title: 'Convert & Validate', desc: 'Click swap to change conversion direction. The engine highlights syntax errors instantly if present.' },
    { title: 'Copy / Download', desc: 'Copy the formatted JSON or YAML to your clipboard, or download it as a file with one click.' }
  ],
  'JSON ↔ YAML',
  { q: 'Is my data secure during conversion?', a: 'Yes. Unlike online services that upload your payload to dynamic servers, WeConvertFiles converts and validates text entirely client-side using JavaScript. No confidential data leaves your browser.' }
);

createGuide(
  'sql-formatter',
  'SQL Formatter & Beautifier',
  'Format and beautify SQL queries locally in your browser supporting MySQL, PostgreSQL, and SQL Server dialects.',
  [
    { title: 'Input SQL', desc: 'Paste your unformatted, minified, or raw SQL queries into the input box.' },
    { title: 'Select Options', desc: 'Choose your preferred SQL dialect (Standard, MySQL, PostgreSQL, T-SQL) and keyword casing (Upper/Lower).' },
    { title: 'Format & Export', desc: 'Click "Format SQL" to beautify the code instantly. Copy or download the clean SQL query.' }
  ],
  'SQL Formatter',
  { q: 'Does this execute my SQL queries?', a: 'No, this tool ONLY formats the text. It never executes your SQL queries, and the formatting process runs entirely locally on your device for absolute safety and speed.' }
);

createGuide(
  'code-minifier',
  'Code Minifier & Beautifier',
  'Minify and beautify HTML, CSS, and JavaScript code locally in your browser to optimize web performance.',
  [
    { title: 'Input Code', desc: 'Paste your HTML, CSS, or JavaScript source code directly inside the input area.' },
    { title: 'Select Language', desc: 'Choose the appropriate programming language from the dropdown menu to apply the correct parsing rules.' },
    { title: 'Minify or Beautify', desc: 'Click "Minify" to compress your code and save bandwidth, or "Beautify" to format it cleanly for reading.' }
  ],
  'Code Minifier',
  { q: 'Why do I need to minify my code?', a: 'Minification removes unnecessary whitespace, comments, and line breaks from your source code. This reduces file size, which speeds up load times and saves bandwidth on your web server.' }
);

console.log('Guides generated.');
