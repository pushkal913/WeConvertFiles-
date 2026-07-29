import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const stylesheetUrl = '/assets/styles.css?v=20260729-2';
const pageDirectories = [
  rootDir,
  path.join(rootDir, 'convert'),
  path.join(rootDir, 'guides')
];
const pageFiles = [];

for (const directory of pageDirectories) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith('.html') || entry.name === '404.html') continue;
    pageFiles.push(path.join(directory, entry.name));
  }
}

const failures = [];
for (const file of pageFiles) {
  const html = await readFile(file, 'utf8');
  const stylesheetCount = html.split(stylesheetUrl).length - 1;

  if (stylesheetCount !== 1) {
    failures.push(`${path.relative(rootDir, file)} has ${stylesheetCount} versioned stylesheet references`);
  }
  if (html.includes('cdn.tailwindcss.com') || html.includes('tailwind.config')) {
    failures.push(`${path.relative(rootDir, file)} still includes the Tailwind browser runtime`);
  }
}

const generator = await readFile(path.join(rootDir, 'scripts', 'generate-conversion-pages.mjs'), 'utf8');
if (!generator.includes(stylesheetUrl)) {
  failures.push('The conversion-page generator does not include the versioned static stylesheet');
}
if (generator.includes('cdn.tailwindcss.com') || generator.includes('tailwind.config')) {
  failures.push('The conversion-page generator still includes the Tailwind browser runtime');
}

const css = await readFile(path.join(rootDir, 'assets', 'styles.css'), 'utf8');
const homepage = await readFile(path.join(rootDir, 'index.html'), 'utf8');
const requiredSelectors = [
  'md\\:grid-cols-2',
  'dark\\:bg-\\[\\#0b0f19\\]',
  'aspect-\\[3\\/4\\]',
  'z-\\[9999\\]',
  'shadow-material',
  'shadow-lift'
];

for (const selector of requiredSelectors) {
  if (!css.includes(selector)) failures.push(`Compiled CSS is missing ${selector}`);
}

const cardBorderColors = [...homepage.matchAll(/iconColor:\s*'text-([^']+)'/g)]
  .map(match => match[1])
  .filter((color, index, colors) => colors.indexOf(color) === index);

for (const color of cardBorderColors) {
  const cardSelectors = [
    `border-${color}\\\/\\[0\\.48\\]`,
    `dark\\:border-${color}\\\/\\[0\\.54\\]`,
    `hover\\:border-${color}\\\/90`
  ];
  for (const selector of cardSelectors) {
    if (!css.includes(selector)) failures.push(`Compiled CSS is missing dynamic card selector ${selector}`);
  }
}

const requiredGlowValues = [
  'rgba(var(--glow-rgb),0.096)',
  'rgba(var(--glow-rgb),0.30)'
];
for (const glowValue of requiredGlowValues) {
  if (!homepage.includes(glowValue)) failures.push(`Homepage is missing tool-card glow value ${glowValue}`);
  if (!css.includes(glowValue)) failures.push(`Compiled CSS is missing tool-card glow value ${glowValue}`);
}

if (failures.length) {
  console.error(`Static CSS validation failed:\n- ${failures.join('\n- ')}`);
  process.exit(1);
}

console.log('Static CSS validation passed.');
console.log(`- ${pageFiles.length} styled HTML pages use ${stylesheetUrl}`);
console.log('- no page or generator uses the Tailwind browser runtime');
console.log(`- compiled CSS contains ${requiredSelectors.length} critical responsive and dynamic selectors`);
console.log(`- compiled CSS contains dynamic border states for ${cardBorderColors.length} tool-card colors`);
console.log('- tool-card border and glow intensity is increased by 20% in light and dark modes');
