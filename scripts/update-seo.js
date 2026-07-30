const fs = require('fs');
const path = require('path');

let smPath = path.join(__dirname, '../sitemap.xml');
let sm = fs.readFileSync(smPath, 'utf8');
const toAdd = `
  <url>
    <loc>https://www.weconvertfiles.com/json-yaml</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://www.weconvertfiles.com/sql-formatter</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://www.weconvertfiles.com/code-minifier</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://www.weconvertfiles.com/guides/json-yaml.html</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://www.weconvertfiles.com/guides/sql-formatter.html</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://www.weconvertfiles.com/guides/code-minifier.html</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`;
sm = sm.replace('</urlset>', toAdd + '\n</urlset>');
fs.writeFileSync(smPath, sm);

let redPath = path.join(__dirname, '../_redirects');
let red = fs.readFileSync(redPath, 'utf8');
const redAdd = `
/json-yaml /index.html 200
/sql-formatter /index.html 200
/code-minifier /index.html 200`;
fs.writeFileSync(redPath, red + redAdd);
