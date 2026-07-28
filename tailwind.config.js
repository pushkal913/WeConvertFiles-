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
