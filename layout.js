// layout.js - Injects shared premium header and footer dynamically for WeConvertFiles subpages
document.addEventListener('DOMContentLoaded', () => {
  // Pages whose shell is rendered at build time already ship the header,
  // footer and overlays in the delivered HTML (marked with data-wcf-shell).
  // For those we must NOT re-insert the shell — doing so is what caused the
  // page to jump on load. We only wire up the interactions further down.
  // Pages without a baked shell (legacy consumers) still get it injected here.
  const shellAlreadyStatic = !!document.querySelector('header[data-wcf-shell]');

  // Ensure document body is styled as flex to push footer to bottom
  if (!shellAlreadyStatic) {
    document.body.classList.add('flex', 'flex-col', 'min-h-screen');
  }

  // Load the shared motion layer. motion.css gives every page the focus /
  // button-press / selection / smooth-scroll polish (and the accordion + guide
  // styles), so it is always added. motion.js only drives scroll reveals and
  // the upload-zone drag feedback, so it is loaded only when the page actually
  // has something for it to animate. Content pages like guides have neither a
  // .reveal nor a #dropZone, so they no longer pay for that unused runtime.
  if (!document.querySelector('link[data-wcf-motion]')) {
    const motionCss = document.createElement('link');
    motionCss.rel = 'stylesheet';
    motionCss.href = '/assets/motion.css?v=20260824-2';
    motionCss.setAttribute('data-wcf-motion', '');
    document.head.appendChild(motionCss);
    if (document.querySelector('.reveal, #dropZone')) {
      const motionJs = document.createElement('script');
      motionJs.src = '/assets/motion.js?v=20260817-1';
      motionJs.defer = true;
      document.body.appendChild(motionJs);
    }
  }
  
  // Find or wrap the main content (baked shells already carry flex-grow).
  if (!shellAlreadyStatic) {
    const main = document.querySelector('main') || document.querySelector('body > :not(header):not(footer)');
    if (main) {
      main.classList.add('flex-grow');
    }
  }

  // Define tools dataset for search and mobile menu drawer
  // WCF_NAV_TOOLS_START — generated from data/tools.mjs (npm run generate:layout-nav); do not edit by hand.
  const tools = [
      { id: 'image-to-base64', title: "Image to Base64", kicker: "Image Tools" },
      { id: 'base64-to-image', title: "Base64 to Image", kicker: "Image Tools" },
      { id: 'svg-to-image', title: "SVG to PNG / JPG", kicker: "Image Tools" },
      { id: 'pdf-to-word', title: "PDF to Word / TXT", kicker: "PDF Tools" },
      { id: 'office-pdf', title: "Word / Excel to PDF", kicker: "Office Tools" },
      { id: 'merge-pdf', title: "Merge PDF", kicker: "Organize PDF" },
      { id: 'images-pdf', title: "Images to PDF", kicker: "Convert PDF" },
      { id: 'compress-pdf', title: "Compress PDF", kicker: "Optimize PDF" },
      { id: 'heic-to-jpg', title: "HEIC to JPG / PNG", kicker: "Image Tools" },
      { id: 'split-pdf', title: "Split PDF", kicker: "Organize PDF" },
      { id: 'pdf-images', title: "PDF to PNG", kicker: "Convert PDF" },
      { id: 'pdf-jpg', title: "PDF to JPG", kicker: "Convert PDF" },
      { id: 'qr-generator', title: "QR Code Generator", kicker: "Developer Tools" },
      { id: 'sign-pdf', title: "Sign PDF", kicker: "Design PDF" },
      { id: 'image-cropper', title: "Crop Image", kicker: "Image Tools" },
      { id: 'extract-pages', title: "Extract Pages", kicker: "Organize PDF" },
      { id: 'remove-pages', title: "Remove Pages", kicker: "Organize PDF" },
      { id: 'bulk-resize', title: "Bulk Image Resizer", kicker: "Scale Image" },
      { id: 'excel-to-csv', title: "Excel to CSV / JSON", kicker: "Document Tools" },
      { id: 'word-counter', title: "Word Counter & Editor", kicker: "Text Tools" },
      { id: 'image-scaler', title: "Scale Image", kicker: "Image Tools" },
      { id: 'webp-convert', title: "Image to WebP", kicker: "Optimize Image" },
      { id: 'organize-pdf', title: "Organize PDF", kicker: "Organize PDF" },
      { id: 'watermark-pdf', title: "Watermark PDF", kicker: "Design PDF" },
      { id: 'page-numbers', title: "Add Page Numbers", kicker: "Design PDF" },
      { id: 'rotate-pdf', title: "Rotate PDF", kicker: "Organize PDF" },
      { id: 'encrypt-pdf', title: "Protect PDF", kicker: "Security PDF" },
      { id: 'json-convert', title: "JSON to CSV / Excel", kicker: "Office Convert" },
      { id: 'csv-convert', title: "CSV to JSON / Excel", kicker: "Office Convert" },
      { id: 'json-formatter', title: "JSON Formatter / Validator", kicker: "Developer Tools" },
      { id: 'color-palette', title: "Image Color Picker & Eyedropper", kicker: "Design Image" },
      { id: 'favicon-generator', title: "Favicon Generator", kicker: "Image Tools" },
      { id: 'diff-checker', title: "Code Diff Checker", kicker: "Developer Tools" },
      { id: 'url-base64', title: "URL & Base64 Encoder / Decoder", kicker: "Developer Tools" },
      { id: 'markdown-preview', title: "Markdown Live Preview", kicker: "Developer Tools" },
      { id: 'regex-tester', title: "Regex Tester", kicker: "Developer Tools" },
      { id: 'jwt-decoder', title: "JWT Decoder", kicker: "Developer Tools" },
      { id: 'uuid-generator', title: "UUID Generator", kicker: "Developer Tools" },
      { id: 'hash-generator', title: "Hash Generator", kicker: "Developer Tools" },
      { id: 'exif-utility', title: "EXIF Viewer / Remover", kicker: "Image Tools" },
      { id: 'unix-converter', title: "Unix Time Converter", kicker: "Developer Tools" },
      { id: 'decrypt-pdf', title: "Unlock PDF", kicker: "Security PDF" },
      { id: 'json-yaml', title: "JSON to YAML Converter", kicker: "Developer Tools" },
      { id: 'sql-formatter', title: "SQL Formatter", kicker: "Developer Tools" },
      { id: 'code-minifier', title: "Code Minifier & Beautifier", kicker: "Developer Tools" },
      { id: 'password-generator', title: "Password & Secret Generator", kicker: "Developer Tools" },
      { id: 'case-converter', title: "Case Converter", kicker: "Developer Tools" }
    ];
  // WCF_NAV_TOOLS_END

  // Inject Header (Sitewide, full-width alignment matching main index layout)
  const headerHtml = `
    <header data-wcf-shell class="sticky top-0 z-20 border-b border-slate-200/80 dark:border-slate-700/60 bg-white/90 dark:bg-[#0f172a]/95 backdrop-blur">
      <div class="flex items-center justify-between px-6 py-4 sm:px-8 w-full gap-4">
        <div class="flex justify-start shrink-0">
          <a class="flex items-center gap-3 text-left" href="/" aria-label="Open dashboard">
            <svg class="h-12 w-12 shadow-material rounded-xl" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="32" height="32" rx="9" fill="url(#logo-grad-layout)" />
              <!-- Left File outline -->
              <path d="M8 9C8 7.89543 8.89543 7 10 7H16L20 11V18C20 19.1046 19.1046 20 18 20H10C8.89543 20 8 19.1046 8 18V9Z" fill="white" fill-opacity="0.18" stroke="white" stroke-width="1.5" stroke-linejoin="round" />
              <!-- Right File outline (shifted down-right) -->
              <path d="M14 14C14 12.8954 14.8954 12 16 12H22L26 16V23C26 24.1046 25.1046 25 24 25H16C14.8954 25 14 24.1046 14 23V14Z" fill="white" fill-opacity="0.25" stroke="white" stroke-width="1.5" stroke-linejoin="round" />
              <!-- Folded corner for Right File -->
              <path d="M22 12V16H26L22 12Z" fill="white" fill-opacity="0.4" />
              <!-- Curving conversion arrow link between them -->
              <path d="M12 17C12 15 13.5 13.5 15.5 13.5" stroke="white" stroke-width="2" stroke-linecap="round" />
              <path d="M18 19.5C20 19.5 21.5 18 21.5 16" stroke="white" stroke-width="2" stroke-linecap="round" />
              <!-- Arrow heads -->
              <path d="M14.5 12L16 13.5L14.5 15" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M19.5 17.5L18 19.5L19.5 21" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <defs>
                <linearGradient id="logo-grad-layout" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#3b82f6"/>
                  <stop offset="1" stop-color="#1d4ed8"/>
                </linearGradient>
              </defs>
            </svg>
            <span>
              <span class="block text-[17.5px] font-semibold tracking-tight dark:text-slate-100">WeConvertFiles</span>
              <span class="block text-[13px] text-slate-500 dark:text-slate-400">by Techknogeeks</span>
            </span>
          </a>
        </div>
        
        <!-- Desktop Nav (Centered on desktop, hidden on mobile) -->
        <nav class="hidden lg:flex items-center justify-center gap-3.5 xl:gap-5.5 text-[13.5px] xl:text-[14.5px] font-semibold text-slate-700 dark:text-slate-200 flex-grow min-w-0" aria-label="Main navigation">
          <!-- Category 1: Image Tools -->
          <div class="group relative py-3">
            <a class="inline-flex items-center gap-1 hover:text-[#1967d2] transition-colors whitespace-nowrap text-slate-700 dark:text-slate-200 hover:dark:text-[#1a73e8]" href="/category/image-tools">
              <svg class="h-[23px] w-[23px] text-emerald-500 transition-colors group-hover:text-[#1967d2]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Image
              <svg class="h-[15px] w-[15px] text-slate-400 transition-transform duration-200 group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </a>
            <div class="invisible absolute left-1/2 -translate-x-1/2 top-full z-30 grid w-[480px] grid-cols-2 gap-1 rounded-2xl border border-slate-200 bg-white p-2 opacity-0 shadow-lift transition group-hover:visible group-hover:opacity-100 dark:bg-[#1e293b] dark:border-slate-700/60">
              <a class="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-[#1a73e8] dark:hover:text-white transition-colors whitespace-nowrap" href="/image-cropper">
                <svg class="h-4 w-4 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M10 21V10M21 10H10M10 10V3M10 10H3" />
                </svg>
                Crop Image
              </a>
              <a class="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-[#1a73e8] dark:hover:text-white transition-colors whitespace-nowrap" href="/favicon-generator">
                <svg class="h-4 w-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Favicon Generator
              </a>
              <a class="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-[#1a73e8] dark:hover:text-white transition-colors whitespace-nowrap" href="/image-scaler">
                <svg class="h-4 w-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Scale Image
              </a>
              <a class="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-[#1a73e8] dark:hover:text-white transition-colors whitespace-nowrap" href="/pdf-images">
                <svg class="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                PDF to PNG
              </a>
              <a class="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-[#1a73e8] dark:hover:text-white transition-colors whitespace-nowrap" href="/pdf-jpg">
                <svg class="h-4 w-4 text-fuchsia-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                PDF to JPG
              </a>
              <a class="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-[#1a73e8] dark:hover:text-white transition-colors whitespace-nowrap" href="/images-pdf">
                <svg class="h-4 w-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Images to PDF
              </a>
              <a class="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-[#1a73e8] dark:hover:text-white transition-colors whitespace-nowrap" href="/webp-convert">
                <svg class="h-4 w-4 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" opacity=".35" />
                  <polyline points="7.5 10 10 15 12 11 14 15 16.5 10" />
                </svg>
                Image to WebP
              </a>
              <a class="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-[#1a73e8] dark:hover:text-white transition-colors whitespace-nowrap" href="/bulk-resize">
                <svg class="h-4 w-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <rect x="2" y="2" width="14" height="14" rx="2" opacity=".35" />
                  <rect x="8" y="8" width="14" height="14" rx="2" stroke-dasharray="3 3" />
                  <path d="M16 2h6v6M8 22H2v-6" />
                </svg>
                Bulk Image Resizer
              </a>
              <a class="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-[#1a73e8] dark:hover:text-white transition-colors whitespace-nowrap" href="/color-palette">
                <svg class="h-4 w-4 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 14.7255 3.09032 17.1962 4.85857 19C5.34442 19.4858 5.41324 20.2526 5.0934 20.817C4.66774 21.5682 4.81181 22 5.5 22H12Z" opacity=".35" />
                  <circle cx="7.5" cy="10.5" r="1.5" fill="currentColor" />
                  <circle cx="11.5" cy="7.5" r="1.5" fill="currentColor" />
                  <circle cx="16.5" cy="9.5" r="1.5" fill="currentColor" />
                  <circle cx="15.5" cy="14.5" r="1.5" fill="currentColor" />
                </svg>
                Image Color Picker & Eyedropper
              </a>
              <a class="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-[#1a73e8] dark:hover:text-white transition-colors whitespace-nowrap" href="/exif-utility">
                <svg class="h-4 w-4 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" opacity=".35"/><circle cx="12" cy="13" r="4"/><circle cx="12" cy="13" r="1"/>
                </svg>
                EXIF Viewer / Remover
              </a>
              <a class="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-[#1a73e8] dark:hover:text-white transition-colors whitespace-nowrap col-span-2" href="/heic-to-jpg">
                <svg class="h-4 w-4 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" opacity=".35"/><path d="m8 10 4 4-4 4m8-8 4 4-4 4"/>
                </svg>
                HEIC to JPG / PNG
              </a>
            </div>
          </div>

          <!-- Category 2: PDF Tools -->
          <div class="group relative py-3">
            <a class="inline-flex items-center gap-1 hover:text-[#1967d2] transition-colors whitespace-nowrap text-slate-700 dark:text-slate-200 hover:dark:text-[#1a73e8]" href="/category/pdf-tools">
              <svg class="h-[23px] w-[23px] text-orange-500 transition-colors group-hover:text-[#1a73e8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v8m0 0l3-3m-3 3L9 8m-5 5h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293h3.172a1 1 0 00.707-.293l2.414-2.414a1 1 0 01.707-.293H20" />
              </svg>
              PDF
              <svg class="h-[15px] w-[15px] text-slate-400 transition-transform duration-200 group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </a>
            <div class="invisible absolute left-1/2 -translate-x-1/2 top-full z-30 grid w-[520px] grid-cols-2 gap-1 rounded-2xl border border-slate-200 bg-white p-2 opacity-0 shadow-lift transition group-hover:visible group-hover:opacity-100 dark:bg-[#1e293b] dark:border-slate-700/60">
              <a class="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-[#1a73e8] dark:hover:text-white transition-colors whitespace-nowrap" href="/pdf-to-word">
                <svg class="h-4 w-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                PDF to Word / TXT
              </a>
              <a class="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-[#1a73e8] dark:hover:text-white transition-colors whitespace-nowrap" href="/merge-pdf">
                <svg class="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8 7v12m8-12v12M8 12h8" />
                </svg>
                Merge PDF
              </a>
              <a class="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-[#1a73e8] dark:hover:text-white transition-colors whitespace-nowrap" href="/split-pdf">
                <svg class="h-4 w-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 002 2h2a2 2 0 002-2" />
                </svg>
                Split PDF
              </a>
              <a class="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-[#1a73e8] dark:hover:text-white transition-colors whitespace-nowrap" href="/extract-pages">
                <svg class="h-4 w-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Extract Pages
              </a>
              <a class="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-[#1a73e8] dark:hover:text-white transition-colors whitespace-nowrap" href="/organize-pdf">
                <svg class="h-4 w-4 text-lime-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                Organize PDF
              </a>
              <a class="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-[#1a73e8] dark:hover:text-white transition-colors whitespace-nowrap" href="/rotate-pdf">
                <svg class="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.75 8H17" />
                </svg>
                Rotate PDF
              </a>
              <a class="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-[#1a73e8] dark:hover:text-white transition-colors whitespace-nowrap" href="/remove-pages">
                <svg class="h-4 w-4 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Remove Pages
              </a>
              <a class="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-[#1a73e8] dark:hover:text-white transition-colors whitespace-nowrap" href="/decrypt-pdf">
                <svg class="h-4 w-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" opacity=".35"/>
                  <path stroke-linecap="round" stroke-linejoin="round" d="M7 11V7a5 5 0 0 1 9.9-1" />
                </svg>
                Unlock PDF
              </a>
              <a class="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-[#1a73e8] dark:hover:text-white transition-colors whitespace-nowrap" href="/encrypt-pdf">
                <svg class="h-4 w-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" opacity=".35" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 11V7a5 5 0 0 0-10 0v4" />
                </svg>
                Protect PDF
              </a>
              <a class="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-[#1a73e8] dark:hover:text-white transition-colors whitespace-nowrap" href="/compress-pdf">
                <svg class="h-4 w-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path d="M4 14h16M4 10h16M12 3v18" opacity=".28" />
                  <path d="M15 6l-3-3-3 3M9 18l3 3 3-3" />
                </svg>
                Compress PDF
              </a>
              <a class="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-[#1a73e8] dark:hover:text-white transition-colors whitespace-nowrap" href="/watermark-pdf">
                <svg class="h-4 w-4 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" fill="currentColor" opacity=".22" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M7 16l3-7 3 7M8 13h4M17 9v8" />
                </svg>
                Watermark PDF
              </a>
              <a class="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-[#1a73e8] dark:hover:text-white transition-colors whitespace-nowrap" href="/page-numbers">
                <svg class="h-4 w-4 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                </svg>
                Add Page Numbers
              </a>
              <a class="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-[#1a73e8] dark:hover:text-white transition-colors whitespace-nowrap" href="/sign-pdf">
                <svg class="h-4 w-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Sign PDF
              </a>
            </div>
          </div>

          <!-- Category 3: Convert & Office -->
          <div class="group relative py-3">
            <a class="inline-flex items-center gap-1 hover:text-[#1967d2] transition-colors whitespace-nowrap text-slate-700 dark:text-slate-200 hover:dark:text-[#1a73e8]" href="/category/convert-office">
              <svg class="h-[23px] w-[23px] text-indigo-500 transition-colors group-hover:text-[#1a73e8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              Data & Office
              <svg class="h-[15px] w-[15px] text-slate-400 transition-transform duration-200 group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </a>
            <div class="invisible absolute left-1/2 -translate-x-1/2 top-full z-30 w-64 rounded-2xl border border-slate-200 bg-white p-2 opacity-0 shadow-lift transition group-hover:visible group-hover:opacity-100 dark:bg-[#1e293b] dark:border-slate-700/60">
              <a class="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-[#1a73e8] dark:hover:text-white transition-colors whitespace-nowrap" href="/excel-to-csv">
                <svg class="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 5v14M5 12h14" />
                </svg>
                Excel to CSV / JSON
              </a>
              <a class="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-[#1a73e8] dark:hover:text-white transition-colors whitespace-nowrap" href="/csv-convert">
                <svg class="h-4 w-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                CSV to Excel or JSON
              </a>
              <a class="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-[#1a73e8] dark:hover:text-white transition-colors whitespace-nowrap" href="/json-convert">
                <svg class="h-4 w-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path d="M16 4h4v16h-4M8 20H4V4h4" opacity=".35"/>
                  <path d="M12 8v8M9 11l3-3 3 3"/>
                </svg>
                JSON to CSV / Excel
              </a>
              <a class="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-[#1a73e8] dark:hover:text-white transition-colors whitespace-nowrap" href="/office-pdf">
                <svg class="h-4 w-4 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Word / Excel to PDF
              </a>
              <a class="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-[#1a73e8] dark:hover:text-white transition-colors whitespace-nowrap" href="/json-yaml">
                <svg class="h-4 w-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" opacity=".35"/>
                  <path d="M8 8v3.5L6 14l2 2.5V20M16 8v3.5l2 2.5-2 2.5V20" />
                </svg>
                JSON to YAML Converter
              </a>
            </div>
          </div>

          <!-- Category 4: Text & Developers -->
          <div class="group relative py-3">
            <a class="inline-flex items-center gap-1 hover:text-[#1967d2] transition-colors whitespace-nowrap text-slate-700 dark:text-slate-200 hover:dark:text-[#1a73e8]" href="/category/developer-tools">
              <svg class="h-[23px] w-[23px] text-rose-500 transition-colors group-hover:text-[#1a73e8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              Developers
              <svg class="h-[15px] w-[15px] text-slate-400 transition-transform duration-200 group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </a>
            <div class="invisible absolute right-0 top-full z-30 grid w-[520px] grid-cols-2 gap-1 rounded-2xl border border-slate-200 bg-white p-2 opacity-0 shadow-lift transition group-hover:visible group-hover:opacity-100 dark:bg-[#1e293b] dark:border-slate-700/60">
              <a class="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-[#1a73e8] dark:hover:text-white transition-colors whitespace-nowrap" href="/regex-tester">
                <svg class="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                Regex Tester
              </a>
              <a class="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-[#1a73e8] dark:hover:text-white transition-colors whitespace-nowrap" href="/uuid-generator">
                <svg class="h-4 w-4 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                UUID Generator
              </a>
              <a class="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-[#1a73e8] dark:hover:text-white transition-colors whitespace-nowrap" href="/unix-converter">
                <svg class="h-4 w-4 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Unix Time Converter
              </a>
              <a class="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-[#1a73e8] dark:hover:text-white transition-colors whitespace-nowrap" href="/jwt-decoder">
                <svg class="h-4 w-4 text-fuchsia-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 7a2 2 0 012 2m-2-2H9m6 0a2 2 0 00-2-2H9m0 8h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                JWT Decoder
              </a>
              <a class="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-[#1a73e8] dark:hover:text-white transition-colors whitespace-nowrap" href="/word-counter">
                <svg class="h-4 w-4 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" opacity=".35" />
                  <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
                </svg>
                Word & Character Counter
              </a>
              <a class="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-[#1a73e8] dark:hover:text-white transition-colors whitespace-nowrap" href="/diff-checker">
                <svg class="h-4 w-4 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path d="M12 5v14M5 9h4M15 15h4" stroke-width="2.5" />
                  <rect x="2" y="3" width="20" height="18" rx="2" opacity=".35" />
                </svg>
                Code Diff Checker
              </a>
              <a class="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-[#1a73e8] dark:hover:text-white transition-colors whitespace-nowrap" href="/markdown-preview">
                <svg class="h-4 w-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="5" width="18" height="14" rx="2" opacity=".35" />
                  <path d="M7 15V9l3.5 4L14 9v6M18 9v4M16.5 10.5L18 12l1.5-1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                Markdown Live Preview
              </a>
              <a class="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-[#1a73e8] dark:hover:text-white transition-colors whitespace-nowrap" href="/url-base64">
                <svg class="h-4 w-4 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" opacity=".35" />
                </svg>
                URL / Base64 Utility
              </a>
              <a class="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-[#1a73e8] dark:hover:text-white transition-colors whitespace-nowrap" href="/json-formatter">
                <svg class="h-4 w-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" opacity=".35"/>
                  <path d="M8 9.5H6.5a1 1 0 0 0-1 1v1a1 1 0 0 1-1 1H4a1 1 0 0 1 1 1v1a1 1 0 0 0 1 1H6.5m11-6H19a1 1 0 0 1 1 1v1a1 1 0 0 0 1 1h.5a1 1 0 0 0-1 1v1a1 1 0 0 1-1 1H17.5" />
                </svg>
                JSON Formatter / Validator
              </a>
              <a class="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-[#1a73e8] dark:hover:text-white transition-colors whitespace-nowrap" href="/qr-generator">
                <svg class="h-4 w-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="6" height="6" rx="1"/><rect x="15" y="3" width="6" height="6" rx="1"/><rect x="3" y="15" width="6" height="6" rx="1"/><rect x="15" y="15" width="6" height="6" rx="1"/><path d="M9 6h6M6 9v6M9 18h6M18 9v6" opacity=".35"/>
                </svg>
                QR Code Generator
              </a>
              <a class="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-[#1a73e8] dark:hover:text-white transition-colors whitespace-nowrap" href="/hash-generator">
                <svg class="h-4 w-4 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path d="M12 22a7 7 0 0 0 5-12.02V8a5 5 0 0 0-10 0v1.98A7 7 0 0 0 12 22z" opacity=".35"/><path d="M12 13v4" /><circle cx="12" cy="12" r="1" />
                </svg>
                Hash Generator
              </a>
              <a class="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-[#1a73e8] dark:hover:text-white transition-colors whitespace-nowrap" href="/sql-formatter">
                <svg class="h-4 w-4 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <ellipse cx="12" cy="6" rx="8" ry="3" opacity=".35"/><path d="M4 6v12c0 1.66 3.58 3 8 3s8-1.34 8-3V6" /><path d="M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3" />
                </svg>
                SQL Formatter
              </a>
              <a class="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-[#1a73e8] dark:hover:text-white transition-colors whitespace-nowrap" href="/code-minifier">
                <svg class="h-4 w-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" opacity=".35"/><path d="m9 9-3 3 3 3m6-6 3 3-3 3" />
                </svg>
                Code Minifier & Beautifier
              </a>
              <a class="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-[#1a73e8] dark:hover:text-white transition-colors whitespace-nowrap" href="/password-generator">
                <svg class="h-4 w-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" opacity=".35"/><path d="M7 11V7a5 5 0 0 1 10 0v4" /><circle cx="12" cy="16" r="1.5" />
                </svg>
                Password & Secret Generator
              </a>
              <a class="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-[#1a73e8] dark:hover:text-white transition-colors whitespace-nowrap" href="/case-converter">
                <svg class="h-4 w-4 text-lime-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path d="M4 17V7l3.5 6L11 7v10" /><path d="M14 17h6M17 8v9M14 11l3-3 3 3" opacity=".7" />
                </svg>
                Case Converter
              </a>
            </div>
          </div>


        </nav>
        
        <!-- Desktop Utilities -->
        <div class="hidden lg:flex items-center gap-3.5 xl:gap-4.5 border-l border-slate-200 dark:border-slate-700/60 pl-4.5 xl:pl-6 shrink-0">
          <button id="headerSearchButton" class="rounded-full p-2 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 border border-blue-200/50 dark:border-blue-800/40 shadow-[0_0_12px_rgba(59,130,246,0.2)] hover:shadow-[0_0_18px_rgba(59,130,246,0.35)] transition-all duration-200 flex items-center justify-center shrink-0" aria-label="Search tools" aria-controls="searchModal" aria-expanded="false" type="button">
            <svg class="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          </button>
          <button id="darkModeToggle" class="rounded-full p-2 text-slate-600 hover:bg-slate-100 hover:text-[#1967d2] transition-all dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-amber-400" aria-label="Toggle dark mode">
            <svg class="block dark:hidden h-[22px] w-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
            <svg class="hidden dark:block h-[22px] w-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M14 12a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
          </button>
          <a class="group inline-flex items-center gap-1.5 text-sm font-semibold text-slate-700 hover:text-[#1967d2] transition-colors whitespace-nowrap dark:text-slate-100 dark:hover:text-[#1967d2]" href="/about">
            <svg class="h-[25px] w-[25px] text-blue-500 transition-colors group-hover:text-[#1967d2]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            About
          </a>
        </div>
        
        <!-- Mobile Actions -->
        <div class="flex justify-end items-center gap-2 lg:hidden">
          <button id="mobileSearchButton" class="rounded-full p-2 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 border border-blue-200/50 dark:border-blue-800/40 shadow-[0_0_10px_rgba(59,130,246,0.2)] active:shadow-[0_0_15px_rgba(59,130,246,0.35)] transition-all duration-200 flex items-center justify-center shrink-0" aria-label="Search tools" aria-controls="searchModal" aria-expanded="false" type="button">
            <svg class="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </button>
          <button id="mobileDarkModeToggle" class="rounded-full p-2 text-slate-600 hover:bg-slate-100 hover:text-[#1967d2] dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-amber-400" aria-label="Toggle dark mode">
            <svg class="block dark:hidden h-[22px] w-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
            <svg class="hidden dark:block h-[22px] w-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M14 12a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
          </button>
          <button id="mobileMenuButton" class="rounded-xl p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800" aria-label="Open tools menu" aria-controls="mobileMenuDrawer" aria-expanded="false" type="button">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
        </div>
      </div>
    </header>
  `;
  if (!shellAlreadyStatic) document.body.insertAdjacentHTML('afterbegin', headerHtml);

  // Inject Mobile Menu Drawer Overlay
  const mobileMenuHtml = `
    <div id="mobileMenuDrawer" class="fixed inset-0 z-50 hidden">
      <div id="mobileMenuBackdrop" class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"></div>
      <div role="dialog" aria-modal="true" aria-labelledby="mobileMenuTitle" class="absolute right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white dark:bg-[#0f172a] p-6 shadow-2xl flex flex-col justify-between rounded-l-[32px] border-l border-slate-100 dark:border-slate-700/60">
        <div>
          <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-4 mb-6">
            <span id="mobileMenuTitle" class="text-lg font-bold text-slate-900 dark:text-slate-100">All Tools</span>
            <button id="closeMobileMenu" aria-label="Close tools menu" type="button" class="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <nav id="mobileToolsList" class="space-y-1.5 overflow-y-auto max-h-[70vh] pr-1"></nav>
        </div>
        <div class="border-t border-slate-100 dark:border-slate-700/60 pt-4 mt-auto">
          
          <a class="flex items-center gap-2 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold" href="/about">About WeConvertFiles</a>
        </div>
      </div>
    </div>
  `;
  if (!shellAlreadyStatic) document.body.insertAdjacentHTML('beforeend', mobileMenuHtml);

  // Inject Search Modal Overlay
  const searchModalHtml = `
    <div id="searchModal" class="fixed inset-0 z-50 hidden">
      <div id="searchBackdrop" class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"></div>
      <div role="dialog" aria-modal="true" aria-label="Search tools" class="absolute inset-x-4 top-[10%] mx-auto max-w-xl rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white/95 dark:bg-[#151f32]/95 backdrop-blur shadow-2xl overflow-hidden flex flex-col max-h-[70vh]">
        <div class="relative flex items-center border-b border-slate-200/80 dark:border-slate-700/60 p-4">
          <svg class="h-5 w-5 text-blue-500 mr-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <input id="searchInput" aria-label="Search tools" type="text" class="w-full bg-transparent text-sm text-slate-950 dark:text-slate-100 outline-none placeholder-slate-400 dark:placeholder-slate-500" placeholder="Search document, image, or developer tools..." />
          <button id="closeSearchBtn" aria-label="Close search" type="button" class="text-xs text-slate-600 hover:text-slate-800 dark:text-slate-300 dark:hover:text-slate-100 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">ESC</button>
        </div>
        <div id="searchResults" class="overflow-y-auto p-2 space-y-1"></div>
      </div>
    </div>
  `;
  if (!shellAlreadyStatic) document.body.insertAdjacentHTML('beforeend', searchModalHtml);

  // Inject Footer
  const footerHtml = `
    <footer class="border-t border-slate-200 dark:border-slate-700/60 bg-[#f8fafd] dark:bg-[#0b0f19] transition-colors duration-200 py-8 mt-auto w-full">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,2fr)] lg:gap-12">
          <div class="space-y-3">
            <div class="flex items-center gap-3">
              <span class="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">WeConvertFiles</span>
              <span class="rounded-full bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-900/50">
                <span class="bg-emerald-100 dark:bg-emerald-900/30 px-1 py-0.5 rounded font-semibold text-emerald-800 dark:text-emerald-200">100%</span> Client-Side
              </span>
            </div>
            <p class="max-w-xl text-xs leading-6 text-slate-600 dark:text-slate-400">
              WeConvertFiles processes supported files directly in your browser. File contents are not uploaded for conversion. Built by <a href="https://www.techknogeeks.com" target="_blank" rel="noopener" class="font-bold text-[#1967d2] dark:text-blue-400 hover:underline">TechKnoGeeks</a>.
            </p>
          </div>
          <nav aria-label="Footer navigation" class="grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-3">
            <div data-footer-group="tools">
              <h2 class="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">Tools</h2>
              <div class="mt-3 space-y-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
                <a class="block w-fit hover:text-[#1967d2] hover:dark:text-white transition-colors" href="/category/pdf-tools">PDF</a>
                <a class="block w-fit hover:text-[#1967d2] hover:dark:text-white transition-colors" href="/category/image-tools">Image</a>
                <a class="block w-fit hover:text-[#1967d2] hover:dark:text-white transition-colors" href="/category/convert-office">Data &amp; Office</a>
                <a class="block w-fit hover:text-[#1967d2] hover:dark:text-white transition-colors" href="/category/developer-tools">Developers</a>
                <a class="block w-fit hover:text-[#1967d2] hover:dark:text-white transition-colors" href="/merge-pdf">Merge PDF</a>
                <a class="block w-fit hover:text-[#1967d2] hover:dark:text-white transition-colors" href="/compress-pdf">Compress PDF</a>
              </div>
            </div>
            <div data-footer-group="resources">
              <h2 class="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">Resources</h2>
              <div class="mt-3 space-y-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
                <a class="block w-fit hover:text-[#1967d2] hover:dark:text-white transition-colors" href="/">All Tools</a>
                <a class="block w-fit hover:text-[#1967d2] hover:dark:text-white transition-colors" href="/#guides">Tool Guides</a>
                <a class="block w-fit hover:text-[#1967d2] hover:dark:text-white transition-colors" href="/#how-it-works">How It Works</a>
              </div>
            </div>
            <div data-footer-group="company" class="col-span-2 sm:col-span-1">
              <h2 class="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">Company</h2>
              <div data-footer-company-links class="mt-3 grid grid-cols-2 gap-x-8 gap-y-2 text-xs font-semibold text-slate-600 dark:text-slate-300 sm:block sm:space-y-2">
                <a class="block w-fit hover:text-[#1967d2] hover:dark:text-white transition-colors" href="/about">About</a>
                <a class="block w-fit hover:text-[#1967d2] hover:dark:text-white transition-colors" href="/contact">Contact</a>
                <a class="block w-fit hover:text-[#1967d2] hover:dark:text-white transition-colors" href="/privacy">Privacy</a>
                <a class="block w-fit hover:text-[#1967d2] hover:dark:text-white transition-colors" href="/terms">Terms</a>
                <a class="block w-fit hover:text-[#1967d2] hover:dark:text-white transition-colors" href="/accessibility">Accessibility</a>
              </div>
            </div>
          </nav>
        </div>
        <div class="border-t border-slate-200/60 dark:border-slate-700/60 mt-7 pt-5 text-center text-[10px] text-slate-600 dark:text-slate-400">
          &copy; 2026 WeConvertFiles by TechKnoGeeks. All rights reserved.
        </div>
      </div>
    </footer>
  `;
  if (!shellAlreadyStatic) document.body.insertAdjacentHTML('beforeend', footerHtml);

  // Setup Event Listeners

  // Dark/Light Mode
  const darkModeToggle = document.getElementById('darkModeToggle');
  const mobileDarkModeToggle = document.getElementById('mobileDarkModeToggle');
  
  const toggleDarkMode = () => {
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
    }
  };
  if (darkModeToggle) darkModeToggle.addEventListener('click', toggleDarkMode);
  if (mobileDarkModeToggle) mobileDarkModeToggle.addEventListener('click', toggleDarkMode);

  // Mobile Menu Toggling
  const mobileMenuDrawer = document.getElementById('mobileMenuDrawer');
  const mobileMenuButton = document.getElementById('mobileMenuButton');
  const closeMobileMenu = document.getElementById('closeMobileMenu');
  const mobileMenuBackdrop = document.getElementById('mobileMenuBackdrop');
  const mobileToolsList = document.getElementById('mobileToolsList');
  const modalInertElements = new Set();
  const modalFocusableSelector = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), summary, [tabindex]:not([tabindex="-1"])';

  const setModalIsolation = (modalRoot, isolate) => {
    if (!isolate) {
      modalInertElements.forEach((element) => { element.inert = false; });
      modalInertElements.clear();
      return;
    }

    setModalIsolation(null, false);
    let branch = modalRoot;
    while (branch?.parentElement) {
      const parent = branch.parentElement;
      [...parent.children].forEach((sibling) => {
        if (sibling !== branch && !sibling.inert) {
          sibling.inert = true;
          modalInertElements.add(sibling);
        }
      });
      if (parent === document.body) break;
      branch = parent;
    }
  };

  const trapModalFocus = (event, dialog) => {
    if (event.key !== 'Tab' || !dialog) return;
    const focusable = [...dialog.querySelectorAll(modalFocusableSelector)].filter((element) => {
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
    });
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && (document.activeElement === first || !dialog.contains(document.activeElement))) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (document.activeElement === last || !dialog.contains(document.activeElement))) {
      event.preventDefault();
      first.focus();
    }
  };

  // WCF_NAV_GROUPS_START — generated from data/tools.mjs (npm run generate:layout-nav); do not edit by hand.
  const categories = [
    { name: "IMAGE TOOLS", ids: ['image-cropper', 'favicon-generator', 'image-scaler', 'pdf-images', 'pdf-jpg', 'images-pdf', 'webp-convert', 'bulk-resize', 'color-palette', 'exif-utility', 'heic-to-jpg'] },
    { name: "PDF TOOLS", ids: ['pdf-to-word', 'merge-pdf', 'split-pdf', 'extract-pages', 'organize-pdf', 'rotate-pdf', 'remove-pages', 'decrypt-pdf', 'encrypt-pdf', 'compress-pdf', 'watermark-pdf', 'page-numbers', 'sign-pdf'] },
    { name: "CONVERT & OFFICE", ids: ['excel-to-csv', 'csv-convert', 'json-convert', 'office-pdf', 'json-yaml'] },
    { name: "TEXT & DEVELOPERS", ids: ['regex-tester', 'uuid-generator', 'unix-converter', 'jwt-decoder', 'word-counter', 'diff-checker', 'markdown-preview', 'url-base64', 'json-formatter', 'qr-generator', 'hash-generator', 'sql-formatter', 'code-minifier', 'password-generator', 'case-converter'] }
  ];
  // WCF_NAV_GROUPS_END

  function renderMobileMenu() {
    if (!mobileToolsList) return;
    mobileToolsList.innerHTML = categories.map(cat => {
      const catTools = cat.ids.map(id => tools.find(t => t.id === id)).filter(Boolean);
      return `
        <div class="mb-5 last:mb-0 border-t border-slate-100 dark:border-slate-700/60 pt-4 first:border-t-0 first:pt-0">
          <h4 class="text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase px-3 mb-2">${cat.name}</h4>
          <div class="space-y-1">
            ${catTools.map(tool => `
              <a href="/${tool.id}" class="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-[#1a73e8] dark:hover:text-white transition-colors border-b border-slate-100/50 dark:border-slate-700/60 last:border-b-0 pb-2.5 pt-2">
                <span>${tool.title}</span>
              </a>
            `).join('')}
          </div>
        </div>
      `;
    }).join('');
  }

  if (mobileMenuButton) {
    mobileMenuButton.addEventListener('click', () => {
      renderMobileMenu();
      mobileMenuDrawer.classList.remove('hidden');
      setModalIsolation(mobileMenuDrawer, true);
      mobileMenuButton.setAttribute('aria-expanded', 'true');
      setTimeout(() => closeMobileMenu?.focus(), 0);
    });
  }
  const hideMobileMenu = ({ restoreFocus = false } = {}) => {
    if (!mobileMenuDrawer) return;
    mobileMenuDrawer.classList.add('hidden');
    setModalIsolation(null, false);
    mobileMenuButton?.setAttribute('aria-expanded', 'false');
    if (restoreFocus) mobileMenuButton?.focus();
  };
  if (closeMobileMenu) closeMobileMenu.addEventListener('click', () => hideMobileMenu({ restoreFocus: true }));
  if (mobileMenuBackdrop) mobileMenuBackdrop.addEventListener('click', () => hideMobileMenu({ restoreFocus: true }));

  // Search Modal
  const headerSearchButton = document.getElementById('headerSearchButton');
  const mobileSearchButton = document.getElementById('mobileSearchButton');
  const searchModal = document.getElementById('searchModal');
  const searchBackdrop = document.getElementById('searchBackdrop');
  const closeSearchBtn = document.getElementById('closeSearchBtn');
  const searchInput = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchResults');
  let searchTrigger = null;

  const toggleSearchModal = (show) => {
    if (!searchModal) return;
    if (show) {
      searchTrigger = document.activeElement;
      searchModal.classList.remove('hidden');
      setModalIsolation(searchModal, true);
      headerSearchButton?.setAttribute('aria-expanded', 'true');
      mobileSearchButton?.setAttribute('aria-expanded', 'true');
      if (searchInput) {
        searchInput.value = '';
        setTimeout(() => searchInput.focus(), 50);
      }
      renderSearchResults('');
    } else {
      searchModal.classList.add('hidden');
      setModalIsolation(null, false);
      headerSearchButton?.setAttribute('aria-expanded', 'false');
      mobileSearchButton?.setAttribute('aria-expanded', 'false');
      if (searchTrigger instanceof HTMLElement) searchTrigger.focus();
      searchTrigger = null;
    }
  };

  if (headerSearchButton) headerSearchButton.addEventListener('click', () => toggleSearchModal(true));
  if (mobileSearchButton) mobileSearchButton.addEventListener('click', () => toggleSearchModal(true));
  if (searchBackdrop) searchBackdrop.addEventListener('click', () => toggleSearchModal(false));
  if (closeSearchBtn) closeSearchBtn.addEventListener('click', () => toggleSearchModal(false));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab' && searchModal && !searchModal.classList.contains('hidden')) {
      trapModalFocus(e, searchModal.querySelector('[role="dialog"]'));
    } else if (e.key === 'Tab' && mobileMenuDrawer && !mobileMenuDrawer.classList.contains('hidden')) {
      trapModalFocus(e, mobileMenuDrawer.querySelector('[role="dialog"]'));
    } else if (e.key === 'Escape' && searchModal && !searchModal.classList.contains('hidden')) {
      toggleSearchModal(false);
    } else if (e.key === 'Escape' && mobileMenuDrawer && !mobileMenuDrawer.classList.contains('hidden')) {
      hideMobileMenu({ restoreFocus: true });
    }
  });

  function renderSearchResults(query) {
    if (!searchResults) return;
    const cleanQuery = query.toLowerCase().trim();
    const filtered = tools.filter(t => 
      t.title.toLowerCase().includes(cleanQuery) || 
      t.kicker.toLowerCase().includes(cleanQuery)
    );

    if (filtered.length === 0) {
      searchResults.innerHTML = `<p class="p-4 text-center text-xs text-slate-400">No matching tools found...</p>`;
      return;
    }

    searchResults.innerHTML = filtered.map(tool => `
      <a href="/${tool.id}" class="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition group">
        <div>
          <span class="text-[10px] font-bold text-[#1a73e8] uppercase tracking-wider">${tool.kicker}</span>
          <h4 class="text-sm font-semibold text-slate-900 dark:text-slate-200 mt-0.5">${tool.title}</h4>
        </div>
        <span class="text-[10px] font-semibold bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-full group-hover:bg-[#1a73e8] group-hover:text-white transition-colors">Open</span>
      </a>
    `).join('');
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => renderSearchResults(e.target.value));
  }
});
