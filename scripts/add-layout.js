const fs = require('fs');
const path = require('path');

const layoutFile = path.join(__dirname, '../layout.js');
let layoutJs = fs.readFileSync(layoutFile, 'utf8');

// 1. Add to const tools = [
const toolsToAdd = `,
      { id: 'json-yaml', title: 'JSON ↔ YAML', kicker: 'Data & Document Conversion', badge: 'Two-way', iconBg: 'bg-indigo-100', iconColor: 'text-indigo-600' },
      { id: 'sql-formatter', title: 'SQL Formatter', kicker: 'Developer Tools', badge: 'Beautifier', iconBg: 'bg-emerald-100', iconColor: 'text-emerald-700' },
      { id: 'code-minifier', title: 'Code Minifier & Beautifier', kicker: 'Developer Tools', badge: 'HTML/CSS/JS', iconBg: 'bg-sky-100', iconColor: 'text-sky-700' }`;

layoutJs = layoutJs.replace(
  /\{ id: 'svg-to-image', title: 'SVG to PNG \/ JPG', kicker: 'Image Tools', badge: 'Vector Export', iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600' \}\s*\];/g,
  `{ id: 'svg-to-image', title: 'SVG to PNG / JPG', kicker: 'Image Tools', badge: 'Vector Export', iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600' }${toolsToAdd}\n    ];`
);

// 2. Add to desktop nav after csv-convert
const navJsonYaml = `
              <a class="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-[#1a73e8] dark:hover:text-white transition-colors whitespace-nowrap" href="/json-yaml">
                <svg class="h-4 w-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4 7V4h16v3M9 20h6M12 4v16" opacity="0.4"/>
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4 14l4-4 4 4"/>
                </svg>
                JSON ↔ YAML
              </a>`;

layoutJs = layoutJs.replace(
  /CSV to JSON \/ Excel\s*<\/a>/g,
  `CSV to JSON / Excel\n              </a>${navJsonYaml}`
);

// 3. Add to desktop nav after json-formatter
const navSqlCode = `
              <a class="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-[#1a73e8] dark:hover:text-white transition-colors whitespace-nowrap" href="/sql-formatter">
                <svg class="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <ellipse cx="12" cy="5" rx="9" ry="3" opacity="0.4"/>
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
                </svg>
                SQL Formatter
              </a>
              <a class="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-[#1a73e8] dark:hover:text-white transition-colors whitespace-nowrap" href="/code-minifier">
                <svg class="h-4 w-4 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16 18l6-6-6-6M8 6l-6 6 6 6" opacity="0.4"/>
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 2v20"/>
                </svg>
                Code Minifier
              </a>`;

layoutJs = layoutJs.replace(
  /JSON Formatter \/ Validator\s*<\/a>/g,
  `JSON Formatter / Validator\n              </a>${navSqlCode}`
);

fs.writeFileSync(layoutFile, layoutJs);
