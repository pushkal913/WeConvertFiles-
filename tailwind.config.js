const cardBorderColors = [
  'amber-600',
  'amber-700',
  'blue-600',
  'blue-700',
  'cyan-600',
  'cyan-700',
  'emerald-600',
  'emerald-700',
  'fuchsia-700',
  'green-700',
  'indigo-600',
  'indigo-700',
  'lime-700',
  'orange-600',
  'purple-600',
  'purple-700',
  'rose-600',
  'rose-700',
  'sky-600',
  'sky-700',
  'teal-600',
  'violet-700'
];

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './*.html',
    './*.js',
    './convert/*.html',
    './guides/*.html',
    './scripts/*.mjs'
  ],
  safelist: cardBorderColors.flatMap(color => [
    `border-${color}/[0.48]`,
    `dark:border-${color}/[0.54]`,
    `hover:border-${color}/90`
  ]),
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif']
      },
      boxShadow: {
        material: '0 1px 2px rgba(60,64,67,.18), 0 1px 3px 1px rgba(60,64,67,.08)',
        lift: '0 8px 24px rgba(60,64,67,.18)'
      }
    }
  }
};
