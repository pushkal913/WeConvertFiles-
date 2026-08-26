/* GENERATED FILE — do not edit.
   Source: data/tools.mjs via scripts/generate-catalogue-runtime.mjs
   (npm run generate:catalogue-runtime). Delivers the tool catalogue's library
   sources, per-tool dependencies, breadcrumbs and fact blocks to the runtime app. */
window.WCF_CATALOGUE = {
  "libraries": {
    "jspdf": {
      "src": "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"
    },
    "pdfjs": {
      "src": "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js"
    },
    "pdflib": {
      "src": "https://cdn.jsdelivr.net/npm/pdf-lib-with-encrypt@1.2.1/dist/pdf-lib.min.js"
    },
    "papa": {
      "src": "https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.4.1/papaparse.min.js"
    },
    "xlsx": {
      "src": "https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js"
    },
    "jszip": {
      "src": "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"
    },
    "mammoth": {
      "src": "https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js"
    },
    "html2pdf": {
      "src": "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"
    },
    "docx": {
      "src": "https://cdn.jsdelivr.net/npm/docx@8.5.0/build/index.umd.js"
    },
    "jspdfautotable": {
      "src": "https://cdn.jsdelivr.net/npm/jspdf-autotable@3.8.2/dist/jspdf.plugin.autotable.min.js"
    },
    "cryptojs": {
      "src": "https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js"
    },
    "qrious": {
      "src": "https://cdnjs.cloudflare.com/ajax/libs/qrious/4.0.2/qrious.min.js"
    },
    "exif": {
      "src": "https://cdnjs.cloudflare.com/ajax/libs/exif-js/2.3.0/exif.min.js"
    },
    "heic2any": {
      "src": "https://cdn.jsdelivr.net/npm/heic2any@0.0.4/dist/heic2any.min.js"
    },
    "marked": {
      "src": "https://cdn.jsdelivr.net/npm/marked/marked.min.js"
    },
    "diff": {
      "src": "https://cdnjs.cloudflare.com/ajax/libs/diff_match_patch/20121119/diff_match_patch.js"
    },
    "jsyaml": {
      "src": "https://cdn.jsdelivr.net/npm/js-yaml@4.1.0/dist/js-yaml.min.js"
    },
    "sqlformatter": {
      "src": "https://cdn.jsdelivr.net/npm/sql-formatter@15.8.2/dist/sql-formatter.min.js"
    },
    "terser": {
      "src": "https://cdn.jsdelivr.net/npm/terser@5.49.0/dist/bundle.min.js"
    },
    "csso": {
      "src": "https://cdn.jsdelivr.net/npm/csso@5.0.5/dist/csso.js"
    },
    "jsbeautifyjs": {
      "src": "https://cdn.jsdelivr.net/npm/js-beautify@2.0.3/js/lib/beautify.js"
    },
    "jsbeautifycss": {
      "src": "https://cdn.jsdelivr.net/npm/js-beautify@2.0.3/js/lib/beautify-css.js"
    },
    "jsbeautifyhtml": {
      "src": "https://cdn.jsdelivr.net/npm/js-beautify@2.0.3/js/lib/beautify-html.js"
    },
    "cropper": {
      "src": "https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.6.2/cropper.min.js",
      "css": "https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.6.2/cropper.min.css"
    }
  },
  "dependencies": {
    "pdf-to-word": [
      "pdfjs"
    ],
    "office-pdf": [
      "html2pdf",
      "mammoth",
      "xlsx"
    ],
    "merge-pdf": [
      "pdflib"
    ],
    "images-pdf": [
      "jspdf"
    ],
    "compress-pdf": [
      "pdfjs",
      "jspdf"
    ],
    "heic-to-jpg": [
      "heic2any",
      "jszip"
    ],
    "split-pdf": [
      "pdflib",
      "jszip"
    ],
    "pdf-images": [
      "pdfjs",
      "jszip"
    ],
    "pdf-jpg": [
      "pdfjs",
      "jszip"
    ],
    "qr-generator": [
      "qrious"
    ],
    "sign-pdf": [
      "pdflib"
    ],
    "image-cropper": [
      "cropper"
    ],
    "extract-pages": [
      "pdflib"
    ],
    "remove-pages": [
      "pdfjs",
      "pdflib"
    ],
    "bulk-resize": [
      "jszip"
    ],
    "excel-to-csv": [
      "xlsx"
    ],
    "webp-convert": [
      "jszip"
    ],
    "organize-pdf": [
      "pdfjs",
      "pdflib"
    ],
    "watermark-pdf": [
      "pdflib"
    ],
    "page-numbers": [
      "pdflib"
    ],
    "rotate-pdf": [
      "pdfjs",
      "pdflib"
    ],
    "encrypt-pdf": [
      "pdflib"
    ],
    "json-convert": [
      "xlsx"
    ],
    "csv-convert": [
      "papa",
      "xlsx"
    ],
    "favicon-generator": [
      "jszip"
    ],
    "diff-checker": [
      "diff"
    ],
    "markdown-preview": [
      "marked"
    ],
    "hash-generator": [
      "cryptojs"
    ],
    "exif-utility": [
      "exif"
    ],
    "decrypt-pdf": [
      "pdflib",
      "pdfjs",
      "jspdf"
    ],
    "json-yaml": [
      "jsyaml"
    ],
    "sql-formatter": [
      "sqlformatter"
    ]
  },
  "breadcrumbs": {
    "image-to-base64": "<nav aria-label=\"Breadcrumb\" class=\"mb-6\">\n  <ol class=\"flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-500 dark:text-slate-400\">\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><a class=\"rounded hover:text-[#1a73e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]\" href=\"/\">Home</a></li>\n  <li aria-hidden=\"true\" class=\"select-none text-slate-300 dark:text-slate-600\">/</li>\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><a class=\"rounded hover:text-[#1a73e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]\" href=\"/category/image-tools\">Image Tools</a></li>\n  <li aria-hidden=\"true\" class=\"select-none text-slate-300 dark:text-slate-600\">/</li>\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><span aria-current=\"page\" class=\"font-medium text-slate-700 dark:text-slate-300\">Image to Base64</span></li>\n  </ol>\n</nav>",
    "base64-to-image": "<nav aria-label=\"Breadcrumb\" class=\"mb-6\">\n  <ol class=\"flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-500 dark:text-slate-400\">\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><a class=\"rounded hover:text-[#1a73e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]\" href=\"/\">Home</a></li>\n  <li aria-hidden=\"true\" class=\"select-none text-slate-300 dark:text-slate-600\">/</li>\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><a class=\"rounded hover:text-[#1a73e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]\" href=\"/category/image-tools\">Image Tools</a></li>\n  <li aria-hidden=\"true\" class=\"select-none text-slate-300 dark:text-slate-600\">/</li>\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><span aria-current=\"page\" class=\"font-medium text-slate-700 dark:text-slate-300\">Base64 to Image</span></li>\n  </ol>\n</nav>",
    "svg-to-image": "<nav aria-label=\"Breadcrumb\" class=\"mb-6\">\n  <ol class=\"flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-500 dark:text-slate-400\">\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><a class=\"rounded hover:text-[#1a73e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]\" href=\"/\">Home</a></li>\n  <li aria-hidden=\"true\" class=\"select-none text-slate-300 dark:text-slate-600\">/</li>\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><a class=\"rounded hover:text-[#1a73e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]\" href=\"/category/image-tools\">Image Tools</a></li>\n  <li aria-hidden=\"true\" class=\"select-none text-slate-300 dark:text-slate-600\">/</li>\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><span aria-current=\"page\" class=\"font-medium text-slate-700 dark:text-slate-300\">SVG to PNG / JPG</span></li>\n  </ol>\n</nav>",
    "pdf-to-word": "<nav aria-label=\"Breadcrumb\" class=\"mb-6\">\n  <ol class=\"flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-500 dark:text-slate-400\">\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><a class=\"rounded hover:text-[#1a73e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]\" href=\"/\">Home</a></li>\n  <li aria-hidden=\"true\" class=\"select-none text-slate-300 dark:text-slate-600\">/</li>\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><a class=\"rounded hover:text-[#1a73e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]\" href=\"/category/pdf-tools\">PDF Tools</a></li>\n  <li aria-hidden=\"true\" class=\"select-none text-slate-300 dark:text-slate-600\">/</li>\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><span aria-current=\"page\" class=\"font-medium text-slate-700 dark:text-slate-300\">PDF to Word / TXT</span></li>\n  </ol>\n</nav>",
    "office-pdf": "<nav aria-label=\"Breadcrumb\" class=\"mb-6\">\n  <ol class=\"flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-500 dark:text-slate-400\">\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><a class=\"rounded hover:text-[#1a73e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]\" href=\"/\">Home</a></li>\n  <li aria-hidden=\"true\" class=\"select-none text-slate-300 dark:text-slate-600\">/</li>\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><a class=\"rounded hover:text-[#1a73e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]\" href=\"/category/convert-office\">Convert &amp; Office Tools</a></li>\n  <li aria-hidden=\"true\" class=\"select-none text-slate-300 dark:text-slate-600\">/</li>\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><span aria-current=\"page\" class=\"font-medium text-slate-700 dark:text-slate-300\">Word / Excel to PDF</span></li>\n  </ol>\n</nav>",
    "merge-pdf": "<nav aria-label=\"Breadcrumb\" class=\"mb-6\">\n  <ol class=\"flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-500 dark:text-slate-400\">\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><a class=\"rounded hover:text-[#1a73e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]\" href=\"/\">Home</a></li>\n  <li aria-hidden=\"true\" class=\"select-none text-slate-300 dark:text-slate-600\">/</li>\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><a class=\"rounded hover:text-[#1a73e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]\" href=\"/category/pdf-tools\">PDF Tools</a></li>\n  <li aria-hidden=\"true\" class=\"select-none text-slate-300 dark:text-slate-600\">/</li>\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><span aria-current=\"page\" class=\"font-medium text-slate-700 dark:text-slate-300\">Merge PDF</span></li>\n  </ol>\n</nav>",
    "images-pdf": "<nav aria-label=\"Breadcrumb\" class=\"mb-6\">\n  <ol class=\"flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-500 dark:text-slate-400\">\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><a class=\"rounded hover:text-[#1a73e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]\" href=\"/\">Home</a></li>\n  <li aria-hidden=\"true\" class=\"select-none text-slate-300 dark:text-slate-600\">/</li>\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><a class=\"rounded hover:text-[#1a73e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]\" href=\"/category/image-tools\">Image Tools</a></li>\n  <li aria-hidden=\"true\" class=\"select-none text-slate-300 dark:text-slate-600\">/</li>\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><span aria-current=\"page\" class=\"font-medium text-slate-700 dark:text-slate-300\">Images to PDF</span></li>\n  </ol>\n</nav>",
    "compress-pdf": "<nav aria-label=\"Breadcrumb\" class=\"mb-6\">\n  <ol class=\"flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-500 dark:text-slate-400\">\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><a class=\"rounded hover:text-[#1a73e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]\" href=\"/\">Home</a></li>\n  <li aria-hidden=\"true\" class=\"select-none text-slate-300 dark:text-slate-600\">/</li>\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><a class=\"rounded hover:text-[#1a73e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]\" href=\"/category/pdf-tools\">PDF Tools</a></li>\n  <li aria-hidden=\"true\" class=\"select-none text-slate-300 dark:text-slate-600\">/</li>\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><span aria-current=\"page\" class=\"font-medium text-slate-700 dark:text-slate-300\">Compress PDF</span></li>\n  </ol>\n</nav>",
    "heic-to-jpg": "<nav aria-label=\"Breadcrumb\" class=\"mb-6\">\n  <ol class=\"flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-500 dark:text-slate-400\">\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><a class=\"rounded hover:text-[#1a73e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]\" href=\"/\">Home</a></li>\n  <li aria-hidden=\"true\" class=\"select-none text-slate-300 dark:text-slate-600\">/</li>\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><a class=\"rounded hover:text-[#1a73e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]\" href=\"/category/image-tools\">Image Tools</a></li>\n  <li aria-hidden=\"true\" class=\"select-none text-slate-300 dark:text-slate-600\">/</li>\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><span aria-current=\"page\" class=\"font-medium text-slate-700 dark:text-slate-300\">HEIC to JPG / PNG</span></li>\n  </ol>\n</nav>",
    "split-pdf": "<nav aria-label=\"Breadcrumb\" class=\"mb-6\">\n  <ol class=\"flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-500 dark:text-slate-400\">\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><a class=\"rounded hover:text-[#1a73e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]\" href=\"/\">Home</a></li>\n  <li aria-hidden=\"true\" class=\"select-none text-slate-300 dark:text-slate-600\">/</li>\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><a class=\"rounded hover:text-[#1a73e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]\" href=\"/category/pdf-tools\">PDF Tools</a></li>\n  <li aria-hidden=\"true\" class=\"select-none text-slate-300 dark:text-slate-600\">/</li>\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><span aria-current=\"page\" class=\"font-medium text-slate-700 dark:text-slate-300\">Split PDF</span></li>\n  </ol>\n</nav>",
    "pdf-images": "<nav aria-label=\"Breadcrumb\" class=\"mb-6\">\n  <ol class=\"flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-500 dark:text-slate-400\">\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><a class=\"rounded hover:text-[#1a73e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]\" href=\"/\">Home</a></li>\n  <li aria-hidden=\"true\" class=\"select-none text-slate-300 dark:text-slate-600\">/</li>\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><a class=\"rounded hover:text-[#1a73e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]\" href=\"/category/image-tools\">Image Tools</a></li>\n  <li aria-hidden=\"true\" class=\"select-none text-slate-300 dark:text-slate-600\">/</li>\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><span aria-current=\"page\" class=\"font-medium text-slate-700 dark:text-slate-300\">PDF to PNG</span></li>\n  </ol>\n</nav>",
    "pdf-jpg": "<nav aria-label=\"Breadcrumb\" class=\"mb-6\">\n  <ol class=\"flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-500 dark:text-slate-400\">\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><a class=\"rounded hover:text-[#1a73e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]\" href=\"/\">Home</a></li>\n  <li aria-hidden=\"true\" class=\"select-none text-slate-300 dark:text-slate-600\">/</li>\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><a class=\"rounded hover:text-[#1a73e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]\" href=\"/category/image-tools\">Image Tools</a></li>\n  <li aria-hidden=\"true\" class=\"select-none text-slate-300 dark:text-slate-600\">/</li>\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><span aria-current=\"page\" class=\"font-medium text-slate-700 dark:text-slate-300\">PDF to JPG</span></li>\n  </ol>\n</nav>",
    "qr-generator": "<nav aria-label=\"Breadcrumb\" class=\"mb-6\">\n  <ol class=\"flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-500 dark:text-slate-400\">\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><a class=\"rounded hover:text-[#1a73e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]\" href=\"/\">Home</a></li>\n  <li aria-hidden=\"true\" class=\"select-none text-slate-300 dark:text-slate-600\">/</li>\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><a class=\"rounded hover:text-[#1a73e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]\" href=\"/category/developer-tools\">Text &amp; Developer Tools</a></li>\n  <li aria-hidden=\"true\" class=\"select-none text-slate-300 dark:text-slate-600\">/</li>\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><span aria-current=\"page\" class=\"font-medium text-slate-700 dark:text-slate-300\">QR Code Generator</span></li>\n  </ol>\n</nav>",
    "sign-pdf": "<nav aria-label=\"Breadcrumb\" class=\"mb-6\">\n  <ol class=\"flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-500 dark:text-slate-400\">\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><a class=\"rounded hover:text-[#1a73e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]\" href=\"/\">Home</a></li>\n  <li aria-hidden=\"true\" class=\"select-none text-slate-300 dark:text-slate-600\">/</li>\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><a class=\"rounded hover:text-[#1a73e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]\" href=\"/category/pdf-tools\">PDF Tools</a></li>\n  <li aria-hidden=\"true\" class=\"select-none text-slate-300 dark:text-slate-600\">/</li>\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><span aria-current=\"page\" class=\"font-medium text-slate-700 dark:text-slate-300\">Sign PDF</span></li>\n  </ol>\n</nav>",
    "image-cropper": "<nav aria-label=\"Breadcrumb\" class=\"mb-6\">\n  <ol class=\"flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-500 dark:text-slate-400\">\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><a class=\"rounded hover:text-[#1a73e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]\" href=\"/\">Home</a></li>\n  <li aria-hidden=\"true\" class=\"select-none text-slate-300 dark:text-slate-600\">/</li>\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><a class=\"rounded hover:text-[#1a73e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]\" href=\"/category/image-tools\">Image Tools</a></li>\n  <li aria-hidden=\"true\" class=\"select-none text-slate-300 dark:text-slate-600\">/</li>\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><span aria-current=\"page\" class=\"font-medium text-slate-700 dark:text-slate-300\">Crop Image</span></li>\n  </ol>\n</nav>",
    "extract-pages": "<nav aria-label=\"Breadcrumb\" class=\"mb-6\">\n  <ol class=\"flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-500 dark:text-slate-400\">\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><a class=\"rounded hover:text-[#1a73e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]\" href=\"/\">Home</a></li>\n  <li aria-hidden=\"true\" class=\"select-none text-slate-300 dark:text-slate-600\">/</li>\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><a class=\"rounded hover:text-[#1a73e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]\" href=\"/category/pdf-tools\">PDF Tools</a></li>\n  <li aria-hidden=\"true\" class=\"select-none text-slate-300 dark:text-slate-600\">/</li>\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><span aria-current=\"page\" class=\"font-medium text-slate-700 dark:text-slate-300\">Extract Pages</span></li>\n  </ol>\n</nav>",
    "remove-pages": "<nav aria-label=\"Breadcrumb\" class=\"mb-6\">\n  <ol class=\"flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-500 dark:text-slate-400\">\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><a class=\"rounded hover:text-[#1a73e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]\" href=\"/\">Home</a></li>\n  <li aria-hidden=\"true\" class=\"select-none text-slate-300 dark:text-slate-600\">/</li>\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><a class=\"rounded hover:text-[#1a73e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]\" href=\"/category/pdf-tools\">PDF Tools</a></li>\n  <li aria-hidden=\"true\" class=\"select-none text-slate-300 dark:text-slate-600\">/</li>\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><span aria-current=\"page\" class=\"font-medium text-slate-700 dark:text-slate-300\">Remove Pages</span></li>\n  </ol>\n</nav>",
    "bulk-resize": "<nav aria-label=\"Breadcrumb\" class=\"mb-6\">\n  <ol class=\"flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-500 dark:text-slate-400\">\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><a class=\"rounded hover:text-[#1a73e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]\" href=\"/\">Home</a></li>\n  <li aria-hidden=\"true\" class=\"select-none text-slate-300 dark:text-slate-600\">/</li>\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><a class=\"rounded hover:text-[#1a73e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]\" href=\"/category/image-tools\">Image Tools</a></li>\n  <li aria-hidden=\"true\" class=\"select-none text-slate-300 dark:text-slate-600\">/</li>\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><span aria-current=\"page\" class=\"font-medium text-slate-700 dark:text-slate-300\">Bulk Image Resizer</span></li>\n  </ol>\n</nav>",
    "excel-to-csv": "<nav aria-label=\"Breadcrumb\" class=\"mb-6\">\n  <ol class=\"flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-500 dark:text-slate-400\">\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><a class=\"rounded hover:text-[#1a73e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]\" href=\"/\">Home</a></li>\n  <li aria-hidden=\"true\" class=\"select-none text-slate-300 dark:text-slate-600\">/</li>\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><a class=\"rounded hover:text-[#1a73e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]\" href=\"/category/convert-office\">Convert &amp; Office Tools</a></li>\n  <li aria-hidden=\"true\" class=\"select-none text-slate-300 dark:text-slate-600\">/</li>\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><span aria-current=\"page\" class=\"font-medium text-slate-700 dark:text-slate-300\">Excel to CSV / JSON</span></li>\n  </ol>\n</nav>",
    "word-counter": "<nav aria-label=\"Breadcrumb\" class=\"mb-6\">\n  <ol class=\"flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-500 dark:text-slate-400\">\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><a class=\"rounded hover:text-[#1a73e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]\" href=\"/\">Home</a></li>\n  <li aria-hidden=\"true\" class=\"select-none text-slate-300 dark:text-slate-600\">/</li>\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><a class=\"rounded hover:text-[#1a73e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]\" href=\"/category/developer-tools\">Text &amp; Developer Tools</a></li>\n  <li aria-hidden=\"true\" class=\"select-none text-slate-300 dark:text-slate-600\">/</li>\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><span aria-current=\"page\" class=\"font-medium text-slate-700 dark:text-slate-300\">Word &amp; Character Counter</span></li>\n  </ol>\n</nav>",
    "image-scaler": "<nav aria-label=\"Breadcrumb\" class=\"mb-6\">\n  <ol class=\"flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-500 dark:text-slate-400\">\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><a class=\"rounded hover:text-[#1a73e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]\" href=\"/\">Home</a></li>\n  <li aria-hidden=\"true\" class=\"select-none text-slate-300 dark:text-slate-600\">/</li>\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><a class=\"rounded hover:text-[#1a73e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]\" href=\"/category/image-tools\">Image Tools</a></li>\n  <li aria-hidden=\"true\" class=\"select-none text-slate-300 dark:text-slate-600\">/</li>\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><span aria-current=\"page\" class=\"font-medium text-slate-700 dark:text-slate-300\">Scale Image</span></li>\n  </ol>\n</nav>",
    "webp-convert": "<nav aria-label=\"Breadcrumb\" class=\"mb-6\">\n  <ol class=\"flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-500 dark:text-slate-400\">\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><a class=\"rounded hover:text-[#1a73e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]\" href=\"/\">Home</a></li>\n  <li aria-hidden=\"true\" class=\"select-none text-slate-300 dark:text-slate-600\">/</li>\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><a class=\"rounded hover:text-[#1a73e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]\" href=\"/category/image-tools\">Image Tools</a></li>\n  <li aria-hidden=\"true\" class=\"select-none text-slate-300 dark:text-slate-600\">/</li>\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><span aria-current=\"page\" class=\"font-medium text-slate-700 dark:text-slate-300\">Image to WebP</span></li>\n  </ol>\n</nav>",
    "organize-pdf": "<nav aria-label=\"Breadcrumb\" class=\"mb-6\">\n  <ol class=\"flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-500 dark:text-slate-400\">\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><a class=\"rounded hover:text-[#1a73e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]\" href=\"/\">Home</a></li>\n  <li aria-hidden=\"true\" class=\"select-none text-slate-300 dark:text-slate-600\">/</li>\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><a class=\"rounded hover:text-[#1a73e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]\" href=\"/category/pdf-tools\">PDF Tools</a></li>\n  <li aria-hidden=\"true\" class=\"select-none text-slate-300 dark:text-slate-600\">/</li>\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><span aria-current=\"page\" class=\"font-medium text-slate-700 dark:text-slate-300\">Organize PDF</span></li>\n  </ol>\n</nav>",
    "watermark-pdf": "<nav aria-label=\"Breadcrumb\" class=\"mb-6\">\n  <ol class=\"flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-500 dark:text-slate-400\">\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><a class=\"rounded hover:text-[#1a73e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]\" href=\"/\">Home</a></li>\n  <li aria-hidden=\"true\" class=\"select-none text-slate-300 dark:text-slate-600\">/</li>\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><a class=\"rounded hover:text-[#1a73e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]\" href=\"/category/pdf-tools\">PDF Tools</a></li>\n  <li aria-hidden=\"true\" class=\"select-none text-slate-300 dark:text-slate-600\">/</li>\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><span aria-current=\"page\" class=\"font-medium text-slate-700 dark:text-slate-300\">Watermark PDF</span></li>\n  </ol>\n</nav>",
    "page-numbers": "<nav aria-label=\"Breadcrumb\" class=\"mb-6\">\n  <ol class=\"flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-500 dark:text-slate-400\">\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><a class=\"rounded hover:text-[#1a73e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]\" href=\"/\">Home</a></li>\n  <li aria-hidden=\"true\" class=\"select-none text-slate-300 dark:text-slate-600\">/</li>\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><a class=\"rounded hover:text-[#1a73e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]\" href=\"/category/pdf-tools\">PDF Tools</a></li>\n  <li aria-hidden=\"true\" class=\"select-none text-slate-300 dark:text-slate-600\">/</li>\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><span aria-current=\"page\" class=\"font-medium text-slate-700 dark:text-slate-300\">Add Page Numbers</span></li>\n  </ol>\n</nav>",
    "rotate-pdf": "<nav aria-label=\"Breadcrumb\" class=\"mb-6\">\n  <ol class=\"flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-500 dark:text-slate-400\">\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><a class=\"rounded hover:text-[#1a73e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]\" href=\"/\">Home</a></li>\n  <li aria-hidden=\"true\" class=\"select-none text-slate-300 dark:text-slate-600\">/</li>\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><a class=\"rounded hover:text-[#1a73e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]\" href=\"/category/pdf-tools\">PDF Tools</a></li>\n  <li aria-hidden=\"true\" class=\"select-none text-slate-300 dark:text-slate-600\">/</li>\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><span aria-current=\"page\" class=\"font-medium text-slate-700 dark:text-slate-300\">Rotate PDF</span></li>\n  </ol>\n</nav>",
    "encrypt-pdf": "<nav aria-label=\"Breadcrumb\" class=\"mb-6\">\n  <ol class=\"flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-500 dark:text-slate-400\">\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><a class=\"rounded hover:text-[#1a73e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]\" href=\"/\">Home</a></li>\n  <li aria-hidden=\"true\" class=\"select-none text-slate-300 dark:text-slate-600\">/</li>\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><a class=\"rounded hover:text-[#1a73e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]\" href=\"/category/pdf-tools\">PDF Tools</a></li>\n  <li aria-hidden=\"true\" class=\"select-none text-slate-300 dark:text-slate-600\">/</li>\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><span aria-current=\"page\" class=\"font-medium text-slate-700 dark:text-slate-300\">Protect PDF</span></li>\n  </ol>\n</nav>",
    "json-convert": "<nav aria-label=\"Breadcrumb\" class=\"mb-6\">\n  <ol class=\"flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-500 dark:text-slate-400\">\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><a class=\"rounded hover:text-[#1a73e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]\" href=\"/\">Home</a></li>\n  <li aria-hidden=\"true\" class=\"select-none text-slate-300 dark:text-slate-600\">/</li>\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><a class=\"rounded hover:text-[#1a73e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]\" href=\"/category/convert-office\">Convert &amp; Office Tools</a></li>\n  <li aria-hidden=\"true\" class=\"select-none text-slate-300 dark:text-slate-600\">/</li>\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><span aria-current=\"page\" class=\"font-medium text-slate-700 dark:text-slate-300\">JSON to CSV / Excel</span></li>\n  </ol>\n</nav>",
    "csv-convert": "<nav aria-label=\"Breadcrumb\" class=\"mb-6\">\n  <ol class=\"flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-500 dark:text-slate-400\">\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><a class=\"rounded hover:text-[#1a73e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]\" href=\"/\">Home</a></li>\n  <li aria-hidden=\"true\" class=\"select-none text-slate-300 dark:text-slate-600\">/</li>\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><a class=\"rounded hover:text-[#1a73e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]\" href=\"/category/convert-office\">Convert &amp; Office Tools</a></li>\n  <li aria-hidden=\"true\" class=\"select-none text-slate-300 dark:text-slate-600\">/</li>\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><span aria-current=\"page\" class=\"font-medium text-slate-700 dark:text-slate-300\">CSV to Excel or JSON</span></li>\n  </ol>\n</nav>",
    "json-formatter": "<nav aria-label=\"Breadcrumb\" class=\"mb-6\">\n  <ol class=\"flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-500 dark:text-slate-400\">\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><a class=\"rounded hover:text-[#1a73e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]\" href=\"/\">Home</a></li>\n  <li aria-hidden=\"true\" class=\"select-none text-slate-300 dark:text-slate-600\">/</li>\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><a class=\"rounded hover:text-[#1a73e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]\" href=\"/category/developer-tools\">Text &amp; Developer Tools</a></li>\n  <li aria-hidden=\"true\" class=\"select-none text-slate-300 dark:text-slate-600\">/</li>\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><span aria-current=\"page\" class=\"font-medium text-slate-700 dark:text-slate-300\">JSON Formatter / Validator</span></li>\n  </ol>\n</nav>",
    "color-palette": "<nav aria-label=\"Breadcrumb\" class=\"mb-6\">\n  <ol class=\"flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-500 dark:text-slate-400\">\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><a class=\"rounded hover:text-[#1a73e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]\" href=\"/\">Home</a></li>\n  <li aria-hidden=\"true\" class=\"select-none text-slate-300 dark:text-slate-600\">/</li>\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><a class=\"rounded hover:text-[#1a73e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]\" href=\"/category/image-tools\">Image Tools</a></li>\n  <li aria-hidden=\"true\" class=\"select-none text-slate-300 dark:text-slate-600\">/</li>\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><span aria-current=\"page\" class=\"font-medium text-slate-700 dark:text-slate-300\">Image Color Picker &amp; Eyedropper</span></li>\n  </ol>\n</nav>",
    "favicon-generator": "<nav aria-label=\"Breadcrumb\" class=\"mb-6\">\n  <ol class=\"flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-500 dark:text-slate-400\">\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><a class=\"rounded hover:text-[#1a73e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]\" href=\"/\">Home</a></li>\n  <li aria-hidden=\"true\" class=\"select-none text-slate-300 dark:text-slate-600\">/</li>\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><a class=\"rounded hover:text-[#1a73e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]\" href=\"/category/image-tools\">Image Tools</a></li>\n  <li aria-hidden=\"true\" class=\"select-none text-slate-300 dark:text-slate-600\">/</li>\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><span aria-current=\"page\" class=\"font-medium text-slate-700 dark:text-slate-300\">Favicon Generator</span></li>\n  </ol>\n</nav>",
    "diff-checker": "<nav aria-label=\"Breadcrumb\" class=\"mb-6\">\n  <ol class=\"flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-500 dark:text-slate-400\">\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><a class=\"rounded hover:text-[#1a73e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]\" href=\"/\">Home</a></li>\n  <li aria-hidden=\"true\" class=\"select-none text-slate-300 dark:text-slate-600\">/</li>\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><a class=\"rounded hover:text-[#1a73e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]\" href=\"/category/developer-tools\">Text &amp; Developer Tools</a></li>\n  <li aria-hidden=\"true\" class=\"select-none text-slate-300 dark:text-slate-600\">/</li>\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><span aria-current=\"page\" class=\"font-medium text-slate-700 dark:text-slate-300\">Code Diff Checker</span></li>\n  </ol>\n</nav>",
    "url-base64": "<nav aria-label=\"Breadcrumb\" class=\"mb-6\">\n  <ol class=\"flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-500 dark:text-slate-400\">\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><a class=\"rounded hover:text-[#1a73e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]\" href=\"/\">Home</a></li>\n  <li aria-hidden=\"true\" class=\"select-none text-slate-300 dark:text-slate-600\">/</li>\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><a class=\"rounded hover:text-[#1a73e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]\" href=\"/category/developer-tools\">Text &amp; Developer Tools</a></li>\n  <li aria-hidden=\"true\" class=\"select-none text-slate-300 dark:text-slate-600\">/</li>\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><span aria-current=\"page\" class=\"font-medium text-slate-700 dark:text-slate-300\">URL / Base64 Converter</span></li>\n  </ol>\n</nav>",
    "markdown-preview": "<nav aria-label=\"Breadcrumb\" class=\"mb-6\">\n  <ol class=\"flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-500 dark:text-slate-400\">\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><a class=\"rounded hover:text-[#1a73e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]\" href=\"/\">Home</a></li>\n  <li aria-hidden=\"true\" class=\"select-none text-slate-300 dark:text-slate-600\">/</li>\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><a class=\"rounded hover:text-[#1a73e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]\" href=\"/category/developer-tools\">Text &amp; Developer Tools</a></li>\n  <li aria-hidden=\"true\" class=\"select-none text-slate-300 dark:text-slate-600\">/</li>\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><span aria-current=\"page\" class=\"font-medium text-slate-700 dark:text-slate-300\">Markdown Live Preview</span></li>\n  </ol>\n</nav>",
    "regex-tester": "<nav aria-label=\"Breadcrumb\" class=\"mb-6\">\n  <ol class=\"flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-500 dark:text-slate-400\">\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><a class=\"rounded hover:text-[#1a73e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]\" href=\"/\">Home</a></li>\n  <li aria-hidden=\"true\" class=\"select-none text-slate-300 dark:text-slate-600\">/</li>\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><a class=\"rounded hover:text-[#1a73e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]\" href=\"/category/developer-tools\">Text &amp; Developer Tools</a></li>\n  <li aria-hidden=\"true\" class=\"select-none text-slate-300 dark:text-slate-600\">/</li>\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><span aria-current=\"page\" class=\"font-medium text-slate-700 dark:text-slate-300\">Regex Tester</span></li>\n  </ol>\n</nav>",
    "jwt-decoder": "<nav aria-label=\"Breadcrumb\" class=\"mb-6\">\n  <ol class=\"flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-500 dark:text-slate-400\">\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><a class=\"rounded hover:text-[#1a73e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]\" href=\"/\">Home</a></li>\n  <li aria-hidden=\"true\" class=\"select-none text-slate-300 dark:text-slate-600\">/</li>\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><a class=\"rounded hover:text-[#1a73e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]\" href=\"/category/developer-tools\">Text &amp; Developer Tools</a></li>\n  <li aria-hidden=\"true\" class=\"select-none text-slate-300 dark:text-slate-600\">/</li>\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><span aria-current=\"page\" class=\"font-medium text-slate-700 dark:text-slate-300\">JWT Decoder</span></li>\n  </ol>\n</nav>",
    "uuid-generator": "<nav aria-label=\"Breadcrumb\" class=\"mb-6\">\n  <ol class=\"flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-500 dark:text-slate-400\">\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><a class=\"rounded hover:text-[#1a73e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]\" href=\"/\">Home</a></li>\n  <li aria-hidden=\"true\" class=\"select-none text-slate-300 dark:text-slate-600\">/</li>\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><a class=\"rounded hover:text-[#1a73e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]\" href=\"/category/developer-tools\">Text &amp; Developer Tools</a></li>\n  <li aria-hidden=\"true\" class=\"select-none text-slate-300 dark:text-slate-600\">/</li>\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><span aria-current=\"page\" class=\"font-medium text-slate-700 dark:text-slate-300\">UUID Generator</span></li>\n  </ol>\n</nav>",
    "hash-generator": "<nav aria-label=\"Breadcrumb\" class=\"mb-6\">\n  <ol class=\"flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-500 dark:text-slate-400\">\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><a class=\"rounded hover:text-[#1a73e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]\" href=\"/\">Home</a></li>\n  <li aria-hidden=\"true\" class=\"select-none text-slate-300 dark:text-slate-600\">/</li>\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><a class=\"rounded hover:text-[#1a73e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]\" href=\"/category/developer-tools\">Text &amp; Developer Tools</a></li>\n  <li aria-hidden=\"true\" class=\"select-none text-slate-300 dark:text-slate-600\">/</li>\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><span aria-current=\"page\" class=\"font-medium text-slate-700 dark:text-slate-300\">Hash Generator</span></li>\n  </ol>\n</nav>",
    "exif-utility": "<nav aria-label=\"Breadcrumb\" class=\"mb-6\">\n  <ol class=\"flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-500 dark:text-slate-400\">\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><a class=\"rounded hover:text-[#1a73e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]\" href=\"/\">Home</a></li>\n  <li aria-hidden=\"true\" class=\"select-none text-slate-300 dark:text-slate-600\">/</li>\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><a class=\"rounded hover:text-[#1a73e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]\" href=\"/category/image-tools\">Image Tools</a></li>\n  <li aria-hidden=\"true\" class=\"select-none text-slate-300 dark:text-slate-600\">/</li>\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><span aria-current=\"page\" class=\"font-medium text-slate-700 dark:text-slate-300\">EXIF Viewer / Remover</span></li>\n  </ol>\n</nav>",
    "unix-converter": "<nav aria-label=\"Breadcrumb\" class=\"mb-6\">\n  <ol class=\"flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-500 dark:text-slate-400\">\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><a class=\"rounded hover:text-[#1a73e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]\" href=\"/\">Home</a></li>\n  <li aria-hidden=\"true\" class=\"select-none text-slate-300 dark:text-slate-600\">/</li>\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><a class=\"rounded hover:text-[#1a73e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]\" href=\"/category/developer-tools\">Text &amp; Developer Tools</a></li>\n  <li aria-hidden=\"true\" class=\"select-none text-slate-300 dark:text-slate-600\">/</li>\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><span aria-current=\"page\" class=\"font-medium text-slate-700 dark:text-slate-300\">Unix Time Converter</span></li>\n  </ol>\n</nav>",
    "decrypt-pdf": "<nav aria-label=\"Breadcrumb\" class=\"mb-6\">\n  <ol class=\"flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-500 dark:text-slate-400\">\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><a class=\"rounded hover:text-[#1a73e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]\" href=\"/\">Home</a></li>\n  <li aria-hidden=\"true\" class=\"select-none text-slate-300 dark:text-slate-600\">/</li>\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><a class=\"rounded hover:text-[#1a73e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]\" href=\"/category/pdf-tools\">PDF Tools</a></li>\n  <li aria-hidden=\"true\" class=\"select-none text-slate-300 dark:text-slate-600\">/</li>\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><span aria-current=\"page\" class=\"font-medium text-slate-700 dark:text-slate-300\">Unlock PDF</span></li>\n  </ol>\n</nav>",
    "json-yaml": "<nav aria-label=\"Breadcrumb\" class=\"mb-6\">\n  <ol class=\"flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-500 dark:text-slate-400\">\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><a class=\"rounded hover:text-[#1a73e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]\" href=\"/\">Home</a></li>\n  <li aria-hidden=\"true\" class=\"select-none text-slate-300 dark:text-slate-600\">/</li>\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><a class=\"rounded hover:text-[#1a73e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]\" href=\"/category/convert-office\">Convert &amp; Office Tools</a></li>\n  <li aria-hidden=\"true\" class=\"select-none text-slate-300 dark:text-slate-600\">/</li>\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><span aria-current=\"page\" class=\"font-medium text-slate-700 dark:text-slate-300\">JSON to YAML Converter</span></li>\n  </ol>\n</nav>",
    "sql-formatter": "<nav aria-label=\"Breadcrumb\" class=\"mb-6\">\n  <ol class=\"flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-500 dark:text-slate-400\">\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><a class=\"rounded hover:text-[#1a73e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]\" href=\"/\">Home</a></li>\n  <li aria-hidden=\"true\" class=\"select-none text-slate-300 dark:text-slate-600\">/</li>\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><a class=\"rounded hover:text-[#1a73e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]\" href=\"/category/developer-tools\">Text &amp; Developer Tools</a></li>\n  <li aria-hidden=\"true\" class=\"select-none text-slate-300 dark:text-slate-600\">/</li>\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><span aria-current=\"page\" class=\"font-medium text-slate-700 dark:text-slate-300\">SQL Formatter</span></li>\n  </ol>\n</nav>",
    "code-minifier": "<nav aria-label=\"Breadcrumb\" class=\"mb-6\">\n  <ol class=\"flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-500 dark:text-slate-400\">\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><a class=\"rounded hover:text-[#1a73e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]\" href=\"/\">Home</a></li>\n  <li aria-hidden=\"true\" class=\"select-none text-slate-300 dark:text-slate-600\">/</li>\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><a class=\"rounded hover:text-[#1a73e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]\" href=\"/category/developer-tools\">Text &amp; Developer Tools</a></li>\n  <li aria-hidden=\"true\" class=\"select-none text-slate-300 dark:text-slate-600\">/</li>\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><span aria-current=\"page\" class=\"font-medium text-slate-700 dark:text-slate-300\">Code Minifier &amp; Beautifier</span></li>\n  </ol>\n</nav>",
    "password-generator": "<nav aria-label=\"Breadcrumb\" class=\"mb-6\">\n  <ol class=\"flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-500 dark:text-slate-400\">\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><a class=\"rounded hover:text-[#1a73e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]\" href=\"/\">Home</a></li>\n  <li aria-hidden=\"true\" class=\"select-none text-slate-300 dark:text-slate-600\">/</li>\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><a class=\"rounded hover:text-[#1a73e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]\" href=\"/category/developer-tools\">Text &amp; Developer Tools</a></li>\n  <li aria-hidden=\"true\" class=\"select-none text-slate-300 dark:text-slate-600\">/</li>\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><span aria-current=\"page\" class=\"font-medium text-slate-700 dark:text-slate-300\">Password &amp; Secret Generator</span></li>\n  </ol>\n</nav>",
    "case-converter": "<nav aria-label=\"Breadcrumb\" class=\"mb-6\">\n  <ol class=\"flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-500 dark:text-slate-400\">\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><a class=\"rounded hover:text-[#1a73e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]\" href=\"/\">Home</a></li>\n  <li aria-hidden=\"true\" class=\"select-none text-slate-300 dark:text-slate-600\">/</li>\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><a class=\"rounded hover:text-[#1a73e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]\" href=\"/category/developer-tools\">Text &amp; Developer Tools</a></li>\n  <li aria-hidden=\"true\" class=\"select-none text-slate-300 dark:text-slate-600\">/</li>\n  <li class=\"min-w-0 max-w-[60vw] truncate\"><span aria-current=\"page\" class=\"font-medium text-slate-700 dark:text-slate-300\">Case Converter</span></li>\n  </ol>\n</nav>"
  },
  "factBlocks": {
    "image-to-base64": "<section class=\"rounded-[28px] border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-[#1e293b] p-6 shadow-material\" aria-labelledby=\"toolFactsHeading\">\n  <h2 id=\"toolFactsHeading\" class=\"text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400\">Tool facts</h2>\n  <dl class=\"mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2\">\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Processing</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">In your browser</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Uploads</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">None — nothing is sent to a server</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Account</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Not required</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Input</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">A PNG, JPG, WebP or GIF image</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Output</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Base64 string and Data URI (copy or .txt)</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Best for</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Embedding an image in HTML, CSS or JSON</dd>\n    </div>\n  </dl>\n</section>",
    "base64-to-image": "<section class=\"rounded-[28px] border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-[#1e293b] p-6 shadow-material\" aria-labelledby=\"toolFactsHeading\">\n  <h2 id=\"toolFactsHeading\" class=\"text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400\">Tool facts</h2>\n  <dl class=\"mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2\">\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Processing</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">In your browser</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Uploads</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">None — nothing is sent to a server</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Account</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Not required</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Input</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">A Base64 string or Data URI (or a .txt file)</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Output</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">A PNG, JPG, WebP or GIF file</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Best for</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Inspecting or saving Base64 image data</dd>\n    </div>\n  </dl>\n</section>",
    "svg-to-image": "<section class=\"rounded-[28px] border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-[#1e293b] p-6 shadow-material\" aria-labelledby=\"toolFactsHeading\">\n  <h2 id=\"toolFactsHeading\" class=\"text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400\">Tool facts</h2>\n  <dl class=\"mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2\">\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Processing</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">In your browser</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Uploads</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">None — nothing is sent to a server</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Account</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Not required</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Input</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">An SVG file or pasted SVG XML</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Output</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">A PNG or JPG at a size you set</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Good to know</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Limited XML cleanup; exports a fixed-size raster</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Best for</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Rasterising vectors for social, print or legacy apps</dd>\n    </div>\n  </dl>\n</section>",
    "pdf-to-word": "<section class=\"rounded-[28px] border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-[#1e293b] p-6 shadow-material\" aria-labelledby=\"toolFactsHeading\">\n  <h2 id=\"toolFactsHeading\" class=\"text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400\">Tool facts</h2>\n  <dl class=\"mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2\">\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Processing</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">In your browser</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Uploads</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">None — nothing is sent to a server</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Account</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Not required</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Input</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">One PDF that has a text layer</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Output</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">An editable DOCX or a UTF-8 TXT</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Good to know</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">No OCR — scanned, image-only pages produce little or no text</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Best for</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Getting editable text out of a text-based PDF</dd>\n    </div>\n  </dl>\n</section>",
    "office-pdf": "<section class=\"rounded-[28px] border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-[#1e293b] p-6 shadow-material\" aria-labelledby=\"toolFactsHeading\">\n  <h2 id=\"toolFactsHeading\" class=\"text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400\">Tool facts</h2>\n  <dl class=\"mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2\">\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Processing</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">In your browser</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Uploads</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">None — nothing is sent to a server</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Account</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Not required</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Input</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">One Word (.docx) or Excel (.xlsx) file</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Output</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">One PDF</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Good to know</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Client-side conversion; complex Office layouts may differ from the original</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Best for</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">A quick PDF from a straightforward document or sheet</dd>\n    </div>\n  </dl>\n</section>",
    "merge-pdf": "<section class=\"rounded-[28px] border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-[#1e293b] p-6 shadow-material\" aria-labelledby=\"toolFactsHeading\">\n  <h2 id=\"toolFactsHeading\" class=\"text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400\">Tool facts</h2>\n  <dl class=\"mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2\">\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Processing</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">In your browser</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Uploads</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">None — nothing is sent to a server</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Account</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Not required</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Input</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Two or more PDF files</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Output</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">One merged PDF</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Best for</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Combining documents in a chosen order</dd>\n    </div>\n  </dl>\n</section>",
    "images-pdf": "<section class=\"rounded-[28px] border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-[#1e293b] p-6 shadow-material\" aria-labelledby=\"toolFactsHeading\">\n  <h2 id=\"toolFactsHeading\" class=\"text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400\">Tool facts</h2>\n  <dl class=\"mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2\">\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Processing</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">In your browser</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Uploads</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">None — nothing is sent to a server</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Account</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Not required</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Input</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">PNG and JPG images (batch)</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Output</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">One A4 portrait PDF, one image per page</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Good to know</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">No OCR — text inside images stays as image content</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Best for</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Turning photos or scans into one PDF</dd>\n    </div>\n  </dl>\n</section>",
    "compress-pdf": "<section class=\"rounded-[28px] border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-[#1e293b] p-6 shadow-material\" aria-labelledby=\"toolFactsHeading\">\n  <h2 id=\"toolFactsHeading\" class=\"text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400\">Tool facts</h2>\n  <dl class=\"mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2\">\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Processing</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">In your browser</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Uploads</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">None — nothing is sent to a server</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Account</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Not required</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Input</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">One PDF</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Output</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">A rasterised PDF (Low, Medium or High)</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Good to know</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Rasterises text, links, forms and vectors; a smaller file is not guaranteed</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Best for</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Shrinking an image-heavy PDF</dd>\n    </div>\n  </dl>\n</section>",
    "heic-to-jpg": "<section class=\"rounded-[28px] border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-[#1e293b] p-6 shadow-material\" aria-labelledby=\"toolFactsHeading\">\n  <h2 id=\"toolFactsHeading\" class=\"text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400\">Tool facts</h2>\n  <dl class=\"mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2\">\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Processing</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">In your browser</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Uploads</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">None — nothing is sent to a server</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Account</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Not required</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Input</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">One or more Apple HEIC photos</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Output</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">JPG or PNG (a single file, or a ZIP for a batch)</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Good to know</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Metadata and HEIC-specific features may not survive</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Best for</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Opening iPhone photos in any app</dd>\n    </div>\n  </dl>\n</section>",
    "split-pdf": "<section class=\"rounded-[28px] border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-[#1e293b] p-6 shadow-material\" aria-labelledby=\"toolFactsHeading\">\n  <h2 id=\"toolFactsHeading\" class=\"text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400\">Tool facts</h2>\n  <dl class=\"mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2\">\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Processing</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">In your browser</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Uploads</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">None — nothing is sent to a server</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Account</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Not required</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Input</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">One PDF</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Output</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">One PDF per page, in a ZIP</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Good to know</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Splits every page; no custom page ranges</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Best for</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Breaking a PDF into single-page files</dd>\n    </div>\n  </dl>\n</section>",
    "pdf-images": "<section class=\"rounded-[28px] border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-[#1e293b] p-6 shadow-material\" aria-labelledby=\"toolFactsHeading\">\n  <h2 id=\"toolFactsHeading\" class=\"text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400\">Tool facts</h2>\n  <dl class=\"mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2\">\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Processing</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">In your browser</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Uploads</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">None — nothing is sent to a server</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Account</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Not required</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Input</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">One PDF</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Output</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">A lossless PNG of each page, in a ZIP</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Good to know</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Renders whole pages; does not extract embedded images</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Best for</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Getting a faithful image of every page</dd>\n    </div>\n  </dl>\n</section>",
    "pdf-jpg": "<section class=\"rounded-[28px] border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-[#1e293b] p-6 shadow-material\" aria-labelledby=\"toolFactsHeading\">\n  <h2 id=\"toolFactsHeading\" class=\"text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400\">Tool facts</h2>\n  <dl class=\"mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2\">\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Processing</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">In your browser</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Uploads</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">None — nothing is sent to a server</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Account</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Not required</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Input</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">One PDF</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Output</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">A JPG of each page, in a ZIP</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Good to know</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Whole-page render; sharp text can show JPEG artefacts</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Best for</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Sharing PDF pages as photos</dd>\n    </div>\n  </dl>\n</section>",
    "qr-generator": "<section class=\"rounded-[28px] border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-[#1e293b] p-6 shadow-material\" aria-labelledby=\"toolFactsHeading\">\n  <h2 id=\"toolFactsHeading\" class=\"text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400\">Tool facts</h2>\n  <dl class=\"mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2\">\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Processing</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">In your browser</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Uploads</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">None — nothing is sent to a server</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Account</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Not required</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Input</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Text or a URL</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Output</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">A PNG QR code (150–300 px)</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Good to know</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Input is encoded literally; no dedicated Wi-Fi or phone forms</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Best for</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Making a QR code for a link or text</dd>\n    </div>\n  </dl>\n</section>",
    "sign-pdf": "<section class=\"rounded-[28px] border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-[#1e293b] p-6 shadow-material\" aria-labelledby=\"toolFactsHeading\">\n  <h2 id=\"toolFactsHeading\" class=\"text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400\">Tool facts</h2>\n  <dl class=\"mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2\">\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Processing</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">In your browser</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Uploads</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">None — nothing is sent to a server</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Account</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Not required</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Input</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">One PDF plus a drawn or typed signature</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Output</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">A signed PDF</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Good to know</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">A visible mark only — not a certificate-based digital signature and no identity verification</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Best for</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Adding a visible signature to a page</dd>\n    </div>\n  </dl>\n</section>",
    "image-cropper": "<section class=\"rounded-[28px] border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-[#1e293b] p-6 shadow-material\" aria-labelledby=\"toolFactsHeading\">\n  <h2 id=\"toolFactsHeading\" class=\"text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400\">Tool facts</h2>\n  <dl class=\"mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2\">\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Processing</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">In your browser</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Uploads</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">None — nothing is sent to a server</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Account</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Not required</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Input</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">One JPG, PNG or WebP image</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Output</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">A cropped PNG</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Best for</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Cropping to a selection or fixed aspect ratio</dd>\n    </div>\n  </dl>\n</section>",
    "extract-pages": "<section class=\"rounded-[28px] border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-[#1e293b] p-6 shadow-material\" aria-labelledby=\"toolFactsHeading\">\n  <h2 id=\"toolFactsHeading\" class=\"text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400\">Tool facts</h2>\n  <dl class=\"mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2\">\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Processing</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">In your browser</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Uploads</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">None — nothing is sent to a server</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Account</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Not required</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Input</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">One PDF and the page numbers to keep</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Output</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">A new PDF of just those pages</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Best for</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Keeping only the pages you need</dd>\n    </div>\n  </dl>\n</section>",
    "remove-pages": "<section class=\"rounded-[28px] border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-[#1e293b] p-6 shadow-material\" aria-labelledby=\"toolFactsHeading\">\n  <h2 id=\"toolFactsHeading\" class=\"text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400\">Tool facts</h2>\n  <dl class=\"mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2\">\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Processing</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">In your browser</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Uploads</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">None — nothing is sent to a server</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Account</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Not required</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Input</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">One PDF (select pages to delete)</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Output</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">A new PDF without those pages</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Best for</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Deleting unwanted pages visually</dd>\n    </div>\n  </dl>\n</section>",
    "bulk-resize": "<section class=\"rounded-[28px] border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-[#1e293b] p-6 shadow-material\" aria-labelledby=\"toolFactsHeading\">\n  <h2 id=\"toolFactsHeading\" class=\"text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400\">Tool facts</h2>\n  <dl class=\"mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2\">\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Processing</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">In your browser</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Uploads</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">None — nothing is sent to a server</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Account</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Not required</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Input</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">PNG, JPG or WebP images (batch)</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Output</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Resized images in a ZIP (same formats)</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Good to know</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Resizes, not crops; JPG/WebP are re-encoded (~0.85), so even 100% is a re-encode</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Best for</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Applying one size rule to a whole folder</dd>\n    </div>\n  </dl>\n</section>",
    "excel-to-csv": "<section class=\"rounded-[28px] border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-[#1e293b] p-6 shadow-material\" aria-labelledby=\"toolFactsHeading\">\n  <h2 id=\"toolFactsHeading\" class=\"text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400\">Tool facts</h2>\n  <dl class=\"mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2\">\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Processing</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">In your browser</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Uploads</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">None — nothing is sent to a server</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Account</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Not required</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Input</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">One Excel (.xls or .xlsx) file</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Output</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">A CSV file</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Best for</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Getting plain CSV out of a spreadsheet</dd>\n    </div>\n  </dl>\n</section>",
    "word-counter": "<section class=\"rounded-[28px] border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-[#1e293b] p-6 shadow-material\" aria-labelledby=\"toolFactsHeading\">\n  <h2 id=\"toolFactsHeading\" class=\"text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400\">Tool facts</h2>\n  <dl class=\"mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2\">\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Processing</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">In your browser</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Uploads</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">None — nothing is sent to a server</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Account</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Not required</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Input</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Text you type or paste</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Output</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Word, character, paragraph and reading-time counts</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Good to know</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">No sentence count and no grammar or spell checking</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Best for</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Checking length while you write</dd>\n    </div>\n  </dl>\n</section>",
    "image-scaler": "<section class=\"rounded-[28px] border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-[#1e293b] p-6 shadow-material\" aria-labelledby=\"toolFactsHeading\">\n  <h2 id=\"toolFactsHeading\" class=\"text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400\">Tool facts</h2>\n  <dl class=\"mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2\">\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Processing</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">In your browser</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Uploads</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">None — nothing is sent to a server</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Account</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Not required</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Input</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">One JPG, PNG or WebP image</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Output</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">A 1.5×, 2× or 3× image (PNG or JPEG)</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Good to know</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Lanczos-3 interpolation smooths edges but cannot add real detail</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Best for</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Enlarging an image with smoother edges</dd>\n    </div>\n  </dl>\n</section>",
    "webp-convert": "<section class=\"rounded-[28px] border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-[#1e293b] p-6 shadow-material\" aria-labelledby=\"toolFactsHeading\">\n  <h2 id=\"toolFactsHeading\" class=\"text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400\">Tool facts</h2>\n  <dl class=\"mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2\">\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Processing</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">In your browser</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Uploads</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">None — nothing is sent to a server</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Account</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Not required</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Input</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">JPG and PNG images (batch)</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Output</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">WebP images in a ZIP</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Best for</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Shrinking web images to WebP</dd>\n    </div>\n  </dl>\n</section>",
    "organize-pdf": "<section class=\"rounded-[28px] border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-[#1e293b] p-6 shadow-material\" aria-labelledby=\"toolFactsHeading\">\n  <h2 id=\"toolFactsHeading\" class=\"text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400\">Tool facts</h2>\n  <dl class=\"mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2\">\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Processing</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">In your browser</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Uploads</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">None — nothing is sent to a server</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Account</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Not required</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Input</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">One PDF and a new page order</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Output</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">A reordered PDF</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Best for</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Reordering or duplicating pages</dd>\n    </div>\n  </dl>\n</section>",
    "watermark-pdf": "<section class=\"rounded-[28px] border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-[#1e293b] p-6 shadow-material\" aria-labelledby=\"toolFactsHeading\">\n  <h2 id=\"toolFactsHeading\" class=\"text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400\">Tool facts</h2>\n  <dl class=\"mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2\">\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Processing</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">In your browser</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Uploads</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">None — nothing is sent to a server</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Account</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Not required</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Input</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">One PDF and watermark text</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Output</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">A watermarked PDF</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Best for</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Stamping a watermark across every page</dd>\n    </div>\n  </dl>\n</section>",
    "page-numbers": "<section class=\"rounded-[28px] border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-[#1e293b] p-6 shadow-material\" aria-labelledby=\"toolFactsHeading\">\n  <h2 id=\"toolFactsHeading\" class=\"text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400\">Tool facts</h2>\n  <dl class=\"mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2\">\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Processing</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">In your browser</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Uploads</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">None — nothing is sent to a server</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Account</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Not required</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Input</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">One PDF</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Output</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">A PDF with page numbers added</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Best for</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Numbering pages of a document</dd>\n    </div>\n  </dl>\n</section>",
    "rotate-pdf": "<section class=\"rounded-[28px] border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-[#1e293b] p-6 shadow-material\" aria-labelledby=\"toolFactsHeading\">\n  <h2 id=\"toolFactsHeading\" class=\"text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400\">Tool facts</h2>\n  <dl class=\"mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2\">\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Processing</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">In your browser</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Uploads</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">None — nothing is sent to a server</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Account</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Not required</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Input</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">One PDF (choose the rotation)</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Output</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">A rotated PDF</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Best for</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Fixing page orientation</dd>\n    </div>\n  </dl>\n</section>",
    "encrypt-pdf": "<section class=\"rounded-[28px] border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-[#1e293b] p-6 shadow-material\" aria-labelledby=\"toolFactsHeading\">\n  <h2 id=\"toolFactsHeading\" class=\"text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400\">Tool facts</h2>\n  <dl class=\"mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2\">\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Processing</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">In your browser</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Uploads</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">None — nothing is sent to a server</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Account</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Not required</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Input</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">One PDF and a password</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Output</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">A password-protected PDF</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Good to know</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">The password is applied on your device and never sent anywhere</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Best for</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Locking a PDF before sharing it</dd>\n    </div>\n  </dl>\n</section>",
    "json-convert": "<section class=\"rounded-[28px] border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-[#1e293b] p-6 shadow-material\" aria-labelledby=\"toolFactsHeading\">\n  <h2 id=\"toolFactsHeading\" class=\"text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400\">Tool facts</h2>\n  <dl class=\"mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2\">\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Processing</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">In your browser</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Uploads</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">None — nothing is sent to a server</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Account</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Not required</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Input</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">A JSON array (paste or a .json file)</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Output</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">A CSV or Excel .xlsx file</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Good to know</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Nested keys are flattened into columns</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Best for</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Turning JSON/API data into a spreadsheet</dd>\n    </div>\n  </dl>\n</section>",
    "csv-convert": "<section class=\"rounded-[28px] border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-[#1e293b] p-6 shadow-material\" aria-labelledby=\"toolFactsHeading\">\n  <h2 id=\"toolFactsHeading\" class=\"text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400\">Tool facts</h2>\n  <dl class=\"mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2\">\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Processing</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">In your browser</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Uploads</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">None — nothing is sent to a server</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Account</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Not required</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Input</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">CSV data (paste or a .csv file)</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Output</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">JSON or an Excel .xlsx workbook</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Best for</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Converting CSV for apps or spreadsheets</dd>\n    </div>\n  </dl>\n</section>",
    "json-formatter": "<section class=\"rounded-[28px] border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-[#1e293b] p-6 shadow-material\" aria-labelledby=\"toolFactsHeading\">\n  <h2 id=\"toolFactsHeading\" class=\"text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400\">Tool facts</h2>\n  <dl class=\"mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2\">\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Processing</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">In your browser</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Uploads</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">None — nothing is sent to a server</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Account</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Not required</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Input</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">JSON text</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Output</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Formatted or minified JSON, with validation</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Best for</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Validating and tidying JSON</dd>\n    </div>\n  </dl>\n</section>",
    "color-palette": "<section class=\"rounded-[28px] border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-[#1e293b] p-6 shadow-material\" aria-labelledby=\"toolFactsHeading\">\n  <h2 id=\"toolFactsHeading\" class=\"text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400\">Tool facts</h2>\n  <dl class=\"mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2\">\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Processing</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">In your browser</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Uploads</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">None — nothing is sent to a server</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Account</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Not required</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Input</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">One JPG, PNG or WebP image</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Output</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Dominant colours as HEX and RGB</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Best for</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Building a colour scheme from an image</dd>\n    </div>\n  </dl>\n</section>",
    "favicon-generator": "<section class=\"rounded-[28px] border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-[#1e293b] p-6 shadow-material\" aria-labelledby=\"toolFactsHeading\">\n  <h2 id=\"toolFactsHeading\" class=\"text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400\">Tool facts</h2>\n  <dl class=\"mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2\">\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Processing</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">In your browser</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Uploads</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">None — nothing is sent to a server</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Account</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Not required</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Input</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">One square JPG, PNG or WebP image</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Output</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">favicon.ico + apple-touch-icon.png in a ZIP</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Best for</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Making favicons for a website</dd>\n    </div>\n  </dl>\n</section>",
    "diff-checker": "<section class=\"rounded-[28px] border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-[#1e293b] p-6 shadow-material\" aria-labelledby=\"toolFactsHeading\">\n  <h2 id=\"toolFactsHeading\" class=\"text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400\">Tool facts</h2>\n  <dl class=\"mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2\">\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Processing</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">In your browser</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Uploads</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">None — nothing is sent to a server</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Account</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Not required</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Input</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Two blocks of text</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Output</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Colour-coded inline differences</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Best for</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Comparing two versions of text or code</dd>\n    </div>\n  </dl>\n</section>",
    "url-base64": "<section class=\"rounded-[28px] border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-[#1e293b] p-6 shadow-material\" aria-labelledby=\"toolFactsHeading\">\n  <h2 id=\"toolFactsHeading\" class=\"text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400\">Tool facts</h2>\n  <dl class=\"mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2\">\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Processing</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">In your browser</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Uploads</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">None — nothing is sent to a server</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Account</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Not required</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Input</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Text or an encoded string</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Output</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">URL-encoded/decoded or Base64 text</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Best for</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Encoding or decoding for URLs and APIs</dd>\n    </div>\n  </dl>\n</section>",
    "markdown-preview": "<section class=\"rounded-[28px] border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-[#1e293b] p-6 shadow-material\" aria-labelledby=\"toolFactsHeading\">\n  <h2 id=\"toolFactsHeading\" class=\"text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400\">Tool facts</h2>\n  <dl class=\"mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2\">\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Processing</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">In your browser</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Uploads</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">None — nothing is sent to a server</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Account</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Not required</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Input</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Markdown text</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Output</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">A live rendered HTML preview</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Best for</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Previewing a README as you write</dd>\n    </div>\n  </dl>\n</section>",
    "regex-tester": "<section class=\"rounded-[28px] border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-[#1e293b] p-6 shadow-material\" aria-labelledby=\"toolFactsHeading\">\n  <h2 id=\"toolFactsHeading\" class=\"text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400\">Tool facts</h2>\n  <dl class=\"mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2\">\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Processing</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">In your browser</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Uploads</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">None — nothing is sent to a server</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Account</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Not required</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Input</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">A regex pattern (with g/i/m/s flags) and test text</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Output</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Live highlighted matches</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Best for</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Testing a regular expression</dd>\n    </div>\n  </dl>\n</section>",
    "jwt-decoder": "<section class=\"rounded-[28px] border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-[#1e293b] p-6 shadow-material\" aria-labelledby=\"toolFactsHeading\">\n  <h2 id=\"toolFactsHeading\" class=\"text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400\">Tool facts</h2>\n  <dl class=\"mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2\">\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Processing</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">In your browser</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Uploads</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">None — nothing is sent to a server</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Account</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Not required</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Input</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">A JWT string</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Output</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">The decoded header and payload</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Good to know</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Decodes only — it does not verify the token signature</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Best for</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Inspecting a token’s claims</dd>\n    </div>\n  </dl>\n</section>",
    "uuid-generator": "<section class=\"rounded-[28px] border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-[#1e293b] p-6 shadow-material\" aria-labelledby=\"toolFactsHeading\">\n  <h2 id=\"toolFactsHeading\" class=\"text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400\">Tool facts</h2>\n  <dl class=\"mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2\">\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Processing</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">In your browser</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Uploads</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">None — nothing is sent to a server</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Account</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Not required</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Input</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">A version (v4 random or v1 time-based) and a count</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Output</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">One or more UUIDs</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Best for</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Generating unique identifiers</dd>\n    </div>\n  </dl>\n</section>",
    "hash-generator": "<section class=\"rounded-[28px] border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-[#1e293b] p-6 shadow-material\" aria-labelledby=\"toolFactsHeading\">\n  <h2 id=\"toolFactsHeading\" class=\"text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400\">Tool facts</h2>\n  <dl class=\"mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2\">\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Processing</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">In your browser</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Uploads</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">None — nothing is sent to a server</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Account</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Not required</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Input</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Text you type or paste</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Output</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">MD5, SHA-1, SHA-256 and SHA-512 digests</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Best for</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Hashing a string</dd>\n    </div>\n  </dl>\n</section>",
    "exif-utility": "<section class=\"rounded-[28px] border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-[#1e293b] p-6 shadow-material\" aria-labelledby=\"toolFactsHeading\">\n  <h2 id=\"toolFactsHeading\" class=\"text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400\">Tool facts</h2>\n  <dl class=\"mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2\">\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Processing</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">In your browser</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Uploads</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">None — nothing is sent to a server</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Account</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Not required</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Input</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">One JPG or PNG image</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Output</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">A metadata view and a copy with EXIF removed</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Best for</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Stripping location and camera metadata</dd>\n    </div>\n  </dl>\n</section>",
    "unix-converter": "<section class=\"rounded-[28px] border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-[#1e293b] p-6 shadow-material\" aria-labelledby=\"toolFactsHeading\">\n  <h2 id=\"toolFactsHeading\" class=\"text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400\">Tool facts</h2>\n  <dl class=\"mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2\">\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Processing</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">In your browser</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Uploads</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">None — nothing is sent to a server</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Account</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Not required</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Input</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">A Unix timestamp or a date</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Output</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">The converted date/time</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Best for</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Converting Unix timestamps</dd>\n    </div>\n  </dl>\n</section>",
    "decrypt-pdf": "<section class=\"rounded-[28px] border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-[#1e293b] p-6 shadow-material\" aria-labelledby=\"toolFactsHeading\">\n  <h2 id=\"toolFactsHeading\" class=\"text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400\">Tool facts</h2>\n  <dl class=\"mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2\">\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Processing</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">In your browser</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Uploads</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">None — nothing is sent to a server</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Account</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Not required</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Input</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">One protected PDF and its password</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Output</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">An unlocked PDF</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Good to know</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">You must already know the correct password</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Best for</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Removing a password you own</dd>\n    </div>\n  </dl>\n</section>",
    "json-yaml": "<section class=\"rounded-[28px] border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-[#1e293b] p-6 shadow-material\" aria-labelledby=\"toolFactsHeading\">\n  <h2 id=\"toolFactsHeading\" class=\"text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400\">Tool facts</h2>\n  <dl class=\"mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2\">\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Processing</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">In your browser</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Uploads</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">None — nothing is sent to a server</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Account</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Not required</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Input</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">JSON or YAML text</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Output</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">The other format (YAML or JSON)</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Best for</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Converting config between JSON and YAML</dd>\n    </div>\n  </dl>\n</section>",
    "sql-formatter": "<section class=\"rounded-[28px] border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-[#1e293b] p-6 shadow-material\" aria-labelledby=\"toolFactsHeading\">\n  <h2 id=\"toolFactsHeading\" class=\"text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400\">Tool facts</h2>\n  <dl class=\"mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2\">\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Processing</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">In your browser</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Uploads</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">None — nothing is sent to a server</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Account</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Not required</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Input</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">SQL query text</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Output</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Formatted, dialect-aware SQL</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Good to know</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Formats text only — it never connects to or runs against a database</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Best for</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Beautifying SQL queries</dd>\n    </div>\n  </dl>\n</section>",
    "code-minifier": "<section class=\"rounded-[28px] border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-[#1e293b] p-6 shadow-material\" aria-labelledby=\"toolFactsHeading\">\n  <h2 id=\"toolFactsHeading\" class=\"text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400\">Tool facts</h2>\n  <dl class=\"mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2\">\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Processing</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">In your browser</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Uploads</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">None — nothing is sent to a server</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Account</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Not required</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Input</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">HTML, CSS or JavaScript</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Output</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Minified or beautified code</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Good to know</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Parsed and rewritten only — your code is never executed</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Best for</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Shrinking or tidying code</dd>\n    </div>\n  </dl>\n</section>",
    "password-generator": "<section class=\"rounded-[28px] border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-[#1e293b] p-6 shadow-material\" aria-labelledby=\"toolFactsHeading\">\n  <h2 id=\"toolFactsHeading\" class=\"text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400\">Tool facts</h2>\n  <dl class=\"mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2\">\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Processing</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">In your browser</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Uploads</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">None — nothing is sent to a server</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Account</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Not required</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Input</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Length and character-set options</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Output</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">A password or a hex / Base64URL token</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Good to know</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Uses the Web Crypto secure RNG; nothing is stored, logged or transmitted</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Best for</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Creating strong passwords or tokens</dd>\n    </div>\n  </dl>\n</section>",
    "case-converter": "<section class=\"rounded-[28px] border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-[#1e293b] p-6 shadow-material\" aria-labelledby=\"toolFactsHeading\">\n  <h2 id=\"toolFactsHeading\" class=\"text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400\">Tool facts</h2>\n  <dl class=\"mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2\">\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Processing</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">In your browser</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Uploads</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">None — nothing is sent to a server</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Account</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Not required</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Input</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Text you type or paste</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Output</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">The text in your chosen case style</dd>\n    </div>\n    <div class=\"min-w-0\">\n      <dt class=\"text-xs font-semibold uppercase tracking-wide text-slate-400\">Best for</dt>\n      <dd class=\"mt-0.5 text-sm leading-6 font-medium text-slate-800 dark:text-slate-200\">Reformatting text case</dd>\n    </div>\n  </dl>\n</section>"
  },
  "related": {
    "image-to-base64": {
      "guide": "/guides/image-to-base64",
      "tools": [
        "heic-to-jpg",
        "image-cropper",
        "bulk-resize",
        "image-scaler",
        "webp-convert",
        "color-palette"
      ]
    },
    "base64-to-image": {
      "guide": "/guides/base64-to-image",
      "tools": [
        "heic-to-jpg",
        "image-cropper",
        "bulk-resize",
        "image-scaler",
        "webp-convert",
        "color-palette"
      ]
    },
    "svg-to-image": {
      "guide": "/guides/svg-to-image",
      "tools": [
        "heic-to-jpg",
        "image-cropper",
        "bulk-resize",
        "image-scaler",
        "webp-convert",
        "color-palette"
      ]
    },
    "pdf-to-word": {
      "guide": "/guides/pdf-to-word",
      "tools": [
        "pdf-images",
        "pdf-jpg",
        "merge-pdf",
        "split-pdf",
        "extract-pages",
        "organize-pdf"
      ]
    },
    "office-pdf": {
      "guide": "/guides/office-pdf",
      "tools": [
        "images-pdf",
        "excel-to-csv",
        "csv-convert",
        "json-convert",
        "json-yaml"
      ]
    },
    "merge-pdf": {
      "guide": "/guides/merge-pdf",
      "tools": [
        "compress-pdf",
        "split-pdf",
        "sign-pdf",
        "extract-pages",
        "remove-pages",
        "organize-pdf"
      ]
    },
    "images-pdf": {
      "guide": "/guides/images-to-pdf",
      "tools": [
        "office-pdf",
        "image-cropper",
        "favicon-generator",
        "image-scaler",
        "pdf-images",
        "pdf-jpg"
      ]
    },
    "compress-pdf": {
      "guide": "/guides/compress-pdf",
      "tools": [
        "merge-pdf",
        "split-pdf",
        "sign-pdf",
        "extract-pages",
        "remove-pages",
        "organize-pdf"
      ]
    },
    "heic-to-jpg": {
      "guide": "/guides/heic-to-jpg",
      "tools": [
        "image-cropper",
        "bulk-resize",
        "image-scaler",
        "webp-convert",
        "color-palette",
        "favicon-generator"
      ]
    },
    "split-pdf": {
      "guide": "/guides/split-pdf",
      "tools": [
        "merge-pdf",
        "compress-pdf",
        "sign-pdf",
        "extract-pages",
        "remove-pages",
        "organize-pdf"
      ]
    },
    "pdf-images": {
      "guide": "/guides/pdf-to-images",
      "tools": [
        "pdf-to-word",
        "pdf-jpg",
        "image-cropper",
        "favicon-generator",
        "image-scaler",
        "images-pdf"
      ]
    },
    "pdf-jpg": {
      "guide": "/guides/pdf-to-jpg",
      "tools": [
        "pdf-to-word",
        "pdf-images",
        "image-cropper",
        "favicon-generator",
        "image-scaler",
        "images-pdf"
      ]
    },
    "qr-generator": {
      "guide": "/guides/qr-generator",
      "tools": [
        "word-counter",
        "json-formatter",
        "diff-checker",
        "url-base64",
        "markdown-preview",
        "regex-tester"
      ]
    },
    "sign-pdf": {
      "guide": "/guides/sign-pdf",
      "tools": [
        "merge-pdf",
        "compress-pdf",
        "split-pdf",
        "extract-pages",
        "remove-pages",
        "organize-pdf"
      ]
    },
    "image-cropper": {
      "guide": "/guides/image-cropper",
      "tools": [
        "heic-to-jpg",
        "bulk-resize",
        "image-scaler",
        "webp-convert",
        "color-palette",
        "favicon-generator"
      ]
    },
    "extract-pages": {
      "guide": "/guides/extract-pages",
      "tools": [
        "merge-pdf",
        "compress-pdf",
        "split-pdf",
        "sign-pdf",
        "remove-pages",
        "organize-pdf"
      ]
    },
    "remove-pages": {
      "guide": "/guides/remove-pages",
      "tools": [
        "merge-pdf",
        "compress-pdf",
        "split-pdf",
        "sign-pdf",
        "extract-pages",
        "organize-pdf"
      ]
    },
    "bulk-resize": {
      "guide": "/guides/bulk-resize",
      "tools": [
        "heic-to-jpg",
        "image-cropper",
        "image-scaler",
        "webp-convert",
        "color-palette",
        "favicon-generator"
      ]
    },
    "excel-to-csv": {
      "guide": "/guides/excel-to-csv",
      "tools": [
        "json-convert",
        "csv-convert",
        "json-yaml",
        "office-pdf"
      ]
    },
    "word-counter": {
      "guide": "/guides/word-counter",
      "tools": [
        "qr-generator",
        "json-formatter",
        "diff-checker",
        "url-base64",
        "markdown-preview",
        "regex-tester"
      ]
    },
    "image-scaler": {
      "guide": "/guides/image-scaler",
      "tools": [
        "heic-to-jpg",
        "image-cropper",
        "bulk-resize",
        "webp-convert",
        "color-palette",
        "favicon-generator"
      ]
    },
    "webp-convert": {
      "guide": "/guides/webp-convert",
      "tools": [
        "heic-to-jpg",
        "image-cropper",
        "bulk-resize",
        "image-scaler",
        "color-palette",
        "favicon-generator"
      ]
    },
    "organize-pdf": {
      "guide": "/guides/organize-pdf",
      "tools": [
        "merge-pdf",
        "compress-pdf",
        "split-pdf",
        "sign-pdf",
        "extract-pages",
        "remove-pages"
      ]
    },
    "watermark-pdf": {
      "guide": "/guides/watermark-pdf",
      "tools": [
        "merge-pdf",
        "compress-pdf",
        "split-pdf",
        "sign-pdf",
        "extract-pages",
        "remove-pages"
      ]
    },
    "page-numbers": {
      "guide": "/guides/page-numbers",
      "tools": [
        "merge-pdf",
        "compress-pdf",
        "split-pdf",
        "sign-pdf",
        "extract-pages",
        "remove-pages"
      ]
    },
    "rotate-pdf": {
      "guide": "/guides/rotate-pdf",
      "tools": [
        "merge-pdf",
        "compress-pdf",
        "split-pdf",
        "sign-pdf",
        "extract-pages",
        "remove-pages"
      ]
    },
    "encrypt-pdf": {
      "guide": "/guides/encrypt-pdf",
      "tools": [
        "merge-pdf",
        "compress-pdf",
        "split-pdf",
        "sign-pdf",
        "extract-pages",
        "remove-pages"
      ]
    },
    "json-convert": {
      "guide": "/guides/json-convert",
      "tools": [
        "excel-to-csv",
        "csv-convert",
        "json-yaml",
        "office-pdf"
      ]
    },
    "csv-convert": {
      "guide": "/guides/csv-convert",
      "tools": [
        "excel-to-csv",
        "json-convert",
        "json-yaml",
        "office-pdf"
      ]
    },
    "json-formatter": {
      "guide": "/guides/json-formatter",
      "tools": [
        "qr-generator",
        "word-counter",
        "diff-checker",
        "url-base64",
        "markdown-preview",
        "regex-tester"
      ]
    },
    "color-palette": {
      "guide": "/guides/color-palette",
      "tools": [
        "heic-to-jpg",
        "image-cropper",
        "bulk-resize",
        "image-scaler",
        "webp-convert",
        "favicon-generator"
      ]
    },
    "favicon-generator": {
      "guide": "/guides/favicon-generator",
      "tools": [
        "heic-to-jpg",
        "image-cropper",
        "bulk-resize",
        "image-scaler",
        "webp-convert",
        "color-palette"
      ]
    },
    "diff-checker": {
      "guide": "/guides/diff-checker",
      "tools": [
        "qr-generator",
        "word-counter",
        "json-formatter",
        "url-base64",
        "markdown-preview",
        "regex-tester"
      ]
    },
    "url-base64": {
      "guide": "/guides/url-base64",
      "tools": [
        "qr-generator",
        "word-counter",
        "json-formatter",
        "diff-checker",
        "markdown-preview",
        "regex-tester"
      ]
    },
    "markdown-preview": {
      "guide": "/guides/markdown-preview",
      "tools": [
        "qr-generator",
        "word-counter",
        "json-formatter",
        "diff-checker",
        "url-base64",
        "regex-tester"
      ]
    },
    "regex-tester": {
      "guide": "/guides/regex-tester",
      "tools": [
        "qr-generator",
        "word-counter",
        "json-formatter",
        "diff-checker",
        "url-base64",
        "markdown-preview"
      ]
    },
    "jwt-decoder": {
      "guide": "/guides/jwt-decoder",
      "tools": [
        "qr-generator",
        "word-counter",
        "json-formatter",
        "diff-checker",
        "url-base64",
        "markdown-preview"
      ]
    },
    "uuid-generator": {
      "guide": "/guides/uuid-generator",
      "tools": [
        "qr-generator",
        "word-counter",
        "json-formatter",
        "diff-checker",
        "url-base64",
        "markdown-preview"
      ]
    },
    "hash-generator": {
      "guide": "/guides/hash-generator",
      "tools": [
        "qr-generator",
        "word-counter",
        "json-formatter",
        "diff-checker",
        "url-base64",
        "markdown-preview"
      ]
    },
    "exif-utility": {
      "guide": "/guides/exif-utility",
      "tools": [
        "heic-to-jpg",
        "image-cropper",
        "bulk-resize",
        "image-scaler",
        "webp-convert",
        "color-palette"
      ]
    },
    "unix-converter": {
      "guide": "/guides/unix-converter",
      "tools": [
        "qr-generator",
        "word-counter",
        "json-formatter",
        "diff-checker",
        "url-base64",
        "markdown-preview"
      ]
    },
    "decrypt-pdf": {
      "guide": "/guides/decrypt-pdf",
      "tools": [
        "merge-pdf",
        "compress-pdf",
        "split-pdf",
        "sign-pdf",
        "extract-pages",
        "remove-pages"
      ]
    },
    "json-yaml": {
      "guide": "/guides/json-yaml",
      "tools": [
        "excel-to-csv",
        "json-convert",
        "csv-convert",
        "office-pdf"
      ]
    },
    "sql-formatter": {
      "guide": "/guides/sql-formatter",
      "tools": [
        "qr-generator",
        "word-counter",
        "json-formatter",
        "diff-checker",
        "url-base64",
        "markdown-preview"
      ]
    },
    "code-minifier": {
      "guide": "/guides/code-minifier",
      "tools": [
        "qr-generator",
        "word-counter",
        "json-formatter",
        "diff-checker",
        "url-base64",
        "markdown-preview"
      ]
    },
    "password-generator": {
      "guide": "/guides/password-generator",
      "tools": [
        "qr-generator",
        "word-counter",
        "json-formatter",
        "diff-checker",
        "url-base64",
        "markdown-preview"
      ]
    },
    "case-converter": {
      "guide": "/guides/case-converter",
      "tools": [
        "qr-generator",
        "word-counter",
        "json-formatter",
        "diff-checker",
        "url-base64",
        "markdown-preview"
      ]
    }
  }
};
