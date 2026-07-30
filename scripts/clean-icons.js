const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '../index.html');
let html = fs.readFileSync(file, 'utf8');

// The HTML template block inside icons starts at 'json-yaml': \` and ends after the 'code-minifier' error div.
// It was injected before 'diff-checker': \`<svg...
html = html.replace(
  /'json-yaml': `\n\s*<div class="grid grid-cols-1 md:grid-cols-2 gap-4 min-h-\[400px\]">[\s\S]*?<div id="cmError"[^>]*><\/div>\s*<\/div>\s*`,\s*/,
  ''
);

// wait, the previous replace made them min-h-[400px]. Let's match it correctly.
// Let's use a very specific match.
const startStr = `'json-yaml': \`\n          <div class="grid`;
const startIndex = html.indexOf(startStr);
if (startIndex !== -1) {
  const endIndex = html.indexOf(`'diff-checker': \`<svg class="\${iconClass}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 9h4M15 15h4" stroke-width="2.5"/><rect x="2" y="3" width="20" height="18" rx="2" opacity=".35"/></svg>\`,`);
  
  if (endIndex !== -1 && endIndex > startIndex) {
    // Make sure we are replacing the one inside `icons` which is around line 2170
    if (startIndex < 100000) { // arbitrary, just to ensure it's the first one
      html = html.substring(0, startIndex) + html.substring(endIndex);
    }
  }
}

fs.writeFileSync(file, html);
