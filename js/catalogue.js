/* GENERATED FILE — do not edit.
   Source: data/tools.mjs via scripts/generate-catalogue-runtime.mjs
   (npm run generate:catalogue-runtime). Delivers the tool catalogue's library
   sources and per-tool dependencies to the runtime app. */
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
  }
};
