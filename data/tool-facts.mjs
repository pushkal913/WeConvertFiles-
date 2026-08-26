// Per-tool fact data for the visible "tool facts" block (Task 18). Every entry
// is written to match the actual implementation (app.js tool logic and
// toolContentDetails.howItWorks) — inputs/outputs describe what the tool really
// accepts and produces, `limitations` is included only where a real caveat
// exists, and `bestFor` is a concise use case. The universal privacy facts
// (browser-only processing, no upload, no account) are added by the generator
// and are true for every tool here.
//
// Do not add privacy/performance claims that the implementation does not
// support. validate-tool-facts.mjs checks every catalogue tool has an entry.

export const toolFacts = {
  // --- Image tools ---------------------------------------------------------
  'image-to-base64': { inputs: 'A PNG, JPG, WebP or GIF image', outputs: 'Base64 string and Data URI (copy or .txt)', bestFor: 'Embedding an image in HTML, CSS or JSON' },
  'base64-to-image': { inputs: 'A Base64 string or Data URI (or a .txt file)', outputs: 'A PNG, JPG, WebP or GIF file', bestFor: 'Inspecting or saving Base64 image data' },
  'svg-to-image': { inputs: 'An SVG file or pasted SVG XML', outputs: 'A PNG or JPG at a size you set', limitations: 'Limited XML cleanup; exports a fixed-size raster', bestFor: 'Rasterising vectors for social, print or legacy apps' },
  'image-cropper': { inputs: 'One JPG, PNG or WebP image', outputs: 'A cropped PNG', bestFor: 'Cropping to a selection or fixed aspect ratio' },
  'bulk-resize': { inputs: 'PNG, JPG or WebP images (batch)', outputs: 'Resized images in a ZIP (same formats)', limitations: 'Resizes, not crops; JPG/WebP are re-encoded (~0.85), so even 100% is a re-encode', bestFor: 'Applying one size rule to a whole folder' },
  'image-scaler': { inputs: 'One JPG, PNG or WebP image', outputs: 'A 1.5×, 2× or 3× image (PNG or JPEG)', limitations: 'Lanczos-3 interpolation smooths edges but cannot add real detail', bestFor: 'Enlarging an image with smoother edges' },
  'webp-convert': { inputs: 'JPG and PNG images (batch)', outputs: 'WebP images in a ZIP', bestFor: 'Shrinking web images to WebP' },
  'heic-to-jpg': { inputs: 'One or more Apple HEIC photos', outputs: 'JPG or PNG (a single file, or a ZIP for a batch)', limitations: 'Metadata and HEIC-specific features may not survive', bestFor: 'Opening iPhone photos in any app' },
  'color-palette': { inputs: 'One JPG, PNG or WebP image', outputs: 'Dominant colours as HEX and RGB', bestFor: 'Building a colour scheme from an image' },
  'favicon-generator': { inputs: 'One square JPG, PNG or WebP image', outputs: 'favicon.ico + apple-touch-icon.png in a ZIP', bestFor: 'Making favicons for a website' },
  'exif-utility': { inputs: 'One JPG or PNG image', outputs: 'A metadata view and a copy with EXIF removed', bestFor: 'Stripping location and camera metadata' },

  // --- PDF tools -----------------------------------------------------------
  'pdf-to-word': { inputs: 'One PDF that has a text layer', outputs: 'An editable DOCX or a UTF-8 TXT', limitations: 'No OCR — scanned, image-only pages produce little or no text', bestFor: 'Getting editable text out of a text-based PDF' },
  'merge-pdf': { inputs: 'Two or more PDF files', outputs: 'One merged PDF', bestFor: 'Combining documents in a chosen order' },
  'split-pdf': { inputs: 'One PDF', outputs: 'One PDF per page, in a ZIP', limitations: 'Splits every page; no custom page ranges', bestFor: 'Breaking a PDF into single-page files' },
  'compress-pdf': { inputs: 'One PDF', outputs: 'A rasterised PDF (Low, Medium or High)', limitations: 'Rasterises text, links, forms and vectors; a smaller file is not guaranteed', bestFor: 'Shrinking an image-heavy PDF' },
  'extract-pages': { inputs: 'One PDF and the page numbers to keep', outputs: 'A new PDF of just those pages', bestFor: 'Keeping only the pages you need' },
  'remove-pages': { inputs: 'One PDF (select pages to delete)', outputs: 'A new PDF without those pages', bestFor: 'Deleting unwanted pages visually' },
  'organize-pdf': { inputs: 'One PDF and a new page order', outputs: 'A reordered PDF', bestFor: 'Reordering or duplicating pages' },
  'rotate-pdf': { inputs: 'One PDF (choose the rotation)', outputs: 'A rotated PDF', bestFor: 'Fixing page orientation' },
  'watermark-pdf': { inputs: 'One PDF and watermark text', outputs: 'A watermarked PDF', bestFor: 'Stamping a watermark across every page' },
  'page-numbers': { inputs: 'One PDF', outputs: 'A PDF with page numbers added', bestFor: 'Numbering pages of a document' },
  'sign-pdf': { inputs: 'One PDF plus a drawn or typed signature', outputs: 'A signed PDF', limitations: 'A visible mark only — not a certificate-based digital signature and no identity verification', bestFor: 'Adding a visible signature to a page' },
  'encrypt-pdf': { inputs: 'One PDF and a password', outputs: 'A password-protected PDF', limitations: 'The password is applied on your device and never sent anywhere', bestFor: 'Locking a PDF before sharing it' },
  'decrypt-pdf': { inputs: 'One protected PDF and its password', outputs: 'An unlocked PDF', limitations: 'You must already know the correct password', bestFor: 'Removing a password you own' },
  'images-pdf': { inputs: 'PNG and JPG images (batch)', outputs: 'One A4 portrait PDF, one image per page', limitations: 'No OCR — text inside images stays as image content', bestFor: 'Turning photos or scans into one PDF' },
  'pdf-images': { inputs: 'One PDF', outputs: 'A lossless PNG of each page, in a ZIP', limitations: 'Renders whole pages; does not extract embedded images', bestFor: 'Getting a faithful image of every page' },
  'pdf-jpg': { inputs: 'One PDF', outputs: 'A JPG of each page, in a ZIP', limitations: 'Whole-page render; sharp text can show JPEG artefacts', bestFor: 'Sharing PDF pages as photos' },

  // --- Convert & office ----------------------------------------------------
  'office-pdf': { inputs: 'One Word (.docx) or Excel (.xlsx) file', outputs: 'One PDF', limitations: 'Client-side conversion; complex Office layouts may differ from the original', bestFor: 'A quick PDF from a straightforward document or sheet' },
  'excel-to-csv': { inputs: 'One Excel (.xls or .xlsx) file', outputs: 'A CSV file', bestFor: 'Getting plain CSV out of a spreadsheet' },
  'csv-convert': { inputs: 'CSV data (paste or a .csv file)', outputs: 'JSON or an Excel .xlsx workbook', bestFor: 'Converting CSV for apps or spreadsheets' },
  'json-convert': { inputs: 'A JSON array (paste or a .json file)', outputs: 'A CSV or Excel .xlsx file', limitations: 'Nested keys are flattened into columns', bestFor: 'Turning JSON/API data into a spreadsheet' },
  'json-yaml': { inputs: 'JSON or YAML text', outputs: 'The other format (YAML or JSON)', bestFor: 'Converting config between JSON and YAML' },

  // --- Text & developer ----------------------------------------------------
  'regex-tester': { inputs: 'A regex pattern (with g/i/m/s flags) and test text', outputs: 'Live highlighted matches', bestFor: 'Testing a regular expression' },
  'uuid-generator': { inputs: 'A version (v4 random or v1 time-based) and a count', outputs: 'One or more UUIDs', bestFor: 'Generating unique identifiers' },
  'unix-converter': { inputs: 'A Unix timestamp or a date', outputs: 'The converted date/time', bestFor: 'Converting Unix timestamps' },
  'jwt-decoder': { inputs: 'A JWT string', outputs: 'The decoded header and payload', limitations: 'Decodes only — it does not verify the token signature', bestFor: 'Inspecting a token’s claims' },
  'word-counter': { inputs: 'Text you type or paste', outputs: 'Word, character, paragraph and reading-time counts', limitations: 'No sentence count and no grammar or spell checking', bestFor: 'Checking length while you write' },
  'diff-checker': { inputs: 'Two blocks of text', outputs: 'Colour-coded inline differences', bestFor: 'Comparing two versions of text or code' },
  'markdown-preview': { inputs: 'Markdown text', outputs: 'A live rendered HTML preview', bestFor: 'Previewing a README as you write' },
  'url-base64': { inputs: 'Text or an encoded string', outputs: 'URL-encoded/decoded or Base64 text', bestFor: 'Encoding or decoding for URLs and APIs' },
  'json-formatter': { inputs: 'JSON text', outputs: 'Formatted or minified JSON, with validation', bestFor: 'Validating and tidying JSON' },
  'qr-generator': { inputs: 'Text or a URL', outputs: 'A PNG QR code (150–300 px)', limitations: 'Input is encoded literally; no dedicated Wi-Fi or phone forms', bestFor: 'Making a QR code for a link or text' },
  'hash-generator': { inputs: 'Text you type or paste', outputs: 'MD5, SHA-1, SHA-256 and SHA-512 digests', bestFor: 'Hashing a string' },
  'sql-formatter': { inputs: 'SQL query text', outputs: 'Formatted, dialect-aware SQL', limitations: 'Formats text only — it never connects to or runs against a database', bestFor: 'Beautifying SQL queries' },
  'code-minifier': { inputs: 'HTML, CSS or JavaScript', outputs: 'Minified or beautified code', limitations: 'Parsed and rewritten only — your code is never executed', bestFor: 'Shrinking or tidying code' },
  'password-generator': { inputs: 'Length and character-set options', outputs: 'A password or a hex / Base64URL token', limitations: 'Uses the Web Crypto secure RNG; nothing is stored, logged or transmitted', bestFor: 'Creating strong passwords or tokens' },
  'case-converter': { inputs: 'Text you type or paste', outputs: 'The text in your chosen case style', bestFor: 'Reformatting text case' }
};
