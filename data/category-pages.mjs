// Editorial content + routing for the four category landing pages (topical
// hubs). These mirror the site's four header/mobile menu groups.
//
// Structural membership — which tools sit in each hub — is sourced from
// `nav.groups` in tools.mjs (the same taxonomy the header menu uses) via
// `navGroup`. `extraToolIds` adds tools that belong on the hub but are kept out
// of the compact mobile drawer, so the hubs still cover the whole catalogue.
// Everything else here is unique, hand-written context so the pages are real
// topical hubs rather than a repeated tool list.

export const categoryPages = [
  {
    slug: 'image-tools',
    navGroup: 'IMAGE TOOLS',
    rgb: '16, 185, 129',
    textRgb: '4, 120, 87',
    darkTextRgb: '52, 211, 153',
    extraToolIds: ['image-to-base64', 'base64-to-image', 'svg-to-image'],
    eyebrow: 'Image tools',
    h1: 'Image Tools',
    title: 'Image Tools — Resize, Convert & Edit Images in Your Browser | WeConvertFiles',
    description: 'Resize, crop, convert and optimise images privately in your browser. Batch resize, convert HEIC to JPG, make WebP, build favicons, strip EXIF and more — nothing is uploaded.',
    lead: 'Everything you need to resize, convert and clean up images — running entirely on your device, so the photos never leave your browser.',
    intro: [
      'Image work is where privacy matters most: photos carry faces, locations and metadata you may not want on someone else’s server. Every tool in this hub processes pictures with the browser’s own canvas and codecs, so a file you drop in is read into memory, transformed and handed straight back as a download. Nothing is uploaded, which also means there are no file-size queues or account walls.',
      'The set spans three jobs people usually think of separately. Format conversion moves between HEIC, JPG, PNG, WebP, SVG and PDF. Editing covers cropping, scaling, batch-resizing and favicon generation. And a few developer-leaning helpers — EXIF stripping, colour-palette extraction and Base64/SVG encoding — sit here too because they start from an image.'
    ],
    workflows: [
      ['Prepare photos for the web', 'Convert HEIC or oversized camera images to JPG or WebP, batch-resize them to a target width, and strip EXIF location data before publishing or emailing.'],
      ['Move between images and PDF', 'Turn a stack of JPG or PNG pages into one PDF, or split a PDF back out into per-page images when you need pictures instead of a document.'],
      ['Build assets for a site or app', 'Generate a multi-size favicon package, extract a colour palette from a reference image, or inline a small graphic as a Base64 or SVG string.']
    ],
    faqs: [
      ['Are my images uploaded when I use these tools?', 'No. Each image tool decodes and re-encodes files with your browser’s built-in canvas and image support, so the pictures stay on your device and are never sent to a conversion server.'],
      ['Can I convert several images at once?', 'Several tools are batch-friendly — bulk resize and the HEIC and WebP converters accept multiple files and hand back a ZIP so you can process a whole folder in one pass.'],
      ['Do these tools remove photo metadata?', 'The EXIF utility exists specifically to strip embedded metadata such as GPS coordinates and camera details, and re-encoding an image in the other tools generally drops that metadata as a side effect.']
    ]
  },
  {
    slug: 'pdf-tools',
    navGroup: 'PDF TOOLS',
    rgb: '249, 115, 22',
    textRgb: '194, 65, 12',
    darkTextRgb: '251, 146, 60',
    extraToolIds: [],
    eyebrow: 'PDF tools',
    h1: 'PDF Tools',
    title: 'PDF Tools — Merge, Split, Compress & Secure PDFs Privately | WeConvertFiles',
    description: 'Edit and manage PDFs in your browser: merge, split, compress, rotate, reorder, add page numbers or watermarks, sign, and password-protect — all processed locally, never uploaded.',
    lead: 'A complete PDF workbench that runs in the browser, so contracts, statements and scans are edited on your machine instead of a stranger’s server.',
    intro: [
      'PDFs are the documents people most want to keep private — signed agreements, bank statements, medical forms, IDs. Uploading them to a free online editor is exactly the risk this hub removes. Each tool uses in-browser PDF libraries to read, rewrite and save the file locally, so the document is never transmitted and nothing lingers in a queue after you close the tab.',
      'The tools cover the full document lifecycle rather than a single trick. You can assemble and take apart files (merge, split, extract or remove pages, reorder), adjust them (rotate, compress, add page numbers or a watermark, sign), and control access (encrypt with a password or decrypt one you own). Because the password work also happens on-device, your keys never travel over the network.'
    ],
    workflows: [
      ['Assemble a single clean document', 'Merge several PDFs, drop the pages you don’t need, reorder what’s left, and compress the result before sending it on.'],
      ['Finish and share a form', 'Add a signature, stamp a watermark or page numbers, then export — without the file ever leaving your device.'],
      ['Lock or unlock a file', 'Add a password to protect a sensitive PDF, or remove a password you already know so the document is easier to work with, all processed locally.']
    ],
    faqs: [
      ['Is my PDF uploaded to a server?', 'No. Every PDF tool reads and rewrites the document inside your browser using client-side PDF libraries, so the file is processed on your device and is not uploaded for conversion.'],
      ['Are passwords sent anywhere when I encrypt or decrypt a PDF?', 'No. The encrypt and decrypt tools run entirely in the browser, so the password is used locally to lock or unlock the file and is never transmitted or stored.'],
      ['Can I combine several PDFs into one?', 'Yes. The merge tool joins multiple PDFs in the order you arrange them, and you can then split, reorder or compress the combined file with the other tools in this hub.']
    ]
  },
  {
    slug: 'convert-office',
    navGroup: 'CONVERT & OFFICE',
    rgb: '99, 102, 241',
    textRgb: '67, 56, 202',
    darkTextRgb: '165, 180, 252',
    extraToolIds: [],
    eyebrow: 'Convert & office',
    h1: 'Convert & Office Tools',
    title: 'Convert & Office Tools — CSV, Excel, JSON, YAML & Word Conversion | WeConvertFiles',
    description: 'Convert between spreadsheet, data and office formats in your browser: Excel to CSV, CSV to JSON or Excel, JSON to spreadsheet, JSON to YAML and Word or Excel to PDF — all processed locally.',
    lead: 'Move data between the formats spreadsheets, apps and APIs expect — parsed and rewritten in your browser, not on a server.',
    intro: [
      'Everyday data work means constant format shuffling: a colleague sends an Excel file, an API wants JSON, a config lives in YAML, and a report has to end up as a PDF. This hub handles those hand-offs in the browser, so a spreadsheet full of customer records or financial figures is parsed on your own machine instead of being uploaded to an unknown converter.',
      'The tools focus on faithful structure. Tabular converters keep rows, columns and headers intact when moving between CSV, Excel and JSON; the JSON-to-YAML converter preserves nesting; and the Office-to-PDF tool turns straightforward Word and Excel files into a shareable PDF. For anything sensitive — salaries, emails, internal data — keeping the parsing local is the point.'
    ],
    workflows: [
      ['Reshape a spreadsheet', 'Export an Excel sheet to clean CSV, or turn a CSV into JSON or a proper .xlsx workbook for the next tool in your pipeline.'],
      ['Prep data for code', 'Convert a JSON payload to YAML for a config file, or a spreadsheet into JSON your app can read directly.'],
      ['Produce a shareable document', 'Turn a simple Word or Excel file into a PDF when the recipient just needs to read it, without installing office software.']
    ],
    faqs: [
      ['Is my spreadsheet or data file uploaded?', 'No. These converters parse and rewrite your file in the browser, so the data stays on your device rather than being sent to a conversion server.'],
      ['Will converting keep my columns and structure intact?', 'Yes. The tabular tools preserve rows, columns and headers when moving between CSV, Excel and JSON, and the JSON-to-YAML converter keeps the original nesting.'],
      ['Which office documents can I turn into PDF?', 'The Office-to-PDF tool handles straightforward modern Word (.docx) and Excel files; very complex layouts may render differently because the conversion runs through the browser rather than Microsoft Office.']
    ]
  },
  {
    slug: 'developer-tools',
    navGroup: 'TEXT & DEVELOPERS',
    rgb: '244, 63, 94',
    textRgb: '190, 18, 60',
    darkTextRgb: '251, 113, 133',
    extraToolIds: [],
    eyebrow: 'Text & developer utilities',
    h1: 'Text & Developer Tools',
    title: 'Developer Tools — JSON, Regex, JWT, Hash, UUID & Text Utilities | WeConvertFiles',
    description: 'A private toolbox of developer utilities: format JSON and SQL, test regex, decode JWTs, hash text, generate UUIDs and passwords, diff text, preview Markdown and more — all running in your browser.',
    lead: 'The small utilities you reach for a dozen times a day — formatters, encoders, generators and validators — with the guarantee that tokens and snippets stay in your browser.',
    intro: [
      'Developer utility sites are convenient right up until you paste a production JWT, an API response or a password into one and realise it went to someone else’s backend. Every tool in this hub runs client-side, so the token you decode, the text you hash and the JSON you format are processed in the page and never sent anywhere. That makes it safe to use with real secrets, not just throwaway examples.',
      'The collection covers the common jobs: formatting and validating (JSON, SQL, Markdown), inspecting and decoding (JWT, Base64 URL, Unix timestamps), generating (UUIDs, strong passwords, QR codes, hashes) and comparing or measuring (text diff, word count, case conversion). Each is a focused, single-purpose tool rather than a bloated all-in-one editor.'
    ],
    workflows: [
      ['Inspect and debug', 'Decode a JWT to read its claims, pretty-print a JSON API response, or convert a Unix timestamp — without any of it leaving the tab.'],
      ['Generate what you need', 'Spin up a UUID, a strong password, a QR code or a hash on demand, all computed locally in the browser.'],
      ['Clean up text and code', 'Format or minify JSON and SQL, test a regular expression against sample input, diff two versions, or convert text case before pasting it back.']
    ],
    faqs: [
      ['Are the values I paste sent to a server?', 'No. Every developer tool here runs in the browser, so JWTs, passwords, JSON and any other text you paste are processed locally and are never uploaded.'],
      ['Is it safe to decode a real JWT or hash a real secret?', 'Yes. Because decoding and hashing happen entirely on your device, no token or secret is transmitted — though you should still treat any secret pasted into a shared computer with normal caution.'],
      ['Do the generators produce values I can use in production?', 'The UUID, password and hash generators use the browser’s built-in cryptographic and randomness APIs where appropriate, so their output is suitable for real use.']
    ]
  }
];
