const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '../index.html');
let html = fs.readFileSync(file, 'utf8');

// 1. Remove the huge HTML templates from the `icons` object that got inserted by mistake
// The icons object has them around line 2170 to 2240. We can replace the global match.
// Let's manually restore the icons for the new tools.
html = html.replace(
  /'json-yaml': `[\s\S]*?<div id="jyError"[\s\S]*?<\/div>\s*`,\s*'sql-formatter': `[\s\S]*?<div id="sqlError"[\s\S]*?<\/div>\s*<\/div>\s*`,\s*'code-minifier': `[\s\S]*?<div id="cmError"[\s\S]*?<\/div>\s*<\/div>\s*`,/g,
  function(match, offset, string) {
    // Only replace the one that comes before the SVG diff-checker icon!
    if (string.substr(offset, 5000).includes('<svg class="${iconClass}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 9h4M15 15h4" stroke-width="2.5"/><rect x="2" y="3" width="20" height="18" rx="2" opacity=".35"/></svg>`')) {
      return `'json-yaml': \`<svg class="\${iconClass}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7V4h16v3M9 20h6M12 4v16"/></svg>\`,\n        'sql-formatter': \`<svg class="\${iconClass}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7V4h16v3M9 20h6M12 4v16"/></svg>\`,\n        'code-minifier': \`<svg class="\${iconClass}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7V4h16v3M9 20h6M12 4v16"/></svg>\`,`;
    }
    return match; // Leave the panels one intact!
  }
);

// 2. Fix json-yaml layout (h-[400px] -> min-h-[400px]) and add oninput auto-resize
html = html.replace(
  /<div class="grid grid-cols-1 md:grid-cols-2 gap-4 h-\[400px\]">([\s\S]*?)<div id="jyError"/,
  function(match, inner) {
    let replaced = inner;
    replaced = replaced.replace(
      /id="jyInput" class="([^"]*?resize-none[^"]*?)"/,
      'id="jyInput" class="$1" style="min-height: 400px; height: auto;" oninput="this.style.height=\'auto\'; this.style.height = this.scrollHeight + \'px\'; const out = document.getElementById(\'jyOutput\'); if(out) { out.style.height=\'auto\'; out.style.height = out.scrollHeight + \'px\'; }"'
    );
    replaced = replaced.replace(
      /id="jyOutput" class="([^"]*?resize-none[^"]*?)"/,
      'id="jyOutput" class="$1" style="min-height: 400px; height: auto;"'
    );
    return '<div class="grid grid-cols-1 md:grid-cols-2 gap-4 min-h-[400px]">' + replaced + '<div id="jyError"';
  }
);

// 3. Fix sql-formatter layout (h-[400px] -> split layout)
html = html.replace(
  /<div class="grid grid-cols-1 gap-4 h-\[400px\]">\s*<textarea id="sqlInput"[^>]*><\/textarea>\s*<\/div>/,
  `<div class="grid grid-cols-1 md:grid-cols-2 gap-4 min-h-[400px]">
              <textarea id="sqlInput" class="w-full min-h-[400px] p-4 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700/60 rounded-xl outline-none resize-none text-sm text-slate-800 dark:text-slate-200 font-mono shadow-sm" style="height: auto;" placeholder="Paste unformatted SQL here..." spellcheck="false" oninput="this.style.height='auto'; this.style.height = this.scrollHeight + 'px'; const out = document.getElementById('sqlOutput'); if(out) { out.style.height='auto'; out.style.height = out.scrollHeight + 'px'; }"></textarea>
              <textarea id="sqlOutput" class="w-full min-h-[400px] p-4 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700/60 rounded-xl outline-none resize-none text-sm text-slate-800 dark:text-slate-200 font-mono shadow-sm" style="height: auto;" readonly placeholder="Formatted SQL will appear here..." spellcheck="false"></textarea>
            </div>`
);

// 4. Fix code-minifier layout
html = html.replace(
  /<div class="grid grid-cols-1 md:grid-cols-2 gap-4 h-\[400px\]">([\s\S]*?)<div id="cmStats"/,
  function(match, inner) {
    let replaced = inner;
    replaced = replaced.replace(
      /id="cmInput" class="([^"]*?h-full[^"]*?)"/,
      'id="cmInput" class="$1" style="min-height: 400px; height: auto;" oninput="this.style.height=\'auto\'; this.style.height = this.scrollHeight + \'px\'; const out = document.getElementById(\'cmOutput\'); if(out) { out.style.height=\'auto\'; out.style.height = out.scrollHeight + \'px\'; }"'
    );
    replaced = replaced.replace(
      /id="cmOutput" class="([^"]*?h-full[^"]*?)"/,
      'id="cmOutput" class="$1" style="min-height: 400px; height: auto;"'
    );
    return '<div class="grid grid-cols-1 md:grid-cols-2 gap-4 min-h-[400px]">' + replaced + '<div id="cmStats"';
  }
);

// Remove the `h-full` class from cmInput and cmOutput since they shouldn't force 100% height anymore,
// as they are using min-height and height: auto
html = html.replace(/id="cmInput" class="w-full h-full/g, 'id="cmInput" class="w-full');
html = html.replace(/id="cmOutput" class="w-full h-full/g, 'id="cmOutput" class="w-full');

// 5. Download buttons border fix
html = html.replace(/bg-teal-50 text-teal-600 rounded(?!-)/g, 'bg-teal-50 text-teal-600 border border-teal-200 dark:border-teal-900/50 rounded');
html = html.replace(/bg-teal-50 text-teal-600 rounded-lg/g, 'bg-teal-50 text-teal-600 border border-teal-200 dark:border-teal-900/50 rounded-lg');


// 6. Guides links
const newGuides = `
                <a class="rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-slate-50 dark:bg-slate-900/60 p-4 text-sm font-semibold text-slate-800 dark:text-slate-200 transition hover:border-[#1a73e8] hover:bg-[#f5f9ff] dark:hover:bg-[#1a73e8]/10" href="/guides/json-yaml.html">JSON ↔ YAML Guide</a>
                <a class="rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-slate-50 dark:bg-slate-900/60 p-4 text-sm font-semibold text-slate-800 dark:text-slate-200 transition hover:border-[#1a73e8] hover:bg-[#f5f9ff] dark:hover:bg-[#1a73e8]/10" href="/guides/sql-formatter.html">SQL Formatter Guide</a>
                <a class="rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-slate-50 dark:bg-slate-900/60 p-4 text-sm font-semibold text-slate-800 dark:text-slate-200 transition hover:border-[#1a73e8] hover:bg-[#f5f9ff] dark:hover:bg-[#1a73e8]/10" href="/guides/code-minifier.html">Code Minifier Guide</a>
`;
html = html.replace(/(<a class="rounded-2xl[^>]*href="\/guides\/json-convert\.html"[^>]*>.*?<\/a>)/g, '$1\n' + newGuides);

fs.writeFileSync(file, html);
