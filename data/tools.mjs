// data/tools.js
//
// AUTHORITATIVE tool catalogue — the single source of truth for tool metadata
// (identity, display labels, category, route, guide URL, implementation module
// and external library dependencies) for all 47 tools.
//
// Build-time generators consume this file. app.js still holds the runtime tool
// config; scripts/validate-catalogue.mjs enforces that the two stay in sync, so
// this catalogue is authoritative and cannot silently drift. Edit tool metadata
// here first.
//
// Fields per tool:
//   id           stable identifier (never change — routes, guides, storage rely on it)
//   title        human name shown on cards and tool pages
//   description  one-line summary used on cards and in guide cross-links
//   kicker       small category label shown above the title on a card
//   badge        short capability tag shown on a card
//   icon         { bg, color } Tailwind classes for the card icon chip
//   category     id of the catalogue category this tool belongs to
//   route        clean URL the tool is served at
//   guide        URL of the tool's guide article
//   module       implementation module that provides the tool at runtime
//   dependencies external libraries (keys of `libraries`) the tool loads on demand

export const libraries = {
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
};

export const categories = [
  {
    "id": "create-pdf",
    "title": "Create & Convert to PDF",
    "rgb": "37, 99, 235",
    "icon": "<path d=\"M12 3v12m0 0l-4-4m4 4l4-4\"/><path d=\"M5 19h14\"/>",
    "toolIds": [
      "office-pdf",
      "images-pdf"
    ]
  },
  {
    "id": "manage-pdf",
    "title": "Edit & Manage PDF",
    "rgb": "249, 115, 22",
    "icon": "<path d=\"M12 20h9\"/><path d=\"M16.5 3.5a2.1 2.1 0 013 3L8 18l-4 1 1-4z\"/>",
    "toolIds": [
      "merge-pdf",
      "compress-pdf",
      "split-pdf",
      "sign-pdf",
      "extract-pages",
      "remove-pages",
      "organize-pdf",
      "watermark-pdf",
      "page-numbers",
      "rotate-pdf",
      "encrypt-pdf",
      "decrypt-pdf"
    ]
  },
  {
    "id": "pdf-outputs",
    "title": "Convert PDF to Other Formats",
    "rgb": "244, 63, 94",
    "icon": "<path d=\"M7 7h10l-3-3m3 3l-3 3\"/><path d=\"M17 17H7l3 3m-3-3l3-3\"/>",
    "toolIds": [
      "pdf-to-word",
      "pdf-images",
      "pdf-jpg"
    ]
  },
  {
    "id": "image-tools",
    "title": "Image Conversion & Editing",
    "rgb": "16, 185, 129",
    "icon": "<rect x=\"3\" y=\"4\" width=\"18\" height=\"16\" rx=\"2\"/><circle cx=\"9\" cy=\"10\" r=\"2\"/><path d=\"M21 15l-5-5L5 20\"/>",
    "toolIds": [
      "heic-to-jpg",
      "image-cropper",
      "bulk-resize",
      "image-scaler",
      "webp-convert",
      "color-palette",
      "favicon-generator",
      "exif-utility",
      "image-to-base64",
      "base64-to-image",
      "svg-to-image"
    ]
  },
  {
    "id": "data-tools",
    "title": "Data & Document Conversion",
    "rgb": "99, 102, 241",
    "icon": "<path d=\"M4 5h16v14H4z\"/><path d=\"M4 10h16M10 5v14\"/>",
    "toolIds": [
      "excel-to-csv",
      "json-convert",
      "csv-convert",
      "json-yaml"
    ]
  },
  {
    "id": "developer-tools",
    "title": "Text & Developer Utilities",
    "rgb": "139, 92, 246",
    "icon": "<path d=\"M8 9l-4 3 4 3M16 9l4 3-4 3M14 5l-4 14\"/>",
    "toolIds": [
      "qr-generator",
      "word-counter",
      "json-formatter",
      "diff-checker",
      "url-base64",
      "markdown-preview",
      "regex-tester",
      "jwt-decoder",
      "uuid-generator",
      "hash-generator",
      "unix-converter",
      "sql-formatter",
      "code-minifier",
      "password-generator",
      "case-converter"
    ]
  }
];

export const tools = [
  {
    "id": "image-to-base64",
    "title": "Image to Base64",
    "description": "Convert PNG, JPG, WebP, and GIF images to raw Base64 strings or Data URIs.",
    "kicker": "Image Tools",
    "badge": "Base64 Output",
    "icon": {
      "bg": "bg-blue-100",
      "color": "text-blue-600"
    },
    "category": "image-tools",
    "route": "/image-to-base64",
    "guide": "/guides/image-to-base64.html",
    "module": "app.js",
    "dependencies": []
  },
  {
    "id": "base64-to-image",
    "title": "Base64 to Image",
    "description": "Decode raw Base64 or Data URIs to PNG, JPG, WebP, or GIF image files.",
    "kicker": "Image Tools",
    "badge": "Base64 Decode",
    "icon": {
      "bg": "bg-purple-100",
      "color": "text-purple-600"
    },
    "category": "image-tools",
    "route": "/base64-to-image",
    "guide": "/guides/base64-to-image.html",
    "module": "app.js",
    "dependencies": []
  },
  {
    "id": "svg-to-image",
    "title": "SVG to PNG / JPG",
    "description": "Convert SVG vector graphics to high-res PNG or JPG raster images.",
    "kicker": "Image Tools",
    "badge": "Vector Export",
    "icon": {
      "bg": "bg-emerald-100",
      "color": "text-emerald-600"
    },
    "category": "image-tools",
    "route": "/svg-to-image",
    "guide": "/guides/svg-to-image.html",
    "module": "app.js",
    "dependencies": []
  },
  {
    "id": "pdf-to-word",
    "title": "PDF to Word / TXT",
    "description": "Turn a PDF text layer into an editable Word (.docx) document or a plain-text (.txt) file — you choose the output format.",
    "kicker": "PDF Tools",
    "badge": "DOCX or TXT",
    "icon": {
      "bg": "bg-blue-100",
      "color": "text-blue-600"
    },
    "category": "pdf-outputs",
    "route": "/pdf-to-word",
    "guide": "/guides/pdf-to-word.html",
    "module": "app.js",
    "dependencies": [
      "pdfjs"
    ]
  },
  {
    "id": "office-pdf",
    "title": "Word / Excel to PDF",
    "description": "Convert Word (.docx) or Excel (.xlsx) documents to PDF using client-side rendering.",
    "kicker": "Office Tools",
    "badge": "Browser Rendered",
    "icon": {
      "bg": "bg-emerald-100",
      "color": "text-emerald-600"
    },
    "category": "create-pdf",
    "route": "/office-pdf",
    "guide": "/guides/office-pdf.html",
    "module": "app.js",
    "dependencies": [
      "html2pdf",
      "mammoth",
      "xlsx"
    ]
  },
  {
    "id": "merge-pdf",
    "title": "Merge PDF",
    "description": "Combine multiple PDF files into one document in the order you choose.",
    "kicker": "Organize PDF",
    "badge": "Multiple PDFs",
    "icon": {
      "bg": "bg-rose-100",
      "color": "text-rose-600"
    },
    "category": "manage-pdf",
    "route": "/merge-pdf",
    "guide": "/guides/merge-pdf.html",
    "module": "app.js",
    "dependencies": [
      "pdflib"
    ]
  },
  {
    "id": "images-pdf",
    "title": "Images to PDF",
    "description": "Combine multiple images into a clean PDF, one image per page.",
    "kicker": "Convert PDF",
    "badge": "PNG, JPG",
    "icon": {
      "bg": "bg-purple-100",
      "color": "text-purple-600"
    },
    "category": "create-pdf",
    "route": "/images-pdf",
    "guide": "/guides/images-to-pdf.html",
    "module": "app.js",
    "dependencies": [
      "jspdf"
    ]
  },
  {
    "id": "compress-pdf",
    "title": "Compress PDF",
    "description": "Create a rasterized PDF copy using selectable JPEG quality levels.",
    "kicker": "Edit PDF",
    "badge": "Reduce Size",
    "icon": {
      "bg": "bg-amber-100",
      "color": "text-amber-600"
    },
    "category": "manage-pdf",
    "route": "/compress-pdf",
    "guide": "/guides/compress-pdf.html",
    "module": "app.js",
    "dependencies": [
      "pdfjs",
      "jspdf"
    ]
  },
  {
    "id": "heic-to-jpg",
    "title": "HEIC to JPG / PNG",
    "description": "Convert Apple HEIC photos to standard JPEG or PNG images in browser memory.",
    "kicker": "Image Tools",
    "badge": "Apple HEIC",
    "icon": {
      "bg": "bg-teal-100",
      "color": "text-teal-600"
    },
    "category": "image-tools",
    "route": "/heic-to-jpg",
    "guide": "/guides/heic-to-jpg.html",
    "module": "app.js",
    "dependencies": [
      "heic2any",
      "jszip"
    ]
  },
  {
    "id": "split-pdf",
    "title": "Split PDF",
    "description": "Separate every page of a PDF into individual PDF files bundled in a ZIP.",
    "kicker": "Organize PDF",
    "badge": "ZIP output",
    "icon": {
      "bg": "bg-orange-100",
      "color": "text-orange-600"
    },
    "category": "manage-pdf",
    "route": "/split-pdf",
    "guide": "/guides/split-pdf.html",
    "module": "app.js",
    "dependencies": [
      "pdflib",
      "jszip"
    ]
  },
  {
    "id": "pdf-images",
    "title": "PDF to PNG",
    "description": "Render each PDF page as a PNG and download all pages in one ZIP.",
    "kicker": "Convert PDF",
    "badge": "ZIP output",
    "icon": {
      "bg": "bg-blue-100",
      "color": "text-blue-700"
    },
    "category": "pdf-outputs",
    "route": "/pdf-images",
    "guide": "/guides/pdf-to-images.html",
    "module": "app.js",
    "dependencies": [
      "pdfjs",
      "jszip"
    ]
  },
  {
    "id": "pdf-jpg",
    "title": "PDF to JPG",
    "description": "Render each PDF page as a JPG image and download all pages in one ZIP.",
    "kicker": "Convert PDF",
    "badge": "ZIP output",
    "icon": {
      "bg": "bg-fuchsia-100",
      "color": "text-fuchsia-700"
    },
    "category": "pdf-outputs",
    "route": "/pdf-jpg",
    "guide": "/guides/pdf-to-jpg.html",
    "module": "app.js",
    "dependencies": [
      "pdfjs",
      "jszip"
    ]
  },
  {
    "id": "qr-generator",
    "title": "QR Code Generator",
    "description": "Generate high-quality custom QR Codes for any URL, text, or phone number instantly.",
    "kicker": "Developer Tools",
    "badge": "QR Code",
    "icon": {
      "bg": "bg-indigo-100",
      "color": "text-indigo-700"
    },
    "category": "developer-tools",
    "route": "/qr-generator",
    "guide": "/guides/qr-generator.html",
    "module": "app.js",
    "dependencies": [
      "qrious"
    ]
  },
  {
    "id": "sign-pdf",
    "title": "Sign PDF",
    "description": "Place a typed signature on a selected page of a PDF.",
    "kicker": "PDF Security",
    "badge": "Visible mark",
    "icon": {
      "bg": "bg-purple-100",
      "color": "text-purple-700"
    },
    "category": "manage-pdf",
    "route": "/sign-pdf",
    "guide": "/guides/sign-pdf.html",
    "module": "app.js",
    "dependencies": [
      "pdflib"
    ]
  },
  {
    "id": "image-cropper",
    "title": "Crop Image",
    "description": "Crop and trim image coordinates interactively with aspect ratio controls.",
    "kicker": "Image Tools",
    "badge": "Aspect Crop",
    "icon": {
      "bg": "bg-cyan-100",
      "color": "text-cyan-600"
    },
    "category": "image-tools",
    "route": "/image-cropper",
    "guide": "/guides/image-cropper.html",
    "module": "app.js",
    "dependencies": [
      "cropper"
    ]
  },
  {
    "id": "extract-pages",
    "title": "Extract Pages",
    "description": "Save only the pages you need from a larger PDF.",
    "kicker": "Organize PDF",
    "badge": "Page ranges",
    "icon": {
      "bg": "bg-amber-100",
      "color": "text-amber-700"
    },
    "category": "manage-pdf",
    "route": "/extract-pages",
    "guide": "/guides/extract-pages.html",
    "module": "app.js",
    "dependencies": [
      "pdflib"
    ]
  },
  {
    "id": "remove-pages",
    "title": "Remove Pages",
    "description": "Delete selected pages from a PDF and download the cleaned file.",
    "kicker": "Organize PDF",
    "badge": "Visual editor",
    "icon": {
      "bg": "bg-rose-100",
      "color": "text-rose-600"
    },
    "category": "manage-pdf",
    "route": "/remove-pages",
    "guide": "/guides/remove-pages.html",
    "module": "app.js",
    "dependencies": [
      "pdfjs",
      "pdflib"
    ]
  },
  {
    "id": "bulk-resize",
    "title": "Bulk Image Resizer",
    "description": "Resize multiple images in bulk by percentage, width, or height and download as a ZIP.",
    "kicker": "Image Tools",
    "badge": "ZIP Output",
    "icon": {
      "bg": "bg-indigo-100",
      "color": "text-indigo-600"
    },
    "category": "image-tools",
    "route": "/bulk-resize",
    "guide": "/guides/bulk-resize.html",
    "module": "app.js",
    "dependencies": [
      "jszip"
    ]
  },
  {
    "id": "excel-to-csv",
    "title": "Excel to CSV / JSON",
    "description": "Convert Microsoft Excel spreadsheet sheets into clean CSV tables or JSON lists.",
    "kicker": "Document Tools",
    "badge": "XLSX / XLS",
    "icon": {
      "bg": "bg-green-100",
      "color": "text-green-700"
    },
    "category": "data-tools",
    "route": "/excel-to-csv",
    "guide": "/guides/excel-to-csv.html",
    "module": "app.js",
    "dependencies": [
      "xlsx"
    ]
  },
  {
    "id": "word-counter",
    "title": "Word & Character Counter",
    "description": "Live-updates word, character, and paragraph counts plus a reading-time estimate.",
    "kicker": "Utilities",
    "badge": "Live Stats",
    "icon": {
      "bg": "bg-lime-100",
      "color": "text-lime-700"
    },
    "category": "developer-tools",
    "route": "/word-counter",
    "guide": "/guides/word-counter.html",
    "module": "app.js",
    "dependencies": []
  },
  {
    "id": "image-scaler",
    "title": "Scale Image",
    "description": "Scale up your images to 1.5x, 2x, or 3x using high-quality Lanczos-3 interpolation locally.",
    "kicker": "Image Tools",
    "badge": "NEW",
    "icon": {
      "bg": "bg-emerald-100",
      "color": "text-emerald-700"
    },
    "category": "image-tools",
    "route": "/image-scaler",
    "guide": "/guides/image-scaler.html",
    "module": "app.js",
    "dependencies": []
  },
  {
    "id": "webp-convert",
    "title": "Image to WebP",
    "description": "Convert JPEG, PNG, or WebP images to high-compression WebP format locally.",
    "kicker": "Image Tools",
    "badge": "WebP Output",
    "icon": {
      "bg": "bg-emerald-100",
      "color": "text-emerald-700"
    },
    "category": "image-tools",
    "route": "/webp-convert",
    "guide": "/guides/webp-convert.html",
    "module": "app.js",
    "dependencies": [
      "jszip"
    ]
  },
  {
    "id": "organize-pdf",
    "title": "Organize PDF",
    "description": "Reorder PDF pages by entering the new page sequence.",
    "kicker": "Organize PDF",
    "badge": "Reorder pages",
    "icon": {
      "bg": "bg-lime-100",
      "color": "text-lime-700"
    },
    "category": "manage-pdf",
    "route": "/organize-pdf",
    "guide": "/guides/organize-pdf.html",
    "module": "app.js",
    "dependencies": [
      "pdfjs",
      "pdflib"
    ]
  },
  {
    "id": "watermark-pdf",
    "title": "Watermark PDF",
    "description": "Add a diagonal text watermark to every page of a PDF.",
    "kicker": "Edit PDF",
    "badge": "Text mark",
    "icon": {
      "bg": "bg-sky-100",
      "color": "text-sky-700"
    },
    "category": "manage-pdf",
    "route": "/watermark-pdf",
    "guide": "/guides/watermark-pdf.html",
    "module": "app.js",
    "dependencies": [
      "pdflib"
    ]
  },
  {
    "id": "page-numbers",
    "title": "Add Page Numbers",
    "description": "Stamp page numbers at the bottom of every PDF page.",
    "kicker": "Edit PDF",
    "badge": "Footer",
    "icon": {
      "bg": "bg-cyan-100",
      "color": "text-cyan-700"
    },
    "category": "manage-pdf",
    "route": "/page-numbers",
    "guide": "/guides/page-numbers.html",
    "module": "app.js",
    "dependencies": [
      "pdflib"
    ]
  },
  {
    "id": "rotate-pdf",
    "title": "Rotate PDF",
    "description": "Rotate all pages or selected pages in a PDF.",
    "kicker": "Edit PDF",
    "badge": "90/180/270",
    "icon": {
      "bg": "bg-green-100",
      "color": "text-green-700"
    },
    "category": "manage-pdf",
    "route": "/rotate-pdf",
    "guide": "/guides/rotate-pdf.html",
    "module": "app.js",
    "dependencies": [
      "pdfjs",
      "pdflib"
    ]
  },
  {
    "id": "encrypt-pdf",
    "title": "Protect PDF",
    "description": "Add a password to encrypt and secure your PDF document.",
    "kicker": "PDF Security",
    "badge": "Password",
    "icon": {
      "bg": "bg-rose-100",
      "color": "text-rose-600"
    },
    "category": "manage-pdf",
    "route": "/encrypt-pdf",
    "guide": "/guides/encrypt-pdf.html",
    "module": "app.js",
    "dependencies": [
      "pdflib"
    ]
  },
  {
    "id": "json-convert",
    "title": "JSON to CSV / Excel",
    "description": "Convert JSON text array or file into structured CSV or Excel sheets.",
    "kicker": "Developer Tools",
    "badge": "CSV / XLSX",
    "icon": {
      "bg": "bg-amber-100",
      "color": "text-amber-700"
    },
    "category": "data-tools",
    "route": "/json-convert",
    "guide": "/guides/json-convert.html",
    "module": "app.js",
    "dependencies": [
      "xlsx"
    ]
  },
  {
    "id": "csv-convert",
    "title": "CSV to Excel or JSON",
    "description": "Parse a CSV file and export it as formatted JSON or an Excel workbook.",
    "kicker": "Data helper",
    "badge": "CSV",
    "icon": {
      "bg": "bg-emerald-100",
      "color": "text-emerald-700"
    },
    "category": "data-tools",
    "route": "/csv-convert",
    "guide": "/guides/csv-convert.html",
    "module": "app.js",
    "dependencies": [
      "papa",
      "xlsx"
    ]
  },
  {
    "id": "json-formatter",
    "title": "JSON Formatter / Validator",
    "description": "Format, validate, beautify, and minify raw JSON string data dynamically.",
    "kicker": "Developer Tools",
    "badge": "Formatter",
    "icon": {
      "bg": "bg-emerald-100",
      "color": "text-emerald-700"
    },
    "category": "developer-tools",
    "route": "/json-formatter",
    "guide": "/guides/json-formatter.html",
    "module": "app.js",
    "dependencies": []
  },
  {
    "id": "color-palette",
    "title": "Image Color Picker & Eyedropper",
    "description": "Extract exact color codes from your images using an interactive picker or native Eyedropper.",
    "kicker": "Image Tools",
    "badge": "HEX / RGB",
    "icon": {
      "bg": "bg-sky-100",
      "color": "text-sky-600"
    },
    "category": "image-tools",
    "route": "/color-palette",
    "guide": "/guides/color-palette.html",
    "module": "app.js",
    "dependencies": []
  },
  {
    "id": "favicon-generator",
    "title": "Favicon Generator",
    "description": "Convert custom logo graphics into optimized web standard multi-resolution favicons.",
    "kicker": "Image Tools",
    "badge": "ICO & PNG Pack",
    "icon": {
      "bg": "bg-amber-100",
      "color": "text-amber-600"
    },
    "category": "image-tools",
    "route": "/favicon-generator",
    "guide": "/guides/favicon-generator.html",
    "module": "app.js",
    "dependencies": [
      "jszip"
    ]
  },
  {
    "id": "diff-checker",
    "title": "Code Diff Checker",
    "description": "Compare two text or code snippets side-by-side with inline differences highlighted.",
    "kicker": "Developer Tools",
    "badge": "Side-by-side",
    "icon": {
      "bg": "bg-rose-100",
      "color": "text-rose-600"
    },
    "category": "developer-tools",
    "route": "/diff-checker",
    "guide": "/guides/diff-checker.html",
    "module": "app.js",
    "dependencies": [
      "diff"
    ]
  },
  {
    "id": "url-base64",
    "title": "URL / Base64 Converter",
    "description": "Encode/decode URLs or convert text and images to Base64 strings.",
    "kicker": "Developer Tools",
    "badge": "Encode / Decode",
    "icon": {
      "bg": "bg-cyan-100",
      "color": "text-cyan-700"
    },
    "category": "developer-tools",
    "route": "/url-base64",
    "guide": "/guides/url-base64.html",
    "module": "app.js",
    "dependencies": []
  },
  {
    "id": "markdown-preview",
    "title": "Markdown Live Preview",
    "description": "Write Markdown text and view the rendered HTML live on a split screen.",
    "kicker": "Developer Tools",
    "badge": "HTML Preview",
    "icon": {
      "bg": "bg-purple-100",
      "color": "text-purple-700"
    },
    "category": "developer-tools",
    "route": "/markdown-preview",
    "guide": "/guides/markdown-preview.html",
    "module": "app.js",
    "dependencies": [
      "marked"
    ]
  },
  {
    "id": "regex-tester",
    "title": "Regex Tester",
    "description": "Test JavaScript regular expressions against inputs in real-time with highlights.",
    "kicker": "Developer Tools",
    "badge": "JS RegExp",
    "icon": {
      "bg": "bg-emerald-100",
      "color": "text-emerald-700"
    },
    "category": "developer-tools",
    "route": "/regex-tester",
    "guide": "/guides/regex-tester.html",
    "module": "app.js",
    "dependencies": []
  },
  {
    "id": "jwt-decoder",
    "title": "JWT Decoder",
    "description": "Decode JSON Web Token payloads offline with signature claims analysis.",
    "kicker": "Developer Tools",
    "badge": "JSON Web Token",
    "icon": {
      "bg": "bg-fuchsia-100",
      "color": "text-fuchsia-700"
    },
    "category": "developer-tools",
    "route": "/jwt-decoder",
    "guide": "/guides/jwt-decoder.html",
    "module": "app.js",
    "dependencies": []
  },
  {
    "id": "uuid-generator",
    "title": "UUID Generator",
    "description": "Generate bulk cryptographically secure v4 and v1 UUID strings instantly.",
    "kicker": "Developer Tools",
    "badge": "v4 / v1 Bulk",
    "icon": {
      "bg": "bg-violet-100",
      "color": "text-violet-700"
    },
    "category": "developer-tools",
    "route": "/uuid-generator",
    "guide": "/guides/uuid-generator.html",
    "module": "app.js",
    "dependencies": []
  },
  {
    "id": "hash-generator",
    "title": "Hash Generator",
    "description": "Compute MD5, SHA-1, SHA-256, and SHA-512 cryptographic hashes locally.",
    "kicker": "Developer Tools",
    "badge": "Cryptographic",
    "icon": {
      "bg": "bg-rose-100",
      "color": "text-rose-700"
    },
    "category": "developer-tools",
    "route": "/hash-generator",
    "guide": "/guides/hash-generator.html",
    "module": "app.js",
    "dependencies": [
      "cryptojs"
    ]
  },
  {
    "id": "exif-utility",
    "title": "EXIF Viewer / Remover",
    "description": "Read and remove EXIF camera metadata from JPEG, JPG, and PNG images for privacy.",
    "kicker": "Image Tools",
    "badge": "Privacy Tool",
    "icon": {
      "bg": "bg-cyan-100",
      "color": "text-cyan-700"
    },
    "category": "image-tools",
    "route": "/exif-utility",
    "guide": "/guides/exif-utility.html",
    "module": "app.js",
    "dependencies": [
      "exif"
    ]
  },
  {
    "id": "unix-converter",
    "title": "Unix Time Converter",
    "description": "Convert Epoch timestamps to human-readable datetime formats and vice versa.",
    "kicker": "Developer Tools",
    "badge": "Epoch Converter",
    "icon": {
      "bg": "bg-rose-100",
      "color": "text-rose-600"
    },
    "category": "developer-tools",
    "route": "/unix-converter",
    "guide": "/guides/unix-converter.html",
    "module": "app.js",
    "dependencies": []
  },
  {
    "id": "decrypt-pdf",
    "title": "Unlock PDF",
    "description": "Remove password protection from your PDF document.",
    "kicker": "PDF Security",
    "badge": "Remove Password",
    "icon": {
      "bg": "bg-emerald-100",
      "color": "text-emerald-700"
    },
    "category": "manage-pdf",
    "route": "/decrypt-pdf",
    "guide": "/guides/decrypt-pdf.html",
    "module": "app.js",
    "dependencies": [
      "pdflib",
      "pdfjs",
      "jspdf"
    ]
  },
  {
    "id": "json-yaml",
    "title": "JSON to YAML Converter",
    "description": "Convert between JSON and YAML with syntax validation and formatted output.",
    "kicker": "Developer Tools",
    "badge": "JSON ⇄ YAML",
    "icon": {
      "bg": "bg-indigo-100",
      "color": "text-indigo-700"
    },
    "category": "data-tools",
    "route": "/json-yaml",
    "guide": "/guides/json-yaml.html",
    "module": "app.js",
    "dependencies": [
      "jsyaml"
    ]
  },
  {
    "id": "sql-formatter",
    "title": "SQL Formatter",
    "description": "Beautify SQL queries for Standard SQL, MySQL, PostgreSQL, and SQL Server.",
    "kicker": "Developer Tools",
    "badge": "Format Only",
    "icon": {
      "bg": "bg-cyan-100",
      "color": "text-cyan-700"
    },
    "category": "developer-tools",
    "route": "/sql-formatter",
    "guide": "/guides/sql-formatter.html",
    "module": "app.js",
    "dependencies": [
      "sqlformatter"
    ]
  },
  {
    "id": "code-minifier",
    "title": "Code Minifier & Beautifier",
    "description": "Minify or beautify HTML, CSS, and JavaScript code directly in your browser.",
    "kicker": "Developer Tools",
    "badge": "HTML / CSS / JS",
    "icon": {
      "bg": "bg-purple-100",
      "color": "text-purple-700"
    },
    "category": "developer-tools",
    "route": "/code-minifier",
    "guide": "/guides/code-minifier.html",
    "module": "app.js",
    "dependencies": []
  },
  {
    "id": "password-generator",
    "title": "Password & Secret Generator",
    "description": "Generate strong passwords, hex tokens, and Base64URL tokens using your browser's secure random generator.",
    "kicker": "Developer Tools",
    "badge": "Crypto Secure",
    "icon": {
      "bg": "bg-orange-100",
      "color": "text-orange-600"
    },
    "category": "developer-tools",
    "route": "/password-generator",
    "guide": "/guides/password-generator.html",
    "module": "app.js",
    "dependencies": []
  },
  {
    "id": "case-converter",
    "title": "Case Converter",
    "description": "Convert text between UPPERCASE, camelCase, snake_case, and more, with word and character counts.",
    "kicker": "Developer Tools",
    "badge": "Text Case",
    "icon": {
      "bg": "bg-lime-100",
      "color": "text-lime-700"
    },
    "category": "developer-tools",
    "route": "/case-converter",
    "guide": "/guides/case-converter.html",
    "module": "app.js",
    "dependencies": []
  }
];
