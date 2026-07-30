const fs = require('fs');
const path = require('path');

const indexFile = path.join(__dirname, '../index.html');
let indexHtml = fs.readFileSync(indexFile, 'utf8');

// 1. Add to converterLibraries
indexHtml = indexHtml.replace(
  /diff: \{\s*src: '.*?diff_match_patch\.js',\s*ready: \(\) => Boolean\(window\.diff_match_patch\)\s*\}/g,
  `diff: {
        src: 'https://cdnjs.cloudflare.com/ajax/libs/diff_match_patch/20121119/diff_match_patch.js',
        ready: () => Boolean(window.diff_match_patch)
      },
      jsyaml: {
        src: 'https://cdnjs.cloudflare.com/ajax/libs/js-yaml/4.1.0/js-yaml.min.js',
        ready: () => Boolean(window.jsyaml)
      },
      sqlformatter: {
        src: 'https://cdnjs.cloudflare.com/ajax/libs/sql-formatter/15.3.2/sql-formatter.min.js',
        ready: () => Boolean(window.sqlFormatter)
      },
      terser: {
        src: 'https://cdn.jsdelivr.net/npm/terser/dist/bundle.min.js',
        ready: () => Boolean(window.Terser)
      },
      jsbeautify: {
        src: 'https://cdnjs.cloudflare.com/ajax/libs/js-beautify/1.15.1/beautifier.min.js',
        ready: () => Boolean(window.html_beautify)
      },
      jsbeautifyCss: {
        src: 'https://cdnjs.cloudflare.com/ajax/libs/js-beautify/1.15.1/beautify-css.min.js',
        ready: () => Boolean(window.css_beautify)
      },
      jsbeautifyHtml: {
        src: 'https://cdnjs.cloudflare.com/ajax/libs/js-beautify/1.15.1/beautify-html.min.js',
        ready: () => Boolean(window.html_beautify)
      }`
);

// 2. Add to toolLibraryDependencies
indexHtml = indexHtml.replace(
  /'decrypt-pdf': \['pdflib', 'pdfjs', 'jspdf'\]\s*\}/g,
  `'decrypt-pdf': ['pdflib', 'pdfjs', 'jspdf'],
      'json-yaml': ['jsyaml'],
      'sql-formatter': ['sqlformatter'],
      'code-minifier': ['terser', 'jsbeautify', 'jsbeautifyCss', 'jsbeautifyHtml']
    }`
);

// 3. Add to interactiveLibraryTools
indexHtml = indexHtml.replace(
  /'diff-checker'\s*\]\);/g,
  `'diff-checker',
      'json-yaml',
      'sql-formatter',
      'code-minifier'
    ]);`
);

// 4. Add to const tools array
const toolsToAdd = `,{
        id: 'json-yaml',
        title: 'JSON ↔ YAML',
        kicker: 'Data & Document Conversion',
        badge: 'Two-way',
        icon: 'JY',
        iconBg: 'bg-indigo-100',
        iconColor: 'text-indigo-600',
        description: 'Convert JSON to YAML and YAML to JSON with syntax validation and output formatting.',
        hint: 'Paste JSON or YAML below to convert.',
        accept: 'application/json,application/x-yaml',
        multiple: false,
        notes: ['Bi-directional JSON/YAML converter.', 'Validates syntax instantly.', 'One-click copy and download.']
      },
      {
        id: 'sql-formatter',
        title: 'SQL Formatter',
        kicker: 'Developer Tools',
        badge: 'Beautifier',
        icon: 'SQL',
        iconBg: 'bg-emerald-100',
        iconColor: 'text-emerald-700',
        description: 'Format standard SQL, MySQL, PostgreSQL, and SQL Server queries beautifully.',
        hint: 'Paste your raw SQL query below to format.',
        accept: 'application/sql',
        multiple: false,
        notes: ['Formats standard SQL dialects.', 'Customizable casing and indentation.', 'Client-side processing only.']
      },
      {
        id: 'code-minifier',
        title: 'Code Minifier & Beautifier',
        kicker: 'Developer Tools',
        badge: 'HTML/CSS/JS',
        icon: 'MIN',
        iconBg: 'bg-sky-100',
        iconColor: 'text-sky-700',
        description: 'Minify or beautify HTML, CSS, and JavaScript source code instantly.',
        hint: 'Paste code below and choose minify or beautify.',
        accept: 'text/html,text/css,text/javascript',
        multiple: false,
        notes: ['Minifies JS via Terser.', 'Beautifies HTML/CSS/JS.', 'Shows output savings %.']
      }`;

// We will find the end of the const tools array.
indexHtml = indexHtml.replace(
  /notes: \['Converts locally using marked\.js\.', 'Allows copying raw HTML\.'\]\s*\}\s*\];/g,
  `notes: ['Converts locally using marked.js.', 'Allows copying raw HTML.']
      }${toolsToAdd}
    ];`
);

// 5. Add to toolCategories inside categories
// Data & Document Conversion
indexHtml = indexHtml.replace(
  /tools: \['excel-to-csv', 'json-convert', 'csv-convert'\]/g,
  `tools: ['excel-to-csv', 'json-convert', 'csv-convert', 'json-yaml']`
);
// Text & Developer Utilities
indexHtml = indexHtml.replace(
  /tools: \['qr-generator', 'word-counter', 'json-formatter', 'diff-checker', 'url-base64', 'markdown-preview', 'regex-tester', 'jwt-decoder', 'uuid-generator', 'hash-generator', 'unix-converter'\]/g,
  `tools: ['qr-generator', 'word-counter', 'json-formatter', 'diff-checker', 'url-base64', 'markdown-preview', 'regex-tester', 'jwt-decoder', 'uuid-generator', 'hash-generator', 'unix-converter', 'sql-formatter', 'code-minifier']`
);

// 6. Add toolIcons
const iconsToAdd = `,
        'json-yaml': \`<svg class="\${iconClass}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7V4h16v3M9 20h6M12 4v16" opacity="0.4"/><path d="M4 14l4-4 4 4"/></svg>\`,
        'sql-formatter': \`<svg class="\${iconClass}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3" opacity="0.4"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>\`,
        'code-minifier': \`<svg class="\${iconClass}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 18l6-6-6-6M8 6l-6 6 6 6" opacity="0.4"/><path d="M12 2v20"/></svg>\``;

indexHtml = indexHtml.replace(
  /'unix-converter': \`(.*?)\`/g,
  `'unix-converter': \`$1\`${iconsToAdd}`
);

// 7. Add isInteractiveOnly
indexHtml = indexHtml.replace(
  /const isInteractiveOnly = \['word-counter', 'diff-checker', 'markdown-preview', 'url-base64', 'json-formatter', 'qr-generator', 'hash-generator', 'regex-tester', 'jwt-decoder'\]\.includes\(toolId\);/g,
  `const isInteractiveOnly = ['word-counter', 'diff-checker', 'markdown-preview', 'url-base64', 'json-formatter', 'qr-generator', 'hash-generator', 'regex-tester', 'jwt-decoder', 'json-yaml', 'sql-formatter', 'code-minifier'].includes(toolId);`
);

// Also hide the generic convert button
indexHtml = indexHtml.replace(
  /convertButton\.classList\.toggle\('hidden', \['color-palette', 'json-formatter', 'qr-generator', 'hash-generator', 'image-to-base64', 'base64-to-image', 'svg-to-image'\]\.includes\(toolId\)\);/g,
  `convertButton.classList.toggle('hidden', ['color-palette', 'json-formatter', 'qr-generator', 'hash-generator', 'image-to-base64', 'base64-to-image', 'svg-to-image', 'json-yaml', 'sql-formatter', 'code-minifier'].includes(toolId));`
);

// 8. Add toolContentMap HTML
const toolHtmlToAdd = `
        'json-yaml': \`
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 h-[400px]">
            <div class="flex flex-col h-full bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700/60 rounded-xl overflow-hidden shadow-sm">
              <div class="flex items-center justify-between px-4 py-2 border-b border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800">
                <span class="text-xs font-bold text-slate-500 uppercase">Input</span>
                <button type="button" id="jySwapBtn" class="p-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 transition" aria-label="Swap directions" title="Swap Input/Output"><svg class="w-4 h-4 text-slate-600 dark:text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 7h12M16 3l4 4-4 4M16 17H4M8 21l-4-4 4-4"/></svg></button>
              </div>
              <textarea id="jyInput" class="flex-grow w-full p-4 bg-transparent outline-none resize-none text-sm text-slate-800 dark:text-slate-200 font-mono" placeholder="Paste JSON or YAML here..." spellcheck="false"></textarea>
            </div>
            <div class="flex flex-col h-full bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700/60 rounded-xl overflow-hidden shadow-sm">
              <div class="flex items-center justify-between px-4 py-2 border-b border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800">
                <span class="text-xs font-bold text-slate-500 uppercase">Output</span>
                <div class="flex gap-2">
                  <button type="button" id="jyCopyBtn" class="px-2 py-1 text-xs font-bold bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition">Copy</button>
                  <button type="button" id="jyDownloadBtn" class="px-2 py-1 text-xs font-bold bg-teal-50 text-teal-600 rounded hover:bg-teal-100 transition">Download</button>
                  <button type="button" id="jyClearBtn" class="px-2 py-1 text-xs font-bold bg-rose-50 text-rose-600 rounded hover:bg-rose-100 transition">Clear</button>
                </div>
              </div>
              <textarea id="jyOutput" class="flex-grow w-full p-4 bg-transparent outline-none resize-none text-sm text-slate-800 dark:text-slate-200 font-mono" readonly placeholder="Output will appear here..."></textarea>
            </div>
          </div>
          <div id="jyError" class="mt-4 p-3 bg-rose-50 dark:bg-rose-950/30 text-rose-600 border border-rose-200 dark:border-rose-900/50 rounded-lg text-sm hidden font-mono"></div>
        \`,
        'sql-formatter': \`
          <div class="flex flex-col gap-4">
            <div class="flex flex-wrap gap-3">
              <select id="sqlDialect" class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 outline-none">
                <option value="sql">Standard SQL</option>
                <option value="mysql">MySQL</option>
                <option value="postgresql">PostgreSQL</option>
                <option value="tsql">SQL Server</option>
              </select>
              <select id="sqlCasing" class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 outline-none">
                <option value="upper">UPPERCASE</option>
                <option value="lower">lowercase</option>
              </select>
              <button type="button" id="sqlFormatBtn" class="px-4 py-2 bg-[#1a73e8] text-white rounded-lg text-sm font-bold shadow hover:bg-[#1967d2] transition">Format SQL</button>
              <button type="button" id="sqlCopyBtn" class="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-bold hover:bg-blue-100 transition">Copy</button>
              <button type="button" id="sqlDownloadBtn" class="px-4 py-2 bg-teal-50 text-teal-600 rounded-lg text-sm font-bold hover:bg-teal-100 transition">Download</button>
              <button type="button" id="sqlClearBtn" class="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-bold hover:bg-slate-200 transition">Clear</button>
            </div>
            <div class="grid grid-cols-1 gap-4 h-[400px]">
              <textarea id="sqlInput" class="w-full h-full p-4 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700/60 rounded-xl outline-none resize-none text-sm text-slate-800 dark:text-slate-200 font-mono shadow-sm" placeholder="Paste unformatted SQL here..." spellcheck="false"></textarea>
            </div>
            <div id="sqlError" class="p-3 bg-rose-50 dark:bg-rose-950/30 text-rose-600 border border-rose-200 dark:border-rose-900/50 rounded-lg text-sm hidden font-mono"></div>
          </div>
        \`,
        'code-minifier': \`
          <div class="flex flex-col gap-4">
            <div class="flex flex-wrap items-center gap-3">
              <select id="cmLang" class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 outline-none">
                <option value="html">HTML</option>
                <option value="css">CSS</option>
                <option value="js">JavaScript</option>
              </select>
              <button type="button" id="cmMinifyBtn" class="px-4 py-2 bg-[#1a73e8] text-white rounded-lg text-sm font-bold shadow hover:bg-[#1967d2] transition">Minify</button>
              <button type="button" id="cmBeautifyBtn" class="px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-bold shadow hover:bg-emerald-600 transition">Beautify</button>
              <button type="button" id="cmCopyBtn" class="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-bold hover:bg-blue-100 transition">Copy</button>
              <button type="button" id="cmDownloadBtn" class="px-4 py-2 bg-teal-50 text-teal-600 rounded-lg text-sm font-bold hover:bg-teal-100 transition">Download</button>
              <button type="button" id="cmClearBtn" class="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-bold hover:bg-slate-200 transition">Clear</button>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 h-[400px]">
              <textarea id="cmInput" class="w-full h-full p-4 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700/60 rounded-xl outline-none resize-none text-sm text-slate-800 dark:text-slate-200 font-mono shadow-sm" placeholder="Paste HTML, CSS, or JS code here..." spellcheck="false"></textarea>
              <textarea id="cmOutput" class="w-full h-full p-4 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700/60 rounded-xl outline-none resize-none text-sm text-slate-800 dark:text-slate-200 font-mono shadow-sm" readonly placeholder="Output will appear here..."></textarea>
            </div>
            <div id="cmStats" class="flex gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400 mt-2">
              <span>Input: <span id="cmInSize">0 B</span></span>
              <span>Output: <span id="cmOutSize">0 B</span></span>
              <span>Saved: <span id="cmSaved" class="text-emerald-600 dark:text-emerald-400">0%</span></span>
            </div>
            <div id="cmError" class="p-3 bg-rose-50 dark:bg-rose-950/30 text-rose-600 border border-rose-200 dark:border-rose-900/50 rounded-lg text-sm hidden font-mono mt-2"></div>
          </div>
        \`,`;

indexHtml = indexHtml.replace(
  /'diff-checker': \`/g,
  `${toolHtmlToAdd}
        'diff-checker': \``
);

fs.writeFileSync(indexFile, indexHtml);
