const fs = require('fs');
const path = require('path');

const indexFile = path.join(__dirname, '../index.html');
let indexHtml = fs.readFileSync(indexFile, 'utf8');

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

indexHtml = indexHtml.replace(
  /notes: \['Decrypts locally in your browser\.', 'Generates a fully unlocked PDF\.', 'You must enter the correct password\.'\]\s*\}\s*\];/g,
  `notes: ['Decrypts locally in your browser.', 'Generates a fully unlocked PDF.', 'You must enter the correct password.']
      }${toolsToAdd}
    ];`
);

fs.writeFileSync(indexFile, indexHtml);
