const fs = require('fs');
const file = 'index.html';
let html = fs.readFileSync(file, 'utf8');

const sqlRegex = /<div class="grid grid-cols-1 gap-4 h-\[400px\]">\s*<textarea id="sqlInput"[\s\S]*?<\/textarea>\s*<\/div>/;
if (sqlRegex.test(html)) {
  console.log('Matches!');
  html = html.replace(sqlRegex, `<div class="grid grid-cols-1 md:grid-cols-2 gap-4 min-h-[400px]">
              <textarea id="sqlInput" class="w-full min-h-[400px] p-4 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700/60 rounded-xl outline-none resize-y text-sm text-slate-800 dark:text-slate-200 font-mono shadow-sm" style="height: auto;" placeholder="Paste unformatted SQL here..." spellcheck="false" oninput="this.style.height='auto'; this.style.height = this.scrollHeight + 'px'; const out = document.getElementById('sqlOutput'); if(out) { out.style.height='auto'; out.style.height = out.scrollHeight + 'px'; }"></textarea>
              <textarea id="sqlOutput" class="w-full min-h-[400px] p-4 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700/60 rounded-xl outline-none resize-y text-sm text-slate-800 dark:text-slate-200 font-mono shadow-sm" style="height: auto;" readonly placeholder="Formatted SQL will appear here..." spellcheck="false"></textarea>
            </div>`);
  fs.writeFileSync(file, html);
  console.log('Replaced.');
} else {
  console.log('No match for sql-formatter');
}
