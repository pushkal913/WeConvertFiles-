let jsPDF;
let PDFDocument;
let StandardFonts;
let rgb;
let degrees;

// Third-party library detection. The CDN sources, versions and per-tool
// dependency lists live in the tool catalogue (data/tools.mjs) and are
// delivered at runtime as window.WCF_CATALOGUE by js/catalogue.js, so this file
// no longer hard-codes that metadata. Only the ready-checks (detection code,
// which cannot be data) stay here, keyed by library name.
const libraryReadyChecks = {
  jspdf: () => Boolean(window.jspdf && window.jspdf.jsPDF),
  pdfjs: () => Boolean(window.pdfjsLib),
  pdflib: () => Boolean(window.PDFLib),
  papa: () => Boolean(window.Papa),
  xlsx: () => Boolean(window.XLSX),
  jszip: () => Boolean(window.JSZip),
  mammoth: () => Boolean(window.mammoth),
  html2pdf: () => Boolean(window.html2pdf),
  docx: () => Boolean(window.docx && window.docx.Packer),
  jspdfautotable: () => Boolean(window.jspdf && window.jspdf.jsPDF && window.jspdf.jsPDF.API && typeof window.jspdf.jsPDF.API.autoTable === 'function'),
  cryptojs: () => Boolean(window.CryptoJS),
  qrious: () => Boolean(window.QRious),
  exif: () => Boolean(window.EXIF),
  heic2any: () => Boolean(window.heic2any),
  marked: () => Boolean(window.marked),
  diff: () => Boolean(window.diff_match_patch),
  jsyaml: () => Boolean(window.jsyaml),
  sqlformatter: () => Boolean(window.sqlFormatter),
  terser: () => Boolean(window.Terser),
  csso: () => Boolean(window.csso),
  jsbeautifyjs: () => Boolean(window.js_beautify),
  jsbeautifycss: () => Boolean(window.css_beautify),
  jsbeautifyhtml: () => Boolean(window.html_beautify),
  cropper: () => Boolean(window.Cropper)
};

const RUNTIME_CATALOGUE = (typeof window !== 'undefined' && window.WCF_CATALOGUE) || { libraries: {}, dependencies: {} };

// Resolve a library name to { src, css, ready } by combining the catalogue's
// source metadata with the local ready-check. Returns null for an unknown one.
function converterLibraryEntry(name) {
  const meta = RUNTIME_CATALOGUE.libraries[name];
  const ready = libraryReadyChecks[name];
  if (!meta || typeof ready !== 'function') return null;
  return { src: meta.src, css: meta.css, ready };
}

// The libraries a tool needs, from the catalogue (empty if none).
function toolDependencies(toolId) {
  const deps = RUNTIME_CATALOGUE.dependencies[toolId];
  return Array.isArray(deps) ? deps : [];
}


const interactiveLibraryTools = new Set([
  'qr-generator',
  'hash-generator',
  'markdown-preview',
  'diff-checker'
]);

const libraryLoadPromises = new Map();

function syncConverterLibraryGlobals() {
  jsPDF = window.jspdf && window.jspdf.jsPDF;
  PDFDocument = window.PDFLib && window.PDFLib.PDFDocument;
  StandardFonts = window.PDFLib && window.PDFLib.StandardFonts;
  rgb = window.PDFLib && window.PDFLib.rgb;
  degrees = window.PDFLib && window.PDFLib.degrees;

  if (window.pdfjsLib) {
    window.pdfjsLib.GlobalWorkerOptions.workerSrc =
      'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
  }
}

function loadConverterLibrary(name) {
  const library = converterLibraryEntry(name);
  if (!library) {
    return Promise.reject(new Error(`The "${name}" library is not registered in the tool catalogue, so it cannot be loaded.`));
  }
  if (library.ready()) {
    syncConverterLibraryGlobals();
    return Promise.resolve();
  }
  if (libraryLoadPromises.has(name)) {
    return libraryLoadPromises.get(name);
  }

  if (library.css && !document.querySelector(`link[data-converter-library-css="${name}"]`)) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = library.css;
    link.dataset.converterLibraryCss = name;
    document.head.appendChild(link);
  }

  const promise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = library.src;
    script.async = true;
    script.dataset.converterLibrary = name;
    script.onload = () => {
      if (!library.ready()) {
        libraryLoadPromises.delete(name);
        reject(new Error(`The ${name} conversion library did not initialize.`));
        return;
      }
      syncConverterLibraryGlobals();
      resolve();
    };
    script.onerror = () => {
      libraryLoadPromises.delete(name);
      reject(new Error(`Unable to load the ${name} conversion library. Check your connection and try again.`));
    };
    document.head.appendChild(script);
  });

  libraryLoadPromises.set(name, promise);
  return promise;
}

async function ensureToolLibraries(toolId) {
  const dependencies = toolDependencies(toolId);
  await Promise.all(dependencies.map(loadConverterLibrary));
  syncConverterLibraryGlobals();
}

// ---- Tool module runtime (Phase 2 incremental code-splitting) --------------
// Some tools have moved out of this file into js/tools/<id>.js and load only
// when their tool is opened, so a visitor to one tool no longer downloads the
// implementation of unrelated tools. A migrated module calls
// WCF.registerTool(id, { render(container, ctx) }). The list below is the
// runtime mirror of each tool's "module" field in data/tools.mjs.
const TOOL_MODULE_VERSION = '20260824-1';
const MODULE_TOOLS = new Set(['password-generator', 'case-converter', 'json-formatter', 'uuid-generator', 'unix-converter', 'word-counter', 'url-base64', 'qr-generator', 'hash-generator', 'markdown-preview', 'regex-tester', 'jwt-decoder', 'json-yaml', 'sql-formatter', 'code-minifier', 'diff-checker', 'image-to-base64', 'base64-to-image', 'svg-to-image']);
const toolModuleRegistry = {};
const toolModulePromises = new Map();
window.WCF = window.WCF || {};
window.WCF.registerTool = (id, def) => { toolModuleRegistry[id] = def; };
function loadToolModule(id) {
  if (!MODULE_TOOLS.has(id)) return Promise.resolve(null);
  if (toolModuleRegistry[id]) return Promise.resolve(toolModuleRegistry[id]);
  if (toolModulePromises.has(id)) return toolModulePromises.get(id);
  const promise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `/js/tools/${id}.js?v=${TOOL_MODULE_VERSION}`;
    script.async = true;
    script.onload = () => {
      if (toolModuleRegistry[id]) resolve(toolModuleRegistry[id]);
      else reject(new Error(`Tool module "${id}" did not register.`));
    };
    script.onerror = () => { toolModulePromises.delete(id); reject(new Error(`Could not load tool module "${id}".`)); };
    document.head.appendChild(script);
  });
  toolModulePromises.set(id, promise);
  return promise;
}

const toolContentDetails = {
  'merge-pdf': {
    howItWorks: 'Merge PDF combines multiple PDF documents into a single file in your chosen order. A browser-compatible pdf-lib build reads each source in browser memory, copies all of its page objects, and appends those pages to a new PDF. The operation does not rasterize pages or apply compression. The required library is downloaded from a third-party CDN when needed, while source document contents are not sent to WeConvertFiles for conversion.',
    faqs: [
      { q: 'Is there a limit on the number of PDFs I can merge?', a: 'The implementation does not set a specific file-count maximum. Available browser memory is the practical constraint, especially when combining many large or image-heavy PDFs.' },
      { q: 'Are my merged files uploaded to a server?', a: 'No. File merging is completed locally inside your web browser, and document contents are not sent to WeConvertFiles for processing.' },
      { q: 'Can I control the document order before merging?', a: 'Yes. Drag the uploaded file rows into the required sequence. The tool copies every page from each PDF in that visible file-list order.' },
      { q: 'Does this tool preserve the visible quality of PDF pages?', a: 'Pages are copied as PDF objects rather than re-rendered through canvas, so merging does not intentionally recompress their visible text, vector artwork, or images. Document-level features such as forms, bookmarks, signatures, or links should still be checked.' }
    ]
  },
  'split-pdf': {
    howItWorks: 'Split PDF copies every page of one source PDF into its own single-page document with pdf-lib, names the results page-1.pdf, page-2.pdf, and so on, and packages them in split-pages.zip with JSZip. It does not offer page ranges or multi-page groups. Page objects are copied rather than rasterized, although document-level features may not transfer to the new files.',
    faqs: [
      { q: 'Can I split a PDF into custom page ranges?', a: 'No. This tool creates one PDF for every source page. Use Extract Pages when you need selected page numbers or ranges in one output document.' },
      { q: 'Does splitting reduce page quality?', a: 'Pages are copied as PDF objects instead of being rendered to canvas, so the process does not intentionally reduce image resolution or flatten text and vector artwork. Document-level features should still be checked.' },
      { q: 'Is there a file size or page limit?', a: 'The implementation sets no specific maximum and makes no 100 MB speed promise. Available browser memory is the practical constraint because it holds the source, generated page files, and ZIP.' },
      { q: 'How are my documents handled?', a: 'PDF contents are processed in browser memory and are not sent to WeConvertFiles for conversion. Consented site-usage analytics may operate separately without receiving the document contents.' }
    ]
  },
  'pdf-to-word': {
    howItWorks: 'PDF to Word / TXT reads a PDF\'s existing text layer with PDF.js, groups the positioned text fragments back into visual lines and paragraphs, and lets you download the result in the format you pick. Choose DOCX to build an editable Microsoft Word document (lines and paragraphs preserved, one Word page per PDF page) using the docx library, or choose TXT to save the reconstructed text as a UTF-8 file with a marker before each page. Everything runs in your browser; the tool does not perform OCR, so scanned image-only pages produce little or no text.',
    faqs: [
      { q: 'Do I get a real Word (.docx) file or plain text?', a: 'Both are available — pick from the Output Format selector. DOCX produces an editable Word document with reconstructed lines and paragraphs; TXT produces a plain UTF-8 text file. The default is DOCX.' },
      { q: 'Does the Word output keep the original layout and tables?', a: 'It rebuilds reading lines and paragraph breaks, not full page design. Fonts, colours, images, and table cell/column structure are not recreated, because a PDF stores positioned fragments rather than semantic document structure.' },
      { q: 'Can it convert a scanned PDF?', a: 'Only if the scan already carries a selectable text layer. The tool does not run OCR, so image-only pages return little or no text. Run the file through OCR software first if it is a pure scan.' }
    ]
  },
  'office-pdf': {
    howItWorks: 'Word/Excel to PDF converts supported Office content into a browser-generated PDF. Mammoth.js turns Word (.docx) structures into HTML that html2pdf.js captures through canvas, while Excel (.xlsx) workbooks are read by SheetJS and drawn as native, selectable vector tables with jsPDF AutoTable — one landscape page section per worksheet. This is not Microsoft Office rendering, so complex formatting, fonts, page breaks, charts, and shapes may vary.',
    faqs: [
      { q: 'How does client-side Word-to-PDF work?', a: 'It parses Docx XML elements into HTML elements via mammoth.js, inserts them into an invisible browser page, and generates a PDF snapshot using html2pdf.js.' },
      { q: 'Can I convert spreadsheet sheets from Excel (.xlsx)?', a: 'Yes. Every worksheet in the workbook is read with SheetJS and rendered by jsPDF AutoTable as a native PDF table with selectable text, so the output stays crisp and searchable rather than being a flattened image.' },
      { q: 'Why does my converted PDF look different from MS Office?', a: 'Since conversion runs client-side without Microsoft Office engines, complex styles like custom charts, smart shapes, and nested tables are rendered as basic HTML elements, which might cause formatting differences.' }
    ]
  },
  'page-numbers': {
    howItWorks: 'Add Page Numbers inserts professional header or footer pagination counters across all pages of your PDF document. The tool runs locally using WebAssembly/JavaScript. When you upload a PDF, the parser reads the page structures and draws dynamic page index labels near the bottom center of each page using vector math coordinates. This is perfect for formatting books, ebooks, legal briefs, and presentations.',
    faqs: [
      { q: 'Can I choose where page numbers are placed?', a: 'Yes, page numbers are automatically placed near the bottom center of the page for clean formatting. This conforms to standard editorial layout guidelines.' },
      { q: 'What page numbering styles are supported?', a: 'You can choose between simple numbers (1, 2, 3) or total count formatting (Page 1 of 5). This makes it highly flexible for legal and educational indexing.' },
      { q: 'Does this tool work on password-protected PDFs?', a: 'You must unlock the PDF first using our Unlock PDF tool before pagination can be applied. The tool cannot modify encrypted document structures.' },
      { q: 'Are my files safe during processing?', a: 'Yes. The document is read and modified locally inside your web browser. No data is sent to a server, ensuring complete confidentiality.' }
    ]
  },
  'sign-pdf': {
    howItWorks: 'Sign PDF places a visible drawn or typed signature onto one page of your PDF using pdf-lib, then outputs signed.pdf. A drawn signature is captured as a transparent PNG; a typed one is rendered in one of ten styles and a chosen ink colour onto a canvas. Either way the mark is embedded as an image at a chosen position and size. This adds a visible electronic mark, not a certificate-based digital signature: it does not verify identity, attach a certificate, or make later edits detectable.',
    faqs: [
      { q: 'Can I choose which page to sign?', a: 'Yes. Enter a whole page number within the document, counting from the first page of the file. The signature is added to that single page, and the other pages are copied unchanged, so their text stays selectable.' },
      { q: 'What is the difference between drawing and typing?', a: 'Drawing captures your hand-drawn mark and varies slightly each time. Typing renders your name in one of ten styles and an ink colour you pick, so it is neater and reproducible. Both are placed with a line beneath the mark.' },
      { q: 'Is this a legally binding digital signature?', a: 'This tool adds a visible signature mark, not a certificate-based digital signature, and does not verify identity or make tampering detectable. Whether a visible mark is sufficient depends on the document and the rules that apply to you, so confirm with the requesting party.' }
    ]
  },
  'images-pdf': {
    howItWorks: 'Images to PDF combines PNG and JPEG/JPG files into one A4 portrait PDF using jsPDF. It reads each image in browser memory, scales it proportionally to fit inside a 36-point margin, centers it, and places one image on each page in the visible file-list order. Small images may be enlarged, and text inside images remains image content because no OCR is performed.',
    faqs: [
      { q: 'What image formats are supported?', a: 'The tool accepts PNG and JPEG/JPG files. Convert WebP, HEIC, or other formats to PNG or JPEG before adding them.' },
      { q: 'Can I reorder my images before saving?', a: 'Yes. Drag the selected file rows into the required order before conversion. The first row becomes page one, the second becomes page two, and so on.' },
      { q: 'How are my images handled?', a: 'Image contents are processed in browser memory and are not sent to WeConvertFiles for conversion. If you consent to analytics cookies, separate usage events may be collected without containing your image files.' }
    ]
  },
  'pdf-images': {
    howItWorks: 'PDF to PNG renders each page of your PDF as a complete image using PDF.js. Every page is drawn onto an in-browser canvas at render scale 2 and encoded as a lossless PNG, then the pages are packaged with JSZip into pdf-pages-png.zip. This renders whole pages rather than extracting the individual images embedded inside the document.',
    faqs: [
      { q: 'Does this extract the images embedded in a PDF?', a: 'No. It renders each complete page. A photo on the page arrives inside the page image, together with any surrounding text and margins, rather than as a separate file at its original resolution.' },
      { q: 'Is there a limit on file size?', a: 'No fixed limit is set, but every page is rendered and held in browser memory before zipping, so very long or graphics-heavy PDFs can be slow or may fail on a device with limited memory.' },
      { q: 'How are my documents handled?', a: 'File contents are processed in browser memory and are not sent to WeConvertFiles for conversion. PDF.js and JSZip load from third-party CDNs when needed, so the tool is not described as fully offline.' }
    ]
  },
  'pdf-jpg': {
    howItWorks: 'PDF to JPG renders each page of your PDF as a JPEG image using PDF.js. Every page is drawn onto an in-browser canvas at render scale 2 and encoded as a JPEG at quality 0.92, then packaged with JSZip into pdf-pages-jpg.zip. It suits photographic and scanned pages; text-heavy pages show JPEG artefacts around sharp edges.',
    faqs: [
      { q: 'Why use JPG instead of PNG?', a: 'JPEG discards some detail to produce smaller files, which suits photographic or scanned pages for sharing. For small text, tables, and diagrams, the lossless PDF to PNG tool keeps edges cleaner.' },
      { q: 'Can I select a custom image quality?', a: 'No. The quality is fixed at 0.92, a high setting chosen to keep pages readable. To reduce size further, compress the resulting JPGs with a separate image tool.' },
      { q: 'How are my documents handled?', a: 'File contents are processed in browser memory and are not sent to WeConvertFiles for conversion. PDF.js and JSZip load from third-party CDNs when needed, so the tool is not described as fully offline.' }
    ]
  },
  'csv-convert': {
    howItWorks: 'CSV to Excel or JSON parses CSV (comma-separated values) data and exports it to structured JSON arrays or Microsoft Excel (.xlsx) formats. It runs locally using PapaParse and SheetJS libraries, allowing you to manipulate and format spreadsheets instantly.',
    faqs: [
      { q: 'What spreadsheet libraries are used?', a: 'We use PapaParse for parsing text data and SheetJS (XLSX) to write the output Excel spreadsheets, guaranteeing compatibility with MS Excel.' },
      { q: 'Does this tool support large CSV datasets?', a: 'Yes, files with tens of thousands of rows are processed in fractions of a second due to optimized parsing algorithms.' },
      { q: 'Are my CSV spreadsheets secure?', a: 'Yes. All data processing is executed on your device; no database or server uploads are involved, protecting commercial data.' }
    ]
  },
  'encrypt-pdf': {
    howItWorks: 'Protect PDF encrypts your PDF files using advanced standard security controls. By entering a password, the engine locks your document, restricting unauthorized users from viewing, printing, extracting pages, or editing content without authorization.',
    faqs: [
      { q: 'What encryption standard is used?', a: 'The tool utilizes pdf-lib\'s built-in encryption algorithm, which complies with PDF specification standards and is recognized by standard PDF readers.' },
      { q: 'What happens if I forget the password?', a: 'Since we process everything locally and do not store passwords on any server, we cannot recover forgotten passwords. Make sure to keep it safe in a password manager.' },
      { q: 'Is it safe to encrypt sensitive files here?', a: 'Yes, because the encryption is completed entirely inside your browser on your device, preventing intercept risk.' }
    ]
  },
  'decrypt-pdf': {
    howItWorks: 'Unlock PDF removes password security and restrictions from encrypted PDF documents. When you upload a locked file and enter the correct password, the engine decrypts the document stream locally, saving a clean, unrestricted copy.',
    faqs: [
      { q: 'Can I unlock a PDF without knowing the password?', a: 'No. For security and compliance, you must provide the correct password to unlock the document. This tool does not bypass legal encryption.' },
      { q: 'Will this tool remove editing restrictions?', a: 'Yes, once unlocked, all restrictions regarding printing, copying text, and modifying pages are completely removed.' },
      { q: 'Is my password safe?', a: 'Yes, the password is processed in memory on your device and is never transmitted over the network, keeping your credentials secure.' }
    ]
  },
  'compress-pdf': {
    howItWorks: 'Compress PDF uses PDF.js to render every page to an HTML canvas, encodes the complete page as JPEG, and places that JPEG on a new A4 portrait page with jsPDF. Low, medium, and high compression use scale and JPEG-quality pairs of 1.8/0.9, 1.5/0.8, and 1.0/0.6. This rasterizes text, links, forms, and vectors, and a smaller result is not guaranteed.',
    faqs: [
      { q: 'What are the compression levels?', a: 'Low compression uses the highest render scale and JPEG quality, medium uses balanced settings, and high compression uses the lowest scale and JPEG quality. Higher compression can make small text and graphics less clear.' },
      { q: 'Does text remain searchable or selectable?', a: 'No. Each complete page becomes a JPEG image, so selectable text, live links, form fields, vectors, and accessibility structure are not preserved in the output.' },
      { q: 'How much space will I save?', a: 'The result depends on the source PDF. Image-heavy files may become smaller, while text-heavy or already optimized PDFs may shrink very little or even become larger. Compare the downloaded file before replacing the original.' }
    ]
  },
  'image-scaler': {
    howItWorks: 'Scale Image (Resolution Upscaler) is an offline photo upscaler that enlarges JPEG, PNG, or WebP images by 1.5x, 2x, or 3x using high-fidelity pixel interpolation. To perform image resolution enhancement, the processor applies the Lanczos-3 windowed sinc filter, weighting surrounding pixels to calculate smoother, anti-aliased edges. Rendering runs locally in browser memory via client-side WebAssembly and JavaScript, so image contents are not sent to WeConvertFiles for processing.',
    faqs: [
      { q: 'What is image resolution upscaling?', a: 'Resolution upscaling increases the pixel dimensions and clarity of low-resolution images. Using advanced mathematical interpolation, our photo upscaler calculates missing pixel values in real-time, delivering crisp, high-definition graphics without any quality loss or server uploads.' },
      { q: 'What is the Lanczos-3 resampling algorithm?', a: 'Lanczos-3 is a top-tier windowed sinc resampling filter. By assessing a 6x6 pixel grid, it maps smooth vector contours, eliminates scaling artifacts, and preserves clean fine lines, making it the ideal choice for high-fidelity photo upscaling.' },
      { q: 'Can I upscale retro pixel art?', a: 'Yes! By choosing the Nearest-Neighbor algorithm, you disable anti-aliasing. This keeps low-resolution pixels perfectly sharp and blocky when scaled to 2x or 3x, preserving the precise retro game design aesthetic.' },
      { q: 'Does this image resolution enhancer support batch upscaling?', a: 'To maintain fast performance and prevent your browser tab from crashing due to high system memory usage, the tool currently processes one high-quality upscaled file at a time.' }
    ]
  },
  'webp-convert': {
    howItWorks: 'Image to WebP Converter allows you to convert JPEG and PNG files to modern high-efficiency WebP image files in real-time. The tool loads files into HTML5 Canvas templates and exports them as compressed blobs via native Canvas rendering algorithms. WebP provides superior lossless and lossy compression compared to legacy formats, reducing image sizes by up to 35% while preserving visual clarity. Because all processes run client-side inside your browser memory, your original graphics remain completely private. This tool is ideal for web developers, content creators, and editors optimizing assets for page load speeds.',
    faqs: [
      { q: 'Why should I convert images to WebP?', a: 'WebP is a highly optimized next-generation graphic format. It supports both lossy compression and lossless alpha transparency, producing significantly smaller file sizes than JPG or PNG, which boosts website load speeds and SEO rankings.' },
      { q: 'What is the difference between lossy and lossless modes?', a: 'Lossless compression preserves every pixel exactly, making it perfect for graphics, logos, and screenshots. Lossy mode discards tiny amounts of visual data to achieve extreme file size reductions, which is ideal for photographic images.' },
      { q: 'Are my original pictures uploaded to a backend server?', a: 'No. The entire conversion process occurs within your browser session using native HTML5 API loops. Your images never leave your computer.' }
    ]
  },
  'bulk-resize': {
    howItWorks: 'Bulk Image Resizer applies one resizing rule to a batch of PNG, JPG, and WebP images. Each image is decoded and drawn onto a canvas at the new dimensions, one after another, then re-encoded, and JSZip packages the results into resized_images.zip. You can scale by percentage (10 to 200, default 100) or set a target width or height, with an aspect-ratio lock that is on by default. This resizes rather than crops, and it is not a format converter: filenames and formats are kept. JPEG and WebP are re-encoded at quality 0.85, so a 100% pass is still a re-encode rather than a copy.',
    faqs: [
      { q: 'How do I resize a batch of images at once?', a: 'Select multiple JPG, PNG, or WebP files, choose a mode (percentage scale, target width, or target height), set your value, and run the batch. Images are processed one after another and downloaded together in resized_images.zip.' },
      { q: 'Does it crop or convert formats?', a: 'No. It resizes only, keeping the whole scene, and each file comes back in the format it went in as. A JPG stays a JPG, a PNG stays a PNG, and a WebP stays a WebP.' },
      { q: 'Is there a limit to the number of images I can batch process?', a: 'No fixed cap is set. Every image is decoded and the ZIP is built in browser memory, so available memory is the practical limit. Splitting very large, high-resolution batches into smaller groups is more dependable.' }
    ]
  },
  'color-palette': {
    howItWorks: 'Color Palette Extractor is an advanced design utility that scans uploaded images to identify their dominant color themes. Using native HTML5 Canvas, the engine accesses raw pixel coordinates, groups similar RGB colors into mathematical clusters, and ranks them by pixel frequency. It then renders a color swatch list with matching HEX and RGB formats. Designers can copy individual hex color codes with a single click. This local client-side implementation handles image color extraction offline, protecting private photos while helping developers build color schemes.',
    faqs: [
      { q: 'How does the palette extractor find dominant colors?', a: 'The tool renders your uploaded image onto an invisible canvas grid, reads its pixel array, runs a clustering algorithm to isolate the primary color ranges, and presents the dominant swatches.' },
      { q: 'Can I copy the HEX color codes directly to my clipboard?', a: 'Yes, each color pill displays a copy button that saves the exact hex code (e.g., #1A73E8) directly to your clipboard for design mockups.' },
      { q: 'Does the tool store my uploaded images?', a: 'No. Your images are loaded temporarily in browser memory for canvas pixel scanning and are deleted immediately when you close the session.' }
    ]
  },
  'json-convert': {
    howItWorks: 'JSON to CSV / Excel Converter converts complex JSON array strings into structured spreadsheet files. It parses raw JSON text using JavaScript engines, flattens nested key-value pairs into tabular columns, and exports them. Using SheetJS and PapaParse libraries client-side, it compiles these tables into standard comma-separated values (.csv) or Microsoft Excel Worksheets (.xlsx). Since the utility executes entirely in browser storage, it is safe to process sensitive API payloads, client records, and databases without server logging.',
    faqs: [
      { q: 'What JSON structure is required for conversion?', a: 'The converter expects a JSON array of flat objects (e.g., [{"id": 1, "name": "Alice"}]). Nested structures will be flattened with dot notation where possible.' },
      { q: 'Is SheetJS safe for processing database arrays?', a: 'Yes, because the SheetJS script runs locally in your browser. No JSON text or data rows are uploaded to the web.' },
      { q: 'Can I convert large JSON datasets?', a: 'Yes, the local engine handles large JSON payloads of up to 10MB efficiently, delivering formatted CSV/Excel documents in seconds.' }
    ]
  },
  'word-counter': {
    howItWorks: 'Word & Character Counter reports four figures as you type or paste, using plain JavaScript in your browser with no counting library. Characters is the text length in UTF-16 code units, so spaces count and some emoji add more than one. Words are found by trimming and splitting on runs of whitespace, so punctuation stays attached and a hyphenated term like state-of-the-art counts as one word. Paragraphs are the blocks separated by line breaks. Reading time is the word count divided by 200, rounded up. It does not count sentences, and it does not check grammar or spelling.',
    faqs: [
      { q: 'How is reading time calculated?', a: 'Word count divided by 200, rounded up to the next whole minute. It is a rough planning figure based on a common average reading speed, not a measurement of your particular audience.' },
      { q: 'Does it count sentences?', a: 'No. It reports words, characters, paragraphs, and a reading-time estimate. Sentence detection is not offered, because abbreviations, decimals, and quotations make simple rules unreliable.' },
      { q: 'Is my text uploaded anywhere?', a: 'The counting runs in your browser and the text is not sent to WeConvertFiles. Consented Zoho PageSense analytics may record page usage such as visits and clicks, but not the text you enter.' }
    ]
  },
  'diff-checker': {
    howItWorks: 'Code Diff Checker compares two texts side-by-side to highlight additions, edits, and deletions. Using Google\'s diff-match-patch algorithm client-side, the engine computes the Levenshtein distance between original and modified strings. It analyzes word sequences, tracks character changes, and renders color-coded inline comparisons (red highlights for removed characters, green for added ones). This tool is essential for developers reviewing code diffs, writers tracking revisions, and editors checking drafts locally in their sandbox.',
    faqs: [
      { q: 'What algorithm does the diff checker use?', a: 'It utilizes Google\'s optimized Diff Match Patch script to perform line-by-line and character-level comparisons, ensuring highly accurate revision tracking.' },
      { q: 'Can I compare code snippets as well as plain text?', a: 'Yes. You can paste raw code (HTML, CSS, JavaScript, Python) or plain text, and the diff checker will highlight exact syntax changes.' },
      { q: 'Are my comparisons kept confidential?', a: 'Yes. The diffing algorithm runs in local browser sandbox threads, meaning no code or text lines are uploaded to remote databases.' }
    ]
  },
  'markdown-preview': {
    howItWorks: 'Markdown Live Preview is a split-screen workspace translating markdown syntax into styled HTML blocks. Using marked.js locally, the processor listens to textarea keystrokes, compiles standard markdown anchors (headers, bolding, lists, code spans), and updates the rendered output pane instantly. The styled preview container includes Tailwind-supported dark and light theme styles. This client-side utility provides instant feedback for bloggers, engineers, and creators writing README files or markdown documents safely.',
    faqs: [
      { q: 'What markdown features are supported?', a: 'It supports standard Markdown features including headers, bold/italic text, links, lists, blockquotes, inline code, and code fences.' },
      { q: 'Can I copy the compiled HTML output?', a: 'Yes, you can easily copy the rendered layout from the screen, or inspect it to retrieve raw HTML tags for web deployment.' },
      { q: 'Is marked.js fast enough for real-time compilation?', a: 'Yes, marked.js compiles markdown content in milliseconds, allowing the preview pane to update instantly as you type.' }
    ]
  },
  'url-base64': {
    howItWorks: 'URL / Base64 Converter provides essential utilities for encoding, decoding, and converting data strings. Using native JavaScript functions like encodeURIComponent(), decodeURIComponent(), btoa(), and atob(), it transforms strings to standard URL formats or Base64 code formats without server transmission. URL encoding replaces unsafe ASCII characters with percentage notations, while Base64 translates binary or text streams into ASCII text. This tool is vital for web development, API integrations, and developer debug tasks.',
    faqs: [
      { q: 'What is URL encoding used for?', a: 'URL encoding converts query parameters containing spaces and special characters into safe characters suitable for browser address bars.' },
      { q: 'How does Base64 conversion work?', a: 'Base64 translates raw binary data or text strings into a safe ASCII format, making it easier to transmit data over text-based protocols like email or JSON payloads.' },
      { q: 'Can I decode Base64 strings back to plain text?', a: 'Yes! Choose the Base64 Decode option, paste your string, and the decoder will instantly compute the original plain text.' }
    ]
  },
  'office-pdf': {
    howItWorks: 'Word/Excel to PDF Workaround delivers document conversion directly in the web browser. True PDF conversion requires server-side rendering, but this client-side parser uses mammoth.js to compile Word (.docx) files into HTML structures, and SheetJS to render Excel (.xlsx) spreadsheets as interactive HTML tables. The resulting layout is loaded into an invisible sandbox, and html2pdf.js compiles the DOM nodes into a PDF file. Users should note that complex formatting may vary from the original MS Office files.',
    faqs: [
      { q: 'How does client-side Word-to-PDF work?', a: 'It parses Docx XML elements into HTML elements via mammoth.js, inserts them into an invisible browser page, and generates a PDF snapshot using html2pdf.js.' },
      { q: 'Can I convert spreadsheet sheets from Excel (.xlsx)?', a: 'Yes, the Excel parser reads worksheet grids, formats them into a clean HTML table, and exports the table sheet into PDF format.' },
      { q: 'Why does my converted PDF look different from MS Office?', a: 'Since conversion runs client-side without Microsoft Office engines, complex styles like custom charts, smart shapes, and nested tables are rendered as basic HTML elements, which might cause formatting differences.' }
    ]
  },
  'json-formatter': {
    howItWorks: 'JSON Formatter / Validator parses raw JSON input to identify syntax errors, nesting anomalies, and structural defects. It formats minified strings using customizable indentation spaces (2, 3, or 4 spaces) or minifies raw JSON to reduce byte payload. The entire parsing process executes locally in sandboxed javascript memory, protecting user data from external storage leaks.',
    faqs: [
      { q: 'How does local JSON formatting guarantee safety?', a: 'Unlike online services that upload your payload to dynamic servers, WeConvertFiles formats and validates text entirely client-side using JavaScript. No confidential APIs or configs leave your browser.' },
      { q: 'What happens if validation fails?', a: 'The parser catches standard syntax exceptions and prints an error window specifying the character index or syntax error type, allowing you to debug and correct it quickly.' }
    ]
  },
  'json-yaml': {
    howItWorks: 'JSON to YAML Converter transforms structured data between JSON and YAML formats entirely inside your browser. A version-pinned parsing engine loads only when you use this tool, then reads your input, validates its syntax, and rebuilds it in the target format with your chosen indentation. Because nothing is uploaded, configuration files, API payloads, and CI/CD manifests stay private.',
    faqs: [
      { q: 'Does this tool upload my JSON or YAML data anywhere?', a: 'No. The conversion engine loads once from a version-pinned script and every conversion afterward runs locally in your browser memory. Nothing is sent to a server.' },
      { q: 'What happens if my JSON or YAML has a syntax error?', a: 'The parser reports a clear error message describing the problem and, where available, the line or position it occurred at, so you can fix it before converting.' },
      { q: 'Can I convert in both directions?', a: 'Yes. Use the JSON to YAML and YAML to JSON toggle above the input box to switch direction at any time.' }
    ]
  },
  'sql-formatter': {
    howItWorks: 'SQL Formatter beautifies raw SQL queries into clean, readable statements using a dialect-aware formatting engine that loads only when this tool is opened. Choose Standard SQL, MySQL, PostgreSQL, or SQL Server (T-SQL) syntax rules, set keyword casing, and control indentation width. The tool only rewrites the text of your query for readability; it never connects to a database or executes any statement.',
    faqs: [
      { q: 'Does this tool run or execute my SQL query?', a: 'No. SQL Formatter only rewrites the text of your query for readability. It never connects to a database, and no query is ever executed.' },
      { q: 'Which SQL dialects are supported?', a: 'Standard SQL, MySQL, PostgreSQL, and SQL Server (T-SQL) dialects are supported, each with dialect-specific keyword and syntax handling.' },
      { q: 'Can I control keyword casing and indentation?', a: 'Yes. Use the Keyword Case dropdown to force uppercase, lowercase, or preserve your original casing, and the Indent Size dropdown to control spacing.' }
    ]
  },
  'code-minifier': {
    howItWorks: 'Code Minifier & Beautifier compresses or reformats HTML, CSS, and JavaScript directly in your browser. Version-pinned parsing engines (such as Terser for JavaScript) are lazy-loaded only for the language and action you actually use, so nothing loads until you need it. Minifying strips whitespace, comments, and redundant syntax to shrink file size, while beautifying reformats compressed code with consistent indentation for readability. Your code is only parsed and rewritten locally; it is never executed or uploaded.',
    faqs: [
      { q: 'Does this tool execute my HTML, CSS, or JavaScript?', a: 'No. Your code is only parsed as text and rewritten. It is never executed, evaluated, or rendered by the tool.' },
      { q: 'Are the minifier libraries loaded for every tool visit?', a: 'No. Each parsing engine (such as Terser for JavaScript) is a version-pinned script that only loads the first time you minify or beautify that specific language.' },
      { q: 'What do the size statistics mean?', a: 'After processing, the tool shows the input size and output size in bytes, plus the percentage change, so you can see exactly how much smaller (or more readable) your code became.' }
    ]
  },
  'password-generator': {
    howItWorks: 'Password & Secret Generator creates passwords, hex tokens, and Base64URL tokens using the Web Crypto API\'s crypto.getRandomValues(), which draws from your operating system\'s cryptographically secure random number source. Math.random() is never used anywhere in this tool. Character selection uses rejection sampling to avoid modulo bias, so every allowed character is equally likely. An entropy estimate updates live as you adjust length, character sets, or token size, and generated secrets are never saved, logged, or transmitted anywhere.',
    faqs: [
      { q: 'Is Math.random() ever used to generate my passwords?', a: 'No. Every character and byte is generated using crypto.getRandomValues(), the Web Crypto API\'s cryptographically secure random number generator. Math.random() is not suitable for secrets and is never used here.' },
      { q: 'Are my generated passwords saved or sent anywhere?', a: 'No. Generation happens entirely in your browser\'s memory. Nothing is written to storage, logged to a server, or transmitted over the network.' },
      { q: 'What is the difference between a password, hex token, and Base64URL token?', a: 'A password is a human-typeable string built from the character sets you choose. A hex token encodes random bytes as hexadecimal (0-9, a-f), and a Base64URL token encodes random bytes using the URL-safe Base64 alphabet — both are common formats for API keys and session secrets.' }
    ]
  },
  'case-converter': {
    howItWorks: 'Case Converter rewrites text into UPPERCASE, lowercase, Title Case, Sentence case, camelCase, PascalCase, snake_case, kebab-case, or CONSTANT_CASE entirely inside your browser. It splits each line into words using boundary detection for spaces, hyphens, underscores, and camelCase transitions, then rebuilds the text in your chosen style while preserving line breaks. Live word and character counts update as you type, and the whole conversion runs locally with nothing uploaded.',
    faqs: [
      { q: 'Does this tool support multiline text?', a: 'Yes. Line breaks are preserved, and each line is converted independently, so pasting multiple lines, lists, or paragraphs works as expected.' },
      { q: 'How are word and character counts calculated?', a: 'Word count splits on whitespace and counts non-empty segments. Character count is the full length of the text, including spaces and punctuation.' },
      { q: 'Can I download the converted text?', a: 'Yes. After converting, use the Download button to save the output as a .txt file, or use Copy Output to copy it to your clipboard.' }
    ]
  },
  'qr-generator': {
    howItWorks: 'QR Code Generator turns the text or URL you type into a static QR code using the QRious library, drawn on a canvas in your browser as you type. The code uses error correction level H, the highest level, and you choose a pixel size of 150, 200, 250, or 300 before downloading a PNG named qrcode.png. Whatever you enter is encoded literally, so include the full https:// for a link; there are no dedicated forms for phone or Wi-Fi payloads.',
    faqs: [
      { q: 'Is there a limit to the amount of text in QR Codes?', a: 'No fixed limit is set here, but practicality bites first: the more you encode, the denser the pattern and the harder it is to scan at these sizes. Keep links short, and prefer a larger size for print.' },
      { q: 'Do the generated QR codes expire?', a: 'The image never expires and always decodes to the same text, because the code is static with no redirect to repoint. Whether the destination it points to still works is a separate matter you control.' }
    ]
  },
  'hash-generator': {
    howItWorks: 'Hash Generator computes MD5, SHA-1, SHA-256, and SHA-512 cryptographic digests. When you type or paste inputs, the CryptoJS framework evaluates the character byte structures in browser memory and prints the resulting hash strings side-by-side. Hash computation runs locally, so input contents are not sent to WeConvertFiles for processing.',
    faqs: [
      { q: 'What algorithms are supported?', a: 'We support MD5 for integrity checking, and secure SHA-1, SHA-256, and SHA-512 hashing algorithms.' },
      { q: 'Can I decrypt the generated hashes?', a: 'No. Cryptographic hashes are one-way functions designed to be irreversible. They cannot be decrypted back into plain text.' }
    ]
  },
  'exif-utility': {
    howItWorks: 'EXIF Viewer / Remover displays camera metadata stored inside JPEG, JPG, and PNG images, such as location coordinate maps, capture device names, and shutter apertures. To remove EXIF, the tool draws the raw visual pixel grid onto a clean canvas buffer and exports the image as a new blob, completely stripping all original metadata headers.',
    faqs: [
      { q: 'What metadata gets removed?', a: 'All camera settings, GPS coordinate history, orientation fields, and device details are stripped. Only the visual pixel graphic is saved.' },
      { q: 'Why is it important for privacy?', a: 'When you share photos online, they can contain coordinates showing where the photo was taken. Stripping EXIF blocks geolocation tracking.' }
    ]
  },
  'heic-to-jpg': {
    howItWorks: 'HEIC to JPG / PNG passes each selected .heic file to heic2any 0.0.4 in sequence and requests JPEG or PNG output. JPEG quality can be set from 10 to 100, with 90 as the default. One result downloads directly; multiple results are packaged as converted-images.zip with JSZip. Metadata and HEIC-specific features are not guaranteed to survive.',
    faqs: [
      { q: 'Can I convert multiple HEIC files?', a: 'Yes. The files are converted one after another. One output downloads directly, while two or more outputs are packaged in converted-images.zip.' },
      { q: 'Can I convert .heif files?', a: 'No. The current file filter accepts names ending in .heic. Renaming another format does not convert its underlying data.' },
      { q: 'Does conversion preserve metadata or Live Photo motion?', a: 'Do not rely on it to preserve metadata, auxiliary images, depth data, editing information, or Live Photo motion. Keep the original HEIC and any paired video.' },
      { q: 'How are my photos handled?', a: 'Photo contents are processed in browser memory and are not sent to WeConvertFiles for conversion. Consented site-usage analytics may operate separately without receiving the photo contents.' }
    ]
  },
  'image-to-base64': {
    howItWorks: 'Image to Base64 encodes PNG, JPG, WebP, and GIF images into ASCII Base64 text strings and HTML Data URIs. Web developers use Base64 strings to embed images directly into HTML, CSS stylesheets, or JSON API payloads without making extra HTTP requests. Using the native HTML5 FileReader API, encoding is computed locally in your browser, and image contents are not sent to WeConvertFiles for processing.',
    faqs: [
      { q: 'What is the difference between raw Base64 and a Data URI?', a: 'Raw Base64 contains only the encoded binary character string, whereas a Data URI includes the MIME type header prefix (e.g. data:image/png;base64,...), allowing web browsers and CSS files to render the image directly inline.' },
      { q: 'Are my images uploaded for Base64 conversion?', a: 'File contents are processed in browser memory with the HTML5 FileReader API and are not sent to WeConvertFiles for conversion. Consented site-usage analytics may operate separately without receiving the selected image contents.' }
    ]
  },
  'base64-to-image': {
    howItWorks: 'Base64 to Image decodes raw Base64 strings or formatted Data URIs into downloadable PNG, JPG, WebP, and GIF image files. Developers often need to inspect base64 encoded image strings from database fields, API responses, or CSS assets. This tool parses the encoded data in local browser memory, renders a visual preview, and exports the decoded file with its matching extension without transmitting data to external servers.',
    faqs: [
      { q: 'How does the Base64 to Image decoder auto-detect the image format?', a: 'The decoder inspects the Data URI header prefix or raw Base64 magic byte signatures to identify whether the encoded stream represents a PNG, JPEG, WebP, or GIF graphic format.' },
      { q: 'How is pasted Base64 image data handled?', a: 'Decoding runs in browser memory with native JavaScript APIs, and the string is not sent to WeConvertFiles for conversion. Consented site-usage analytics may operate separately without receiving the pasted Base64 contents.' }
    ]
  },
  'svg-to-image': {
    howItWorks: 'SVG to PNG / JPG converts Scalable Vector Graphics (SVG) into raster image files (PNG or JPEG) directly in your browser. Vector graphics maintain crisp quality at any resolution, but raster formats are required for social media, print, and legacy applications. Using HTML5 Canvas rendering and limited XML cleanup, this tool lets you set custom width/height dimensions, preserve transparency or choose solid background colors, and export a fixed-size raster image in the browser.',
    faqs: [
      { q: 'How does the converter handle SVG scripts?', a: 'Before rendering on canvas, the converter parses the SVG XML and removes script elements and inline event-handler attributes such as onload and onclick. This is limited cleanup, not comprehensive SVG sanitization, and it does not claim to remove external resource references.' },
      { q: 'Can I convert transparent SVGs to PNG or JPG?', a: 'Yes! When converting to PNG, transparency is fully preserved. When converting to JPG, you can choose a custom solid background color (such as white or black).' }
    ]
  }
};

const tools = [
  {
    id: 'image-to-base64',
    title: 'Image to Base64',
    kicker: 'Image Tools',
    badge: 'Base64 Output',
    icon: 'B64',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    description: 'Convert PNG, JPG, WebP, and GIF images to raw Base64 strings or Data URIs.',
    hint: 'Upload an image or drop a PNG, JPG, WebP, or GIF file.',
    accept: 'image/png,image/jpeg,image/webp,image/gif',
    multiple: false,
    notes: ['Raw Base64 & Data URI output.', 'Copy or download as TXT.', 'Processed locally in your browser.']
  },
  {
    id: 'base64-to-image',
    title: 'Base64 to Image',
    kicker: 'Image Tools',
    badge: 'Base64 Decode',
    icon: 'IMG',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    description: 'Decode raw Base64 or Data URIs to PNG, JPG, WebP, or GIF image files.',
    hint: 'Paste a Base64 string or upload a TXT file containing Base64 data.',
    accept: '.txt,text/plain',
    multiple: false,
    notes: ['Auto-detects format extension.', 'Previews image data without injecting HTML.', 'Download decoded image.']
  },
  {
    id: 'svg-to-image',
    title: 'SVG to PNG / JPG',
    kicker: 'Image Tools',
    badge: 'Vector Export',
    icon: 'SVG',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    description: 'Convert SVG vector graphics to high-res PNG or JPG raster images.',
    hint: 'Upload an SVG file or paste raw SVG XML code below.',
    accept: '.svg,image/svg+xml',
    multiple: false,
    notes: ['Removes scripts & inline event handlers.', 'Custom dimensions & background color.', 'Lossless PNG or quality JPG.']
  },
  {
    id: 'pdf-to-word',
    title: 'PDF to Word / TXT',
    kicker: 'PDF Tools',
    badge: 'DOCX or TXT',
    icon: 'W',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    description: 'Turn a PDF text layer into an editable Word (.docx) document or a plain-text (.txt) file — you choose the output format.',
    hint: 'Upload one PDF file with a selectable text layer.',
    accept: 'application/pdf',
    multiple: false,
    notes: ['Reconstructs lines and paragraphs client-side.', 'Choose a Word (.docx) or plain-text (.txt) download.', 'Does not perform OCR on images.']
  },
  {
    id: 'office-pdf',
    title: 'Word / Excel to PDF',
    kicker: 'Office Tools',
    badge: 'Browser Rendered',
    icon: 'O',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    description: 'Convert Word (.docx) or Excel (.xlsx) documents to PDF using client-side rendering.',
    hint: 'Upload a DOCX or XLSX file. Note: complex styling may vary.',
    accept: '.docx,.xlsx,.doc,.xls,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/msword,application/vnd.ms-excel',
    multiple: false,
    notes: ['Word parsed with mammoth.js.', 'Excel parsed with SheetJS.', 'DOM elements compiled to PDF via html2pdf.']
  },
  {
    id: 'merge-pdf',
    title: 'Merge PDF',
    kicker: 'Organize PDF',
    badge: 'Multiple PDFs',
    icon: 'M',
    iconBg: 'bg-rose-100',
    iconColor: 'text-rose-600',
    description: 'Combine multiple PDF files into one document in the order you choose.',
    hint: 'Upload two or more PDF files. Drag selected files to reorder.',
    accept: 'application/pdf',
    multiple: true,
    notes: ['Runs locally with pdf-lib.', 'Drag files to control merge order.', 'Downloads one combined PDF.']
  },
  {
    id: 'images-pdf',
    title: 'Images to PDF',
    kicker: 'Convert PDF',
    badge: 'PNG, JPG',
    icon: 'I',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    description: 'Combine multiple images into a clean PDF, one image per page.',
    hint: 'PNG or JPG files. Drag selected items to reorder.',
    accept: 'image/png,image/jpeg',
    multiple: true,
    notes: ['Supports multiple PNG and JPEG images.', 'Drag the preview rows to change page order.', 'Images are centered on fixed A4 portrait pages.']
  },
  {
    id: 'compress-pdf',
    title: 'Compress PDF',
    kicker: 'Edit PDF',
    badge: 'Reduce Size',
    icon: 'C',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    description: 'Create a rasterized PDF copy using selectable JPEG quality levels.',
    hint: 'Upload one PDF file and select the compression level.',
    accept: 'application/pdf',
    multiple: false,
    notes: ['Processes file contents in browser memory.', 'Rasterizes complete pages as JPEG.', 'A smaller result is not guaranteed.']
  },
  {
    id: 'heic-to-jpg',
    title: 'HEIC to JPG / PNG',
    kicker: 'Image Tools',
    badge: 'Apple HEIC',
    icon: 'H',
    iconBg: 'bg-teal-100',
    iconColor: 'text-teal-600',
    description: 'Convert Apple HEIC photos to standard JPEG or PNG images in browser memory.',
    hint: 'Upload one or more HEIC files to begin batch conversion.',
    accept: '.heic',
    multiple: true,
    notes: ['Accepts files ending in .heic.', 'Batch conversion runs sequentially.', 'One file downloads directly; batches use ZIP.']
  },
  {
    id: 'split-pdf',
    title: 'Split PDF',
    kicker: 'Organize PDF',
    badge: 'ZIP output',
    icon: 'S',
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600',
    description: 'Separate every page of a PDF into individual PDF files bundled in a ZIP.',
    hint: 'Upload one PDF file. Each page becomes a separate PDF.',
    accept: 'application/pdf',
    multiple: false,
    notes: ['Creates one PDF per page.', 'Downloads all pages as a ZIP.', 'Useful for simple page separation.']
  },
  {
    id: 'pdf-images',
    title: 'PDF to PNG',
    kicker: 'Convert PDF',
    badge: 'ZIP output',
    icon: 'P',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-700',
    description: 'Render each PDF page as a PNG and download all pages in one ZIP.',
    hint: 'One PDF file. Output is a single ZIP archive.',
    accept: 'application/pdf',
    multiple: false,
    notes: ['Uses pdf.js in the browser.', 'Every page becomes a PNG.', 'All PNGs download together in a ZIP file.']
  },
  {
    id: 'pdf-jpg',
    title: 'PDF to JPG',
    kicker: 'Convert PDF',
    badge: 'ZIP output',
    icon: 'J',
    iconBg: 'bg-fuchsia-100',
    iconColor: 'text-fuchsia-700',
    description: 'Render each PDF page as a JPG image and download all pages in one ZIP.',
    hint: 'One PDF file. Output is a single ZIP archive.',
    accept: 'application/pdf',
    multiple: false,
    notes: ['Uses browser canvas rendering.', 'Every page becomes a JPG.', 'Downloads one ZIP file.']
  },
  {
    id: 'qr-generator',
    title: 'QR Code Generator',
    kicker: 'Developer Tools',
    badge: 'QR Code',
    icon: 'Q',
    iconBg: 'bg-indigo-100',
    iconColor: 'text-indigo-700',
    description: 'Generate high-quality custom QR Codes for any URL, text, or phone number instantly.',
    hint: 'Enter your custom text or link inside the input box below.',
    accept: 'text/plain',
    multiple: false,
    notes: ['Instant client-side QR generation.', 'Customize dimensions and quality.', 'Download as high-res PNG locally.']
  },
  {
    id: 'sign-pdf',
    title: 'Sign PDF',
    kicker: 'PDF Security',
    badge: 'Visible mark',
    icon: 'S',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-700',
    description: 'Place a typed signature on a selected page of a PDF.',
    hint: 'Upload one PDF and enter the signature text.',
    accept: 'application/pdf',
    multiple: false,
    notes: ['Adds a visible typed signature.', 'This is not a certificate-based e-signature.', 'Useful for lightweight approvals.']
  },
  {
    id: 'image-cropper',
    title: 'Crop Image',
    kicker: 'Image Tools',
    badge: 'Aspect Crop',
    icon: 'C',
    iconBg: 'bg-cyan-100',
    iconColor: 'text-cyan-600',
    description: 'Crop and trim image coordinates interactively with aspect ratio controls.',
    hint: 'Upload a JPG, PNG, or WebP file to activate crop box.',
    accept: 'image/jpeg,image/png,image/webp',
    multiple: false,
    notes: ['Fully interactive cropping handles.', 'Presets for 1:1, 16:9, and 4:3 shapes.', 'Downloads output as a PNG file.']
  },
  {
    id: 'extract-pages',
    title: 'Extract Pages',
    kicker: 'Organize PDF',
    badge: 'Page ranges',
    icon: 'E',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-700',
    description: 'Save only the pages you need from a larger PDF.',
    hint: 'Upload one PDF and enter pages to extract, such as 1,3-5.',
    accept: 'application/pdf',
    multiple: false,
    notes: ['Supports ranges and comma lists.', 'Exports selected pages as one PDF.', 'Keeps the original file untouched.']
  },
  {
    id: 'remove-pages',
    title: 'Remove Pages',
    kicker: 'Organize PDF',
    badge: 'Visual editor',
    icon: 'X',
    iconBg: 'bg-rose-100',
    iconColor: 'text-rose-600',
    description: 'Delete selected pages from a PDF and download the cleaned file.',
    hint: 'Upload one PDF, then click the trash icon on the pages to remove.',
    accept: 'application/pdf',
    multiple: false,
    notes: ['Remove pages by clicking them in the visual editor.', 'Keeps every page you do not delete.', 'Drag to reorder or rotate while you are there.']
  },
  {
    id: 'bulk-resize',
    title: 'Bulk Image Resizer',
    kicker: 'Image Tools',
    badge: 'ZIP Output',
    icon: 'R',
    iconBg: 'bg-indigo-100',
    iconColor: 'text-indigo-600',
    description: 'Resize multiple images in bulk by percentage, width, or height and download as a ZIP.',
    hint: 'Upload multiple images (JPG, PNG, WebP) to begin.',
    accept: 'image/jpeg,image/png,image/webp',
    multiple: true,
    notes: ['Batch resize locally in browser.', 'Download as ZIP folder.', 'Preserves aspect ratio optionally.']
  },
  {
    id: 'excel-to-csv',
    title: 'Excel to CSV / JSON',
    kicker: 'Document Tools',
    badge: 'XLSX / XLS',
    icon: 'X',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-700',
    description: 'Convert Microsoft Excel spreadsheet sheets into clean CSV tables or JSON lists.',
    hint: 'Upload an Excel (.xlsx or .xls) document.',
    accept: '.xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    multiple: false,
    notes: ['Processes files in local sandbox.', 'Converts first sheet of workbooks.', 'Downloads output spreadsheet instantly.']
  },
  {
    id: 'word-counter',
    title: 'Word & Character Counter',
    kicker: 'Utilities',
    badge: 'Live Stats',
    icon: 'N',
    iconBg: 'bg-lime-100',
    iconColor: 'text-lime-700',
    description: 'Live-updates word, character, and paragraph counts plus a reading-time estimate.',
    hint: 'Paste or type your text to count characters (or upload text files).',
    accept: 'text/plain',
    multiple: false,
    notes: ['Real-time live counting.', 'Words, characters, paragraphs, and reading time.', 'Runs in your browser; text is not uploaded.']
  },
  {
    id: 'image-scaler',
    title: 'Scale Image',
    kicker: 'Image Tools',
    badge: 'NEW',
    icon: 'S',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-700',
    description: 'Scale up your images to 1.5x, 2x, or 3x using high-quality Lanczos-3 interpolation locally.',
    hint: 'Upload one JPG, PNG, or WebP image.',
    accept: 'image/jpeg,image/png,image/webp',
    multiple: false,
    notes: ['Runs 100% locally in your browser.', 'Lanczos-3 preserving sharp details.', 'Options for Bilinear and Pixel Art scaling.']
  },
  {
    id: 'webp-convert',
    title: 'Image to WebP',
    kicker: 'Image Tools',
    badge: 'WebP Output',
    icon: 'W',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-700',
    description: 'Convert JPEG, PNG, or WebP images to high-compression WebP format locally.',
    hint: 'Upload one or more JPG, PNG, or WebP images to begin.',
    accept: 'image/jpeg,image/png,image/webp',
    multiple: true,
    notes: ['Processes locally in canvas.', 'Supports lossy and lossless modes.', 'Fast batch image conversions.']
  },
  {
    id: 'organize-pdf',
    title: 'Organize PDF',
    kicker: 'Organize PDF',
    badge: 'Reorder pages',
    icon: 'O',
    iconBg: 'bg-lime-100',
    iconColor: 'text-lime-700',
    description: 'Reorder PDF pages by entering the new page sequence.',
    hint: 'Upload one PDF and enter a new order, such as 3,1,2.',
    accept: 'application/pdf',
    multiple: false,
    notes: ['Reorders pages without uploading.', 'Use page numbers in the new order.', 'You can also duplicate pages by repeating numbers.']
  },
  {
    id: 'watermark-pdf',
    title: 'Watermark PDF',
    kicker: 'Edit PDF',
    badge: 'Text mark',
    icon: 'W',
    iconBg: 'bg-sky-100',
    iconColor: 'text-sky-700',
    description: 'Add a diagonal text watermark to every page of a PDF.',
    hint: 'Upload one PDF and enter watermark text.',
    accept: 'application/pdf',
    multiple: false,
    notes: ['Adds a visible text watermark.', 'Adjust text and opacity.', 'Good for drafts and internal copies.']
  },
  {
    id: 'page-numbers',
    title: 'Add Page Numbers',
    kicker: 'Edit PDF',
    badge: 'Footer',
    icon: '#',
    iconBg: 'bg-cyan-100',
    iconColor: 'text-cyan-700',
    description: 'Stamp page numbers at the bottom of every PDF page.',
    hint: 'Upload one PDF and choose a numbering style.',
    accept: 'application/pdf',
    multiple: false,
    notes: ['Adds numbers to every page.', 'Choose simple or Page X of Y style.', 'Uses standard PDF text drawing.']
  },
  {
    id: 'rotate-pdf',
    title: 'Rotate PDF',
    kicker: 'Edit PDF',
    badge: '90/180/270',
    icon: 'R',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-700',
    description: 'Rotate all pages or selected pages in a PDF.',
    hint: 'Upload one PDF, choose degrees, and optionally enter pages.',
    accept: 'application/pdf',
    multiple: false,
    notes: ['Rotate all pages by default.', 'Supports selected pages.', 'Downloads a new rotated PDF.']
  },
  {
    id: 'encrypt-pdf',
    title: 'Protect PDF',
    kicker: 'PDF Security',
    badge: 'Password',
    icon: 'P',
    iconBg: 'bg-rose-100',
    iconColor: 'text-rose-600',
    description: 'Add a password to encrypt and secure your PDF document.',
    hint: 'Upload one PDF file and choose your password.',
    accept: 'application/pdf',
    multiple: false,
    notes: ['Encrypts locally in your browser using pdf-lib.', 'Restricts editing and copying.', 'Downloads a password-protected PDF.']
  },
  {
    id: 'json-convert',
    title: 'JSON to CSV / Excel',
    kicker: 'Developer Tools',
    badge: 'CSV / XLSX',
    icon: 'J',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-700',
    description: 'Convert JSON text array or file into structured CSV or Excel sheets.',
    hint: 'Upload a JSON file or paste raw JSON text.',
    accept: 'application/json',
    multiple: false,
    notes: ['Parses client-side.', 'Generates Excel (XLSX) or CSV files.', 'Validates JSON syntax before conversion.']
  },
  {
    id: 'csv-convert',
    title: 'CSV to Excel or JSON',
    kicker: 'Data helper',
    badge: 'CSV',
    icon: 'C',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-700',
    description: 'Parse a CSV file and export it as formatted JSON or an Excel workbook.',
    hint: 'One CSV file with a header row.',
    accept: '.csv,text/csv',
    multiple: false,
    notes: ['CSV is parsed with headers.', 'Choose JSON or Excel before converting.', 'Runs locally using PapaParse and SheetJS.']
  },
  {
    id: 'json-formatter',
    title: 'JSON Formatter / Validator',
    kicker: 'Developer Tools',
    badge: 'Formatter',
    icon: 'F',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-700',
    description: 'Format, validate, beautify, and minify raw JSON string data dynamically.',
    hint: 'Paste your raw JSON text inside the workspace below.',
    accept: 'application/json',
    multiple: false,
    notes: ['Format, beautify, or minify JSON.', 'Validates syntax and detects errors.', '100% client-side validation.']
  },
  {
    id: 'color-palette',
    title: 'Image Color Picker & Eyedropper',
    kicker: 'Image Tools',
    badge: 'HEX / RGB',
    icon: 'P',
    iconBg: 'bg-sky-100',
    iconColor: 'text-sky-600',
    description: 'Extract exact color codes from your images using an interactive picker or native Eyedropper.',
    hint: 'Upload a JPG, PNG, or WebP image to pick custom colors.',
    accept: 'image/jpeg,image/png,image/webp',
    multiple: false,
    notes: ['Click anywhere on the image to pick pixel colors.', 'Supports native screen Eyedropper magnification.', 'One-click copy to clipboard.']
  },
  {
    id: 'favicon-generator',
    title: 'Favicon Generator',
    kicker: 'Image Tools',
    badge: 'ICO & PNG Pack',
    icon: 'F',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    description: 'Convert custom logo graphics into optimized web standard multi-resolution favicons.',
    hint: 'Upload a square logo PNG, JPG, or WebP image.',
    accept: 'image/jpeg,image/png,image/webp',
    multiple: false,
    notes: ['Generates multi-resolution favicon.ico.', 'Outputs apple-touch-icon.png.', 'Downloads package as a ZIP.']
  },
  {
    id: 'diff-checker',
    title: 'Code Diff Checker',
    kicker: 'Developer Tools',
    badge: 'Side-by-side',
    icon: 'D',
    iconBg: 'bg-rose-100',
    iconColor: 'text-rose-600',
    description: 'Compare two text or code snippets side-by-side with inline differences highlighted.',
    hint: 'Enter Original text on the left and Modified text on the right.',
    accept: 'text/plain',
    multiple: false,
    notes: ['Compares text line-by-line.', 'Highlights additions and deletions.', 'Supports side-by-side viewing.']
  },
  {
    id: 'url-base64',
    title: 'URL / Base64 Converter',
    kicker: 'Developer Tools',
    badge: 'Encode / Decode',
    icon: 'B',
    iconBg: 'bg-cyan-100',
    iconColor: 'text-cyan-700',
    description: 'Encode/decode URLs or convert text and images to Base64 strings.',
    hint: 'Paste your text or string below, choose mode, and convert.',
    accept: 'text/plain',
    multiple: false,
    notes: ['URL encode & decode operations.', 'Base64 text encoder & decoder.', 'Instant output copying.']
  },
  {
    id: 'markdown-preview',
    title: 'Markdown Live Preview',
    kicker: 'Developer Tools',
    badge: 'HTML Preview',
    icon: 'K',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-700',
    description: 'Write Markdown text and view the rendered HTML live on a split screen.',
    hint: 'Type your Markdown on the left, view HTML rendering on the right.',
    accept: 'text/markdown',
    multiple: false,
    notes: ['Live split-screen previews.', 'Converts locally using marked.js.', 'Allows copying raw HTML.']
  },
  {
    id: 'regex-tester',
    title: 'Regex Tester',
    kicker: 'Developer Tools',
    badge: 'JS RegExp',
    icon: 'R',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-700',
    description: 'Test JavaScript regular expressions against inputs in real-time with highlights.',
    hint: 'Enter your regex and test strings to check matching logs.',
    accept: '',
    multiple: false,
    notes: ['Real-time matching as you type.', 'Supports match groups breakdown.', 'Lists matches with count statistics.']
  },
  {
    id: 'jwt-decoder',
    title: 'JWT Decoder',
    kicker: 'Developer Tools',
    badge: 'JSON Web Token',
    icon: 'Y',
    iconBg: 'bg-fuchsia-100',
    iconColor: 'text-fuchsia-700',
    description: 'Decode JSON Web Token payloads offline with signature claims analysis.',
    hint: 'Paste your encoded JWT string (header.payload.signature).',
    accept: '',
    multiple: false,
    notes: ['Split-screen JSON breakdown.', 'Auto-checks token expiration dates.', 'Fully offline in sandboxed memory.']
  },
  {
    id: 'uuid-generator',
    title: 'UUID Generator',
    kicker: 'Developer Tools',
    badge: 'v4 / v1 Bulk',
    icon: 'U',
    iconBg: 'bg-violet-100',
    iconColor: 'text-violet-700',
    description: 'Generate bulk cryptographically secure v4 and v1 UUID strings instantly.',
    hint: 'Select the quantity and version parameters.',
    accept: '',
    multiple: false,
    notes: ['Uses Web Crypto API CSPRNG.', 'Format outputs as text lists, JSON, or CSV.', 'Copy list with one click.']
  },
  {
    id: 'hash-generator',
    title: 'Hash Generator',
    kicker: 'Developer Tools',
    badge: 'Cryptographic',
    icon: 'H',
    iconBg: 'bg-rose-100',
    iconColor: 'text-rose-700',
    description: 'Compute MD5, SHA-1, SHA-256, and SHA-512 cryptographic hashes locally.',
    hint: 'Enter your custom text inside the box or drag a local file.',
    accept: '*/*',
    multiple: false,
    notes: ['Supports MD5, SHA-1, SHA-256, SHA-512.', 'Calculates hashes in browser memory.', 'Copy hashes with one click.']
  },
  {
    id: 'exif-utility',
    title: 'EXIF Viewer / Remover',
    kicker: 'Image Tools',
    badge: 'Privacy Tool',
    icon: 'X',
    iconBg: 'bg-cyan-100',
    iconColor: 'text-cyan-700',
    description: 'Read and remove EXIF camera metadata from JPEG, JPG, and PNG images for privacy.',
    hint: 'Upload one JPEG or PNG image to view or strip EXIF records.',
    accept: 'image/jpeg,image/png',
    multiple: false,
    notes: ['Displays geo-coordinates, camera details.', 'Remove EXIF records completely.', 'Download optimized clean image.']
  },
  {
    id: 'unix-converter',
    title: 'Unix Time Converter',
    kicker: 'Developer Tools',
    badge: 'Epoch Converter',
    icon: 'T',
    iconBg: 'bg-rose-100',
    iconColor: 'text-rose-600',
    description: 'Convert Epoch timestamps to human-readable datetime formats and vice versa.',
    hint: 'Enter standard Unix timestamp integer or choose date fields.',
    accept: '',
    multiple: false,
    notes: ['Auto-detects second vs millisecond formats.', 'Live updating epoch clock.', 'ISO 8601 and local zone support.']
  },
  {
    id: 'decrypt-pdf',
    title: 'Unlock PDF',
    kicker: 'PDF Security',
    badge: 'Remove Password',
    icon: 'U',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-700',
    description: 'Remove password protection from your PDF document.',
    hint: 'Upload a password-locked PDF and enter the current password.',
    accept: 'application/pdf',
    multiple: false,
    notes: ['Decrypts locally in your browser.', 'Generates a fully unlocked PDF.', 'You must enter the correct password.']
  },
  {
    id: 'json-yaml',
    title: 'JSON to YAML Converter',
    kicker: 'Developer Tools',
    badge: 'JSON ⇄ YAML',
    icon: 'Y',
    iconBg: 'bg-indigo-100',
    iconColor: 'text-indigo-700',
    description: 'Convert between JSON and YAML with syntax validation and formatted output.',
    hint: 'Paste your JSON or YAML text inside the workspace below.',
    accept: 'text/plain',
    multiple: false,
    notes: ['Convert JSON to YAML or YAML to JSON.', 'Validates syntax and shows readable errors.', '100% client-side, nothing is uploaded.']
  },
  {
    id: 'sql-formatter',
    title: 'SQL Formatter',
    kicker: 'Developer Tools',
    badge: 'Format Only',
    icon: 'S',
    iconBg: 'bg-cyan-100',
    iconColor: 'text-cyan-700',
    description: 'Beautify SQL queries for Standard SQL, MySQL, PostgreSQL, and SQL Server.',
    hint: 'Paste your raw SQL query inside the workspace below.',
    accept: 'text/plain',
    multiple: false,
    notes: ['Supports Standard SQL, MySQL, PostgreSQL, and SQL Server.', 'Controls for keyword casing and indentation.', 'Formats only, queries are never executed.']
  },
  {
    id: 'code-minifier',
    title: 'Code Minifier & Beautifier',
    kicker: 'Developer Tools',
    badge: 'HTML / CSS / JS',
    icon: 'M',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-700',
    description: 'Minify or beautify HTML, CSS, and JavaScript code directly in your browser.',
    hint: 'Paste your HTML, CSS, or JavaScript code inside the workspace below.',
    accept: 'text/plain',
    multiple: false,
    notes: ['Minify or beautify HTML, CSS, or JavaScript.', 'Shows input size, output size, and percent saved.', 'Code is only parsed and formatted, never executed.']
  },
  {
    id: 'password-generator',
    title: 'Password & Secret Generator',
    kicker: 'Developer Tools',
    badge: 'Crypto Secure',
    icon: 'P',
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600',
    description: 'Generate strong passwords, hex tokens, and Base64URL tokens using your browser\'s secure random generator.',
    hint: 'Choose a mode and options, then generate secrets below.',
    accept: 'text/plain',
    multiple: false,
    notes: ['Uses crypto.getRandomValues(), never Math.random().', 'Generate passwords, hex tokens, or Base64URL tokens.', 'Nothing is ever saved, logged, or transmitted.']
  },
  {
    id: 'case-converter',
    title: 'Case Converter',
    kicker: 'Developer Tools',
    badge: 'Text Case',
    icon: 'C',
    iconBg: 'bg-lime-100',
    iconColor: 'text-lime-700',
    description: 'Convert text between UPPERCASE, camelCase, snake_case, and more, with word and character counts.',
    hint: 'Paste your text inside the workspace below.',
    accept: 'text/plain',
    multiple: false,
    notes: ['Supports 9 case styles including camelCase and snake_case.', 'Shows live word and character counts.', 'Handles multiline text.']
  }
];

function trackPageSenseEvent(eventName) {
  window.pagesense = window.pagesense || [];
  window.pagesense.push(['trackEvent', eventName]);
}

const state = {
  currentTool: null,
  files: [],
  dragIndex: null,
  visualPages: [],
  dragGridIndex: null
};

const dashboardView = document.getElementById('dashboardView');
const workspaceView = document.getElementById('workspaceView');
const toolGrid = document.getElementById('toolGrid');
const backButton = document.getElementById('backButton');
const fileInput = document.getElementById('fileInput');
const dropZone = document.getElementById('dropZone');
const fileList = document.getElementById('fileList');
const clearButton = document.getElementById('clearButton');
const convertButton = document.getElementById('convertButton');
const statusText = document.getElementById('statusText');
const csvOptions = document.getElementById('csvOptions');
const toolOptions = document.getElementById('toolOptions');

function toolIcon(tool) {
  const iconClass = 'h-7 w-7';
  const icons = {
    'merge-pdf': `<svg class="${iconClass}" viewBox="0 0 32 32" fill="none" aria-hidden="true"><rect x="4" y="5" width="10" height="14" rx="2" fill="currentColor" opacity=".28"/><rect x="18" y="13" width="10" height="14" rx="2" fill="currentColor" opacity=".55"/><path d="M12 22h8M20 22l-3-3M20 22l-3 3" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    'split-pdf': `<svg class="${iconClass}" viewBox="0 0 32 32" fill="none" aria-hidden="true"><rect x="10" y="6" width="12" height="20" rx="2" fill="currentColor" opacity=".35"/><path d="M16 10v12M16 16H7M7 16l3-3M7 16l3 3M16 16h9M25 16l-3-3M25 16l-3 3" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    'remove-pages': `<svg class="${iconClass}" viewBox="0 0 32 32" fill="none" aria-hidden="true"><rect x="7" y="5" width="16" height="22" rx="2.5" fill="currentColor" opacity=".28"/><path d="M13 14l8 8M21 14l-8 8" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg>`,
    'extract-pages': `<svg class="${iconClass}" viewBox="0 0 32 32" fill="none" aria-hidden="true"><rect x="5" y="6" width="15" height="20" rx="2" fill="currentColor" opacity=".28"/><rect x="16" y="10" width="11" height="16" rx="2" fill="currentColor" opacity=".5"/><path d="M12 16h12M24 16l-4-4M24 16l-4 4" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    'organize-pdf': `<svg class="${iconClass}" viewBox="0 0 32 32" fill="none" aria-hidden="true"><rect x="5" y="5" width="8" height="8" rx="2" fill="currentColor" opacity=".35"/><rect x="19" y="5" width="8" height="8" rx="2" fill="currentColor" opacity=".55"/><rect x="5" y="19" width="8" height="8" rx="2" fill="currentColor" opacity=".55"/><rect x="19" y="19" width="8" height="8" rx="2" fill="currentColor" opacity=".35"/></svg>`,
    'rotate-pdf': `<svg class="${iconClass}" viewBox="0 0 32 32" fill="none" aria-hidden="true"><rect x="10" y="9" width="13" height="17" rx="2" fill="currentColor" opacity=".28"/><path d="M23 7a9 9 0 0 0-14 3M9 10H5V6M9 25a9 9 0 0 0 14-3M23 22h4v4" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    'watermark-pdf': `<svg class="${iconClass}" viewBox="0 0 32 32" fill="none" aria-hidden="true"><rect x="6" y="5" width="20" height="22" rx="2.5" fill="currentColor" opacity=".22"/><path d="M10 21l4-10 4 10M12 17h4M20 12v9" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    'page-numbers': `<svg class="${iconClass}" viewBox="0 0 32 32" fill="none" aria-hidden="true"><rect x="6" y="5" width="20" height="22" rx="2.5" fill="currentColor" opacity=".24"/><path d="M11 13h3v9M10 22h8M21 13h1.5a2 2 0 0 1 1.2 3.6L20 22h5" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    'sign-pdf': `<svg class="${iconClass}" viewBox="0 0 32 32" fill="none" aria-hidden="true"><rect x="5" y="6" width="17" height="21" rx="2.5" fill="currentColor" opacity=".22"/><path d="M12 21c2-5 4-5 5-1 1.2 4 3-1 5-1M19 10l4 4M20 9l3-3 4 4-3 3" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    'images-pdf': `<svg class="${iconClass}" viewBox="0 0 32 32" fill="none" aria-hidden="true"><rect x="4" y="8" width="16" height="14" rx="2.5" fill="currentColor" opacity=".25"/><rect x="12" y="5" width="16" height="20" rx="2.5" fill="currentColor" opacity=".45"/><path d="M15 21l4-5 3 3 2-2 2 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="18" cy="11" r="1.7" fill="currentColor"/></svg>`,
    'pdf-images': `<svg class="${iconClass}" viewBox="0 0 32 32" fill="none" aria-hidden="true"><rect x="5" y="5" width="14" height="20" rx="2.5" fill="currentColor" opacity=".24"/><rect x="15" y="12" width="12" height="12" rx="2" fill="currentColor" opacity=".5"/><path d="M9 12h6M9 17h5M18 21l2-3 2 2 1-1 2 2" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    'pdf-jpg': `<svg class="${iconClass}" viewBox="0 0 32 32" fill="none" aria-hidden="true"><rect x="5" y="5" width="14" height="20" rx="2.5" fill="currentColor" opacity=".24"/><rect x="15" y="12" width="12" height="12" rx="2" fill="currentColor" opacity=".5"/><path d="M9 12h6M9 17h5M18 21l2-3 2 2 1-1 2 2" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    'csv-convert': `<svg class="${iconClass}" viewBox="0 0 32 32" fill="none" aria-hidden="true"><rect x="5" y="7" width="22" height="18" rx="2.5" fill="currentColor" opacity=".26"/><path d="M5 13h22M5 19h22M12 7v18M20 7v18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
    'pdf-office': `<svg class="${iconClass}" viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M10 23h12a5 5 0 0 0 0-10 7 7 0 0 0-13-2A6 6 0 0 0 10 23Z" fill="currentColor" opacity=".32"/><path d="M16 12v9M16 21l-3-3M16 21l3-3" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    'encrypt-pdf': `<svg class="${iconClass}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" opacity=".35"/><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>`,
    'decrypt-pdf': `<svg class="${iconClass}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" opacity=".35"/><path d="M7 11V7a5 5 0 0 1 9.9-1" /></svg>`,
    'compress-pdf': `<svg class="${iconClass}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14h16M4 10h16M12 3v18" opacity=".28"/><path d="M15 6l-3-3-3 3M9 18l3 3 3-3" /></svg>`,
    'webp-convert': `<svg class="${iconClass}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" opacity=".35"/><polyline points="7.5 10 10 15 12 11 14 15 16.5 10"/></svg>`,
    'bulk-resize': `<svg class="${iconClass}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="14" height="14" rx="2" opacity=".35"/><rect x="8" y="8" width="14" height="14" rx="2" stroke-dasharray="3 3"/><path d="M16 2h6v6M8 22H2v-6"/></svg>`,
    'color-palette': `<svg class="${iconClass}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 14.7255 3.09032 17.1962 4.85857 19C5.34442 19.4858 5.41324 20.2526 5.0934 20.817C4.66774 21.5682 4.81181 22 5.5 22H12Z" opacity=".35"/><circle cx="7.5" cy="10.5" r="1.5" fill="currentColor"/><circle cx="11.5" cy="7.5" r="1.5" fill="currentColor"/><circle cx="16.5" cy="9.5" r="1.5" fill="currentColor"/><circle cx="15.5" cy="14.5" r="1.5" fill="currentColor"/></svg>`,
    'json-convert': `<svg class="${iconClass}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h4v16h-4M8 20H4V4h4" opacity=".35"/><path d="M12 8v8M9 11l3-3 3 3"/></svg>`,
    'word-counter': `<svg class="${iconClass}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" opacity=".35"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>`,
    'diff-checker': `<svg class="${iconClass}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 9h4M15 15h4" stroke-width="2.5"/><rect x="2" y="3" width="20" height="18" rx="2" opacity=".35"/></svg>`,
    'markdown-preview': `<svg class="${iconClass}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2" opacity=".35"/><path d="M7 15V9l3.5 4L14 9v6M18 9v4M16.5 10.5L18 12l1.5-1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    'url-base64': `<svg class="${iconClass}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" opacity=".35"/></svg>`,
    'office-pdf': `<svg class="${iconClass}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" opacity=".28"/><path d="M14 2v6h6M8 13h8M8 17h6"/></svg>`,
    'json-formatter': `<svg class="${iconClass}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" opacity=".35"/><path d="M8 9.5H6.5a1 1 0 0 0-1 1v1a1 1 0 0 1-1 1H4a1 1 0 0 1 1 1v1a1 1 0 0 0 1 1H6.5m11-6H19a1 1 0 0 1 1 1v1a1 1 0 0 0 1 1h.5a1 1 0 0 0-1 1v1a1 1 0 0 1-1 1H17.5" /></svg>`,
    'qr-generator': `<svg class="${iconClass}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="6" height="6" rx="1"/><rect x="15" y="3" width="6" height="6" rx="1"/><rect x="3" y="15" width="6" height="6" rx="1"/><rect x="15" y="15" width="6" height="6" rx="1"/><path d="M9 6h6M6 9v6M9 18h6M18 9v6" opacity=".35"/></svg>`,
    'hash-generator': `<svg class="${iconClass}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22a7 7 0 0 0 5-12.02V8a5 5 0 0 0-10 0v1.98A7 7 0 0 0 12 22z" opacity=".35"/><path d="M12 13v4" /><circle cx="12" cy="12" r="1" /></svg>`,
    'exif-utility': `<svg class="${iconClass}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" opacity=".35"/><circle cx="12" cy="13" r="4"/><circle cx="12" cy="13" r="1"/></svg>`,
    'heic-to-jpg': `<svg class="${iconClass}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" opacity=".35"/><path d="m8 10 4 4-4 4m8-8 4 4-4 4"/></svg>`,
    'pdf-to-word': `<svg class="${iconClass}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" opacity=".28"/><path d="M14 2v6h6M8 13h8M8 17h6"/></svg>`,
    'image-cropper': `<svg class="${iconClass}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 21V10M21 10H10M10 10V3M10 10H3" /></svg>`,
    'favicon-generator': `<svg class="${iconClass}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z" opacity=".35"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/></svg>`,
    'excel-to-csv': `<svg class="${iconClass}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" opacity=".35"/><path d="M9 9h6M9 13h6M9 17h6"/></svg>`,
    'regex-tester': `<svg class="${iconClass}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" opacity=".35"/><path d="M8 8h8M8 12h8M8 16h5"/></svg>`,
    'uuid-generator': `<svg class="${iconClass}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" opacity=".35"/><path d="M9 12h6M12 9v6"/></svg>`,
    'unix-converter': `<svg class="${iconClass}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9" opacity=".35"/><path d="M12 6v6l4 2"/></svg>`,
    'jwt-decoder': `<svg class="${iconClass}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" opacity=".35"/><path d="M9 12h6M9 8h6M9 16h6"/></svg>`,
    'image-to-base64': `<svg class="${iconClass}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" opacity=".35"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 20"/></svg>`,
    'base64-to-image': `<svg class="${iconClass}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" opacity=".35"/><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14"/><circle cx="8.5" cy="8.5" r="1.5"/></svg>`,
    'svg-to-image': `<svg class="${iconClass}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" opacity=".35"/><polyline points="14 3 14 9 20 9"/><path d="M10 13l2 2 4-4"/></svg>`,
    'json-yaml': `<svg class="${iconClass}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" opacity=".35"/><path d="M8 8v3.5L6 14l2 2.5V20M16 8v3.5l2 2.5-2 2.5V20" /></svg>`,
    'sql-formatter': `<svg class="${iconClass}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="6" rx="8" ry="3" opacity=".35"/><path d="M4 6v12c0 1.66 3.58 3 8 3s8-1.34 8-3V6" /><path d="M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3" /></svg>`,
    'code-minifier': `<svg class="${iconClass}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" opacity=".35"/><path d="m9 9-3 3 3 3m6-6 3 3-3 3" /></svg>`,
    'password-generator': `<svg class="${iconClass}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" opacity=".35"/><path d="M7 11V7a5 5 0 0 1 10 0v4" /><circle cx="12" cy="16" r="1.5" /></svg>`,
    'case-converter': `<svg class="${iconClass}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 17V7l3.5 6L11 7v10" /><path d="M14 17h6M17 8v9M14 11l3-3 3 3" opacity=".7" /></svg>`
  };

  return icons[tool.id] || `<svg class="${iconClass}" viewBox="0 0 32 32" fill="none" aria-hidden="true"><rect x="7" y="5" width="18" height="22" rx="3" fill="currentColor" opacity=".3"/></svg>`;
}

const toolCategories = [
  {
    id: 'create-pdf',
    title: 'Create & Convert to PDF',
    rgb: '37, 99, 235',
    icon: '<path d="M12 3v12m0 0l-4-4m4 4l4-4"/><path d="M5 19h14"/>',
    tools: ['office-pdf', 'images-pdf']
  },
  {
    id: 'manage-pdf',
    title: 'Edit & Manage PDF',
    rgb: '249, 115, 22',
    icon: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 013 3L8 18l-4 1 1-4z"/>',
    tools: ['merge-pdf', 'compress-pdf', 'split-pdf', 'sign-pdf', 'extract-pages', 'remove-pages', 'organize-pdf', 'watermark-pdf', 'page-numbers', 'rotate-pdf', 'encrypt-pdf', 'decrypt-pdf']
  },
  {
    id: 'pdf-outputs',
    title: 'Convert PDF to Other Formats',
    rgb: '244, 63, 94',
    icon: '<path d="M7 7h10l-3-3m3 3l-3 3"/><path d="M17 17H7l3 3m-3-3l3-3"/>',
    tools: ['pdf-to-word', 'pdf-images', 'pdf-jpg']
  },
  {
    id: 'image-tools',
    title: 'Image Conversion & Editing',
    rgb: '16, 185, 129',
    icon: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 15l-5-5L5 20"/>',
    tools: ['heic-to-jpg', 'image-cropper', 'bulk-resize', 'image-scaler', 'webp-convert', 'color-palette', 'favicon-generator', 'exif-utility', 'image-to-base64', 'base64-to-image', 'svg-to-image']
  },
  {
    id: 'data-tools',
    title: 'Data & Document Conversion',
    rgb: '99, 102, 241',
    icon: '<path d="M4 5h16v14H4z"/><path d="M4 10h16M10 5v14"/>',
    tools: ['excel-to-csv', 'json-convert', 'csv-convert', 'json-yaml']
  },
  {
    id: 'developer-tools',
    title: 'Text & Developer Utilities',
    rgb: '139, 92, 246',
    icon: '<path d="M8 9l-4 3 4 3M16 9l4 3-4 3M14 5l-4 14"/>',
    tools: ['qr-generator', 'word-counter', 'json-formatter', 'diff-checker', 'url-base64', 'markdown-preview', 'regex-tester', 'jwt-decoder', 'uuid-generator', 'hash-generator', 'unix-converter', 'sql-formatter', 'code-minifier', 'password-generator', 'case-converter']
  }
];

const toolColorRgb = {
  red: '239, 68, 68',
  orange: '249, 115, 22',
  rose: '244, 63, 94',
  amber: '245, 158, 11',
  lime: '132, 204, 22',
  green: '34, 197, 94',
  sky: '56, 189, 248',
  cyan: '6, 182, 212',
  purple: '168, 85, 247',
  indigo: '99, 102, 241',
  blue: '59, 130, 246',
  fuchsia: '217, 70, 239',
  emerald: '16, 185, 129',
  violet: '139, 92, 246',
  teal: '13, 148, 136'
};

const popularToolIds = new Set(['merge-pdf', 'office-pdf', 'compress-pdf', 'heic-to-jpg', 'json-formatter', 'images-pdf', 'sign-pdf', 'pdf-to-word']);

function renderToolCard(tool) {
  const baseColor = tool.iconColor.replace('text-', '');
  const borderClass = `border-${baseColor}/[0.48] dark:border-${baseColor}/[0.54] hover:border-${baseColor}/90`;
  const colorName = baseColor.split('-')[0];
  const rgbVal = toolColorRgb[colorName] || '59, 130, 246';
  const popularBadge = popularToolIds.has(tool.id)
    ? '<span class="ml-1.5 inline-flex items-center rounded-full bg-amber-100 dark:bg-amber-950/40 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-amber-700 dark:text-amber-400 align-middle">Popular</span>'
    : '';
  return `
    <button class="group flex flex-col rounded-xl border ${borderClass} bg-white dark:bg-[#1e293b] px-3.5 py-3 text-left transition duration-200 hover:-translate-y-0.5 shadow-[0_4px_16px_rgba(var(--glow-rgb),0.096)] hover:shadow-[0_8px_30px_rgba(var(--glow-rgb),0.30)]" style="--glow-rgb: ${rgbVal};" data-tool-id="${tool.id}">
      <span class="flex items-start gap-3">
        <span class="grid h-10 w-10 shrink-0 place-items-center rounded-xl ${tool.iconBg} ${tool.iconColor} shadow-sm">${toolIcon(tool)}</span>
        <span class="min-w-0 flex-1">
          <span class="block text-sm font-semibold leading-snug text-slate-950 dark:text-slate-100">${tool.title}${popularBadge}</span>
          <span class="mt-0.5 block text-xs leading-5 text-slate-600 dark:text-slate-400">${tool.description}</span>
        </span>
      </span>
      <span class="mt-3 inline-flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:text-[#1a73e8] dark:group-hover:text-blue-400 transition-colors">Open
        <svg class="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
      </span>
    </button>
  `;
}

function renderDashboard() {
  const toolById = new Map(tools.map(tool => [tool.id, tool]));
  toolGrid.innerHTML = toolCategories.map(category => {
    const categoryTools = category.tools.map(id => toolById.get(id)).filter(Boolean);
    return `
      <section class="tool-category" aria-labelledby="${category.id}-title" style="--category-rgb: ${category.rgb};">
        <div class="tool-category-heading">
          <span class="tool-category-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${category.icon}</svg>
          </span>
          <h2 id="${category.id}-title">${category.title}</h2>
          <span class="tool-category-count">${categoryTools.length} tools</span>
          <span class="tool-category-divider" aria-hidden="true"></span>
        </div>
        <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          ${categoryTools.map(renderToolCard).join('')}
        </div>
      </section>
    `;
  }).join('');
}

async function openTool(toolId) {
  const tool = tools.find(item => item.id === toolId);
  if (!tool) return;
  state.currentTool = tool;
  state.files = [];
  state.pendingResult = null;
  state.dragIndex = null;
  const fileInputEl = document.getElementById('fileInput');
  if (fileInputEl) fileInputEl.value = '';
  document.getElementById('conversionResultPanel')?.classList.add('hidden');
  document.getElementById('conversionProgressContainer')?.classList.add('hidden');
  updateFileList();
  setStatus('');
  document.documentElement.dataset.initialView = 'tool';
  dashboardView.classList.add('hidden');
  workspaceView.classList.remove('hidden');

  // Hide file controls for tools that work entirely with pasted or generated text.
  const isInteractiveOnly = ['word-counter', 'diff-checker', 'markdown-preview', 'url-base64', 'json-formatter', 'qr-generator', 'hash-generator', 'regex-tester', 'jwt-decoder', 'json-yaml', 'sql-formatter', 'code-minifier', 'password-generator', 'case-converter', 'uuid-generator', 'unix-converter'].includes(toolId);
  document.getElementById('dropZone').classList.toggle('hidden', isInteractiveOnly);
  document.getElementById('selectedFilesContainer').classList.toggle('hidden', isInteractiveOnly);
  document.getElementById('convertActionRow').classList.toggle('hidden', isInteractiveOnly);

  // Hide convertButton for color palette tool as picking is fully interactive
  const convertButton = document.getElementById('convertButton');
  if (convertButton) {
    convertButton.classList.toggle('hidden', ['color-palette', 'json-formatter', 'qr-generator', 'hash-generator', 'image-to-base64', 'base64-to-image', 'svg-to-image', 'json-yaml', 'sql-formatter', 'code-minifier', 'password-generator', 'case-converter'].includes(toolId));
  }

  document.getElementById('workspaceKicker').textContent = tool.kicker;
  document.getElementById('workspaceTitle').textContent = tool.title;
  document.getElementById('workspaceDescription').textContent = tool.description;
  document.getElementById('workspaceBadge').textContent = tool.badge;
  document.getElementById('uploadHint').textContent = tool.hint;
  // Keep the visible breadcrumb correct after a client-side tool switch. The
  // markup is pre-rendered per tool in the runtime catalogue (same component the
  // static pages use), so this only swaps it in.
  const breadcrumbEl = document.getElementById('toolBreadcrumb');
  if (breadcrumbEl) {
    breadcrumbEl.innerHTML = (window.WCF_CATALOGUE && window.WCF_CATALOGUE.breadcrumbs && window.WCF_CATALOGUE.breadcrumbs[toolId]) || '';
  }
  const factBlockEl = document.getElementById('toolFactBlock');
  if (factBlockEl) {
    factBlockEl.innerHTML = (window.WCF_CATALOGUE && window.WCF_CATALOGUE.factBlocks && window.WCF_CATALOGUE.factBlocks[toolId]) || '';
  }
  const noteOverrides = {
    'merge-pdf': [
      'Select as many PDF files as you like to merge into a single clean document.',
      'Drag and drop files to change their order before merging instantly.',
      'File contents are processed locally and are not sent to WeConvertFiles for conversion.'
    ],
    'split-pdf': [
      'Split every single page of your PDF file into individual documents in one click.',
      'Output files are packaged into a tidy ZIP folder for clean downloads.',
      'File contents stay in browser memory and are not sent for conversion.'
    ],
    'office-pdf': [
      'Convert MS Word (.docx) or Excel (.xlsx) files directly into clean PDF layouts.',
      'mammoth.js parses Word structures, and SheetJS renders Excel tables client-side.',
      'Runs locally inside browser memory; input contents are not sent to WeConvertFiles for processing.'
    ],
    'extract-pages': [
      'Extract target pages or specific sequences from large documents easily.',
      'Type ranges (e.g. 1, 3-5) and export them instantly into a new PDF file.',
      'Process stays offline inside browser storage to protect confidential data.'
    ],
    'organize-pdf': [
      'Reorder document pages quickly without uploading files to remote systems.',
      'Simply enter your desired sequence or repeat indexes to duplicate pages.',
      'Download the completed file directly from client-side memory.'
    ],
    'rotate-pdf': [
      'Rotate all pages or specific page numbers by 90, 180, or 270 degrees.',
      'Clean vector rotation layout adjustments preserve text quality.',
      'Done entirely on your local machine, keeping sensitive documents safe.'
    ],
    'watermark-pdf': [
      'Stamp transparent diagonal text stamps onto every page of your PDF.',
      'Customize text content and opacity adjustments instantly.',
      'Ideal for protecting drafts, internal records, and copyright claims.'
    ],
    'page-numbers': [
      'Stamp page numbers at the bottom center of all PDF pages automatically.',
      'Choose between simple page counts (1, 2, 3) or "Page X of Y" formats.',
      'Safe local vector calculations avoid data leaks or processing fees.'
    ],
    'sign-pdf': [
      'Draw your signature on our touch/mouse drawing pad or type your name.',
      'Signature graphics are rendered at 3x resolution (High-DPI) to avoid pixelation.',
      'Images are embedded locally directly into the PDF layout for privacy.'
    ],
    'images-pdf': [
      'Compile PNG or JPEG images into a single A4 portrait PDF document.',
      'Perfect for digitizing receipts, ID cards, screenshots, or physical records.',
      'Drag and drop rows to reorder images before generating the document.'
    ],
    'pdf-images': [
      'Convert PDF pages into high-resolution PNG graphics.',
      'Renders page visual layouts onto HTML5 canvas layouts locally.',
      'Saves all pages bundled cleanly in a single download ZIP folder.'
    ],
    'pdf-jpg': [
      'Extract PDF pages as lightweight JPG files for sharing.',
      'Processes all conversions in browser memory without database logging.',
      'Outputs standard compressed JPG images zipped for convenience.'
    ],
    'csv-convert': [
      'Export raw CSV files into structured JSON arrays or Excel workbooks.',
      'Perfect for spreadsheet conversions, reports, and API formatting.',
      'Executes locally on-device using PapaParse and SheetJS.'
    ],
    'remove-pages': [
      'Delete chosen pages from any PDF layout visually in one click.',
      'Keep exactly the pages you need and dump unnecessary slides.',
      'Processed entirely inside client memory for total protection.'
    ],
    'image-scaler': [
      'Perform client-side resolution upscaling to enhance image clarity by 1.5x, 2x, or 3x instantly.',
      'Utilize advanced Lanczos-3 interpolation to prevent pixelation and achieve smooth high-definition rendering.',
      'Choose between Lanczos-3 for photo upscaling, Bilinear for smooth gradients, or Nearest-Neighbor for retro pixel art.',
      'Export your enhanced graphics as high-quality lossless PNG or compressed JPEG files locally.'
    ],
    'encrypt-pdf': [
      'Add high-security passwords to lock and protect PDF documents.',
      'Prevents unauthorized users from printing, copying, or editing files.',
      'Calculations run fully local, meaning we never store your passwords.'
    ],
    'decrypt-pdf': [
      'Remove passwords and lock restrictions from your PDF files.',
      'Download unlocked, fully accessible copies instantly in one click.',
      'You must provide the correct password to bypass lock algorithms.'
    ]
  };

  const activeNotes = noteOverrides[tool.id] || tool.notes;
  document.getElementById('notesList').innerHTML = activeNotes.map(note => {
    const highlighted = note.replace(/100%/g, '<span class="bg-yellow-100 dark:bg-yellow-900/30 px-1 py-0.5 rounded font-semibold text-yellow-800 dark:text-yellow-200">100%</span>');
    return `
      <li class="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
        <svg class="h-4 w-4 shrink-0 text-emerald-500 mt-0.5 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        <span>${highlighted}</span>
      </li>
    `;
  }).join('');

  const content = toolContentDetails[tool.id] || {
    howItWorks: `Our ${tool.title} tool is designed to process files locally in your browser using modern Client-Side JavaScript engines. When you drop your documents, our client-side modules read their binary streams directly in memory. This ensures high-fidelity processing without any server latency or privacy vulnerabilities.`,
    faqs: [
      { q: `How does the ${tool.title} tool work?`, a: `It loads your file into your browser memory, processes the modifications locally, and downloads the output directly. No servers are involved.` },
      { q: `How is my data handled by ${tool.title}?`, a: `Processing runs locally in your browser. Input contents are not sent to WeConvertFiles for processing.` },
      { q: `Do I need to pay or register to use ${tool.title}?`, a: `No. All tools on WeConvertFiles are completely free of charge with no registration required.` }
    ]
  };

  const hiwContainer = document.getElementById('howItWorksContainer');
  const hiwText = document.getElementById('howItWorksText');
  const faqsContainer = document.getElementById('faqsContainer');
  const faqAccordion = document.getElementById('faqAccordion');

  if (hiwText) hiwText.textContent = content.howItWorks;
  if (hiwContainer) hiwContainer.classList.remove('hidden');

  if (faqAccordion) {
    faqAccordion.innerHTML = content.faqs.map(faq => `
      <details class="group rounded-xl border border-slate-200 dark:border-slate-700/60 bg-slate-50 dark:bg-slate-800/20 p-3 transition [&_summary::-webkit-details-marker]:hidden">
        <summary class="flex cursor-pointer items-center justify-between gap-1.5 text-xs font-semibold text-slate-950 dark:text-slate-100 select-none">
          <span>${faq.q}</span>
          <span class="transition group-open:-rotate-180">
            <svg class="h-3.5 w-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
          </span>
        </summary>
        <p class="mt-2 text-[11px] leading-relaxed text-slate-600 dark:text-slate-400 select-text">
          ${faq.a}
        </p>
      </details>
    `).join('');
  }
  if (faqsContainer) faqsContainer.classList.remove('hidden');

  // Populate Programmatic SEO wrapper elements
  const seoHowToTitle = document.getElementById('seoHowToTitle');
  const seoHowToContent = document.getElementById('seoHowToContent');
  const seoFaqsContent = document.getElementById('seoFaqsContent');

  if (seoHowToTitle) {
    seoHowToTitle.textContent = `How to Use WeConvertFiles ${tool.title} Online`;
  }
  if (seoHowToContent) {
    seoHowToContent.innerHTML = `
      <p class="leading-7 text-slate-600 dark:text-slate-400">${content.howItWorks}</p>
    `;
  }
  if (seoFaqsContent) {
    seoFaqsContent.innerHTML = content.faqs.map(faq => `
      <details class="group rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-slate-50/50 dark:bg-slate-800/10 p-5 transition-all duration-200 [&_summary::-webkit-details-marker]:hidden">
        <summary class="flex cursor-pointer items-center justify-between gap-1.5 text-sm font-semibold text-slate-900 dark:text-slate-100 select-none">
          <span>${faq.q}</span>
          <span class="transition-transform duration-200 group-open:-rotate-180">
            <svg class="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
            </svg>
          </span>
        </summary>
        <p class="mt-3 text-xs leading-relaxed text-slate-600 dark:text-slate-400 select-text border-t border-slate-100 dark:border-slate-700/60 pt-3">
          ${faq.a}
        </p>
      </details>
    `).join('');
  }

  fileInput.value = '';
  fileInput.accept = tool.accept;
  fileInput.multiple = tool.multiple;
  csvOptions.classList.toggle('hidden', tool.id !== 'csv-convert');

  if (interactiveLibraryTools.has(tool.id)) {
    setStatus('Loading the tool engine...');
    try {
      await ensureToolLibraries(tool.id);
    } catch (error) {
      setStatus(error.message || 'Unable to load the tool engine. Please refresh and try again.', 'error');
      return;
    }
  }

  if (MODULE_TOOLS.has(tool.id)) {
    try {
      await loadToolModule(tool.id);
    } catch (error) {
      setStatus(error.message || 'Unable to load this tool. Please refresh and try again.', 'error');
      return;
    }
  }
  renderToolOptions(tool.id);
  renderPersistentRelatedTools();
  if (tool.id === 'sign-pdf') {
    ensureSignatureFonts();
    initSignaturePad();
  }
  if (tool.id === 'image-scaler') {
    initImageScalerOptions();
  }
  window.scrollTo({ top: 0, behavior: 'instant' });
  updateFileList();
  setStatus('');
}

function renderToolOptions(toolId) {
  const inputClass = 'mt-2 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-800 dark:text-slate-200 outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] transition';
  const labelClass = 'text-sm font-semibold text-slate-800 dark:text-slate-200';
  const helpClass = 'mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400';

  // A migrated tool renders its own options UI from js/tools/<id>.js.
  const moduleImpl = toolModuleRegistry[toolId];
  if (moduleImpl) {
    moduleImpl.render(toolOptions, { classes: { inputClass, labelClass, helpClass } });
    toolOptions.classList.remove('hidden');
    return;
  }
  const panels = {
    'extract-pages': `
      <label class="${labelClass}" for="pageRangeInput">Pages to extract</label>
      <input id="pageRangeInput" class="${inputClass}" placeholder="Example: 1,3-5" />
      <p class="${helpClass}">Selected pages will be exported into one new PDF.</p>
    `,
    'organize-pdf': `
      <label class="${labelClass}" for="pageRangeInput">New page order</label>
      <input id="pageRangeInput" class="${inputClass}" placeholder="Example: 3,1,2,4" />
      <p class="${helpClass}">Enter the exact page order you want. Repeating a page duplicates it.</p>
    `,
    'rotate-pdf': `
      <div class="grid gap-4 sm:grid-cols-2">
        <label class="${labelClass}">Rotation
          <select id="rotationSelect" class="${inputClass}">
            <option value="90">90 degrees</option>
            <option value="180">180 degrees</option>
            <option value="270">270 degrees</option>
          </select>
        </label>
        <label class="${labelClass}">Pages
          <input id="pageRangeInput" class="${inputClass}" placeholder="All pages" />
        </label>
      </div>
      <p class="${helpClass}">Leave pages blank to rotate the whole PDF.</p>
    `,
    'watermark-pdf': `
      <div class="grid gap-4 sm:grid-cols-3">
        <label class="${labelClass}">Watermark text
          <input id="watermarkText" class="${inputClass}" value="DRAFT" />
        </label>
        <label class="${labelClass}">Opacity
          <select id="watermarkOpacity" class="${inputClass}">
            <option value="0.15">Light</option>
            <option value="0.25" selected>Medium</option>
            <option value="0.4">Strong</option>
          </select>
        </label>
        <label class="${labelClass}">Watermark color
          <div class="flex items-center gap-2 mt-1">
            <input id="watermarkColor" type="color" value="#ff0000" class="h-10 w-16 rounded-xl border border-slate-300 dark:border-slate-700 bg-white p-1 cursor-pointer shrink-0" />
            <span id="watermarkColorText" class="text-xs font-semibold text-slate-500 dark:text-slate-400 font-mono">#FF0000</span>
          </div>
        </label>
      </div>
    `,
    'page-numbers': `
      <label class="${labelClass}">Number style
        <select id="numberStyle" class="${inputClass}">
          <option value="simple">1, 2, 3</option>
          <option value="total">Page 1 of 5</option>
        </select>
      </label>
    `,
    'sign-pdf': `
      <div id="signatureMethodTabs" class="flex gap-2 mb-4">
        <button id="tabDrawSign" type="button" class="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800 transition">Draw Signature</button>
        <button id="tabTypeSign" type="button" class="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition">Type Signature</button>
      </div>

      <div id="drawSignContainer">
        <label class="${labelClass}">Draw your signature below:</label>
        <div class="relative mt-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-inner">
          <canvas id="signatureCanvas" class="w-full h-36 cursor-crosshair touch-none" width="1200" height="384"></canvas>
          <button id="clearSignatureCanvas" type="button" class="absolute right-2.5 bottom-2.5 px-2.5 py-1 text-[11px] font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg border border-slate-300 dark:border-slate-600 transition">Clear</button>
        </div>
      </div>

      <div id="typeSignContainer" class="hidden space-y-4">
        <div>
          <label class="${labelClass}">Full Name / Signature Text</label>
          <input id="signatureText" class="${inputClass} mt-1.5" placeholder="e.g. John Doe" value="John Doe" />
        </div>

        <div>
          <div class="flex items-center justify-between mb-1.5">
            <label class="${labelClass}">Choose Signature Font (10 Styles)</label>
            <span class="text-[11px] text-slate-500 font-medium">Scroll for more</span>
          </div>
          <div id="signatureStyleGrid" class="grid gap-2 sm:grid-cols-2 max-h-56 overflow-y-auto p-2 border border-slate-200 dark:border-slate-700/60 rounded-2xl bg-slate-50/50 dark:bg-slate-900/40">
          </div>
        </div>

        <div>
          <label class="${labelClass}">Signature Ink Color</label>
          <div id="signatureColorSwatches" class="mt-2 flex items-center gap-3">
          </div>
        </div>
      </div>

      <div class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 grid gap-4 sm:grid-cols-3">
        <div>
          <label class="${labelClass}">Page Number</label>
          <input id="signaturePage" class="${inputClass} mt-1" type="number" min="1" value="1" />
        </div>
        <div>
          <label class="${labelClass}">Position</label>
          <select id="signaturePosition" class="${inputClass} mt-1">
            <option value="lower-right" selected>Bottom Right</option>
            <option value="lower-left">Bottom Left</option>
            <option value="lower-center">Bottom Center</option>
            <option value="upper-right">Top Right</option>
            <option value="upper-left">Top Left</option>
          </select>
        </div>
        <div>
          <label class="${labelClass}">Size</label>
          <select id="signatureSize" class="${inputClass} mt-1">
            <option value="medium" selected>Medium (Default)</option>
            <option value="small">Small</option>
            <option value="large">Large</option>
          </select>
        </div>
      </div>
      <p class="${helpClass} mt-2">Custom signature placement and scale on your chosen PDF page.</p>
    `,
    'image-scaler': `
      <div class="grid gap-4 sm:grid-cols-2">
        <div>
          <label class="${labelClass}">Scale Factor</label>
          <div class="mt-2 flex gap-2">
            <button id="btnScale1_5" type="button" class="flex-1 py-2 text-xs font-bold rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800 transition">1.5x</button>
            <button id="btnScale2" type="button" class="flex-1 py-2 text-xs font-bold rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition">2x</button>
            <button id="btnScale3" type="button" class="flex-1 py-2 text-xs font-bold rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition">3x</button>
          </div>
        </div>
        <div>
          <label class="${labelClass}">Resampling Method</label>
          <select id="scaleMethod" class="${inputClass} mt-2">
            <option value="lanczos" selected>Lanczos-3 (High Quality)</option>
            <option value="bilinear">Bilinear (Smooth)</option>
            <option value="nearest">Nearest-Neighbor (Pixel Art)</option>
          </select>
        </div>
      </div>
      <div class="mt-4">
        <label class="${labelClass}">Output Format</label>
        <select id="scaleFormat" class="${inputClass} mt-2">
          <option value="image/png" selected>PNG (Lossless)</option>
          <option value="image/jpeg">JPEG (High Quality)</option>
        </select>
      </div>
      <p class="${helpClass} mt-2">Scale up your images securely inside your browser using mathematical filtering.</p>
    `,
    'encrypt-pdf': `
      <label class="${labelClass}">Choose PDF Password</label>
      <input id="pdfPasswordInput" type="password" class="${inputClass}" placeholder="Enter password to encrypt" />
      <p class="${helpClass}">This password will be required for anyone to open and read the output PDF.</p>
    `,
    'decrypt-pdf': `
      <label class="${labelClass}">Enter Current Password</label>
      <input id="pdfPasswordInput" type="password" class="${inputClass}" placeholder="Enter password to unlock" />
      <p class="${helpClass}">Provide the correct password so the PDF can be decrypted and unlocked in your browser.</p>
    `,
    'compress-pdf': `
      <label class="${labelClass}">Compression Level</label>
      <select id="compressLevelSelect" class="${inputClass}">
        <option value="low">Low (High quality, minimal compression)</option>
        <option value="medium" selected>Medium (Balanced)</option>
        <option value="high">High (Lower render scale and JPEG quality)</option>
      </select>
      <p class="${helpClass}">Each complete page is rasterized as JPEG. Selectable text, links, forms, vectors, and original page geometry are not preserved.</p>
    `,

    'webp-convert': `
      <div class="grid gap-4 sm:grid-cols-2">
        <div>
          <label class="${labelClass}">Quality (Lossy only)</label>
          <div class="mt-2 flex items-center gap-3">
            <input id="webpQualitySlider" type="range" min="10" max="100" value="80" class="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer" />
            <span id="webpQualityVal" class="text-sm font-bold text-slate-700 dark:text-slate-300">80%</span>
          </div>
        </div>
        <div>
          <label class="${labelClass}">Compression Mode</label>
          <select id="webpLosslessSelect" class="${inputClass}">
            <option value="false" selected>Lossy (Optimized Size)</option>
            <option value="true">Lossless (Highest Quality)</option>
          </select>
        </div>
      </div>
      <p class="${helpClass} mt-2">Upload multiple files to convert them to WebP instantly. Images process in parallel.</p>
    `,
    'bulk-resize': `
      <div class="grid gap-4 sm:grid-cols-2">
        <div>
          <label class="${labelClass}">Resize By</label>
          <select id="resizeModeSelect" class="${inputClass}">
            <option value="scale" selected>Scale percentage</option>
            <option value="width">Target Width (px)</option>
            <option value="height">Target Height (px)</option>
          </select>
        </div>
        <div>
          <div id="scaleResizeControl">
            <label class="${labelClass}">Scale Percentage</label>
            <div class="mt-2 flex items-center gap-3">
              <input id="resizeScaleSlider" type="range" min="10" max="200" value="100" class="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer" />
              <span id="resizeScaleVal" class="text-sm font-bold text-slate-700 dark:text-slate-300">100%</span>
            </div>
          </div>
          <div id="dimensionResizeControl" class="hidden">
            <label class="${labelClass}">Target Dimension</label>
            <input id="resizeDimensionInput" type="number" class="${inputClass}" placeholder="Example: 800" min="10" />
          </div>
        </div>
      </div>
      <div class="mt-4 flex items-center gap-2">
        <input type="checkbox" id="resizeAspectRatioCheck" checked class="h-4 w-4 rounded border-slate-300 text-[#1a73e8] focus:ring-[#1a73e8]" />
        <label for="resizeAspectRatioCheck" class="text-xs font-semibold text-slate-700 dark:text-slate-300">Lock Aspect Ratio</label>
      </div>
      <p class="${helpClass} mt-2">Bulk resized images are compiled into a single ZIP archive locally.</p>
    `,
    'color-palette': `
      <div id="eyedropperRowWidget" class="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border border-blue-100 dark:border-blue-950/60 rounded-2xl bg-blue-50/30 dark:bg-blue-950/10 mb-6">
        <div class="flex-1 text-center sm:text-left">
          <h4 class="text-sm font-bold text-slate-800 dark:text-slate-200">System Screen Eyedropper</h4>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Open the browser's native magnifying lens to pick any pixel color from anywhere on your entire screen.</p>
        </div>
        <button id="eyedropperBtn" type="button" class="shrink-0 flex items-center justify-center gap-2 rounded-xl border border-blue-200 dark:border-blue-800 bg-white dark:bg-slate-900 px-4 py-2 text-xs font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition active:scale-[0.98] shadow-sm whitespace-nowrap">
          <svg class="shrink-0 text-blue-600 dark:text-blue-400" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="m19 11-8-8M14 6l-3.5 3.5M10.5 9.5 3 17v4h4l7.5-7.5M19 11l2-2a2 2 0 0 0-3-3l-2 2" />
          </svg>
          <span>Open Screen Eyedropper</span>
        </button>
        <input type="color" id="eyedropperFallbackColorInput" class="hidden" />
      </div>

      <!-- Color Pick Preview Area -->
      <div id="interactiveColorPickerArea" class="mt-6 hidden border border-slate-200 dark:border-slate-700/60 rounded-2xl p-4 bg-slate-50/50 dark:bg-slate-900/30">
        <h4 class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Interactive Image Color Picker</h4>
        <div class="grid gap-5 md:grid-cols-3">
          <!-- Left side: Clickable Image container -->
          <div class="md:col-span-2 flex flex-col items-center">
            <p class="text-xs text-slate-400 dark:text-slate-500 mb-3 text-center w-full">Click anywhere on the image below to extract the exact color pixel:</p>
            <div class="relative border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden cursor-pointer bg-white max-h-[300px] flex items-center justify-center">
              <img id="colorPickerImage" class="max-h-[300px] w-auto object-contain select-none pointer-events-auto" />
            </div>
          </div>

          <!-- Right side: Currently Picked Color Card -->
          <div class="flex flex-col justify-center items-center rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900 p-4 shadow-sm">
            <span class="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Picked Color</span>
            <div id="pickedColorDisplay" class="w-20 h-20 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-inner bg-slate-100" style="background-color: #E2E8F0"></div>
            <span id="pickedColorHex" class="text-sm font-bold text-slate-800 dark:text-slate-200 mt-3">#E2E8F0</span>
            <span id="pickedColorRgb" class="text-xs text-slate-400 dark:text-slate-500 font-mono mt-0.5">rgb(226, 232, 240)</span>
            <button id="copyPickedColorBtn" type="button" class="mt-3 w-full rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-950/60 py-2 text-xs font-semibold transition">Copy HEX Code</button>
          </div>
        </div>
      </div>
    `,
    'json-convert': `
      <div>
        <div class="mb-4">
          <label class="${labelClass}">Output Format</label>
          <select id="jsonTargetFormatSelect" class="${inputClass}">
            <option value="xlsx" selected>Excel Spreadsheet (.xlsx)</option>
            <option value="csv">Comma-separated Values (.csv)</option>
          </select>
        </div>
        <label class="${labelClass}">Paste Raw JSON Text (Optional)</label>
        <textarea id="jsonPasteArea" rows="6" class="${inputClass} font-mono text-xs mt-2" placeholder="[&#10;  {&quot;id&quot;: 1, &quot;name&quot;: &quot;Alice&quot;},&#10;  {&quot;id&quot;: 2, &quot;name&quot;: &quot;Bob&quot;}&#10;]"></textarea>
        <p class="${helpClass}">You can also upload a JSON file directly into the workspace above.</p>
      </div>
    `,
    'office-pdf': `
      <div>
        <div class="p-4 rounded-xl bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200/50 dark:border-yellow-900/40 text-yellow-800 dark:text-yellow-300 text-xs mb-4">
          <strong>⚠️ Client-Side Disclaimer:</strong> Word (.docx) and Excel (.xlsx) file rendering is parsed directly inside your browser. High-fidelity layouts, complex formulas, layered shapes, custom fonts, or heavy formatting templates might not render exactly like Microsoft Office.
        </div>
        <p class="${helpClass}">Select your DOCX or XLSX file in the upload zone above and click Convert to output a secure client-side PDF.</p>
      </div>
    `,
    'exif-utility': `
      <div>
        <div id="exifPreviewArea" class="hidden border border-slate-200 dark:border-slate-700/60 rounded-2xl p-4 bg-slate-50/50 dark:bg-slate-900/30">
          <h4 class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">EXIF Metadata Records</h4>
          <div class="overflow-x-auto">
            <table class="w-full border-collapse text-xs">
              <thead>
                <tr class="border-b border-slate-200 dark:border-slate-700 text-slate-500">
                  <th class="text-left py-2 font-bold uppercase">Metadata Field</th>
                  <th class="text-left py-2 font-bold uppercase">Value</th>
                </tr>
              </thead>
              <tbody id="exifMetadataTableBody" class="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                <tr>
                  <td class="py-2" colspan="2">No EXIF data found in this image.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `,
    'heic-to-jpg': `
      <div>
        <div class="grid gap-4 sm:grid-cols-2">
          <div>
            <label class="${labelClass}">Convert To</label>
            <select id="heicOutputFormat" class="${inputClass}">
              <option value="image/jpeg" selected>JPEG (.jpg)</option>
              <option value="image/png">PNG (.png)</option>
            </select>
          </div>
          <div>
            <label class="${labelClass}">Quality (JPEG only)</label>
            <div class="mt-2.5 flex items-center gap-3">
              <input id="heicQualitySlider" type="range" min="10" max="100" value="90" class="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer" />
              <span id="heicQualityVal" class="text-sm font-bold text-slate-700 dark:text-slate-300">90%</span>
            </div>
          </div>
        </div>
        <p class="${helpClass} mt-2">Photo contents are processed in browser memory with heic2any. Keep the original when metadata or HEIC-specific features matter.</p>
      </div>
    `,
    'pdf-to-word': `
      <div>
        <div class="mb-4">
          <label class="${labelClass}">Output Format</label>
          <select id="pdfWordFormatSelect" class="${inputClass}">
            <option value="docx" selected>Word Document (.docx)</option>
            <option value="txt">Plain Text (.txt)</option>
          </select>
        </div>
        <p class="${helpClass}">Your PDF text layer is reconstructed client-side into the selected format. DOCX rebuilds lines and paragraphs as an editable Word file; TXT extracts the raw text with a page marker before each page. No server processing involved.</p>
      </div>
    `,
    'excel-to-csv': `
      <div>
        <div class="mb-4">
          <label class="${labelClass}">Output Format</label>
          <select id="excelTargetFormatSelect" class="${inputClass}">
            <option value="csv" selected>CSV File (.csv)</option>
            <option value="json">JSON Array (.json)</option>
          </select>
        </div>
        <p class="${helpClass}">Select your Excel file (.xlsx or .xls) in the upload zone above. Only the first worksheet in the workbook is exported.</p>
      </div>
    `,
    'image-cropper': `
      <div>
        <div id="cropPreviewContainer" class="hidden mt-4 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-4 bg-slate-50/50 dark:bg-slate-900/30">
          <h4 class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Crop Image Preview</h4>
          <div class="max-h-[350px] overflow-hidden flex items-center justify-center bg-white rounded-xl">
            <img id="cropImagePreview" class="max-h-[350px] w-auto object-contain" />
          </div>
          <div class="mt-4 flex flex-wrap gap-2.5">
            <button id="btnCropFree" type="button" class="px-3 py-1.5 text-xs font-bold rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800 transition">Free</button>
            <button id="btnCropSquare" type="button" class="px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition">1:1 Square</button>
            <button id="btnCrop16_9" type="button" class="px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition">16:9 Widescreen</button>
            <button id="btnCrop4_3" type="button" class="px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition">4:3 Standard</button>
          </div>
        </div>
        <p class="${helpClass} mt-2">Adjust the crop handles above, select preset ratios, then click Crop and Download below.</p>
      </div>
    `,
    'favicon-generator': `
      <div>
        <div id="faviconPreviewContainer" class="hidden mt-4 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-4 bg-slate-50/50 dark:bg-slate-900/30">
          <h4 class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Favicon Sizes Preview</h4>
          <div class="flex items-center gap-6 p-4 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
            <div class="flex flex-col items-center gap-1">
              <div class="w-[16px] h-[16px] border border-dashed border-slate-300 flex items-center justify-center overflow-hidden">
                <img id="faviconPreview16" class="w-full h-full object-contain" />
              </div>
              <span class="text-[9px] text-slate-400 font-mono">16x16</span>
            </div>
            <div class="flex flex-col items-center gap-1">
              <div class="w-[32px] h-[32px] border border-dashed border-slate-300 flex items-center justify-center overflow-hidden">
                <img id="faviconPreview32" class="w-full h-full object-contain" />
              </div>
              <span class="text-[9px] text-slate-400 font-mono">32x32</span>
            </div>
            <div class="flex flex-col items-center gap-1">
              <div class="w-[48px] h-[48px] border border-dashed border-slate-300 flex items-center justify-center overflow-hidden">
                <img id="faviconPreview48" class="w-full h-full object-contain" />
              </div>
              <span class="text-[9px] text-slate-400 font-mono">48x48</span>
            </div>
          </div>
        </div>
        <p class="${helpClass} mt-2">Generate standard web and Apple touch favicons in a clean ZIP bundle.</p>
      </div>
    `,
  };

  toolOptions.innerHTML = panels[toolId] || '';
  toolOptions.classList.toggle('hidden', !panels[toolId]);

  if (toolId === 'heic-to-jpg') {
    const qualitySlider = document.getElementById('heicQualitySlider');
    if (qualitySlider) {
      qualitySlider.addEventListener('input', (e) => {
        document.getElementById('heicQualityVal').textContent = `${e.target.value}%`;
      });
    }
  }
  if (toolId === 'webp-convert') {
    const qualitySlider = document.getElementById('webpQualitySlider');
    if (qualitySlider) {
      qualitySlider.addEventListener('input', (e) => {
        document.getElementById('webpQualityVal').textContent = `${e.target.value}%`;
      });
    }
  }
  if (toolId === 'bulk-resize') {
    const resizeMode = document.getElementById('resizeModeSelect');
    const scaleSlider = document.getElementById('resizeScaleSlider');
    if (scaleSlider) {
      scaleSlider.addEventListener('input', (e) => {
        document.getElementById('resizeScaleVal').textContent = `${e.target.value}%`;
      });
    }
    if (resizeMode) {
      resizeMode.addEventListener('change', (e) => {
        const isScale = e.target.value === 'scale';
        document.getElementById('scaleResizeControl').classList.toggle('hidden', !isScale);
        document.getElementById('dimensionResizeControl').classList.toggle('hidden', isScale);
      });
    }
  }
}

// The handwriting font families are only used by the Sign PDF signature pad,
// so they load on demand here instead of render-blocking every page view.
function ensureSignatureFonts() {
  if (document.getElementById('signatureFontsStylesheet')) return;
  const preconnect = document.createElement('link');
  preconnect.rel = 'preconnect';
  preconnect.href = 'https://fonts.gstatic.com';
  preconnect.crossOrigin = 'anonymous';
  document.head.appendChild(preconnect);
  const link = document.createElement('link');
  link.id = 'signatureFontsStylesheet';
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Alex+Brush&family=Caveat:wght@600&family=Dancing+Script:wght@600&family=Great+Vibes&family=Kalam:wght@600&family=Marck+Script&family=Pacifico&family=Parisienne&family=Sacramento&family=Satisfy&display=swap';
  document.head.appendChild(link);
}

function initSignaturePad() {
  const canvas = document.getElementById('signatureCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let drawing = false;

  const tabDraw = document.getElementById('tabDrawSign');
  const tabType = document.getElementById('tabTypeSign');
  const drawCont = document.getElementById('drawSignContainer');
  const typeCont = document.getElementById('typeSignContainer');

  const signatureFonts = [
    { id: 'dancing', name: 'Classic Cursive', fontName: 'Dancing Script', family: 'Dancing Script, cursive' },
    { id: 'greatvibes', name: 'Formal Calligraphy', fontName: 'Great Vibes', family: 'Great Vibes, cursive' },
    { id: 'pacifico', name: 'Modern Brush', fontName: 'Pacifico', family: 'Pacifico, cursive' },
    { id: 'caveat', name: 'Natural Handwriting', fontName: 'Caveat', family: 'Caveat, cursive' },
    { id: 'sacramento', name: 'Flowing Script', fontName: 'Sacramento', family: 'Sacramento, cursive' },
    { id: 'alexbrush', name: 'Refined Brush', fontName: 'Alex Brush', family: 'Alex Brush, cursive' },
    { id: 'satisfy', name: 'Smooth Pen', fontName: 'Satisfy', family: 'Satisfy, cursive' },
    { id: 'marck', name: 'Classic Ink', fontName: 'Marck Script', family: 'Marck Script, cursive' },
    { id: 'kalam', name: 'Felt-Tip Signature', fontName: 'Kalam', family: 'Kalam, cursive' },
    { id: 'parisienne', name: 'Chic Script', fontName: 'Parisienne', family: 'Parisienne, cursive' }
  ];

  const signatureColors = [
    { id: 'black', label: 'Dark Black', hex: '#0f172a' },
    { id: 'navy', label: 'Classic Blue', hex: '#1e3a8a' },
    { id: 'royal', label: 'Royal Blue', hex: '#1a73e8' },
    { id: 'red', label: 'Red Ink', hex: '#dc2626' },
    { id: 'green', label: 'Green Ink', hex: '#059669' }
  ];

  state.signatureMethod = 'draw';
  state.isCanvasEmpty = true;
  state.signatureFontFamily = signatureFonts[0].family;
  state.signatureColor = signatureColors[0].hex;

  const styleGrid = document.getElementById('signatureStyleGrid');
  const colorContainer = document.getElementById('signatureColorSwatches');
  const signTextInput = document.getElementById('signatureText');

  function updateFontCardPreviews() {
    if (!styleGrid) return;
    const textVal = signTextInput?.value?.trim() || 'John Doe';
    signatureFonts.forEach(font => {
      const previewElem = document.getElementById(`fontPreview_${font.id}`);
      if (previewElem) {
        previewElem.textContent = textVal;
        previewElem.style.fontFamily = font.family;
        previewElem.style.color = state.signatureColor;
      }
    });
  }

  if (styleGrid) {
    styleGrid.innerHTML = signatureFonts.map((font, idx) => `
      <button id="fontCard_${font.id}" type="button" data-family="${font.family}" class="font-card-btn text-left p-3 rounded-xl border transition flex flex-col justify-between h-20 ${idx === 0 ? 'border-[#1a73e8] bg-[#f5f9ff] dark:bg-[#1a73e8]/10 ring-2 ring-[#1a73e8]/30' : 'border-slate-200 dark:border-slate-700/70 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'}">
        <span class="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">${font.name}</span>
        <span id="fontPreview_${font.id}" class="text-xl font-medium truncate mt-1" style="font-family: ${font.family}; color: ${state.signatureColor};">John Doe</span>
      </button>
    `).join('');

    styleGrid.querySelectorAll('.font-card-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        styleGrid.querySelectorAll('.font-card-btn').forEach(b => {
          b.className = 'font-card-btn text-left p-3 rounded-xl border transition flex flex-col justify-between h-20 border-slate-200 dark:border-slate-700/70 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600';
        });
        btn.className = 'font-card-btn text-left p-3 rounded-xl border transition flex flex-col justify-between h-20 border-[#1a73e8] bg-[#f5f9ff] dark:bg-[#1a73e8]/10 ring-2 ring-[#1a73e8]/30';
        state.signatureFontFamily = btn.dataset.family;
      });
    });
  }

  if (colorContainer) {
    colorContainer.innerHTML = signatureColors.map((color, idx) => `
      <button id="colorSwatch_${color.id}" type="button" data-hex="${color.hex}" title="${color.label}" class="color-swatch-btn w-7 h-7 rounded-full transition flex items-center justify-center ${idx === 0 ? 'ring-2 ring-offset-2 ring-[#1a73e8]' : 'hover:scale-105'}" style="background-color: ${color.hex};">
      </button>
    `).join('');

    colorContainer.querySelectorAll('.color-swatch-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        colorContainer.querySelectorAll('.color-swatch-btn').forEach(b => {
          b.className = 'color-swatch-btn w-7 h-7 rounded-full transition flex items-center justify-center hover:scale-105';
        });
        btn.className = 'color-swatch-btn w-7 h-7 rounded-full transition flex items-center justify-center ring-2 ring-offset-2 ring-[#1a73e8]';
        state.signatureColor = btn.dataset.hex;
        updateFontCardPreviews();
      });
    });
  }

  if (signTextInput) {
    signTextInput.addEventListener('input', updateFontCardPreviews);
  }

  tabDraw.addEventListener('click', () => {
    state.signatureMethod = 'draw';
    tabDraw.classList.add('bg-blue-100', 'text-blue-700', 'border-blue-200', 'dark:bg-blue-900/30', 'dark:text-blue-400', 'dark:border-blue-800');
    tabDraw.classList.remove('bg-slate-100', 'text-slate-700', 'border-slate-200', 'dark:bg-slate-800', 'dark:text-slate-300', 'dark:border-slate-700');
    tabType.classList.remove('bg-blue-100', 'text-blue-700', 'border-blue-200', 'dark:bg-blue-900/30', 'dark:text-blue-400', 'dark:border-blue-800');
    tabType.classList.add('bg-slate-100', 'text-slate-700', 'border-slate-200', 'dark:bg-slate-800', 'dark:text-slate-300', 'dark:border-slate-700');
    drawCont.classList.remove('hidden');
    typeCont.classList.add('hidden');
  });

  tabType.addEventListener('click', () => {
    state.signatureMethod = 'type';
    tabType.classList.add('bg-blue-100', 'text-blue-700', 'border-blue-200', 'dark:bg-blue-900/30', 'dark:text-blue-400', 'dark:border-blue-800');
    tabType.classList.remove('bg-slate-100', 'text-slate-700', 'border-slate-200', 'dark:bg-slate-800', 'dark:text-slate-300', 'dark:border-slate-700');
    tabDraw.classList.remove('bg-blue-100', 'text-blue-700', 'border-blue-200', 'dark:bg-blue-900/30', 'dark:text-blue-400', 'dark:border-blue-800');
    tabDraw.classList.add('bg-slate-100', 'text-slate-700', 'border-slate-200', 'dark:bg-slate-800', 'dark:text-slate-300', 'dark:border-slate-700');
    typeCont.classList.remove('hidden');
    drawCont.classList.add('hidden');
    updateFontCardPreviews();
  });

  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 6.5;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  document.getElementById('clearSignatureCanvas').addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    state.isCanvasEmpty = true;
  });

  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height)
    };
  }

  function startDrawing(e) {
    drawing = true;
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    state.isCanvasEmpty = false;
    e.preventDefault();
  }

  function draw(e) {
    if (!drawing) return;
    const pos = getPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    e.preventDefault();
  }

  function stopDrawing() {
    drawing = false;
  }

  canvas.addEventListener('mousedown', startDrawing);
  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mouseup', stopDrawing);
  canvas.addEventListener('mouseleave', stopDrawing);

  canvas.addEventListener('touchstart', startDrawing);
  canvas.addEventListener('touchmove', draw);
  canvas.addEventListener('touchend', stopDrawing);
}

function initImageScalerOptions() {
  const b1_5 = document.getElementById('btnScale1_5');
  const b2 = document.getElementById('btnScale2');
  const b3 = document.getElementById('btnScale3');
  if (!b1_5 || !b2 || !b3) return;

  state.scaleFactor = 2;

  function setActive(activeBtn, inactiveBtns) {
    activeBtn.classList.add('bg-blue-100', 'text-blue-700', 'border-blue-200', 'dark:bg-blue-900/30', 'dark:text-blue-400', 'dark:border-blue-800');
    activeBtn.classList.remove('bg-slate-100', 'text-slate-700', 'border-slate-200', 'dark:bg-slate-800', 'dark:text-slate-300', 'dark:border-slate-700');

    inactiveBtns.forEach(btn => {
      btn.classList.remove('bg-blue-100', 'text-blue-700', 'border-blue-200', 'dark:bg-blue-900/30', 'dark:text-blue-400', 'dark:border-blue-800');
      btn.classList.add('bg-slate-100', 'text-slate-700', 'border-slate-200', 'dark:bg-slate-800', 'dark:text-slate-300', 'dark:border-slate-700');
    });
  }

  // Default active is 2x
  setActive(b2, [b1_5, b3]);

  b1_5.addEventListener('click', () => {
    state.scaleFactor = 1.5;
    setActive(b1_5, [b2, b3]);
  });

  b2.addEventListener('click', () => {
    state.scaleFactor = 2;
    setActive(b2, [b1_5, b3]);
  });

  b3.addEventListener('click', () => {
    state.scaleFactor = 3;
    setActive(b3, [b1_5, b2]);
  });
}

function updateSeoMetadata(toolId) {
  const tool = tools.find(t => t.id === toolId);
  let title = "WeConvertFiles - Free PDF, Image, Office & Developer Tools";
  let desc = "Free file tools with browser-based processing. Supported file contents stay on your device during conversion.";
  let canonicalUrl = "https://www.weconvertfiles.com/";

  if (tool) {
    title = `${tool.title} Online - Private & Free | WeConvertFiles`;
    desc = `${tool.description} Free and private in your browser—file contents are not uploaded for conversion.`;
    canonicalUrl = `https://www.weconvertfiles.com/${tool.id}`;
  }

  document.title = title;

  let metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) {
    metaDesc = document.createElement('meta');
    metaDesc.name = "description";
    document.head.appendChild(metaDesc);
  }
  metaDesc.content = desc;

  let canonicalLink = document.querySelector('link[rel="canonical"]');
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.rel = "canonical";
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.href = canonicalUrl;

  const socialMetadata = [
    ['property', 'og:title', title],
    ['property', 'og:description', desc],
    ['property', 'og:url', canonicalUrl],
    ['property', 'og:image', 'https://www.weconvertfiles.com/assets/og-image.png'],
    ['name', 'twitter:card', 'summary_large_image'],
    ['name', 'twitter:title', title],
    ['name', 'twitter:description', desc],
    ['name', 'twitter:image', 'https://www.weconvertfiles.com/assets/og-image.png']
  ];

  socialMetadata.forEach(([attribute, key, content]) => {
    let tag = document.querySelector(`meta[${attribute}="${key}"]`);
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute(attribute, key);
      document.head.appendChild(tag);
    }
    tag.content = content;
  });
}

async function handleRoute() {
  // Backward compatibility fallback for hash links
  if (window.location.hash) {
    const hashId = window.location.hash.replace('#', '');
    if (tools.some(t => t.id === hashId)) {
      history.replaceState(null, '', `/${hashId}`);
    }
  }

  // Derive the active tool from the live route (window.location.pathname is always
  // current, including after pushState/popstate), not the page's static build-time
  // data-tool-id attribute. That attribute never changes after pushState navigation,
  // which previously kept single-tool pages stuck on whichever tool they were
  // generated for, even once the URL and DOM had "moved on" via pushState.
  const path = window.location.pathname.replace(/^\/|\/$/g, '');
  if (tools.some(tool => tool.id === path)) {
    updateSeoMetadata(path);
    await openTool(path);
  } else if (path === '' || path === 'index.html') {
    showDashboard();
    updateSeoMetadata(null);
  } else {
    showDashboard();
    updateSeoMetadata(null);
  }
}

function showDashboard() {
  state.files = [];
  state.pendingResult = null;
  const fileInputEl = document.getElementById('fileInput');
  if (fileInputEl) fileInputEl.value = '';
  document.getElementById('conversionResultPanel')?.classList.add('hidden');
  document.getElementById('conversionProgressContainer')?.classList.add('hidden');
  document.documentElement.dataset.initialView = 'dashboard';
  workspaceView.classList.add('hidden');
  dashboardView.classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'instant' });
  setStatus('');
  if (window.location.pathname !== '/' && window.location.pathname !== '/index.html') {
    history.pushState(null, document.title, '/');
  }
}

function validateFiles(fileListObject) {
  const incoming = Array.from(fileListObject || []);
  if (!state.currentTool) return [];

  const toolId = state.currentTool.id;

  // Group 1: PDF Tools
  const pdfTools = [
    'merge-pdf', 'split-pdf', 'extract-pages', 'organize-pdf',
    'rotate-pdf', 'watermark-pdf', 'page-numbers', 'sign-pdf',
    'pdf-images', 'pdf-jpg', 'remove-pages', 'encrypt-pdf',
    'decrypt-pdf', 'compress-pdf'
  ];
  if (pdfTools.includes(toolId)) {
    return incoming.filter(file => file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf'));
  }

  // Group 2: Image Tools
  if (toolId === 'images-pdf') {
    return incoming.filter(file => ['image/png', 'image/jpeg', 'image/jpg'].includes(file.type) || /\.(png|jpe?g)$/i.test(file.name));
  }

  const imageTools = [
    'images-pdf', 'image-scaler', 'webp-convert', 'bulk-resize', 'color-palette', 'exif-utility'
  ];
  if (imageTools.includes(toolId)) {
    return incoming.filter(file => file.type.startsWith('image/') || /\.(png|jpe?g|webp)$/i.test(file.name));
  }

  // Apple HEIC Converter
  if (toolId === 'heic-to-jpg') {
    return incoming.filter(file => /\.heic$/i.test(file.name));
  }

  // Group 3: Office Files (.docx, .xlsx, .doc, .xls)
  if (toolId === 'office-pdf') {
    return incoming.filter(file =>
      /\.(docx|xlsx|doc|xls)$/i.test(file.name) ||
      (file.type && (
        file.type.includes('word') ||
        file.type.includes('excel') ||
        file.type.includes('spreadsheet') ||
        file.type.includes('officedocument') ||
        file.type.includes('msword')
      ))
    );
  }

  // Group 4: CSV Files
  if (toolId === 'csv-convert') {
    return incoming.filter(file => /\.csv$/i.test(file.name));
  }

  // Group 5: JSON Files
  if (toolId === 'json-convert') {
    return incoming.filter(file => /\.json$/i.test(file.name) || file.type === 'application/json');
  }

  return incoming;
}

async function addFiles(fileListObject) {
  const validFiles = validateFiles(fileListObject);
  if (!validFiles.length) {
    setStatus('Please choose a supported file type.');
    return;
  }
  state.files = state.currentTool.multiple ? [...state.files, ...validFiles] : validFiles.slice(0, 1);
  setStatus('');

  const dependencies = toolDependencies(state.currentTool.id);
  if (dependencies.length) {
    setStatus('Loading the secure conversion engine...');
    try {
      await ensureToolLibraries(state.currentTool.id);
      setStatus('');
    } catch (error) {
      setStatus(error.message || 'Unable to load the conversion engine. Please try again.', 'error');
      return;
    }
  }

  if (state.currentTool.id === 'json-convert' && validFiles.length) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const area = document.getElementById('jsonPasteArea');
      if (area) area.value = e.target.result;
    };
    reader.readAsText(validFiles[0]);
  }
  if (state.currentTool.id === 'image-cropper' && validFiles.length) {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const preview = document.getElementById('cropImagePreview');
      const container = document.getElementById('cropPreviewContainer');
      if (preview && container) {
        preview.src = e.target.result;
        container.classList.remove('hidden');
        try {
          await loadConverterLibrary('cropper');
        } catch (err) {
          setStatus('Unable to load the crop tool. Check your connection and try again.', 'error');
          return;
        }
        if (state.cropper) state.cropper.destroy();
        state.cropper = new Cropper(preview, {
          aspectRatio: NaN,
          viewMode: 1,
          background: true,
          responsive: true
        });

        const btnFree = document.getElementById('btnCropFree');
        const btnSq = document.getElementById('btnCropSquare');
        const btn16 = document.getElementById('btnCrop16_9');
        const btn4 = document.getElementById('btnCrop4_3');

        const setActiveCropBtn = (active, inactives) => {
          active.classList.add('bg-blue-100', 'text-blue-700', 'border-blue-200', 'dark:bg-blue-900/30', 'dark:text-blue-400', 'dark:border-blue-800');
          active.classList.remove('bg-slate-100', 'text-slate-700', 'border-slate-200', 'dark:bg-slate-800', 'dark:text-slate-300', 'dark:border-slate-700');
          inactives.forEach(b => {
            b.classList.remove('bg-blue-100', 'text-blue-700', 'border-blue-200', 'dark:bg-blue-900/30', 'dark:text-blue-400', 'dark:border-blue-800');
            b.classList.add('bg-slate-100', 'text-slate-700', 'border-slate-200', 'dark:bg-slate-800', 'dark:text-slate-300', 'dark:border-slate-700');
          });
        };

        if (btnFree) btnFree.onclick = () => { state.cropper.setAspectRatio(NaN); setActiveCropBtn(btnFree, [btnSq, btn16, btn4]); };
        if (btnSq) btnSq.onclick = () => { state.cropper.setAspectRatio(1); setActiveCropBtn(btnSq, [btnFree, btn16, btn4]); };
        if (btn16) btn16.onclick = () => { state.cropper.setAspectRatio(16/9); setActiveCropBtn(btn16, [btnFree, btnSq, btn4]); };
        if (btn4) btn4.onclick = () => { state.cropper.setAspectRatio(4/3); setActiveCropBtn(btn4, [btnFree, btnSq, btn16]); };
      }
    };
    reader.readAsDataURL(validFiles[0]);
  }
  if (state.currentTool.id === 'favicon-generator' && validFiles.length) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const c16 = document.getElementById('faviconPreview16');
      const c32 = document.getElementById('faviconPreview32');
      const c48 = document.getElementById('faviconPreview48');
      const container = document.getElementById('faviconPreviewContainer');
      if (c16 && c32 && c48 && container) {
        c16.src = e.target.result;
        c32.src = e.target.result;
        c48.src = e.target.result;
        container.classList.remove('hidden');
      }
    };
    reader.readAsDataURL(validFiles[0]);
  }

  // Migrated tool modules may refresh their own preview/output when files change
  // (files can be added after the tool renders, e.g. via drag-and-drop).
  const activeModule = toolModuleRegistry[state.currentTool.id] || null;
  if (activeModule && typeof activeModule.onFilesChanged === 'function') activeModule.onFilesChanged();

  const isVisualTool = ['organize-pdf', 'rotate-pdf', 'remove-pages'].includes(state.currentTool.id);
  if (isVisualTool) {
    await initVisualPages();
  } else {
    updateFileList();
  }

  trackPageSenseEvent('file_upload_completed');
}

async function initVisualPages() {
  if (!state.files.length) {
    state.visualPages = [];
    updateFileList();
    return;
  }

  try {
    setStatus('Loading PDF pages for visual editor...');
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
    const buffer = await state.files[0].arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
    const pageCount = pdf.numPages;

    state.visualPages = Array.from({ length: pageCount }, (_, i) => ({
      originalIndex: i,
      rotation: 0
    }));

    setStatus('');
    updateFileList(pdf);
  } catch (error) {
    console.error(error);
    setStatus('Failed to load PDF file pages.', 'error');
  }
}

async function renderVisualPageGrid(pdf) {
  const grid = document.getElementById('visualPageGrid');
  grid.innerHTML = '';
  if (!state.visualPages.length) return;

  for (let i = 0; i < state.visualPages.length; i++) {
    const item = state.visualPages[i];

    const card = document.createElement('div');
    card.className = 'group relative flex flex-col items-center rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-[#1e293b] p-3 shadow-sm hover:border-[#1a73e8] dark:hover:border-[#1a73e8] transition cursor-move';
    card.draggable = true;
    card.dataset.gridIndex = i;

    const label = document.createElement('span');
    label.className = 'absolute top-2 left-2 z-10 rounded-lg bg-slate-900/60 backdrop-blur px-2 py-0.5 text-[11px] font-bold text-white';
    label.textContent = `Page ${item.originalIndex + 1}`;
    card.appendChild(label);

    const canvasContainer = document.createElement('div');
    canvasContainer.className = 'w-full aspect-[3/4] flex items-center justify-center bg-slate-50 dark:bg-slate-900/50 rounded-xl overflow-hidden';

    const canvas = document.createElement('canvas');
    canvas.className = 'max-w-full max-h-full transition-transform duration-200';
    canvas.style.transform = `rotate(${item.rotation}deg)`;

    canvasContainer.appendChild(canvas);
    card.appendChild(canvasContainer);

    const footer = document.createElement('div');
    footer.className = 'mt-3 flex w-full justify-between items-center';

    const rotateBtn = document.createElement('button');
    rotateBtn.type = 'button';
    rotateBtn.className = 'rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#1967d2] transition';
    rotateBtn.innerHTML = `
      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H17" />
      </svg>
    `;
    rotateBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      item.rotation = (item.rotation + 90) % 360;
      canvas.style.transform = `rotate(${item.rotation}deg)`;
    });

    const badgeIndex = document.createElement('span');
    badgeIndex.className = 'text-[11px] font-bold text-slate-400 dark:text-slate-500';
    badgeIndex.textContent = `#${i + 1}`;

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'rounded-lg p-1.5 text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition';
    deleteBtn.innerHTML = `
      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    `;
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      state.visualPages.splice(i, 1);
      renderVisualPageGrid(pdf);
    });

    footer.appendChild(rotateBtn);
    footer.appendChild(badgeIndex);
    footer.appendChild(deleteBtn);
    card.appendChild(footer);
    grid.appendChild(card);

    (async () => {
      try {
        const page = await pdf.getPage(item.originalIndex + 1);
        const viewport = page.getViewport({ scale: 0.22 });
        const ctx = canvas.getContext('2d');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        await page.render({ canvasContext: ctx, viewport }).promise;
      } catch(err) {
        console.error(err);
      }
    })();

    card.addEventListener('dragstart', (e) => {
      state.dragGridIndex = Number(card.dataset.gridIndex);
      e.dataTransfer.effectAllowed = 'move';
    });

    card.addEventListener('dragover', (e) => {
      e.preventDefault();
    });

    card.addEventListener('drop', (e) => {
      e.preventDefault();
      const targetIndex = Number(card.dataset.gridIndex);
      if (state.dragGridIndex === null || state.dragGridIndex === undefined || state.dragGridIndex === targetIndex) return;

      const [movedItem] = state.visualPages.splice(state.dragGridIndex, 1);
      state.visualPages.splice(targetIndex, 0, movedItem);
      state.dragGridIndex = null;
      renderVisualPageGrid(pdf);
    });
  }
}

async function processVisualPdfEdit() {
  ensurePdfLib();
  if (!state.visualPages.length) throw new Error('Please select/keep at least one page.');

  setStatus('Constructing new PDF...');
  const source = await loadPdfDocument(state.files[0]);
  const output = await PDFDocument.create();

  const pageIndices = state.visualPages.map(item => item.originalIndex);
  const copiedPages = await output.copyPages(source, pageIndices);

  copiedPages.forEach((page, index) => {
    const rotationAngle = state.visualPages[index].rotation;
    if (rotationAngle !== 0) {
      const currentRotation = page.getRotation().angle || 0;
      page.setRotation(degrees((currentRotation + rotationAngle) % 360));
    }
    output.addPage(page);
  });

  let fileName = 'edited.pdf';
  if (state.currentTool.id === 'remove-pages') fileName = 'removed-pages.pdf';
  else if (state.currentTool.id === 'rotate-pdf') fileName = 'rotated.pdf';
  else if (state.currentTool.id === 'organize-pdf') fileName = 'organized.pdf';

  await downloadPdfDocument(output, fileName);
}

function updateFileList(pdf = null) {
  let hasContent = state.files.length > 0;
  if (state.currentTool) {
    if (state.currentTool.id === 'json-convert' && document.getElementById('jsonPasteArea')?.value?.trim().length > 0) hasContent = true;
    if (state.currentTool.id === 'base64-to-image' && document.getElementById('b64ImgInputText')?.value?.trim().length > 0) hasContent = true;
    if (state.currentTool.id === 'svg-to-image' && document.getElementById('svgImgTextInput')?.value?.trim().length > 0) hasContent = true;
    if (state.currentTool.id === 'image-to-base64' && state.files.length > 0) hasContent = true;
  }
  clearButton.classList.toggle('hidden', !hasContent);
  convertButton.disabled = !hasContent;

  const isVisualTool = ['organize-pdf', 'rotate-pdf', 'remove-pages'].includes(state.currentTool.id);
  const visualPageGridContainer = document.getElementById('visualPageGridContainer');
  const selectedFilesTitle = document.getElementById('selectedFilesTitle');

  if (isVisualTool && state.files.length > 0) {
    fileList.classList.add('hidden');
    visualPageGridContainer.classList.remove('hidden');
    selectedFilesTitle.textContent = 'PDF Page Editor';
    renderVisualPageGrid(pdf);
    return;
  } else {
    fileList.classList.remove('hidden');
    visualPageGridContainer.classList.add('hidden');
    selectedFilesTitle.textContent = 'Selected files';
  }

  if (!state.files.length) {
    fileList.innerHTML = '<div class="rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-900/30 p-4 text-sm text-slate-500 dark:text-slate-400">No files selected yet.</div>';
    return;
  }

  const canReorderFiles = ['images-pdf', 'merge-pdf'].includes(state.currentTool.id);
  fileList.innerHTML = state.files.map((file, index) => {
    let previewHtml = `<div class="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-400">${index + 1}</div>`;
    if (state.currentTool.id === 'images-pdf' && ['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
      const imgUrl = URL.createObjectURL(file);
      previewHtml = `<img class="h-10 w-10 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-slate-700" src="${imgUrl}" alt="Preview" />`;
    }
    return `
      <div class="flex items-center gap-3 rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-900/60 p-3 shadow-sm" draggable="${canReorderFiles}" data-index="${index}">
        ${previewHtml}
        <div class="min-w-0 flex-1">
          <p class="truncate text-sm font-semibold text-slate-800 dark:text-slate-200">${escapeHtml(file.name)}</p>
          <p class="text-xs text-slate-500 dark:text-slate-400">${formatBytes(file.size)}${canReorderFiles ? ' - drag to reorder' : ''}</p>
        </div>
        <button class="rounded-full px-3 py-1 text-sm font-medium text-slate-500 dark:text-slate-400 transition hover:bg-slate-100 dark:hover:bg-slate-800" type="button" data-remove-index="${index}">Remove</button>
      </div>
    `;
  }).join('');

  if (state.currentTool.id === 'exif-utility') {
    const exifArea = document.getElementById('exifPreviewArea');
    if (state.files.length > 0) {
      exifArea?.classList.remove('hidden');
      initExifUtility(state.files[0]);
    } else {
      exifArea?.classList.add('hidden');
    }
    setBusy(false, 'Remove EXIF Metadata');
    convertButton.classList.remove('hidden');
  } else if (state.currentTool.id === 'color-palette') {
    const pickerArea = document.getElementById('interactiveColorPickerArea');
    if (state.files.length > 0) {
      pickerArea?.classList.remove('hidden');
      initInteractiveColorPicker(state.files[0]);
    } else {
      pickerArea?.classList.add('hidden');
    }
    convertButton.classList.add('hidden');
    setupEyedropperWidget();
  } else {
    convertButton.classList.remove('hidden');
  }
}

function setStatus(message, tone = 'neutral') {
  statusText.textContent = message;
  statusText.className = `min-h-6 text-sm ${tone === 'error' ? 'text-red-600' : tone === 'success' ? 'text-emerald-700' : 'text-slate-600'}`;
}

function setBusy(isBusy, label = 'Convert') {
  let hasContent = state.files.length > 0;
  if (state.currentTool) {
    if (state.currentTool.id === 'json-convert' && document.getElementById('jsonPasteArea')?.value?.trim().length > 0) hasContent = true;
    if (state.currentTool.id === 'base64-to-image' && document.getElementById('b64ImgInputText')?.value?.trim().length > 0) hasContent = true;
    if (state.currentTool.id === 'svg-to-image' && document.getElementById('svgImgTextInput')?.value?.trim().length > 0) hasContent = true;
    if (state.currentTool.id === 'image-to-base64' && state.files.length > 0) hasContent = true;
  }
  convertButton.disabled = isBusy || !hasContent;
  convertButton.innerHTML = isBusy
    ? '<span class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/50 border-t-white"></span>Working'
    : label;
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }[char]));
}

function showNotification(message) {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'fixed bottom-5 right-5 z-[9999] flex flex-col gap-2.5 pointer-events-none';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'flex items-center gap-2 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/90 dark:bg-emerald-950/80 px-4 py-2.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300 shadow-lg backdrop-blur-md transition-all duration-300 translate-y-2 opacity-0';
  toast.innerHTML = '<svg class="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg><span>' + message + '</span>';

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.remove('translate-y-2', 'opacity-0');
  }, 10);

  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-[-8px]');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 2500);
}

function readAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

async function convertImagesToPdf() {
  if (!jsPDF) throw new Error('jsPDF did not load.');
  const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });

  for (let index = 0; index < state.files.length; index += 1) {
    setStatus(`Processing image ${index + 1} of ${state.files.length}...`);
    if (index > 0) doc.addPage();
    const dataUrl = await readAsDataUrl(state.files[index]);
    const image = await loadImage(dataUrl);
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 36;
    const maxWidth = pageWidth - margin * 2;
    const maxHeight = pageHeight - margin * 2;
    const ratio = Math.min(maxWidth / image.width, maxHeight / image.height);
    const width = image.width * ratio;
    const height = image.height * ratio;
    const x = (pageWidth - width) / 2;
    const y = (pageHeight - height) / 2;
    const type = state.files[index].type === 'image/png' ? 'PNG' : 'JPEG';
    doc.addImage(dataUrl, type, x, y, width, height);
  }

  setStatus('Saving PDF document...');
  const pdfBlob = doc.output('blob');
  downloadBlob(pdfBlob, 'images.pdf');
}

async function convertPdfToImagesZip(format = 'png') {
  if (!window.pdfjsLib) throw new Error('pdf.js did not load.');
  if (!window.JSZip) throw new Error('JSZip did not load.');

  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
  const buffer = await state.files[0].arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
  const zip = new JSZip();
  const mimeType = format === 'jpg' ? 'image/jpeg' : 'image/png';
  const extension = format === 'jpg' ? 'jpg' : 'png';

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    setStatus(`Rendering page ${pageNumber} of ${pdf.numPages}...`);
    const page = await pdf.getPage(pageNumber);
    const viewport = page.getViewport({ scale: 2 });
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    await page.render({ canvasContext: context, viewport }).promise;
    const dataUrl = canvas.toDataURL(mimeType, 0.92);
    zip.file(`page-${pageNumber}.${extension}`, dataUrl.split(',')[1], { base64: true });
  }

  setStatus('Preparing ZIP download...');
  const blob = await zip.generateAsync({ type: 'blob' }, (metadata) => {
    setStatus(`Zipping progress: ${metadata.percent.toFixed(0)}%`);
  });
  downloadBlob(blob, `pdf-pages-${extension}.zip`);
}

function ensurePdfLib() {
  if (!PDFDocument) throw new Error('pdf-lib did not load.');
}

async function loadPdfDocument(file) {
  ensurePdfLib();
  return PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
}

async function downloadPdfDocument(pdfDoc, fileName) {
  const bytes = await pdfDoc.save();
  downloadBlob(new Blob([bytes], { type: 'application/pdf' }), fileName);
}

function parsePageNumbers(input, totalPages, options = {}) {
  const value = String(input || '').trim();
  if (!value) {
    if (options.allowBlank) return Array.from({ length: totalPages }, (_, index) => index);
    throw new Error('Enter at least one page number.');
  }

  const pages = [];
  value.split(',').forEach(part => {
    const token = part.trim();
    if (!token) return;
    if (token.includes('-')) {
      const [startRaw, endRaw] = token.split('-');
      const start = Number(startRaw);
      const end = Number(endRaw);
      if (!Number.isInteger(start) || !Number.isInteger(end) || start < 1 || end < start || end > totalPages) {
        throw new Error(`Invalid page range: ${token}`);
      }
      for (let page = start; page <= end; page += 1) pages.push(page - 1);
    } else {
      const page = Number(token);
      if (!Number.isInteger(page) || page < 1 || page > totalPages) throw new Error(`Invalid page number: ${token}`);
      pages.push(page - 1);
    }
  });

  if (!pages.length) throw new Error('Enter at least one valid page.');
  return options.unique ? [...new Set(pages)] : pages;
}

let currentExifTags = null;
function initExifUtility(file) {
  const tableBody = document.getElementById('exifMetadataTableBody');
  if (!tableBody) return;
  tableBody.innerHTML = '<tr><td class="py-2" colspan="2">Reading EXIF metadata...</td></tr>';

  EXIF.getData(file, function() {
    const allMetaData = EXIF.getAllTags(this);
    currentExifTags = allMetaData;
    if (!allMetaData || Object.keys(allMetaData).length === 0) {
      tableBody.innerHTML = '<tr><td class="py-2" colspan="2">No EXIF metadata found in this image.</td></tr>';
      return;
    }

    let html = '';
    const fields = {
      'Make': 'Camera Maker',
      'Model': 'Camera Model',
      'DateTime': 'Date Captured',
      'ExposureTime': 'Shutter Speed',
      'FNumber': 'F-Number (Aperture)',
      'ISOSpeedRatings': 'ISO Rating',
      'GPSLatitude': 'Latitude Coordinates',
      'GPSLongitude': 'Longitude Coordinates',
      'Software': 'Editing Software'
    };

    Object.keys(fields).forEach(key => {
      if (allMetaData[key] !== undefined) {
        let val = allMetaData[key];
        if (key === 'GPSLatitude' || key === 'GPSLongitude') {
          const refKey = key + 'Ref';
          const ref = allMetaData[refKey] || '';
          if (Array.isArray(val) && val.length === 3) {
            const deg = val[0].numerator / val[0].denominator;
            const min = val[1].numerator / val[1].denominator;
            const sec = val[2].numerator / val[2].denominator;
            val = `${deg}° ${min}' ${sec}" ${ref}`;
          }
        }
        html += `
          <tr class="border-b border-slate-100 dark:border-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800/10">
            <td class="py-2 font-bold text-slate-500 dark:text-slate-400 pr-4">${fields[key]}</td>
            <td class="py-2 text-slate-800 dark:text-slate-200 select-all">${val}</td>
          </tr>
        `;
      }
    });

    if (!html) {
      html = '<tr><td class="py-2" colspan="2">No key EXIF privacy metadata identified. (Image is clean)</td></tr>';
    }
    tableBody.innerHTML = html;
  });
}

async function removeExif() {
  if (!state.files.length) return;
  setStatus('Removing EXIF data...');
  const file = state.files[0];
  const dataUrl = await readAsDataUrl(file);
  const img = await loadImage(dataUrl);

  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);

  setStatus('Saving clean image...');
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Failed to generate canvas blob.'));
        return;
      }
      const cleanName = 'clean-' + file.name;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = cleanName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      resolve();
    }, file.type || 'image/jpeg');
  });
}

async function heicToJpgPng() {
  if (typeof heic2any === 'undefined') throw new Error('heic2any library did not load.');
  if (!state.files.length) return;
  const formatSelect = document.getElementById('heicOutputFormat');
  const qualitySlider = document.getElementById('heicQualitySlider');
  const targetType = formatSelect?.value || 'image/jpeg';
  const quality = parseInt(qualitySlider?.value || '90', 10) / 100;

  const zip = new JSZip();
  const outputFiles = [];

  for (let i = 0; i < state.files.length; i++) {
    setStatus(`Converting HEIC file ${i + 1} of ${state.files.length}...`);
    const file = state.files[i];

    const conversionResult = await heic2any({
      blob: file,
      toType: targetType,
      quality: quality
    });

    const blob = Array.isArray(conversionResult) ? conversionResult[0] : conversionResult;
    const newExt = targetType === 'image/png' ? '.png' : '.jpg';
    const newName = file.name.replace(/\.heic$/i, '') + newExt;

    outputFiles.push({ blob, name: newName });
  }

  if (outputFiles.length === 1) {
    setStatus('Downloading converted image...');
    const url = URL.createObjectURL(outputFiles[0].blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = outputFiles[0].name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } else {
    setStatus('Creating ZIP archive...');
    outputFiles.forEach(item => {
      zip.file(item.name, item.blob);
    });
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'converted-images.zip';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

async function mergePdfs() {
  ensurePdfLib();
  if (state.files.length < 2) throw new Error('Add at least two PDFs to merge.');
  const output = await PDFDocument.create();

  for (let index = 0; index < state.files.length; index += 1) {
    setStatus(`Adding ${state.files[index].name}...`);
    const source = await loadPdfDocument(state.files[index]);
    const copiedPages = await output.copyPages(source, source.getPageIndices());
    copiedPages.forEach(page => output.addPage(page));
  }

  await downloadPdfDocument(output, 'merged.pdf');
}

async function splitPdf() {
  ensurePdfLib();
  if (!window.JSZip) throw new Error('JSZip did not load.');
  const source = await loadPdfDocument(state.files[0]);
  const zip = new JSZip();

  for (let index = 0; index < source.getPageCount(); index += 1) {
    setStatus(`Creating page ${index + 1} of ${source.getPageCount()}...`);
    const output = await PDFDocument.create();
    const [page] = await output.copyPages(source, [index]);
    output.addPage(page);
    zip.file(`page-${index + 1}.pdf`, await output.save());
  }

  const blob = await zip.generateAsync({ type: 'blob' });
  downloadBlob(blob, 'split-pages.zip');
}

async function copySelectedPages(mode) {
  const source = await loadPdfDocument(state.files[0]);
  const totalPages = source.getPageCount();
  const selectedPages = parsePageNumbers(document.getElementById('pageRangeInput')?.value, totalPages, { unique: mode !== 'organize' });
  const output = await PDFDocument.create();
  let pageIndices = selectedPages;

  if (mode === 'remove') {
    const removeSet = new Set(selectedPages);
    pageIndices = source.getPageIndices().filter(index => !removeSet.has(index));
    if (!pageIndices.length) throw new Error('You cannot remove every page.');
  }

  const copiedPages = await output.copyPages(source, pageIndices);
  copiedPages.forEach(page => output.addPage(page));
  const fileName = mode === 'remove' ? 'removed-pages.pdf' : mode === 'organize' ? 'organized.pdf' : 'extracted-pages.pdf';
  await downloadPdfDocument(output, fileName);
}

async function rotatePdf() {
  const pdfDoc = await loadPdfDocument(state.files[0]);
  const rotation = Number(document.getElementById('rotationSelect')?.value || 90);
  const pagesToRotate = parsePageNumbers(document.getElementById('pageRangeInput')?.value, pdfDoc.getPageCount(), { allowBlank: true, unique: true });
  pagesToRotate.forEach(index => {
    const page = pdfDoc.getPage(index);
    const currentAngle = page.getRotation().angle || 0;
    page.setRotation(degrees((currentAngle + rotation) % 360));
  });
  await downloadPdfDocument(pdfDoc, 'rotated.pdf');
}

async function watermarkPdf() {
  const pdfDoc = await loadPdfDocument(state.files[0]);
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const text = document.getElementById('watermarkText')?.value?.trim() || 'DRAFT';
  const opacity = Number(document.getElementById('watermarkOpacity')?.value || 0.25);

  const colorHex = document.getElementById('watermarkColor')?.value || '#ff0000';
  const cleanHex = colorHex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;
  const pdfColor = rgb(r, g, b);

  pdfDoc.getPages().forEach(page => {
    const { width, height } = page.getSize();
    page.drawText(text, {
      x: width * 0.18,
      y: height * 0.48,
      size: Math.min(width, height) / 8,
      font,
      color: pdfColor,
      opacity,
      rotate: degrees(-35)
    });
  });

  await downloadPdfDocument(pdfDoc, 'watermarked.pdf');
}

async function addPageNumbers() {
  const pdfDoc = await loadPdfDocument(state.files[0]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const pages = pdfDoc.getPages();
  const style = document.getElementById('numberStyle')?.value || 'simple';

  pages.forEach((page, index) => {
    const { width } = page.getSize();
    const label = style === 'total' ? `Page ${index + 1} of ${pages.length}` : String(index + 1);
    const textWidth = font.widthOfTextAtSize(label, 10);
    page.drawText(label, {
      x: (width - textWidth) / 2,
      y: 24,
      size: 10,
      font,
      color: rgb(0.25, 0.28, 0.33)
    });
  });

  await downloadPdfDocument(pdfDoc, 'page-numbers.pdf');
}

async function signPdf() {
  const pdfDoc = await loadPdfDocument(state.files[0]);
  const pageNumber = Number(document.getElementById('signaturePage')?.value || 1);
  if (!Number.isInteger(pageNumber) || pageNumber < 1 || pageNumber > pdfDoc.getPageCount()) throw new Error('Enter a valid page number.');
  const page = pdfDoc.getPage(pageNumber - 1);
  const { width } = page.getSize();

  if (state.signatureMethod === 'draw') {
    const canvas = document.getElementById('signatureCanvas');
    if (!canvas || state.isCanvasEmpty) throw new Error('Please draw your signature on the canvas first.');

    // Export canvas as base64 PNG byte stream
    const dataUrl = canvas.toDataURL('image/png');
    const base64Data = dataUrl.split(',')[1];
    const bytes = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));

    const embeddedImage = await pdfDoc.embedPng(bytes);
    const position = document.getElementById('signaturePosition')?.value || 'lower-right';
    const sizeOption = document.getElementById('signatureSize')?.value || 'medium';

    let sigWidth = 150;
    let sigHeight = 48;
    if (sizeOption === 'small') { sigWidth = 110; sigHeight = 35; }
    if (sizeOption === 'large') { sigWidth = 200; sigHeight = 64; }

    const pageHeight = page.getHeight();
    let posX = Math.max(36, width - sigWidth - 36);
    let posY = 50;

    if (position === 'lower-left') posX = 36;
    if (position === 'lower-center') posX = Math.max(36, (width - sigWidth) / 2);
    if (position === 'upper-right') { posX = Math.max(36, width - sigWidth - 36); posY = Math.max(36, pageHeight - sigHeight - 45); }
    if (position === 'upper-left') { posX = 36; posY = Math.max(36, pageHeight - sigHeight - 45); }

    page.drawImage(embeddedImage, {
      x: posX,
      y: posY,
      width: sigWidth,
      height: sigHeight
    });

    page.drawLine({
      start: { x: Math.max(20, posX - 5), y: posY - 4 },
      end: { x: Math.min(width - 20, posX + sigWidth + 5), y: posY - 4 },
      thickness: 1,
      color: rgb(0.16, 0.1, 0.42)
    });
  } else {
    const signatureText = document.getElementById('signatureText')?.value?.trim();
    if (!signatureText) throw new Error('Please enter signature text.');

    const fontFamily = state.signatureFontFamily || "Dancing Script, cursive";
    const fontName = fontFamily.split(',')[0].replace(/['"]/g, '').trim();
    const inkColor = state.signatureColor || '#0f172a';

    if (document.fonts) {
      try {
        await document.fonts.load(`64px "${fontName}"`);
        await document.fonts.ready;
      } catch (e) {
        console.warn('Signature font load notice:', e);
      }
    }

    const typeCanvas = document.createElement('canvas');
    typeCanvas.width = 900;
    typeCanvas.height = 220;
    const typeCtx = typeCanvas.getContext('2d');

    typeCtx.clearRect(0, 0, typeCanvas.width, typeCanvas.height);
    typeCtx.font = `600 64px ${fontFamily}`;
    typeCtx.fillStyle = inkColor;
    typeCtx.textBaseline = 'middle';

    const textWidth = typeCtx.measureText(signatureText).width;
    typeCtx.fillText(signatureText, 30, 95);

    typeCtx.strokeStyle = inkColor;
    typeCtx.lineWidth = 3;
    typeCtx.beginPath();
    typeCtx.moveTo(25, 145);
    typeCtx.lineTo(Math.max(220, textWidth + 35), 145);
    typeCtx.stroke();

    const dataUrl = typeCanvas.toDataURL('image/png');
    const base64Data = dataUrl.split(',')[1];
    const bytes = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));

    const embeddedImage = await pdfDoc.embedPng(bytes);

    const position = document.getElementById('signaturePosition')?.value || 'lower-right';
    const sizeOption = document.getElementById('signatureSize')?.value || 'medium';

    let sigWidth = 190;
    let sigHeight = 48;
    if (sizeOption === 'small') { sigWidth = 140; sigHeight = 35; }
    if (sizeOption === 'large') { sigWidth = 250; sigHeight = 62; }

    const pageHeight = page.getHeight();
    let posX = Math.max(36, width - sigWidth - 36);
    let posY = 45;

    if (position === 'lower-left') posX = 36;
    if (position === 'lower-center') posX = Math.max(36, (width - sigWidth) / 2);
    if (position === 'upper-right') { posX = Math.max(36, width - sigWidth - 36); posY = Math.max(36, pageHeight - sigHeight - 45); }
    if (position === 'upper-left') { posX = 36; posY = Math.max(36, pageHeight - sigHeight - 45); }

    page.drawImage(embeddedImage, {
      x: posX,
      y: posY,
      width: sigWidth,
      height: sigHeight
    });
  }

  await downloadPdfDocument(pdfDoc, 'signed.pdf');
}

async function convertCsv() {
  if (!window.Papa) throw new Error('PapaParse did not load.');
  const outputType = document.querySelector('input[name="csvOutput"]:checked').value;
  const csvText = await state.files[0].text();
  const parsed = Papa.parse(csvText, { header: true, skipEmptyLines: true });
  if (parsed.errors.length) {
    throw new Error(parsed.errors[0].message || 'CSV parsing failed.');
  }

  if (outputType === 'json') {
    const blob = new Blob([JSON.stringify(parsed.data, null, 2)], { type: 'application/json' });
    downloadBlob(blob, state.files[0].name.replace(/\.csv$/i, '.json'));
    return;
  }

  if (!window.XLSX) throw new Error('SheetJS did not load.');
  const worksheet = XLSX.utils.json_to_sheet(parsed.data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
  XLSX.writeFile(workbook, state.files[0].name.replace(/\.csv$/i, '.xlsx'));
}



async function encryptPdf() {
  ensurePdfLib();
  const password = document.getElementById('pdfPasswordInput')?.value;
  if (!password) throw new Error('Please enter a password to lock the PDF.');

  setStatus('Encrypting PDF document...');
  const pdfDoc = await loadPdfDocument(state.files[0]);
  pdfDoc.encrypt({
    userPassword: password,
    ownerPassword: password,
    permissions: {
      printing: 'highResolution',
      modifying: false,
      copying: false
    }
  });
  await downloadPdfDocument(pdfDoc, 'protected.pdf');
}

async function decryptPdf() {
  ensurePdfLib();
  const password = document.getElementById('pdfPasswordInput')?.value;
  if (!password) throw new Error('Please enter the password to unlock this PDF.');

  setStatus('Decrypting PDF document...');
  try {
    const pdfDoc = await PDFDocument.load(await state.files[0].arrayBuffer(), {
      password: password,
      ignoreEncryption: false
    });
    await downloadPdfDocument(pdfDoc, 'unlocked.pdf');
  } catch (error) {
    console.warn('pdf-lib load failed, attempting high-fidelity client-side rendering fallback...', error);
    try {
      await decryptPdfViaRendering(password);
    } catch (fallbackError) {
      console.error('Fallback decryption also failed:', fallbackError);
      throw new Error('Incorrect password or failed to decrypt PDF.');
    }
  }
}

async function decryptPdfViaRendering(password) {
  if (!window.pdfjsLib) throw new Error('pdf.js did not load.');
  if (!jsPDF) throw new Error('jsPDF did not load.');

  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
  const buffer = await state.files[0].arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buffer, password: password }).promise;
  const pageCount = pdf.numPages;

  const firstPage = await pdf.getPage(1);
  const firstViewport = firstPage.getViewport({ scale: 1.0 });

  const doc = new jsPDF({
    orientation: firstViewport.width > firstViewport.height ? 'landscape' : 'portrait',
    unit: 'pt',
    format: [firstViewport.width, firstViewport.height]
  });

  for (let i = 1; i <= pageCount; i++) {
    setStatus(`Unlocking page ${i} of ${pageCount}...`);
    const page = await pdf.getPage(i);
    const pageViewport = page.getViewport({ scale: 1.0 });
    const renderViewport = page.getViewport({ scale: 2.0 }); // 2x resolution

    const canvas = document.createElement('canvas');
    canvas.width = renderViewport.width;
    canvas.height = renderViewport.height;
    const ctx = canvas.getContext('2d');

    await page.render({ canvasContext: ctx, viewport: renderViewport }).promise;

    if (i > 1) {
      doc.addPage([pageViewport.width, pageViewport.height], pageViewport.width > pageViewport.height ? 'l' : 'p');
    }

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    doc.addImage(imgData, 'JPEG', 0, 0, pageViewport.width, pageViewport.height);
  }

  setStatus('Saving unlocked PDF...');
  const pdfBlob = doc.output('blob');
  downloadBlob(pdfBlob, 'unlocked.pdf');
}

async function compressPdf() {
  if (!window.pdfjsLib) throw new Error('pdf.js did not load.');
  if (!jsPDF) throw new Error('jsPDF did not load.');

  const level = document.getElementById('compressLevelSelect')?.value || 'medium';
  let scale = 1.5;
  let quality = 0.8;

  if (level === 'low') {
    scale = 1.8;
    quality = 0.9;
  } else if (level === 'high') {
    scale = 1.0;
    quality = 0.6;
  }

  setStatus('Initializing compression engine...');
  const buffer = await state.files[0].arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
  const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    setStatus(`Compressing page ${pageNumber} of ${pdf.numPages}...`);
    if (pageNumber > 1) doc.addPage();

    const page = await pdf.getPage(pageNumber);
    const viewport = page.getViewport({ scale: scale });
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({ canvasContext: context, viewport }).promise;
    const dataUrl = canvas.toDataURL('image/jpeg', quality);

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.addImage(dataUrl, 'JPEG', 0, 0, pageWidth, pageHeight);
  }

  setStatus('Saving compressed PDF...');
  const pdfBlob = doc.output('blob');
  downloadBlob(pdfBlob, 'compressed.pdf');
}

async function scaleImage() {
  const file = state.files[0];
  const img = new Image();
  img.src = URL.createObjectURL(file);
  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
  });

  const factor = state.scaleFactor || 2;
  const method = document.getElementById('scaleMethod')?.value || 'lanczos';
  const format = document.getElementById('scaleFormat')?.value || 'image/png';

  const sw = img.width;
  const sh = img.height;
  const dw = Math.round(sw * factor);
  const dh = Math.round(sh * factor);

  setStatus(`Scaling image from ${sw}x${sh} to ${dw}x${dh} using ${method}...`);

  const dstCanvas = document.createElement('canvas');
  dstCanvas.width = dw;
  dstCanvas.height = dh;
  const dstCtx = dstCanvas.getContext('2d');

  if (method === 'nearest') {
    dstCtx.imageSmoothingEnabled = false;
    dstCtx.drawImage(img, 0, 0, dw, dh);
  } else if (method === 'bilinear') {
    dstCtx.imageSmoothingEnabled = true;
    dstCtx.imageSmoothingQuality = 'high';
    dstCtx.drawImage(img, 0, 0, dw, dh);
  } else {
    // Lanczos-3 implementation
    const srcCanvas = document.createElement('canvas');
    srcCanvas.width = sw;
    srcCanvas.height = sh;
    const srcCtx = srcCanvas.getContext('2d');
    srcCtx.drawImage(img, 0, 0);
    const srcData = srcCtx.getImageData(0, 0, sw, sh);
    const srcBytes = srcData.data;

    const dstData = dstCtx.createImageData(dw, dh);
    const dstBytes = dstData.data;

    const scaleX = sw / dw;
    const scaleY = sh / dh;

    function lanczosKernel(x) {
      if (x === 0) return 1;
      if (x < -3 || x > 3) return 0;
      const piX = Math.PI * x;
      return (3 * Math.sin(piX) * Math.sin(piX / 3)) / (piX * piX);
    }

    for (let y = 0; y < dh; y++) {
      if (y % 40 === 0) {
        setStatus(`Processing row ${y} of ${dh} (Lanczos)...`);
        await new Promise(resolve => setTimeout(resolve, 0));
      }
      const sy = y * scaleY;
      const yMin = Math.max(0, Math.floor(sy - 3));
      const yMax = Math.min(sh - 1, Math.ceil(sy + 3));

      for (let x = 0; x < dw; x++) {
        const sx = x * scaleX;
        const xMin = Math.max(0, Math.floor(sx - 3));
        const xMax = Math.min(sw - 1, Math.ceil(sx + 3));

        let r = 0, g = 0, b = 0, a = 0;
        let totalWeight = 0;

        for (let srcY = yMin; srcY <= yMax; srcY++) {
          const dyWeight = lanczosKernel(sy - srcY);
          if (dyWeight === 0) continue;

          for (let srcX = xMin; srcX <= xMax; srcX++) {
            const dxWeight = lanczosKernel(sx - srcX);
            const weight = dxWeight * dyWeight;
            if (weight <= 0) continue;

            const srcOffset = (srcY * sw + srcX) * 4;
            r += srcBytes[srcOffset] * weight;
            g += srcBytes[srcOffset + 1] * weight;
            b += srcBytes[srcOffset + 2] * weight;
            a += srcBytes[srcOffset + 3] * weight;
            totalWeight += weight;
          }
        }

        const dstOffset = (y * dw + x) * 4;
        if (totalWeight > 0) {
          dstBytes[dstOffset] = Math.min(255, Math.max(0, r / totalWeight));
          dstBytes[dstOffset + 1] = Math.min(255, Math.max(0, g / totalWeight));
          dstBytes[dstOffset + 2] = Math.min(255, Math.max(0, b / totalWeight));
          dstBytes[dstOffset + 3] = Math.min(255, Math.max(0, a / totalWeight));
        } else {
          const srcOffset = (Math.round(sy) * sw + Math.round(sx)) * 4;
          dstBytes[dstOffset] = srcBytes[srcOffset];
          dstBytes[dstOffset + 1] = srcBytes[srcOffset + 1];
          dstBytes[dstOffset + 2] = srcBytes[srcOffset + 2];
          dstBytes[dstOffset + 3] = srcBytes[srcOffset + 3];
        }
      }
    }
    dstCtx.putImageData(dstData, 0, 0);
  }

  const ext = format === 'image/png' ? 'png' : 'jpg';
  dstCanvas.toBlob((blob) => {
    downloadBlob(blob, `scaled-${factor}x.${ext}`);
    setStatus('Image scaled successfully.', 'success');
  }, format, 0.95);
}

async function convertImagesToWebp() {
  if (!window.JSZip) throw new Error('JSZip did not load.');
  const quality = parseFloat(document.getElementById('webpQualitySlider')?.value || '80') / 100;
  const lossless = document.getElementById('webpLosslessSelect')?.value === 'true';

  const zip = new JSZip();
  let count = 0;

  for (let i = 0; i < state.files.length; i++) {
    const file = state.files[i];
    setStatus(`Converting image ${i + 1} of ${state.files.length} to WebP...`);
    const img = new Image();
    img.src = URL.createObjectURL(file);
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
    });

    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    const blob = await new Promise(resolve => {
      canvas.toBlob(resolve, 'image/webp', lossless ? 1.0 : quality);
    });

    const originalName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
    if (state.files.length === 1) {
      downloadBlob(blob, `${originalName}.webp`);
      setStatus('Image converted successfully.', 'success');
      return;
    } else {
      zip.file(`${originalName}.webp`, blob);
      count++;
    }
  }

  if (count > 0) {
    setStatus('Zipping WebP files...');
    const content = await zip.generateAsync({ type: 'blob' });
    downloadBlob(content, 'converted_webp.zip');
    setStatus('All images converted to WebP successfully.', 'success');
  }
}

async function bulkResizeImages() {
  if (!window.JSZip) throw new Error('JSZip did not load.');
  const mode = document.getElementById('resizeModeSelect').value;
  const maintainAspect = document.getElementById('resizeAspectRatioCheck').checked;

  let scale = 1;
  let targetDim = 0;
  if (mode === 'scale') {
    scale = parseFloat(document.getElementById('resizeScaleSlider').value) / 100;
  } else {
    targetDim = parseInt(document.getElementById('resizeDimensionInput').value);
    if (isNaN(targetDim) || targetDim <= 0) throw new Error('Please enter a valid target dimension.');
  }

  const zip = new JSZip();

  for (let i = 0; i < state.files.length; i++) {
    const file = state.files[i];
    setStatus(`Resizing image ${i + 1} of ${state.files.length}...`);
    const img = new Image();
    img.src = URL.createObjectURL(file);
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
    });

    let dw, dh;
    if (mode === 'scale') {
      dw = Math.round(img.width * scale);
      dh = Math.round(img.height * scale);
    } else if (mode === 'width') {
      dw = targetDim;
      dh = maintainAspect ? Math.round(img.height * (dw / img.width)) : img.height;
    } else {
      dh = targetDim;
      dw = maintainAspect ? Math.round(img.width * (dh / img.height)) : img.width;
    }

    const canvas = document.createElement('canvas');
    canvas.width = dw;
    canvas.height = dh;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, dw, dh);

    const blob = await new Promise(resolve => {
      canvas.toBlob(resolve, file.type || 'image/jpeg', 0.85);
    });

    zip.file(file.name, blob);
  }

  setStatus('Compiling ZIP package...');
  const content = await zip.generateAsync({ type: 'blob' });
  downloadBlob(content, 'resized_images.zip');
  setStatus('All images resized successfully.', 'success');
}

// Dynamic Color Picker Logic
function initInteractiveColorPicker(file) {
  const imgPreview = document.getElementById('colorPickerImage');
  if (!imgPreview) return;

  const imgUrl = URL.createObjectURL(file);
  imgPreview.src = imgUrl;

  const pickCanvas = document.createElement('canvas');
  const pickCtx = pickCanvas.getContext('2d');

  imgPreview.onload = () => {
    pickCanvas.width = imgPreview.naturalWidth;
    pickCanvas.height = imgPreview.naturalHeight;
    pickCtx.drawImage(imgPreview, 0, 0);
  };

  imgPreview.onclick = (event) => {
    const rect = imgPreview.getBoundingClientRect();
    const x = Math.floor(((event.clientX - rect.left) / rect.width) * imgPreview.naturalWidth);
    const y = Math.floor(((event.clientY - rect.top) / rect.height) * imgPreview.naturalHeight);

    try {
      const pixel = pickCtx.getImageData(x, y, 1, 1).data;
      const r = pixel[0];
      const g = pixel[1];
      const b = pixel[2];
      const hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();

      updatePickedColor(hex, `rgb(${r}, ${g}, ${b})`);
      showNotification('Picked color: ' + hex);
    } catch (e) {
      console.error('Error picking pixel color:', e);
    }
  };

  setupEyedropperWidget();
}

function setupEyedropperWidget() {
  const eyedropperRow = document.getElementById('eyedropperRowWidget');
  const eyedropperBtn = document.getElementById('eyedropperBtn');
  if (!eyedropperRow || !eyedropperBtn) return;

  const eyedropperTitle = eyedropperRow.querySelector('h4');
  const eyedropperDesc = eyedropperRow.querySelector('p');

  if (window.EyeDropper) {
    if (eyedropperTitle) eyedropperTitle.textContent = "System Screen Eyedropper";
    if (eyedropperDesc) eyedropperDesc.textContent = "Open the browser's native magnifying lens to pick any pixel color from anywhere on your entire screen.";
    eyedropperBtn.classList.remove('hidden');
    eyedropperBtn.onclick = async () => {
      try {
        const eyeDropper = new EyeDropper();
        const result = await eyeDropper.open();
        const hex = result.sRGBHex.toUpperCase();

        const r = parseInt(hex.substring(1, 3), 16);
        const g = parseInt(hex.substring(3, 5), 16);
        const b = parseInt(hex.substring(5, 7), 16);

        updatePickedColor(hex, `rgb(${r}, ${g}, ${b})`);
      } catch (e) {
        console.log('Eyedropper closed:', e);
      }
    };
  } else {
    if (eyedropperTitle) eyedropperTitle.textContent = "Mobile Color Picker";
    if (eyedropperDesc) eyedropperDesc.textContent = "To pick colors, simply tap directly on any part of the preview image below.";
    eyedropperBtn.classList.add('hidden');
  }
}

function updatePickedColor(hex, rgbStr) {
  const display = document.getElementById('pickedColorDisplay');
  const hexText = document.getElementById('pickedColorHex');
  const rgbText = document.getElementById('pickedColorRgb');
  const copyBtn = document.getElementById('copyPickedColorBtn');

  if (display) display.style.backgroundColor = hex;
  if (hexText) hexText.textContent = hex;
  if (rgbText) rgbText.textContent = rgbStr;
  if (copyBtn) {
    // Reset copy button styling when a new color is picked
    copyBtn.textContent = 'Copy HEX Code';
    copyBtn.className = "mt-3 w-full rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-950/60 py-2.5 text-xs font-bold transition";

    copyBtn.onclick = () => {
      navigator.clipboard.writeText(hex);

      // Visual copy feedback directly inside the button
      copyBtn.textContent = 'Copied!';
      copyBtn.className = "mt-3 w-full rounded-xl bg-emerald-600 text-white py-2.5 text-xs font-bold transition";

      setTimeout(() => {
        copyBtn.textContent = 'Copy HEX Code';
        copyBtn.className = "mt-3 w-full rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-950/60 py-2.5 text-xs font-bold transition";
      }, 1500);
    };
  }
}

// Watermark Color & JSON Paste Area Sync Listener
document.addEventListener('input', (e) => {
  if (e.target && e.target.id === 'watermarkColor') {
    const textSpan = document.getElementById('watermarkColorText');
    if (textSpan) textSpan.textContent = e.target.value.toUpperCase();
  }
  if (e.target && e.target.id === 'jsonPasteArea') {
    updateFileList();
  }
});

async function extractColorPalette() {
  if (!state.files.length) throw new Error('Please upload an image file first.');
  const file = state.files[0];
  const colorCount = parseInt(document.getElementById('paletteColorCountSelect').value || '5');

  const img = new Image();
  img.src = URL.createObjectURL(file);
  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
  });

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = 100;
  canvas.height = 100;
  ctx.drawImage(img, 0, 0, 100, 100);

  const imgData = ctx.getImageData(0, 0, 100, 100);
  const data = imgData.data;

  const colors = [];
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i+1];
    const b = data[i+2];
    const a = data[i+3];
    if (a < 128) continue;
    colors.push([r, g, b]);
  }

  const colorMap = {};
  colors.forEach(rgb => {
    const qr = Math.round(rgb[0] / 16) * 16;
    const qg = Math.round(rgb[1] / 16) * 16;
    const qb = Math.round(rgb[2] / 16) * 16;
    const key = `${qr},${qg},${qb}`;
    if (!colorMap[key]) {
      colorMap[key] = { rgb: rgb, count: 0 };
    }
    colorMap[key].count++;
  });

  const sorted = Object.values(colorMap).sort((a, b) => b.count - a.count);
  const palette = sorted.slice(0, colorCount).map(item => {
    const r = item.rgb[0];
    const g = item.rgb[1];
    const b = item.rgb[2];
    const hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
    return { hex, rgb: `rgb(${r}, ${g}, ${b})` };
  });

  const grid = document.getElementById('paletteColorsGrid');
  grid.innerHTML = palette.map(color => `
    <div class="rounded-xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900 overflow-hidden shadow-sm flex flex-col items-center p-2.5">
      <div class="w-full h-12 rounded-lg" style="background-color: ${color.hex}"></div>
      <span class="text-xs font-bold text-slate-800 dark:text-slate-200 mt-2">${color.hex}</span>
      <span class="text-[10px] text-slate-400 font-mono mt-0.5">${color.rgb}</span>
      <button onclick="navigator.clipboard.writeText('${color.hex}'); showNotification('Copied HEX code!');" type="button" class="mt-2 text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline">Copy</button>
    </div>
  `).join('');

  document.getElementById('paletteColorContainer').classList.remove('hidden');
  setStatus('Dominant colors extracted successfully!', 'success');
}

async function convertJsonToSpreadsheet() {
  let jsonText = document.getElementById('jsonPasteArea').value.trim();
  if (!jsonText && state.files.length) {
    const file = state.files[0];
    jsonText = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  }

  if (!jsonText) throw new Error('Please upload a JSON file or paste JSON text first.');

  let data;
  try {
    data = JSON.parse(jsonText);
  } catch (err) {
    throw new Error('Invalid JSON format: ' + err.message);
  }

  if (!Array.isArray(data)) {
    if (typeof data === 'object') {
      data = [data];
    } else {
      throw new Error('JSON data must be an array of objects.');
    }
  }

  const format = document.getElementById('jsonTargetFormatSelect').value;
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

  if (format === 'xlsx') {
    const xlsxBuf = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([xlsxBuf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    downloadBlob(blob, 'converted_data.xlsx');
  } else {
    const csvStr = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csvStr], { type: 'text/csv;charset=utf-8;' });
    downloadBlob(blob, 'converted_data.csv');
  }
  setStatus('JSON converted successfully.', 'success');
}

async function convertOfficeToPdf() {
  if (!state.files.length) throw new Error('Please select a Word (.docx) or Excel (.xlsx) file.');
  const file = state.files[0];
  const extension = file.name.split('.').pop().toLowerCase();
  const arrayBuffer = await file.arrayBuffer();

  // Spreadsheets render as native vector PDF tables (selectable, crisp) via jsPDF + AutoTable.
  if (extension === 'xlsx' || extension === 'xls') {
    await convertExcelToPdf(file, arrayBuffer);
    return;
  }

  if (extension !== 'docx' && extension !== 'doc') {
    throw new Error('Unsupported format. Only Word (.docx) and Excel (.xlsx) documents are supported.');
  }
  if (!window.html2pdf) throw new Error('html2pdf script not loaded.');
  if (!window.mammoth) throw new Error('mammoth.js script not loaded.');

  const printContainer = document.createElement('div');
  printContainer.className = 'p-8 bg-white text-black font-sans leading-relaxed prose';
  printContainer.style.width = '750px';

  const pageBreakStyle = document.createElement('style');
  pageBreakStyle.textContent = `
    p, tr, th, td, h1, h2, h3, h4, h5, h6, li, blockquote, table, img, div, .prose > * {
      page-break-inside: avoid !important;
      break-inside: avoid !important;
    }
    table {
      width: 100% !important;
      border-collapse: collapse !important;
      table-layout: auto !important;
      font-size: 11px !important;
      margin-top: 14px !important;
      margin-bottom: 20px !important;
    }
    th, td {
      border: 1px solid #cbd5e1 !important;
      padding: 6px 10px !important;
      text-align: left !important;
    }
    th {
      background-color: #f1f5f9 !important;
      font-weight: bold !important;
    }
  `;
  printContainer.appendChild(pageBreakStyle);

  const contentDiv = document.createElement('div');
  setStatus('Parsing DOCX to HTML structure...');
  const result = await mammoth.convertToHtml({ arrayBuffer: arrayBuffer });
  contentDiv.innerHTML = result.value || '<h3>Empty Document</h3>';
  printContainer.appendChild(contentDiv);

  setStatus('Generating PDF layout snapshot...');

  const opt = {
    margin: [25, 25, 25, 25],
    filename: file.name.substring(0, file.name.lastIndexOf('.')) + '.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, letterRendering: true, scrollX: 0, scrollY: 0 },
    jsPDF: { unit: 'pt', format: 'a4', orientation: 'portrait' },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
  };

  const pdfBlob = await html2pdf().set(opt).from(printContainer).output('blob');
  downloadBlob(pdfBlob, opt.filename);
  setStatus('Office document converted successfully.', 'success');
}

async function convertExcelToPdf(file, arrayBuffer) {
  if (!window.XLSX) throw new Error('SheetJS library did not load.');
  // jsPDF must be present before AutoTable loads, because the plugin attaches to it at load time.
  setStatus('Preparing PDF engine...');
  await loadConverterLibrary('jspdf');
  await loadConverterLibrary('jspdfautotable');
  const JsPdf = window.jspdf && window.jspdf.jsPDF;
  if (!JsPdf) throw new Error('jsPDF library did not load.');

  setStatus('Reading spreadsheet data...');
  const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: 'array' });
  const doc = new JsPdf({ orientation: 'landscape', unit: 'pt', format: 'a4' });
  const marginX = 32;
  let renderedSheet = false;

  workbook.SheetNames.forEach(sheetName => {
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, blankrows: false, defval: '' });
    if (!rows.length) return;

    // Normalise ragged rows so every row has the same column count.
    const columnCount = rows.reduce((max, row) => Math.max(max, row.length), 0);
    const normalised = rows.map(row => {
      const cells = row.map(cell => (cell == null ? '' : String(cell)));
      while (cells.length < columnCount) cells.push('');
      return cells;
    });

    if (renderedSheet) doc.addPage();
    renderedSheet = true;

    doc.setFontSize(13);
    doc.text(sheetName, marginX, 40);

    doc.autoTable({
      head: [normalised[0]],
      body: normalised.slice(1),
      startY: 54,
      margin: { left: marginX, right: marginX },
      styles: { fontSize: 9, cellPadding: 4, overflow: 'linebreak' },
      headStyles: { fillColor: [241, 245, 249], textColor: [15, 23, 42], fontStyle: 'bold' },
      theme: 'grid'
    });
  });

  if (!renderedSheet) throw new Error('The workbook has no data to convert.');

  setStatus('Generating PDF...');
  const pdfBlob = doc.output('blob');
  downloadBlob(pdfBlob, file.name.substring(0, file.name.lastIndexOf('.')) + '.pdf');
  setStatus('Spreadsheet converted to PDF successfully.', 'success');
}

async function convertPdfToWord() {
  if (!window.pdfjsLib) throw new Error('pdf.js did not load.');
  const formatSelect = document.getElementById('pdfWordFormatSelect');
  const format = formatSelect && formatSelect.value === 'txt' ? 'txt' : 'docx';
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';

  setStatus('Reading PDF document structure...');
  const buffer = await state.files[0].arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;

  // Reconstruct each page into paragraphs (arrays of line strings) once, then
  // render to the chosen output format below.
  const pages = [];
  let foundText = false;

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    setStatus(`Reconstructing text from page ${pageNumber} of ${pdf.numPages}...`);
    const page = await pdf.getPage(pageNumber);
    const textContent = await page.getTextContent();

    // Collect positioned text fragments (x, y baseline, glyph height).
    const fragments = textContent.items
      .filter(item => item.str && item.str.trim())
      .map(item => ({
        x: item.transform[4],
        y: item.transform[5],
        h: item.height || Math.abs(item.transform[3]) || 10,
        str: item.str
      }));

    // Group fragments into visual lines: top-to-bottom, then left-to-right.
    fragments.sort((a, b) => (b.y - a.y) || (a.x - b.x));
    const lines = [];
    fragments.forEach(frag => {
      const last = lines[lines.length - 1];
      if (last && Math.abs(last.y - frag.y) <= Math.max(2, frag.h * 0.5)) {
        last.items.push(frag);
        last.h = Math.max(last.h, frag.h);
      } else {
        lines.push({ y: frag.y, h: frag.h, items: [frag] });
      }
    });
    lines.forEach(line => {
      line.items.sort((a, b) => a.x - b.x);
      line.text = line.items.map(i => i.str).join(' ').replace(/\s{2,}/g, ' ').trim();
    });

    const pageLines = lines.filter(line => line.text);
    if (pageLines.length) foundText = true;

    // Group consecutive lines into paragraphs, breaking on larger vertical gaps.
    const paragraphs = [];
    let paragraph = [];
    const flushParagraph = () => {
      if (paragraph.length) paragraphs.push(paragraph);
      paragraph = [];
    };
    for (let i = 0; i < pageLines.length; i += 1) {
      paragraph.push(pageLines[i].text);
      const current = pageLines[i];
      const next = pageLines[i + 1];
      if (next) {
        const gap = current.y - next.y;
        const lineHeight = Math.max(current.h, next.h);
        if (gap > lineHeight * 1.6) flushParagraph();
      }
    }
    flushParagraph();
    pages.push(paragraphs);
  }

  if (!foundText) {
    throw new Error('No selectable text layer was found. This PDF looks like a scanned image, which this tool cannot convert to editable text.');
  }

  const baseName = state.files[0].name.replace(/\.pdf$/i, '');
  const multiPage = pdf.numPages > 1;

  if (format === 'txt') {
    setStatus('Building text file...');
    const parts = [];
    pages.forEach((paragraphs, index) => {
      if (multiPage) parts.push(`--- Page ${index + 1} ---`);
      paragraphs.forEach(par => parts.push(par.join('\n')));
    });
    const blob = new Blob([parts.join('\n\n')], { type: 'text/plain;charset=utf-8' });
    downloadBlob(blob, `${baseName}.txt`);
    setStatus('PDF text extracted to a .txt file.', 'success');
    return;
  }

  await loadConverterLibrary('docx');
  if (!window.docx || !window.docx.Packer) throw new Error('docx library did not load.');
  const { Document, Packer, Paragraph, TextRun } = window.docx;

  setStatus('Building Word document...');
  const children = [];
  pages.forEach((paragraphs, index) => {
    // Start pages after the first on a fresh page in the Word document.
    if (index > 0 && paragraphs.length) children.push(new Paragraph({ pageBreakBefore: true }));
    paragraphs.forEach(par => {
      const runs = [];
      par.forEach((line, lineIndex) => {
        if (lineIndex > 0) runs.push(new TextRun({ text: line, break: 1 }));
        else runs.push(new TextRun(line));
      });
      children.push(new Paragraph({ children: runs, spacing: { after: 160 } }));
    });
  });

  const doc = new Document({ sections: [{ children }] });
  const blob = await Packer.toBlob(doc);
  downloadBlob(blob, `${baseName}.docx`);
  setStatus('PDF converted to an editable Word document.', 'success');
}

async function cropImageAction() {
  if (!state.cropper) throw new Error('Crop selection is not active. Please select an image first.');
  setStatus('Cropping image canvas...');
  const canvas = state.cropper.getCroppedCanvas();
  if (!canvas) throw new Error('Cropped canvas generation failed.');

  const dataUrl = canvas.toDataURL('image/png');
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  const baseName = (state.files[0].name || 'image').replace(/\.[^./\\]+$/, '');
  downloadBlob(blob, `cropped-${baseName}.png`);
}

async function generateFaviconPackageAction() {
  if (!state.files.length) throw new Error('Please select an image file first.');
  if (!window.JSZip) throw new Error('JSZip library did not load.');

  setStatus('Resizing image for favicon sizes...');
  const img = new Image();
  const loadImg = () => new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
    img.src = URL.createObjectURL(state.files[0]);
  });
  await loadImg();

  const sizes = [16, 32, 48, 128];
  const pngArrays = [];
  const zip = new JSZip();

  for (const size of sizes) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, size, size);

    const blob = await new Promise(res => canvas.toBlob(res, 'image/png'));
    const buffer = await blob.arrayBuffer();
    pngArrays.push(new Uint8Array(buffer));

    // Add individual PNG to ZIP
    zip.file(`favicon-${size}x${size}.png`, pngArrays[pngArrays.length - 1]);
  }

  // Generate multi-size ICO binary block
  // Header: 6 bytes
  const header = new Uint8Array(6);
  header[2] = 1; // Type ICO
  header[4] = 3; // 3 sizes in ICO (16, 32, 48)

  const dirEntries = new Uint8Array(16 * 3);
  let currentOffset = 6 + 16 * 3;
  const icoSizes = [16, 32, 48];

  for (let i = 0; i < 3; i++) {
    const size = icoSizes[i];
    const pngSize = pngArrays[i].length;
    const dirOffset = i * 16;

    dirEntries[dirOffset] = size;
    dirEntries[dirOffset + 1] = size;
    dirEntries[dirOffset + 4] = 1; // Planes
    dirEntries[dirOffset + 6] = 32; // BPP

    // Size
    dirEntries[dirOffset + 8] = pngSize & 0xFF;
    dirEntries[dirOffset + 9] = (pngSize >> 8) & 0xFF;
    dirEntries[dirOffset + 10] = (pngSize >> 16) & 0xFF;
    dirEntries[dirOffset + 11] = (pngSize >> 24) & 0xFF;

    // Offset
    dirEntries[dirOffset + 12] = currentOffset & 0xFF;
    dirEntries[dirOffset + 13] = (currentOffset >> 8) & 0xFF;
    dirEntries[dirOffset + 14] = (currentOffset >> 16) & 0xFF;
    dirEntries[dirOffset + 15] = (currentOffset >> 24) & 0xFF;

    currentOffset += pngSize;
  }

  const icoData = new Uint8Array(currentOffset);
  icoData.set(header, 0);
  icoData.set(dirEntries, 6);
  let ptr = 6 + 16 * 3;
  for (let i = 0; i < 3; i++) {
    icoData.set(pngArrays[i], ptr);
    ptr += pngArrays[i].length;
  }

  zip.file('favicon.ico', icoData);

  // Apple touch icon (128x128 or use larger 180x180 canvas)
  const touchCanvas = document.createElement('canvas');
  touchCanvas.width = 180;
  touchCanvas.height = 180;
  const touchCtx = touchCanvas.getContext('2d');
  touchCtx.drawImage(img, 0, 0, 180, 180);
  const touchBlob = await new Promise(res => touchCanvas.toBlob(res, 'image/png'));
  zip.file('apple-touch-icon.png', await touchBlob.arrayBuffer());

  setStatus('Packaging ZIP download...');
  const zipBlob = await zip.generateAsync({ type: 'blob' });
  downloadBlob(zipBlob, 'favicons-package.zip');
}

async function convertExcel() {
  if (!window.XLSX) throw new Error('SheetJS library did not load.');
  const targetFormat = document.getElementById('excelTargetFormatSelect').value;

  setStatus('Reading Excel spreadsheet data...');
  const buffer = await state.files[0].arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'array' });
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];

  if (targetFormat === 'csv') {
    setStatus('Formatting worksheet cells to CSV...');
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    downloadBlob(blob, state.files[0].name.replace(/\.[a-z0-9]+$/i, '') + '.csv');
  } else {
    setStatus('Formatting worksheet cells to JSON payload...');
    const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    const jsonStr = JSON.stringify(json, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
    downloadBlob(blob, state.files[0].name.replace(/\.[a-z0-9]+$/i, '') + '.json');
  }
}

let progressTimer = null;

function startProgressAnimation() {
  const container = document.getElementById('conversionProgressContainer');
  const bar = document.getElementById('progressBarFill');
  const percent = document.getElementById('progressPercentText');
  const label = document.getElementById('progressLabelText');
  if (!container || !bar || !percent) return;

  container.classList.remove('hidden');
  bar.style.width = '0%';
  percent.textContent = '0%';
  if (label) label.textContent = 'Processing file...';

  let current = 0;
  clearInterval(progressTimer);
  progressTimer = setInterval(() => {
    if (current < 90) {
      current += Math.floor(Math.random() * 8) + 4;
      if (current > 90) current = 90;
      bar.style.width = current + '%';
      percent.textContent = current + '%';
    }
  }, 150);
}

function completeProgressAnimation(callback) {
  const container = document.getElementById('conversionProgressContainer');
  const bar = document.getElementById('progressBarFill');
  const percent = document.getElementById('progressPercentText');
  const label = document.getElementById('progressLabelText');

  clearInterval(progressTimer);
  if (bar && percent) {
    bar.style.width = '100%';
    percent.textContent = '100%';
    if (label) label.textContent = 'Finalizing...';
  }

  setTimeout(() => {
    if (container) container.classList.add('hidden');
    if (callback) callback();
  }, 350);
}

function downloadBlob(blob, fileName) {
  state.pendingResult = { blob, fileName };
  completeProgressAnimation(() => {
    showResultPanel(blob, fileName);
  });
}

function executeActualDownload() {
  if (!state.pendingResult) return;
  const { blob, fileName } = state.pendingResult;
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  showNotification('Download started!');
}

function showResultPanel(blob, fileName) {
  const panel = document.getElementById('conversionResultPanel');
  const info = document.getElementById('resultFileInfo');
  if (panel && info) {
    info.textContent = `${fileName} (${formatBytes(blob.size)})`;
    panel.classList.remove('hidden');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    panel.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'nearest' });
  }
  renderRelatedTools();
}

// Related tools for the persistent "Explore related tools" section.
// Same-category siblings first, then top up to six so every tool page
// interconnects with a healthy set of others.
function getRelatedTools(toolId) {
  // Prefer the build-time related list (genuinely relevant: same category, then
  // same hub — no unrelated fill), so the SPA matches the static page. Fall back
  // to same-category siblings only if the runtime catalogue is unavailable.
  const fromCatalogue = window.WCF_CATALOGUE && window.WCF_CATALOGUE.related && window.WCF_CATALOGUE.related[toolId];
  let ids;
  if (fromCatalogue) {
    ids = fromCatalogue.tools;
  } else {
    const category = toolCategories.find((cat) => cat.tools.includes(toolId));
    ids = category ? category.tools.filter((id) => id !== toolId).slice(0, 6) : [];
  }
  return ids.map((id) => tools.find((t) => t.id === id)).filter(Boolean);
}

function renderPersistentRelatedTools() {
  const grid = document.getElementById('relatedToolsGrid');
  if (!grid || !state.currentTool) return;
  const toolId = state.currentTool.id;
  grid.innerHTML = getRelatedTools(toolId)
    .map((t) => `<a class="related-tab" href="/${t.id}"><span class="related-tab-dot"></span>${t.title}</a>`)
    .join('');
  // Contextual link to this tool's own guide, kept correct on client-side switch.
  const guideLink = document.getElementById('toolGuideLink');
  if (guideLink) {
    const rel = window.WCF_CATALOGUE && window.WCF_CATALOGUE.related && window.WCF_CATALOGUE.related[toolId];
    guideLink.innerHTML = rel && rel.guide
      ? `<a class="font-semibold text-[#1a73e8] hover:underline" href="${rel.guide}">Read the ${state.currentTool.title} guide <span aria-hidden="true">→</span></a>`
      : '';
  }
}

function renderRelatedTools() {
  const container = document.getElementById('relatedToolsContainer');
  if (!container || !state.currentTool) return;

  const currentKicker = state.currentTool.kicker;
  const related = tools.filter(t => t.id !== state.currentTool.id && t.kicker === currentKicker).slice(0, 3);

  if (!related.length) {
    container.innerHTML = '';
    return;
  }

  container.innerHTML = `<span class="text-slate-400 dark:text-slate-500 font-medium mr-1">Related:</span>` + related.map(t => `
    <button onclick="window.location.hash='#${t.id}'" type="button" class="inline-flex items-center gap-1 rounded-full bg-slate-200/70 dark:bg-slate-800 px-2.5 py-1 text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:bg-[#e8f0fe] hover:text-[#1967d2] dark:hover:bg-[#1a73e8]/20 dark:hover:text-blue-300 transition">
      ${t.title}
    </button>
  `).join('');
}

function resetWorkspaceForNewFile() {
  state.files = [];
  state.pendingResult = null;
  document.getElementById('fileInput').value = '';
  document.getElementById('conversionResultPanel')?.classList.add('hidden');
  document.getElementById('conversionProgressContainer')?.classList.add('hidden');
  updateFileList();
  setStatus('');
}




async function handleConvert() {
  if (!state.currentTool) return;
  // Tools migrated to js/tools/<id>.js may expose validate()/convert(); the core
  // dispatcher delegates to them generically instead of per-id branches.
  const activeModule = toolModuleRegistry[state.currentTool.id] || null;
  if (activeModule && typeof activeModule.validate === 'function' && activeModule.validate() === false) return;
  if (!state.files.length) {
  }

  if (state.currentTool.id === 'extract-pages') {
    const pagesVal = document.getElementById('pageRangeInput')?.value?.trim();
    if (!pagesVal) {
      setStatus('Please enter the page numbers to extract (e.g. 1, 3-5).', 'error');
      document.getElementById('pageRangeInput')?.focus();
      return;
    }
  }
  if (state.currentTool.id === 'organize-pdf') {
    const pagesVal = document.getElementById('pageRangeInput')?.value?.trim();
    if (!pagesVal) {
      setStatus('Please enter the new page order (e.g. 3,1,2,4).', 'error');
      document.getElementById('pageRangeInput')?.focus();
      return;
    }
  }

  trackPageSenseEvent('conversion_started');
  document.getElementById('conversionResultPanel')?.classList.add('hidden');
  startProgressAnimation();
  setBusy(true);
  setStatus('Starting conversion...');

  try {
    await ensureToolLibraries(state.currentTool.id);
    if (activeModule && typeof activeModule.convert === 'function') await activeModule.convert();
    if (state.currentTool.id === 'heic-to-jpg') await heicToJpgPng();
    if (state.currentTool.id === 'exif-utility') await removeExif();
    if (state.currentTool.id === 'merge-pdf') await mergePdfs();
    if (state.currentTool.id === 'split-pdf') await splitPdf();
    if (state.currentTool.id === 'remove-pages') await processVisualPdfEdit();
    if (state.currentTool.id === 'extract-pages') await copySelectedPages('extract');
    if (state.currentTool.id === 'organize-pdf') await copySelectedPages('organize');
    if (state.currentTool.id === 'rotate-pdf') await rotatePdf();
    if (state.currentTool.id === 'watermark-pdf') await watermarkPdf();
    if (state.currentTool.id === 'page-numbers') await addPageNumbers();
    if (state.currentTool.id === 'sign-pdf') await signPdf();
    if (state.currentTool.id === 'images-pdf') await convertImagesToPdf();
    if (state.currentTool.id === 'pdf-images') await convertPdfToImagesZip();
    if (state.currentTool.id === 'pdf-jpg') await convertPdfToImagesZip('jpg');
    if (state.currentTool.id === 'csv-convert') await convertCsv();
    if (state.currentTool.id === 'encrypt-pdf') await encryptPdf();
    if (state.currentTool.id === 'decrypt-pdf') await decryptPdf();
    if (state.currentTool.id === 'compress-pdf') await compressPdf();
    if (state.currentTool.id === 'image-scaler') await scaleImage();
    if (state.currentTool.id === 'webp-convert') await convertImagesToWebp();
    if (state.currentTool.id === 'bulk-resize') await bulkResizeImages();
    if (state.currentTool.id === 'color-palette') await extractColorPalette();
    if (state.currentTool.id === 'json-convert') await convertJsonToSpreadsheet();
    if (state.currentTool.id === 'office-pdf') await convertOfficeToPdf();
    if (state.currentTool.id === 'pdf-to-word') await convertPdfToWord();
    if (state.currentTool.id === 'image-cropper') await cropImageAction();
    if (state.currentTool.id === 'favicon-generator') await generateFaviconPackageAction();
    if (state.currentTool.id === 'excel-to-csv') await convertExcel();

    trackPageSenseEvent('conversion_completed');
    setStatus('Done. Your download should begin automatically.', 'success');
  } catch (error) {
    setStatus(error.message || 'Conversion failed. Please try another file.', 'error');
  } finally {
    setBusy(false);
  }
}

renderDashboard();
handleRoute();
window.addEventListener('popstate', handleRoute);

function dismissAdAlert() {
  const banner = document.getElementById('adAlertBanner');
  if (banner) {
    banner.classList.add('hidden');
    localStorage.setItem('adAlertDismissed', 'true');
  }
}

function initAdAlert() {
  if (localStorage.getItem('adAlertDismissed') === 'true') {
    const banner = document.getElementById('adAlertBanner');
    if (banner) banner.classList.add('hidden');
  }
}
initAdAlert();

document.addEventListener('click', event => {
  const routeButton = event.target.closest('[data-route="dashboard"]');
  if (routeButton) {
    history.pushState(null, '', '/');
    handleRoute();
  }

  // Scoped to <button> so this only matches real dashboard tool-card buttons.
  // A plain `[data-tool-id]` selector also matches <html>, which carries a
  // static, build-time data-tool-id on every generated tool page -- letting
  // closest() bubble all the way up and spuriously re-navigate to that page's
  // own original tool on unrelated clicks (e.g. Back to Dashboard, the logo).
  const toolButton = event.target.closest('button[data-tool-id]');
  if (toolButton) {
    const toolId = toolButton.dataset.toolId;
    history.pushState(null, '', `/${toolId}`);
    handleRoute();
  }

  // Intercept local hyperlink clicks to handle SPA routing seamlessly
  const link = event.target.closest('a');
  if (link) {
    const href = link.getAttribute('href');
    if (href) {
      const isRelative = href.startsWith('/') || href.startsWith('index.html') || href.includes('weconvertfiles.com');
      if (isRelative && !href.includes('/assets/') && !href.endsWith('.js') && !href.endsWith('.html')) {
        const cleanPath = href.replace('index.html', '').replace(/https?:\/\/(?:www\.)?weconvertfiles\.com/, '').replace(/^\/|\/$/g, '');
        const targetId = cleanPath.startsWith('#') ? cleanPath.replace('#', '') : cleanPath;
        if (tools.some(t => t.id === targetId) || targetId === '') {
          event.preventDefault();
          history.pushState(null, '', targetId === '' ? '/' : `/${targetId}`);
          handleRoute();
        }
      }
    }
  }

  const removeButton = event.target.closest('[data-remove-index]');
  if (removeButton) {
    state.files.splice(Number(removeButton.dataset.removeIndex), 1);
    updateFileList();
    setStatus('');
  }
});

backButton.addEventListener('click', () => {
  history.pushState(null, '', '/');
  handleRoute();
});
clearButton.addEventListener('click', () => {
  state.files = [];
  fileInput.value = '';
  const jsonArea = document.getElementById('jsonPasteArea');
  if (jsonArea) jsonArea.value = '';
  updateFileList();
  setStatus('');
});

dropZone.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', event => addFiles(event.target.files));

['dragenter', 'dragover'].forEach(eventName => {
  dropZone.addEventListener(eventName, event => {
    event.preventDefault();
    dropZone.classList.add('border-[#1a73e8]', 'bg-[#f5f9ff]');
  });
});

['dragleave', 'drop'].forEach(eventName => {
  dropZone.addEventListener(eventName, event => {
    event.preventDefault();
    dropZone.classList.remove('border-[#1a73e8]', 'bg-[#f5f9ff]');
  });
});

dropZone.addEventListener('drop', event => addFiles(event.dataTransfer.files));

fileList.addEventListener('dragstart', event => {
  const row = event.target.closest('[data-index]');
  if (!row || !['images-pdf', 'merge-pdf'].includes(state.currentTool.id)) return;
  state.dragIndex = Number(row.dataset.index);
  event.dataTransfer.effectAllowed = 'move';
});

fileList.addEventListener('dragover', event => {
  if (!['images-pdf', 'merge-pdf'].includes(state.currentTool.id)) return;
  event.preventDefault();
});

fileList.addEventListener('drop', event => {
  const row = event.target.closest('[data-index]');
  if (!row || state.dragIndex === null || !['images-pdf', 'merge-pdf'].includes(state.currentTool.id)) return;
  const targetIndex = Number(row.dataset.index);
  const [movedFile] = state.files.splice(state.dragIndex, 1);
  state.files.splice(targetIndex, 0, movedFile);
  state.dragIndex = null;
  updateFileList();
});

convertButton.addEventListener('click', handleConvert);
document.addEventListener('click', (event) => {
  if (!event.isTrusted || !(event.target instanceof Element)) return;
  const downloadControl = event.target.closest('[id*="download" i], [data-pagesense-download]');
  if (downloadControl) trackPageSenseEvent('download_clicked');
}, true);
document.getElementById('downloadResultBtn')?.addEventListener('click', executeActualDownload);
document.getElementById('convertAnotherBtn')?.addEventListener('click', resetWorkspaceForNewFile);
