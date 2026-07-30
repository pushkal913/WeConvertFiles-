const fs = require('fs');
const path = require('path');

let redPath = path.join(__dirname, '../_redirects');
let red = fs.readFileSync(redPath, 'utf8');

// Remove the wrongly appended ones from the bottom
red = red.replace(/\n\/json-yaml \/index\.html 200/g, '');
red = red.replace(/\n\/sql-formatter \/index\.html 200/g, '');
red = red.replace(/\n\/code-minifier \/index\.html 200/g, '');

// Append SPA routes before the 404 catch-all
const newSpaRoutes = `
/json-yaml    /index.html    200
/sql-formatter    /index.html    200
/code-minifier    /index.html    200
`;
red = red.replace(/\/\*\s*\/404\.html\s*404/, newSpaRoutes + '\n/*    /404.html    404');

// Append guides clean url redirects
const newGuides = `
/guides/json-yaml    /guides/json-yaml.html    301
/guides/sql-formatter    /guides/sql-formatter.html    301
/guides/code-minifier    /guides/code-minifier.html    301
`;
red = red.replace(/(\/guides\/svg-to-image\s*\/guides\/svg-to-image\.html\s*301)/, '$1' + newGuides);

fs.writeFileSync(redPath, red);

let valPath = path.join(__dirname, 'validate-conversion-pages.mjs');
let valScript = fs.readFileSync(valPath, 'utf8');
valScript = valScript.replace(/expected 96 sitemap URLs/g, 'expected 102 sitemap URLs');
valScript = valScript.replace(/sitemapUrls\.length === 96/g, 'sitemapUrls.length === 102');
fs.writeFileSync(valPath, valScript);
