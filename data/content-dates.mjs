// Single source of truth for content publication/update dates (Task 19).
//
// These are explicit, hand-maintained dates — NOT derived from git history — so
// they are stable across builds, fresh clones and rebases. They drive the guide
// Article datePublished/dateModified, the visible "Updated" line on each guide,
// and the sitemap <lastmod>. Bump a guide's "updated" ONLY for a meaningful
// content change, so sitemap lastmod stays a real freshness signal.
//
// `site` supplies the lastmod for non-guide pages (homepage, tools, category and
// convert pages); bump site.updated when those are meaningfully revised.
// validate-content-dates.mjs fails the build if the structured, visible and
// sitemap dates ever disagree with this file.

export const contentDates = {
  site: { published: "2026-07-18", updated: "2026-08-26" },
  guides: {
    "base64-to-image": { published: "2026-07-30", updated: "2026-07-30" },
    "bulk-resize": { published: "2026-07-29", updated: "2026-07-29" },
    "case-converter": { published: "2026-07-18", updated: "2026-08-19" },
    "code-minifier": { published: "2026-07-18", updated: "2026-08-19" },
    "color-palette": { published: "2026-07-18", updated: "2026-08-19" },
    "compress-pdf": { published: "2026-07-29", updated: "2026-07-29" },
    "csv-convert": { published: "2026-07-18", updated: "2026-08-18" },
    "decrypt-pdf": { published: "2026-07-18", updated: "2026-08-18" },
    "diff-checker": { published: "2026-07-18", updated: "2026-08-19" },
    "encrypt-pdf": { published: "2026-07-18", updated: "2026-08-18" },
    "excel-to-csv": { published: "2026-07-29", updated: "2026-07-29" },
    "exif-utility": { published: "2026-07-18", updated: "2026-08-19" },
    "extract-pages": { published: "2026-07-29", updated: "2026-07-29" },
    "favicon-generator": { published: "2026-07-18", updated: "2026-08-19" },
    "hash-generator": { published: "2026-07-18", updated: "2026-08-19" },
    "heic-to-jpg": { published: "2026-07-29", updated: "2026-07-29" },
    "image-cropper": { published: "2026-07-29", updated: "2026-07-29" },
    "image-scaler": { published: "2026-07-18", updated: "2026-08-18" },
    "image-to-base64": { published: "2026-07-30", updated: "2026-07-30" },
    "images-to-pdf": { published: "2026-07-29", updated: "2026-07-29" },
    "json-convert": { published: "2026-07-18", updated: "2026-08-19" },
    "json-formatter": { published: "2026-07-18", updated: "2026-08-18" },
    "json-yaml": { published: "2026-07-30", updated: "2026-08-18" },
    "jwt-decoder": { published: "2026-07-18", updated: "2026-08-19" },
    "markdown-preview": { published: "2026-07-18", updated: "2026-08-18" },
    "merge-pdf": { published: "2026-07-29", updated: "2026-07-29" },
    "office-pdf": { published: "2026-07-29", updated: "2026-07-29" },
    "organize-pdf": { published: "2026-07-18", updated: "2026-08-18" },
    "page-numbers": { published: "2026-07-18", updated: "2026-08-18" },
    "password-generator": { published: "2026-07-31", updated: "2026-08-18" },
    "pdf-to-images": { published: "2026-07-29", updated: "2026-07-29" },
    "pdf-to-jpg": { published: "2026-07-29", updated: "2026-07-29" },
    "pdf-to-word": { published: "2026-07-29", updated: "2026-07-29" },
    "qr-generator": { published: "2026-07-29", updated: "2026-07-29" },
    "regex-tester": { published: "2026-07-18", updated: "2026-08-18" },
    "remove-pages": { published: "2026-07-29", updated: "2026-07-29" },
    "rotate-pdf": { published: "2026-07-18", updated: "2026-08-18" },
    "sign-pdf": { published: "2026-07-29", updated: "2026-07-29" },
    "split-pdf": { published: "2026-07-29", updated: "2026-07-29" },
    "sql-formatter": { published: "2026-07-18", updated: "2026-08-19" },
    "svg-to-image": { published: "2026-07-30", updated: "2026-07-30" },
    "unix-converter": { published: "2026-07-18", updated: "2026-08-19" },
    "url-base64": { published: "2026-07-18", updated: "2026-08-19" },
    "uuid-generator": { published: "2026-07-18", updated: "2026-08-19" },
    "watermark-pdf": { published: "2026-07-18", updated: "2026-08-18" },
    "webp-convert": { published: "2026-07-18", updated: "2026-08-18" },
    "word-counter": { published: "2026-07-29", updated: "2026-07-29" }
  }
};

// ISO date (YYYY-MM-DD) -> a human "D Month YYYY" label for visible dates.
export function formatDate(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  return `${d} ${months[m - 1]} ${y}`;
}
