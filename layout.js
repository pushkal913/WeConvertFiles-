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
          <a class="flex items-center gap-3 rounded-xl text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1a73e8]" href="/" aria-label="Open dashboard">
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
        
        <!-- WCF_NAV_DESKTOP_START — generated from category-catalog.mjs (npm run generate:layout-nav); do not edit by hand. -->
        <nav class="hidden lg:flex items-center justify-center gap-3.5 xl:gap-5.5 text-[13.5px] xl:text-[14.5px] font-semibold text-slate-700 dark:text-slate-200 flex-grow min-w-0" aria-label="Main navigation">
          <div class="wcf-nav-menu relative py-3" data-nav-menu="pdf">
            <button id="nav-pdf-trigger" data-nav-trigger="pdf" aria-controls="nav-pdf-menu" aria-expanded="false" type="button" class="inline-flex items-center gap-1 whitespace-nowrap text-slate-700 transition-colors hover:text-[#1967d2] hover:dark:text-[#1a73e8] dark:text-slate-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1a73e8]">
              <svg class="h-[21px] w-[21px]" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v8m0 0l3-3m-3 3L9 8"/></svg>
              <span>PDF</span><svg class="h-[15px] w-[15px] text-slate-400" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </button>
            <div id="nav-pdf-menu" data-nav-panel="pdf" hidden class="absolute left-1/2 top-full z-30 grid w-[480px] -translate-x-1/2 grid-cols-2 gap-1 rounded-2xl border border-slate-200 bg-white p-2 shadow-lift dark:border-slate-700/60 dark:bg-[#1e293b]">
              <a id="nav-pdf-menu-link-0" class="col-span-2 flex items-center rounded-xl px-3 py-2 text-sm font-bold text-[#1a73e8] hover:bg-blue-50 dark:hover:bg-slate-800/60" href="/category/pdf-tools">View all PDF tools</a>
            <a class="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-[#1a73e8] dark:hover:text-white transition-colors whitespace-nowrap" href="/pdf-to-word">PDF to Word / TXT</a>
            <a class="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-[#1a73e8] dark:hover:text-white transition-colors whitespace-nowrap" href="/merge-pdf">Merge PDF</a>
            <a class="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-[#1a73e8] dark:hover:text-white transition-colors whitespace-nowrap" href="/split-pdf">Split PDF</a>
            <a class="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-[#1a73e8] dark:hover:text-white transition-colors whitespace-nowrap" href="/extract-pages">Extract Pages</a>
            <a class="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-[#1a73e8] dark:hover:text-white transition-colors whitespace-nowrap" href="/organize-pdf">Organize PDF</a>
            <a class="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-[#1a73e8] dark:hover:text-white transition-colors whitespace-nowrap" href="/rotate-pdf">Rotate PDF</a>
            <a class="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-[#1a73e8] dark:hover:text-white transition-colors whitespace-nowrap" href="/remove-pages">Remove Pages</a>
            <a class="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-[#1a73e8] dark:hover:text-white transition-colors whitespace-nowrap" href="/decrypt-pdf">Unlock PDF</a>
            <a class="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-[#1a73e8] dark:hover:text-white transition-colors whitespace-nowrap" href="/encrypt-pdf">Protect PDF</a>
            <a class="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-[#1a73e8] dark:hover:text-white transition-colors whitespace-nowrap" href="/compress-pdf">Compress PDF</a>
            <a class="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-[#1a73e8] dark:hover:text-white transition-colors whitespace-nowrap" href="/watermark-pdf">Watermark PDF</a>
            <a class="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-[#1a73e8] dark:hover:text-white transition-colors whitespace-nowrap" href="/page-numbers">Add Page Numbers</a>
            <a class="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-[#1a73e8] dark:hover:text-white transition-colors whitespace-nowrap" href="/sign-pdf">Sign PDF</a>
            </div>
          </div>
          <div class="wcf-nav-menu relative py-3" data-nav-menu="images">
            <button id="nav-images-trigger" data-nav-trigger="images" aria-controls="nav-images-menu" aria-expanded="false" type="button" class="inline-flex items-center gap-1 whitespace-nowrap text-slate-700 transition-colors hover:text-[#1967d2] hover:dark:text-[#1a73e8] dark:text-slate-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1a73e8]">
              <svg class="h-[21px] w-[21px]" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              <span>Images</span><svg class="h-[15px] w-[15px] text-slate-400" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </button>
            <div id="nav-images-menu" data-nav-panel="images" hidden class="absolute left-1/2 top-full z-30 grid w-[480px] -translate-x-1/2 grid-cols-2 gap-1 rounded-2xl border border-slate-200 bg-white p-2 shadow-lift dark:border-slate-700/60 dark:bg-[#1e293b]">
              <a id="nav-images-menu-link-0" class="col-span-2 flex items-center rounded-xl px-3 py-2 text-sm font-bold text-[#1a73e8] hover:bg-blue-50 dark:hover:bg-slate-800/60" href="/category/image-tools">View all Images tools</a>
            <a class="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-[#1a73e8] dark:hover:text-white transition-colors whitespace-nowrap" href="/image-cropper">Crop Image</a>
            <a class="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-[#1a73e8] dark:hover:text-white transition-colors whitespace-nowrap" href="/favicon-generator">Favicon Generator</a>
            <a class="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-[#1a73e8] dark:hover:text-white transition-colors whitespace-nowrap" href="/image-scaler">Scale Image</a>
            <a class="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-[#1a73e8] dark:hover:text-white transition-colors whitespace-nowrap" href="/pdf-images">PDF to PNG</a>
            <a class="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-[#1a73e8] dark:hover:text-white transition-colors whitespace-nowrap" href="/pdf-jpg">PDF to JPG</a>
            <a class="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-[#1a73e8] dark:hover:text-white transition-colors whitespace-nowrap" href="/images-pdf">Images to PDF</a>
            <a class="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-[#1a73e8] dark:hover:text-white transition-colors whitespace-nowrap" href="/webp-convert">Image to WebP</a>
            <a class="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-[#1a73e8] dark:hover:text-white transition-colors whitespace-nowrap" href="/bulk-resize">Bulk Image Resizer</a>
            <a class="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-[#1a73e8] dark:hover:text-white transition-colors whitespace-nowrap" href="/color-palette">Image Color Picker & Eyedropper</a>
            <a class="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-[#1a73e8] dark:hover:text-white transition-colors whitespace-nowrap" href="/exif-utility">EXIF Viewer / Remover</a>
            <a class="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-[#1a73e8] dark:hover:text-white transition-colors whitespace-nowrap" href="/heic-to-jpg">HEIC to JPG / PNG</a>
            <a class="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-[#1a73e8] dark:hover:text-white transition-colors whitespace-nowrap" href="/image-to-base64">Image to Base64</a>
            <a class="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-[#1a73e8] dark:hover:text-white transition-colors whitespace-nowrap" href="/base64-to-image">Base64 to Image</a>
            <a class="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-[#1a73e8] dark:hover:text-white transition-colors whitespace-nowrap" href="/svg-to-image">SVG to PNG / JPG</a>
            </div>
          </div>
          <div class="wcf-nav-menu relative py-3" data-nav-menu="data-office">
            <button id="nav-data-office-trigger" data-nav-trigger="data-office" aria-controls="nav-data-office-menu" aria-expanded="false" type="button" class="inline-flex items-center gap-1 whitespace-nowrap text-slate-700 transition-colors hover:text-[#1967d2] hover:dark:text-[#1a73e8] dark:text-slate-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1a73e8]">
              <svg class="h-[21px] w-[21px]" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M16.023 9.348h4.992M2.985 19.644v-4.992h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182V4.356"/></svg>
              <span>Data & Office</span><svg class="h-[15px] w-[15px] text-slate-400" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </button>
            <div id="nav-data-office-menu" data-nav-panel="data-office" hidden class="absolute left-1/2 top-full z-30 grid w-[480px] -translate-x-1/2 grid-cols-2 gap-1 rounded-2xl border border-slate-200 bg-white p-2 shadow-lift dark:border-slate-700/60 dark:bg-[#1e293b]">
              <a id="nav-data-office-menu-link-0" class="col-span-2 flex items-center rounded-xl px-3 py-2 text-sm font-bold text-[#1a73e8] hover:bg-blue-50 dark:hover:bg-slate-800/60" href="/category/convert-office">View all Data & Office tools</a>
            <a class="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-[#1a73e8] dark:hover:text-white transition-colors whitespace-nowrap" href="/excel-to-csv">Excel to CSV / JSON</a>
            <a class="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-[#1a73e8] dark:hover:text-white transition-colors whitespace-nowrap" href="/csv-convert">CSV to JSON / Excel</a>
            <a class="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-[#1a73e8] dark:hover:text-white transition-colors whitespace-nowrap" href="/json-convert">JSON to CSV / Excel</a>
            <a class="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-[#1a73e8] dark:hover:text-white transition-colors whitespace-nowrap" href="/office-pdf">Word / Excel to PDF</a>
            <a class="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-[#1a73e8] dark:hover:text-white transition-colors whitespace-nowrap" href="/json-yaml">JSON to YAML Converter</a>
            </div>
          </div>
          <div class="wcf-nav-menu relative py-3" data-nav-menu="developer">
            <button id="nav-developer-trigger" data-nav-trigger="developer" aria-controls="nav-developer-menu" aria-expanded="false" type="button" class="inline-flex items-center gap-1 whitespace-nowrap text-slate-700 transition-colors hover:text-[#1967d2] hover:dark:text-[#1a73e8] dark:text-slate-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1a73e8]">
              <svg class="h-[21px] w-[21px]" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg>
              <span>Developer</span><svg class="h-[15px] w-[15px] text-slate-400" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </button>
            <div id="nav-developer-menu" data-nav-panel="developer" hidden class="absolute left-1/2 top-full z-30 grid w-[480px] -translate-x-1/2 grid-cols-2 gap-1 rounded-2xl border border-slate-200 bg-white p-2 shadow-lift dark:border-slate-700/60 dark:bg-[#1e293b]">
              <a id="nav-developer-menu-link-0" class="col-span-2 flex items-center rounded-xl px-3 py-2 text-sm font-bold text-[#1a73e8] hover:bg-blue-50 dark:hover:bg-slate-800/60" href="/category/developer-tools">View all Developer tools</a>
            <a class="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-[#1a73e8] dark:hover:text-white transition-colors whitespace-nowrap" href="/regex-tester">Regex Tester</a>
            <a class="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-[#1a73e8] dark:hover:text-white transition-colors whitespace-nowrap" href="/uuid-generator">UUID Generator</a>
            <a class="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-[#1a73e8] dark:hover:text-white transition-colors whitespace-nowrap" href="/unix-converter">Unix Time Converter</a>
            <a class="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-[#1a73e8] dark:hover:text-white transition-colors whitespace-nowrap" href="/jwt-decoder">JWT Decoder</a>
            <a class="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-[#1a73e8] dark:hover:text-white transition-colors whitespace-nowrap" href="/word-counter">Word Counter & Editor</a>
            <a class="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-[#1a73e8] dark:hover:text-white transition-colors whitespace-nowrap" href="/diff-checker">Code Diff Checker</a>
            <a class="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-[#1a73e8] dark:hover:text-white transition-colors whitespace-nowrap" href="/markdown-preview">Markdown Live Preview</a>
            <a class="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-[#1a73e8] dark:hover:text-white transition-colors whitespace-nowrap" href="/url-base64">URL & Base64 Encoder / Decoder</a>
            <a class="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-[#1a73e8] dark:hover:text-white transition-colors whitespace-nowrap" href="/json-formatter">JSON Formatter / Validator</a>
            <a class="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-[#1a73e8] dark:hover:text-white transition-colors whitespace-nowrap" href="/qr-generator">QR Code Generator</a>
            <a class="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-[#1a73e8] dark:hover:text-white transition-colors whitespace-nowrap" href="/hash-generator">Hash Generator</a>
            <a class="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-[#1a73e8] dark:hover:text-white transition-colors whitespace-nowrap" href="/sql-formatter">SQL Formatter</a>
            <a class="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-[#1a73e8] dark:hover:text-white transition-colors whitespace-nowrap" href="/code-minifier">Code Minifier & Beautifier</a>
            <a class="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-[#1a73e8] dark:hover:text-white transition-colors whitespace-nowrap" href="/password-generator">Password & Secret Generator</a>
            <a class="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-[#1a73e8] dark:hover:text-white transition-colors whitespace-nowrap" href="/case-converter">Case Converter</a>
            </div>
          </div>
        </nav>
        <!-- WCF_NAV_DESKTOP_END -->
        
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
        <div class="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <div class="space-y-4">
            <div class="flex items-center gap-3">
              <span class="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">WeConvertFiles</span>
              <span class="rounded-full bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-900/50">
                <span class="bg-emerald-100 dark:bg-emerald-900/30 px-1 py-0.5 rounded font-semibold text-emerald-800 dark:text-emerald-200">100%</span> Client-Side
              </span>
            </div>
            <p class="max-w-xl text-xs leading-6 text-slate-600 dark:text-slate-400">
              WeConvertFiles processes supported files directly in your web browser using client-side WebAssembly and JavaScript. File contents are not sent to WeConvertFiles for conversion.
            </p>
            <div class="flex flex-wrap gap-4 text-xs font-bold text-slate-600 dark:text-slate-300 pt-2">
              <a class="hover:text-[#1967d2] hover:dark:text-white transition-colors" href="/about">About Us</a>
              <a class="hover:text-[#1967d2] hover:dark:text-white transition-colors" href="/contact">Contact Us</a>
              <a class="hover:text-[#1967d2] hover:dark:text-white transition-colors" href="/privacy">Privacy Policy</a>
              <a class="hover:text-[#1967d2] hover:dark:text-white transition-colors" href="/terms">Terms of Service</a>
              <a class="hover:text-[#1967d2] hover:dark:text-white transition-colors" href="/accessibility">Accessibility</a>
            </div>
          </div>
          <div class="rounded-2xl border border-slate-200/60 dark:border-slate-700/60 bg-white dark:bg-[#1e293b] p-5 shadow-sm space-y-2 max-w-xl">
            <h2 class="text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider">Our Mission & Support</h2>
            <p class="text-xs leading-5.5 text-slate-600 dark:text-slate-400">
              WeConvertFiles is proudly built by <a href="https://www.techknogeeks.com" target="_blank" rel="noopener" class="font-bold text-[#1a73e8] hover:underline">TechKnoGeeks</a> to provide free, privacy-focused browser-based document tools. Clearly labelled advertising helps fund hosting, maintenance, and continued development without requiring a subscription.
            </p>
          </div>
        </div>
        <div class="border-t border-slate-200/60 dark:border-slate-700/60 mt-8 pt-6 text-center text-[10px] text-slate-600 dark:text-slate-400">
          &copy; 2026 WeConvertFiles by TechKnoGeeks. All rights reserved.
        </div>
      </div>
    </footer>
  `;
  if (!shellAlreadyStatic) document.body.insertAdjacentHTML('beforeend', footerHtml);

  // Setup Event Listeners

  let pendingNavCloseTimer = null;

  function setNavMenuOpen(menu, open, { restoreFocus = false } = {}) {
    if (open) {
      clearTimeout(pendingNavCloseTimer);
      pendingNavCloseTimer = null;
    }
    const trigger = menu.querySelector('[data-nav-trigger]');
    const panel = menu.querySelector('[data-nav-panel]');
    trigger.setAttribute('aria-expanded', String(open));
    panel.hidden = !open;
    menu.classList.toggle('is-open', open);
    if (!open && restoreFocus) trigger.focus();
  }

  function closeNavMenus({ except = null, restoreFocus = false } = {}) {
    document.querySelectorAll('[data-nav-menu]').forEach((menu) => {
      if (menu !== except && menu.querySelector('[data-nav-trigger]')?.getAttribute('aria-expanded') === 'true') {
        setNavMenuOpen(menu, false, { restoreFocus });
      }
    });
  }

  function handleNavTriggerKeydown(event) {
    if (!['Enter', ' ', 'Spacebar', 'ArrowDown'].includes(event.key)) return;
    event.preventDefault();
    const menu = event.currentTarget.closest('[data-nav-menu]');
    closeNavMenus({ except: menu });
    setNavMenuOpen(menu, true);
    if (event.key === 'ArrowDown') menu.querySelector('[data-nav-panel] a')?.focus();
  }

  function handleFinePointerEnter(event) {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    clearTimeout(pendingNavCloseTimer);
    const menu = event.currentTarget.closest('[data-nav-menu]');
    closeNavMenus({ except: menu });
    setNavMenuOpen(menu, true);
  }

  function scheduleFinePointerClose(event) {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    clearTimeout(pendingNavCloseTimer);
    const menu = event.currentTarget.closest('[data-nav-menu]');
    pendingNavCloseTimer = setTimeout(() => {
      pendingNavCloseTimer = null;
      setNavMenuOpen(menu, false);
    }, 120);
  }

  function handleOutsideNavPointer(event) {
    if (event.target.closest('[data-nav-menu]') === null) closeNavMenus();
  }

  function handleOpenNavEscape(event) {
    if (event.key !== 'Escape') return;
    const menu = [...document.querySelectorAll('[data-nav-menu]')]
      .find((candidate) => candidate.querySelector('[data-nav-trigger]')?.getAttribute('aria-expanded') === 'true');
    if (!menu) return;
    event.preventDefault();
    setNavMenuOpen(menu, false, { restoreFocus: true });
  }

  function initializeNavMenus() {
    document.querySelectorAll('[data-nav-menu]').forEach((menu) => {
      const trigger = menu.querySelector('[data-nav-trigger]');
      trigger.addEventListener('click', () => {
        const nextOpen = trigger.getAttribute('aria-expanded') !== 'true';
        closeNavMenus({ except: menu });
        setNavMenuOpen(menu, nextOpen);
      });
      trigger.addEventListener('keydown', handleNavTriggerKeydown);
      menu.addEventListener('pointerenter', handleFinePointerEnter);
      menu.addEventListener('pointerleave', scheduleFinePointerClose);
    });
    document.addEventListener('pointerdown', handleOutsideNavPointer);
    document.addEventListener('keydown', handleOpenNavEscape);
  }

  initializeNavMenus();

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
  // WCF_NAV_GROUPS_START — generated from category-catalog.mjs (npm run generate:layout-nav); do not edit by hand.
  const categories = [
    { id: "pdf", name: "PDF", hubPath: "/category/pdf-tools", ids: ['pdf-to-word', 'merge-pdf', 'split-pdf', 'extract-pages', 'organize-pdf', 'rotate-pdf', 'remove-pages', 'decrypt-pdf', 'encrypt-pdf', 'compress-pdf', 'watermark-pdf', 'page-numbers', 'sign-pdf'] },
    { id: "images", name: "Images", hubPath: "/category/image-tools", ids: ['image-cropper', 'favicon-generator', 'image-scaler', 'pdf-images', 'pdf-jpg', 'images-pdf', 'webp-convert', 'bulk-resize', 'color-palette', 'exif-utility', 'heic-to-jpg', 'image-to-base64', 'base64-to-image', 'svg-to-image'] },
    { id: "data-office", name: "Data & Office", hubPath: "/category/convert-office", ids: ['excel-to-csv', 'csv-convert', 'json-convert', 'office-pdf', 'json-yaml'] },
    { id: "developer", name: "Developer", hubPath: "/category/developer-tools", ids: ['regex-tester', 'uuid-generator', 'unix-converter', 'jwt-decoder', 'word-counter', 'diff-checker', 'markdown-preview', 'url-base64', 'json-formatter', 'qr-generator', 'hash-generator', 'sql-formatter', 'code-minifier', 'password-generator', 'case-converter'] }
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
  const closeSearchBtn = document.getElementById('closeSearchBtn') || document.getElementById('closeSearchModal');
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
